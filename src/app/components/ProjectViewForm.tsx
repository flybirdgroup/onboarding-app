'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal';

interface ProjectView {
  eim: string; // Assuming PostgreSQL column names are lower-case
  pr: string;
  projectid: string;
  cr: string;
  github: string;
  cyberflow: string;
  sonartypeiqscan: string;
  ice: number;
}

const ProjectViewForm = () => {
  const [data, setData] = useState<ProjectView[]>([]);
  const [filters, setFilters] = useState<Partial<ProjectView>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<ProjectView> | null>(null);
  const [selectedEIM, setSelectedEIM] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/project-status');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      console.log('Fetched data:', result); // Log fetched data for debugging
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (project: ProjectView) => {
    try {
      const method = currentProject ? 'PUT' : 'POST';
      const url = currentProject ? `/api/project-status/${currentProject.eim}` : '/api/project-status';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        await fetchData(); // Re-fetch the data to get the updated list
        setCurrentProject(null);
      } else {
        throw new Error('Failed to create/update data');
      }
    } catch (err) {
      console.error('Error creating/updating data:', err);
    }
  };

  const handleFilterChange = (column: keyof ProjectView, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key as keyof ProjectView];
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  const handleEditButtonClick = () => {
    if (selectedEIM) {
      const project = data.find((item) => item.eim === selectedEIM);
      if (project) {
        setCurrentProject(project);
        setIsModalOpen(true);
      }
    }
  };

  const handleSelect = (eim: string) => {
    setSelectedEIM(eim);
  };

  const columns: (keyof ProjectView)[] = ['eim', 'projectid', 'cr', 'github', 'cyberflow', 'sonartypeiqscan', 'ice'];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Overview</h2>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded">
            Create
          </button>
          <button
            onClick={handleEditButtonClick}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!selectedEIM}
          >
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateOrUpdate} project={currentProject} />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2"></th> {/* For selection radio button */}
            {columns.map((column) => (
              <th key={column} className="border p-2">
                {column}
                <input
                  type="text"
                  placeholder={`Filter ${column}`}
                  value={filters[column] || ''}
                  onChange={(e) => handleFilterChange(column, e.target.value)}
                  className="block w-full mt-1 text-sm border-gray-300 rounded-md"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  type="radio"
                  name="selectedProject"
                  value={item.eim}
                  checked={selectedEIM === item.eim}
                  onChange={() => handleSelect(item.eim)}
                />
              </td>
              {columns.map((column) => (
                <td key={column} className="border p-2">
                  {column === 'github' ? (
                    <a href={item[column]} className="text-blue-500 hover:underline">
                      {item[column]}
                    </a>
                  ) : (
                    item[column]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectViewForm;