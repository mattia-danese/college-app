export type CalendarEventStatus =
  | 'not_planned'
  | 'planned'
  | 'in_progress'
  | 'completed';

export const calendarEventStatusOptions: CalendarEventStatus[] = [
  'not_planned',
  'planned',
  'in_progress',
  'completed',
];

// Mapping for display purposes
export const statusDisplayMap: Record<CalendarEventStatus, string> = {
  not_planned: 'Not Planned ⏰',
  planned: 'Planned 📋',
  in_progress: 'In Progress 🔄',
  completed: 'Completed ✅',
};
