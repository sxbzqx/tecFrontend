'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/tecMap/tecMap'), {
  ssr: false,
  loading: () => <p>Загрузка карты...</p> 
});

export default function Page() {
  return (
    <div>
      <h1>Карта ТЭЦ</h1>
      <Map />
    </div>
  );
}