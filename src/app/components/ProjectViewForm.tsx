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

export default function ProjectViewForm() {
  const [data, setData] = useState<ProjectView[]>([]);
  const [filters, setFilters] = useState<Partial<ProjectView>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/project-status');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      console.log('Fetched data:', result); // Log fetched data to check structure
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

  const handleCreate = async (project: ProjectView) => {
    try {
      const response = await fetch('/api/project-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (response.ok) {
        await fetchData(); // Re-fetch the data to get the updated list
      } else {
        throw new Error('Failed to create data');
      }
    } catch (err) {
      console.error('Error creating data:', err);
    }
  };

  const handleFilterChange = (column: keyof ProjectView, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key as keyof ProjectView];
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  const columns: (keyof ProjectView)[] = ['eim', 'projectid', 'cr', 'github', 'cyberflow', 'sonartypeiqscan', 'ice'];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Overview</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded">
          Create
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreate} />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map(column => (
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
              {columns.map(column => (
                <td key={column} className="border p-2">
                  {column === 'github' ? (
                    <a href={item[column]} className="text-blue-500 hover:underline">{item[column]}</a>
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
}