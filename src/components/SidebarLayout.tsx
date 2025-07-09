"use client"

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { isCollapsed } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen min-w-screen">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 w-full transition-all duration-300",
          !isMobile && isCollapsed && "ml-14",
          !isMobile && !isCollapsed && "ml-60",
          isMobile && "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}; 