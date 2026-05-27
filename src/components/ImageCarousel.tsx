import * as React from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideAsset {
  id: string;
  image_url: string;
  title?: string;
  tagline?: string;
  link?: string;
}

interface ImageCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  slides: SlideAsset[];
  autoPlayInterval?: number;
}

const ImageCarousel = React.forwardRef<HTMLDivElement, ImageCarouselProps>(
  ({ className, slides = [], autoPlayInterval = 6000, ...props }, ref) => {
    const [current, setCurrent] = React.useState(0);

    // Automatic transition loops
    React.useEffect(() => {
      if (slides.length <= 1) return;
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }, [slides.length, autoPlayInterval]);

    if (!slides || slides.length === 0) {
      return (
        <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0a101f]/40 p-6 text-center">
          <ImageIcon className="size-10 text-zinc-600" />
          <h3 className="mt-4 text-sm font-bold text-white uppercase tracking-wider">No Active Canvas Assets</h3>
          <p className="mt-1 max-w-xs text-xs text-zinc-400">Inject slideshow imagery via the management console to populate this frame.</p>
        </div>
      );
    }

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
      <div
        ref={ref}
        className={cn("group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#070b12] shadow-2xl", className)}
        {...props}
      >
        {/* SLIDE IMAGE STRIP */}
        <div className="relative h-[450px] w-full sm:h-[500px]">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 size-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                idx === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
              )}
            >
              {/* Image Layer */}
              <img
                src={slide.image_url}
                alt={slide.title || "Promotional Drop"}
                className="size-full object-cover object-center transform transition-transform duration-[8000ms] ease-out group-hover:scale-105"
              />
              
              {/* Dynamic Contrast Protection Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-[#070b12]/40 to-transparent" />

              {/* Context Text Details */}
              {(slide.title || slide.tagline) && (
                <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 z-20">
                  <div className="max-w-xl space-y-3">
                    {slide.tagline && (
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4ff00]">
                        {slide.tagline}
                      </p>
                    )}
                    {slide.title && (
                      <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-4xl leading-none">
                        {slide.title}
                      </h2>
                    )}
                    {slide.link && (
                      <a
                        href={slide.link}
                        className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 mt-2"
                      >
                        Explore Drop
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CONTROLLER DIRECTIONS BUTTONS */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a101f]/80 backdrop-blur-md text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 hover:bg-[#d4ff00] hover:text-black"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a101f]/80 backdrop-blur-md text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 hover:bg-[#d4ff00] hover:text-black"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* BOTTOM STEP INDICATORS */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-8 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  idx === current ? "w-6 bg-[#d4ff00]" : "w-1.5 bg-white/40 hover:bg-white"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
ImageCarousel.displayName = "ImageCarousel";

export { ImageCarousel };