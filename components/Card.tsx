import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'

const Card = ({
    cooler,
    coolerLink,
    }: CardProps) => {
        const [imgSrc, setImgSrc] = useState(
            cooler.photoUrls?.[0] || "/placeholder.jpg"
        );

  return (
    <div className='rounded-xl overflow-hidden shadow-lg w-full mb-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-primary-700 transition-colors'>
        <div className='relative'>
            <div className='w-full h-48 relative'>
            <Image 
            src={imgSrc}
            alt={cooler.name}
            fill 
            className='object-cover'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
            />
            </div>
            <div className='absolute bottom-4 left-4 flex gap-2'>
                {cooler.status && (
                    <span className='bg-white/80 dark:bg-gray-800/80 text-black dark:text-white text-xs font-semibold px-2 py-1 rounded-full'>
                        {cooler.status}
                    </span>
                )} 
                {cooler.coolerModel && (
                    <span className='bg-white/80 dark:bg-gray-800/80 text-black dark:text-white text-xs font-semibold px-2 py-1 rounded-full'>
                        {cooler.coolerModel}
                    </span>
                )} 
            </div>
        </div>
        <div className='p-4'>
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
            <p className='text-gray-700 dark:text-gray-300 mb-2'>
                 {cooler?.location?.city}, {cooler?.location?.province}, {cooler?.location?.country}
            </p>
        </div>
    </div>
  )
}   

export default Card;