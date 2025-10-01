import { Header } from '@/components/header';
import { PostGenerator } from '@/components/post-generator';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary/20">
      <Header />
      <PostGenerator />
    </div>
  );
}
