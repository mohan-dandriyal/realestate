'use client'

import React, { FormEvent, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import {
    ArrowRight, Building2, CheckCircle2, ChevronDown, Loader2,
    Mail, MapPin, MessageSquare, Phone, User, type LucideIcon,
} from 'lucide-react'
import MainContainer from '../ui/MainContainer'
import data from '@/data/landing.json' // contains the "contact" block from contact.json
import { SectionDescription, SectionTitle } from '../ui/layout'
import { PrimaryThemeFormButton } from '../ui/PrimaryButton'

// icon names used in the JSON -> lucide components
const icons: Record<string, LucideIcon> = {
    phone: Phone,
    mail: Mail,
    pin: MapPin,
    user: User,
    building: Building2,
    message: MessageSquare,
}

const ease = [0.22, 1, 0.36, 1] as const

type Field = {
    name: string
    type: string
    placeholder: string
    icon: string
    required?: boolean
    pattern?: string
    patternMessage?: string
    options?: string[]
    full?: boolean
}

function ContactSection() {
    const { eyebrow, title, description, info, form: cfg } = data.contact
    const fields = cfg.fields as Field[]
    const reduce = useReducedMotion()

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')


    const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }
    const fadeUp: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
    }
    const fromLeft: Variants = {
        hidden: reduce ? {} : { opacity: 0, x: -30 },
        show: { opacity: 1, x: 0, transition: { duration: 0.65, ease } },
    }
    const barGrow: Variants = {
        hidden: reduce ? {} : { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 0.7, ease } },
    }
    const divider: Variants = {
        hidden: reduce ? {} : { scaleY: 0 },
        show: { scaleY: 1, transition: { duration: 0.9, ease } },
    }
    const cardIn: Variants = {
        hidden: reduce ? {} : { opacity: 0, x: 50 },
        show: { opacity: 1, x: 0, transition: { duration: 0.8, ease, when: 'beforeChildren', staggerChildren: 0.07 } },
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const fd = new FormData(form)
        const values: Record<string, string> = {}
        const next: Record<string, string> = {}

        for (const f of fields) {
            const v = String(fd.get(f.name) ?? '').trim()
            if (f.required && !v) next[f.name] = `${f.placeholder.replace('Your ', '')} is required.`
            else if (v && f.pattern && !new RegExp(f.pattern).test(v)) next[f.name] = f.patternMessage || 'Invalid value.'
            values[f.name] = v
        }
        setErrors(next)
        if (Object.keys(next).length) return

        setStatus('loading')
        try {
            const res = await fetch(cfg.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            if (!res.ok) throw new Error()
            setStatus('success')
            form.reset()
        } catch {
            setStatus('error')
        }
    }

    const inputBase =
        'w-full rounded-xl border border-[#e3dfd8] bg-white pl-14 pr-4 font-poppins text-base text-[#14182b] placeholder:text-[#14182b]/80 shadow-sm transition focus:outline-none focus:border-[#d79a1e] focus:ring-2 focus:ring-[#e8b23a]/50 aria-[invalid=true]:border-red-500'

    return (
        <section id='contact' className='relative w-full overflow-hidden bg-[#fffdfb] py-16 md:py-18'>
            <MainContainer className=''>
                <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1.15fr)] lg:gap-14'>
                    {/* ---------- Left: info ---------- */}
                    <motion.div
                        variants={list}
                        initial='hidden'
                        whileInView='show'
                        viewport={{ once: true, amount: 0.25 }}
                    >
                        <motion.p variants={fadeUp} className='font-montserrat font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base text-[#9c5a12]'>
                            {eyebrow}
                        </motion.p>
                        <motion.div variants={barGrow} className='origin-left mt-2 h-[3px] w-17 bg-[#c9902a]' />

                        <SectionTitle className='sm:w-80'>
                            {title}
                        </SectionTitle>

                        <SectionDescription className=''>
                            {description}
                        </SectionDescription>

                        <ul className='mt-8 space-y-5'>
                            {info.map((item) => {
                                const Icon = icons[item.icon] || Phone
                                return (
                                    <motion.li key={item.label} variants={fromLeft} className='group flex items-center gap-5'>
                                        <span className='flex h-12 w-12 sm:h-[50px] sm:w-[50px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#fcefdc] to-[#f3dcc0] text-[#c9902a] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6'>
                                            <Icon size={28} strokeWidth={1.5} />
                                        </span>
                                        <div className='font-poppins text-[#14182b]'>
                                            <p className='font-bold sm:text-lg'>{item.label}</p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                                    rel='noopener noreferrer'
                                                    className='block text-sm sm:text-lg leading-snug hover:text-[#c9902a] transition-colors break-words'
                                                >
                                                    {item.lines.map((l, i) => (
                                                        <span key={i} className='block'>{l}</span>
                                                    ))}
                                                </a>
                                            ) : (
                                                item.lines.map((l, i) => (
                                                    <p key={i} className='text-base sm:text-lg leading-snug'>{l}</p>
                                                ))
                                            )}
                                        </div>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    </motion.div>

                    {/* ---------- Divider (desktop) ---------- */}
                    <motion.div
                        variants={divider}
                        initial='hidden'
                        whileInView='show'
                        viewport={{ once: true, amount: 0.3 }}
                        className='hidden lg:block origin-top self-stretch w-px my-6 bg-[#e0a63a]'
                        aria-hidden
                    />

                    {/* ---------- Right: form card ---------- */}
                    <motion.div
                        variants={cardIn}
                        initial='hidden'
                        whileInView='show'
                        viewport={{ once: true, amount: 0.2 }}
                        className='rounded-[28px] bg-white p-4 sm:p-10 shadow-[0_15px_50px_rgba(120,80,30,0.14)]'
                    >
                        {/* <motion.h3 variants={fadeUp} className='font-cormorant font-bold text-3xl sm:text-4xl text-[#14182b]'>
                        </motion.h3> */}
                        <SectionTitle className='mt-0 pt-0'>
                            {cfg.title}
                        </SectionTitle>
                        <motion.div variants={barGrow} className='origin-left mt-2 h-[3px] w-18 bg-[#c9902a]' />

                        <form onSubmit={onSubmit} noValidate className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            {fields.map((f) => {
                                const Icon = icons[f.icon] || User
                                const err = errors[f.name]
                                const isArea = f.type === 'textarea'
                                return (
                                    <motion.div key={f.name} variants={fadeUp} className={f.full ? 'sm:col-span-2' : ''}>
                                        <div className='relative'>
                                            <Icon
                                                size={22}
                                                strokeWidth={1.6}
                                                className={`pointer-events-none absolute left-5 text-[#14182b] ${isArea ? 'top-4' : 'top-1/2 -translate-y-1/2'}`}
                                            />

                                            {f.type === 'select' ? (
                                                <>
                                                    <select
                                                        name={f.name}
                                                        defaultValue=''
                                                        aria-label={f.placeholder}
                                                        aria-invalid={!!err}
                                                        onChange={() => setErrors((p) => ({ ...p, [f.name]: '' }))}
                                                        className={`${inputBase} h-14 appearance-none`}
                                                    >
                                                        <option value=''>{f.placeholder}</option>
                                                        {f.options?.map((o) => (
                                                            <option key={o} value={o}>{o}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={20} className='pointer-events-none absolute right-5 top-1/2 -translate-y-1/2' />
                                                </>
                                            ) : isArea ? (
                                                <textarea
                                                    name={f.name}
                                                    rows={4}
                                                    placeholder={f.placeholder}
                                                    aria-label={f.placeholder}
                                                    className={`${inputBase} resize-none py-4`}
                                                />
                                            ) : (
                                                <input
                                                    name={f.name}
                                                    type={f.type}
                                                    placeholder={f.placeholder}
                                                    aria-label={f.placeholder}
                                                    aria-invalid={!!err}
                                                    onChange={() => setErrors((p) => ({ ...p, [f.name]: '' }))}
                                                    className={`${inputBase} h-14`}
                                                />
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {err && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className='mt-1.5 pl-1 font-poppins text-sm text-red-600'
                                                    role='alert'
                                                >
                                                    {err}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })}

                            <motion.div variants={fadeUp} className='sm:col-span-2'>
                                <PrimaryThemeFormButton
                                    types="submit"
                                    text={status === 'loading' ? "Sending…" : cfg.submitLabel}
                                    className="text-sm sm:text-xl w-full"
                                    disabled={status === 'loading'}
                                    Icon={status === 'loading' ? Loader2 : undefined}
                                    rightIcon={status !== 'loading' && <ArrowRight size={22} />}
                                />

                                <div aria-live='polite'>
                                    <AnimatePresence mode='wait'>
                                        {status === 'success' && (
                                            <motion.p
                                                key='ok'
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className='mt-4 flex items-start gap-2 font-poppins text-sm font-medium text-green-700'
                                            >
                                                <CheckCircle2 size={22} className='mt-0.5 shrink-0' /> {cfg.successMessage}
                                            </motion.p>
                                        )}
                                        {status === 'error' && (
                                            <motion.p
                                                key='err'
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className='mt-4 font-poppins text-sm font-medium text-red-600'
                                            >
                                                {cfg.errorMessage}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </form>
                    </motion.div>
                </div>
            </MainContainer>
        </section>
    )
}

export default ContactSection