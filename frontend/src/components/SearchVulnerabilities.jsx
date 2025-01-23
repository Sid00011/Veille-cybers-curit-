import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchVulnerabilities({ vulnerabilities, setFilteredVulnerabilities }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('type'); // Default to 'type'

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle filter type change
  const handleFilterChange = (filter) => {
    setSearchType(filter);
  };

  useEffect(() => {
    let filtered = vulnerabilities;

    // Filter by selected type (either 'type' or 'date')
    if (searchQuery !== '') {
      if (searchType === 'type') {
        filtered = filtered.filter((vul) =>
          vul.type_vulnerability.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (searchType === 'date') {
        filtered = filtered.filter((vul) =>
          vul.date.includes(searchQuery)
        );
      }
    }

    setFilteredVulnerabilities(filtered); // Set the filtered vulnerabilities
  }, [searchQuery, searchType, vulnerabilities, setFilteredVulnerabilities]);

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative w-1/2">
        {/* Search input with icon */}
        <input
          type="text"
          placeholder={`Search by ${searchType}`}
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 w-full rounded-md text-gray-700"
        />
        
        {/* Filter dropdown icon */}
        <button
          onClick={() => handleFilterChange(searchType === 'type' ? 'date' : 'type')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
          <FaSearch />
        </button>
      </div>

      {/* Option to change filter type */}
      <div className="mt-2">
        <button
          onClick={() => handleFilterChange('type')}
          className={`mr-2 px-4 py-2 rounded-md ${searchType === 'type' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Par Type
        </button>
        <button
          onClick={() => handleFilterChange('date')}
          className={`px-4 py-2 rounded-md ${searchType === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Par Date
        </button>
      </div>
    </div>
  );
}

export default SearchVulnerabilities;
