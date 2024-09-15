import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formInputs, setFormInputs] = useState({
    EIM: '',
    PR: '',
    ProjectID: '',
    CR: '',
    Github: '',
    Cyberflow: '',
    SonartypeIQScan: '',
    ICE: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formInputs);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Create New Project Status</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formInputs).map((key) => (
            <div key={key} className="mb-2">
              <label htmlFor={key} className="block text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type={key === 'ICE' ? 'number' : 'text'}
                id={key}
                name={key}
                value={(formInputs as any)[key]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;