"use client";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "../state/api";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
  <ThemeProvider>
    {children}
  </ThemeProvider>
  );
};

export default DashboardLayout;