<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let containerRef: HTMLElement;
  let textRef: HTMLDivElement;

  onMount(() => {
    // Background fade transition
    gsap.fromTo(
      containerRef,
      { backgroundColor: "#1a1916" },
      {
        backgroundColor: "#2c2a26",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef,
          start: "top bottom",
          end: "center center",
          scrub: true,
        }
      }
    );

    // Paragraph stagger reveal
    const paragraphs = textRef.querySelectorAll('p');
    paragraphs.forEach((p) => {
      gsap.from(p, {
        y: 50,
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: p,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        }
      });
    });
  });
</script>

<section bind:this={containerRef} class="relative py-48 px-8 md:px-24 min-h-screen flex items-center justify-center">
  <div bind:this={textRef} class="max-w-3xl mx-auto">
    <h2 class="text-sm tracking-[0.3em] uppercase text-accent mb-12 text-center">La Nostra Storia</h2>
    
    <div class="space-y-12 text-lg md:text-2xl leading-relaxed text-primary/90 font-light text-center">
      <p>
        Da Silve is not a restaurant. It is our home, opened to those who seek not just a meal, but an experience of genuine Apulian hospitality.
      </p>
      <p>
        There is no written menu. Maria cooks what the sea and the land offer each morning. Silve pours the wine. The rhythm of the evening is dictated by the season.
      </p>
      <p class="italic text-accent">
        "We serve what we would serve our family."
      </p>
    </div>
  </div>
</section>
