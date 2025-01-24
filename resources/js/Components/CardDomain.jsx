import { CheckCircle, CircleX, Loader2, ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";

export default function CardDomain({
  domain,
  price,
  status,
  checkWhois,
  gimmick_price,
}) {
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
        return null;
      case "not_available":
        return (
          <span className="text-red-500 text-sm">Domain Tidak Tersedia</span>
        );
      case "error":
        return <span className="text-yellow-500 text-sm">Gagal memeriksa</span>;
      case "checking":
      default:
        return <span className="text-blue-500 text-sm">Memeriksa...</span>;
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 justify-between w-full border-b-2 border-gray-300 p-3 ${
        status !== "available" ? "bg-orange-50 h-auto sm:h-16" : ""
      }`}
    >
      <div className="flex flex-row gap-3 items-center">
        {getStatusIcon()}
        <div className="flex flex-col">
          <p className="font-medium">{domain}</p>
        </div>
      </div>

      {status === "available" ? (
        <div className="flex flex-col sm:flex-row items-center gap-5 mt-3 sm:mt-0">
          {gimmick_price && (
            <span className="line-through text-gray-400 text-sm">
              {`Rp ${parseInt(gimmick_price).toLocaleString("id-ID")}`}
            </span>
          )}
          {price && (
            <div className="font-semibold">
              {`Rp ${parseInt(price).toLocaleString("id-ID")}`}
              <span className="text-gray-500 text-sm">/thn</span>
            </div>
          )}

          <button className="flex flex-row justify-center items-center bg-orange-500 rounded-lg px-3 py-2 text-white">
            <ShoppingCart size={24} className="text-white me-3" />
            Tambah ke keranjang
          </button>
        </div>
      ) : (
        <div className="flex items-center me-3">
          <p className="font-bold text-lg">
            {status !== "available" && getStatusText()}
          </p>
        </div>
      )}
    </div>
  );
}
