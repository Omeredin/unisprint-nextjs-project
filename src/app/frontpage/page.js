'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'



export default function FrontPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    keywords: ["Math", "Starbucks", "Pick-up"],
    categories: ["Food Delivery", "Tutoring", "Other"],
    priceRange: [0, 100],
    distance: [0, 25],
  })

  useEffect(() => {
    // Check for token in search params
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl)
      router.push('/frontpage') // Use push instead of replace in App Router
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/') // Redirect to login page if no token
      return
    }

    // Verify token and get user data
    axios.get('http://localhost:3001/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true
    })
    .then(response => {
      setUser(response.data)
    })
    .catch(() => {
      localStorage.removeItem('token')
      router.push('/')
    })
    .finally(() => {
      setLoading(false)
    })
  }, [router, searchParams])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Loading user information...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-500">UniSprint</h1>
          <div className="flex items-center space-x-4">
            <span className="text-blue-500">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Top Section: Search Bar & Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg text-black"
          />
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-black rounded-lg">
              + New
            </button>
            <button className="px-4 py-2 bg-black rounded-lg">
              Price ascending
            </button>
            <button className="px-4 py-2 bg-black rounded-lg hover:bg-gray-300">
              Price descending
            </button>
          </div>
        </div>

        {/* Main Section: Filters and Cards */}
        <div className="flex space-x-8">
          {/* Filter Section */}
          <div className="w-1/4 p-4 bg-white shadow rounded-lg text-black">
            <h3 className="font-bold mb-4">Keywords</h3>
            <div className="flex flex-wrap gap-2 mb-4">
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
                  defaultChecked
                  className="mr-2"
                  id={`category-${index}`}
                />
                <label htmlFor={`category-${index}`}>{category}</label>
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
                setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })
              }
            />
            <span className="text-sm">
              ${filters.priceRange[0]}-${filters.priceRange[1]}
            </span>

            <h3 className="font-bold mt-4 mb-2">Distance</h3>
            <input
              type="range"
              min={0}
              max={25}
              value={filters.distance[1]}
              className="w-full"
              onChange={(e) =>
                setFilters({ ...filters, distance: [0, parseInt(e.target.value)] })
              }
            />
            <span className="text-sm">
              {filters.distance[0]}-{filters.distance[1]} mi
            </span>
          </div>

          {/* Cards Section */}
          <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow text-black">
                <h3 className="font-bold mb-2">Title</h3>
                <p className="text-sm mb-2">Subtitle</p>
                <p className="font-bold text-lg mb-4">$0</p>
                <p className="text-sm">01/01/9999</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}