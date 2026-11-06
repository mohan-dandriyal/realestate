import { ReactNode, type Key } from "react"
import { motion, useReducedMotion, type Variants } from 'framer-motion'

interface PropsType {
    children: ReactNode, className: string
}

export const Paragraph = ({ children, className }: PropsType) => {
    return (
        <p className={`${className}`}>
            {children}
        </p>
    )
}

const ease = [0.22, 1, 0.36, 1] as const

export const SectionTitle = ({ children, className }: PropsType) => {
    const reduce = useReducedMotion()

    const fadeUp: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }
    return (
        <motion.h2
            variants={fadeUp}
            className={`font-cormorant font-bold text-[#0b0b0d] leading-[1.1] text-2xl sm:text-4xl xl:text-5xl mt-5 ${className}`}
        >
            {children}
        </motion.h2>
    );
}

export const SectionEyebrow = ({ children, className = '', align = 'left' }: PropsType) => {
    const reduce = useReducedMotion()

    const fadeUp: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }

    const lineGrow: Variants = {
        hidden: reduce ? {} : { scaleX: 0 },
        show: { scaleX: 1, transition: { duration: 0.8, ease } },
    }

    const line = 'h-[2px] w-10 sm:w-20 bg-[#c9902a]'

    return (
        <motion.div
            variants={fadeUp}
            className={`flex items-center gap-3 sm:gap-5 ${align === 'center' ? 'sm:justify-center' : ''} ${className}`}
        >
            {align && (
            <motion.span variants={lineGrow} className={`origin-right ${line} sm:block hidden`} />
            )}

            <p className='font-montserrat font-semibold tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base text-[#9c5a12]'>
                {children}
            </p>

            <motion.span variants={lineGrow} className={`origin-left ${line}`} />
        </motion.div>
    )
}

export const SectionSubTitle = ({ children, className }: PropsType) => {

    const reduce = useReducedMotion()

    const fadeUp: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }
    return (
        <motion.p
            variants={fadeUp}
            className={`font-poppins font-semibold text-[#9c5a12] text-base sm:text-2xl leading-snug mt-3 sm:mt-6 ${className}`}
        >
            {children}
        </motion.p>
    )
}

export const SectionDescription = ({ children, className }: PropsType) => {

    const reduce = useReducedMotion()

    const fadeUp: Variants = {
        hidden: reduce ? {} : { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
    }
    return (
        <motion.p
            variants={fadeUp}
            className={`font-poppins text-[#1b1d33] text-sm sm:text-lg font-medium leading-relaxed sm:mt-5 mt-3 max-w-[60ch] ${className}`}
        >
            {children}
        </motion.p>
    )
}