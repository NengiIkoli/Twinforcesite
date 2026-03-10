import logoImg from "@assets/IMG_90873A051BC8-1_1772666662988.jpeg";

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
      <canvas
        ref={(canvas) => {
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imageData.data;
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i], g = d[i+1], b = d[i+2];
              const brightness = (r + g + b) / 3;
              if (brightness > 220) {
                d[i+3] = 0;
              } else if (r > 180 && g > 120 && b < 80) {
                d[i] = 245; d[i+1] = 158; d[i+2] = 11;
              } else {
                d[i] = 255; d[i+1] = 255; d[i+2] = 255;
              }
            }
            ctx.putImageData(imageData, 0, 0);
          };
          img.src = logoImg;
        }}
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
