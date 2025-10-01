import { Rss } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-4 bg-background px-4 py-4 md:px-6">
      <div className="flex items-center gap-2">
        <Rss className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">PostCraft AI</h1>
      </div>
    </header>
  );
}
