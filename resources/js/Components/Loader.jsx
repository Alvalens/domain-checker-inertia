import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <Loader2 size={28} className="animate-spin text-neutral-900" />
    </div>
  );
}
