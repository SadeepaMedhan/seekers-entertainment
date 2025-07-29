"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "Priya & Rahul Sharma",
    event: "Wedding Reception",
    rating: 5,
    content:
      "Seeker's Entertainment made our wedding absolutely magical! The DJ kept everyone dancing all night, and the lighting setup was breathtaking. Highly recommended!",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Amit Patel",
    event: "Corporate Event",
    rating: 5,
    content:
      "Professional service from start to finish. The sound quality was crystal clear for our conference, and the LED screens worked perfectly for our presentations.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Sneha Gupta",
    event: "Birthday Party",
    rating: 5,
    content:
      "Amazing experience! The team was punctual, professional, and created the perfect atmosphere for my daughter's 16th birthday. The kids loved the music selection.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Rajesh Kumar",
    event: "Anniversary Celebration",
    rating: 5,
    content:
      "Exceeded our expectations! The decoration was elegant, the music was perfect, and the photography captured every precious moment beautifully.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Meera Singh",
    event: "Engagement Party",
    rating: 5,
    content:
      "The team understood our vision perfectly and brought it to life. The lighting effects and sound quality made our engagement party unforgettable.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Vikram Joshi",
    event: "Product Launch",
    rating: 5,
    content:
      "Outstanding technical support and execution. The LED screens and audio setup were flawless for our product launch event. Very professional team.",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience with
            us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-primary/20 mr-2" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>

                  <div className="flex items-center">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.event}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
