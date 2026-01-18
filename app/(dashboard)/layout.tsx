import { Sidebar, Header } from "@/components/common";
import { TetCountdown } from "@/components/tet/TetCountdown";
import { TetDecorations } from "@/components/tet/TetDecorations";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TetDecorations />
      <div className="min-h-screen bg-background">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="lg:pl-64 min-h-screen transition-all duration-150 flex flex-col">
          <TetCountdown />
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
