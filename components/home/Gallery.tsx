'use client'

import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { MoveRight, ZoomIn } from 'lucide-react'
import MainContainer from '../ui/MainContainer'
import data from '@/data/landing.json' // contains the "amenities" block from amenities.json
import { SectionDescription, SectionEyebrow, SectionTitle } from '../ui/layout'
import GalleryLightbox from "@/components/home/Gallerylightbox"
import { PrimaryThemeButton } from '../ui/PrimaryButton'

const ease = [0.22, 1, 0.36, 1] as const

function Gallery() {
    const { eyebrow, title, subtitle, items, cta } = data.gallery;
    const reduce = useReducedMotion()

    // index = which image is open (null = popup closed), dir = slide direction
    const [view, setView] = useState<{ index: number | null; dir: number }>({ index: null, dir: 1 })
    const close = useCallback(() => setView((v) => ({ ...v, index: null })), [])
    const navigate = useCallback((index: number, dir: number) => setView({ index, dir }), [])

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
        <section id='amenities' className='relative w-full overflow-hidden bg-[#fffdfb] py-16 md:py-24'>
            <MainContainer className=''>
                {/* ---------- Heading ---------- */}
                <motion.div
                    className='relative sm:text-center max-w-3xl sm:mx-auto'
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
                        <SectionDescription className='sm:text-center sm:mx-auto'>{subtitle}</SectionDescription>
                    </div>
                </motion.div>

                {/* ---------- Cards ---------- */}
                <motion.ul
                    className='relative mt-5 md:mt-10 grid grid-cols-2 lg:grid-cols-4 sm:gap-6 gap-3 lg:gap-7'
                    variants={grid}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.15 }}
                >
                    {items.map((item, i) => (
                        <motion.li
                            key={i+1}
                            variants={card}
                            whileHover={reduce ? undefined : { y: -8 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className='group relative rounded-2xl overflow-hidden bg-[#fbf3ec] shadow-[0_10px_30px_rgba(120,80,30,0.15)] hover:shadow-[0_18px_40px_rgba(120,80,30,0.25)] transition-shadow duration-300'
                        >
                            {/* the whole card is a button, so it works with keyboard + screen readers */}
                            <button
                                type='button'
                                onClick={() => setView({ index: i, dir: 1 })}
                                aria-label={`Open ${item.alt} in gallery`}
                                className='block w-full text-left cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9902a]'
                            >
                                <div className='relative sm:h-[300px] h-35 overflow-hidden'>
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fill
                                        sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
                                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                                    />
                                </div>

                                {/* dark tint (fades on hover). pointer-events-none so clicks reach the button */}
                                <div className='pointer-events-none absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-300' />

                                {/* zoom hint */}
                                <span className='pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300'>
                                    <span className='flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#9c5a12] shadow-lg'>
                                        <ZoomIn size={26} />
                                    </span>
                                </span>
                            </button>
                        </motion.li>
                    ))}
                </motion.ul>

                <div className='flex justify-center mt-8'>
                    <PrimaryThemeButton text={cta.label} href={cta.href} className='text-xl' rightIcon ={<MoveRight />} />
                </div>
                
            </MainContainer>

            {/* ---------- Popup ---------- */}
            <GalleryLightbox
                items={items.map((item) => ({ ...item, title: item.alt }))}
                index={view.index}
                direction={view.dir}
                onClose={close}
                onNavigate={navigate}
            />
        </section>
    )
}

export default Gallery