'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel';
import { DateTimePicker } from '~/components/date-picker';
import { CalendarEventStatusSelect } from '~/components/CalendarEventStatusSelect';
import type { CalendarEventStatus } from '~/server/db/types';

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

// Custom hook to handle carousel API
function useCarouselApi() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleApiChange = useCallback((newApi: CarouselApi) => {
    setApi(newApi);
  }, []);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    updateCurrent();
    api.on('select', updateCurrent);

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  return { api, current, setApi: handleApiChange };
}

export default function CalendarCompanion({
  userId,
  supplements,
  onEventChange,
}: CalendarCompanionProps) {
  const { api, current, setApi } = useCarouselApi();

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

  // Flatten supplements for carousel
  const supplementList: {
    schoolName: string;
    supplement: supplement;
  }[] = Object.values(supplements).flatMap((school) =>
    school.supplements.map((supplement) => ({
      schoolName: school.school_name,
      supplement,
    })),
  );

  const totalSupplements = supplementList.length;
  const activeSupplement = supplementList[current];

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

      <Carousel
        opts={{ align: 'center', loop: true }}
        setApi={setApi}
        className="w-full max-w-xl mx-auto mb-8"
      >
        <CarouselContent>
          {supplementList.map(({ schoolName, supplement }) => (
            <CarouselItem key={supplement.supplement_id} className="p-1">
              <Card>
                <CardHeader>
                  <div className="font-bold">{schoolName}</div>
                  <div className="text-lg">{supplement.supplement_prompt}</div>
                  <div className="text-sm text-muted-foreground">
                    {supplement.supplement_description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Word Count: {supplement.supplement_word_count}
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {activeSupplement && (
        <SupplementEventForm
          key={activeSupplement.supplement.supplement_id}
          userId={userId}
          schoolName={activeSupplement.schoolName}
          supplement={activeSupplement.supplement}
          onEventCreated={onEventChange}
        />
      )}
    </div>
  );
}

type SupplementEventFormProps = {
  userId: number;
  schoolName: string;
  supplement: supplement;
  onEventCreated: Function;
};

function SupplementEventForm({
  userId,
  supplement,
  schoolName,
  onEventCreated,
}: SupplementEventFormProps) {
  const initialDescription =
    `Prompt: ${supplement.supplement_prompt}\n\n` +
    `Description: ${supplement.supplement_description}\n\n` +
    `Word Count: ${supplement.supplement_word_count}\n`;

  const initialTitle = `${schoolName} Supplement`;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [start, setStart] = useState<Date>(() => new Date());
  const [end, setEnd] = useState<Date>(() => new Date());
  const [status, setStatus] = useState<CalendarEventStatus>('Planned 📋');

  const createEvent = api.calendar_events.create_or_update.useMutation({
    onSuccess: () => {
      onEventCreated?.();
      setTitle('');
      setDescription('');
      setStart(new Date());
      setEnd(new Date());
      setStatus('Planned 📋');
      toast.success('Event created successfully');
    },
  });

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <div className="text-xl font-semibold">Create Calendar Event</div>
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
          <DateTimePicker
            id={`start-${supplement.supplement_id}`}
            value={start}
            onChange={setStart}
            dateLabel="Start Date"
            timeLabel="Time"
          />
        </div>
        <div className="mb-4">
          <DateTimePicker
            id={`end-${supplement.supplement_id}`}
            value={end}
            onChange={setEnd}
            dateLabel="End Date"
            timeLabel="Time"
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
            value={description}
            rows={initialDescription.split('\n').length}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 w-fit mb-4">
          <Label>Event Status</Label>
          <CalendarEventStatusSelect value={status} onChange={setStatus} />
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
              status,
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
