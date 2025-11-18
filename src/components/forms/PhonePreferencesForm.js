import React from 'react';
import { DropdownWithOther } from '../FormComponents';
import ColorPicker from '../ColorPicker';

const PhonePreferencesForm = ({ data, onChange }) => {
  const phoneBudget = [
    { value: '20-30k', label: '20,000-30,000' },
    { value: '31-45k', label: '31,000–45,000' },
    { value: '46-60k', label: '46,000–60,000' },
    { value: '61-80k', label: '61,000-80,000' },
    { value: '81-100k', label: '81,000–100,000' },
    { value: 'above-100k', label: 'Above 100,000' }
  ];

  const primaryColorOptions = [
    { value: 'moonshadow-black', label: 'Moonshadow Black', colorCode: '#3A3A3A' },
    { value: 'malachine-green', label: 'Malachine Green', colorCode: '#39B59A' },
    { value: 'nebula-titanium', label: 'Nebula Titanium', colorCode: '#B8B1A6' },
    { value: 'fir-green', label: 'Fir Green', colorCode: '#4A5742' },
    { value: 'lavender-mist', label: 'Lavender Mist', colorCode: '#C9B8E4' },
    { value: 'cream-mint', label: 'Cream Mint', colorCode: '#DDE7C8' }
  ];

  const secondaryColorOptions = [
    { value: 'moonshadow-black-2', label: 'Moonshadow Black', colorCode: '#3A3A3A' },
    { value: 'malachine-green-2', label: 'Malachine Green', colorCode: '#2BA58C' },
    { value: 'nebula-titanium-2', label: 'Nebula Titanium', colorCode: '#B1A999' },
    { value: 'fir-green-2', label: 'Fir Green', colorCode: '#3F4B39' },
    { value: 'lavender-mist-2', label: 'Lavender Mist', colorCode: '#BFA7DB' },
    { value: 'ethereal-blue', label: 'Ethereal Blue', colorCode: '#C5D6F2' }
  ];

  return (
    <div className="phone-preferences-form">
      <DropdownWithOther
        label="If you plan to buy a new phone in the next year, what's your budget? (PKR)"
        name="phoneBudget"
        options={phoneBudget}
        value={data.phoneBudget}
        onChange={onChange}
        placeholder="Select your budget range"
        required={true}
      />

      <ColorPicker
        label="From the following colors, which one would you like for the new phone? (Select all you like.)"
        name="preferredPhoneColors"
        options={primaryColorOptions}
        values={data.preferredPhoneColors || []}
        columns={3}
        onChange={onChange}
      />

      <ColorPicker
        label="And from the next set of colors, which ones do you like for the new phone? (Select all you like.)"
        name="preferredPhoneColorsSecondary"
        options={secondaryColorOptions}
        values={data.preferredPhoneColorsSecondary || []}
        columns={3}
        onChange={onChange}
      />
    </div>
  );
};

export default PhonePreferencesForm;
