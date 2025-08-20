'use client';
import { Button } from '~/components/ui/button';
import { useUserStore } from '~/stores/useUserStore';
import { useEffect, useState } from 'react';
// import { api } from '~/trpc/react';

export default function ProfileClient() {
  const user = useUserStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   const utils = api.useUtils();
  const REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';

  const GOOGLE_OAUTH_URL =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    `client_id=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(
      'https://www.googleapis.com/auth/calendar.events',
    )}` +
    `&access_type=offline` +
    `&prompt=consent`;

  const handleConnect = () => {
    setIsLoading(true);
    console.log('GOOGLE_OAUTH_URL', GOOGLE_OAUTH_URL);
    window.location.href = GOOGLE_OAUTH_URL;
  };

  useEffect(() => {
    // Check for success/error messages from the OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const errorParam = urlParams.get('error');

    if (success === 'true') {
      setIsConnected(true);
      setError(null);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setIsConnected(false);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700">Connecting to Google Calendar...</p>
        </div>
      )}

      {isConnected && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">
            Successfully connected to Google Calendar!
          </p>
        </div>
      )}

      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading
          ? 'Connecting...'
          : isConnected
            ? 'Reconnect Google Calendars'
            : 'Connect Google Calendars'}
      </Button>
    </div>
  );
}
