"use client"

import { Button } from "@/components/ui/button"
import { Play, Star, Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { DynamicBackground } from "@/components/dynamic-background"

export function HeroSection() {
  return (
    <DynamicBackground 
      section="hero" 
      className="min-h-screen flex items-center justify-center overflow-hidden"
    >
      <section id="home" className="w-full">
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 relative z-20"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Create Unforgettable
              </motion.h1>
              
              <motion.div
                className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="gradient-text-animated">
                  Experiences
                </span>
              </motion.div>
            </div>

            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Professional DJ services, premium sound systems, stunning lighting, and complete event solutions for your
              <span className="text-purple-300 font-semibold"> special moments</span>.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Book Your Event
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full bg-transparent backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-gray-200 font-medium">Events Completed</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-gray-200 font-medium">Happy Clients</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">5+</div>
                <div className="text-gray-200 font-medium">Years Experience</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10 shadow-lg">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>
    </DynamicBackground>
  )
}
