


import Link from "next/link";
import { Zap, MapPin, Grid, Cpu, ArrowRight, Shield, Activity, Settings2 } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Multi-Site Management",
    desc: "Manage multiple properties and locations from a single unified dashboard.",
  },
  {
    icon: Grid,
    title: "Area Organisation",
    desc: "Organise devices by area within each site — rooms, floors, zones.",
  },
  {
    icon: Cpu,
    title: "Device Tracking",
    desc: "Track up to 40 devices per area with full mesh and MAC address visibility.",
  },
  {
    icon: Shield,
    title: "5 Device Types",
    desc: "Smart lights, switches, thermostats, cameras and door sensors supported.",
  },
  {
    icon: Activity,
    title: "Install History",
    desc: "First-install and last-updated timestamps for every single device.",
  },
  {
    icon: Settings2,
    title: "Map Previews",
    desc: "Attach and view floor-plan images per area for quick spatial reference.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Hero ── */}
      <section style={{
        padding: "clamp(48px, 8vw, 100px) clamp(16px, 5vw, 60px) clamp(40px, 6vw, 80px)",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        {/* Tag */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--accent-dim)",
          border: "1px solid rgba(79,142,255,0.25)",
          borderRadius: 999,
          padding: "6px 14px",
          marginBottom: 28,
          fontSize: 13,
          color: "var(--accent)",
          fontWeight: 500,
        }}>
          <Zap size={13} />
          Home Automation Management Platform
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 58px)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: 22,
          maxWidth: 680,
          color: "var(--text-primary)",
        }}>
          Every device.
          <br />
          Every room.{" "}
          <span style={{ color: "var(--accent)" }}>Under control.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "clamp(14px, 2vw, 18px)",
          lineHeight: 1.7,
          maxWidth: 540,
          marginBottom: 36,
        }}>
          NexaHome gives your team a single place to register, monitor, and manage
          smart home devices across all client sites — organised by location, area,
          and device type.
        </p>

        {/* CTA */}
        <Link href="/sites" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--accent)",
          color: "#fff",
          borderRadius: "var(--radius-sm)",
          padding: "12px 24px",
          fontWeight: 600,
          fontSize: 15,
          boxShadow: "0 2px 8px rgba(79,142,255,0.35)",
        }}>
          View Sites <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── Divider ── */}
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        margin: "0 clamp(16px, 5vw, 60px)",
      }} />

      {/* ── Features grid ── */}
      <section style={{
        padding: "clamp(40px, 6vw, 80px) clamp(16px, 5vw, 60px)",
        maxWidth: 1000,
        margin: "0 auto",
      }}>
        <p style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginBottom: 32,
        }}>
          Platform Features
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
          gap: 16,
        }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "clamp(16px, 3vw, 24px)",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{
                width: 36,
                height: 36,
                background: "var(--accent-dim)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}>
                <Icon size={17} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}