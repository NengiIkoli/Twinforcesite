import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { TFLogo, TFLogoWithText } from "@/components/TFLogo";
import { Link, useLocation } from "wouter";
import { servicesData } from "@/data/services";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const services = servicesData;

function ServiceCard({ service, index }: {
  service: typeof services[0];
  index: number;
}) {
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        <div
          className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 hover:shadow-lg group cursor-pointer transition-all duration-500"
          data-testid={`card-service-detail-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-amber-500/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-amber-500/30 transition-colors duration-300">
                  <service.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg sm:text-xl">{service.title}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex flex-col flex-1">
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 mb-4 flex-1 content-start">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center text-sm font-semibold text-amber-600 dark:text-amber-400 gap-1 group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors mt-auto">
              View Full Details <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ServicesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  const navigateToQuote = useCallback(() => {
    setLocation("/");
    requestAnimationFrame(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
  }, [setLocation]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg"
            : "bg-slate-900/95 backdrop-blur-md"
        }`}
        data-testid="navbar-services"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center" data-testid="link-back-home">
              <TFLogoWithText size={36} scrolled={scrolled} />
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className={`gap-2 ${scrolled ? "" : "border-white/30 text-white bg-white/10 hover:bg-white/20 no-default-active-elevate"}`} data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-5">
              <TFLogo size={48} />
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5"
              data-testid="text-services-page-title"
            >
              Our Facility Solutions
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Comprehensive janitorial and facility maintenance services delivered with
              military precision. Select any service below to see full details.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
              />
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <p className="text-slate-600 dark:text-slate-400 mb-5">
              Need a customized service plan? Let's discuss your facility's needs.
            </p>
            <Button size="lg" className="gap-2 group" data-testid="button-services-cta" onClick={navigateToQuote}>
              Get Your Free Quote
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} TwinForce Veteran Janitorial Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
