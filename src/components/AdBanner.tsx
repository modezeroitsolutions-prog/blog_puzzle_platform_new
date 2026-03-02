import { Card } from "./ui/card";

interface AdBannerProps {
  size?: "small" | "medium" | "large";
  position?: string;
}

export function AdBanner({
  size = "medium",
  position = "sidebar",
}: AdBannerProps) {
  const heights = {
    small: "h-24",
    medium: "h-48",
    large: "h-64",
  };

  return (
    <Card
      className={`${heights[size]} flex items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 border-2 border-dashed border-slate-300`}
    >
      <div className="text-center p-4">
        <p className="text-slate-500 text-sm mb-1">Advertisement</p>
        <p className="text-slate-400 text-xs">
          {size === "large"
            ? "728 x 90"
            : size === "medium"
              ? "300 x 250"
              : "300 x 100"}
        </p>
        <p className="text-slate-400 text-xs mt-2">
          Ad revenue supports puzzle creators & solvers
        </p>
      </div>
    </Card>
  );
}
