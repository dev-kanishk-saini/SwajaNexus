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
    desc: "Attach and view floor-plan PDFs per area for quick spatial reference.",
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero */}
      <section
        style={{
          padding: "100px 60px 80px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent-dim)",
            border: "1px solid rgba(79,142,255,0.25)",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 32,
            fontSize: 13,
            color: "var(--accent)",
            fontWeight: 500,
          }}
        >
          <Zap size={13} />
          Home Automation Management Platform
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            maxWidth: 700,
          }}
        >
          Every device.
          <br />
          Every room.
          <span style={{ color: "var(--accent)" }}> Under control.</span>
        </h1>

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 18,
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: 40,
          }}
        >
          NexaHome gives your team a single place to register, monitor, and manage
          smart home devices across all client sites — organised by location, area,
          and device type.
        </p>

        <Link
          href="/sites"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "var(--radius-sm)",
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: 15,
            transition: "background 0.15s",
          }}
        >
          View Sites <ArrowRight size={16} />
        </Link>
      </section>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
          margin: "0 60px",
        }}
      />

      {/* Features */}
      <section style={{ padding: "80px 60px", maxWidth: 1000, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Platform Features
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: 24,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "var(--accent-dim)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon size={17} color="var(--accent)" />
              </div>
              <h3
                style={{
                  fontSize: 15,
                  marginBottom: 8,
                  fontFamily: "'Syne',sans-serif",
                }}
              >
                {title}
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
