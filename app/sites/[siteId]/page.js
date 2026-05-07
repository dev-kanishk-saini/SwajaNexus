"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Grid, Plus, Pencil, Trash2, ChevronRight, MapPin, Layers } from "lucide-react";
import {
  PageHeader, Button, Modal, FormField, Input, EmptyState,
  ConfirmDialog, Spinner, Badge,
} from "@/components/ui";

function AreaFormModal({ open, onClose, initial, siteId, onSaved }) {
  const [form, setForm] = useState({ name: "", topic: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? { name: initial.name || "", topic: initial.topic || "" } : { name: "", topic: "" });
  }, [initial, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = initial
      ? `/api/sites/${siteId}/areas/${initial._id}`
      : `/api/sites/${siteId}/areas`;
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { onSaved(data); onClose(); }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Area" : "Add New Area"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <FormField label="Area Name *">
          <Input value={form.name} onChange={set("name")} placeholder="e.g. Master Bedroom" required />
        </FormField>
        <FormField label="Topic" hint="Used for MQTT or categorisation">
          <Input value={form.topic} onChange={set("topic")} placeholder="e.g. home/bedroom/master" />
        </FormField>
        <FormField label="Control Node Mesh Address" hint="Mesh address of the control node">
          <Input value={form.controlNodemeshaddress} onChange={set("controlNodemeshaddress")} placeholder="e.g. 0x1234" />
        </FormField>
        <FormField label="Control Node MAC Address" hint="MAC address of the control node">
          <Input value={form.controlNodemacaddress} onChange={set("controlNodemacaddress")} placeholder="e.g. 00:11:22:33:44:55" />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving…" : initial ? "Update" : "Add Area"}</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function SiteDetailPage() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, area: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    Promise.all([
      fetch(`/api/sites/${siteId}`).then((r) => r.json()),
      fetch(`/api/sites/${siteId}/areas`).then((r) => r.json()),
    ]).then(([s, a]) => {
      setSite(s);
      setAreas(a);
      setLoading(false);
    });
  }, [siteId]);

  const handleSaved = (area) => {
    setAreas((prev) => {
      const idx = prev.findIndex((a) => a._id === area._id);
      if (idx > -1) { const next = [...prev]; next[idx] = area; return next; }
      return [area, ...prev];
    });
  };

  const handleDelete = async () => {
    await fetch(`/api/sites/${siteId}/areas/${confirm.id}`, { method: "DELETE" });
    setAreas((prev) => prev.filter((a) => a._id !== confirm.id));
    setConfirm({ open: false, id: null });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={site?.name || "Site"}
        subtitle={`${areas.length} area${areas.length !== 1 ? "s" : ""}`}
        breadcrumb={
          <>
            <Link href="/sites" style={{ color: "var(--text-muted)" }}>Sites</Link>
            <ChevronRight size={13} />
            <span style={{ color: "var(--text-secondary)" }}>{site?.name}</span>
          </>
        }
        actions={
          <Button onClick={() => setModal({ open: true, area: null })}>
            <Plus size={15} /> Add Area
          </Button>
        }
      />

      <div style={{ padding: "32px 40px" }}>
        {areas.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No areas yet"
            description="Add areas like rooms, floors, or zones to this site."
            action={
              <Button onClick={() => setModal({ open: true, area: null })}>
                <Plus size={15} /> Add Area
              </Button>
            }
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {areas.map((area) => (
              <div
                key={area._id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      background: "rgba(52,201,126,0.1)",
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Grid size={16} color="var(--success)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="truncate" style={{ fontSize: 15, fontFamily: "'Syne',sans-serif", marginBottom: 4 }}>
                      {area.name}
                    </h3>
                    {area.topic && (
                      <code
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          background: "var(--bg-elevated)",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {area.topic}
                      </code>
                    )}
                  </div>
                </div>

                {area.mapUrl && (
                  <Badge label="Map attached" color="green" />
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, area })}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirm({ open: true, id: area._id })}>
                      <Trash2 size={13} color="var(--danger)" />
                    </Button>
                  </div>
                  <Link
                    href={`/sites/${siteId}/areas/${area._id}`}
                    style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--accent)", fontSize: 13, fontWeight: 500 }}
                  >
                    View Devices <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AreaFormModal
        open={modal.open}
        onClose={() => setModal({ open: false, area: null })}
        initial={modal.area}
        siteId={siteId}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Area"
        message="This will permanently delete this area and all its devices."
      />
    </div>
  );
}
