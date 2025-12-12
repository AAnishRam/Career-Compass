import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <AppSidebar />
      <main className="ml-64 pl-4">
        <div className="bg-background rounded-2xl min-h-[calc(100vh-2rem)] p-6 lg:p-8 shadow-subtle">
          {children}
        </div>
      </main>
    </div>
  );
}
