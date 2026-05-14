


"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Cpu, Plus, Pencil, Trash2, ChevronRight, Upload,
  X, FileJson, CheckCircle2, AlertCircle,
} from "lucide-react";
import {
  PageHeader, Button, Modal, FormField, Input, Select, EmptyState,
  ConfirmDialog, Spinner, Badge,
} from "@/components/ui";
import { DEVICE_TYPES } from "@/lib/constants";
import MapEditor from "@/components/MapEditor";

/* ── Device badge colours ── */
const typeColor = {
  "Smart Light":     "blue",
  "Smart Switch":    "orange",
  "Thermostat":      "green",
  "Security Camera": "red",
  "Door Sensor":     "default",
};

/* ══════════════════════════════════════════════
   DEVICE FORM MODAL
   ══════════════════════════════════════════════ */
const EMPTY_DEVICE = {
  name: "", type: "", elementId: "",
  installationLocation: "", meshAddress: "",
  macAddress: "", firstInstalledAt: "",
};

function DeviceFormModal({ open, onClose, initial, siteId, areaId, onSaved }) {
  const [form, setForm]       = useState(EMPTY_DEVICE);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(initial ? {
      name:                 initial.name || "",
      type:                 initial.type || "",
      elementId:            initial.elementId || "",
      installationLocation: initial.installationLocation || "",
      meshAddress:          initial.meshAddress || "",
      macAddress:           initial.macAddress || "",
      firstInstalledAt:     initial.firstInstalledAt
                              ? initial.firstInstalledAt.slice(0, 10) : "",
    } : EMPTY_DEVICE);
    setError("");
  }, [initial, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const url = initial
      ? `/api/sites/${siteId}/areas/${areaId}/devices/${initial._id}`
      : `/api/sites/${siteId}/areas/${areaId}/devices`;
    const res = await fetch(url, {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Something went wrong"); return; }
    onSaved(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Device" : "Add Device"} width={560}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{
            background: "var(--danger-dim)",
            border: "1px solid rgba(229,72,72,0.25)",
            borderRadius: 6, padding: "10px 14px",
            color: "var(--danger)", fontSize: 13,
          }}>
            {error}
          </div>
        )}
        {/* 2-col grid collapses to 1-col on small screens via .modal-grid-2 */}
        <div className="modal-grid-2">
          <FormField label="Device Name *">
            <Input value={form.name} onChange={set("name")} placeholder="e.g. Ceiling Light 1" required />
          </FormField>
          <FormField label="Device Type *">
            <Select value={form.type} onChange={set("type")} options={DEVICE_TYPES} placeholder="Select type…" />
          </FormField>
          <FormField label="Element ID">
            <Input value={form.elementId} onChange={set("elementId")} placeholder="e.g. 1" />
          </FormField>
          <FormField label="Installation Location">
            <Input value={form.installationLocation} onChange={set("installationLocation")} placeholder="e.g. Ceiling, North Wall" />
          </FormField>
          <FormField label="First Installed At">
            <Input type="date" value={form.firstInstalledAt} onChange={set("firstInstalledAt")} />
          </FormField>
          <FormField label="Mesh Address">
            <Input value={form.meshAddress} onChange={set("meshAddress")} placeholder="e.g. 0x1A2B" />
          </FormField>
          <FormField label="MAC Address">
            <Input value={form.macAddress} onChange={set("macAddress")} placeholder="e.g. AA:BB:CC:DD:EE:FF" />
          </FormField>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={loading || !form.type}>
            {loading ? "Saving…" : initial ? "Update" : "Add Device"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ══════════════════════════════════════════════
   MAP UPLOAD SECTION
   ══════════════════════════════════════════════ */
function MapUpload({ area, siteId, devices, setDevices, onMapUpdated, onMapRemoved }) {
  const [uploading, setUploading]         = useState(false);
  const [removing, setRemoving]           = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("areaId", area._id);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
    const { mapUrl } = await uploadRes.json();
    await fetch(`/api/sites/${siteId}/areas/${area._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapUrl }),
    });
    setUploading(false);
    onMapUpdated(mapUrl);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = async () => {
    setRemoving(true);
    await fetch(`/api/sites/${siteId}/areas/${area._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapUrl: null }),
    });
    setRemoving(false);
    setConfirmRemove(false);
    onMapRemoved();
  };

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "clamp(16px, 3vw, 24px)",
      marginBottom: 24,
    }}>
      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16, flexWrap: "wrap", gap: 8,
      }}>
        <h2 style={{ fontSize: 16 }}>Area Map</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || removing}
          >
            <Upload size={13} />
            {uploading ? "Uploading…" : area.mapUrl ? "Replace Map" : "Upload Map"}
          </Button>
          {area.mapUrl && (
            <Button variant="danger" size="sm"
              onClick={() => setConfirmRemove(true)}
              disabled={removing || uploading}
            >
              <X size={13} />
              {removing ? "Removing…" : "Remove Map"}
            </Button>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg"
          style={{ display: "none" }} onChange={handleUpload} />
      </div>

      {/* Confirm remove */}
      {confirmRemove && (
        <div style={{
          background: "var(--danger-dim)",
          border: "1px solid rgba(229,72,72,0.2)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 14,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 13, color: "var(--danger)", fontWeight: 500 }}>
            Remove this map? Device positions will be kept.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setConfirmRemove(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleRemove} disabled={removing}>
              {removing ? "Removing…" : "Yes, Remove"}
            </Button>
          </div>
        </div>
      )}

      {/* Map editor or upload zone */}
      {area.mapUrl ? (
        <MapEditor
          mapUrl={area.mapUrl}
          devices={devices}
          siteId={siteId}
          areaId={area._id}
          onDevicesChange={(updated) => setDevices(updated)}
        />
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            height: 160,
            border: "2px dashed var(--border)",
            borderRadius: 8,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 10, color: "var(--text-muted)",
            cursor: "pointer", transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <Upload size={26} />
          <p style={{ fontSize: 14, fontWeight: 500 }}>Click to upload floor plan</p>
          <p style={{ fontSize: 12 }}>PNG, JPG, JPEG supported</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   NETWORK CONFIG SECTION
   ══════════════════════════════════════════════ */
function NetworkConfig({ area, siteId, onNetworkConfigUpdated }) {
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
    const res = await fetch(`/api/sites/${siteId}/areas/${area._id}/network`, {
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
    await fetch(`/api/sites/${siteId}/areas/${area._id}/network`, { method: "DELETE" });
    setRemoving(false);
    setConfirmRemove(false);
    onNetworkConfigUpdated(null);
  };

  const hasConfig = area.networkConfig !== null && area.networkConfig !== undefined;

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
              {Object.keys(area.networkConfig).length}
            </span>
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Size: </strong>
              {(JSON.stringify(area.networkConfig).length / 1024).toFixed(2)} KB
            </span>
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Type: </strong>
              {Array.isArray(area.networkConfig) ? "Array" : "Object"}
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
              {JSON.stringify(area.networkConfig, null, 2)}
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

/* ══════════════════════════════════════════════
   DEVICE TABLE ROW
   Desktop: full 8-col table
   Mobile:  scrollable, less-important cols hidden
   ══════════════════════════════════════════════ */
function DeviceRow({ device, onEdit, onDelete }) {
  return (
    <tr
      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Device name + location — always visible */}
      <td style={{ padding: "12px 16px", minWidth: 140 }}>
        <p style={{ fontWeight: 500, marginBottom: 2 }}>{device.name}</p>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
          {device.installationLocation || "—"}
        </p>
      </td>

      {/* Type — always visible */}
      <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
        <Badge label={device.type} color={typeColor[device.type] || "default"} />
      </td>

      {/* Element ID — hidden on small mobile */}
      <td className="col-hide-mobile" style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
        {device.elementId || "—"}
      </td>

      {/* Mesh address — hidden on small mobile */}
      <td className="col-hide-mobile" style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
        <code style={{ fontSize: 12 }}>{device.meshAddress || "—"}</code>
      </td>

      {/* MAC address — hidden on small mobile */}
      <td className="col-hide-mobile" style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
        <code style={{ fontSize: 12 }}>{device.macAddress || "—"}</code>
      </td>

      {/* First installed — hidden on small mobile */}
      <td className="col-hide-mobile" style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
        {device.firstInstalledAt ? new Date(device.firstInstalledAt).toLocaleDateString() : "—"}
      </td>

      {/* Last updated — hidden on small mobile */}
      <td className="col-hide-mobile" style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
        {device.updatedAt ? new Date(device.updatedAt).toLocaleDateString() : "—"}
      </td>

      {/* Actions — always visible */}
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <Button variant="ghost" size="sm" onClick={() => onEdit(device)}>
            <Pencil size={13} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(device._id)}>
            <Trash2 size={13} color="var(--danger)" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function AreaDetailPage() {
  const { siteId, areaId } = useParams();

  const [site, setSite]       = useState(null);
  const [area, setArea]       = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, device: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    Promise.all([
      fetch(`/api/sites/${siteId}`).then((r) => r.json()),
      fetch(`/api/sites/${siteId}/areas/${areaId}`).then((r) => r.json()),
      fetch(`/api/sites/${siteId}/areas/${areaId}/devices`).then((r) => r.json()),
    ]).then(([s, a, d]) => {
      setSite(s);
      setArea(a);
      setDevices(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [siteId, areaId]);

  const handleDeviceSaved = (device) => {
    setDevices((prev) => {
      const idx = prev.findIndex((d) => d._id === device._id);
      if (idx > -1) { const next = [...prev]; next[idx] = device; return next; }
      return [...prev, device];
    });
  };

  const handleDeleteDevice = async () => {
    await fetch(`/api/sites/${siteId}/areas/${areaId}/devices/${confirm.id}`, { method: "DELETE" });
    setDevices((prev) => prev.filter((d) => d._id !== confirm.id));
    setConfirm({ open: false, id: null });
  };

  if (loading) return <Spinner />;

  const atLimit = devices.length >= 40;

  return (
    <div>
      <PageHeader
        title={area?.name || "Area"}
        subtitle={`${devices.length} device${devices.length !== 1 ? "s" : ""}`}
        breadcrumb={
          <>
            <Link href="/sites" style={{ color: "var(--text-muted)" }}>Sites</Link>
            <ChevronRight size={13} />
            <Link href={`/sites/${siteId}`} style={{ color: "var(--text-muted)" }}>{site?.name}</Link>
            <ChevronRight size={13} />
            <span style={{ color: "var(--text-secondary)" }}>{area?.name}</span>
          </>
        }
        actions={
          <Button
            onClick={() => setModal({ open: true, device: null })}
            disabled={atLimit}
            title={atLimit ? "Maximum 40 devices reached" : ""}
          >
            <Plus size={15} /> Add Device
          </Button>
        }
      />

      <div className="page-content">

        {/* Map section */}
        <MapUpload
          area={area}
          siteId={siteId}
          devices={devices}
          setDevices={setDevices}
          onMapUpdated={(url) => setArea((a) => ({ ...a, mapUrl: url }))}
          onMapRemoved={() => setArea((a) => ({ ...a, mapUrl: null }))}
        />

        {/* Network config section */}
        <NetworkConfig
          area={area}
          siteId={siteId}
          onNetworkConfigUpdated={(config) => setArea((a) => ({ ...a, networkConfig: config }))}
        />

        {/* Devices table heading */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 14,
          flexWrap: "wrap", gap: 8,
        }}>
          <h2 style={{ fontSize: "clamp(16px, 2.5vw, 18px)" }}>
            Devices
            <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)", marginLeft: 10 }}>
              {devices.length}/40
            </span>
          </h2>
        </div>

        {/* Devices — empty state or table */}
        {devices.length === 0 ? (
          <EmptyState
            icon={Cpu}
            title="No devices yet"
            description="Add up to 40 devices to this area."
            action={
              <Button onClick={() => setModal({ open: true, device: null })}>
                <Plus size={15} /> Add Device
              </Button>
            }
          />
        ) : (
          /*
            .table-scroll  — enables horizontal scroll on mobile
            table minWidth — forces scroll before columns get too squished
            .col-hide-mobile — hides non-critical columns on ≤480px screens
          */
          <div className="table-scroll" style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                  <th style={thStyle}>Device</th>
                  <th style={thStyle}>Type</th>
                  <th style={{ ...thStyle }} className="col-hide-mobile">Element ID</th>
                  <th style={{ ...thStyle }} className="col-hide-mobile">Mesh Addr.</th>
                  <th style={{ ...thStyle }} className="col-hide-mobile">MAC Addr.</th>
                  <th style={{ ...thStyle }} className="col-hide-mobile">First Installed</th>
                  <th style={{ ...thStyle }} className="col-hide-mobile">Last Updated</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <DeviceRow
                    key={d._id}
                    device={d}
                    onEdit={(dev) => setModal({ open: true, device: dev })}
                    onDelete={(id) => setConfirm({ open: true, id })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeviceFormModal
        open={modal.open}
        onClose={() => setModal({ open: false, device: null })}
        initial={modal.device}
        siteId={siteId}
        areaId={areaId}
        onSaved={handleDeviceSaved}
      />

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDeleteDevice}
        title="Delete Device"
        message="Are you sure you want to remove this device? This cannot be undone."
      />
    </div>
  );
}

/* Shared table header cell style */
const thStyle = {
  padding: "11px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  whiteSpace: "nowrap",
};