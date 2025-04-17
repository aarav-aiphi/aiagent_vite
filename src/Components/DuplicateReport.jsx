// src/Components/DuplicateReport.jsx

import React from 'react';

const DuplicateReport = ({ report }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg my-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Duplicate Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exact Matches */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-2 text-green-700">Exact Matches</h3>
          {report.exactMatches && report.exactMatches.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {report.exactMatches.map((match, idx) => (
                <li key={idx} className="py-2">
                  <p>
                    <span className="font-medium">CSV Agent:</span> {match.csvAgentName}
                  </p>
                  <p>
                    <span className="font-medium">DB Agent:</span> {match.dbAgentName}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No exact duplicates found.</p>
          )}
        </div>

        {/* Fuzzy Matches */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-2 text-orange-700">Fuzzy Matches (Similarity ≥ 40%)</h3>
          {report.fuzzyMatches && report.fuzzyMatches.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {report.fuzzyMatches.map((fuzzy, idx) => (
                <li key={idx} className="py-2">
                  <p className="font-medium">CSV Agent: {fuzzy.csvAgentName}</p>
                  <ul className="ml-4">
                    {fuzzy.matches.map((m, i) => (
                      <li key={i}>
                        <span className="font-medium">DB Agent:</span> {m.dbAgentName}
                        <span className="ml-2 text-sm text-gray-500">
                          ({(m.similarity * 100).toFixed(1)}% similar)
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No fuzzy duplicates found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuplicateReport;
