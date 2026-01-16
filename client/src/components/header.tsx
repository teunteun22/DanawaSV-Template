import { ThemeToggle } from "@/components/theme-toggle";
import { Car, Radar } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header">
      <div className="container flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2" data-testid="header-logo">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight" data-testid="text-app-title">자동차 급상승 레이더</h1>
            <Car className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
