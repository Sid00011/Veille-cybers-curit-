import React from 'react'
import { useContextauth } from '../hooks/useContextauth'
import { useEffect } from 'react'
import CategorieItem from '../components/CategorieItem'
import { useState } from 'react'

function Home() {
  const [Vulnerability, setVulnerability] = useState([]); 
  // const Categories = [
  //   {
  //     href: '/vulnerability/cve-2021-26855', 
  //     name: 'CVE-2021-26855: Microsoft Exchange Server Remote Code Execution', 
  //     image: '/v1.png'
  //   },
  //   {
  //     href: '/vulnerability/cve-2017-0144', 
  //     name: 'CVE-2017-0144: EternalBlue Windows SMB Remote Code Execution', 
  //     image: '/v2.jpg'
  //   },
  //   {
  //     href: '/vulnerability/cve-2020-0601', 
  //     name: 'CVE-2020-0601: Windows CryptoAPI Spoofing Vulnerability', 
  //     image: '/v3.jpg'
  //   },
  //   {
  //     href: '/vulnerability/cve-2021-22991', 
  //     name: 'CVE-2021-22991: F5 BIG-IP Remote Code Execution', 
  //     image: '/v4.jpeg'
  //   },
  //   {
  //     href: '/vulnerability/cve-2014-6271', 
  //     name: 'CVE-2014-6271: Shellshock Bash Remote Code Execution', 
  //     image: '/v5.jpg'
  //   },
  //   {
  //     href: '/vulnerability/cve-2021-21985', 
  //     name: 'CVE-2021-21985: VMware vCenter Server Remote Code Execution', 
  //     image: '/v6.png'
  //   },
  //   {
  //     href: '/vulnerability/cve-2022-22965', 
  //     name: 'CVE-2022-22965: Spring4Shell Remote Code Execution', 
  //     image: '/v7.jpg'
  //   },
  //   {
  //     href: '/vulnerability/cve-2017-5638', 
  //     name: 'CVE-2017-5638: Apache Struts Remote Code Execution', 
  //     image: '/v8.jpg'
  //   },
  // ];
  const {user} = useContextauth()
  
  useEffect(() => {
    // Fetch all CVE data from the backend
    const fetchVulnerabilities = async () => {
      // console.log('hhhhhh')
      try {
        const response = await fetch('http://localhost:8000/api/vulnerabilities/'); 
        const data = await response.json();
        setVulnerability(data); // Save the entire data array
        console.log(data)
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
      }
    };

    fetchVulnerabilities();
  }, []);
//   useEffect(() => {
//     console.log('this is my payload', use
// }, [user])
return (
  <div className='flex flex-col align-center mx-5 justify-center my-14 w-full h-full relative z-1'>
    <div className='text-3xl font-bold text-emerald-400 mx-auto pb-2'>
      Explorez les Vulnérabilités
    </div>
    <div className='opacity-70 text-sm mx-auto text-white pb-3'>
      Découvrez et apprenez à sécuriser ces vulnérabilités critiques
    </div>
    <div className='w-full justify-center grid grid-cols-3 gap-3 px-24'>
      {Vulnerability.map((Vul) => {
        return (
          <CategorieItem 
            key={Vul.code_cve}
            Vul={Vul}
          />
        )
      })}
    </div>
  </div>
)
}
export default Home