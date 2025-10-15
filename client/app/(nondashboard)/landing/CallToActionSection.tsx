"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const CallToActionSection = () => {
  const benefits = [
    "30-day pilot program available",
    "No long-term commitments required",
    "Full technical support included",
    "Custom reporting and analytics",
  ];

  return (
    <div className="relative py-24 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
         <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-800"
          animate={{
            background: [
              "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1e40af 100%)",
              "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e3a8a 100%)",
              "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #312e81 100%)",
              "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1e40af 100%)",
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Animated floating elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 bg-blue-300 bg-opacity-20 rounded-full blur-2xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-black bg-opacity-15 rounded-full blur-lg"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-2xl font-bold text-white">
              Ready to Secure Your Cooler Fleet?
            </h2>
          </div>
          <div>
            <p className="text-white mb-3">
              Transform your asset management with real-time tracking, proactive
              alerts, and actionable insights. Join industry leaders who've
              reduced asset loss by 80% while improving operational efficiency.
            </p>
            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center text-blue-100"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
              >
                Schedule a Pilot Deployment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
         
            </div>
          
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;