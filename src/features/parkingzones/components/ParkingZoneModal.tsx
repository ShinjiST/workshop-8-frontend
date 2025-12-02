import type React from 'react';
import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { useCreateParkingZone, useParkingZone, useUpdateParkingZone } from '../api';
import { useNavigate } from '@tanstack/react-router';

type Props = {
  mode: 'create' | 'view' | 'edit';
  id?: number;
  onClose: () => void;
};

export const ParkingZoneModal: React.FC<Props> = ({ mode, id, onClose }) => {
  const navigate = useNavigate();
  const createMutation = useCreateParkingZone();
  const updateMutation = useUpdateParkingZone();

  const { data: zone, isLoading } = useParkingZone(id || 0);
  
  const [form, setForm] = useState({ pz_name: '', pz_capacity: '' });

  useEffect(() => {
    if (zone && mode === 'edit') {
      setForm({ pz_name: zone.pz_name, pz_capacity: String(zone.pz_capacity) });
    }
  }, [zone, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const capacity = Number(form.pz_capacity);
    if (capacity <= 0) { alert('Місткість повинна бути додатнім числом!'); return; }

    createMutation.mutate({ pz_name: form.pz_name, pz_capacity: capacity }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const capacity = Number(form.pz_capacity);
    if (capacity <= 0) { alert('Місткість повинна бути додатнім числом!'); return; }

    updateMutation.mutate({ id, data: { pz_name: form.pz_name, pz_capacity: capacity } }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleClose = () => {
    // navigate back to /parkingzones without query params
    navigate({ to: '/parkingzones' });
    onClose();
  };

  if ((mode === 'view' || mode === 'edit') && isLoading) {
    return (
      <Modal title={mode === 'view' ? 'Перегляд зони' : 'Редагувати зону'} onClose={handleClose}>
        <div>Loading...</div>
      </Modal>
    );
  }

  if (mode === 'view') {
    return (
      <Modal title={`Зона #${id}`} onClose={handleClose}>
        {zone ? (
          <div>
            <p className="mb-2"><strong>Назва:</strong> {zone.pz_name}</p>
            <p className="mb-2"><strong>Місткість:</strong> {zone.pz_capacity}</p>
          </div>
        ) : (
          <div>Зона не знайдена</div>
        )}
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={handleClose}>Закрити</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={mode === 'create' ? 'Створити зону' : `Редагувати зону #${id}`} onClose={handleClose}>
      <form onSubmit={mode === 'create' ? handleCreate : handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Назва зони</label>
          <input
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
            name="pz_name"
            placeholder="Введіть назву"
            type="text"
            value={form.pz_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Місткість</label>
          <input
            required
            className="border border-gray-300 rounded-lg p-2 w-full"
            name="pz_capacity"
            placeholder="Введіть кількість місць"
            type="number"
            value={form.pz_capacity}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={createMutation.isPending || updateMutation.isPending}
            type="submit"
          >
            {mode === 'create' ? (createMutation.isPending ? 'Створення...' : 'Створити') : (updateMutation.isPending ? 'Збереження...' : 'Зберегти')}
          </button>

          <button className="px-4 py-2 border rounded" type="button" onClick={handleClose}>Скасувати</button>
        </div>
      </form>
    </Modal>
  );
};

export default ParkingZoneModal;
