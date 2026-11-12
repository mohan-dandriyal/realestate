'use client'

import Image from 'next/image'
import React from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, ArrowUp, Building2, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react'
import MainContainer from '../ui/MainContainer'
import { footerData as data } from "@/types/templates.types";

const icons: Record<string, LucideIcon> = { phone: Phone, mail: Mail, pin: MapPin }
const ease = [0.22, 1, 0.36, 1] as const

// vertical gold divider before each column (desktop only)
const divider =
    'xl:pl-10 xl:before:absolute xl:before:left-0 xl:before:top-2 xl:before:bottom-2 xl:before:w-px xl:before:bg-[#e0a63a]/70'

function Heading({ children, bar }: { children: React.ReactNode; bar: Variants }) {
    return (
        <>
            <h3 className='font-cormorant font-bold text-xl sm:text-[24px] leading-tight text-[#14182b]'>{children}</h3>
            <motion.div variants={bar} className='origin-left mt-3 mb-6 h-[4px] w-14 rounded-full bg-[#c9780f]' />
        </>
    )
}

function LinkList({ items, external, row }: { items: { label: string; href: string }[]; external?: boolean; row: Variants }) {
    return (
        <ul className='space-y-3.5'>
            {items.map((l) => (
                <motion.li key={l.label} variants={row}>
                    <a
                        href={l.href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className='group inline-flex items-center gap-3 font-poppins font-medium text-sm sm:text-base text-[#14182b] hover:text-[#c9780f] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9902a] rounded'
                    >
                        <ArrowRight size={20} className='shrink-0 text-[#e07a10] transition-transform duration-300 group-hover:translate-x-1.5' />
                        <span className='transition-transform duration-300 group-hover:translate-x-0.5'>{l.label}</span>
                    </a>
                </motion.li>
            ))}
        </ul>
    )
}

function Footer() {
    const { brand, quickLinks, social, contact, copyright } = data.footer
    const reduce = useReducedMotion()

    const columns: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.12 } },
    }
    const col: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease, when: 'beforeChildren', staggerChildren: 0.06 } },
    }
    const row: Variants = {
        hidden: reduce ? {} : { opacity: 0, x: -14 },
        show: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
    }
    const bar: Variants = {
        hidden: reduce ? {} : { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 0.6, ease } },
    }

    return (
        <footer className='w-full bg-[#fffdfb]'>
            <MainContainer className=''>
                <motion.div
                    variants={columns}
                    initial='hidden'
                    whileInView='show'
                    viewport={{ once: true, amount: 0.15 }}
                    className=' flex flex-wrap justify-between sm:grid grid-cols-1 sm:gap-12 gap-6 pb-14 pt-8 md:grid-cols-2 xl:grid-cols-[1.25fr_0.85fr_0.85fr_1.2fr] xl:gap-10'
                >
                    {/* ---------- Brand ---------- */}
                    <motion.div variants={col} className='relative w-full md:min-w-0'>
                        <a href={brand.href} className='flex items-center gap-4'>
                            {brand.logo ? (
                                <Image src={brand.logo} alt='' width={180} height={45} className=' w-45 sm:w-65 object-contain' />
                            ) : (
                                <Building2 size={64} strokeWidth={1.4} className='text-[#c9780f]' />
                            )}
                        </a>
                        <motion.p variants={row} className='mt-7 max-w-[34ch] font-poppins text-sm sm:text-lg leading-relaxed text-[#000000c7]/90 font-medium'>
                            {brand.description}
                        </motion.p>
                    </motion.div>

                    {/* ---------- Quick links ---------- */}
                    <motion.nav variants={col} aria-label={quickLinks.title} className={`relative min-w-0 ${divider}`}>
                        <Heading bar={bar}>{quickLinks.title}</Heading>
                        <LinkList items={quickLinks.items} row={row} />
                    </motion.nav>

                    {/* ---------- Social ---------- */}
                    <motion.div variants={col} className={`relative min-w-40 md:min-w-0 ${divider}`}>
                        <Heading bar={bar}>{social.title}</Heading>
                        <LinkList items={social.items} external row={row} />
                    </motion.div>

                    {/* ---------- Contact ---------- */}
                    <motion.div variants={col} className={`relative min-w-0 ${divider}`}>
                        <Heading bar={bar}>{contact.title}</Heading>
                        <ul className='space-y-5'>
                            {contact.items.map((c, i) => {
                                const Icon = icons[c.icon] || Phone
                                const content = c.lines.map((l, k) => (
                                    <span key={k} className='block'>{l}</span>
                                ))
                                return (
                                    <motion.li key={i} variants={row} className='group flex items-center gap-4'>
                                        <span className='flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#fcefdc] to-[#f3dcc0] text-[#c9780f] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6'>
                                            <Icon size={20} strokeWidth={1.5} />
                                        </span>
                                        {c.href ? (
                                            <a
                                                href={c.href}
                                                {...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                className='min-w-0 break-words font-poppins text-sm sm:text-base leading-snug text-[#14182b] hover:text-[#c9780f] transition-colors'
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            <p className='min-w-0 break-words font-poppins text-base sm:text-lg leading-snug text-[#14182b]'>{content}</p>
                                        )}
                                    </motion.li>
                                )
                            })}
                        </ul>
                    </motion.div>
                </motion.div>
            </MainContainer>

            {/* ---------- Copyright bar ---------- */}
            <div className='bg-[#13233a]'>
                <MainContainer className=''>
                    <div className='flex items-center justify-between gap-4 py-6 sm:py-8'>
                        <p className='font-poppins text-sm  text-white'>
                            © {copyright.copyYear}  {copyright.copyrightText}
                        </p>

                        <motion.button
                            type='button'
                            aria-label='Back to top'
                            onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
                            whileHover={reduce ? undefined : { y: -3 }}
                            whileTap={reduce ? undefined : { scale: 0.9 }}
                            className='flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f5cf63] to-[#d8a02f] text-[#161616] shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                        >
                            <ArrowUp size={20} />
                        </motion.button>
                    </div>
                </MainContainer>
            </div>
        </footer>
    )
}

export default Footer