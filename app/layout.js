import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "NexaHome — Device Management",
  description: "Smart home device management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              marginLeft: "var(--sidebar-width)",
              minHeight: "100vh",
              overflow: "auto",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
