import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/app/providers";
import { PomodoroProvider } from "@/contexts/pomodoro-context";
import { PomodoroWidget } from "@/components/pomodoro/PomodoroWidget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <PomodoroProvider>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <div className="md:pl-64 flex flex-col flex-1">
            <Header />
            <main className="flex-1">
              <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
          <PomodoroWidget />
        </div>
      </PomodoroProvider>
    </Providers>
  );
}

