'use client'

import Image from 'next/image'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import MainContainer from '../ui/MainContainer'
import data from '@/data/landing.json' // contains the "testimonials" block from testimonials.json
import { SectionDescription, SectionEyebrow, SectionTitle } from '../ui/layout'

const ease = [0.22, 1, 0.36, 1] as const
const subscribeToNothing = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

// 1 card on phones/tablets, 2 cards from the lg breakpoint (only used to compute the number of dots)
function usePerView() {
    const [perView, setPerView] = useState(1)
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const update = () => setPerView(mq.matches ? 2 : 1)
        update()
        mq.addEventListener('change', update)
        return () => mq.removeEventListener('change', update)
    }, [])
    return perView
}

const ArrowBtn = ({
    dir,
    onClick,
    className = '',
}: {
    dir: 'prev' | 'next'
    onClick: () => void
    className?: string
}) => (
    <motion.button
        type='button'
        onClick={onClick}
        aria-label={dir === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className={`h-12 w-12 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full border border-[#d79a1e] bg-white text-[#1b1d33] shadow-sm hover:bg-[#fbf3ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9902a] transition-colors ${className}`}
    >
        {dir === 'prev' ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
    </motion.button>
)

function TestimonialsSection() {
    const { eyebrow, title, subtitle, items, autoplayMs, backgroundImage } = data.testimonials
    const reduce = useReducedMotion()
    const perView = usePerView()

    const mounted = useSyncExternalStore(subscribeToNothing, getClientSnapshot, getServerSnapshot)

    const positions = Math.max(1, items.length - perView + 1) // slides one card at a time
    const [index, setIndex] = useState(0)
    const [swiper, setSwiper] = useState<SwiperType | null>(null)

    const next = () => swiper?.slideNext()
    const prev = () => swiper?.slidePrev()

    // keep the active dot valid when the layout switches between 1 and 2 cards
    useEffect(() => {
        if (swiper && swiper.activeIndex > positions - 1) swiper.slideTo(positions - 1)
    }, [positions, swiper])

    const header: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
    const lineGrow: Variants = {
        hidden: reduce ? {} : { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 0.8, ease } },
    }
    const reveal: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
    }

    return (
        <section id='testimonials' className='relative w-full overflow-hidden bg-[#fffaf5] py-16 md:py-18'>
            {/* faint building in the background, top right (optional) */}
            {backgroundImage && (
                <div className='pointer-events-none absolute right-0 top-0 hidden h-[65%] w-[35%] opacity-[0.12] lg:block' aria-hidden>
                    <Image src={backgroundImage} alt='' fill sizes='35vw' className='object-contain object-right-top' />
                </div>
            )}

            <MainContainer className=''>
                {/* ---------- Heading ---------- */}
                <motion.div
                    className='relative sm:text-center max-w-3xl mx-auto'
                    variants={header}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <div className='flex sm:justify-center'>
                        <SectionEyebrow className='sm:text-right sm:mx-auto'>{eyebrow}</SectionEyebrow>
                    </div>
                    <div>
                        <SectionTitle className=''>{title}</SectionTitle>
                    </div>
                    <div className='sm:text-center'>
                        <SectionDescription className='sm:text-center  sm:mx-auto'>{subtitle}</SectionDescription>
                    </div>
                    <motion.div variants={lineGrow} className='sm:mx-auto  sm:mt-5 mt-2 h-[4px] w-24 rounded-full bg-[#c9902a]' />
                </motion.div>

                {/* ---------- Slider ---------- */}
                <motion.div
                    variants={reveal}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.2 }}
                    className='relative mt-10 md:mt-10 lg:px-20'
                    // pause autoplay while a card is focused (hover is handled by Swiper's pauseOnMouseEnter)
                    onFocus={() => swiper?.autoplay?.stop()}
                    onBlur={() => !reduce && autoplayMs && swiper?.autoplay?.start()}
                    role='region'
                    aria-roledescription='carousel'
                    aria-label='Client testimonials'
                >
                    {/* side arrows (desktop) */}
                    <ArrowBtn dir='prev' onClick={prev} className='hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10' />
                    <ArrowBtn dir='next' onClick={next} className='hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10' />
                    {
                        mounted  ? 
                    <Swiper
                        modules={[Autoplay, A11y, Keyboard]}
                        onSwiper={setSwiper}
                        onSlideChange={(s) => setIndex(s.activeIndex)}
                        slidesPerView={1}
                        breakpoints={{ 1024: { slidesPerView: 2 } }}
                        slidesPerGroup={1}
                        spaceBetween={0}
                        speed={reduce ? 0 : 600}
                        rewind // wraps from last back to first, like the old slider
                        grabCursor
                        keyboard={{ enabled: true }}
                        autoplay={
                            reduce || !autoplayMs
                                ? false
                                : { delay: autoplayMs, disableOnInteraction: false, pauseOnMouseEnter: true }
                        }
                        a11y={{ slideLabelMessage: 'Testimonial {{index}} of {{slidesLength}}' }}
                        className='-my-6 py-6' // room for the card shadow, since Swiper clips overflow
                    >
                        {items.map((t, i) => (
                             <SwiperSlide className='' key={i+1}>
                                <div className='flex  sm:px-5 sm:py-6 p-3'>
                                    <article key={i+1} className='relative flex w-full flex-col overflow-hidden rounded-3xl bg-white p-6 sm:p-9 shadow-lg sm:shadow-xl'>
                                        {/* gold curved corner */}
                                        <svg
                                            className='pointer-events-none absolute right-0 top-0 h-20 w-28 sm:h-24 sm:w-36'
                                            viewBox='0 0 140 100'
                                            aria-hidden
                                        >
                                            <defs>
                                                <linearGradient id={`corner-${i}`} x1='0' y1='0' x2='1' y2='1'>
                                                    <stop offset='0%' stopColor='#f5cf63' />
                                                    <stop offset='100%' stopColor='#c9902a' />
                                                </linearGradient>
                                            </defs>
                                            <path d='M0 0 H140 V100 C128 45 70 6 0 0 Z' fill={`url(#corner-${i})`} />
                                        </svg>

                                        <span aria-hidden className='font-playfair text-7xl sm:text-8xl leading-[0.6] h-8 sm:h-10 text-[#d79a1e] select-none'>
                                            &ldquo;
                                        </span>

                                        <blockquote className='relative mt-3 flex-1 font-poppins text-sm sm:text-base leading-relaxed text-[#1b1d33]'>
                                            {t.quote}
                                        </blockquote>

                                        <div className='mt-6 flex items-center gap-4 border-t border-[#efe3d6] pt-5'>
                                            <div className='relative h-16 w-16 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#d79a1e]'>
                                                <Image src={t.avatar} alt={t.name} fill sizes='70px' className='object-cover' />
                                            </div>

                                            <div className='min-w-0 flex-1'>
                                                <p className='font-poppins font-bold text-lg sm:text-xl text-[#14182b] truncate'>{t.name}</p>
                                                <p className='font-poppins text-sm sm:text-base tracking-wide text-[#5a5d6e]'>{t.role}</p>
                                            </div>

                                            <div className='flex gap-0.5 sm:gap-1' aria-label={`${t.rating} out of 5 stars`}>
                                                {Array.from({ length: 5 }).map((_, s) => (
                                                    <Star
                                                        key={s}
                                                        size={20}
                                                        className={`h-4 w-4 sm:h-5 sm:w-5 ${s < t.rating ? 'fill-[#f5b800] text-[#f5b800]' : 'text-[#e4d6c4]'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>:
                      <div className='min-h-[420px]' aria-hidden />
                    }

                    {/* arrows (mobile/tablet) + dots */}
                    <div className='mt-8 flex items-center justify-center gap-5'>
                        <ArrowBtn dir='prev' onClick={prev} className='flex lg:hidden' />

                        <div className='flex items-center gap-3'>
                            {Array.from({ length: positions }).map((_, i) => (
                                <motion.button
                                    key={i}
                                    type='button'
                                    onClick={() => swiper?.slideTo(i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    aria-current={i === index}
                                    animate={{ scale: i === index ? 1.35 : 1 }}
                                    className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                                        i === index ? 'bg-[#c9902a]' : 'bg-[#ecd9bd] hover:bg-[#dcc196]'
                                    }`}
                                />
                            ))}
                        </div>

                        <ArrowBtn dir='next' onClick={next} className='flex lg:hidden' />
                    </div>
                </motion.div>
            </MainContainer>
        </section>
    )
}

export default TestimonialsSection