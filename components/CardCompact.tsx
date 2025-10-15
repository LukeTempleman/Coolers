import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'

const CardCompact = ({
    cooler,
    coolerLink,
    }: CardCompactProps) => {
        const [imgSrc, setImgSrc] = useState(
            cooler.photoUrls?.[0] || "/placeholder.jpg"
        )
  return (
  <div className='rounded-xl overflow-hidden shadow-2xl w-full flex h-40 mb-5 border border-gray-200 dark:border-gray-700 ring-1 ring-gray-100 dark:ring-gray-800 bg-white dark:bg-primary-700 transition-colors'>
      <div className='relative w-1/3'>
          <Image 
          src={imgSrc}
          alt={cooler.name}
          fill 
          className='object-cover'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
          />
      <div className='absolute bottom-2 left-2 flex gap-1 flex-col'>
          {cooler.status && (
              <span className='bg-white/80 dark:bg-gray-800/80 text-black dark:text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center justify-center'>
                  {cooler.status}
              </span>
          )} 
          {cooler.coolerType && (
              <span className='bg-white/80 dark:bg-gray-800/80 text-black dark:text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center justify-center'>
                  {cooler.coolerType}
              </span>
          )} 
      </div>
          </div>
      <div className='w-2/3 p-4 flex flex-col justify-between'>
      <div className='flex justify-between items-start'>
          <h2 className='text-xl font-bold mb-1 text-gray-900 dark:text-white'>
              {coolerLink ? (
                  <Link 
                  href={coolerLink}
                  className="hover:underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                  scroll={false}
                  >
                      {cooler.name}
                  </Link>
              ) : (
                  cooler.name
              )}
          </h2>
      </div>
          <p className='text-gray-700 dark:text-gray-300 mb-1 text-sm'>
              {cooler?.location?.city}, {cooler?.location?.province}, {cooler?.location?.country}
          </p>
      </div>
  </div>
  )
}   

export default CardCompact;