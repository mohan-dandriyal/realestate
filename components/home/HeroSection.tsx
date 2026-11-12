"use client";

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import MainContainer from '../ui/MainContainer'
import { landingData as data } from "@/types/templates.types";
import EnquiryForm from './Enquiryform';
import { PrimaryThemeButton } from '../ui/PrimaryButton';

// Parent: staggers its children one after another
const container: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
}

// Children: fade + slide up
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
}

// Gold line grows from left to right
const growLine: Variants = {
    hidden: { scaleX: 0 },
    show: {
        scaleX: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
}

// Price badge pops in
const pop: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 200, damping: 15 },
    },
}

function HeroSection() {
    const { banner, project, enquiryForm } = data.hero

    return (
        <section className='bg-black min-h-[92vh] w-full relative flex items-center  overflow-hidden'>
            {/* Background image – slow zoom-out on load */}
            <motion.div
                className='absolute top-0 left-0 h-full w-full'
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
            >
                <Image
                    src={banner}
                    alt={project.name}
                    fill
                    priority
                    className='sm:object-fill object-cover'
                />
            </motion.div>

            {/* Gradient overlay – fades in */}
            <motion.div
                className='absolute top-0 left-0 w-full h-full'
                style={{ background: "linear-gradient(8deg, #000000c7, transparent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />

            <div className='w-full'>
                <MainContainer className=''>
                    <div className='relative z-10 flex md:flex-row flex-col justify-between w-full gap-10 md:items-center py-12'>
                        {/* Left content – staggered */}
                        <motion.div
                            className='text-white'
                            variants={container}
                            initial='hidden'
                            animate='show'
                        >
                            <motion.span
                                variants={fadeUp}
                                className='inline-block font-poppins font-medium tracking-[0.2em] text-xs sm:text-base lg::text-lg'
                            >
                                {project.tagline}
                            </motion.span>

                            <motion.div
                                variants={growLine}
                                style={{ originX: 0 }}
                                className='h-[3px] w-24 bg-[#e8b23a] mt-3 mb-4'
                            />

                            <motion.h1
                                variants={fadeUp}
                                className='font-cormorant font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-none'
                            >
                                {project.name}
                            </motion.h1>

                            <motion.p
                                variants={fadeUp}
                                className='font-poppins flex items-center gap-2 text-sm md:text-xl mt-4'
                            >
                                <MapPin size={20} className='text-[#e8b23a]' />
                                {project.location}
                            </motion.p>

                            <motion.p
                                variants={fadeUp}
                                className='font-poppins text-sm sm:text-xl lg:text-2xl font-medium mt-5'
                            >
                                {project.headline}
                            </motion.p>

                            <motion.div className='mt-4'
                                variants={pop}
                                whileTap={{ scale: 0.97 }}>
                                <PrimaryThemeButton
                                    text={`${project.cta.label} ${project.cta.amount}`}
                                    href={project.cta.href}
                                    className='text-[#0b0b0d] text-sm md:text-2xl' />
                            </motion.div>
                        </motion.div>

                        {/* Right form – slides in from the right */}
                        <motion.div
                            className='md:w-[400px]'
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <EnquiryForm config={enquiryForm} />
                        </motion.div>
                    </div>
                </MainContainer>
            </div>
        </section>
    )
}

export default HeroSection