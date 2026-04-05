import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import type { Page } from "@/types/track";
import {
  BarChart2,
  ChevronDown,
  DollarSign,
  Home,
  LogIn,
  LogOut,
  Menu,
  Music,
  Music4,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

type NavIcon = React.ComponentType<{ className?: string }>;

const NAV_LINKS: { label: string; page: Page; icon: NavIcon }[] = [
  { label: "Dashboard", page: "dashboard", icon: Home },
  { label: "Releases", page: "releases", icon: Music },
  { label: "Analytics", page: "analytics", icon: BarChart2 },
  { label: "Distribution", page: "distribution", icon: Send },
  { label: "Earn", page: "earn", icon: DollarSign },
  { label: "Copyright", page: "copyright", icon: ShieldCheck },
];

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { identity, login, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const principalShort = isLoggedIn
    ? `${identity.getPrincipal().toText().slice(0, 8)}...`
    : null;
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[oklch(0.13_0.018_265/0.95)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 flex-shrink-0"
          data-ocid="header.dashboard.link"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <Music4 className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-foreground">
            SoundLaunch
          </span>
        </button>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors relative ${
                currentPage === link.page
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-ocid={`header.${link.page}.link`}
            >
              {link.label}
              {currentPage === link.page && (
                <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-9 px-2"
                  data-ocid="header.user.button"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {principalShort?.[0].toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {principalShort}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={clear}
                  data-ocid="header.signout.button"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white hidden sm:flex"
              onClick={login}
              data-ocid="header.signin.button"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                aria-label="Open navigation menu"
                data-ocid="header.menu.open_modal_button"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-[oklch(0.13_0.018_265)] border-border p-0"
              data-ocid="header.menu.sheet"
            >
              <SheetHeader className="p-5 border-b border-border">
                <SheetTitle asChild>
                  <button
                    type="button"
                    onClick={() => handleNavigate("dashboard")}
                    className="flex items-center gap-2 text-left w-full"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                      <Music4 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-bold text-foreground">
                      SoundLaunch
                    </span>
                  </button>
                </SheetTitle>
              </SheetHeader>
              <nav className="p-3 space-y-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.page}
                      type="button"
                      onClick={() => handleNavigate(link.page)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === link.page
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      data-ocid={`header.mobile.${link.page}.link`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </button>
                  );
                })}
              </nav>
              {!isLoggedIn && (
                <div className="p-3 border-t border-border">
                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white gap-2"
                    onClick={() => {
                      login();
                      setSheetOpen(false);
                    }}
                    data-ocid="header.mobile.signin.button"
                  >
                    <LogIn className="h-4 w-4" /> Sign In
                  </Button>
                </div>
              )}
              {isLoggedIn && (
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      clear();
                      setSheetOpen(false);
                    }}
                    data-ocid="header.mobile.signout.button"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile scroll nav tabs */}
      <div className="md:hidden flex overflow-x-auto border-t border-border scrollbar-none">
        {NAV_LINKS.map((link) => (
          <button
            type="button"
            key={link.page}
            onClick={() => onNavigate(link.page)}
            className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              currentPage === link.page
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
            data-ocid={`header.mobile_tab.${link.page}.tab`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
}
