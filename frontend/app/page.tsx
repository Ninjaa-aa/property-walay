import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Property Walay</h1>
      <ThemeToggle />
    </main>
  );
}
