import React, { useState, useEffect, useMemo } from 'react';

interface DeploymentStatus {
  EIM: string;
  Github: string;
  PR: string;
  ScanCategory: string;
  Link: string;
  Score: number;
}

const DeploymentForm = () => {
  const [data, setData] = useState<DeploymentStatus[]>([]);
  const [filters, setFilters] = useState<Partial<DeploymentStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/deployment-status');
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

  const handleFilterChange = (column: keyof DeploymentStatus, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key as keyof DeploymentStatus];
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  const columns: (keyof DeploymentStatus)[] = ['EIM', 'Github', 'PR', 'ScanCategory', 'Link', 'Score'];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Deployment Status</h2>
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
                  {column === 'Link' ? (
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
};

export default DeploymentForm;