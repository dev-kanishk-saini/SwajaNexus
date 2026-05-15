


"use client";

import { useState, useEffect , useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Grid, Plus, Pencil, Trash2, ChevronRight, Layers , FileJson , CheckCircle2 , AlertCircle , Upload ,X , Download } from "lucide-react";
import {
  PageHeader, Button, Modal, FormField, Input, EmptyState,
  ConfirmDialog, Spinner, Badge,
} from "@/components/ui";

function AreaFormModal({ open, onClose, initial, siteId, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    topic: "",
    controlNodemeshaddress: "",
    controlNodemacaddress: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? {
      name:                   initial.name || "",
      topic:                  initial.topic || "",
      controlNodemeshaddress: initial.controlNodemeshaddress || "",
      controlNodemacaddress:  initial.controlNodemacaddress || "",
    } : {
      name: "", topic: "", controlNodemeshaddress: "", controlNodemacaddress: "",
    });
  }, [initial, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = initial
      ? `/api/sites/${siteId}/areas/${initial._id}`
      : `/api/sites/${siteId}/areas`;
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
    <Modal open={open} onClose={onClose} title={initial ? "Edit Area" : "Add New Area"}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="Area Name *">
          <Input value={form.name} onChange={set("name")} placeholder="e.g. Master Bedroom" required />
        </FormField>
        <FormField label="Topic" hint="Used for MQTT or categorisation">
          <Input value={form.topic} onChange={set("topic")} placeholder="e.g. home/bedroom/master" />
        </FormField>
        <FormField label="Control Node Mesh Address">
          <Input value={form.controlNodemeshaddress} onChange={set("controlNodemeshaddress")} placeholder="e.g. 0x1234" />
        </FormField>
        <FormField label="Control Node MAC Address">
          <Input value={form.controlNodemacaddress} onChange={set("controlNodemacaddress")} placeholder="e.g. 00:11:22:33:44:55" />
        </FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : initial ? "Update" : "Add Area"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}




/* ══════════════════════════════════════════════
   NETWORK CONFIG SECTION
   ══════════════════════════════════════════════ */
