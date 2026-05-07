// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import { Document } from "react-pdf";
// import Link from "next/link";
// import {
//   Cpu, Plus, Pencil, Trash2, ChevronRight, Upload, FileText, X,
//   Delete,
// } from "lucide-react";
// import {
//   PageHeader, Button, Modal, FormField, Input, Select, EmptyState,
//   ConfirmDialog, Spinner, Badge,
// } from "@/components/ui";
// import { DEVICE_TYPES } from "@/lib/constants";
// import MapEditor from "@/components/MapEditor";

// // ── Device badge colour by type
// const typeColor = {
//   "Smart Light": "blue",
//   "Smart Switch": "orange",
//   "Thermostat": "green",
//   "Security Camera": "red",
//   "Door Sensor": "default",
// };

// // ── Device form modal ─────────────────────────────────────
// const EMPTY_DEVICE = {
//   name: "",
//   type: "",
//   elementId: "",
//   installationLocation: "",
//   meshAddress: "",
//   macAddress: "",
//   firstInstalledAt: "",
// };

// function DeviceFormModal({ open, onClose, initial, siteId, areaId, onSaved }) {
//   const [form, setForm] = useState(EMPTY_DEVICE);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!open) return;
//     if (initial) {
//       setForm({
//         name: initial.name || "",
//         type: initial.type || "",
//         elementId: initial.elementId || "",
//         installationLocation: initial.installationLocation || "",
//         meshAddress: initial.meshAddress || "",
//         macAddress: initial.macAddress || "",
//         firstInstalledAt: initial.firstInstalledAt ? initial.firstInstalledAt.slice(0, 10) : "",
//       });
//     } else {
//       setForm(EMPTY_DEVICE);
//     }
//     setError("");
//   }, [initial, open]);

//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     const url = initial
//       ? `/api/sites/${siteId}/areas/${areaId}/devices/${initial._id}`
//       : `/api/sites/${siteId}/areas/${areaId}/devices`;
//     const res = await fetch(url, {
//       method: initial ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();
//     setLoading(false);
//     if (!res.ok) { setError(data.error || "Something went wrong"); return; }
//     onSaved(data);
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose} title={initial ? "Edit Device" : "Add Device"} width={560}>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//         {error && (
//           <div style={{ background: "rgba(255,92,92,0.1)", border: "1px solid rgba(255,92,92,0.3)", borderRadius: 6, padding: "10px 14px", color: "var(--danger)", fontSize: 13 }}>
//             {error}
//           </div>
//         )}

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//           <FormField label="Device Name *">
//             <Input value={form.name} onChange={set("name")} placeholder="e.g. Ceiling Light 1" required />
//           </FormField>
//           <FormField label="Device Type *">
//             <Select
//               value={form.type}
//               onChange={set("type")}
//               options={DEVICE_TYPES}
//               placeholder="Select type…"
//             />
//           </FormField>
//           <FormField label="Element Id">
//             <Input value={form.elementId} onChange={set("elementId")} placeholder="e.g. 1" />
//           </FormField>
//           <FormField label="Installation Location">
//             <Input value={form.installationLocation} onChange={set("installationLocation")} placeholder="e.g. Ceiling, North Wall" />
//           </FormField>
//           <FormField label="First Installed At">
//             <Input type="date" value={form.firstInstalledAt} onChange={set("firstInstalledAt")} />
//           </FormField>
//           <FormField label="Mesh Address">
//             <Input value={form.meshAddress} onChange={set("meshAddress")} placeholder="e.g. 0x1A2B" />
//           </FormField>
//           <FormField label="MAC Address">
//             <Input value={form.macAddress} onChange={set("macAddress")} placeholder="e.g. AA:BB:CC:DD:EE:FF" />
//           </FormField>
//         </div>

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
//           <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
//           <Button type="submit" disabled={loading || !form.type}>
//             {loading ? "Saving…" : initial ? "Update" : "Add Device"}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// }

// // ── Map upload section ────────────────────────────────────
// function MapUpload({ area, siteId, onMapUpdated , devices}) {
//   const [uploading, setUploading] = useState(false);
//   const fileRef = useRef();

//   console.log("Devices in MapUpload:", devices);

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("areaId", area._id);
//     const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
//     const { mapUrl } = await uploadRes.json();
//     // Save mapUrl to area
//     await fetch(`/api/sites/${siteId}/areas/${area._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mapUrl }),
//     });
//     setUploading(false);
//     onMapUpdated(mapUrl);
//   };

//   return (
//     <div
//       style={{
//         background: "var(--bg-surface)",
//         border: "1px solid var(--border)",
//         borderRadius: "var(--radius)",
//         padding: 24,
//         marginBottom: 32,
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//         <h2 style={{ fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Area Map</h2>
//         <div style={{ display: "flex", gap: 8 }}>
//           {area.mapUrl && (
//             <Button variant="secondary" size="sm" onClick={() => window.open(area.mapUrl, "_blank")}>
//               <FileText size={13} /> View PDF
//             </Button>
//           )}
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => fileRef.current?.click()}
//             disabled={uploading}
//           >
//             <Upload size={13} /> {uploading ? "Uploading…" : area.mapUrl ? "Replace Map" : "Upload Map"}
//           </Button>
//           <Button
//             variant="secondary"
//             size="sm"
//             onClick={() => fileRef.current?.click()}
//             disabled={uploading}
//           >
//             <Delete size={13} /> {uploading ? "Deleting…" : area.mapUrl ? "Delete Map" : "Upload Map"}
//           </Button>
//           <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: "none" }} onChange={handleUpload} />
//         </div>
//       </div>

//       {area.mapUrl ? (
//         // <iframe
//         //   src={area.mapUrl}
//         //   title="Area Map"
//         //   style={{
//         //     width: "100%",
//         //     height: 620,
//         //     border: "1px solid var(--border)",
//         //     borderRadius: 8,
//         //     background: "var(--bg-elevated)",
//         //   }}
//         // />

