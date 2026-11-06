import landingJson from "@/data/landing.json";
import headerJson from "@/data/header.json";
import footerJson from "@/data/footer.json";

export const headerData = headerJson;
export const landingData = landingJson;
export const footerData = footerJson;


export type HeaderData = typeof headerData.header;


export type HeroData = typeof landingJson.hero;
export type AboutData = typeof landingJson.about;
export type AmenitiesData = typeof landingJson.amenities;
export type GalleryData = typeof landingJson.gallery;
export type floorPlansData = typeof landingJson.floorPlans;
export type TestimonialsData = typeof landingJson.testimonials;
export type ContactData = typeof landingJson.contact;
