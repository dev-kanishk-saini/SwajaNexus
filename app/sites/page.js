

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, ChevronRight, Building2 } from "lucide-react";
import {
  PageHeader, Button, Modal, FormField, Input, EmptyState,
  ConfirmDialog, Spinner, Badge,
} from "@/components/ui";

 function SiteFormModal({ open, onClose, initial, onSaved }) {
  const [form, setForm] = useState({ name: "", description: "", location: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial
      ? { name: initial.name || "", description: initial.description || "", location: initial.location || "" }
      : { name: "", description: "", location: "" }
    );
  }, [initial, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = initial ? `/api/sites/${initial._id}` : "/api/sites";
    const res = await fetch(url, {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { onSaved(data); onClose(); }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Site" : "Add New Site"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Site Name *">
          <Input value={form.name} onChange={set("name")} placeholder="e.g. Sharma Residence" required />
        </FormField>
        <FormField label="Location">
          <Input value={form.location} onChange={set("location")} placeholder="e.g. New Delhi, India" />
        </FormField>
        <FormField label="Description">
          <Input value={form.description} onChange={set("description")} placeholder="Short description" />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : initial ? "Update Site" : "Add Site"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function SitesPage() {
  const [sites, setSites]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [modal, setModal]     = useState({ open: false, site: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setSites(d);
        } else {
          setFetchError(d?.error || "Failed to load sites. Check your MongoDB connection.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setFetchError("Network error: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleSaved = (site) => {
    setSites((prev) => {
      const idx = prev.findIndex((s) => s._id === site._id);
      if (idx > -1) { const next = [...prev]; next[idx] = site; return next; }
      return [site, ...prev];
    });
  };

  const handleDelete = async () => {
    await fetch(`/api/sites/${confirm.id}`, { method: "DELETE" });
    setSites((prev) => prev.filter((s) => s._id !== confirm.id));
    setConfirm({ open: false, id: null });
  };

  return (
    <div>
      <PageHeader
        title="Sites"
        subtitle={`${sites.length} site${sites.length !== 1 ? "s" : ""} registered`}
        actions={
          <Button onClick={() => setModal({ open: true, site: null })}>
            <Plus size={15} /> Add Site
          </Button>
        }
      />

      <div className="page-content">
        {/* Connection error banner */}
        {fetchError && (
          <div style={{
            background: "var(--danger-dim)",
            border: "1px solid rgba(229,72,72,0.25)",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
            marginBottom: 24,
            color: "var(--danger)",
          }}>
            <strong>Connection Error</strong>
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>{fetchError}</p>
            <p style={{ marginTop: 4, fontSize: 12, color: "var(--text-muted)" }}>
              Check your MONGODB_URI in .env.local and your Atlas IP whitelist.
            </p>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : sites.length === 0 && !fetchError ? (
          <EmptyState
            icon={Building2}
            title="No sites yet"
            description="Add your first site to start managing areas and devices."
            action={
              <Button onClick={() => setModal({ open: true, site: null })}>
                <Plus size={15} /> Add Site
              </Button>
            }
          />
        ) : (
          <div className="card-grid">
            {sites.map((site) => (
              <div
                key={site._id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "var(--shadow-sm)",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.borderColor = "var(--border-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                {/* Icon + name */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40,
                    background: "var(--accent-dim)",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Building2 size={18} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="truncate" style={{ fontSize: 15, marginBottom: 3 }}>
                      {site.name}
                    </h3>
                    {site.location && (
                      <p style={{
                        color: "var(--text-muted)", fontSize: 12,
                        display: "flex", alignItems: "center", gap: 3,
                      }}>
                        <MapPin size={11} /> {site.location}
                      </p>
                    )}
                  </div>
                </div>

                {site.description && (
                  <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>
                    {site.description}
                  </p>
                )}
                {/* Badges */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  
                  {site.networkConfig && <Badge label="Network config" color="blue" />}
                  </div>              

                {/* Actions */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, site })}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirm({ open: true, id: site._id })}>
                      <Trash2 size={13} color="var(--danger)" />
                    </Button>
                  </div>
                  <Link href={`/sites/${site._id}`} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: "var(--accent)", fontSize: 13, fontWeight: 500,
                  }}>
                    View Areas <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SiteFormModal
        open={modal.open}
        onClose={() => setModal({ open: false, site: null })}
        initial={modal.site}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Site"
        message="This will permanently delete the site and all its areas and devices. This cannot be undone."
      />
    </div>
  );
}