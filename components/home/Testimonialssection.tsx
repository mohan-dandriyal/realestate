
"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import MainContainer from "../ui/MainContainer";
import data from "@/data/landing.json";
import {
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "../ui/layout";

const ease = [0.22, 1, 0.36, 1] as const;

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// ========================================
// RESPONSIVE SLIDES PER VIEW
// ========================================

function usePerView() {
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      setPerView(mq.matches ? 2 : 1);
    };

    update();

    mq.addEventListener("change", update);

    return () => {
      mq.removeEventListener("change", update);
    };
  }, []);

  return perView;
}

// ========================================
// ARROW BUTTON COMPONENT
// ========================================

type ArrowBtnProps = {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

const ArrowBtn = ({
  dir,
  onClick,
  disabled = false,
  className = "",
}: ArrowBtnProps) => {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        dir === "prev"
          ? "Previous testimonial"
          : "Next testimonial"
      }
      aria-disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ duration: 0.2 }}
      className={`
        h-12 w-12
        sm:h-[45px] sm:w-[45px]
        items-center justify-center
        rounded-full border
        shadow-sm
        transition-colors duration-300
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#c9902a]
        ${
          disabled
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 opacity-40"
            : "cursor-pointer border-[#d79a1e] bg-white text-[#1b1d33] hover:bg-[#fbf3ec]"
        }
        ${className}
      `}
    >
      <Icon size={22} />
    </motion.button>
  );
};

// ========================================
// TESTIMONIALS SECTION
// ========================================

