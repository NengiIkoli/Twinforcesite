import logoImg from "../assets/logo.jpeg";

interface TFLogoProps {
  size?: number;
  className?: string;
}

export function TFLogo({ size = 40, className = "" }: TFLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0 bg-slate-900/80 border border-amber-500/30 ${className}`}
      style={{ width: size, height: size }}
      data-testid="img-logo"
    >
      <img
        src={logoImg}
        alt="TwinForce Logo"
        className="w-[90%] h-[90%] object-contain"
      />
    </div>
  );
}

export function TFLogoWithText({
  size = 40,
  scrolled = false,
}: {
  size?: number;
  scrolled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3" data-testid="img-logo">
      <TFLogo size={size} />

      <div className="leading-tight">
        <span
          className={`font-extrabold text-lg sm:text-xl tracking-wide block ${
            scrolled ? "text-slate-900 dark:text-white" : "text-white"
          }`}
        >
          TWINFORCE
        </span>

        <span
          className={`text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-medium block ${
            scrolled ? "text-slate-400 dark:text-slate-400" : "text-slate-400"
          }`}
        >
          Janitorial Services
        </span>
      </div>
    </div>
  );
}
