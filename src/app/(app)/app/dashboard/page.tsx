import Branding from '@/components/branding';
import Stats from '@/components/stats';

export default function Dashboard() {
  return (
    <main>
      <div className='flex justify-between items-center text-white py-8'>
        <Branding />
        <Stats />
      </div>
    </main>
  );
}