export default function TestimonialsSection() {
  const {
    eyebrow,
    title,
    subtitle,
    items,
    autoplayMs,
    backgroundImage,
  } = data.testimonials;

  const reduce = useReducedMotion();
  const perView = usePerView();

  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot
  );

  // ========================================
  // SWIPER STATE
  // ========================================

  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(
    items.length <= 1
  );

  const positions = Math.max(
    1,
    items.length - perView + 1
  );

  // ========================================
  // UPDATE NAVIGATION
  // ========================================

  const updateNavigation = useCallback((s: SwiperType) => {
    if (s.destroyed) return;

    setIndex(s.activeIndex);
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  }, []);

  // ========================================
  // NEXT / PREVIOUS
  // ========================================

  const next = useCallback(() => {
    if (!swiper || swiper.destroyed || swiper.isEnd) return;

    swiper.slideNext();
  }, [swiper]);

  const prev = useCallback(() => {
    if (!swiper || swiper.destroyed || swiper.isBeginning) return;

    swiper.slidePrev();
  }, [swiper]);

  // ========================================
  // PAGINATION DOT CLICK
  // ========================================

  const goToSlide = useCallback(
    (slideIndex: number) => {
      if (!swiper || swiper.destroyed) return;

      swiper.slideTo(slideIndex);
    },
    [swiper]
  );

  // ========================================
  // HANDLE RESPONSIVE CHANGES
  // ========================================

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;

    const maxIndex = positions - 1;

    if (swiper.activeIndex > maxIndex) {
      swiper.slideTo(maxIndex);
    }

    // Refresh state after breakpoint changes.
    const frame = requestAnimationFrame(() => {
      if (!swiper.destroyed) {
        updateNavigation(swiper);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [swiper, positions, updateNavigation]);

  // ========================================
  // FRAMER MOTION VARIANTS
  // ========================================

  const header: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const lineGrow: Variants = {
    hidden: reduce ? {} : { scaleX: 0 },
    show: {
      scaleX: 1,
      transition: {
        duration: reduce ? 0 : 0.8,
        ease,
      },
    },
  };

  const reveal: Variants = {
    hidden: reduce
      ? {}
      : {
          opacity: 0,
          y: 40,
        },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.8,
        ease,
      },
    },
  };

  // ========================================
  // AUTOPLAY FOCUS HANDLERS
  // ========================================

  const stopAutoplay = () => {
    if (!swiper || swiper.destroyed) return;

    swiper.autoplay?.stop();
  };

  const startAutoplay = () => {
    if (!swiper || swiper.destroyed) return;
    if (reduce || !autoplayMs || swiper.isEnd) return;

    swiper.autoplay?.start();
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-[#fffaf5] py-16 md:py-18"
    >
      {/* =====================================
          BACKGROUND IMAGE
      ===================================== */}

      {backgroundImage && (
        <div
          className="pointer-events-none absolute right-0 top-0 hidden h-[350px] w-[45%] opacity-[0.12] lg:block"
          aria-hidden="true"
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="35vw"
            className="object-contain object-right-top"
          />
        </div>
      )}

      <MainContainer>
        {/* =====================================
            SECTION HEADING
        ===================================== */}

        <motion.div
          className="relative mx-auto max-w-3xl sm:text-center"
          variants={header}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.4,
          }}
        >
          <div className="flex sm:justify-center">
            <SectionEyebrow className="sm:mx-auto sm:text-right">
              {eyebrow}
            </SectionEyebrow>
          </div>

          <div>
            <SectionTitle>{title}</SectionTitle>
          </div>

          <div className="sm:text-center">
            <SectionDescription className="sm:mx-auto sm:text-center">
              {subtitle}
            </SectionDescription>
          </div>

          <motion.div
            variants={lineGrow}
            className="mt-2 h-[4px] w-24 rounded-full bg-[#c9902a] sm:mx-auto sm:mt-5"
          />
        </motion.div>

        {/* =====================================
            SLIDER WRAPPER
        ===================================== */}

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="relative mt-10 lg:px-20"
          onFocusCapture={stopAutoplay}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget as Node | null
              )
            ) {
              startAutoplay();
            }
          }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          {/* =====================================
              DESKTOP NAVIGATION
          ===================================== */}

          <ArrowBtn
            dir="prev"
            onClick={prev}
            disabled={!swiper || isBeginning}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
          />

          <ArrowBtn
            dir="next"
            onClick={next}
            disabled={!swiper || isEnd}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex"
          />

          {/* =====================================
              SWIPER
          ===================================== */}

          {mounted ? (
            <Swiper
              modules={[Autoplay, A11y, Keyboard]}
              onSwiper={(s) => {
                setSwiper(s);
                updateNavigation(s);
              }}
              onSlideChange={updateNavigation}
              onReachBeginning={updateNavigation}
              onReachEnd={updateNavigation}
              onBreakpoint={updateNavigation}
              slidesPerView={1}
              slidesPerGroup={1}
              loop={false}
              rewind={false}
              watchOverflow={true}
              breakpoints={{
                1024: {
                  slidesPerView: 2,
                },
              }}
              spaceBetween={0}
              speed={reduce ? 0 : 600}
              grabCursor={items.length > perView}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              autoplay={
                reduce || !autoplayMs || items.length <= perView
                  ? false
                  : {
                      delay: autoplayMs,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                      stopOnLastSlide: true,
                    }
              }
              a11y={{
                enabled: true,
                slideLabelMessage:
                  "Testimonial {{index}} of {{slidesLength}}",
              }}
              className="-my-6 py-6"
            >
              {items.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="flex p-3 sm:px-5 sm:py-6">
                    {/* =========================
                        TESTIMONIAL CARD
                    ========================= */}

                    <article className="relative flex w-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-lg sm:p-9 sm:shadow-xl">
                      {/* GOLD CORNER */}

                      <svg
                        className="pointer-events-none absolute right-0 top-0 h-20 w-28 sm:h-24 sm:w-36"
                        viewBox="0 0 140 100"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient
                            id={`corner-${i}`}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#f5cf63"
                            />
                            <stop
                              offset="100%"
                              stopColor="#c9902a"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="M0 0 H140 V100 C128 45 70 6 0 0 Z"
                          fill={`url(#corner-${i})`}
                        />
                      </svg>

                      {/* QUOTE ICON */}

                      <span
                        aria-hidden="true"
                        className="font-playfair h-8 select-none text-7xl leading-[0.6] text-[#d79a1e] sm:h-10 sm:text-8xl"
                      >
                        &ldquo;
                      </span>

                      {/* QUOTE TEXT */}

                      <blockquote className="relative mt-3 flex-1 font-poppins text-sm leading-relaxed text-[#1b1d33] sm:text-base">
                        {t.quote}
                      </blockquote>

                      {/* CLIENT INFORMATION */}

                      <div className="mt-6 flex items-center gap-4 border-t border-[#efe3d6] pt-5">
                        {/* AVATAR */}

                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#d79a1e]">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            sizes="70px"
                            className="object-cover"
                          />
                        </div>

                        {/* NAME AND ROLE */}

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-poppins text-lg font-bold text-[#14182b] sm:text-xl">
                            {t.name}
                          </p>

                          <p className="font-poppins text-sm tracking-wide text-[#5a5d6e] sm:text-base">
                            {t.role}
                          </p>
                        </div>

                        {/* STAR RATING */}

                        <div
                          className="flex gap-0.5 sm:gap-1"
                          aria-label={`${t.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map(
                            (_, starIndex) => (
                              <Star
                                key={starIndex}
                                size={20}
                                className={`
                                  h-4 w-4 sm:h-5 sm:w-5
                                  ${
                                    starIndex < t.rating
                                      ? "fill-[#f5b800] text-[#f5b800]"
                                      : "text-[#e4d6c4]"
                                  }
                                `}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              className="min-h-[420px]"
              aria-hidden="true"
            />
          )}

          {/* =====================================
              MOBILE NAVIGATION + PAGINATION
          ===================================== */}

          <div className="mt-8 flex items-center justify-center gap-5">
            {/* PREVIOUS BUTTON */}

            <ArrowBtn
              dir="prev"
              onClick={prev}
              disabled={!swiper || isBeginning}
              className="flex lg:hidden"
            />

            {/* PAGINATION DOTS */}

            <div className="flex items-center gap-3">
              {Array.from({ length: positions }).map(
                (_, dotIndex) => {
                  const active = dotIndex === index;

                  return (
                    <motion.button
                      key={dotIndex}
                      type="button"
                      onClick={() => goToSlide(dotIndex)}
                      disabled={!swiper}
                      aria-label={`Go to testimonial position ${dotIndex + 1}`}
                      aria-current={
                        active ? "true" : undefined
                      }
                      animate={{
                        scale: active ? 1.35 : 1,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className={`
                        h-3 w-3 rounded-full
                        transition-colors duration-300
                        ${
                          active
                            ? "bg-[#c9902a]"
                            : "bg-[#ecd9bd] hover:bg-[#dcc196]"
                        }
                      `}
                    />
                  );
                }
              )}
            </div>

            {/* NEXT BUTTON */}

            <ArrowBtn
              dir="next"
              onClick={next}
              disabled={!swiper || isEnd}
              className="flex lg:hidden"
            />
          </div>
        </motion.div>
      </MainContainer>
    </section>
  );
}
