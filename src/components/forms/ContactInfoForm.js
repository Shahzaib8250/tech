import React from 'react';
import { TextInput } from '../FormComponents';

const ContactInfoForm = ({ data, onChange }) => {
  return (
    <div className="contact-info-form contact-number-form">
      <div className="contact-info-card">
        <div className="contact-info-header">
          <h3>Thank you for your valuable feedback!</h3>
          <p>Your feedback helps us improve our products and serve you better.</p>
          <p>
            If you'd like to stay connected and receive exclusive offers, gifts, and future updates,
            please share your contact number with us.
          </p>
        </div>

        <TextInput
          label="Contact Number"
          name="contactNumber"
          value={data.contactNumber || ''}
          onChange={onChange}
          placeholder="Enter your contact number"
          required={true}
          type="tel"
        />
      </div>
    </div>
  );
};

export default ContactInfoForm;
