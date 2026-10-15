"use client";

import Link from "next/link";
import { club, img } from "@/lib/site-data";
import { BallIcon } from "./Primitives";
import { Reveal } from "./Reveal";
import { Instagram, Twitter, Facebook, Youtube, Phone, Mail } from "lucide-react";

const socialLinks = [
  { href: club.social.instagram, label: "Instagram", Icon: Instagram },
  { href: club.social.facebook, label: "Facebook", Icon: Facebook },
  { href: club.social.youtube, label: "YouTube", Icon: Youtube },
  { href: club.social.x, label: "X (Twitter)", Icon: Twitter },
].filter((link) => link.href);

const columns = [
  {
    title: "Club",
    links: [
      { to: "/about", label: "About us" },
      { to: "/career", label: "Careers" },
      { to: "/partner", label: "Argentinos Juniors" },
    ],
  },
  {
    title: "Academy",
    links: [
      { to: "/programs", label: "Programmes" },
      { to: "/gallery", label: "Gallery" },
      { to: "/contact", label: "Trials & admissions" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#050505] text-white pt-24 pb-8 border-t border-white/10 mt-auto">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 md:px-10">
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-20">
          
          {/* Left side: Branding & Description */}
          <div className="max-w-md">
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={img.logo}
                  alt="Logo"
                  className="w-16 h-16 rounded-full border border-white/10 shadow-xl"
                />
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase tracking-widest text-white">
                    Malabar Challengers
                  </h2>
                  <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mt-1">
                    {club.malayalam}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm font-medium text-white/60">
                <div className="flex items-center gap-3 group">
                  <Phone size={14} className="text-accent shrink-0" />
                  <a href={`tel:${club.phoneHref}`} className="group-hover:text-white transition-colors">
                    {club.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <Mail size={14} className="text-accent shrink-0" />
                  <a href={`mailto:${club.email}`} className="group-hover:text-white transition-colors">
                    {club.email}
                  </a>
                </div>
              </div>
              {socialLinks.length > 0 ? (
                <div className="flex gap-4 mt-8">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-white/40 hover:text-accent transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              ) : null}
            </Reveal>
          </div>

          {/* Right side: Links */}
          <div className="flex flex-wrap gap-16 sm:gap-24">
            {columns.map((column, i) => (
              <Reveal delay={i * 100} key={column.title}>
                <div className="flex flex-col gap-6">
                  <h3 className="font-[family-name:var(--font-display)] text-white text-sm font-bold uppercase tracking-[0.2em]">
                    {column.title}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {column.links.map(link => (
                      <li key={link.to}>
                        <Link href={link.to} className="text-white/50 hover:text-accent transition-colors text-sm font-medium">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Massive Typography */}
        <Reveal delay={200}>
          <div className="w-full border-t border-white/10 pt-16 pb-8 flex flex-col items-center overflow-hidden">
            <p aria-hidden className="font-[family-name:var(--font-display)] text-[11vw] sm:text-[12vw] leading-[0.8] font-black text-white/5 uppercase tracking-tighter w-full text-center select-none hover:text-white/10 transition-colors duration-700">
              CHALLENGERS
            </p>
          </div>
        </Reveal>

        {/* Bottom Bar */}
        <Reveal delay={300}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] sm:text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mt-4">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {club.foundation}
            </p>
            <div className="flex items-center gap-3">
              <BallIcon className="w-4 h-4 text-accent animate-[roll_6s_linear_infinite]" />
              <span className="text-white/30">Crafted by Zuarak</span>
            </div>
            <a href="#top" className="hover:text-accent transition-colors text-center md:text-right">
              Back to top ↑
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
