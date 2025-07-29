"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Music, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    const handleSectionChange = () => {
      const sections = ["home", "about", "services", "packages", "gallery", "testimonials", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("scroll", handleSectionChange)
    handleSectionChange() // Set initial active section

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleSectionChange)
    }
  }, [])

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Packages", href: "#packages", id: "packages" },
    { name: "Gallery", href: "#gallery", id: "gallery" },
    { name: "Testimonials", href: "#testimonials", id: "testimonials" },
    { name: "Contact", href: "#contact", id: "contact" },
  ]

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Music className={`h-10 w-10 transition-colors duration-300 ${
                  scrolled ? "text-purple-600" : "text-white"
                }`} />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <span className={`font-bold text-2xl transition-colors duration-300 ${
                scrolled ? "text-gray-900" : "text-white"
              }`}>
                Seeker's Entertainment
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleSmoothScroll(item.href)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                    activeSection === item.id
                      ? scrolled
                        ? "text-purple-600"
                        : "text-white"
                      : scrolled
                      ? "text-gray-700 hover:text-purple-600"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.name}
                  {/* Active indicator */}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute inset-0 rounded-full ${
                        scrolled 
                          ? "bg-purple-100 border border-purple-200" 
                          : "bg-white/20 border border-white/30"
                      }`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    scrolled 
                      ? "bg-purple-50 border border-purple-100" 
                      : "bg-white/10 border border-white/20"
                  }`} />
                  {/* <span className="relative z-10">{item.name}</span> */}
                </button>
              </motion.div>
            ))}
            
            {/* Admin Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="ml-6"
            >
              <Link href="/admin">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`relative overflow-hidden group transition-all duration-300 border-2 ${
                    scrolled
                      ? "border-purple-200 text-purple-600 hover:border-purple-300 bg-white/50"
                      : "border-white/30 text-white hover:border-white/50 bg-white/10"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Admin
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-all duration-300 ${
                scrolled
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              }`}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-20 right-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
            >
              <div className="p-6">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleSmoothScroll(item.href)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        activeSection === item.id ? "text-purple-600" : "text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1"
                      }`} />
                    </motion.button>
                  ))}
                </div>
                
                {/* Admin Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <Link href="/admin" onClick={() => setIsOpen(false)}>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Admin Panel
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
