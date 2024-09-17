import React from 'react';
import { WorkflowStep } from '../interfaces/interfaces';

interface SidebarProps {
  selectedStep: WorkflowStep | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedStep }) => {
  if (!selectedStep) return <div className="w-1/4 p-4 border-l border-gray-300">Select a step to configure</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`Updated ${e.target.name} to ${e.target.value}`);
    // Update the selected step's configuration based on user input
  };

  return (
    <div className="w-1/4 p-4 border-l border-gray-300">
      <h3 className="text-xl font-bold mb-4">Configure {selectedStep.type}</h3>
      <div>
        <label className="block mb-2">Step ID:</label>
        <input type="text" value={selectedStep.id} className="mb-4 p-2 border border-gray-300 w-full" disabled />
      </div>
      {Object.entries(selectedStep.config).map(([key, value]) => (
        <div key={key} className="mb-4">
          <label className="block mb-2">{key}:</label>
          <input
            type="text"
            name={key}
            value={value}
            className="p-2 border border-gray-300 w-full"
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};