//       //  <MapEditor
//       //  mapUrl={area.mapUrl}
//       //  devices={devices}
//       //  />

//       <MapEditor
//   mapUrl={area.mapUrl}
//   devices={devices}
//   siteId={siteId}
//   areaId={area}
//   onDevicesChange={(updated) => setDevices(updated)}
// />

//       ) : (
//         <div
//           onClick={() => fileRef.current?.click()}
//           style={{
//             height: 160,
//             border: "2px dashed var(--border)",
//             borderRadius: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 10,
//             color: "var(--text-muted)",
//             cursor: "pointer",
//             transition: "border-color 0.15s",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
//           onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
//         >
//           <Upload size={24} />
//           <p style={{ fontSize: 14 }}>Click to upload floor plan PNG</p>
//           <p style={{ fontSize: 12 }}>PNG, JPG, JPEG only</p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Device row ────────────────────────────────────────────
// function DeviceRow({ device, onEdit, onDelete }) {
//   return (
//     <tr
//       style={{
//         borderBottom: "1px solid var(--border)",
//         transition: "background 0.1s",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
//       onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//     >
//       <td style={{ padding: "13px 16px" }}>
//         <p style={{ fontWeight: 500, marginBottom: 2 }}>{device.name}</p>
//         <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{device.installationLocation || "—"}</p>
//       </td>
//       <td style={{ padding: "13px 16px" }}>
//         <Badge label={device.type} color={typeColor[device.type] || "default"} />
//       </td>
//       <td style={{ padding: "13px 16px" }}>
//         <Badge label={device.elementId} color={typeColor[device.elementId] || "default"} />
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
//         <code style={{ fontSize: 12 }}>{device.meshAddress || "—"}</code>
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
//         <code style={{ fontSize: 12 }}>{device.macAddress || "—"}</code>
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 12 }}>
//         {device.firstInstalledAt ? new Date(device.firstInstalledAt).toLocaleDateString() : "—"}
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 12 }}>
//         {new Date(device.updatedAt).toLocaleDateString()}
//       </td>
//       <td style={{ padding: "13px 16px" }}>
//         <div style={{ display: "flex", gap: 4 }}>
//           <Button variant="ghost" size="sm" onClick={() => onEdit(device)}>
//             <Pencil size={13} />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => onDelete(device._id)}>
//             <Trash2 size={13} color="var(--danger)" />
//           </Button>
//         </div>
//       </td>
//     </tr>
//   );
// }

// // ── Main page ─────────────────────────────────────────────
// export default function AreaDetailPage() {
//   const { siteId, areaId } = useParams();
//   const [site, setSite] = useState(null);
//   const [area, setArea] = useState(null);
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal] = useState({ open: false, device: null });
//   const [confirm, setConfirm] = useState({ open: false, id: null });

//   useEffect(() => {

   
//     Promise.all([
//       fetch(`/api/sites/${siteId}`).then((r) => r.json()),
//       fetch(`/api/sites/${siteId}/areas/${areaId}`).then((r) => r.json()),
//       fetch(`/api/sites/${siteId}/areas/${areaId}/devices`).then((r) => r.json()),
//     ]).then(([s, a, d]) => {
//       setSite(s);
//       setArea(a);
//       setDevices(d);
//       setLoading(false);
//     });

   
    
//   }, [siteId, areaId]);

//  console.log("Fetched data for Devices.", devices);
//   const handleDeviceSaved = (device) => {
//     setDevices((prev) => {
//       const idx = prev.findIndex((d) => d._id === device._id);
//       if (idx > -1) { const next = [...prev]; next[idx] = device; return next; }
//       return [...prev, device];
//     });
//   };

//   const handleDeleteDevice = async () => {
//     await fetch(`/api/sites/${siteId}/areas/${areaId}/devices/${confirm.id}`, { method: "DELETE" });
//     setDevices((prev) => prev.filter((d) => d._id !== confirm.id));
//     setConfirm({ open: false, id: null });
//   };

//   if (loading) return <Spinner />;

//   const atLimit = devices.length >= 40;

//   return (
//     <div>
//       <PageHeader
//         title={area?.name || "Area"}
//         subtitle={
//           area?.topic
//             ? <span>Topic: <code style={{ fontSize: 13, color: "var(--text-muted)" }}>{area.topic}</code></span>
//             : `${devices.length} device${devices.length !== 1 ? "s" : ""}`
//         }
//         controlNodeMeshAddress={area?.controlNodemeshaddress  ? <span>Mesh Address: <code style={{ fontSize: 13, color: "var(--text-muted)" }}>{area.controlNodemeshaddress}</code></span>
//             : `${devices.length} device${devices.length !== 1 ? "s" : ""}`}
//         controlNodeMacAddress={area?.controlNodemacaddress  ? <span>MAC Address: <code style={{ fontSize: 13, color: "var(--text-muted)" }}>{area.controlNodemacaddress}</code></span>
//             : `${devices.length} device${devices.length !== 1 ? "s" : ""}`}
//         breadcrumb={
//           <>
//             <Link href="/sites" style={{ color: "var(--text-muted)" }}>Sites</Link>
//             <ChevronRight size={13} />
//             <Link href={`/sites/${siteId}`} style={{ color: "var(--text-muted)" }}>{site?.name}</Link>
//             <ChevronRight size={13} />
//             <span style={{ color: "var(--text-secondary)" }}>{area?.name}</span>
//           </>
//         }
//         actions={
//           <Button
//             onClick={() => setModal({ open: true, device: null })}
//             disabled={atLimit}
//             title={atLimit ? "Maximum 40 devices reached" : ""}
//           >
//             <Plus size={15} /> Add Device
//           </Button>
//         }
//       />

