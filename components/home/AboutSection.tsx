'use client'

import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import MainContainer from '../ui/MainContainer'
import data from '@/data/landing.json' // contains the "about" block from about.json
import { SectionDescription, SectionSubTitle, SectionTitle } from '../ui/layout'

const ease = [0.22, 1, 0.36, 1] as const

function AboutSection() {
    const { eyebrow, title, subtitle, paragraphs, images } = data.about
    const reduce = useReducedMotion()

    const stagger: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
    }
    const fadeUp: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }
    const lineGrow: Variants = {
        hidden: reduce ? {} : { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 0.8, ease } },
    }
    const tanBlock: Variants = {
        hidden: reduce ? {} : { opacity: 0, x: -40 },
        show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } },
    }
    const mainImage: Variants = {
        hidden: reduce ? {} : { opacity: 0, x: -50, clipPath: 'inset(0 100% 0 0)' },
        show: { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', transition: { duration: 1, ease, delay: 0.15 } },
    }
    const secondImage: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 70, scale: 0.94 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease, delay: 0.45 } },
    }

    const viewport = { once: true, amount: 0.25 }

    return (
        <section id='about' className='relative w-full overflow-hidden bg-[#fffdfb] pt-20 pb-5 sm:py-20'>
            {/* soft background tint on the left (desktop) */}
            <div className='hidden lg:block absolute top-0 left-0 h-full w-[30%] bg-[#fbf3ec]' aria-hidden />



            <MainContainer className=''>
                <div className='relative grid grid-cols-1 lg:grid-cols-2 items-center sm:gap-14 gap-6 lg:gap-16'>
                    {/* ---------- Image collage ---------- */}
                    <motion.div
                        className='order-2 lg:order-1 relative w-full max-w-[640px] mx-auto lg:mx-0 aspect-[86/77] mb-8'
                        variants={stagger}
                        initial='hidden'
                        whileInView='show'
                        viewport={viewport}
                    >
                        {/* tan offset block */}
                        <motion.div
                            variants={tanBlock}
                            className='absolute left-0 top-[12%] -bottom-[8%] w-[45%] bg-[#d2a56f]'
                            aria-hidden
                        />

                        {/* main tall image */}
                        <motion.div
                            variants={mainImage}
                            className='group absolute left-[4.6%] top-0 w-[63%] h-full bg-white p-1.5 md:p-2 shadow-2xl'
                        >
                            <div className='relative w-full h-full overflow-hidden'>
                                <Image
                                    src={images.main.src}
                                    alt={images.main.alt}
                                    fill
                                    sizes='(min-width: 1024px) 28vw, 60vw'
                                    className='object-cover transition-transform duration-700 group-hover:scale-105'
                                />
                            </div>
                        </motion.div>

                        {/* overlapping interior image */}
                        <motion.div
                            variants={secondImage}
                            className='absolute right-0 top-[15.6%] w-[58.5%] h-[74%]'
                        >
                            <motion.div
                                className='group w-full h-full bg-white p-1.5 md:p-2 shadow-2xl'
                                animate={reduce ? undefined : { y: [0, -10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <div className='relative w-full h-full overflow-hidden'>
                                    <Image
                                        src={images.secondary.src}
                                        alt={images.secondary.alt}
                                        fill
                                        sizes='(min-width: 1024px) 28vw, 55vw'
                                        className='object-cover transition-transform duration-700 group-hover:scale-105'
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* ---------- Text ---------- */}
                    <motion.div
                        className='order-1 lg:order-2'
                        variants={stagger}
                        initial='hidden'
                        whileInView='show'
                        viewport={viewport}
                    >
                        <motion.div variants={fadeUp} className='flex items-center gap-4'>
                            <span className='font-poppins font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-base text-[#9c5a12]'>
                                {eyebrow}
                            </span>
                            <motion.span variants={lineGrow} className='origin-left h-[2px] w-16 sm:w-24 bg-[#c9902a]' />
                        </motion.div>


                        <SectionTitle className=''>
                            {title}
                        </SectionTitle>

                        <SectionSubTitle className=''>
                            {subtitle}
                        </SectionSubTitle>

                        {paragraphs.map((p, i) => (
                            <SectionDescription key={i+1} className="">
                                {p}
                            </SectionDescription>

                        ))}
                    </motion.div>
                </div>
            </MainContainer>
        </section>
    )
}

export default AboutSection