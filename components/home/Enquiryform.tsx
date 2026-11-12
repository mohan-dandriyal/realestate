
'use client'

import React, { FormEvent, useState } from 'react'
import { ArrowRight, Building2, ChevronDown, Layers, Mail, Phone, User } from 'lucide-react'
import { PrimaryThemeFormButton } from '../ui/PrimaryButton'

type Field = {
    name: string
    type: string
    placeholder: string
    icon: string
    required?: boolean
    pattern?: string
    patternMessage?: string
    options?: string[]
}

type FormConfig = {
    title: string
    subtitle: string
    submitLabel: string
    endpoint: string
    successMessage: string
    errorMessage: string
    fields: Field[]
}

const icons: Record<string, React.ElementType> = {
    user: User,
    phone: Phone,
    mail: Mail,
    layers: Layers,
}

function EnquiryForm({ config }: { config: FormConfig }) {
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const values: Record<string, string> = {}

        for (const f of config.fields) {
            const v = ((form.elements.namedItem(f.name) as HTMLInputElement).value || '').trim()
            if (f.required && !v)
                return setStatus({ ok: false, text: `Please fill in: ${f.placeholder.split(' (')[0]}.` })
            if (f.pattern && !new RegExp(f.pattern).test(v))
                return setStatus({ ok: false, text: f.patternMessage || 'Invalid value.' })
            values[f.name] = v
        }

        setLoading(true)
        try {
            const res = await fetch(config.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            if (!res.ok) throw new Error()
            setStatus({ ok: true, text: config.successMessage })
            form.reset()
        } catch {
            setStatus({ ok: false, text: config.errorMessage })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className='bg-white text-[#0b0b0d] rounded-[28px] px-6 md:px-8 pt-5 pb-8 shadow-2xl text-center w-full md:max-w-md lg:max-w-none justify-self-center lg:justify-self-end'
        >
            <div className='flex items-center gap-3'>
                <span className='flex-1 h-[2px] bg-[#e8b23a]' />
                <Building2 size={44} strokeWidth={1.6} className='text-[#c9902a]' />
                <span className='flex-1 h-[2px] bg-[#e8b23a]' />
            </div>

            <h2 className='font-cormorant font-bold text-2xl md:text-4xl mt-1'>{config.title}</h2>
            <p className='font-poppins font-medium text-sm mt-2 sm:text-base mt-1 mb-6'>{config.subtitle}</p>

            {config.fields.map((f) => {
                const Icon = icons[f.icon] || User
                const common =
                    'w-full h-12 rounded-xl border border-[#e6e3dc] bg-[#fafafa] pl-14 pr-4 font-poppins font-medium text-sm md:text-[14px] text-[#14182b] appearance-none focus:outline-none focus:ring-2 focus:ring-[#e8b23a]'
                return (
                    <div key={f.name} className='relative mb-3.5'>
                        <Icon size={22} strokeWidth={1.7} className='absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none' />
                        {f.type === 'select' ? (
                            <>
                                <select name={f.name} 
                                aria-label={f.placeholder} defaultValue='' required={f.required} className={common}>
                                    <option value=''>{f.placeholder}</option>
                                    {f.options?.map((o) => (
                                        <option key={o} value={o}>{o}</option>
                                    ))}
                                </select>
                                <ChevronDown size={20} className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none' />
                            </>
                        ) : (
                            <input
                                name={f.name}
                                type={f.type}
                                placeholder={f.placeholder}
                                aria-label={f.placeholder}
                                required={f.required}
                                className={`${common} placeholder:text-[#14182b]`}
                            />
                        )}
                    </div>
                )
            })}

            <div className='mt-5'>


                <PrimaryThemeFormButton
                    types="submit"
                    text={loading ? "Sending…" : config.submitLabel}
                    className="text-sm md:text-xl"
                    disabled={loading}
                    rightIcon={!loading && <ArrowRight size={22} />}
                />

                {
                    status?.text &&
                    <p role='status' className={`min-h-[22px] mt-3 text-sm font-medium ${status?.ok ? 'text-green-700' : 'text-red-700'}`}>
                        {status?.text}
                    </p>
                }
            </div>

        </form>
    )
}

export default EnquiryForm