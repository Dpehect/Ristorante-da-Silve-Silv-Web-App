import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Experience from "@/components/Experience";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Reservation from "@/components/Reservation";
import FindUs from "@/components/FindUs";
import Footer from "@/components/Footer";

/**
 * Ristorante da Silve — Cinematic, alive, and deeply personal.
 * Heavy GSAP ScrollTrigger + elegant Three.js 3D in the Menu.
 * Inspired by premium scroll experiences but warm and intimate.
 */
export default function DaSilve() {
  return (
    <>
      <Navbar />
      <Hero />
      <Story />
      <Experience />
      <Menu />
      <Gallery />
      <Reservation />
      <FindUs />
      <Footer />
    </>
  );
}