//       <div style={{ padding: "32px 40px" }}>
//         {/* Map */}
//         <MapUpload
//           area={area}
//           siteId={siteId}
//           onMapUpdated={(url) => setArea((a) => ({ ...a, mapUrl: url }))}
//           devices={devices}
//         />
//         {/* <MapEditor 
//           mapUrl={area.mapUrl}
//           /> */}

//         {/* Devices table */}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//           <h2 style={{ fontSize: 18, fontFamily: "'Syne',sans-serif" }}>
//             Devices
//             <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)", marginLeft: 10 }}>
//               {devices.length}/40
//             </span>
//           </h2>
//         </div>

//         {devices.length === 0 ? (
//           <EmptyState
//             icon={Cpu}
//             title="No devices yet"
//             description="Add up to 40 devices to this area."
//             action={
//               <Button onClick={() => setModal({ open: true, device: null })}>
//                 <Plus size={15} /> Add Device
//               </Button>
//             }
//           />
//         ) : (
//           <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
//                   {["Device", "Type","Element ID", "Mesh Addr.", "MAC Addr.", "First Installed", "Last Updated", ""].map((h) => (
//                     <th
//                       key={h}
//                       style={{
//                         padding: "11px 16px",
//                         textAlign: "left",
//                         fontSize: 11,
//                         fontWeight: 600,
//                         color: "var(--text-muted)",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.06em",
//                       }}
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {devices.map((d) => (
//                   <DeviceRow
//                     key={d._id}
//                     device={d}
//                     onEdit={(dev) => setModal({ open: true, device: dev })}
//                     onDelete={(id) => setConfirm({ open: true, id })}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <DeviceFormModal
//         open={modal.open}
//         onClose={() => setModal({ open: false, device: null })}
//         initial={modal.device}
//         siteId={siteId}
//         areaId={areaId}
//         onSaved={handleDeviceSaved}
//       />

//       <ConfirmDialog
//         open={confirm.open}
//         onClose={() => setConfirm({ open: false, id: null })}
//         onConfirm={handleDeleteDevice}
//         title="Delete Device"
//         message="Are you sure you want to remove this device? This cannot be undone."
//       />
//     </div>
//   );
// // }


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import {
//   Cpu, Plus, Pencil, Trash2, ChevronRight, Upload, X, FileJson, CheckCircle2, AlertCircle,
// } from "lucide-react";
// import {
//   PageHeader, Button, Modal, FormField, Input, Select, EmptyState,
//   ConfirmDialog, Spinner, Badge,
// } from "@/components/ui";
// import { DEVICE_TYPES } from "@/lib/constants";
// import MapEditor from "@/components/MapEditor";

// // ── Device badge colour by type ───────────────────────────
// const typeColor = {
//   "Smart Light":     "blue",
//   "Smart Switch":    "orange",
//   "Thermostat":      "green",
//   "Security Camera": "red",
//   "Door Sensor":     "default",
// };

// // ── Device form modal ─────────────────────────────────────
// const EMPTY_DEVICE = {
//   name: "",
//   type: "",
//   elementId: "",
//   installationLocation: "",
//   meshAddress: "",
//   macAddress: "",
//   firstInstalledAt: "",
// };

// function DeviceFormModal({ open, onClose, initial, siteId, areaId, onSaved }) {
//   const [form, setForm]     = useState(EMPTY_DEVICE);
//   const [loading, setLoading] = useState(false);
//   const [error, setError]   = useState("");

//   useEffect(() => {
//     if (!open) return;
//     if (initial) {
//       setForm({
//         name:                 initial.name || "",
//         type:                 initial.type || "",
//         elementId:            initial.elementId || "",
//         installationLocation: initial.installationLocation || "",
//         meshAddress:          initial.meshAddress || "",
//         macAddress:           initial.macAddress || "",
//         firstInstalledAt:     initial.firstInstalledAt
//                                 ? initial.firstInstalledAt.slice(0, 10)
//                                 : "",
//       });
//     } else {
//       setForm(EMPTY_DEVICE);
//     }
//     setError("");
//   }, [initial, open]);

//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     const url = initial
//       ? `/api/sites/${siteId}/areas/${areaId}/devices/${initial._id}`
//       : `/api/sites/${siteId}/areas/${areaId}/devices`;
//     const res = await fetch(url, {
//       method: initial ? "PUT" : "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();
//     setLoading(false);
//     if (!res.ok) { setError(data.error || "Something went wrong"); return; }
//     onSaved(data);
//     onClose();
//   };

//   return (
//     <Modal open={open} onClose={onClose} title={initial ? "Edit Device" : "Add Device"} width={560}>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//         {error && (
//           <div style={{
//             background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)",
//             borderRadius: 6, padding: "10px 14px", color: "var(--danger)", fontSize: 13,
//           }}>
//             {error}
//           </div>
//         )}

//         <div className="modal-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//           <FormField label="Device Name *">
//             <Input value={form.name} onChange={set("name")} placeholder="e.g. Ceiling Light 1" required />
//           </FormField>
//           <FormField label="Device Type *">
//             <Select value={form.type} onChange={set("type")} options={DEVICE_TYPES} placeholder="Select type…" />
//           </FormField>
//           <FormField label="Element ID">
//             <Input value={form.elementId} onChange={set("elementId")} placeholder="e.g. 1" />
//           </FormField>
//           <FormField label="Installation Location">
//             <Input value={form.installationLocation} onChange={set("installationLocation")} placeholder="e.g. Ceiling, North Wall" />
//           </FormField>
//           <FormField label="First Installed At">
//             <Input type="date" value={form.firstInstalledAt} onChange={set("firstInstalledAt")} />
//           </FormField>
//           <FormField label="Mesh Address">
//             <Input value={form.meshAddress} onChange={set("meshAddress")} placeholder="e.g. 0x1A2B" />
//           </FormField>
//           <FormField label="MAC Address">
//             <Input value={form.macAddress} onChange={set("macAddress")} placeholder="e.g. AA:BB:CC:DD:EE:FF" />
//           </FormField>
//         </div>

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
//           <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
//           <Button type="submit" disabled={loading || !form.type}>
//             {loading ? "Saving…" : initial ? "Update" : "Add Device"}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// }

// // ── Map upload section ────────────────────────────────────
// function MapUpload({ area, siteId, devices, setDevices, onMapUpdated, onMapRemoved }) {
//   const [uploading, setUploading]       = useState(false);
//   const [removing, setRemoving]         = useState(false);
//   const [confirmRemove, setConfirmRemove] = useState(false);
//   const fileRef = useRef();

//   // Upload a new map image
//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     const fd = new FormData();
//     fd.append("file", file);
//     fd.append("areaId", area._id);
//     const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
//     const { mapUrl } = await uploadRes.json();
//     await fetch(`/api/sites/${siteId}/areas/${area._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mapUrl }),
//     });
//     setUploading(false);
//     onMapUpdated(mapUrl);
//     // Reset file input so same file can be re-uploaded if needed
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   // Remove the map — clears mapUrl in DB, does not delete the file on disk
//   const handleRemove = async () => {
//     setRemoving(true);
//     await fetch(`/api/sites/${siteId}/areas/${area._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mapUrl: null }),
//     });
//     setRemoving(false);
//     setConfirmRemove(false);
//     onMapRemoved();   // tell parent to clear mapUrl from area state
//   };

//   return (
//     <div style={{
//       background: "var(--bg-surface)",
//       border: "1px solid var(--border)",
//       borderRadius: "var(--radius)",
//       padding: 24,
//       marginBottom: 32,
//     }}>
//       {/* ── Header row ── */}
//       <div style={{
//         display: "flex", alignItems: "center",
//         justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8,
//       }}>
//         <h2 style={{ fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Area Map</h2>

//         <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//           {/* Upload / Replace button */}
//           <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading || removing}>
//             <Upload size={13} />
//             {uploading ? "Uploading…" : area.mapUrl ? "Replace Map" : "Upload Map"}
//           </Button>

//           {/* Remove button — only show when a map exists */}
//           {area.mapUrl && (
//             <Button
//               variant="danger"
//               size="sm"
//               onClick={() => setConfirmRemove(true)}
//               disabled={removing || uploading}
//               style={{ display: "flex", alignItems: "center", gap: 5 }}
//             >
//               <X size={13} />
//               {removing ? "Removing…" : "Remove Map"}
//             </Button>
//           )}
//         </div>

//         <input
//           ref={fileRef}
//           type="file"
//           accept=".png,.jpg,.jpeg"
//           style={{ display: "none" }}
//           onChange={handleUpload}
//         />
//       </div>

//       {/* ── Confirm remove dialog ── */}
//       {confirmRemove && (
//         <div style={{
//           background: "rgba(220,38,38,0.06)",
//           border: "1px solid rgba(220,38,38,0.2)",
//           borderRadius: 8, padding: "14px 16px", marginBottom: 16,
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           gap: 12, flexWrap: "wrap",
//         }}>
//           <p style={{ fontSize: 13, color: "#7f1d1d", fontWeight: 500 }}>
//             Remove this map? Device icons and positions will be kept but the map image will be cleared.
//           </p>
//           <div style={{ display: "flex", gap: 8 }}>
//             <Button variant="secondary" size="sm" onClick={() => setConfirmRemove(false)}>
//               Cancel
//             </Button>
//             <Button variant="danger" size="sm" onClick={handleRemove} disabled={removing}>
//               {removing ? "Removing…" : "Yes, Remove"}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* ── Map editor OR empty upload zone ── */}
//       {area.mapUrl ? (
//         <MapEditor
//           mapUrl={area.mapUrl}
//           devices={devices}
//           siteId={siteId}
//           areaId={area._id}
//           onDevicesChange={(updated) => setDevices(updated)}
//         />
//       ) : (
//         <div
//           onClick={() => fileRef.current?.click()}
//           style={{
//             height: 200,
//             border: "2px dashed var(--border)",
//             borderRadius: 8,
//             display: "flex", flexDirection: "column",
//             alignItems: "center", justifyContent: "center",
//             gap: 10, color: "var(--text-muted)", cursor: "pointer",
//             transition: "border-color 0.15s",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
//           onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
//         >
//           <Upload size={28} />
//           <p style={{ fontSize: 14, fontWeight: 500 }}>Click to upload floor plan</p>
//           <p style={{ fontSize: 12 }}>PNG, JPG, JPEG supported</p>
//         </div>
//       )}
//     </div>
//   );
// }


// // ── Network Config upload section ────────────────────────
// function NetworkConfig({ area, siteId, onNetworkConfigUpdated }) {
//   const [uploading, setUploading]   = useState(false);
//   const [removing, setRemoving]     = useState(false);
//   const [confirmRemove, setConfirmRemove] = useState(false);
//   const [parseError, setParseError] = useState("");
//   const [viewJson, setViewJson]     = useState(false);
//   const fileRef = useRef();

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.name.endsWith(".json")) {
//       setParseError("Only .json files are accepted.");
//       if (fileRef.current) fileRef.current.value = "";
//       return;
//     }

//     setParseError("");
//     setUploading(true);

//     // Read and parse JSON client-side before sending to API
//     const text = await file.text();
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch {
//       setParseError("Invalid JSON — the file could not be parsed. Check its contents and try again.");
//       setUploading(false);
//       if (fileRef.current) fileRef.current.value = "";
//       return;
//     }

//     // Send parsed object to the dedicated API route
//     const res = await fetch(`/api/sites/${siteId}/areas/${area._id}/network`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ networkConfig: parsed }),
//     });

//     setUploading(false);
//     if (fileRef.current) fileRef.current.value = "";

//     if (res.ok) {
//       const data = await res.json();
//       onNetworkConfigUpdated(data.networkConfig);
//     } else {
//       setParseError("Failed to save network config. Please try again.");
//     }
//   };

//   const handleRemove = async () => {
//     setRemoving(true);
//     await fetch(`/api/sites/${siteId}/areas/${area._id}/network`, { method: "DELETE" });
//     setRemoving(false);
//     setConfirmRemove(false);
//     onNetworkConfigUpdated(null);
//   };

//   const hasConfig = area.networkConfig !== null && area.networkConfig !== undefined;

//   return (
//     <div style={{
//       background: "var(--bg-surface)",
//       border: "1px solid var(--border)",
//       borderRadius: "var(--radius)",
//       padding: 24,
//       marginBottom: 32,
//     }}>
//       {/* Header */}
//       <div style={{
//         display: "flex", alignItems: "center",
//         justifyContent: "space-between", flexWrap: "wrap", gap: 8,
//         marginBottom: hasConfig || parseError ? 16 : 0,
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <h2 style={{ fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Network Config</h2>
//           {/* Status badge */}
//           {hasConfig ? (
//             <span style={{
//               display: "inline-flex", alignItems: "center", gap: 4,
//               fontSize: 12, fontWeight: 500, color: "var(--success)",
//               background: "var(--success-dim)", border: "1px solid rgba(22,163,74,0.2)",
//               padding: "2px 8px", borderRadius: 999,
//             }}>
//               <CheckCircle2 size={11} /> Saved
//             </span>
//           ) : (
//             <span style={{
//               fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
//               background: "var(--bg-elevated)", border: "1px solid var(--border)",
//               padding: "2px 8px", borderRadius: 999,
//             }}>
//               Not uploaded
//             </span>
//           )}
//         </div>

//         {/* Action buttons */}
//         <div style={{ display: "flex", gap: 8 }}>
//           {hasConfig && (
//             <Button variant="secondary" size="sm" onClick={() => setViewJson((v) => !v)}>
//               <FileJson size={13} /> {viewJson ? "Hide JSON" : "View JSON"}
//             </Button>
//           )}
//           <Button
//             variant="secondary" size="sm"
//             onClick={() => fileRef.current?.click()}
//             disabled={uploading || removing}
//           >
//             <Upload size={13} /> {uploading ? "Uploading…" : hasConfig ? "Replace" : "Upload JSON"}
//           </Button>
//           {hasConfig && (
//             <Button
//               variant="danger" size="sm"
//               onClick={() => setConfirmRemove(true)}
//               disabled={removing || uploading}
//             >
//               <X size={13} /> {removing ? "Removing…" : "Remove"}
//             </Button>
//           )}
//         </div>

//         <input
//           ref={fileRef} type="file" accept=".json"
//           style={{ display: "none" }} onChange={handleUpload}
//         />
//       </div>

//       {/* Parse error */}
//       {parseError && (
//         <div style={{
//           display: "flex", alignItems: "flex-start", gap: 8,
//           background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
//           borderRadius: 7, padding: "11px 14px", marginBottom: 12,
//         }}>
//           <AlertCircle size={15} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
//           <p style={{ fontSize: 13, color: "var(--danger)" }}>{parseError}</p>
//         </div>
//       )}

//       {/* Confirm remove */}
//       {confirmRemove && (
//         <div style={{
//           background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
//           borderRadius: 8, padding: "12px 16px", marginBottom: 12,
//           display: "flex", alignItems: "center", justifyContent: "space-between",
//           gap: 12, flexWrap: "wrap",
//         }}>
//           <p style={{ fontSize: 13, color: "#7f1d1d", fontWeight: 500 }}>
//             Remove the stored network config? This cannot be undone.
//           </p>
//           <div style={{ display: "flex", gap: 8 }}>
//             <Button variant="secondary" size="sm" onClick={() => setConfirmRemove(false)}>Cancel</Button>
//             <Button variant="danger" size="sm" onClick={handleRemove} disabled={removing}>
//               {removing ? "Removing…" : "Yes, Remove"}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Config summary + JSON viewer */}
//       {hasConfig && (
//         <div>
//           {/* Summary row */}
//           <div style={{
//             display: "flex", gap: 20, flexWrap: "wrap",
//             padding: "12px 14px",
//             background: "var(--bg-elevated)",
//             borderRadius: 7,
//             fontSize: 13, color: "var(--text-secondary)",
//           }}>
//             <span>
//               <strong style={{ color: "var(--text-primary)" }}>Keys: </strong>
//               {Object.keys(area.networkConfig).length}
//             </span>
//             <span>
//               <strong style={{ color: "var(--text-primary)" }}>Size: </strong>
//               {(JSON.stringify(area.networkConfig).length / 1024).toFixed(2)} KB
//             </span>
//             <span>
//               <strong style={{ color: "var(--text-primary)" }}>Type: </strong>
//               {Array.isArray(area.networkConfig) ? "Array" : "Object"}
//             </span>
//           </div>

//           {/* Expandable raw JSON viewer */}
//           {viewJson && (
//             <pre style={{
//               marginTop: 10,
//               padding: 14,
//               background: "#f8fafc",
//               border: "1px solid var(--border)",
//               borderRadius: 7,
//               fontSize: 12,
//               lineHeight: 1.6,
//               overflowX: "auto",
//               color: "#1e293b",
//               maxHeight: 360,
//               overflowY: "auto",
//             }}>
//               {JSON.stringify(area.networkConfig, null, 2)}
//             </pre>
//           )}
//         </div>
//       )}

//       {/* Empty state when no config */}
//       {!hasConfig && !parseError && (
//         <div
//           onClick={() => fileRef.current?.click()}
//           style={{
//             height: 100,
//             border: "2px dashed var(--border)",
//             borderRadius: 8,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             gap: 10, color: "var(--text-muted)", cursor: "pointer",
//             transition: "border-color 0.15s",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
//           onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
//         >
//           <FileJson size={22} />
//           <span style={{ fontSize: 14 }}>Click to upload network config JSON</span>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Device table row ──────────────────────────────────────
// function DeviceRow({ device, onEdit, onDelete }) {
//   return (
//     <tr
//       style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
//       onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//     >
//       <td style={{ padding: "13px 16px" }}>
//         <p style={{ fontWeight: 500, marginBottom: 2 }}>{device.name}</p>
//         <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{device.installationLocation || "—"}</p>
//       </td>
//       <td style={{ padding: "13px 16px" }}>
//         <Badge label={device.type} color={typeColor[device.type] || "default"} />
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
//         {device.elementId || "—"}
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
//         <code style={{ fontSize: 12 }}>{device.meshAddress || "—"}</code>
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
//         <code style={{ fontSize: 12 }}>{device.macAddress || "—"}</code>
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 12 }}>
//         {device.firstInstalledAt ? new Date(device.firstInstalledAt).toLocaleDateString() : "—"}
//       </td>
//       <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 12 }}>
//         {device.updatedAt ? new Date(device.updatedAt).toLocaleDateString() : "—"}
//       </td>
//       <td style={{ padding: "13px 16px" }}>
//         <div style={{ display: "flex", gap: 4 }}>
//           <Button variant="ghost" size="sm" onClick={() => onEdit(device)}>
//             <Pencil size={13} />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => onDelete(device._id)}>
//             <Trash2 size={13} color="var(--danger)" />
//           </Button>
//         </div>
//       </td>
//     </tr>
//   );
// }

// // ── Main page ─────────────────────────────────────────────
// export default function AreaDetailPage() {
//   const { siteId, areaId } = useParams();

//   const [site, setSite]       = useState(null);
//   const [area, setArea]       = useState(null);
//   const [devices, setDevices] = useState([]);   // ✅ single source of truth for devices
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal]     = useState({ open: false, device: null });
//   const [confirm, setConfirm] = useState({ open: false, id: null });

//   useEffect(() => {
//     Promise.all([
//       fetch(`/api/sites/${siteId}`).then((r) => r.json()),
//       fetch(`/api/sites/${siteId}/areas/${areaId}`).then((r) => r.json()),
//       fetch(`/api/sites/${siteId}/areas/${areaId}/devices`).then((r) => r.json()),
//     ]).then(([s, a, d]) => {
//       setSite(s);
//       setArea(a);
//       setDevices(Array.isArray(d) ? d : []);  // ✅ guard against non-array
//       setLoading(false);
//     }).catch(() => setLoading(false));
//   }, [siteId, areaId]);

//   const handleDeviceSaved = (device) => {
//     setDevices((prev) => {
//       const idx = prev.findIndex((d) => d._id === device._id);
//       if (idx > -1) { const next = [...prev]; next[idx] = device; return next; }
//       return [...prev, device];
//     });
//   };

//   const handleDeleteDevice = async () => {
//     await fetch(`/api/sites/${siteId}/areas/${areaId}/devices/${confirm.id}`, { method: "DELETE" });
//     setDevices((prev) => prev.filter((d) => d._id !== confirm.id));
//     setConfirm({ open: false, id: null });
//   };

//   if (loading) return <Spinner />;

//   const atLimit = devices.length >= 40;

//   return (
//     <div>
//       <PageHeader
//         title={area?.name || "Area"}
//         subtitle={`${devices.length} device${devices.length !== 1 ? "s" : ""}`}
//         breadcrumb={
//           <>
//             <Link href="/sites" style={{ color: "var(--text-muted)" }}>Sites</Link>
//             <ChevronRight size={13} />
//             <Link href={`/sites/${siteId}`} style={{ color: "var(--text-muted)" }}>{site?.name}</Link>
//             <ChevronRight size={13} />
//             <span style={{ color: "var(--text-secondary)" }}>{area?.name}</span>
//           </>
//         }
//         actions={
//           <Button
//             onClick={() => setModal({ open: true, device: null })}
//             disabled={atLimit}
//             title={atLimit ? "Maximum 40 devices reached" : ""}
//           >
//             <Plus size={15} /> Add Device
//           </Button>
//         }
//       />

//       <div className="page-content">
//         {/* Map section — receives devices + setDevices directly from this page's state */}
//         <MapUpload
//           area={area}
//           siteId={siteId}
//           devices={devices}
//           setDevices={setDevices}
//           onMapUpdated={(url) => setArea((a) => ({ ...a, mapUrl: url }))}
//           onMapRemoved={() => setArea((a) => ({ ...a, mapUrl: null }))}
//         />

//         {/* Network Config */}
//         <NetworkConfig
//           area={area}
//           siteId={siteId}
//           onNetworkConfigUpdated={(config) => setArea((a) => ({ ...a, networkConfig: config }))}
//         />

//         {/* Devices table */}
//         <div style={{
//           display: "flex", alignItems: "center",
//           justifyContent: "space-between", marginBottom: 16,
//         }}>
//           <h2 style={{ fontSize: 18, fontFamily: "'Syne',sans-serif" }}>
//             Devices
//             <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)", marginLeft: 10 }}>
//               {devices.length}/40
//             </span>
//           </h2>
//         </div>

//         {devices.length === 0 ? (
//           <EmptyState
//             icon={Cpu}
//             title="No devices yet"
//             description="Add up to 40 devices to this area."
//             action={
//               <Button onClick={() => setModal({ open: true, device: null })}>
//                 <Plus size={15} /> Add Device
//               </Button>
//             }
//           />
//         ) : (
//           <div className="table-scroll" style={{
//             background: "var(--bg-surface)",
//             border: "1px solid var(--border)",
//             borderRadius: "var(--radius)",
//             overflow: "hidden",
//           }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
//               <thead>
//                 <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
//                   {["Device", "Type", "Element ID", "Mesh Addr.", "MAC Addr.", "First Installed", "Last Updated", ""].map((h) => (
//                     <th key={h} style={{
//                       padding: "11px 16px", textAlign: "left",
//                       fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
//                       textTransform: "uppercase", letterSpacing: "0.06em",
//                       whiteSpace: "nowrap",
//                     }}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {devices.map((d) => (
//                   <DeviceRow
//                     key={d._id}
//                     device={d}
//                     onEdit={(dev) => setModal({ open: true, device: dev })}
//                     onDelete={(id) => setConfirm({ open: true, id })}
//                   />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <DeviceFormModal
//         open={modal.open}
//         onClose={() => setModal({ open: false, device: null })}
//         initial={modal.device}
//         siteId={siteId}
//         areaId={areaId}
//         onSaved={handleDeviceSaved}
//       />

//       <ConfirmDialog
//         open={confirm.open}
//         onClose={() => setConfirm({ open: false, id: null })}
//         onConfirm={handleDeleteDevice}
//         title="Delete Device"
//         message="Are you sure you want to remove this device? This cannot be undone."
//       />
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Cpu, Plus, Pencil, Trash2, ChevronRight, Upload, X, FileJson, CheckCircle2, AlertCircle,
} from "lucide-react";
import {
  PageHeader, Button, Modal, FormField, Input, Select, EmptyState,
  ConfirmDialog, Spinner, Badge,
} from "@/components/ui";
import { DEVICE_TYPES } from "@/lib/constants";
import MapEditor from "@/components/MapEditor";

// ── Device badge colour by type ───────────────────────────
const typeColor = {
  "Smart Light":     "blue",
  "Smart Switch":    "orange",
  "Thermostat":      "green",
  "Security Camera": "red",
  "Door Sensor":     "default",
};

// ── Device form modal ─────────────────────────────────────
const EMPTY_DEVICE = {
  name: "",
  type: "",
  elementId: "",
  installationLocation: "",
  meshAddress: "",
  macAddress: "",
  firstInstalledAt: "",
};

function DeviceFormModal({ open, onClose, initial, siteId, areaId, onSaved }) {
  const [form, setForm]     = useState(EMPTY_DEVICE);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        name:                 initial.name || "",
        type:                 initial.type || "",
        elementId:            initial.elementId || "",
        installationLocation: initial.installationLocation || "",
        meshAddress:          initial.meshAddress || "",
        macAddress:           initial.macAddress || "",
        firstInstalledAt:     initial.firstInstalledAt
                                ? initial.firstInstalledAt.slice(0, 10)
                                : "",
      });
    } else {
      setForm(EMPTY_DEVICE);
    }
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
            background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)",
            borderRadius: 6, padding: "10px 14px", color: "var(--danger)", fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <div className="modal-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={loading || !form.type}>
            {loading ? "Saving…" : initial ? "Update" : "Add Device"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Map upload section ────────────────────────────────────
function MapUpload({ area, siteId, devices, setDevices, onMapUpdated, onMapRemoved }) {
  const [uploading, setUploading]       = useState(false);
  const [removing, setRemoving]         = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const fileRef = useRef();

  // Upload a new map image
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
    // Reset file input so same file can be re-uploaded if needed
    if (fileRef.current) fileRef.current.value = "";
  };

  // Remove the map — clears mapUrl in DB, does not delete the file on disk
  const handleRemove = async () => {
    setRemoving(true);
    await fetch(`/api/sites/${siteId}/areas/${area._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapUrl: null }),
    });
    setRemoving(false);
    setConfirmRemove(false);
    onMapRemoved();   // tell parent to clear mapUrl from area state
  };

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 24,
      marginBottom: 32,
    }}>
      {/* ── Header row ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8,
      }}>
        <h2 style={{ fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Area Map</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Upload / Replace button */}
          <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading || removing}>
            <Upload size={13} />
            {uploading ? "Uploading…" : area.mapUrl ? "Replace Map" : "Upload Map"}
          </Button>

          {/* Remove button — only show when a map exists */}
          {area.mapUrl && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmRemove(true)}
              disabled={removing || uploading}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <X size={13} />
              {removing ? "Removing…" : "Remove Map"}
            </Button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </div>

      {/* ── Confirm remove dialog ── */}
      {confirmRemove && (
        <div style={{
          background: "rgba(220,38,38,0.06)",
          border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: 8, padding: "14px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 13, color: "#7f1d1d", fontWeight: 500 }}>
            Remove this map? Device icons and positions will be kept but the map image will be cleared.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setConfirmRemove(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleRemove} disabled={removing}>
              {removing ? "Removing…" : "Yes, Remove"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Map editor OR empty upload zone ── */}
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
            height: 200,
            border: "2px dashed var(--border)",
            borderRadius: 8,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 10, color: "var(--text-muted)", cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <Upload size={28} />
          <p style={{ fontSize: 14, fontWeight: 500 }}>Click to upload floor plan</p>
          <p style={{ fontSize: 12 }}>PNG, JPG, JPEG supported</p>
        </div>
      )}
    </div>
  );
}


// ── Network Config upload section ────────────────────────
function NetworkConfig({ area, siteId, onNetworkConfigUpdated }) {
  const [uploading, setUploading]   = useState(false);
  const [removing, setRemoving]     = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [parseError, setParseError] = useState("");
  const [viewJson, setViewJson]     = useState(false);
  const fileRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".json")) {
      setParseError("Only .json files are accepted.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setParseError("");
    setUploading(true);

    // Read and parse JSON client-side before sending to API
    const text = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      setParseError("Invalid JSON — the file could not be parsed. Check its contents and try again.");
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    // Send parsed object to the dedicated API route
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
      padding: 24,
      marginBottom: 32,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        marginBottom: hasConfig || parseError ? 16 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Network Config</h2>
          {/* Status badge */}
          {hasConfig ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 12, fontWeight: 500, color: "var(--success)",
              background: "var(--success-dim)", border: "1px solid rgba(22,163,74,0.2)",
              padding: "2px 8px", borderRadius: 999,
            }}>
              <CheckCircle2 size={11} /> Saved
            </span>
          ) : (
            <span style={{
              fontSize: 12, fontWeight: 500, color: "var(--text-muted)",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              padding: "2px 8px", borderRadius: 999,
            }}>
              Not uploaded
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {hasConfig && (
            <Button variant="secondary" size="sm" onClick={() => setViewJson((v) => !v)}>
              <FileJson size={13} /> {viewJson ? "Hide JSON" : "View JSON"}
            </Button>
          )}
          <Button
            variant="secondary" size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || removing}
          >
            <Upload size={13} /> {uploading ? "Uploading…" : hasConfig ? "Replace" : "Upload JSON"}
          </Button>
          {hasConfig && (
            <Button
              variant="danger" size="sm"
              onClick={() => setConfirmRemove(true)}
              disabled={removing || uploading}
            >
              <X size={13} /> {removing ? "Removing…" : "Remove"}
            </Button>
          )}
        </div>

        <input
          ref={fileRef} type="file" accept=".json"
          style={{ display: "none" }} onChange={handleUpload}
        />
      </div>

      {/* Parse error */}
      {parseError && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 8,
          background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: 7, padding: "11px 14px", marginBottom: 12,
        }}>
          <AlertCircle size={15} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "var(--danger)" }}>{parseError}</p>
        </div>
      )}

      {/* Confirm remove */}
      {confirmRemove && (
        <div style={{
          background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: 8, padding: "12px 16px", marginBottom: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 13, color: "#7f1d1d", fontWeight: 500 }}>
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

      {/* Config summary + JSON viewer */}
      {hasConfig && (
        <div>
          {/* Summary row */}
          <div style={{
            display: "flex", gap: 20, flexWrap: "wrap",
            padding: "12px 14px",
            background: "var(--bg-elevated)",
            borderRadius: 7,
            fontSize: 13, color: "var(--text-secondary)",
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

          {/* Expandable raw JSON viewer */}
          {viewJson && (
            <pre style={{
              marginTop: 10,
              padding: 14,
              background: "#f8fafc",
              border: "1px solid var(--border)",
              borderRadius: 7,
              fontSize: 12,
              lineHeight: 1.6,
              overflowX: "auto",
              color: "#1e293b",
              maxHeight: 360,
              overflowY: "auto",
            }}>
              {JSON.stringify(area.networkConfig, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Empty state when no config */}
      {!hasConfig && !parseError && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            height: 100,
            border: "2px dashed var(--border)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, color: "var(--text-muted)", cursor: "pointer",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          <FileJson size={22} />
          <span style={{ fontSize: 14 }}>Click to upload network config JSON</span>
        </div>
      )}
    </div>
  );
}

// ── Device table row ──────────────────────────────────────
function DeviceRow({ device, onEdit, onDelete }) {
  return (
    <tr
      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.1s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "13px 16px" }}>
        <p style={{ fontWeight: 500, marginBottom: 2 }}>{device.name}</p>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{device.installationLocation || "—"}</p>
      </td>
      <td style={{ padding: "13px 16px" }}>
        <Badge label={device.type} color={typeColor[device.type] || "default"} />
      </td>
      <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
        {device.elementId || "—"}
      </td>
      <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
        <code style={{ fontSize: 12 }}>{device.meshAddress || "—"}</code>
      </td>
      <td style={{ padding: "13px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
        <code style={{ fontSize: 12 }}>{device.macAddress || "—"}</code>
      </td>
      <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 12 }}>
        {device.firstInstalledAt ? new Date(device.firstInstalledAt).toLocaleDateString() : "—"}
      </td>
      <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 12 }}>
        {device.updatedAt ? new Date(device.updatedAt).toLocaleDateString() : "—"}
      </td>
      <td style={{ padding: "13px 16px" }}>
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

// ── Main page ─────────────────────────────────────────────
export default function AreaDetailPage() {
  const { siteId, areaId } = useParams();

  const [site, setSite]       = useState(null);
  const [area, setArea]       = useState(null);
  const [devices, setDevices] = useState([]);   // ✅ single source of truth for devices
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
      setDevices(Array.isArray(d) ? d : []);  // ✅ guard against non-array
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
        {/* Map section — receives devices + setDevices directly from this page's state */}
        <MapUpload
          area={area}
          siteId={siteId}
          devices={devices}
          setDevices={setDevices}
          onMapUpdated={(url) => setArea((a) => ({ ...a, mapUrl: url }))}
          onMapRemoved={() => setArea((a) => ({ ...a, mapUrl: null }))}
        />

        {/* Network Config */}
        <NetworkConfig
          area={area}
          siteId={siteId}
          onNetworkConfigUpdated={(config) => setArea((a) => ({ ...a, networkConfig: config }))}
        />

        {/* Devices table */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 16,
        }}>
          <h2 style={{ fontSize: 18, fontFamily: "'Syne',sans-serif" }}>
            Devices
            <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text-muted)", marginLeft: 10 }}>
              {devices.length}/40
            </span>
          </h2>
        </div>

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
          <div className="table-scroll" style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
                  {["Device", "Type", "Element ID", "Mesh Addr.", "MAC Addr.", "First Installed", "Last Updated", ""].map((h) => (
                    <th key={h} style={{
                      padding: "11px 16px", textAlign: "left",
                      fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
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