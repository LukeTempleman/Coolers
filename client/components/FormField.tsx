/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  useFormContext,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { registerPlugin } from "filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export interface CustomFormFieldProps {
  name: string;
  control?: any; // Make control optional for compatibility
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export const CustomFormField: React.FC<CustomFormFieldProps> = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  disabled = false,
}) => {
  const { control: formControl } = useFormContext();

  return (
    <FormField
      control={control || formControl} 
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>{label}</FormLabel>

            {!disabled && (
              <Edit className="size-4 text-customgreys-dirtyGrey" />
            )}
          </div>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              {...field}
              value={field.value || ""} // Ensure value is never undefined
              className="border-gray-200 p-4"
            />
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};


