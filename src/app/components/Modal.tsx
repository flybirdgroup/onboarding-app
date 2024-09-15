import React, { useState, useEffect } from 'react';

interface ProjectView {
  eim: string;
  pr: string;
  projectid: string;
  cr: string;
  github: string;
  cyberflow: string;
  sonartypeiqscan: string;
  ice: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectView) => void;
  project: Partial<ProjectView> | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const [formInputs, setFormInputs] = useState<ProjectView>({
    eim: '',
    pr: '',
    projectid: '',
    cr: '',
    github: '',
    cyberflow: '',
    sonartypeiqscan: '',
    ice: 0,
  });

  useEffect(() => {
    if (project) {
      setFormInputs({ ...formInputs, ...project });
    } else {
      setFormInputs({
        eim: '',
        pr: '',
        projectid: '',
        cr: '',
        github: '',
        cyberflow: '',
        sonartypeiqscan: '',
        ice: 0,
      });
    }
  }, [project]);

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
        <h2 className="text-xl font-bold mb-4">{project ? 'Edit Project Status' : 'Create New Project Status'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="eim" className="block text-sm font-medium">EIM:</label>
            <input
              type="text"
              id="eim"
              name="eim"
              value={formInputs.eim}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={!!project} // Disable this field when editing
            />
          </div>
          <div className="mb-2">
            <label htmlFor="pr" className="block text-sm font-medium">PR:</label>
            <input
              type="text"
              id="pr"
              name="pr"
              value={formInputs.pr}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="projectid" className="block text-sm font-medium">Project ID:</label>
            <input
              type="text"
              id="projectid"
              name="projectid"
              value={formInputs.projectid}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="cr" className="block text-sm font-medium">CR:</label>
            <input
              type="text"
              id="cr"
              name="cr"
              value={formInputs.cr}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="github" className="block text-sm font-medium">Github:</label>
            <input
              type="text"
              id="github"
              name="github"
              value={formInputs.github}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="cyberflow" className="block text-sm font-medium">Cyberflow:</label>
            <input
              type="text"
              id="cyberflow"
              name="cyberflow"
              value={formInputs.cyberflow}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="sonartypeiqscan" className="block text-sm font-medium">Sonatype IQ Scan:</label>
            <input
              type="text"
              id="sonartypeiqscan"
              name="sonartypeiqscan"
              value={formInputs.sonartypeiqscan}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="ice" className="block text-sm font-medium">ICE:</label>
            <input
              type="number"
              id="ice"
              name="ice"
              value={formInputs.ice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded" type="button">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;