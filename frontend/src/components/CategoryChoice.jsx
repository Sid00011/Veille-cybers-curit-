import React, { useEffect } from 'react'
import useProduct from '../hooks/useProduct'
import { Link, useParams } from 'react-router-dom'
import { useContextauth } from '../hooks/useContextauth'
import { useState } from 'react'
function CategoryChoice() {
  const {Vul} = useParams()
  console.log(Vul)
  const [vulnerability, setVulnerability] = useState(null);
  useEffect(() => {
    // Simulate fetching data for the selected vulnerability
    const fetchVulnerabilityDetails = async () => {
      try {
        // Replace with your actual data fetching logic (e.g., API call or global state lookup)
        const response = await fetch(`http://localhost:8000/api/vulnerabilities/${Vul}`);
        const data = await response.json();
        setVulnerability(data);
      } catch (error) {
        console.error('Error fetching vulnerability details:', error);
      } 
    };

    fetchVulnerabilityDetails();
  }, [Vul]);
  return (
    <div className='max-w-screen-2xl mx-auto w-full h-full'>
      <div className='text-center text-emerald-400 font-bold text-3xl my-8 w-full h-full'>Vulnerability {Vul}</div>
<div className='flex flex-co justify-center max-w-screen-xl align-center w-full h-full'>
    
<div className='w-full h-full flex flex-col rounded-lg bg-emerald-900 '>
    <div className='text-white text-bold text-2xl p-4'>
        code cve : {vulnerability?.code_cve}
    </div>
    <div className='text-white text-bold text-2xl p-4'>
        resume : {vulnerability?.resume}
    </div>
    <div className='text-white text-bold text-2xl p-4'>
    type vulnerability : {vulnerability?.type_vulnerability}
    </div>
    <div className='text-white text-bold text-2xl p-4'>
     source : {vulnerability?.source}
    </div>
    <div className='text-white text-bold text-2xl p-4'>
     date : {vulnerability?.date}
    </div>
    <a href={vulnerability?.lien_article} target="_blank" className='text-white text-bold text-2xl p-4' >
     lien Article: {vulnerability?.lien_article}
    </a>
    <div className='text-white text-bold text-2xl p-4' >
     Resume Article: {vulnerability?.resume_article}
    </div>
    </div>


</div>






    </div>
  );
}

export default CategoryChoice