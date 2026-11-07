'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Bath, BedDouble, Building2, Fence, type LucideIcon } from 'lucide-react'
import MainContainer from '../ui/MainContainer'
import data from '@/data/landing.json' // contains the "floorPlans" block from floorplans.json
import { SectionDescription, SectionEyebrow, SectionTitle } from '../ui/layout'
import { PrimaryThemeButton } from '../ui/PrimaryButton'

// Icon names used in the JSON -> lucide components.
// (If your lucide-react version has no `Fence`, swap it for any other icon, e.g. LayoutGrid.)
const icons: Record<string, LucideIcon> = {
    bed: BedDouble,
    bath: Bath,
    balcony: Fence,
}

const ease = [0.22, 1, 0.36, 1] as const

function FloorPlanSection() {
    const { tabs, titleSuffix, cta, eyebrow, title, subtitle } = data.floorPlans
    const reduce = useReducedMotion()
    const [activeId, setActiveId] = useState(tabs[0].id)
    const active = tabs.find((t) => t.id === activeId) ?? tabs[0]


    const header: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
    }

    const reveal: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }
    const list: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
    }
    const item: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
    }

    // left / right arrow keys move between tabs
    const onTabKey = (e: React.KeyboardEvent, i: number) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
        const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
        setActiveId(tabs[next].id)
        document.getElementById(`tab-${tabs[next].id}`)?.focus()
    }

    return (
        <section id='floor-plans' className='relative w-full overflow-hidden bg-[#fffdfb] py-2'>
            <MainContainer className=''>
                {/* ---------- Tabs ---------- */}
                <motion.div
                    className='relative text-center max-w-3xl mx-auto'
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
                        <SectionTitle className='text-start sm:text-center'>
                            {title}
                        </SectionTitle>
                    </div>

                    <div className='sm:text-center'>
                        <SectionDescription className='text-start sm:text-center sm:mx-auto'>
                            {subtitle}
                        </SectionDescription>
                    </div>
                </motion.div>

                <motion.div
                    variants={reveal}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.3 }}
                    className='flex justify-center'
                >


                    <div
                        role='tablist'
                        aria-label='Apartment configurations'
                        className='relative flex w-full max-w-3xl rounded-2xl border border-[#efe3d6] bg-[#fbf3ec] shadow-sm md:mt-8 mt-5'
                    >
                        {tabs.map((tab, i) => {
                            const isActive = tab.id === activeId
                            return (
                                <button
                                    key={tab.id}
                                    id={`tab-${tab.id}`}
                                    role='tab'
                                    type='button'
                                    aria-selected={isActive}
                                    aria-controls={`panel-${tab.id}`}
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => setActiveId(tab.id)}
                                    onKeyDown={(e) => onTabKey(e, i)}
                                    className='relative flex-1 flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-5 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9902a]'
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId='floor-tab-pill'
                                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                                            className='absolute inset-0 rounded-xl bg-gradient-to-b from-[#f5cf63] to-[#d8a02f] shadow-lg'
                                        >
                                            {/* little pointer under the active tab */}
                                            <span className='absolute -bottom-1.5 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-[3px] bg-[#d8a02f]' />
                                        </motion.span>
                                    )}
                                    <Building2
                                        size={34}
                                        strokeWidth={1.4}
                                        className={`relative sm:block hidden z-10 h-7 w-7 sm:h-9 sm:w-9 transition-colors ${isActive ? 'text-[#2a1c05]' : 'text-[#c9902a]'}`}
                                    />

                                    <Building2
                                        size={34}
                                        strokeWidth={1.4}
                                        className={`relative block sm:hidden z-10 h-5 w-5 sm:h-9 sm:w-9 transition-colors ${isActive ? 'text-[#2a1c05]' : 'text-[#c9902a]'}`}
                                    />

                                    <span
                                        className={`relative z-10 font-poppins font-bold text-base sm:text-2xl transition-colors ${isActive ? 'text-[#161616]' : 'text-[#1b1d33]'}`}
                                    >
                                        {tab.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </motion.div>

                {/* ---------- Card ---------- */}
                <motion.div
                    variants={reveal}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.15 }}
                    className='mt-10 md:mt-10 overflow-hidden rounded-3xl border-3 border-[#efe3d6]/50 bg-[#fdf8f3]'
                >
                    <AnimatePresence mode='wait' initial={false}>
                        <motion.div
                            key={active.id}
                            id={`panel-${active.id}`}
                            role='tabpanel'
                            aria-labelledby={`tab-${active.id}`}
                            initial={reduce ? false : { opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduce ? undefined : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.35, ease }}
                            className='grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]'
                        >
                            {/* ----- left: details ----- */}
                            <motion.div
                                variants={list}
                                initial='hidden'
                                animate='show'
                                className='p-4 sm:p-10 lg:p-12 bg-gradient-to-br from-[#fbf3ec] to-[#fdf8f3]'
                            >
                                <motion.h2 variants={item} className='font-cormorant font-bold text-xl sm:text-4xl leading-tight'>
                                    <span className='text-[#c9902a] font-poppins text-lg sm:text-3xl font-cormorant'>{active.title?.slice(0, 2)}</span>{' '}
                                    <span className='text-[#c9902a] font-cormorant'>{active.title?.slice(2,)}</span>{' '}
                                    <span className='text-[#1b1d33]'>{titleSuffix}</span>
                                </motion.h2>

                                <motion.div variants={item} className='sm:mt-4 mt-2 h-[3px] sm:w-28 w-15 bg-[#c9902a] origin-left' />

                                <motion.p variants={item} className='font-poppins text-[#4a4d5e] text-sm sm:text-lg leading-relaxed sm:mt-6 mt-4 sm:max-w-[48ch]'>
                                    {active.description}
                                </motion.p>

                                {/* stats */}
                                <motion.ul variants={item} className='mt-8 grid grid-cols-3 divide-x divide-[#e4d6c4]'>
                                    {active.stats.map((s) => {
                                        const Icon = icons[s.icon] || BedDouble
                                        return (
                                            <li key={s.label} className='flex flex-col items-center text-center px-2'>
                                                <Icon size={40} strokeWidth={1.3} className='text-[#c9902a] block h-6 w-6 sm:h-10 sm:w-10' />

                                                <span className='font-poppins font-bold text-xl sm:text-2xl text-[#1b1d33] mt-2'>{s.value}</span>
                                                <span className='font-poppins text-xs sm:text-base text-[#1b1d33]'>{s.label}</span>
                                            </li>
                                        )
                                    })}
                                </motion.ul>

                                {/* areas */}
                                <motion.dl variants={item} className='mt-8 rounded-xl bg-[#f6ede3] px-4 sm:px-6 py-4 space-y-2.5'>
                                    {active.areas.map((a) => (
                                        <div key={a.label} className='flex items-baseline gap-3 font-poppins text-xs sm:text-base text-[#1b1d33]'>
                                            <dt>{a.label}</dt>
                                            <span aria-hidden className='flex-1 border-t-3 border-dotted border-[#cdbba5] -translate-y-1' />
                                            <dd className='font-semibold'>{a.value}</dd>
                                        </div>
                                    ))}
                                </motion.dl>

                                <motion.div 
                                variants={item} 
                                className='sm:mt-8 mt-5 flex justify-center lg:justify-start lg:pl-10'>
                                    <PrimaryThemeButton className='text-sm sm:text-xl'
                                        text={cta.label}
                                        href={cta.href} />
                                </motion.div>
                            </motion.div>

                            {/* ----- right: plan image ----- */}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, ease, delay: 0.15 }}
                                className='relative min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] sm:p-8 bg-white/60'
                            >
                                <div className='relative h-full w-full min-h-[280px] sm:min-h-[400px] lg:min-h-[480px]'>
                                    <Image
                                        src={active.image}
                                        alt={active.alt}
                                        fill
                                        sizes='(min-width: 1024px) 55vw, 100vw'
                                        className='object-contain'
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </MainContainer>
        </section>
    )
}

export default FloorPlanSection