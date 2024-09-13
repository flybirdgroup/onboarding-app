'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface ProjectView {
  EIM: string;
  ProjectID: string;
  CR: string;
  Github: string;
  Cyberflow: string;
  SonartypeIQScan: string;
  ICE: number;
}

export default function ProjectViewForm() {
  const [data, setData] = useState<ProjectView[]>([]);
  const [filters, setFilters] = useState<Partial<ProjectView>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/project-status');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const columns: (keyof ProjectView)[] = ['EIM', 'ProjectID', 'CR', 'Github', 'Cyberflow', 'SonartypeIQScan', 'ICE'];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
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
                  {column === 'Github' ? (
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