import { Music4 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[oklch(0.12_0.015_265)] py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Music4 className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              SoundLaunch
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {[
              "About",
              "Distribution",
              "Pricing",
              "Blog",
              "Support",
              "Terms",
              "Privacy",
            ].map((link) => (
              <span
                key={link}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {link}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; 2026 SoundLaunch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
