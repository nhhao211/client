import { Sidebar, ProtectedRoute } from "@/components/common";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="lg:pl-64 min-h-screen transition-all duration-200">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
