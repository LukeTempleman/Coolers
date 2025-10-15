import React from 'react'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import DiscoverSection from './DiscoverSection'
import CallToActionSection from './CallToActionSection'
import FooterSection from './FooterSection'
import PricingSection from './PricingSection'

// Add meta data for SEO
export const metadata = {
  title: 'Bevco Cooler Tracking Solution - Real-time IoT Asset Management',
  description: 'Real-time cooler tracking with GPS monitoring, geofencing alerts, and power cutoff detection. Reduce asset loss by 80% with Bevco\'s enterprise IoT solution. Request demo today.'
}

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <PricingSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  )
}

export default Landing