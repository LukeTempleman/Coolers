/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';

// Simplified AuthProvider for NextAuth setup
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            {children}
        </main>
    );
};

export default AuthProvider;
