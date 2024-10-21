import { useState } from "react";
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);
  const [filters, setFilters] = useState({
    keywords: ["Math", "Starbucks", "Pick-up"],
    categories: ["Food Delivery", "Tutoring", "Other"],
    priceRange: [0, 100],
    distance: [0, 25],
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <main className="container mx-auto px-4 py-8">
        {/* Top Section: Search Bar & Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
          />
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-200 rounded-lg">+ New</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">Price ascending</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">Price descending</button>
          </div>
        </div>

        {/* Main Section: Filters and Cards */}
        <div className="flex space-x-8">
          {/* Filter Section */}
          <div className="w-1/4 p-4 bg-white shadow rounded-lg">
            <h3 className="font-bold mb-4">Keywords</h3>
            <div className="flex flex-wrap mb-4 space-x-2">
              {filters.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <h3 className="font-bold mb-4">Categories</h3>
            {filters.categories.map((category, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked
                  className="mr-2"
                  id={category}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}

            <h3 className="font-bold mt-4 mb-2">Price</h3>
            <input
              type="range"
              min={0}
              max={100}
              value={filters.priceRange[1]}
              className="w-full mb-4"
              onChange={(e) =>
                setFilters({ ...filters, priceRange: [0, e.target.value] })
              }
            />
            <span className="text-sm">${filters.priceRange[0]}-${filters.priceRange[1]}</span>

            <h3 className="font-bold mt-4 mb-2">Distance</h3>
            <input
              type="range"
              min={0}
              max={25}
              value={filters.distance[1]}
              className="w-full"
              onChange={(e) =>
                setFilters({ ...filters, distance: [0, e.target.value] })
              }
            />
            <span className="text-sm">{filters.distance[0]}-{filters.distance[1]} mi</span>
          </div>

          {/* Cards Section */}
          <div className="w-3/4 grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="font-bold mb-2">Title</h3>
                <p className="text-sm mb-2">Subtitle</p>
                <p className="font-bold text-lg mb-4">$0</p>
                <p className="text-sm">11/22/2002</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
