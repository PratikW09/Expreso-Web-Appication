"use client";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for mobile menu

export default function Navbar() {
  // Dummy variable to check authentication status
  const [isAuth, setIsAuth] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/" className="text-3xl font-bold tracking-wide">
          MyApp
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {isAuth ? (
            <>
              <Link
                href="/"
                className="hover:text-gray-300 transition duration-200"
              >
                Home
              </Link>
              <Link
                href="/profile"
                className="hover:text-gray-300 transition duration-200"
              >
                Profile
              </Link>
              <Link
                href="/create"
                className="hover:text-gray-300 transition duration-200"
              >
                Create
              </Link>
              <button
                onClick={() => setIsAuth(false)}
                className="bg-red-500 px-5 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-gray-300 transition duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-gray-300 transition duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="flex flex-col space-y-4 p-6">
            {isAuth ? (
              <>
                <Link
                  href="/"
                  className="hover:text-gray-300 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/profile"
                  className="hover:text-gray-300 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/create-article"
                  className="hover:text-gray-300 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Create
                </Link>
                <button
                  onClick={() => {
                    setIsAuth(false);
                    setIsOpen(false);
                  }}
                  className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-gray-300 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hover:text-gray-300 transition duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
