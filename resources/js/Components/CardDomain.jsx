import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react'

export default function CardDomain({domain, price}) {
  const [loading, setLoading] = useState(true);
  // const checkWhoIs = async (){

  // }
  return (
    <div className="flex flex-row gap-3 justify-between w-full border-b-2 border-gray-300 h-12">
      <div className="flex flex-row gap-3 ">
        <CheckCircle className="text-green-500" size={20} />
        <p>{domain}</p>
      </div>
      <div></div>
    </div>
  );
}
