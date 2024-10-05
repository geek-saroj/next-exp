// MyCreatableSelect.tsx
"use client";
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

// Define the shape of the option
interface OptionType {
  value: string;
  label: string;
}

// Initial options
const initialOptions: OptionType[] = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const MyCreatableSelect: React.FC = () => {
  const [options, setOptions] = useState<OptionType[]>(initialOptions);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleChange = (selected: OptionType | null) => {
    setSelectedOption(selected);
  };

  const handleCreate = (inputValue: string) => {
    const newOption: OptionType = { value: inputValue, label: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setSelectedOption(newOption);
  };

  return (
    <div>
      <CreatableSelect
        isClearable
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={options}
        value={selectedOption}
      />
    </div>
  );
};

export default MyCreatableSelect;