function NetworkConfig({ site , siteId, onNetworkConfigUpdated }) {
  const [uploading, setUploading]         = useState(false);
  const [removing, setRemoving]           = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [parseError, setParseError]       = useState("");
  const [viewJson, setViewJson]           = useState(false);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setParseError("Only .json files are accepted.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setParseError("");
    setUploading(true);
    const text = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      setParseError("Invalid JSON — the file could not be parsed.");
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const res = await fetch(`/api/sites/${siteId}/network`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ networkConfig: parsed }),
    });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (res.ok) {
      const data = await res.json();
      onNetworkConfigUpdated(data.networkConfig);
    } else {
      setParseError("Failed to save network config. Please try again.");
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    await fetch(`/api/sites/${siteId}/network`, { method: "DELETE" });
    setRemoving(false);
    setConfirmRemove(false);
    onNetworkConfigUpdated(null);
  };

  const handleDownload = () => {
  const blob = new Blob(
    [JSON.stringify(site.networkConfig, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "network-config.json";
  a.click();
  URL.revokeObjectURL(url);
};





const hasConfig = site.networkConfig !== null && site.networkConfig !== undefined && site.networkConfig !== "";

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "clamp(16px, 3vw, 24px)",
      marginBottom: 24,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        marginBottom: hasConfig || parseError ? 14 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 16 }}>Network Config</h2>
          {hasConfig ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 12, fontWeight: 500, color: "var(--success)",
              background: "var(--success-dim)",
              border: "1px solid rgba(46,184,114,0.2)",
              padding: "2px 9px", borderRadius: 999,
            }}>
              <CheckCircle2 size={11} /> Saved
            </span>
          ) : (
            <span style={{
              fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              padding: "2px 9px", borderRadius: 999,
            }}>
              Not uploaded
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {hasConfig && (
            <Button variant="secondary" size="sm" onClick={() => setViewJson((v) => !v)}>
              <FileJson size={13} /> {viewJson ? "Hide JSON" : "View JSON"}
            </Button>
          )}
         
{hasConfig && (
  <Button variant="secondary" size="sm" onClick={handleDownload}>
    <Download size={13} /> Download
  </Button>
)}

          <Button variant="secondary" size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || removing}
          >
            <Upload size={13} />
            {uploading ? "Uploading…" : hasConfig ? "Replace" : "Upload JSON"}
          </Button>
          {hasConfig && (
            <Button variant="danger" size="sm"
              onClick={() => setConfirmRemove(true)}
              disabled={removing || uploading}
            >
              <X size={13} /> {removing ? "Removing…" : "Remove"}
            </Button>
          )}
        </div>

        <input ref={fileRef} type="file" accept=".json"
          style={{ display: "none" }} onChange={handleUpload} />
      </div>

      {/* Parse error */}
      {parseError && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          background: "var(--danger-dim)",
          border: "1px solid rgba(229,72,72,0.2)",
          borderRadius: 7, padding: "10px 14px", marginBottom: 12,
        }}>
          <AlertCircle size={15} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "var(--danger)" }}>{parseError}</p>
        </div>
      )}

      {/* Confirm remove */}
      {confirmRemove && (
        <div style={{
          background: "var(--danger-dim)",
          border: "1px solid rgba(229,72,72,0.2)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 12,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 13, color: "var(--danger)", fontWeight: 500 }}>
            Remove the stored network config? This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setConfirmRemove(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleRemove} disabled={removing}>
              {removing ? "Removing…" : "Yes, Remove"}
            </Button>
          </div>
        </div>
      )}

      {/* Config summary */}
      {hasConfig && (
        <div>
          <div style={{
            display: "flex", gap: 20, flexWrap: "wrap",
            padding: "11px 14px",
            background: "var(--bg-elevated)",
            borderRadius: 7, fontSize: 13, color: "var(--text-secondary)",
          }}>
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Keys: </strong>
              {Object.keys(site.networkConfig).length}
            </span>
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Size: </strong>
              {(JSON.stringify(site.networkConfig).length / 1024).toFixed(2)} KB
            </span>
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Type: </strong>
              {Array.isArray(site.networkConfig) ? "Array" : "Object"}
            </span>
          </div>
          {viewJson && (
            <pre style={{
              marginTop: 10, padding: 14,
              background: "#f8fafc",
              border: "1px solid var(--border)",
              borderRadius: 7, fontSize: 12, lineHeight: 1.6,
              overflowX: "auto", color: "#1e293b",
              maxHeight: 320, overflowY: "auto",
            }}>
              {JSON.stringify(site.networkConfig, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Empty upload zone */}
      {!hasConfig && !parseError && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            height: 90,
            border: "2px dashed var(--border)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, color: "var(--text-muted)", cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <FileJson size={20} />
          <span style={{ fontSize: 14 }}>Click to upload network config JSON</span>
        </div>
      )}
    </div>
  );
}












export default function SiteDetailPage() {
  const { siteId } = useParams();
  const [site, setSite]     = useState(null);
  const [areas, setAreas]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState({ open: false, area: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    Promise.all([
      fetch(`/api/sites/${siteId}`).then((r) => r.json()),
      fetch(`/api/sites/${siteId}/areas`).then((r) => r.json()),
    ]).then(([s, a]) => {
      setSite(s);
      setAreas(Array.isArray(a) ? a : []);
      setLoading(false);
    }).catch(() => setLoading(false));
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

  const handleNetworkConfigUpdated = (config) => {
  setSite((prev) => ({ ...prev, networkConfig: config }));
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
      
       

      <div className="page-content">
         {/* Network config section */}
        <NetworkConfig
          site={site}
          siteId={siteId}
          onNetworkConfigUpdated={handleNetworkConfigUpdated}
        />
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
          <div className="card-grid">
            {areas.map((area) => (
              <div
                key={area._id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: 22,
                  display: "flex", flexDirection: "column", gap: 12,
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
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 38, height: 38,
                    background: "rgba(46,184,114,0.1)",
                    borderRadius: 9,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Grid size={16} color="var(--success)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="truncate" style={{ fontSize: 15, marginBottom: 4 }}>
                      {area.name}
                    </h3>
                    {area.topic && (
                      <code style={{
                        fontSize: 11, color: "var(--text-muted)",
                        background: "var(--bg-elevated)",
                        padding: "2px 6px", borderRadius: 4,
                      }}>
                        {area.topic}
                      </code>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {area.mapUrl && <Badge label="Map attached" color="green" />}
                  {/* {area.networkConfig && <Badge label="Network config" color="blue" />} */}
                </div>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  paddingTop: 10, borderTop: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, area })}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirm({ open: true, id: area._id })}>
                      <Trash2 size={13} color="var(--danger)" />
                    </Button>
                  </div>
                  <Link href={`/sites/${siteId}/areas/${area._id}`} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: "var(--accent)", fontSize: 13, fontWeight: 500,
                  }}>
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



