import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { env } from '~/env';
import { decrypt, encrypt } from '~/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, start, end } = body;

    if (!title || !start || !end) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start, end' },
        { status: 400 },
      );
    }

    // Get user's Google tokens from database
    const ctx = await createTRPCContext({ headers: request.headers });
    const caller = createCaller(ctx);

    const user = await caller.users.get_by_clerk_id({ clerk_id: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.googleCalendarAccessToken) {
      return NextResponse.json({
        success: true,
        googleCalendarConnected: false,
        message: 'Google Calendar not connected',
      });
    }

    // Check if token is expired and refresh if needed
    let accessToken = decrypt(user.googleCalendarAccessToken);

    if (
      user.googleCalendarTokenExpires &&
      new Date() > user.googleCalendarTokenExpires
    ) {
      if (!user.googleCalendarRefreshToken) {
        return NextResponse.json({
          success: true,
          googleCalendarConnected: false,
          message:
            'Google Calendar token expired and no refresh token available',
        });
      }

      // Refresh the token
      const refreshResponse = await fetch(
        'https://oauth2.googleapis.com/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            refresh_token: decrypt(user.googleCalendarRefreshToken),
            grant_type: 'refresh_token',
          }),
        },
      );

      if (!refreshResponse.ok) {
        return NextResponse.json({
          success: true,
          googleCalendarConnected: false,
          message: 'Failed to refresh Google token',
        });
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      // Update the stored tokens (encrypt the new access token)
      await caller.users.update({
        clerk_id: userId,
        data: {
          googleCalendarAccessToken: encrypt(accessToken),
          googleCalendarTokenExpires: new Date(
            Date.now() + refreshData.expires_in * 1000,
          ),
        },
      });
    }

    // Create event in Google Calendar
    const googleEvent = {
      summary: title,
      description: description || '',
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const calendarResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleEvent),
      },
    );

    if (!calendarResponse.ok) {
      const errorData = await calendarResponse.text();
      console.error('Google Calendar API error:', errorData);
      return NextResponse.json({
        success: true,
        googleCalendarConnected: false,
        message: 'Failed to create Google Calendar event',
      });
    }

    const createdEvent = await calendarResponse.json();

    return NextResponse.json({
      success: true,
      googleCalendarConnected: true,
      googleEventId: createdEvent.id,
      event: createdEvent,
    });
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return NextResponse.json({
      success: true,
      googleCalendarConnected: false,
      message: 'Internal server error',
    });
  }
}
