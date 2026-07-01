import Story from "@/components/Story";
import Experience from "@/components/Experience";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Reservation from "@/components/Reservation";

export default function Home() {
  return (
    <main className="bg-secondary text-primary font-sans selection:bg-accent/30 selection:text-primary">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-8xl tracking-[0.15em] uppercase font-light mb-6">
            Da Silve
          </h1>
          <p className="text-accent tracking-[0.3em] uppercase text-xs md:text-sm">
            Ristorante • Fasano
          </p>
        </div>
      </section>

      <Story />
      <Experience />
      <Menu />
      <Gallery />
      <Reservation />
      
      {/* Footer */}
      <footer className="py-12 text-center text-primary/40 text-xs tracking-widest uppercase border-t border-primary/5">
        <p>© {new Date().getFullYear()} Ristorante da Silve. All rights reserved.</p>
      </footer>
    </main>
  );
}
