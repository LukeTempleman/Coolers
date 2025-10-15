"use client";

import { MapPin, Shield, Zap, Link, BarChart3, AlertTriangle } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "GPS Tracking & Location Monitoring",
      description: "Precise GPS coordinates with 3-meter accuracy. Track cooler movements, routes, and current locations across your entire fleet in real-time."
    },
    {
      icon: Shield,
      title: "Smart Geofencing & Breach Alerts",
      description: "Automated alerts when coolers leave designated zones. Instant notifications via SMS, email, or dashboard for immediate response to unauthorized movement."
    },
    {
      icon: Zap,
      title: "Power Cutoff Detection",
      description: "Monitor power disconnections and battery status. Receive immediate alerts when coolers are unplugged or experience power failures."
    },
    {
      icon: Link,
      title: "Asset-Device Linking",
      description: "Seamlessly connect JT11 tracking devices to cooler assets. Comprehensive device health monitoring with tamper detection and communication status."
    },
    {
      icon: BarChart3,
      title: "Metabase Analytics Integration",
      description: "Professional-grade dashboards with utilization patterns, movement analytics, and operational insights. Custom reports for stakeholder visibility."
    },
    {
      icon: AlertTriangle,
      title: "Exception Reports",
      description: "Automated detection of offline coolers, power cuts, and misplaced assets with detailed incident reporting and recovery assistance."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Asset Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive IoT tracking solution with enterprise-grade features for complete cooler fleet management.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* How It Works */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Deploy in 3 Simple Steps
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">Install JT11 Devices</h4>
              <p className="text-gray-600">
                Professional installation of compact JT11 trackers on each cooler with cellular connectivity.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">Real-Time Monitoring</h4>
              <p className="text-gray-600">
                Immediate GPS tracking activation with geofencing setup and automated alert configuration.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">Analytics & Insights</h4>
              <p className="text-gray-600">
                Access comprehensive Metabase dashboards with utilization data and exception reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;