// src/Components/SampleCSVDisplay.js

import React from 'react';
import sampleCSV from './samplecsv';
import { FaDownload } from 'react-icons/fa';

const SampleCSVDisplay = () => {
  // Parse the CSV string into headers and a sample row
  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0]
      .split(',')
      .map((header) => header.replace(/"/g, '').trim());
    const sampleData = lines[1]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((field) => field.replace(/^"|"$/g, '').trim());
    return { headers, sampleData };
  };

  const { headers, sampleData } = parseCSV(sampleCSV);

  // Handle CSV download
  const downloadCSV = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_agents.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="my-8 p-4 bg-gray-50 border border-gray-200 rounded shadow">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Sample CSV Structure</h2>
        <button
          onClick={downloadCSV}
          className="flex items-center mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <FaDownload className="mr-2" />
          Download Sample CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              {sampleData.map((data, index) => (
                <td
                  key={index}
                  className="px-4 py-2 border-b text-sm text-gray-800 whitespace-nowrap"
                >
                  {data}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        <strong>Note:</strong> For fields that accept multiple values (e.g., keyFeatures, useCases, tags, gallery), separate values using commas.
      </p>
    </div>
  );
};

export default SampleCSVDisplay;
