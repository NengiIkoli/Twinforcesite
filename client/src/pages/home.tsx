import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Shield,
  Mail,
  MapPin,
  Star,
  ChevronRight,
  Menu,
  X,
  Clock,
  Award,
  Users,
  CheckCircle2,
  ChevronUp,
  ArrowRight,
  Send,
  ExternalLink,
  ClipboardList,
  Search,
  FileCheck,
  Handshake,
  CalendarCheck,
  ThumbsUp,
  Building2,
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

function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["services", "industries", "about", "testimonials", "contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Industries", href: "#industries" },
    { label: "Services", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="flex items-center" data-testid="link-logo">
            <TFLogoWithText size={36} scrolled={scrolled} />
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 relative ${
                  scrolled
                    ? "text-slate-700 dark:text-slate-200 hover:text-amber-600"
                    : "text-white/90 hover:text-white"
                } ${activeSection === link.href.slice(1) ? (scrolled ? "text-amber-600" : "text-white") : ""}`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-amber-500 rounded-full" />
                )}
              </a>
            ))}
            <a href="#contact">
              <Button size="sm" className="ml-4 gap-1.5 group" data-testid="button-nav-quote">
                Request a Quote
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </a>
          </div>

          <button
            className={`lg:hidden p-2 ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white dark:bg-slate-900 border-t shadow-lg`}
        data-testid="mobile-menu"
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-slate-700 dark:text-slate-200 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              data-testid={`link-mobile-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)}>
            <Button className="w-full mt-3" data-testid="button-mobile-quote">
              Request a Quote
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section
      className="relative min-h-[90vh] sm:min-h-screen flex items-center overflow-hidden"
      data-testid="section-hero"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms]"
        style={{
          backgroundImage: "url(/images/hero-cleaning.jpg)",
          transform: loaded ? "scale(1)" : "scale(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/65" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-2xl">
          <div className={`transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <Badge
              variant="outline"
              className="mb-6 border-amber-500/40 bg-amber-500/10 text-amber-400 px-4 py-1.5 text-xs sm:text-sm no-default-active-elevate"
              data-testid="badge-veteran"
            >
              <TFLogo size={20} className="mr-2" />
              Veteran-Owned & Operated
            </Badge>
          </div>

          <div className={`transition-all duration-700 delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
              data-testid="text-hero-title"
            >
              TwinForce
              <br />
              <span className="text-amber-400">Veteran Janitorial</span>
            </h1>
          </div>

          <div className={`transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p
              className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed"
              data-testid="text-hero-description"
            >
              Military precision meets exceptional service. We deliver comprehensive
              facility solutions for government agencies, educational institutions, and
              commercial enterprises.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-[600ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <a href="#contact">
              <Button size="lg" className="text-base gap-2 w-full sm:w-auto group" data-testid="button-hero-quote">
                Request a Quote
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <a href="#services">
              <Button
                size="lg"
                variant="outline"
                className="text-base border-white/30 text-white bg-white/10 backdrop-blur-sm w-full sm:w-auto no-default-active-elevate hover:bg-white/20 transition-all"
                data-testid="button-hero-services"
              >
                Our Services
              </Button>
            </a>
          </div>
        </div>

        <HeroStats loaded={loaded} />
      </div>
    </section>
  );
}

function HeroStats({ loaded }: { loaded: boolean }) {
  const { ref, inView } = useInView(0.5);
  const rating = useCounter(50, 1500, inView);
  const years = useCounter(15, 1500, inView);
  const contracts = useCounter(200, 2000, inView);

  return (
    <div
      ref={ref}
      className={`mt-10 sm:mt-16 flex items-start justify-between sm:justify-start sm:gap-10 lg:gap-16 transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="text-center flex-1 sm:flex-none" data-testid="stat-rating">
        <div className="flex items-center gap-0.5 sm:gap-1 mb-1 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <p className="text-white font-bold text-sm sm:text-xl">{(rating / 10).toFixed(1)} Rating</p>
      </div>
      <div className="text-center flex-1 sm:flex-none" data-testid="stat-experience">
        <p className="text-white font-bold text-xl sm:text-3xl">{years}+</p>
        <p className="text-slate-400 text-[10px] sm:text-sm">Years Experience</p>
      </div>
      <div className="text-center flex-1 sm:flex-none" data-testid="stat-contracts">
        <p className="text-white font-bold text-xl sm:text-3xl">{contracts}+</p>
        <p className="text-slate-400 text-[10px] sm:text-sm">Contracts Completed</p>
      </div>
    </div>
  );
}

const services = servicesData;

function ServiceCardAnimated({ service, index, inView }: {
  service: typeof services[0];
  index: number;
  inView: boolean;
}) {
  const isLeft = index % 2 === 0;
  const row = Math.floor(index / 2);

  return (
    <div
      className={`h-full transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : (isLeft ? "opacity-0 -translate-x-16" : "opacity-0 translate-x-16")}`}
      style={{ transitionDelay: inView ? `${row * 200 + (isLeft ? 0 : 100)}ms` : "0ms" }}
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        <Card
          className="h-full p-0 overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 group cursor-pointer hover:bg-white/10 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-500"
          data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <div className={`h-full flex flex-col ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
            <div className="sm:w-2/5 relative overflow-hidden flex-shrink-0">
              <div className="aspect-video sm:aspect-auto sm:h-full sm:min-h-[220px]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-slate-900/30" />
              </div>
            </div>
            <div className="sm:w-3/5 p-6 sm:p-7 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/25 group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex-1">
                  {service.title}
                </h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center text-sm font-semibold text-amber-400 gap-1 group-hover:text-amber-300 transition-colors mt-auto">
                Learn More <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

const processSteps = [
  {
    icon: ClipboardList,
    title: "Request a Quote",
    description: "Submit your facility details and service needs through our simple form.",
    number: "01",
  },
  {
    icon: Search,
    title: "Facility Assessment",
    description: "Our team conducts a thorough on-site evaluation of your space.",
    number: "02",
  },
  {
    icon: FileCheck,
    title: "Custom Proposal",
    description: "Receive a detailed service plan and transparent pricing tailored to you.",
    number: "03",
  },
  {
    icon: Handshake,
    title: "Contract & Onboarding",
    description: "Finalize terms and we assign a dedicated team to your facility.",
    number: "04",
  },
  {
    icon: CalendarCheck,
    title: "Service Begins",
    description: "Your customized cleaning and maintenance program launches on schedule.",
    number: "05",
  },
  {
    icon: ThumbsUp,
    title: "Ongoing Excellence",
    description: "Regular quality inspections and communication ensure continued satisfaction.",
    number: "06",
  },
];

function ServicesSection() {
  const { ref, inView } = useInView(0.05);
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-x-hidden" data-testid="section-services">
      <div className="absolute top-20 -left-32 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 -right-32 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex justify-center mb-4">
            <TFLogo size={48} />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4" data-testid="text-services-title">
            Comprehensive Facility Solutions
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            From daily janitorial services to specialized facility maintenance, we deliver
            excellence with military precision and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {services.slice(0, 2).map((service, i) => (
            <ServiceCardAnimated
              key={service.title}
              service={service}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        <div className={`text-center mt-10 sm:mt-14 transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <Link href="/services">
            <Button size="lg" variant="outline" className="gap-2 group border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 no-default-active-elevate" data-testid="button-view-all-services">
              View All Services
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const industries = [
  {
    title: "Government Agencies",
    description: "Federal, state & local facilities",
    image: "/images/government-agency.jpg",
    icon: Building2,
    details: [
      "GSA Schedule-compliant janitorial and facility maintenance",
      "Security-cleared personnel for sensitive government buildings",
      "Federal, state, and local contract experience",
      "Adherence to all government cleaning and safety standards",
    ],
  },
  {
    title: "Educational Institutions",
    description: "Schools, universities & campuses",
    image: "/images/education-institution.jpg",
    icon: Award,
    details: [
      "Safe, eco-friendly cleaning products for students and staff",
      "After-hours deep cleaning to minimize disruption",
      "Cafeteria, gymnasium, and restroom sanitization programs",
      "Seasonal deep cleans and post-event facility restoration",
    ],
  },
  {
    title: "Courts & Legal Facilities",
    description: "Courthouses & government buildings",
    image: "/images/courts-legal.jpg",
    icon: Shield,
    details: [
      "Background-checked teams for high-security environments",
      "Courtroom, office, and public area maintenance",
      "Discreet, professional service during operating hours",
      "Compliance with all facility security protocols",
    ],
  },
  {
    title: "Commercial Offices",
    description: "Corporate & business spaces",
    image: "/images/commercial-office.jpg",
    icon: Building2,
    details: [
      "Customized daily, weekly, and monthly cleaning schedules",
      "Lobby, conference room, and breakroom upkeep",
      "Floor care, window cleaning, and restroom sanitation",
      "Flexible service plans that scale with your business",
    ],
  },
];

function IndustriesSection() {
  const { ref, inView } = useInView(0.1);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="industries" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-950" data-testid="section-industries">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-industries-title">
            Trusted Across Industries
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            From government agencies to local businesses, we deliver the same unwavering
            commitment to excellence regardless of facility size or sector.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {industries.map((industry, i) => (
            <div
              key={industry.title}
              className={`rounded-lg overflow-hidden border transition-all duration-700 cursor-pointer ${
                selected === i
                  ? "border-amber-500/40 shadow-lg"
                  : "border-slate-200 dark:border-slate-800 hover:border-amber-500/20 hover:shadow-md"
              } ${inView ? "opacity-100 translate-x-0" : (i % 2 === 0 ? "opacity-0 -translate-x-10" : "opacity-0 translate-x-10")}`}
              style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
              onClick={() => setSelected(selected === i ? null : i)}
              data-testid={`card-industry-${industry.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className={`flex flex-col ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                <div className="sm:w-2/5 relative overflow-hidden">
                  <div className="aspect-[16/10] sm:aspect-auto sm:h-full">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${selected === i ? "scale-105" : "group-hover:scale-105"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent sm:bg-gradient-to-t sm:from-slate-900/30 sm:to-transparent" />
                  </div>
                </div>
                <div className="sm:w-3/5 p-5 sm:p-7 lg:p-8 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <industry.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {industry.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{industry.description}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border border-amber-500/30 flex items-center justify-center transition-transform duration-300 ${selected === i ? "rotate-180 bg-amber-500/10" : ""}`}>
                      <ChevronRight className={`w-3.5 h-3.5 text-amber-500 transition-transform duration-300 ${selected === i ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${selected === i ? "max-h-72 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                      <p className="text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">How We Serve</p>
                      {industry.details.map((detail, j) => (
                        <div key={j} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{detail}</p>
                        </div>
                      ))}
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-500 text-sm font-semibold mt-3 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`link-industry-quote-${i}`}
                      >
                        Request a Quote <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const whyUs = [
  {
    icon: Shield,
    title: "Veteran-Owned\nExcellence",
    description: "Founded and operated by military veterans who bring discipline, integrity, and commitment to every contract.",
  },
  {
    icon: Award,
    title: "Certified &\nCompliant",
    description: "GSA Schedule holder, SBA certified, and fully compliant with federal, state, and local regulations.",
  },
  {
    icon: Clock,
    title: "24/7\nAvailability",
    description: "Round-the-clock service with rapid emergency capabilities for your peace of mind.",
  },
  {
    icon: Users,
    title: "Trained\nProfessionals",
    description: "Rigorously trained, background-checked staff with security clearances for sensitive facilities.",
  },
];

const certifications = [
  "GSA Schedule Holder",
  "SBA 8(a) Certified",
  "SDVOSB Certified",
  "Green Seal Certified",
  "OSHA Compliant",
  "Bonded & Insured",
];

function MilitaryChevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 8 L188 60 L188 170 L100 232 L12 170 L12 60 Z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.15" />
      <path d="M100 24 L174 68 L174 162 L100 216 L26 162 L26 68 Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.1" />
      <path d="M100 40 L160 76 L160 154 L100 200 L40 154 L40 76 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.08" />
    </svg>
  );
}

function AboutSection() {
  const { ref, inView } = useInView(0.1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const missionPillars = [
    { icon: Shield, label: "INTEGRITY", value: "Zero-compromise ethics in every contract" },
    { icon: Award, label: "EXCELLENCE", value: "Exceeding standards, not just meeting them" },
    { icon: Users, label: "TEAMWORK", value: "Cohesive units delivering unified results" },
    { icon: Clock, label: "DISCIPLINE", value: "Consistent execution, day after day" },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden overflow-y-visible" data-testid="section-about">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none" aria-hidden="true">
        <MilitaryChevron className="w-full h-full text-amber-500" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rotate-12 opacity-50 pointer-events-none" aria-hidden="true">
        <MilitaryChevron className="w-full h-full text-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <div className={`text-center max-w-3xl mx-auto mb-14 sm:mb-20 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex justify-center mb-5">
            <div className="relative">
              <svg viewBox="0 0 100 110" className="w-20 h-22 sm:w-24 sm:h-26" fill="none">
                <path d="M50 4 L92 28 L92 76 L50 106 L8 76 L8 28 Z" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />
                <path d="M50 14 L84 34 L84 72 L50 96 L16 72 L16 34 Z" fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <TFLogo size={44} />
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4" data-testid="text-about-title">
            Mission-Driven Service Excellence
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            At TwinForce, we bring military values to commercial cleaning. Our veteran
            leadership ensures every contract is executed with precision, accountability,
            and an unwavering commitment to exceeding expectations.
          </p>
        </div>

        <div className={`relative max-w-4xl mx-auto mb-14 sm:mb-20 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/0 via-amber-500/30 to-amber-500/0" />

          <div className="relative mx-auto max-w-md sm:max-w-none">
            <svg viewBox="0 0 400 480" className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[360px] h-[440px] pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M200 10 L370 95 L370 340 L200 470 L30 340 L30 95 Z" stroke="rgba(245,158,11,0.12)" strokeWidth="2" strokeDasharray="8 4" fill="none" />
              <path d="M200 50 L340 120 L340 320 L200 430 L60 320 L60 120 Z" stroke="rgba(245,158,11,0.06)" strokeWidth="1.5" fill="none" />
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-x-12 sm:gap-y-8">
              {missionPillars.map((pillar, i) => {
                const isRight = i % 2 === 1;
                return (
                  <div
                    key={pillar.label}
                    className={`flex items-start gap-4 group transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : (isRight ? "opacity-0 translate-x-8" : "opacity-0 -translate-x-8")}`}
                    style={{ transitionDelay: inView ? `${300 + i * 150}ms` : "0ms" }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    data-testid={`card-why-${pillar.label.toLowerCase()}`}
                  >
                    <div className="relative flex-shrink-0">
                      <svg viewBox="0 0 56 64" className="w-16 h-[72px] sm:w-20 sm:h-[88px]" fill="none">
                        <path
                          d="M28 2 L52 16 L52 46 L28 62 L4 46 L4 16 Z"
                          className={`transition-all duration-500 ${hoveredCard === i ? "fill-amber-500 stroke-amber-400" : "fill-white/5 stroke-white/15"}`}
                          strokeWidth="1.5"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <pillar.icon className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ${hoveredCard === i ? "text-white scale-110" : "text-amber-400"}`} />
                      </div>
                    </div>
                    <div className="pt-1">
                      <p className="text-amber-400 text-xs sm:text-sm font-bold tracking-[0.2em] mb-1.5">{pillar.label}</p>
                      <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{pillar.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={`max-w-4xl mx-auto mb-14 sm:mb-20 transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="relative pt-4">
            <div className="absolute -top-0 left-6 sm:left-8 z-10">
              <div className="bg-amber-500 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 flex items-center gap-2 rounded-sm shadow-lg shadow-amber-500/20" style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}>
                <Star className="w-3.5 h-3.5" /> Chain of Command
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 sm:p-8 pt-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { rank: "01", title: "Assessment", desc: "We survey your facility and identify all requirements with military-grade thoroughness." },
                  { rank: "02", title: "Deployment", desc: "Trained teams are assigned and equipped with the right tools for your specific needs." },
                  { rank: "03", title: "Execution", desc: "Consistent, inspected service delivery with regular reporting and quality checks." },
                ].map((step, i) => (
                  <div
                    key={step.rank}
                    className={`relative transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ transitionDelay: inView ? `${600 + i * 150}ms` : "0ms" }}
                    data-testid={`about-step-${i}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0 w-12 h-14">
                        <svg viewBox="0 0 48 56" className="w-12 h-14" fill="none">
                          <path d="M24 2 L45 14 L45 40 L24 54 L3 40 L3 14 Z" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-amber-400 font-bold text-base">{step.rank}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-base sm:text-lg mb-1">{step.title}</p>
                        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                    {i < 2 && (
                      <div className="hidden sm:block absolute top-5 -right-3 sm:-right-4">
                        <ChevronRight className="w-4 h-4 text-amber-500/40" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 lg:p-10 border border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              Certifications & Credentials
            </h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-2.5 rounded-full border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300"
                  data-testid={`text-cert-${cert.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote:
      "TwinForce transformed our facility operations. Their military precision and attention to detail is unmatched. We've reduced complaints by 95% since bringing them on board.",
    author: "Director of Operations",
    org: "Federal Government Agency",
  },
  {
    quote:
      "As a school administrator, finding a cleaning service that understands the importance of safe, eco-friendly products was crucial. TwinForce delivers excellence every single day.",
    author: "Superintendent",
    org: "Public School District",
  },
  {
    quote:
      "The professionalism and reliability of the TwinForce team is exceptional. They've been our trusted partner for government contracts for over 8 years now.",
    author: "Facilities Manager",
    org: "State Administrative Office",
  },
];

function TestimonialsSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900"
      data-testid="section-testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className={`text-center max-w-2xl mx-auto mb-12 sm:mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-amber-600 dark:text-amber-400 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3">
            Client Success Stories
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4" data-testid="text-testimonials-title">
            Trusted by Industry Leaders
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Our commitment to excellence has earned us long-term partnerships with
            government agencies, educational institutions, and commercial enterprises nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: inView ? `${i * 150}ms` : "0ms" }}
              data-testid={`card-testimonial-${i}`}
            >
              <div className="flex items-center gap-1 mb-4">
                <TFLogo size={36} />
              </div>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-slate-900 dark:text-white font-semibold text-sm">{t.author}</p>
                <p className="text-slate-500 text-xs sm:text-sm">{t.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-950 to-slate-900" data-testid="section-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className={`transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <div className="flex items-center mb-6">
              <TFLogoWithText size={40} scrolled={false} />
            </div>

            <p className="text-amber-400 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4" data-testid="text-contact-title">
              Request Your Free Quote Today
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
              Ready to experience the TwinForce difference? Contact us for a complimentary
              facility assessment and customized service proposal.
            </p>

            <div className="space-y-6">
              <div data-testid="contact-email">
                <a
                  href="mailto:TwinForceVeteranJanitorialllc@yahoo.com"
                  className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-2.5 rounded-md border border-white/20 transition-all duration-300 hover:border-amber-500/40 group text-sm"
                  data-testid="button-email-us"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  Email Us Directly
                  <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-slate-400 text-sm mt-2 ml-1">
                  Response within 24 hours
                </p>
              </div>

              <div className="flex items-start gap-4" data-testid="contact-address">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Headquarters</p>
                  <p className="text-slate-300">Serving clients nationwide</p>
                  <p className="text-slate-400 text-sm">
                    Multiple regional offices
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/quote-requests", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    mutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 text-center border border-white/10" data-testid="form-success">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-slate-300">
          Your request has been received. A member of our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-md border border-white/15 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-200 placeholder:text-slate-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-white/10"
      data-testid="form-contact"
    >
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
        Get a Free Estimate
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Fill out the form and we'll get back to you promptly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="John Smith"
            data-testid="input-name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
            placeholder="john@company.com"
            data-testid="input-email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={inputClass}
            placeholder="(555) 123-4567"
            data-testid="input-phone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={inputClass}
            placeholder="Company name"
            data-testid="input-company"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Service Needed
        </label>
        <select
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className={inputClass}
          data-testid="select-service"
        >
          <option value="">Select a service</option>
          <option value="commercial-cleaning">Commercial Cleaning</option>
          <option value="facility-maintenance">Facility Maintenance</option>
          <option value="waste-management">Waste Management</option>
          <option value="carpet-floor">Carpet & Floor Care</option>
          <option value="disinfection">Disinfection Services</option>
          <option value="specialized">Specialized Services</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Message
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your facility and cleaning needs..."
          data-testid="textarea-message"
        />
      </div>

      {submitError && (
        <p className="text-red-400 text-sm mb-3 text-center" data-testid="text-submit-error">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full text-base gap-2 group"
        size="lg"
        disabled={mutation.isPending}
        data-testid="button-submit-quote"
      >
        {mutation.isPending ? (
          "Submitting..."
        ) : (
          <>
            Submit Request
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </Button>

      <p className="text-xs text-slate-500 text-center mt-3">
        We respect your privacy. Your information will never be shared.
      </p>
    </form>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 py-12 sm:py-16 border-t border-slate-800" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <TFLogoWithText size={40} scrolled={false} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Military precision meets exceptional service. Proudly serving government,
              education, and commercial facilities nationwide.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["Commercial Cleaning", "Facility Maintenance", "Waste Management", "Floor Care", "Disinfection"].map(
                (s) => (
                  <li key={s}>
                    <Link
                      href="/services"
                      className="text-slate-400 text-sm hover:text-amber-400 transition-colors duration-200"
                      data-testid={`link-footer-${s.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {s}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Certifications", "Contact"].map((s) => (
                <li key={s}>
                  <a
                    href={s === "Contact" ? "#contact" : "#about"}
                    className="text-slate-400 text-sm hover:text-amber-400 transition-colors duration-200"
                    data-testid={`link-footer-${s.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:TwinForceVeteranJanitorialllc@yahoo.com"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors duration-200"
                data-testid="link-footer-email"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                Email Us
              </a>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                Serving Nationwide
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} TwinForce Veteran Janitorial Services. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors" data-testid="link-privacy-policy">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors" data-testid="link-terms">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Scroll to top"
      data-testid="button-scroll-top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <IndustriesSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
