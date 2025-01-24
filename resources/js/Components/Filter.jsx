import React, { useState } from "react";
import { Filter } from "lucide-react";

export default function FilterDropdown({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  fetchDomains,
}) {
  const [sliderOpen, setSliderOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex py-3 px-2 bg-gray-200 rounded-lg"
        onClick={() => setSliderOpen(!sliderOpen)}
      >
        Price Range
        <Filter size={24} className="ms-2" />
      </button>
      {sliderOpen && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg p-3 w-64 shadow-md">
          <label className="block mb-1 text-sm font-semibold">
            Minimum Price
          </label>
          <input
            type="range"
            min="0"
            max="7000000"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full mb-2"
          />
          <p className="text-sm text-gray-700 mb-3">
            Rp {parseInt(minPrice, 10).toLocaleString("id-ID")}
          </p>

          <label className="block mb-1 text-sm font-semibold">
            Maximum Price
          </label>
          <input
            type="range"
            min="0"
            max="7000000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full mb-2"
          />
          <p className="text-sm text-gray-700 mb-3">
            Rp {parseInt(maxPrice, 10).toLocaleString("id-ID")}
          </p>

          <button
            onClick={() => {
              setSliderOpen(false);
              fetchDomains(1);
            }}
            className="w-full bg-black text-white px-3 py-2 rounded-md font-semibold"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
