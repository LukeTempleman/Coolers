import Link from "next/link";
import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-4 inline-block" scroll={false}>
              GO<span className="text-blue-400">NXT</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Revolutionizing cooler management with cutting-edge GPS tracking, 
              real-time monitoring, and intelligent analytics for businesses worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">support@gonxt.tech</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+27 12 345 6789</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Johannesburg, South Africa</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Request Demo
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Press Kit
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Social Links */}
            <div className="flex space-x-6">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>

            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span>© 2025 GoNXT. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-blue-400 transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;