
"use client";

import { useCallback, ReactNode } from "react";

export const PrimaryThemeButton = ({
    text,
    href,
    className = "",
    Icon,
    rightIcon,
}: {
    text: string;
    href?: string;
    className?: string;
    Icon?: React.ComponentType<{ size?: number }>;
    rightIcon?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    const scrollToHash = useCallback((href: string) => {
        if (!href.startsWith("#")) return false;

        const target = document.querySelector(href);
        if (!target) return false;

        const headerOffset = 76;
        const elementPosition =
            target.getBoundingClientRect().top + window.scrollY;

        const offsetPosition =
            href === "#home"
                ? 0
                : Math.max(0, elementPosition - headerOffset);

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
            onClick={(e) => {
                if (scrollToHash(href || "")) {
                    e.preventDefault();
                }
            }}
            className={`
                group relative inline-flex items-center justify-center
                gap-3 overflow-hidden rounded-lg
                bg-gradient-to-b from-[#f5cf63] to-[#d8a02f]
                px-5 py-3 text-sm sm:text-base
                font-poppins font-semibold capitalize text-[#161616]
                shadow-lg shadow-blue-900/15

                transition-all duration-300 ease-out

                hover:from-[#ffdc76]
                hover:to-[#e5a927]
                hover:shadow-xl
                hover:shadow-[#d8a02f]/40

                active:translate-y-0
                active:scale-[0.97]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#d8a02f]
                focus-visible:ring-offset-2

                ${className}
            `}
        >
            {/* Shine Effect */}
            <span
                className="
                    absolute inset-0 -translate-x-full
                    bg-gradient-to-r
                    from-transparent via-white/30 to-transparent
                    transition-transform duration-700
                "
            />

            {/* Left Icon */}
            {Icon && (
                <span className="
                    relative flex items-center justify-center
                    transition-transform duration-300
                    group-hover:rotate-[-8deg]
                ">
                    <Icon size={24} />
                </span>
            )}

            {/* Button Text */}
            <span className="relative transition-all duration-300 group-hover:tracking-wide">
                {text}
            </span>

            {/* Right Icon */}
            {rightIcon && (
                <span className="
                    relative flex items-center justify-center
                    transition-transform duration-300
                    group-hover:translate-x-1
                ">
                    {rightIcon}
                </span>
            )}
        </a>
    );
};

export const PrimaryThemeFormButton = ({
    text,
    types,
    className = "",
    Icon,
    rightIcon,
    onClick,
    disabled
}: {
    text: string;
    types: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
    className?: string;
    disabled : boolean,
    Icon?: React.ComponentType<{ size?: number }>;
    rightIcon?: ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {


    return (
        <button
            type={types}
            onClick={onClick}
            className={`
                group relative inline-flex items-center justify-center
                gap-3 overflow-hidden rounded-lg
                bg-gradient-to-b from-[#f5cf63] to-[#d8a02f]
                px-5 py-3 text-sm sm:text-base
                font-poppins font-semibold capitalize text-[#161616]
                shadow-lg shadow-blue-900/15

                transition-all duration-300 ease-out

                hover:from-[#ffdc76]
                hover:to-[#e5a927]
                hover:shadow-xl
                hover:shadow-[#d8a02f]/40

                active:translate-y-0
                active:scale-[0.97]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#d8a02f]
                focus-visible:ring-offset-2

                ${className}
            `}
            disabled={disabled}
        >
            {/* Shine Effect */}
            <span
                className="
                    absolute inset-0 -translate-x-full
                    bg-gradient-to-r
                    from-transparent via-white/30 to-transparent
                    transition-transform duration-700
                "
            />

            {/* Left Icon */}
            {Icon && (
                <span className="
                    relative flex items-center justify-center
                    transition-transform duration-300
                    group-hover:rotate-[-8deg]
                ">
                    <Icon size={24} />
                </span>
            )}

            {/* Button Text */}
            <span className="relative transition-all duration-300 group-hover:tracking-wide">
                {text}
            </span>

            {/* Right Icon */}
            {rightIcon && (
                <span className="
                    relative flex items-center justify-center
                    transition-transform duration-300
                    group-hover:translate-x-1
                ">
                    {rightIcon}
                </span>
            )}
        </button>
    );
};
