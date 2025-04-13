import { ReactNode } from "react";
import MainSidebar from "./MainSidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`flex h-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      <MainSidebar />
      
      <main className="flex-1 overflow-y-auto bg-background p-6 transition-colors duration-200">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
