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

interface MultiComboboxProps {
  options: { id: string; name: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  buttonText?: string;
  concise?: boolean;
  doesCreate?: boolean;
  handleCreate?: (value: string) => void;
}

export function MultiCombobox({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options...',
  emptyText = 'No options found.',
  buttonText = 'Select options...',
  concise = true,
  doesCreate = false,
  handleCreate,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleSelect = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const handleCreateNew = () => {
    if (handleCreate && inputValue.trim()) {
      handleCreate(inputValue.trim());
      setInputValue('');
      setOpen(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const hasExactMatch = options.some(
    (option) => option.name.toLowerCase() === inputValue.toLowerCase(),
  );

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
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          {doesCreate &&
          inputValue.trim() &&
          !hasExactMatch &&
          filteredOptions.length === 0 ? (
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm"
                onClick={handleCreateNew}
              >
                <Plus className="mr-2 h-1 w-1" />
                Add "{inputValue.trim()}"
              </Button>
            </div>
          ) : (
            <CommandEmpty>{emptyText}</CommandEmpty>
          )}
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.id}
                value={option.name}
                onSelect={() => handleSelect(option.name)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValues.includes(option.name)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface SingleComboboxProps {
  options: { id: string; name: string }[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  buttonText?: string;
  doesCreate?: boolean;
  handleCreate?: (value: string) => void;
}

export function SingleCombobox({
  options,
  selectedValue,
  onSelectionChange,
  placeholder = 'Select option...',
  emptyText = 'No options found.',
  buttonText = 'Select option...',
  doesCreate = false,
  handleCreate,
}: SingleComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleSelect = (value: string) => {
    const newSelection = selectedValue === value ? '' : value;
    onSelectionChange(newSelection);
    setOpen(false);
  };

  const handleCreateNew = () => {
    if (handleCreate && inputValue.trim()) {
      handleCreate(inputValue.trim());
      onSelectionChange(inputValue.trim());
      setInputValue('');
      setOpen(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const hasExactMatch = options.some(
    (option) => option.name.toLowerCase() === inputValue.toLowerCase(),
  );

  const getDisplayText = () => {
    if (!selectedValue) {
      return buttonText.replace('+ ', '');
    }
    return selectedValue;
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
              {selectedValue ? <></> : <Plus className="h-4 w-4" />}
              <span>{getDisplayText()}</span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
          />
          {doesCreate &&
          inputValue.trim() &&
          !hasExactMatch &&
          filteredOptions.length === 0 ? (
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm"
                onClick={handleCreateNew}
              >
                <Plus className="mr-2 h-1 w-1" />
                Add "{inputValue.trim()}"
              </Button>
            </div>
          ) : (
            <CommandEmpty>{emptyText}</CommandEmpty>
          )}
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.id}
                value={option.name}
                onSelect={() => handleSelect(option.name)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedValue === option.name ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
