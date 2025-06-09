'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { api } from '~/trpc/react';

type supplement = {
  supplement_id: number;
  supplement_prompt: string;
  supplement_description: string;
  supplement_word_count: string;
};

type CalendarCompanionProps = {
  userId: number;
  supplements: Record<
    number,
    {
      school_id: number;
      school_name: string;

      supplements: supplement[];

      deadlines: {
        deadline_id: number;
        deadline_application_type: string;
        deadline_date: Date;
      }[];
    }
  >;
  onEventChange: Function;
};

type SupplementCardProps = {
  userId: number;
  schoolName: string;
  supplement: supplement;
  onEventCreated: Function;
};

export default function CalendarCompanion({
  userId,
  supplements,
  onEventChange,
}: CalendarCompanionProps) {
  const isEmpty =
    !supplements ||
    Object.keys(supplements).length === 0 ||
    Object.values(supplements).every((school) => !school.supplements.length);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-2xl font-semibold mb-2">You are all set!</div>
        <div className="text-muted-foreground">
          All school supplements have a calendar event.
        </div>
      </div>
    );
  }

  const totalSupplements = Object.values(supplements).reduce(
    (sum, school) => sum + school.supplements.length,
    0,
  );

  return (
    <div>
      <div className="mb-4 flex flex-col items-center">
        <div className="text-lg font-semibold">
          {totalSupplements === 1
            ? '1 supplement does not have a calendar event'
            : `${totalSupplements} supplements do not have calendar events`}
        </div>
        <div className="text-muted-foreground text-sm">
          Create events for these supplements to keep your calendar up to date!
        </div>
      </div>
      <div className="grid gap-4">
        {Object.values(supplements).flatMap((school) =>
          school.supplements.map((supplement) => (
            <SupplementCard
              key={supplement.supplement_id}
              userId={userId}
              supplement={supplement}
              schoolName={school.school_name}
              onEventCreated={onEventChange}
            />
          )),
        )}
      </div>
    </div>
  );
}

function SupplementCard({
  userId,
  supplement,
  schoolName,
  onEventCreated,
}: SupplementCardProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState<Date>(() => new Date());
  const [end, setEnd] = useState<Date>(() => new Date());

  const createEvent = api.calendar_events.create.useMutation({
    onSuccess: () => {
      onEventCreated?.();
    },
  });

  const textAreaPlaceHolder =
    `Prompt: ${supplement.supplement_prompt}\n\n` +
    `Description: ${supplement.supplement_description}\n\n` +
    `Word Count: ${supplement.supplement_word_count}\n`;
  return (
    <Card>
      <CardHeader>
        <div className="font-bold">{schoolName}</div>
        <div className="text-lg">{supplement.supplement_prompt}</div>
        <div className="text-sm text-muted-foreground">
          {supplement.supplement_description}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label
            htmlFor={`event-title-${supplement.supplement_id}`}
            className="mb-1 block"
          >
            Event Title
          </Label>
          <Input
            id={`event-title-${supplement.supplement_id}`}
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor={`start-${supplement.supplement_id}`}
            className="mb-1 block"
          >
            Start Date & Time
          </Label>
          <Input
            id={`start-${supplement.supplement_id}`}
            type="datetime-local"
            value={start.toISOString().slice(0, 16)}
            onChange={(e) => setStart(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor={`end-${supplement.supplement_id}`}
            className="mb-1 block"
          >
            End Date & Time
          </Label>
          <Input
            id={`end-${supplement.supplement_id}`}
            type="datetime-local"
            value={end.toISOString().slice(0, 16)}
            onChange={(e) => setEnd(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor={`desc-${supplement.supplement_id}`}
            className="mb-1 block"
          >
            Event Description
          </Label>
          <Textarea
            id={`desc-${supplement.supplement_id}`}
            defaultValue={textAreaPlaceHolder}
            rows={textAreaPlaceHolder.split('\n').length}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button
          onClick={() =>
            createEvent.mutate({
              user_id: userId,
              supplement_id: supplement.supplement_id,
              deadline_id: null,
              title,
              description,
              start: start!,
              end: end!,
            })
          }
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? 'Creating...' : 'Create Event'}
        </Button>
      </CardContent>
    </Card>
  );
}
