import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { CheckCircle, ChevronDown, CircleX, ShoppingCart } from "lucide-react";
import CardDomain from "../Components/CardDomain";
import axios from "axios";
import Splotlight from "../Components/Splotlight";
import Loader from "../Components/Loader";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [domains, setDomains] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategotry] = useState("");
  const [whoisBuffer, setWhoisBuffer] = useState({});
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchDomains = async (pageNum = 1) => {
    if (!keyword.trim()) return;

    if (pageNum === 1) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await axios.post("/search", {
        keyword: keyword.trim(),
        page: pageNum,
        category: selectedCategory,
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

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    await fetchDomains(nextPage);
    setLoadingMore(false);
  };

  const changeCategory = (category) => {
    setSelectedCategotry(category);
    fetchDomains(1);
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
        <div className="flex flex-col sm:flex-row min-w-[90%] sm:min-w-[70%] mb-8 mt-12">
          <input
            type="text"
            className="flex-grow border-2 border-gray-400 h-14 px-5 rounded-md mb-4 sm:mb-0"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="sm:ml-3 bg-black rounded-md text-white px-3 py-1 font-semibold"
            onClick={() => fetchDomains(1)}
            {...(loading && { disabled: true })}
          >
            {loading ? "Memuat..." : "Cek Domain"}
          </button>
        </div>
      </header>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen mx-auto max-w-7xl py-8 px-4 sm:px-8">
          {spotlight && <Splotlight spotlight={spotlight} />}

          {/* Suggestions Section */}
          <div className="flex flex-col sm:flex-row mt-5">
            <div className="sm:min-w-[30%] mb-8 sm:mb-0">
              <p className="text-gray-500 mb-8">Filter Berdasarkan Kategori</p>
              <div className="flex flex-col pe-4">
                <button
                  className={`py-3 rounded-lg text-start ps-3 font-semibold ${
                    selectedCategory
                      ? "bg-none text-black"
                      : "bg-orange-50 text-orange-500"
                  }`}
                  onClick={() => changeCategory("")}
                >
                  Semua Kategori
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`py-3 rounded-lg text-start ps-3 font-semibold ${
                      selectedCategory === category
                        ? "bg-orange-50 text-orange-500"
                        : "bg-none text-black"
                    }`}
                    onClick={() => changeCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:min-w-[70%]">
              <h1 className="text-2xl font-bold mb-8">Rekomendasi Domain</h1>
              <div className="flex flex-col">
                {domains.map((domain) => (
                  <CardDomain
                    key={domain.domain}
                    domain={domain.domain}
                    price={domain.price}
                    gimmick_price={domain.gimmick_price}
                    status={whoisBuffer[domain.domain]?.status || "checking"}
                    checkWhois={() => checkWhois(domain.domain)}
                  />
                ))}

                {hasMore && (
                  <button
                    className="mt-3 bg-neutral-900 rounded-xl py-2 w-full text-white flex justify-center items-center font-semibold"
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
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
      )}
    </>
  );
}
