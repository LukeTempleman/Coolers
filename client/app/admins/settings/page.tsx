"use client";

import { useGetAuthUserQuery, useUpdateAdminSettingsMutation } from '@/app/state/api'
import SettingsForm from '@/components/SettingsForm';
import React, { useEffect, useState } from 'react'

const AdminSettings = () => {
    const { data: authUser, isLoading } = useGetAuthUserQuery();
    const [updateAdmin] = useUpdateAdminSettingsMutation();
    const [mounted, setMounted] = useState(false);
    
    // Prevent hydration errors by only rendering after component mounts
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Handle loading state
    if (!mounted || isLoading) {
        return <div className="p-6">Loading settings...</div>;
    }
    
    // Create initial data safely after mounting
    const initialData = {
        name: authUser?.userInfo?.name,
        email: authUser?.userInfo?.email
    };

    const handleSubmit = async (data: typeof initialData) => {
        if (!authUser?.sessionInfo?.user?.id) {
            console.error("No user ID available");
            return;
        }
        
        try {
            // Add debugging log
            console.log("Submitting data:", data);
            
            const result = await updateAdmin({
                cognitoId: authUser.sessionInfo.user.id,
                ...data,
            }).unwrap(); // Add .unwrap() to properly handle the Promise
            
            // Add success feedback
            console.log("Settings updated successfully:", result);
            
            // Add user feedback (toast notification)
            alert("Settings updated successfully");
        } catch (error: unknown) {
            console.error("Failed to update settings:", error);
            alert("Failed to update settings: " + (error instanceof Error ? error.message : "Unknown error"));
        }
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            <SettingsForm
                initialData={initialData}
                onSubmit={handleSubmit} 
                userType={'admin'}
                />
        </div>
    );
};

export default AdminSettings;