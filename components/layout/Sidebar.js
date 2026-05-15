

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Zap,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/sites", label: "Sites", icon: MapPin },
  // Future items — add below as you build them
  // { href: "/devices", label: "All Devices", icon: Cpu },
  // { href: "/settings", label: "Settings", icon: Settings },
  // { href: "/help", label: "Help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sidebar whenever the route changes (user tapped a nav link on mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll while mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── MOBILE TOPBAR ─────────────────────────────────────────
          Visible only on screens <= 768px via .topbar CSS class    */}
      <header className="topbar">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: "var(--accent)",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={14} color="#fff" />
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 17,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}>
            SwajaNexus.
          </span>
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "var(--text-secondary)",
          }}
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ── OVERLAY (mobile only) ──────────────────────────────────
          Dark backdrop behind the sidebar — tap to close           */}
      <div
        className={`sidebar-overlay${open ? " visible" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── SIDEBAR ───────────────────────────────────────────────
          On desktop: always visible (CSS keeps it on screen)
          On mobile:  slides in from left when open=true            */}
      <aside className={`sidebar${open ? " open" : ""}`}>

        {/* Logo row */}
        <div style={{
          padding: "20px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "var(--accent)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={16} color="#fff" />
            </div>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: 18,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}>
              SwajaNexus.
            </span>
          </div>

          {/* Close button — only visible on mobile */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="sidebar-close-btn"
            style={{
              background: "none", border: "none",
              cursor: "pointer", padding: 4,
              display: "flex", alignItems: "center",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav style={{
          flex: 1, padding: "16px 12px",
          display: "flex", flexDirection: "column", gap: 2,
          overflowY: "auto",
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600,
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            padding: "4px 8px 8px",
          }}>
            Navigation
          </p>

          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px",
                  borderRadius: "var(--radius-sm)",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  background: active ? "var(--accent-dim)" : "transparent",
                  fontWeight: active ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.15s",
                  border: active
                    ? "1px solid rgba(79,142,255,0.2)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: 12,
        }}>
          v0.1.0 — SwajaNexus 
        </div>
      </aside>

      {/* Hide close button on desktop */}
      <style>{`
        @media (min-width: 769px) {
          .sidebar-close-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}