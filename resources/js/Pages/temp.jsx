import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { CheckCircle, ChevronDown, CircleX, ShoppingCart } from "lucide-react";
import CardDomain from "../Components/CardDomain";
import { Inertia } from "@inertiajs/inertia";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [domains, setDomains] = useState([]);
  const [spotLight, setSplotLight] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchDomains = async () => {
    try {
      const response = await Inertia.post("/search", {
        keyword,
      });
      const data = response.data;
      setdomains(data.suggestions);
      setSplotLight(data.spotlight);
      setCategories(data.categories);
    } catch (error) {}
  };
  return (
    <>
      <header className="shadow-md flex flex-col justify-center items-center">
        <Navbar />
        <div className="flex flex-row min-w-[70%] mb-8 mt-12">
          <input
            type="text"
            className=" min-w-[85%] border-2 border-gray-400 h-14 px-5 rounded-md"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
          <button
            className="min-w-[15%] ms-3 bg-black rounded-md text-white px-3 py-1 font-semibold"
            onClick={fetchDomains}
          >
            Cek Domain
          </button>
        </div>
      </header>
      <div className="min-h-screen mx-auto max-w-7xl py-8">
        <div className="min-w-[70%]">
          <div className="bg-white border-2 rounded-t-lg border-gray-200 p-8 flex justify-between">
            <div className="flex flex-row gap-3 justify-start">
              <div className="gray-300 flex flex-row justify-center items-center">
                <CircleX size={20} className="me-1" /> <p>Placeholder.test</p>
              </div>
              <p className="text-red-500">Domain tidak tersedia</p>
            </div>
          </div>
          <div className="bg-green-50 border-2 rounded-b-lg border-green-200 p-8 flex justify-between">
            <div className="flex">
              <CheckCircle className="text-green-500" size={32} />
              <div className="flex flex-col ms-3">
                <div className="text-sm text-green-500">
                  Rekomendasi Ekstensi Domain Terbaik
                </div>
                <div className="text-xl font-bold">Placeholder.test</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-row justify-center items-center gap-5">
                <div className="text-white text-xs bg-blue-500 px-2 py-1">
                  PROMO
                </div>
                <p>
                  Rp. 200.000
                  <span className="text-xs text-gray-600">/tahun</span>
                </p>
              </div>
              <button className="flex flex-row justify-center items-center bg-orange-500 rounded-lg px-3 py-2 text-white">
                <ShoppingCart size={24} className="text-white me-3" />
                Tambah ke kerenjang
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-5">
          <div className="min-w-[30%]">
            <p className="text-gray-500 mb-8">Filter Berdasarkan Kategori</p>
          </div>
          <div className="min-w-[70%]">
            <h1 className="text-2xl font-bold mb-8">
              Rekomendasi domain lainnya
            </h1>
            <div className="flex flex-col">
              {domains.length > 0 &&
                domains.map(({ domain, price }) => (
                  <CardDomain domain={domain} price={price} />
                ))}
              <button className="bg-neutral-900 rounded-xl py-2 w-full text-white flex justify-center items-center font-semibold ">
                Tampilkan lebih banyak domain{" "}
                <ChevronDown size={20} className="ms-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
