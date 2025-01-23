import React, { useState, useEffect } from 'react';
import { useContextauth } from '../hooks/useContextauth';
import CategorieItem from '../components/CategorieItem';
import SearchVulnerabilities from '../components/SearchVulnerabilities';

function Home() {
  const [Vulnerability, setVulnerability] = useState([]);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vulnerabilitiesPerPage = 9;
  const { user } = useContextauth();

  useEffect(() => {
    const fetchVulnerabilities = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vulnerabilities/');
        const data = await response.json();
        setVulnerability(data);
        setFilteredVulnerabilities(data); // Initialize filtered list
        console.log(data);
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
      }
    };

    fetchVulnerabilities();
  }, []);

  // Pagination logic
  const indexOfLastVulnerability = currentPage * vulnerabilitiesPerPage;
  const indexOfFirstVulnerability = indexOfLastVulnerability - vulnerabilitiesPerPage;
  const currentVulnerabilities = filteredVulnerabilities.slice(indexOfFirstVulnerability, indexOfLastVulnerability);

  const totalPages = Math.ceil(filteredVulnerabilities.length / vulnerabilitiesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col align-center mx-5 justify-center my-14 w-full h-full relative z-1">
      <div className="text-3xl font-bold text-emerald-400 mx-auto pb-2">
        Explorez les Vulnérabilités
      </div>
      <div className="opacity-70 text-sm mx-auto text-white pb-3">
        Découvrez et apprenez à sécuriser ces vulnérabilités critiques
      </div>

      {/* Search Component */}
      <SearchVulnerabilities
        vulnerabilities={Vulnerability}
        setFilteredVulnerabilities={setFilteredVulnerabilities}
      />

      <div className="w-full justify-center grid grid-cols-3 gap-3 px-24">
        {currentVulnerabilities.map((Vul) => (
          <CategorieItem key={Vul.code_cve} Vul={Vul} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md mr-2 ${
            currentPage === 1 ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white font-medium`}
        >
          &larr; Précédent
        </button>
        <span className="text-white mx-2">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ml-2 ${
            currentPage === totalPages ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'
          } text-white font-medium`}
        >
          Suivant &rarr;
        </button>
      </div>
    </div>
  );
}

export default Home;






























































// import React, { useState, useEffect } from 'react';
// import { useContextauth } from '../hooks/useContextauth';
// import CategorieItem from '../components/CategorieItem';
// import SearchVulnerabilities from '../components/SearchVulnerabilities';
// function Home() {
//   const [Vulnerability, setVulnerability] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1); // Current page state
//   const vulnerabilitiesPerPage = 9; // Vulnerabilities per page
//   const { user } = useContextauth();

//   useEffect(() => {
//     const fetchVulnerabilities = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/vulnerabilities/');
//         const data = await response.json();
//         setVulnerability(data); // Use the full data without slicing
//         console.log(data);
//       } catch (error) {
//         console.error('Error fetching vulnerabilities:', error);
//       }
//     };

//     fetchVulnerabilities();
//   }, []);

//   // Pagination logic
//   const indexOfLastVulnerability = currentPage * vulnerabilitiesPerPage;
//   const indexOfFirstVulnerability = indexOfLastVulnerability - vulnerabilitiesPerPage;
//   const currentVulnerabilities = Vulnerability.slice(indexOfFirstVulnerability, indexOfLastVulnerability);

//   const totalPages = Math.ceil(Vulnerability.length / vulnerabilitiesPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className='flex flex-col align-center mx-5 justify-center my-14 w-full h-full relative z-1'>
//       <div className='text-3xl font-bold text-emerald-400 mx-auto pb-2'>
//         Explorez les Vulnérabilités
//       </div>
//       <div className='opacity-70 text-sm mx-auto text-white pb-3'>
//         Découvrez et apprenez à sécuriser ces vulnérabilités critiques
//       </div>

//       <SearchVulnerabilities
//         vulnerabilities={Vulnerability}
//         setFilteredVulnerabilities={setFilteredVulnerabilities}
//       />

//       <div className='w-full justify-center grid grid-cols-3 gap-3 px-24'>
//         {currentVulnerabilities.map((Vul) => (
//           <CategorieItem key={Vul.code_cve} Vul={Vul} />
//         ))}
//       </div>

//       {/* Pagination Controls */}
//       <div className='flex justify-center items-center mt-6'>
//         <button
//           onClick={prevPage}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 rounded-md mr-2 ${
//             currentPage === 1 ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'
//           } text-white font-medium`}
//         >
//           &larr; Précédent
//         </button>
//         <span className='text-white mx-2'>
//           Page {currentPage} sur {totalPages}
//         </span>
//         <button
//           onClick={nextPage}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 rounded-md ml-2 ${
//             currentPage === totalPages ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'
//           } text-white font-medium`}
//         >
//           Suivant &rarr;
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;
