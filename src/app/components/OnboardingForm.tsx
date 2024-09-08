'use client';

import { useState } from 'react';

export default function OnboardingForm() {
  const [formData, setFormData] = useState({
    githubRepoUrl: '',
    eim: '',
    sonartypeIqScan: '',
    cyberflow: '',
    notificationEmail: '',
    xMatterAlert: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement API call to submit data
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
          <label htmlFor={key} className="block mb-2 font-medium">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
          </label>
          <input
            type={key === 'notificationEmail' ? 'email' : 'text'}
            id={key}
            name={key}
            value={value}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
      ))}
      <button 
        type="submit" 
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}