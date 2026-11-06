import AboutSection from "@/components/home/AboutSection";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import HeroSection from "@/components/home/HeroSection";
import FlorePlan from "@/components/home/FloorPlan";
import Header from "@/components/ui/Header";
import Gallery from "@/components/home/Gallery";
import TestimonialsSection from "@/components/home/Testimonialssection";
import ContactSection from "@/components/home/Contactsection";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>

        <div>
          <HeroSection />
        </div>

        <div>
          <AboutSection />
        </div>

        <div id="amenities">
          <AmenitiesSection />
        </div>

        <div id="flor-plan">
          <FlorePlan />
        </div>

         <div id="gallery">
          <Gallery />
        </div>

        <div>
          <TestimonialsSection />
        </div>

        <div>
          <ContactSection />
        </div>

         <div>
          <Footer />
        </div>
    </>
  );
}
