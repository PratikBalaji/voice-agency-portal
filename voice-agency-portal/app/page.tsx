import DiscoveryForm from '@/components/DiscoveryForm';

export const metadata = {
  title: 'AI Voice Agent Generator',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-16">
      <DiscoveryForm />
    </main>
  );
}
