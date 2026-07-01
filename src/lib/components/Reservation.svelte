<script lang="ts">
  import { fade, slide, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let status: "idle" | "submitting" | "success" = $state("idle");

  function handleSubmit(e: Event) {
    e.preventDefault();
    status = "submitting";
    setTimeout(() => {
      status = "success";
    }, 2000);
  }
</script>

<section class="py-48 px-8 md:px-24 bg-secondary text-primary relative overflow-hidden">
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
  
  <div class="max-w-xl mx-auto relative z-10 text-center min-h-[400px] flex flex-col justify-center">
    <h2 class="text-4xl md:text-5xl font-light tracking-wide mb-6">Join Our Table</h2>
    <p class="text-primary/60 mb-16 tracking-wide leading-relaxed">
      We accept only five reservations per evening. Please provide your details, and we will personally confirm your table.
    </p>

    {#if status !== "success"}
      <form
        in:fade={{ duration: 600, delay: 200 }}
        out:scale={{ duration: 400, start: 0.95 }}
        onsubmit={handleSubmit}
        class="space-y-8 text-left"
      >
        <div class="space-y-2">
          <label class="text-xs tracking-widest uppercase text-accent" for="name">Name</label>
          <input id="name" required type="text" class="w-full bg-transparent border-b border-primary/20 pb-2 text-lg focus:outline-none focus:border-accent transition-colors" />
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="text-xs tracking-widest uppercase text-accent" for="date">Date</label>
            <input id="date" required type="date" class="w-full bg-transparent border-b border-primary/20 pb-2 text-lg focus:outline-none focus:border-accent transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
          </div>
          <div class="space-y-2">
            <label class="text-xs tracking-widest uppercase text-accent" for="guests">Guests</label>
            <select id="guests" required class="w-full bg-transparent border-b border-primary/20 pb-2 text-lg focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer">
              {#each [1,2,3,4,5,6] as n}
                <option value={n} class="bg-secondary">{n}</option>
              {/each}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          class="w-full mt-12 py-4 bg-primary text-secondary text-sm tracking-[0.2em] uppercase transition-all hover:bg-accent hover:text-primary relative overflow-hidden group"
        >
          <span class={status === "submitting" ? "opacity-0" : "opacity-100 transition-opacity"}>
            Request Reservation
          </span>
          {#if status === "submitting"}
            <div 
              transition:fade={{ duration: 200 }}
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="w-4 h-4 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          {/if}
        </button>
      </form>
    {:else}
      <div
        in:scale={{ duration: 800, start: 0.9, easing: cubicOut, delay: 400 }}
        class="py-12"
      >
        <h3 class="text-3xl font-light italic font-serif text-accent mb-4">A Presto</h3>
        <p class="text-primary/70 tracking-wide leading-relaxed">
          Your request has been received.<br/>Maria or Silve will contact you shortly to confirm.
        </p>
      </div>
    {/if}
  </div>
</section>
