import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "NexaHome — Device Management",
  description: "Smart home device management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <div style={{ display: "flex", minHeight: "100vh" }}> */}
        <div className="app-layout">
          <Sidebar />
          {/* <main
            style={{
              flex: 1,
              marginLeft: "var(--sidebar-width)",
              minHeight: "100vh",
              overflow: "auto",
            }}
          > */}
          <main className="app-main">
            {children}
          </main>
          <SpeedInsights/>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
