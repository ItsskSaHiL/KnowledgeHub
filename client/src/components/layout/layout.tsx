import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
