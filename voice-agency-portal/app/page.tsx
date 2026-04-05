import DiscoveryForm from '@/components/DiscoveryForm';

export const metadata = {
  title: 'AI Voice Agency – Prompt Discovery & Deployment',
  description: 'Generate and deploy AI voice agents for your business in seconds.',
};

export default function Home() {
  return (
    <main className="flex-1">
      <DiscoveryForm />
    </main>
  );
}
