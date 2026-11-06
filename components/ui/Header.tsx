"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Menu, Phone, X } from "lucide-react";

import { headerData } from "@/types/landingData";


import MainContainer from "./MainContainer";
import { PrimaryThemeButton } from "./PrimaryButton";

const { header } = headerData;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState(
        header.navigation.navItems[0]?.href || "#home"
    );

    const reduceMotion = useReducedMotion();

    const { logo, navigation, cta, mobile, theme, settings } =
        header;

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > settings.scrollThreshold);

            if (!settings.showActiveLink) return;

            const sections = navigation.navItems
                .map((item) => document.querySelector(item.href))
                .filter((section): section is Element => section !== null);

            let currentSection = navigation.navItems[0]?.href || "#home";

            sections.forEach((section) => {
                const top = section.getBoundingClientRect().top;
                if (top <= 160) {
                    currentSection = `#${section.id}`;
                }
            });

            setActiveLink(currentSection);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navigation.navItems, settings]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    const closeMenu = () => setMenuOpen(false);

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

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
        shouldCloseMenu = false
    ) => {
        if (scrollToHash(href)) {
            e.preventDefault();
            setActiveLink(href);
        }
        if (shouldCloseMenu) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleDocumentHashClick = (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            const target = event.target as HTMLElement | null;
            const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href === "#" || !href.startsWith("#")) return;

            if (scrollToHash(href)) {
                event.preventDefault();
                setActiveLink(href);
                setMenuOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentHashClick);
        return () => document.removeEventListener("click", handleDocumentHashClick);
    }, [scrollToHash]);

    const headerAnimation = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: reduceMotion ? 0 : 0.6, ease },
        },
    };

    const mobileMenuAnimation = {
        hidden: { opacity: 0, x: reduceMotion ? 0 : "100%" },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: reduceMotion ? 0 : 0.4, ease },
        },
        exit: {
            opacity: 0,
            x: reduceMotion ? 0 : "100%",
            transition: { duration: reduceMotion ? 0 : 0.3, ease },
        },
    };

    return (
        <motion.header
            variants={headerAnimation}
            initial="hidden"
            animate="visible"
            className="sticky inset-x-0 top-0 z-50"
            style={{
                backgroundColor: isScrolled
                    ? theme.scrolledBackground
                    : theme.background,
                backdropFilter: "blur(18px)",
                borderBottom: `1px solid ${theme.border}`,
                transition:
                    "background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
                boxShadow: isScrolled
                    ? "0 12px 32px -12px rgba(30, 58, 138, 0.08)"
                    : "none",
            }}
        >

            {/* Main Navigation Bar */}
            <MainContainer className="">
                <div className="mx-auto flex h-[85px] items-center justify-between">
                    <a
                        href={navigation.navItems[0]?.href || "#home"}
                        onClick={(e) =>
                            handleNavClick(e, navigation.navItems[0]?.href || "#home", true)
                        }
                        aria-label={logo.ariaLabel}
                        className="relative z-10 shrink-0"
                    >
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={logo.width}
                            height={logo.height}
                            priority
                            className="h-auto w-42 object-contain sm:w-65"
                        />
                    </a>

                    {/* Desktop Links */}
                    <nav
                        aria-label={navigation.ariaLabel}
                        className="hidden items-center gap-1 xl:flex"
                    >
                        {navigation.navItems.map((item) => {
                            const isActive = activeLink === item.href;

                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    style={{
                                        color: isActive ? "#c26411" : '#0b0b0d',
                                    }}
                                    className="group font-poppins text-[#0b0b0d] relative px-3 py-2.5 text-sm md:text-[16px] font-medium tracking-tight transition-colors duration-300 hover:text-[#c26411]"
                                >
                                    {item.label}
                                    <span
                                        className={`absolute bottom-1 left-3.5 h-[2.5px] rounded-full bg-[#c26411] transition-all duration-300 ${isActive
                                            ? "w-[calc(100%-28px)]"
                                            : "w-0 group-hover:w-[calc(100%-28px)]"
                                            }`}
                                    />
                                </a>
                            );
                        })}
                    </nav>

                    {/* Desktop Helpline & CTA */}
                    <div className="hidden items-center gap-3.5 xl:flex">


                        {cta.enabled && (
                            <PrimaryThemeButton
                                text={cta.btnText}
                                href={cta.btnLink}
                                Icon={CalendarDays}
                                className="" />
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}

                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? mobile.closeLabel : mobile.menuLabel}
                        aria-expanded={menuOpen}
                        className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0B1120] shadow-sm transition-colors hover:border-[#EA580C] hover:text-[#EA580C] xl:hidden"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {menuOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={21} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={21} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </MainContainer>


            {/* Mobile Drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.button
                                type="button"
                                aria-label={mobile.closeLabel}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={closeMenu}
                                className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm xl:hidden"
                            />


                        <motion.div
                            variants={mobileMenuAnimation}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed right-0 top-0 z-40 flex h-[100dvh] w-full max-w-[400px] flex-col overflow-y-auto border-l border-slate-200 bg-white px-7 pb-8 shadow-2xl xl:hidden"
                        >

                            <a
                                href={navigation.navItems[0]?.href || "#home"}
                                onClick={(e) =>
                                    handleNavClick(e, navigation.navItems[0]?.href || "#home", true)
                                }
                                aria-label={logo.ariaLabel}
                                className="relative z-10 shrink-0"
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={logo.width}
                                    height={logo.height}
                                    priority
                                    className="h-auto w-40 object-contain sm:w-50 mt-3"
                                />
                            </a>

                            <div className="mb-6 mt-4">
                                <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-[#d8a02f]">
                                    {navigation.mobileDrawerTitle}
                                </span>
                            </div>

                            <nav className="flex flex-col">
                                {navigation.navItems.map((item, index) => {
                                    const isActive = activeLink === item.href;

                                    return (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: reduceMotion ? 0 : index * 0.05,
                                            }}
                                        >
                                            <a
                                                href={item.href}
                                                onClick={(e) => handleNavClick(e, item.href, true)}
                                                className="group flex items-center justify-between border-b border-slate-100 py-4"
                                            >
                                                <span
                                                    className={`font-display text-lg font-bold transition-colors duration-300 ${isActive
                                                        ? "text-[#d8a02f]"
                                                        : "text-[#0b0b0d] group-hover:text-[#1E3A8A]"
                                                        }`}
                                                >
                                                    {item.label}
                                                </span>

                                                <ArrowUpRight
                                                    size={20}
                                                    className="text-slate-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#EA580C]"
                                                />
                                            </a>
                                        </motion.div>
                                    );
                                })}
                            </nav>

                            <div className="mt-5 w-full mx-auto">
                                {cta.enabled && (
                                    <PrimaryThemeButton
                                        text={cta.btnText}
                                        href={cta.btnLink}
                                        Icon={CalendarDays}
                                        className="w-full justify-center" />
                                )}
                            </div>

                        </motion.div>


                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
