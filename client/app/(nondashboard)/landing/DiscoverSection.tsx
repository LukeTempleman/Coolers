"use client";
import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Thermometer, Shield, BarChart3, Clock, Zap } from 'lucide-react'

const containerVariants = {
    hidden: { opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
}
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6
        }
    },
}

const DiscoverSection = () => {
  return ( <motion.div
  suppressHydrationWarning
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={containerVariants}
  className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <div className='max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16'>
        <motion.div
        variants={itemVariants}
        className='mb-16 text-center'
        >
            <h2 className='text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4'>
                Why Choose GoNXT?
            </h2>
            <p className='text-xl text-gray-600 mb-4'>
                Experience the Future of Cooler Management
            </p>
            <p className='text-lg text-gray-500 max-w-4xl mx-auto'>
                Discover how GoNXT revolutionizes asset tracking with cutting-edge technology, real-time monitoring, and intelligent insights that keep your business running smoothly.
            </p>
        </motion.div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'>
            {[
                {
                    icon: MapPin,
                    title: "Real-Time GPS Tracking",
                    description: "Track your coolers anywhere, anytime with precise GPS location data and movement history.",
                    color: "bg-blue-500"
                },
                {
                    icon: Thermometer,
                    title: "Temperature Monitoring",
                    description: "Maintain optimal conditions with 24/7 temperature alerts and historical data analysis.",
                    color: "bg-red-500"
                },
                {
                    icon: Shield,
                    title: "Advanced Security",
                    description: "Protect your assets with tamper alerts, unauthorized access detection, and secure data encryption.",
                    color: "bg-green-500"
                },
                {
                    icon: BarChart3,
                    title: "Analytics & Insights",
                    description: "Make data-driven decisions with comprehensive reporting and predictive analytics.",
                    color: "bg-purple-500"
                },
                {
                    icon: Clock,
                    title: "Maintenance Alerts",
                    description: "Stay ahead of issues with automated maintenance reminders and performance tracking.",
                    color: "bg-orange-500"
                },
                {
                    icon: Zap,
                    title: "Instant Notifications",
                    description: "Get immediate alerts for critical events via SMS, email, and push notifications.",
                    color: "bg-yellow-500"
                },
            ].map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <DiscoverCard
                        {...feature}
                    />
                </motion.div>
            ))}
        </div>
    </div>
  </motion.div>
  )
}

const DiscoverCard = ({
    icon: Icon,
    title,
    description,
    color
} : {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    color: string;
}) => {
    return (
        <motion.div 
            className='group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 h-full transition-all duration-300 hover:-translate-y-2'
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl'></div>
            <div className={`${color} p-4 rounded-xl mb-6 inline-flex group-hover:scale-110 transition-transform duration-300`}>
                <Icon className='h-8 w-8 text-white' />
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300'>
                {title}
            </h3>
            <p className='text-gray-600 leading-relaxed'>
                {description}
            </p>
        </motion.div>
    );
}
export default DiscoverSection
