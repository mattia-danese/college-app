'use client';

import React from 'react';
import { cn } from '~/lib/utils';

type CircularProgressProps = {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number; // px
  className?: string;
  showLabel?: boolean;
};

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  className,
  showLabel = true,
}: CircularProgressProps) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-medium text-foreground">
          {Math.round(normalized)}%
        </span>
      )}
    </div>
  );
}
