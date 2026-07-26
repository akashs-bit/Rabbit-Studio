import React, { useMemo, useState } from "react";
import { FiChevronDown, FiSliders, FiRotateCcw, FiCheck } from "react-icons/fi";

const FILTERS = {
  categories: ["Top Wear", "Bottom Wear", "Accessories", "Footwear"],
  genders: ["Men", "Women", "Unisex"],
  brands: ["Rabbit Elite", "Urban Aura", "Nordic Silk", "Ethos"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF", ring: "ring-neutral-200" },
    { name: "Stone", hex: "#D6D3D1" },
    { name: "Olive", hex: "#3F6212" },
    { name: "Navy", hex: "#1E293B" },
    { name: "Earth", hex: "#78350F" },
  ],
};

const initialFilters = {
  categories: [],
  genders: [],
  brands: [],
  sizes: [],
  colors: [],
  maxPrice: 15000,
};

const FilterSidebar = ({ filters = initialFilters, setFilters }) => {
  // Fallback local state if setFilters isn't provided by parent
  const [localFilters, setLocalFilters] = useState(initialFilters);

  // Use parent filters if provided, otherwise fallback to local state
  const currentFilters =
    filters && typeof filters === "object" ? filters : localFilters;

  const updateFilters = (nextFilters) => {
    if (typeof setFilters === "function") {
      setFilters(nextFilters);
    } else {
      setLocalFilters(nextFilters);
    }
  };

  const activeCount = useMemo(() => {
    return (
      (currentFilters.categories?.length || 0) +
      (currentFilters.genders?.length || 0) +
      (currentFilters.brands?.length || 0) +
      (currentFilters.sizes?.length || 0) +
      (currentFilters.colors?.length || 0) +
      ((currentFilters.maxPrice ?? 15000) < 15000 ? 1 : 0)
    );
  }, [currentFilters]);

  const toggleValue = (group, value) => {
    const currentValues = currentFilters[group] || [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateFilters({
      ...currentFilters,
      [group]: nextValues,
    });
  };

  const resetFilters = () => {
    updateFilters(initialFilters);
  };

  return (
    <aside className="w-full lg:w-80 h-fit lg:sticky lg:top-32 mb-10 lg:mb-0 rounded-3xl border border-neutral-200 bg-neutral-50/90 p-6 shadow-sm backdrop-blur-md">
      <div className="mb-9 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">
            <FiSliders size={15} />
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-neutral-950">
              Refine
            </h3>

            {activeCount > 0 && (
              <p className="mt-1 text-[10px] font-bold text-neutral-400">
                {activeCount} active
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          disabled={activeCount === 0}
          className="group inline-flex items-center gap-1.5 text-neutral-400 transition-colors hover:text-black disabled:pointer-events-none disabled:opacity-40"
        >
          <FiRotateCcw
            size={13}
            className="transition-transform group-hover:-rotate-45"
          />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Reset
          </span>
        </button>
      </div>

      <div className="space-y-8">
        <FilterSection title="Category">
          {FILTERS.categories.map((item) => (
            <CheckboxLabel
              key={item}
              label={item}
              checked={currentFilters.categories?.includes(item)}
              onChange={() => toggleValue("categories", item)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Gender">
          {FILTERS.genders.map((item) => (
            <CheckboxLabel
              key={item}
              label={item}
              checked={currentFilters.genders?.includes(item)}
              onChange={() => toggleValue("genders", item)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Color Palette">
          <div className="flex flex-wrap gap-4 pt-1">
            {FILTERS.colors.map((color) => {
              const checked = currentFilters.colors?.includes(color.name);

              return (
                <label
                  key={color.name}
                  className="group flex cursor-pointer flex-col items-center gap-2"
                  title={color.name}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleValue("colors", color.name)}
                    className="sr-only"
                  />

                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full ring-1 ring-inset ${
                      color.ring || "ring-black/10"
                    } transition-transform group-hover:scale-110 ${
                      checked
                        ? "outline outline-2 outline-offset-2 outline-black"
                        : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {checked && (
                      <FiCheck
                        size={14}
                        className={
                          color.name === "White" || color.name === "Stone"
                            ? "text-black"
                            : "text-white"
                        }
                      />
                    )}
                  </span>

                  <span className="text-[8px] font-black uppercase tracking-tight text-neutral-400 transition-colors group-hover:text-black">
                    {color.name}
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Size Guide">
          <div className="grid grid-cols-3 gap-2 pt-1">
            {FILTERS.sizes.map((size) => {
              const checked = currentFilters.sizes?.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleValue("sizes", size)}
                  aria-pressed={checked}
                  className={`rounded-xl border px-3 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-sm transition-all ${
                    checked
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Brand">
          {FILTERS.brands.map((item) => (
            <CheckboxLabel
              key={item}
              label={item}
              checked={currentFilters.brands?.includes(item)}
              onChange={() => toggleValue("brands", item)}
            />
          ))}
        </FilterSection>

        <div className="pt-1">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-900">
              Price Range
            </span>
            <span className="text-xs font-black text-neutral-900">
              ₹{(currentFilters.maxPrice ?? 15000).toLocaleString("en-IN")}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="15000"
            step="100"
            value={currentFilters.maxPrice ?? 15000}
            onChange={(event) =>
              updateFilters({
                ...currentFilters,
                maxPrice: Number(event.target.value),
              })
            }
            aria-label="Maximum price"
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-black"
          />

          <div className="mt-4 flex justify-between">
            <PriceLabel label="Min" value="₹0" />
            <PriceLabel label="Max" value="₹15,000+" align="right" />
          </div>
        </div>
      </div>
    </aside>
  );
};

const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-b border-neutral-200/70 pb-7 last:border-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mb-5 flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-neutral-950">
          {title}
        </span>

        <FiChevronDown
          className={`text-neutral-400 transition-transform duration-300 ${
            open ? "rotate-180 text-black" : ""
          }`}
        />
      </button>

      {open && <div className="space-y-3 px-1">{children}</div>}
    </section>
  );
};

const CheckboxLabel = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-4">
    <span
      className={`text-xs font-bold transition-colors ${
        checked ? "text-black" : "text-neutral-500 hover:text-black"
      }`}
    >
      {label}
    </span>

    <span className="relative grid h-5 w-5 place-items-center">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-neutral-200 bg-white shadow-sm transition-all checked:border-black checked:bg-black"
      />

      <FiCheck
        size={12}
        className="pointer-events-none absolute scale-0 text-white transition-transform peer-checked:scale-100"
      />
    </span>
  </label>
);

const PriceLabel = ({ label, value, align = "left" }) => (
  <div className={`flex flex-col ${align === "right" ? "items-end" : ""}`}>
    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-400">
      {label}
    </span>
    <span className="text-xs font-bold text-neutral-900">{value}</span>
  </div>
);

export default FilterSidebar;
