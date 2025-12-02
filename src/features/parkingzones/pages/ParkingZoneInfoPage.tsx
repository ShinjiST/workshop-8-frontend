import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useParkingZone } from '../api';

export const ParkingZoneInfoPage = () => {
  // derive id from pathname so this page works regardless of router helper availability
  const parts = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean) : [];
  const last = parts[parts.length - 1];

  // If the path ends with 'info' treat this as the generic info page
  const isGenericInfo = last === 'info';
  const idCandidate = Number(last);
  const id = !isGenericInfo && Number.isFinite(idCandidate) && !Number.isNaN(idCandidate) ? idCandidate : undefined;
  const { data: zone, isLoading, isError } = useParkingZone(id ?? -1);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => { setMounted(true); }, 10); return () => { clearTimeout(t); }; }, []);

  if (isGenericInfo) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Це проста тестова сторінка
        </h2>
        <p className="text-gray-600 mb-6">
          Тут може бути будь-який контент, який ти захочеш.
        </p>

        <Link
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          to="/parkingzones"
        >
          Назад
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !zone) return (
    <div className={`p-6 min-h-screen flex items-center justify-center ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Зона не знайдена</h3>
        <Link className="text-blue-600 underline" to="/parkingzones">Назад до списку</Link>
      </div>
    </div>
  );

  return (
    <div className={`p-6 bg-gray-50 min-h-screen transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{zone.pz_name || `Zone ${zone.pz_id}`}</h2>
        <p className="text-gray-600 mb-2">Місткість: <strong>{zone.pz_capacity}</strong></p>
        <p className="text-gray-600 mb-6">ID: {zone.pz_id}</p>

        <Link
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          to="/parkingzones"
        >
          Назад
        </Link>
      </div>
    </div>
  );
};
