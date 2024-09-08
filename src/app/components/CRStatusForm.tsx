'use client';

import React, { useState, useMemo } from 'react';

interface CRStatus {
  EIM: string;
  ProjectID: string;
  CR: string;
  Github: string;
  Cyberflow: string;
  SonartypeIQScan: string;
  ICE: number;
}

const initialData: CRStatus[] = [
  { EIM: '24520458723', ProjectID: 'Random1', CR: 'CR-35739583', Github: 'https://hello.com', Cyberflow: 'pass', SonartypeIQScan: 'pass', ICE: 90 },
  { EIM: '38520458729', ProjectID: 'Random2', CR: 'CR-35739582', Github: 'https://hello.com', Cyberflow: 'pass', SonartypeIQScan: 'pass', ICE: 88 },
  { EIM: '56520458753', ProjectID: 'Random3', CR: 'CR-35739581', Github: 'https://hello.com', Cyberflow: 'failed', SonartypeIQScan: 'pass', ICE: 76 },
  { EIM: '24566458721', ProjectID: 'Random4', CR: 'CR-35739580', Github: 'https://hello.com', Cyberflow: 'failed', SonartypeIQScan: 'pass', ICE: 70 },
  { EIM: '94520458456', ProjectID: 'Random5', CR: 'CR-35739579', Github: 'https://hello.com', Cyberflow: 'failed', SonartypeIQScan: 'pass', ICE: 75 },
];

export default function CRStatusForm() {
  const [data] = useState<CRStatus[]>(initialData);
  const [filters, setFilters] = useState<Partial<CRStatus>>({});

  const handleFilterChange = (column: keyof CRStatus, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key as keyof CRStatus];
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  const columns: (keyof CRStatus)[] = ['EIM', 'ProjectID', 'CR', 'Github', 'Cyberflow', 'SonartypeIQScan', 'ICE'];

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">CR Status</h2>
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