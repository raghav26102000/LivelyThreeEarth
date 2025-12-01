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

// Define your logo's path
const LOGO_PATH = "/logo.jpeg"; 
const BRAND_NAME = "The Lively Three"; 

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center pointer-events-auto">
        <Link href="/">
         {/* FIX 1: Changed inner <a> to <div> */}
          <div className="flex items-center space-x-3 p-1 rounded-lg transition-opacity hover:opacity-90">
            {/* Logo Image */}
            <img 
              src={LOGO_PATH} 
              alt={`${BRAND_NAME} Logo`} 
              className="w-12 h-12 md:w-10 md:h-10 object-contain rounded-lg shadow-md"
            />
            
            {/* Brand Text */}
            <span className="font-display text-3xl md:text-2xl font-bold text-brand-deep tracking-tight">
              {BRAND_NAME}
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Increased padding and text size */}
        <div className="hidden md:flex gap-8 bg-white/50 backdrop-blur-md px-10 py-4 rounded-full shadow-sm border border-brand-leaf/20">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {/* FIX 2: Changed <a> to <span> */}
              <span 
                className={`text-base font-medium transition-colors hover:text-brand-deep ${
                  location === link.href ? "text-brand-deep" : "text-brand-dark/60"
                }`}
              >
                {link.label}
              </span>
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
                    {/* FIX 3: Changed <a> to <span> */}
                    <span 
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-display font-medium ${
                        location === link.href ? "text-brand-deep" : "text-brand-dark/60"
                      }`}
                    >
                      {link.label}
                    </span>
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