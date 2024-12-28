import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, Suspense, lazy } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainSidebar from "@/components/MainSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import SettingsSidebar from "@/components/SettingsSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const Blog = lazy(() => import("@/pages/Blog"));
const Transaction = lazy(() => import("@/pages/Transaction"));
const Clients = lazy(() => import("@/pages/Clients"));
const Withdrawals = lazy(() => import("@/pages/Withdrawals"));
const Orders = lazy(() => import("@/pages/Orders"));
const Refunds = lazy(() => import("@/pages/Refunds"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/components/Auth"));
const ProfileForm = lazy(() => import("@/pages/ProfileForm"));

// Create a new LoadingSpinner component
<lov-write file_path="src/components/LoadingSpinner.tsx">
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default LoadingSpinner;