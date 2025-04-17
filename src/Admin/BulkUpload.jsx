// src/Components/BulkUpload.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import SampleCSVDisplay from '../Components/SampleCSVDisplay';
import DuplicateReport from '../Components/DuplicateReport';

const BulkUpload = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [duplicateReport, setDuplicateReport] = useState(null); // State to hold duplicate report

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setErrors([]);
    } else {
      setFile(null);
      setErrors(['Please select a valid CSV file.']);
      toast.error('Please select a valid CSV file.');
    }
  };

  // Helper function to generate a human-readable report string
  const generateReadableReport = (report) => {
    let output = 'Duplicate Report\n';
    output += '================\n\n';

    // Exact Matches
    if (report.exactMatches && report.exactMatches.length > 0) {
      output += 'Exact Matches:\n';
      report.exactMatches.forEach((match) => {
        output += ` - CSV Agent: ${match.csvAgentName} matches with DB Agent: ${match.dbAgentName}\n`;
      });
      output += '\n';
    } else {
      output += 'No exact matches found.\n\n';
    }

    // Fuzzy Matches
    if (report.fuzzyMatches && report.fuzzyMatches.length > 0) {
      output += 'Fuzzy Matches (Similarity ≥ 40%):\n';
      report.fuzzyMatches.forEach((fuzzy) => {
        output += ` - CSV Agent: ${fuzzy.csvAgentName}\n`;
        fuzzy.matches.forEach((m) => {
          output += `     * DB Agent: ${m.dbAgentName} (Similarity: ${(m.similarity * 100).toFixed(1)}%)\n`;
        });
        output += '\n';
      });
    } else {
      output += 'No fuzzy matches found.\n';
    }
    return output;
  };

  // Download button handler: generates a human-friendly text file for download.
  const handleDownloadReport = () => {
    const reportText = generateReadableReport(duplicateReport);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Duplicate_Report.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = event.target.result;
      try {
        setUploading(true);
        const res = await axios.post(
          'http://localhost:5000/api/admin/bulk-upload-csv', // Adjust to your backend route
          { csv: csvData },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        toast.success(res.data.message);

        // Set errors if any
        if (res.data.failed && res.data.failed.length > 0) {
          setErrors(res.data.failed);
        } else {
          setErrors([]);
        }

        // If duplicate report is provided, keep the modal open and set the report.
        if (res.data.report) {
          setDuplicateReport(res.data.report);
          // Do not close the modal if duplicates are found.
        } else {
          setDuplicateReport(null);
          onUploadSuccess();
          onClose();
        }

        setFile(null); // Reset file input
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An unexpected error occurred during upload.');
        }
        console.error('Bulk upload error:', error);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read the file.');
      setUploading(false);
    };

    reader.readAsText(file);
  };

  if (!isOpen) return null; // Do not render the modal if closed

  // Agent Schema Information for display purposes
  const agentSchemaInfo = [
    { field: 'name', required: true, type: 'String (max 35 characters)', constraints: 'Unique' },
    { field: 'createdBy', required: false, type: 'String (max 50 characters)', constraints: '' },
    { field: 'websiteUrl', required: true, type: 'String (max 100 characters)', constraints: '' },
    { field: 'ownerEmail', required: false, type: 'String (max 50 characters)', constraints: '' },
    { field: 'accessModel', required: true, type: 'String', constraints: 'Options: Open Source, Closed Source, API' },
    { field: 'pricingModel', required: true, type: 'String', constraints: 'Options: Free, Freemium, Paid' },
    { field: 'category', required: true, type: 'List of Strings', constraints: '' },
    { field: 'industry', required: true, type: 'String', constraints: '' },
    { field: 'tagline', required: false, type: 'String', constraints: '' },
    { field: 'description', required: false, type: 'String', constraints: '' },
    { field: 'keyFeatures', required: false, type: 'List of Strings', constraints: '' },
    { field: 'useCases', required: false, type: 'List of Strings', constraints: '' },
    { field: 'useRole', required: false, type: 'String', constraints: '' },
    { field: 'tags', required: false, type: 'List of Strings', constraints: '' },
    { field: 'logo', required: false, type: 'String (URL)', constraints: '' },
    { field: 'thumbnail', required: false, type: 'String (URL)', constraints: '' },
    { field: 'videoUrl', required: false, type: 'String (URL)', constraints: '' },
    { field: 'isHiring', required: false, type: 'Boolean', constraints: 'Default: false' },
    { field: 'likes', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'triedBy', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'reviewRatings', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'votesThisMonth', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'price', required: false, type: 'String', constraints: '' },
    { field: 'gallery', required: false, type: 'List of Strings (URLs)', constraints: '' },
    { field: 'freeTrial', required: false, type: 'Boolean', constraints: 'Default: false' },
    { field: 'subscriptionModel', required: false, type: 'String', constraints: '' },
    { field: 'status', required: false, type: 'String', constraints: 'Options: requested, accepted, rejected, onHold. Default: requested' },
    { field: 'savedByCount', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'version', required: false, type: 'Number', constraints: 'Default: 0' },
    { field: 'featured', required: false, type: 'Boolean', constraints: 'Default: false' },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 z-50 w-11/12 max-w-5xl relative overflow-y-auto max-h-screen">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <FaTimes size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Bulk Upload Agents</h2>

        {/* Schema Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Agent Schema Information</h3>
          <p className="text-gray-600 mb-4">
            Ensure your CSV file includes the columns below with the correct data types and constraints.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left font-medium">Field</th>
                  <th className="px-4 py-2 border-b text-center font-medium">Required</th>
                  <th className="px-4 py-2 border-b text-left font-medium">Type</th>
                  <th className="px-4 py-2 border-b text-left font-medium">Constraints</th>
                </tr>
              </thead>
              <tbody>
                {agentSchemaInfo.map((fieldInfo, index) => (
                  <tr key={index} className="text-sm text-gray-700 even:bg-gray-50">
                    <td className="px-4 py-2 border-b font-semibold">{fieldInfo.field}</td>
                    <td className="px-4 py-2 border-b text-center">
                      {fieldInfo.required ? (
                        <span className="text-red-600 font-bold">Yes</span>
                      ) : (
                        'No'
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">{fieldInfo.type}</td>
                    <td className="px-4 py-2 border-b">{fieldInfo.constraints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sample CSV Display */}
        <SampleCSVDisplay />

        {/* File Upload Section */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload CSV File
          </label>
          <div className="flex items-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
            >
              Choose File
            </label>
            {file && (
              <span className="ml-4 text-sm text-gray-600 truncate max-w-xs">
                {file.name}
              </span>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full mt-6 py-2 rounded text-white font-semibold ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded">
            <h3 className="text-lg font-semibold text-red-600">Errors:</h3>
            <ul className="list-disc list-inside text-red-600 max-h-40 overflow-y-auto">
              {errors.map((err, index) => (
                <li key={index}>
                  Row {err.row}: {err.reason || err.error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Duplicate Report Display */}
        {duplicateReport && (
          <div className="mt-6">
            <DuplicateReport report={duplicateReport} />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors duration-300"
              >
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
