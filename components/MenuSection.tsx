// Deprecated. New dynamic GSAP Menu is in Menu.tsx
// Safe to delete.
export default function Deprecated() { return null; }

interface MenuResponse {
  success: boolean;
  data: MenuData;
}

// Diet icon helper
const DietBadge = ({ diet }: { diet: string[] }) => {
  if (!diet.length) return null;

  return (
    <div className="flex gap-1.5 mt-2.5">
      {diet.includes("vegetarian") && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#5f6f4e]/10 text-[#5f6f4e] px-2.5 py-px text-[10px] tracking-widest font-medium">
          <Leaf size={10} /> VEGETARIAN
        </span>
      )}
      {diet.includes("seafood") && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#4a6b7f]/10 text-[#4a6b7f] px-2.5 py-px text-[10px] tracking-widest font-medium">
          <Fish size={10} /> SEAFOOD
        </span>
      )}
      {diet.includes("vegan") && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#5f6f4e]/10 text-[#5f6f4e] px-2.5 py-px text-[10px] tracking-widest font-medium">
          <Leaf size={10} /> VEGAN
        </span>
      )}
    </div>
  );
};

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.028, 0.4) }}
      onClick={() => setExpanded(!expanded)}
      className={`dish-card border border-[#d9d0c2] bg-white rounded-2xl px-8 py-7 cursor-pointer select-none ${expanded ? "expanded" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif text-[21px] leading-[1.05] tracking-[-0.2px] text-[#2c2522]">
            {dish.nameIt}
          </div>
          <div className="text-[#81746a] text-[13px] italic tracking-[-0.1px] mt-px">
            {dish.nameEn}
          </div>
        </div>
        
        <div className={`mt-1 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
          <ChevronDown size={19} className="text-[#c46b4e]" />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.23, 1.0, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 text-[#5c524b] text-[14.6px] leading-[1.7] pr-6">
              {dish.description}
            </div>
            
            {dish.note && (
              <div className="pt-4 text-xs tracking-wide text-[#c46b4e] italic border-l-2 pl-3 mt-4 border-[#c46b4e]/30">
                {dish.note}
              </div>
            )}
            
            <DietBadge diet={dish.diet} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MenuSection() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("antipasti");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        const json: MenuResponse = await res.json();
        if (json.success) {
          setMenu(json.data);
          // Default to first category
          if (json.data.categories.length > 0) {
            setActiveTab(json.data.categories[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load menu", e);
        // Fallback: minimal inline data so site is resilient
        setMenu({
          season: "Summer 2026",
          lastUpdated: "2026-07-01",
          categories: [],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const categories = menu?.categories || [];
  const activeCategory = categories.find((c) => c.id === activeTab);

  return (
    <section id="menu" className="section max-w-5xl mx-auto px-6 pt-20 pb-24">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-mono tracking-[3.5px] text-xs text-[#81746a]">SEASONAL • INTIMATE</div>
            <h2 className="font-serif text-[52px] tracking-[-1.5px] leading-none text-[#2c2522] mt-1">The Table Tonight</h2>
          </div>
          {menu && (
            <div className="hidden md:block text-right">
              <div className="text-xs text-[#81746a] tracking-widest">SUMMER 2026</div>
              <div className="text-[11px] text-[#c46b4e]">{menu.season}</div>
            </div>
          )}
        </div>
        <p className="max-w-md text-[#5c524b] text-[14.5px]">
          A living menu. Maria prepares what the day offers. Every dish arrives when it is ready.
        </p>
      </div>

      {/* Elegant Tabs — feel like a handwritten course list */}
      <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-[#d9d0c2] pb-1 mb-9">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`menu-tab font-medium pb-3 ${activeTab === cat.id ? "active" : ""}`}
          >
            {cat.name}
            <span className="text-[#81746a] font-normal ml-1.5 tracking-normal text-sm">— {cat.english}</span>
          </button>
        ))}
      </div>

      {/* Menu Content — smooth transition between categories */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/60 animate-pulse" />
          ))}
        </div>
      ) : activeCategory ? (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {activeCategory.dishes.map((dish, idx) => (
                <DishCard key={dish.id} dish={dish} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-[#81746a] py-12 text-center">The menu is being written by the season.</div>
      )}

      <div className="mt-10 text-xs text-center text-[#81746a] tracking-widest font-mono">
        3–4 COURSES • WINE PAIRED BY SILVE • NO CHOICES NEEDED
      </div>
    </section>
  );
}
