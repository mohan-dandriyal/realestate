"use client";
import { useCallback } from "react";


export const PrimaryThemeButton = ({ text, href, className, Icon }: {
    text: string;
    href?: string;
    className?: string;
    Icon?: React.ComponentType<{ size?: number }>
}) => {
    const scrollToHash = useCallback((href: string) => {
        if (!href.startsWith("#")) return false;
        const target = document.querySelector(href);
        if (!target) return false;

        const headerOffset = 76;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition =
            href === "#home" ? 0 : Math.max(0, elementPosition - headerOffset);

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
        window.history.pushState(null, "", href);
        return true;
    }, []);

    return (
        <a
            href={href}
            onClick={(e) => scrollToHash(href || "") && e.preventDefault()}
            className={`group inline-flex items-center capitalize gap-3 rounded-lg font-poppins font-semibold bg-gradient-to-b from-[#f5cf63] to-[#d8a02f] py-3 text-sm px-5 sm:text-base shadow-lg shadow-blue-900/15  ${className}`}
        >
            {
                Icon &&
                <span className="flex items-center transition-transform duration-300">
                    {Icon && <Icon size={24} />}
                </span>
            }

            {text}
        </a>
    );
}