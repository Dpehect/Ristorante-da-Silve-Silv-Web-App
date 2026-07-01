import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Experience from "@/components/Experience";
import MenuSection from "@/components/MenuSection";
import Gallery from "@/components/Gallery";
import ReservationForm from "@/components/ReservationForm";
import FindUs from "@/components/FindUs";
import Footer from "@/components/Footer";

// Main landing page for da Silve.
// Everything is intentionally on one beautiful, deliberate scroll.
// The goal: an emotional, intimate invitation that feels like being personally welcomed.

export default function DaSilve() {
  return (
    <>
      <Navbar />
      
      <Hero />
      
      <Story />
      
      <Experience />
      
      <MenuSection />
      
      <Gallery />
      
      {/* Reservation is the emotional climax — spacious and considered */}
      <ReservationForm />
      
      <FindUs />
      
      <Footer />
    </>
  );
}
