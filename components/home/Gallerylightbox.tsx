'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type GalleryItem = { title: string; image: string; alt: string }

type Props = {
    items: GalleryItem[]
    index: number | null // null = closed
    direction: number // 1 = moved forward, -1 = moved back (controls slide direction)
    onClose: () => void
    onNavigate: (nextIndex: number, direction: number) => void
}

const ease = [0.22, 1, 0.36, 1] as const

function GalleryLightbox({ items, index, direction, onClose, onNavigate }: Props) {
    const reduce = useReducedMotion()
    const [mounted, setMounted] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)
    const open = index !== null
    const total = items.length

    useEffect(() => setMounted(true), [])

    const go = useCallback(
        (delta: number) => {
            if (index === null || total < 2) return
            onNavigate((index + delta + total) % total, delta)
        },
        [index, total, onNavigate]
    )

    // keyboard, scroll lock, focus handling while open
    useEffect(() => {
        if (!open) return
        const trigger = document.activeElement as HTMLElement | null
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeRef.current?.focus()

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowRight') go(1)
            if (e.key === 'ArrowLeft') go(-1)
        }
        window.addEventListener('keydown', onKey)

        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = prevOverflow
            trigger?.focus() // return focus to the card that opened it
        }
    }, [open, go, onClose])

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x > 80 || info.velocity.x > 500) go(-1)
        else if (info.offset.x < -80 || info.velocity.x < -500) go(1)
    }

    const slide = {
        enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 80 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : -d * 80 }),
    }

    if (!mounted) return null

    const btn =
        'flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e8b23a] transition-colors'

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key='lightbox'
                    role='dialog'
                    aria-modal='true'
                    aria-label='Image gallery'
                    className='fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm px-3 sm:px-6 py-16'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                >
                    {/* counter */}
                    <p className='absolute top-5 left-5 sm:left-8 font-montserrat font-semibold tracking-widest text-sm text-white/80'>
                        {(index ?? 0) + 1} / {total}
                    </p>

                    {/* close */}
                    <button
                        ref={closeRef}
                        type='button'
                        aria-label='Close gallery'
                        onClick={(e) => { e.stopPropagation(); onClose() }}
                        className={`${btn} absolute top-4 right-4 sm:right-8 h-11 w-11`}
                    >
                        <X size={22} />
                    </button>

                    {/* previous / next */}
                    {total > 1 && (
                        <>
                            <button
                                type='button'
                                aria-label='Previous image'
                                onClick={(e) => { e.stopPropagation(); go(-1) }}
                                className={`${btn} absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 z-10`}
                            >
                                <ChevronLeft size={26} />
                            </button>
                            <button
                                type='button'
                                aria-label='Next image'
                                onClick={(e) => { e.stopPropagation(); go(1) }}
                                className={`${btn} absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 z-10`}
                            >
                                <ChevronRight size={26} />
                            </button>
                        </>
                    )}

                    {/* content */}
                    <motion.div
                        className='w-full max-w-5xl'
                        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.35, ease }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='relative w-full h-[55vh] sm:h-[65vh] overflow-hidden'>
                            <AnimatePresence initial={false} custom={direction} mode='wait'>
                                {index !== null && (
                                    <motion.div
                                        key={index}
                                        custom={direction}
                                        variants={slide}
                                        initial='enter'
                                        animate='center'
                                        exit='exit'
                                        transition={{ duration: 0.3, ease }}
                                        drag='x'
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.25}
                                        onDragEnd={onDragEnd}
                                        className='absolute inset-0 cursor-grab active:cursor-grabbing'
                                    >
                                        <Image
                                            src={items[index].image}
                                            alt={items[index].alt}
                                            fill
                                            priority
                                            draggable={false}
                                            sizes='(min-width: 1024px) 1024px, 100vw'
                                            className='object-contain select-none'
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* caption */}
                        <p className='mt-4 text-center font-playfair font-bold text-xl sm:text-2xl text-white'>
                            {index !== null && items[index].title}
                        </p>

                        {/* thumbnails */}
                        {total > 1 && (
                            <div className='mt-4 flex justify-center gap-2 sm:gap-3 overflow-x-auto pb-1'>
                                {items.map((it, i) => (
                                    <button
                                        key={it.image}
                                        type='button'
                                        aria-label={`Show ${it.title}`}
                                        aria-current={i === index}
                                        onClick={() => onNavigate(i, i > (index ?? 0) ? 1 : -1)}
                                        ref={(el) => {
                                            if (el && i === index) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
                                        }}
                                        className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-md border-2 transition ${
                                            i === index ? 'border-[#e8b23a] opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                                        }`}
                                    >
                                        <Image src={it.image} alt='' fill sizes='80px' className='object-cover' />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default GalleryLightbox