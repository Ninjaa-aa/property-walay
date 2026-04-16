import { Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { ChatFloatingButton } from "@/components/chatbot/chat-floating-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-1 flex-col lg:pl-60">
        <Suspense fallback={null}>
          <TopNav />
        </Suspense>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
      <Suspense fallback={null}>
        <ChatFloatingButton />
      </Suspense>
    </div>
  );
}
