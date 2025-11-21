import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/movement", label: "The Movement" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center pointer-events-auto">
        <Link href="/">
          <a className="font-display text-2xl font-bold text-brand-deep tracking-tight hover:opacity-80 transition-opacity">
            The Lively Three
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 bg-white/50 backdrop-blur-md px-8 py-3 rounded-full shadow-sm border border-brand-leaf/20">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a 
                className={`text-sm font-medium transition-colors hover:text-brand-deep ${
                  location === link.href ? "text-brand-deep" : "text-brand-dark/60"
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Menu className="w-6 h-6 text-brand-deep" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-brand-light border-l border-brand-leaf/20">
              <div className="flex flex-col gap-8 mt-10">
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a 
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-display font-medium ${
                        location === link.href ? "text-brand-deep" : "text-brand-dark/60"
                      }`}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
