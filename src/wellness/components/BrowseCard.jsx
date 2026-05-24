import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const packages = [
  {
    title: 'Diabetes Care Bundle',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=600&auto=format&fit=crop',
    originalPrice: 'RM 399.00',
    salePrice: 'RM 279.30',
    discount: '30% Off',
  },
  {
    title: 'Cardiac Risk Screening',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=600&auto=format&fit=crop',
    originalPrice: null,
    salePrice: 'RM 1,200.00',
    discount: null,
  },
  {
    title: 'Kidney Function Panel',
    image: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=600&auto=format&fit=crop',
    originalPrice: 'RM 580.00',
    salePrice: 'RM 464.00',
    discount: '20% Off',
  },
  {
    title: 'Comprehensive Metabolic Screen',
    image: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=600&auto=format&fit=crop',
    originalPrice: 'RM 1,199.00',
    salePrice: 'RM 959.20',
    discount: '20% Off',
  },
]

export function BrowseCard() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState)
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="w-full space-y-3"
    >
      {/* Section header — padded inline */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-brown-800">Care Packages</h2>
        <button className="text-sm font-medium text-sage-500 flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0">
          See all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal swipe strip — bleeds to edges via negative margin */}
      <div className="relative -mx-5">
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-3 px-5 pb-3 pt-1" style={{ width: 'max-content' }}>
            {packages.map((pkg, i) => (
              <button
                key={i}
                className="flex-shrink-0 w-44 text-left group active:scale-[0.98] transition-transform"
              >
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden bg-brown-100 shadow-soft mb-3">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {pkg.discount && (
                    <span className="absolute top-0 right-0 bg-terracotta-500 text-white text-xs font-semibold px-2.5 py-1 rounded-bl-xl shadow-sm">
                      {pkg.discount}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-brown-800 leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem]">
                  {pkg.title}
                </h3>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  {pkg.originalPrice && (
                    <span className="text-xs text-brown-400 line-through">
                      {pkg.originalPrice}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-terracotta-500">
                    {pkg.salePrice}
                  </span>
                </div>
              </button>
            ))}
            {/* Trailing spacer so last card clears the edge */}
            <div className="w-1 flex-shrink-0" />
          </div>
        </div>

        {/* Left fade + chevron */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-16 bg-gradient-to-r from-card to-transparent flex items-center justify-start pl-2">
            <div className="w-7 h-7 rounded-full bg-white shadow-soft border border-brown-100/60 flex items-center justify-center">
              <svg className="w-4 h-4 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        )}

        {/* Right fade + chevron */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-16 bg-gradient-to-l from-card to-transparent flex items-center justify-end pr-2">
            <div className="w-7 h-7 rounded-full bg-white shadow-soft border border-brown-100/60 flex items-center justify-center">
              <svg className="w-4 h-4 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BrowseCard
