import { Sidebar, ProtectedRoute, Header } from "@/components/common";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background dark:bg-slate-950">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="lg:pl-64 min-h-screen transition-all duration-200 flex flex-col bg-background">
          <Header />
          <div className="flex-1 bg-background">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
