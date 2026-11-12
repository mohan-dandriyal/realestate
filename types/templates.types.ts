import templates from "@/data/templates.json";

export const templateData = templates.categories.EliteResidency;
const sections = templateData.sections;

export const headerData = {
  header: sections.Header.variants.EliteResidencyHeader2,
};
export const footerData = { footer: templates.common.Footer };
export const landingData = {
  meta: templateData.meta,
  hero: sections.Hero.variants.EliteResidencyHero2,
  about: sections.AboutUs.variants.EliteResidencyAboutUs2,
  amenities: sections.Amenities.variants.EliteResidencyAmenities2,
  gallery: sections.Gallery.variants.EliteResidencyGallery2,
  floorPlans: sections.FloorPlans.variants.EliteResidencyFloorPlans2,
  testimonials: sections.Testimonials.variants.EliteResidencyTestimonials2,
  contact: sections.Contact.variants.EliteResidencyContact2,
};

export type HeaderData = typeof headerData.header;
export type FooterData = typeof footerData.footer;
export type HeroData = typeof landingData.hero;
export type AboutData = typeof landingData.about;
export type AmenitiesData = typeof landingData.amenities;
export type GalleryData = typeof landingData.gallery;
export type FloorPlansData = typeof landingData.floorPlans;
export type floorPlansData = FloorPlansData;
export type TestimonialsData = typeof landingData.testimonials;
export type ContactData = typeof landingData.contact;
