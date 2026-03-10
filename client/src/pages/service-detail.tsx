import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useLocation } from "wouter";
import { Link } from "wouter";
import {
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { TFLogo, TFLogoWithText } from "@/components/TFLogo";
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

const allServices = servicesData;

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const [scrolled, setScrolled] = useState(false);
  const { ref: featuresRef, inView: featuresInView } = useInView(0.1);
  const { ref: benefitsRef, inView: benefitsInView } = useInView(0.1);
  const { ref: processRef, inView: processInView } = useInView(0.1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [params.slug]);

  const [, setLocation] = useLocation();

  const navigateToQuote = useCallback(() => {
    setLocation("/");
    requestAnimationFrame(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "instant" });
    });
  }, [setLocation]);

  const service = allServices.find((s) => s.slug === params.slug);
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Service Not Found</h1>
          <Link href="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allServices.findIndex((s) => s.slug === params.slug);
  const prevService = currentIndex > 0 ? allServices[currentIndex - 1] : null;
  const nextService = currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg"
            : "bg-slate-900/95 backdrop-blur-md"
        }`}
        data-testid="navbar-service-detail"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center" data-testid="link-back-home">
              <TFLogoWithText size={36} scrolled={scrolled} />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/services">
                <Button variant="outline" size="sm" className={`gap-1 sm:gap-2 text-xs sm:text-sm ${scrolled ? "" : "border-white/30 text-white bg-white/10 hover:bg-white/20 no-default-active-elevate"}`} data-testid="button-all-services">
                  All Services
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className={`gap-1 sm:gap-2 text-xs sm:text-sm ${scrolled ? "" : "border-white/30 text-white bg-white/10 hover:bg-white/20 no-default-active-elevate"}`} data-testid="button-back-home">
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 h-[500px] sm:h-[550px]">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-blue-950/85 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16 sm:pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 backdrop-blur-sm flex items-center justify-center">
              <service.icon className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">TwinForce Service</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white" data-testid="text-service-title">
                {service.title}
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
            {service.description}
          </p>
          <Button size="lg" className="gap-2 group" data-testid="button-hero-quote" onClick={navigateToQuote}>
            Get a Free Quote
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-12">
            {service.fullDescription}
          </p>

          <div ref={featuresRef}>
            <div className={`transition-all duration-700 ${featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-amber-500" />
                What's Included
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((feature, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:border-amber-500/30 hover:shadow-sm ${featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: featuresInView ? `${i * 60}ms` : "0ms" }}
                  data-testid={`feature-${i}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={benefitsRef}>
          <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${benefitsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
              Why Choose TwinForce
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              The advantages of partnering with us for {service.title.toLowerCase()}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {service.benefits.map((benefit, i) => (
              <div
                key={i}
                className={`bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-500 ${benefitsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: benefitsInView ? `${i * 100}ms` : "0ms" }}
                data-testid={`benefit-${i}`}
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={processRef}>
          <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${processInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Our Process
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              How we deliver {service.title.toLowerCase()} for your facility.
            </p>
          </div>

          <div className="relative">
            <div className="hidden sm:block absolute left-6 top-0 bottom-0 w-0.5 bg-amber-500/20" />

            <div className="space-y-8">
              {service.process.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-5 transition-all duration-700 ${processInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                  style={{ transitionDelay: processInView ? `${i * 150}ms` : "0ms" }}
                  data-testid={`process-step-${i}`}
                >
                  <div className="relative z-10 w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
                    <span className="text-white font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-xl p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-lg mx-auto">
              Contact us today for a free facility assessment and customized {service.title.toLowerCase()} proposal.
            </p>
            <Button size="lg" className="gap-2 group" data-testid="button-bottom-quote" onClick={navigateToQuote}>
              Request Your Free Quote
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-8">
            {prevService ? (
              <Link href={`/services/${prevService.slug}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm font-medium" data-testid="link-prev-service">
                <ArrowLeft className="w-4 h-4" />
                {prevService.title}
              </Link>
            ) : <div />}
            {nextService ? (
              <Link href={`/services/${nextService.slug}`} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm font-medium" data-testid="link-next-service">
                {nextService.title}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : <div />}
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
