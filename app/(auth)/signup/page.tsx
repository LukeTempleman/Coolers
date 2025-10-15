"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, UserPlus } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Join{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Go<span className="font-light">NXT</span>
            </span>
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Account creation is managed by administrators
          </p>
        </div>

        {/* Signup Info Card */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
              Account Request
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              To create an account, please contact your system administrator
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Contact Administrator
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Only authorized administrators can create new user accounts for security purposes.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Please reach out to your system administrator</p>
                  <p>to request account access.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                  Back to Sign In
                </Button>
              </Link>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 GoNXT CoolerTracker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
