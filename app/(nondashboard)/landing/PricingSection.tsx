'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, TrendingUp, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pricingPlans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for small businesses getting started with cooler tracking',
    icon: Zap,
    features: [
      'Up to 10 coolers',
      'Real-time GPS tracking',
      'Basic geofencing',
      'Email alerts',
      'Mobile app access',
      'Monthly reports',
      '24/7 support'
    ],
    popular: false,
    buttonText: 'Start Free Trial',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Professional',
    price: 129,
    description: 'Advanced features for growing businesses with multiple locations',
    icon: TrendingUp,
    features: [
      'Up to 50 coolers',
      'Advanced geofencing',
      'Power status monitoring',
      'SMS & email alerts',
      'Custom reports',
      'Analytics dashboard',
      'API access',
      'Priority support'
    ],
    popular: true,
    buttonText: 'Get Started',
    buttonVariant: 'default' as const
  },
  {
    name: 'Enterprise',
    price: 299,
    description: 'Complete solution for large enterprises with complex needs',
    icon: Building2,
    features: [
      'Unlimited coolers',
      'AI-powered insights',
      'Custom integrations',
      'White-label solution',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom SLA',
      'On-site training'
    ],
    popular: false,
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Scale your cooler tracking solution with flexible pricing designed for businesses of all sizes.
            Start with a free trial and upgrade as you grow.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <motion.div key={plan.name} variants={cardVariants}>
                <Card className={`relative h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border border-gray-200 dark:border-gray-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        /month
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button 
                      variant={plan.buttonVariant}
                      className={`w-full py-3 text-lg font-medium transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl' 
                          : ''
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Contact our sales team for volume discounts, custom integrations, 
              and enterprise-grade solutions tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="px-8 py-3">
                Schedule Demo
              </Button>
              <Button className="px-8 py-3 bg-blue-500 hover:bg-blue-600">
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! We offer a 14-day free trial on all plans with full access to features.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! Upgrade or downgrade your plan at any time with prorated billing.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                What's included in support?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                All plans include 24/7 support via email, chat, and phone with priority for higher tiers.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Are there setup fees?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                No setup fees! Get started immediately with our simple onboarding process.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
