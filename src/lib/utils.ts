import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APPLICATION_TYPE_ORDER = ['RD', 'EA', 'ED', 'ED2'] as const;

export function sortApplicationTypes<T extends { application_type: string }>(
  items: T[],
): T[] {
  return items.sort((a, b) => {
    return (
      APPLICATION_TYPE_ORDER.indexOf(a.application_type as any) -
      APPLICATION_TYPE_ORDER.indexOf(b.application_type as any)
    );
  });
}
