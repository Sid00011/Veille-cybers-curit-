import React from 'react'
import { Link } from 'react-router-dom'
function CategorieItem({Vul}) {
  const randomImageIndex = Math.floor(Math.random() * 19) + 1;
  
  let imageSrc = '';
 
  if (randomImageIndex >= 1 && randomImageIndex <= 5) {
    imageSrc = `v${randomImageIndex}.png`;
  } else if (randomImageIndex >= 6 && randomImageIndex <= 13) {
    imageSrc = `v${randomImageIndex}.jpg`;
  }else {
    imageSrc = `v${randomImageIndex}.jpeg`;
  }
  // Construct the image file name

  return (
    <div className='rounded-lg border border-gray-500 h-72 w-full bg-red-600 relative p-4 group overflow-hidden'>
      <Link to={`/vulnerability/${Vul.code_cve}`}>
        <div className='absolute inset-0 overflow-hidden'>
            <img src={imageSrc} alt={Vul.code_cve} className='w-full h-full object-cover rounded-lg hover:scale-110 transition-transform duration-300 ease-in-out ' />
        </div>
        <div className='flex flex-col z-10 absolute bottom-5 left-5'>
            <div className='text-white font-bold'>{Vul.code_cve}</div>
            <button className='opacity-70 text-white text-sm'>Explore {Vul.type_vulnerability}</button>
        </div>
        </Link>
    </div>
  )
}

export default CategorieItem