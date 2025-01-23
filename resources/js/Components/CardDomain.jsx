import { CheckCircle, CircleX, Loader2 } from "lucide-react";
import React, { useEffect } from "react";

export default function CardDomain({ domain, price, status, checkWhois }) {
  useEffect(() => {
    if (status === "checking") {
      checkWhois();
    }
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "available":
        return <CheckCircle className="text-green-500" size={20} />;
      case "not_available":
        return <CircleX className="text-red-500" size={20} />;
      case "error":
        return <CircleX className="text-yellow-500" size={20} />;
      case "checking":
      default:
        return <Loader2 className="text-blue-500 animate-spin" size={20} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "available":
        return <span className="text-green-500 text-sm">Tersedia</span>;
      case "not_available":
        return <span className="text-red-500 text-sm">Tidak Tersedia</span>;
      case "error":
        return <span className="text-yellow-500 text-sm">Gagal memeriksa</span>;
      case "checking":
      default:
        return <span className="text-blue-500 text-sm">Memeriksa...</span>;
    }
  };

  return (
    <div className="flex flex-row gap-3 justify-between w-full border-b-2 border-gray-300 p-3">
      <div className="flex flex-row gap-3 items-center">
        {getStatusIcon()}
        <div className="flex flex-col">
          <p className="font-medium">{domain}</p>
          {getStatusText()}
        </div>
      </div>
      <div className="flex items-center">
        {status === "available" && price && (
          <span className="font-semibold">{price}</span>
        )}
      </div>
    </div>
  );
}
