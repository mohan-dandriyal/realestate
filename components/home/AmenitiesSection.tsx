'use client'

import Image from 'next/image'
import React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Building2, Dumbbell, ToyBrick, Waves, type LucideIcon } from 'lucide-react'
import MainContainer from '../ui/MainContainer'
import data from '@/data/landing.json' // contains the "amenities" block from amenities.json
import { SectionDescription, SectionEyebrow, SectionTitle } from '../ui/layout'

// Icon names used in the JSON -> lucide components. Add more here when you add amenities.
const icons: Record<string, LucideIcon> = {
    waves: Waves,
    dumbbell: Dumbbell,
    building: Building2,
    play: ToyBrick,
}

const ease = [0.22, 1, 0.36, 1] as const

function AmenitiesSection() {
    const { eyebrow, title, subtitle, items } = data.amenities
    const reduce = useReducedMotion()

    const header: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
    }

    const grid: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
    }
    const card: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }

    return (
        <section id='amenities' className='relative w-full overflow-hidden bg-[#fffdfb] py-16 md:py-18'>

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
                        <SectionEyebrow className='sm:text-right sm:mx-auto'>
                            {eyebrow}
                        </SectionEyebrow>
                    </div>


                    <div>
                        <SectionTitle className=''>
                            {title}
                        </SectionTitle>
                    </div>

                    <div className='sm:text-center'>
                        <SectionDescription className='sm:text-center mx-auto'>
                            {subtitle}
                        </SectionDescription>
                    </div>


                </motion.div>

                {/* ---------- Cards ---------- */}
                <motion.ul
                    className='relative mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7'
                    variants={grid}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {items.map((item) => {
                        const Icon = icons[item.icon] || Building2
                        return (
                            <motion.li
                                key={item.title}
                                variants={card}
                                whileHover={reduce ? undefined : { y: -8 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                style={{
                                    backgroundImage : `url(${item.image})`,
                                    backgroundSize : "cover",
                                    backgroundPosition : "center"
                                }}
                                className='group rounded-2xl overflow-hidden bg-[#fbf3ec] shadow-[0_10px_30px_rgba(120,80,30,0.15)]  h-[300px] hover:shadow-[0_18px_40px_rgba(120,80,30,0.25)] transition-shadow duration-300  relative'
                            >
                                {/* <div className='relative aspect-[2/1] sm:aspect-[16/10] h-[300px] lg:aspect-[2/1] overflow-hidden'>
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fill
                                        sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
                                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                                    />
                                </div> */}

                                {/* <div className=' a absolute top-0 left-0 w-full h-full bg-black/20 group-hover:opacity-0 duration-300' /> */}

                                <div className='absolute bottom-2 px-3 h-16 w-[95%] bg-white flex items-center justify-center gap-4 rounded-xl '
                                    style={{
                                        left: "50%",
                                        transform: "translateX(-50%)"
                                    }}>
                                    <Icon
                                        size={25}
                                        strokeWidth={1.4}
                                        className='shrink-0 text-[#9c5a12] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6'
                                    />
                                    <span className='font-poppins font-semibold text-[#1b1d33] leading-tight'>
                                        {item.title}
                                    </span>
                                </div>
                            </motion.li>
                        )
                    })}
                </motion.ul>
            </MainContainer>
        </section>
    )
}

export default AmenitiesSection