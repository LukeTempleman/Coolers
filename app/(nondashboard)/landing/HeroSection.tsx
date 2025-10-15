"use client";

import { Button } from '@/components/ui/button';
import { MapPin, Shield, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Track Every Cooler.<br />
            <span className="text-blue-400">Prevent Every Loss.</span><br />
            Maximize Every Asset.
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade IoT tracking solution that reduces cooler theft by 80% while providing 
            real-time operational insights to optimize your fleet performance and ROI.
          </p>
          
          {/* Hero CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
            >
              Request a Demo
            </Button>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-3xl font-bold text-white">80%</div>
              <div className="text-gray-300">Reduction in Asset Loss</div>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-gray-300">System Uptime</div>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mb-2" />
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-gray-300">Coolers Supported</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;