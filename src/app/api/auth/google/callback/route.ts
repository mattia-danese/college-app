import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { env } from '~/env';
import { createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { encrypt } from '~/lib/encryption';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/profile?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/profile?error=No authorization code received', request.url),
    );
  }

  // Get the authenticated user
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(
      new URL('/profile?error=User not authenticated', request.url),
    );
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL(
          '/profile?error=Failed to exchange authorization code',
          request.url,
        ),
      );
    }

    const { access_token, refresh_token, expires_in } =
      await tokenResponse.json();

    // Calculate token expiration date
    const tokenExpires = new Date(Date.now() + expires_in * 1000);

    // Store encrypted tokens in database using tRPC
    const ctx = await createTRPCContext({ headers: request.headers });
    const caller = createCaller(ctx);

    await caller.users.update({
      clerk_id: userId,
      data: {
        googleCalendarAccessToken: encrypt(access_token),
        googleCalendarRefreshToken: encrypt(refresh_token),
        googleCalendarTokenExpires: tokenExpires,
      },
    });

    // Redirect with success
    return NextResponse.redirect(new URL('/profile?success=true', request.url));
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.redirect(
      new URL('/profile?error=Internal server error', request.url),
    );
  }
}
