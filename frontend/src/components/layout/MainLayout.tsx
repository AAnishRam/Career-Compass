import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30 p-2 sm:p-4">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="lg:ml-64 lg:pl-4 transition-all duration-300">
        <div className="bg-background rounded-xl sm:rounded-2xl min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] p-4 pt-16 sm:p-6 sm:pt-20 lg:p-8 shadow-subtle">
          {children}
        </div>
      </main>
    </div>
  );
}
