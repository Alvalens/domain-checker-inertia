import { CheckCircle, CircleX, ShoppingCart } from "lucide-react";
import React from "react";

export default function Splotlight({ spotlight }) {
  return (
    <>
      {spotlight.desiredDomain && (
        <div className="bg-white border-2 rounded-t-lg border-gray-200 p-4 sm:p-8 flex flex-col sm:flex-row justify-between">
          <div className="flex flex-col sm:flex-row gap-3 justify-start">
            <div className="gray-300 flex flex-row justify-center items-center">
              <CircleX size={20} className="me-1" />{" "}
              <p>{spotlight.desiredDomain}</p>
            </div>
            <p className="text-red-500">Domain tidak tersedia</p>
          </div>
        </div>
      )}
      <div
        className={`bg-green-50 border-green-200 p-4 sm:p-8 flex flex-col sm:flex-row justify-between ${
          spotlight.status === "available"
            ? " border-2 rounded-b-lg"
            : "rounded-lg"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <CheckCircle className="text-green-500" size={32} />
          <div className="flex flex-col ms-0 sm:ms-3 mt-2 sm:mt-0">
            <div className="text-sm text-green-500">
              {spotlight.hasExtension && !spotlight.desiredDomain
                ? "Selamat Domain yang kamu cari tersedia!"
                : "Rekomendasi Ekstensi Domain Terbaik!"}
            </div>
            <div className="text-xl font-bold">{spotlight.domain}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <div
              className={`text-white text-xs ${
                spotlight.gimmick_price ? "bg-blue-500" : "bg-green-500"
              } px-2 py-1`}
            >
              {spotlight.gimmick_price ? "PROMO" : "BEST DEAL"}
            </div>
            <p>
              <div className="font-semibold flex items-center gap-2">
                {spotlight.gimmick_price && (
                  <span className="line-through text-gray-400 text-sm">
                    {`Rp ${parseInt(spotlight.gimmick_price).toLocaleString(
                      "id-ID"
                    )}`}
                  </span>
                )}
                {`Rp ${parseInt(spotlight.price).toLocaleString("id-ID")}`}
                <span className="text-gray-500 text-sm">/thn</span>
              </div>
            </p>
          </div>
          <button className="flex flex-row justify-center items-center bg-orange-500 rounded-lg px-3 py-2 text-white">
            <ShoppingCart size={24} className="text-white me-3" />
            Tambah ke kerenjang
          </button>
        </div>
      </div>
    </>
  );
}
