import { useState, useEffect } from 'react';
import axiosClient from '../services/axiosClient';

export default function Header() {
  const [announcement, setAnnouncement] = useState('🔥 FREE SHIPPING ABOVE INR 1499');

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const response = await axiosClient.get('/settings');
      if (response.data?.announcement) {
        setAnnouncement(response.data.announcement);
      }
    } catch (err) {
      console.error('Failed to load header settings:', err);
    }
  };

  return (
    <div className="bg-zinc-950 text-white text-[10px] sm:text-xs px-4 py-2.5 flex items-center justify-center font-bold tracking-widest shrink-0 uppercase border-b border-zinc-900 select-none">
      {announcement}
    </div>
  );
}
