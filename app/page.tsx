import AboutSection from "@/components/home/AboutSection";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import HeroSection from "@/components/home/HeroSection";
import FlorePlan from "@/components/home/FloorPlan";
import Gallery from "@/components/home/Gallery";
import TestimonialsSection from "@/components/home/Testimonialssection";
import ContactSection from "@/components/home/Contactsection";

export default function Home() {
  return (
    <>

        <div id="home">
          <HeroSection />
        </div>

        <div>
          <AboutSection />
        </div>

        <div>
          <AmenitiesSection />
        </div>

        <div>
          <FlorePlan />
        </div>

         <div>
          <Gallery />
        </div>

        <div>
          <TestimonialsSection />
        </div>

        <div>
          <ContactSection />
        </div>

        
    </>
  );
}
