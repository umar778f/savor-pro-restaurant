import { useState } from "react";
import { usePOS } from "../context/POSContext";
import { formatCurrency } from "../lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import { menuItems } from "../data/menu";
import CartPanel from "../components/cart/CartPanel";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Burgers", "Pizza", "Sides", "Sandwiches", "Pasta", "Wraps", "Drinks"];

export default function POS() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const { addToCart, cart, total } = usePOS();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full w-full relative">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="p-4 md:p-6 pb-0 flex-shrink-0">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Point of Sale</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Select items to add to current order</p>
            </div>
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl leading-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex items-center justify-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mr-2 flex-shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === category
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Food Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2">
          {filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 mb-4 text-zinc-300 dark:text-zinc-700">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No items found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer"
                  onClick={() => addToCart(item)}
                >
                  <div className="relative h-40 md:h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold flex items-center shadow-sm">
                      <span className="text-yellow-500 mr-1">★</span>
                      {item.rating}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">{item.category}</div>
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{item.prepTime} prep</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-lg text-zinc-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </span>
                      <button 
                        className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel - Desktop */}
      <div className="hidden lg:block w-[380px] xl:w-[420px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full flex-shrink-0 z-10 shadow-xl shadow-black/5 dark:shadow-none">
        <CartPanel />
      </div>

      {/* Cart Panel - Mobile */}
      <AnimatePresence>
        {mobileCartOpen && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col"
          >
            <div className="flex-1 overflow-hidden relative">
              <button 
                onClick={() => setMobileCartOpen(false)}
                className="absolute top-5 right-6 z-20 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <CartPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Cart Toggle */}
      {!mobileCartOpen && cart.length > 0 && (
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white dark:from-zinc-950 dark:via-zinc-950 to-transparent pt-12 pb-4 px-4 z-20">
          <button 
            onClick={() => setMobileCartOpen(true)} // Open mobile cart panel state
            className="w-full flex items-center justify-between bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 w-8 h-8 flex items-center justify-center rounded-lg text-sm">{cart.length}</div>
              <span>View Cart</span>
            </div>
            <span>{formatCurrency(total)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
