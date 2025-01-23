import React, { useEffect } from 'react'
import useProduct from '../hooks/useProduct'
import { useParams } from 'react-router-dom'
import { useContextauth } from '../hooks/useContextauth'
import ProductCategory from './ProductCategory'
import { useState } from 'react'
function CategoryChoice() {
  // const {getCategory} = useProduct()
  const {Vul} = useParams()
  // const {products} = useContextauth()
  // console.log(category)
  // console.log("my products", products)
  // useEffect(() => {
  //   getCategory(category)
  // }, [category])
  console.log(Vul)
  const [vulnerability, setVulnerability] = useState(null);
  useEffect(() => {
    // Simulate fetching data for the selected vulnerability
    const fetchVulnerabilityDetails = async () => {
      try {
        console.log("hhhh");
        // Replace with your actual data fetching logic (e.g., API call or global state lookup)
        const response = await fetch(`http://localhost:8000/api/vulnerabilities/${Vul}`);
        const data = await response.json();
        setVulnerability(data);
        console.log("my data" , data);
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
    







    </div>
    </div>
  )
}

export default CategoryChoice