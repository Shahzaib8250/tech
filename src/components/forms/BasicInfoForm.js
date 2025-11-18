import React from 'react';
import { RadioGroup, Dropdown } from '../FormComponents';

const BasicInfoForm = ({ data, onChange }) => {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const ageOptions = [
    { value: 'under-18', label: 'Under 18' },
    { value: '18-24', label: '18-24' },
    { value: '25-28', label: '25-28' },
    { value: '29-32', label: '29-32' },
    { value: '33-36', label: '33-36' },
    { value: 'above-36', label: 'Above 36' }
  ];

  const provinceOptions = [
    { value: 'punjab', label: 'Punjab' },
    { value: 'sindh', label: 'Sindh' },
    { value: 'kpk', label: 'Khyber PakhtunKhwa (KPK)' },
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'balochistan', label: 'Balochistan' },
    { value: 'gilgit-baltistan', label: 'Gilgit-Baltistan' }
  ];

  return (
    <div className="basic-info-form">
      <RadioGroup
        label="Gender"
        name="gender"
        options={genderOptions}
        value={data.gender}
        onChange={onChange}
        required={true}
      />

      <Dropdown
        label="Age"
        name="age"
        options={ageOptions}
        value={data.age}
        onChange={onChange}
        placeholder="Select your age"
        required={true}
      />

      <Dropdown
        label="Province"
        name="province"
        options={provinceOptions}
        value={data.province}
        onChange={onChange}
        placeholder="Select your province"
        required={true}
      />
    </div>
  );
};

export default BasicInfoForm;

