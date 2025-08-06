'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

interface ComboboxProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  buttonText?: string;
  concise?: boolean;
}

export function MultiCombobox({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options...',
  emptyText = 'No options found.',
  buttonText = 'Select options...',
  concise = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>{buttonText.replace('+ ', '')}</span>
            </div>
            {selectedValues.length > 0 && (
              <div className="flex items-center gap-1">
                {concise && selectedValues.length > 2 ? (
                  <Badge variant="secondary" className="text-xs">
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  selectedValues.map((value) => (
                    <Badge key={value} variant="secondary" className="text-xs">
                      {value}
                    </Badge>
                  ))
                )}
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValues.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
