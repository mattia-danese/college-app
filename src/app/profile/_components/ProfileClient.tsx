'use client';
import { Button } from '~/components/ui/button';
import { useUserStore } from '~/stores/useUserStore';
import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '~/components/ui/sidebar';
import {
  User,
  Bell,
  Calendar,
  Download,
  MessageSquare,
  Mail,
  LogOut,
  GraduationCap,
  Send,
} from 'lucide-react';

import Profile from './Profile';
import NotificationPreferences from './NotificationPreferences';
import CalendarIntegrations from './CalendarIntegrations';
import ExportData from './ExportData';
import FeatureForum from './FeatureForum';
import RequestSchool from './RequestSchool';
import ContactUs from './ContactUs';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

// Your Profile
// - switch accounts
// - delete account
// Notifications
// - what kind
// - frequency
// Integrations
// - Google Calendar
// - Others not supported -> download calendar .ics file
// Data Management
// - export data (CSV, JSON)
// - your lists (simple create/delete/rename)
// Community Forum
// - feature requests
// - feedback
// - bug reports
// Contact Us
// - Privacy Policy
// - Terms of Service
// Logout
// - footer

export default function ProfileClient() {
  const user = useUserStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('account');

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

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <Profile />;

      case 'notifications':
        return <NotificationPreferences />;

      case 'calendar-integrations':
        return <CalendarIntegrations />;

      case 'export-data':
        return <ExportData />;

      case 'feature-forum':
        return <FeatureForum />;

      case 'request-school':
        return <RequestSchool />;

      case 'contact-us':
        return <ContactUs />;

      case 'terms-of-service':
        return <TermsOfService />;

      case 'privacy-policy':
        return <PrivacyPolicy />;

      default:
        return <Profile />;
    }
  };

  return (
    <SidebarProvider
      className="min-h-0 h-[calc(100svh-4rem-1px)] overflow-hidden profile-settings"
      style={{ minHeight: 0, height: 'calc(100svh - 4rem - 1px)' }}
    >
      <div className="flex h-full overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <h2 className="text-lg font-semibold px-2">Settings</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Account Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'profile'}
                      onClick={() => setActiveSection('profile')}
                      tooltip="Your Profile"
                    >
                      <User />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'notifications'}
                      onClick={() => setActiveSection('notifications')}
                      tooltip="Notification Preferences"
                    >
                      <Bell />
                      <span>Notification Preferences</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'calendar-integrations'}
                      onClick={() => setActiveSection('calendar-integrations')}
                      tooltip="Calendar Integrations"
                    >
                      <Calendar />
                      <span>Calendar Integrations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="flex justify-center py-1">
              <div className="h-px w-[240px] bg-border" />
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Data Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'export-data'}
                      onClick={() => setActiveSection('export-data')}
                      tooltip="Export Your Data"
                    >
                      <Download />
                      <span>Export Your Data</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="flex justify-center py-1">
              <div className="h-px w-[240px] bg-border" />
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Community Feedback</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'feature-forum'}
                      onClick={() => setActiveSection('feature-forum')}
                      tooltip="Feature Forum"
                    >
                      <MessageSquare />
                      <span>Feature Forum</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'request-school'}
                      onClick={() => setActiveSection('request-school')}
                      tooltip="Request a School"
                    >
                      <GraduationCap />
                      <span>Request a School</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="flex justify-center py-1">
              <div className="h-px w-[240px] bg-border" />
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>About Us</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'contact-us'}
                      onClick={() => setActiveSection('contact-us')}
                      tooltip="Contact Us"
                    >
                      <Send />
                      <span>Contact Us</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'terms-of-service'}
                      onClick={() => setActiveSection('terms-of-service')}
                      tooltip="Terms of Service"
                    >
                      <Mail />
                      <span>Terms of Service</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === 'privacy-policy'}
                      onClick={() => setActiveSection('privacy-policy')}
                      tooltip="Privacy Policy"
                    >
                      <Mail />
                      <span>Privacy Policy</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton variant="outline" tooltip="Logout">
                      <LogOut />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-6">{renderContent()}</div>
          </div>
        </SidebarInset>
        <style jsx global>{`
          .profile-settings [data-slot='sidebar-container'] {
            top: 4rem;
            bottom: 0;
            height: calc(100svh - 4rem - 1px);
          }
        `}</style>
      </div>
    </SidebarProvider>
  );
}
