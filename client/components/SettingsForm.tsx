/* eslint-disable @typescript-eslint/no-explicit-any */
// components/SettingsForm.tsx
"use client";

import { SettingsFormData, settingsSchema } from '@/app/lib/schemas';
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from './ui/form';
import { CustomFormField } from './FormField';
import { Button } from './ui/button';

interface SettingsFormProps {
    initialData: {
        name?: string;
        email?: string;
    };
    onSubmit: (data: any) => Promise<void>;
    userType: string;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData,
    onSubmit,
    userType
}) => {
    const [editMode, setEditMode] = useState(false);
    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: initialData.name || '', // Provide empty string as fallback
            email: initialData.email || '',
        }
    });

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (!editMode) {
            form.reset(initialData);
        }
    }
    const handleSubmit = async (data: any) => {
        await onSubmit(data);
        setEditMode(false);
    }
  return (
    <div className='pt-8 pb-5 px-8'>
        <div className='mb-5'>
            <h1 className='text-xl font-semibold'>
                {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
                Manage your account preferences and personal information.
            </p>
        </div>
        <div className='bg-white rounded-xl p-6'>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'
                >
                    <CustomFormField
                    name="name"
                    label="Name"
                    placeholder="Your name"
                    disabled={!editMode}
                    />
                    
                    <CustomFormField
                    name="email"
                    label="Email"
                    placeholder="Your email address"
                    type='email'
                    disabled={!editMode}
                    />
                    
                    <div className='pt-4 flex justify-between'>
                        <Button
                        type='button'
                        onClick={toggleEditMode}
                        className='bg-blue-500 text-white hover:bg-blue-600'
                        >
                            {editMode ? 'Cancel' : 'Edit'}
                        </Button>
                        {editMode && (
                            <Button
                            type='submit'
                            className='bg-primary-700 text-white hover:bg-primary-800'
                            >
                                Save Changes
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default SettingsForm;