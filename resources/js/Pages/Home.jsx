import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { CheckCircle, ChevronDown, CircleX, ShoppingCart } from "lucide-react";
import CardDomain from "../Components/CardDomain";
import axios from "axios";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [domains, setDomains] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const [categories, setCategories] = useState([]);
  const [whoisBuffer, setWhoisBuffer] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchDomains = async (pageNum = 1) => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/search", {
        keyword: keyword.trim(),
        page: pageNum,
      });
      const data = response.data;

      setSpotlight(data.spotlight);
      setHasMore(data.hasMore);

      if (pageNum === 1) {
        setDomains(
          data.suggestions.map((domain) => ({
            ...domain,
            status: "checking",
          }))
        );
      } else {
        setDomains((prev) => [
          ...prev,
          ...data.suggestions.map((domain) => ({
            ...domain,
            status: "checking",
          })),
        ]);
      }

      setCategories(data.categories);

      // Start checking WHOIS for new suggestions
      data.suggestions.forEach((domain) => {
        checkWhois(domain.domain);
      });
    } catch (error) {
      setError("Failed to fetch domains");
      console.error("Error fetching domains:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDomains(nextPage);
  };

  const checkWhois = async (domain) => {
    if (whoisBuffer[domain]) return;

    try {
      const response = await axios.post("/check-whois", { domain });
      const status = response.data.data.is_available
        ? "available"
        : "not_available";

      setWhoisBuffer((prev) => ({
        ...prev,
        [domain]: { status },
      }));
    } catch (error) {
      setWhoisBuffer((prev) => ({
        ...prev,
        [domain]: { status: "error" },
      }));
    }
  };

  return (
    <>
      <header className="shadow-md flex flex-col justify-center items-center">
        <Navbar />
        <div className="flex flex-row min-w-[70%] mb-8 mt-12">
          <input
            type="text"
            className="min-w-[85%] border-2 border-gray-400 h-14 px-5 rounded-md"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="min-w-[15%] ms-3 bg-black rounded-md text-white px-3 py-1 font-semibold"
            onClick={() => fetchDomains(1)}
          >
            Cek Domain
          </button>
        </div>
      </header>

      <div className="min-h-screen mx-auto max-w-7xl py-8">
        {spotlight && (
          <>
            {spotlight.desiredDomain && (
              <div className="bg-white border-2 rounded-t-lg border-gray-200 p-8 flex justify-between">
                <div className="flex flex-row gap-3 justify-start">
                  <div className="gray-300 flex flex-row justify-center items-center">
                    <CircleX size={20} className="me-1" />{" "}
                    <p>{spotlight.desiredDomain}</p>
                  </div>
                  <p className="text-red-500">Domain tidak tersedia</p>
                </div>
              </div>
            )}
            <div
              className={`bg-green-50 border-green-200 p-8 flex justify-between ${
                spotlight.status === "available"
                  ? " border-2 rounded-b-lg"
                  : "rounded-lg"
              }`}
            >
              <div className="flex">
                <CheckCircle className="text-green-500" size={32} />
                <div className="flex flex-col ms-3">
                  <div className="text-sm text-green-500">
                    {spotlight.desiredDomain
                      ? "Rekomendasi Ekstensi Domain Terbaik!"
                      : "Selamat Domain yang kamu cari tersedia!"}
                  </div>
                  <div className="text-xl font-bold">{spotlight.domain}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Suggestions Section */}
        <div className="flex flex-row mt-5">
          <div className="min-w-[30%]">
            <p className="text-gray-500 mb-8">Filter Berdasarkan Kategori</p>
          </div>
          <div className="min-w-[70%]">
            <h1 className="text-2xl font-bold mb-8">Rekomendasi Domain</h1>
            <div className="flex flex-col">
              {domains.map((domain) => (
                <CardDomain
                  key={domain.domain}
                  domain={domain.domain}
                  price={domain.price}
                  status={whoisBuffer[domain.domain]?.status || "checking"}
                  checkWhois={() => checkWhois(domain.domain)}
                />
              ))}

              {hasMore && (
                <button
                  className="bg-neutral-900 rounded-xl py-2 w-full text-white flex justify-center items-center font-semibold"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    "Memuat..."
                  ) : (
                    <>
                      Tampilkan lebih banyak domain
                      <ChevronDown size={20} className="ms-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
