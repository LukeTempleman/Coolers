"use client";
import React from 'react'
// import { useParams } from 'next/navigation';
// import { useGetAuthUserQuery } from '@/app/state/api';
// import CoolerDetails from './CoolerDetails';
// import CoolerLocation from './CoolerLocation';
// import ContactWidget from './ContactWidget';
import ImagePreviews from './ImagePreviews';
import CoolerOverview from './CoolerOverview';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/site-header';
// import { useParams } from 'next/navigation';

const SingleAsset= () => {
    // const { id } = useParams();
    // const { data: authUser } = useGetAuthUserQuery();
  return (
      <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
  <div>
    <ImagePreviews 
    images={["/placeholder.jpg", "/placeholder.jpg"]}
    />
    <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className='order-2 md:order-1'>
            <CoolerOverview  />
            {/* <CoolerDetails coolerId={coolerId} /> */}
            {/* <CoolerLocation coolerId={coolerId} /> */}
        </div>
          {/* <div className="order-1 md:order-2">
          <ContactWidget onOpenModal={() => setIsModalOpen(true)} />
        </div> */}
      </div>
    </div>
        
      </SidebarInset>
    </SidebarProvider>
    
  )
}

export default SingleAsset