// "use client";

// import { useState, useRef } from "react";
// import { iconMap } from "@/lib/constants";

// export default function MapEditor({ mapUrl, devices }) {
//   const [deviceList, setDeviceList] = useState(devices || []);
//   const mapRef = useRef(null);

//   return (
//     <div
//       ref={mapRef}
//       style={{
//         position: "relative",      // ✅ REQUIRED for absolute children to work
//         width: "100%",
//         border: "1px solid var(--border)",
//         borderRadius: 8,
//         overflow: "visible",       // ✅ changed from "hidden" so icons aren't clipped
//         marginBottom: 24,
//         display: "inline-block",
//       }}
//     >
//       {/* Map image */}
//       <img
//         src={mapUrl}
//         alt="Area Map"
//         style={{
//           display: "block",        // removes bottom gap on img
//           width: "100%",
//           height: "auto",          // ✅ let height follow naturally
//           borderRadius: 8,
//         }}
//       />

//       {/* Device icons */}
//       {deviceList.map((device) => {
//         // Skip devices with no position set
//         if (device.x === undefined || device.y === undefined) return null;

//         return (
//           <div
//             key={device._id}
//             style={{
//               position: "absolute",
//               left: `${device.x}%`,       // ✅ percentage-based positioning
//               top: `${device.y}%`,
//               transform: "translate(-50%, -50%)",
//               background: "var(--accent)",
//               borderRadius: "50%",
//               width: 32,
//               height: 32,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//               zIndex: 10,
//             }}
//             title={device.name}
//           >
//             <img
//               src={iconMap[device.type]}
//               alt={device.type}
//               style={{ width: 18, height: 18 }}
//             />
//           </div>
//         );
//       })}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useCallback } from "react";
import { iconMap, DEVICE_TYPES } from "@/lib/constants";
import {
  Pencil, Trash2, Save, X, Check, Move,
  ChevronDown, Lightbulb, ToggleRight, Thermometer, Camera, DoorOpen
} from "lucide-react";

// ── Lucide fallback icons per device type (shown if PNG missing) ──
const LucideIconMap = {
  "Smart Light":     Lightbulb,
  "Smart Switch":    ToggleRight,
  "Thermostat":      Thermometer,
  "Security Camera": Camera,
  "Door Sensor":     DoorOpen,
};

// Colour per device type for the icon badge
const typeColor = {
  "Smart Light":     "#f59e0b",
  "Smart Switch":    "#3b82f6",
  "Thermostat":      "#10b981",
  "Security Camera": "#ef4444",
  "Door Sensor":     "#8b5cf6",
};

// ── Small inline edit popup that appears when icon is clicked ──
function DevicePopup({ device, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({
    name:                 device.name || "",
    installationLocation: device.installationLocation || "",
    meshAddress:          device.meshAddress || "",
    macAddress:           device.macAddress || "",
    type:                 device.type || DEVICE_TYPES[0],
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputStyle = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 12,
    border: "1px solid #d1d5db",
    borderRadius: 5,
    background: "#fff",
    color: "#111827",
    outline: "none",
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: "#6b7280",
    marginBottom: 3,
    display: "block",
  };

  return (
    // Backdrop — clicking outside closes popup
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.15)",
      }}
    >
      {/* Popup box — stop clicks bubbling to backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 18,
          width: 260,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          zIndex: 201,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>Edit Device</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}>
            <X size={16} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={form.name} onChange={set("name")} />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select style={inputStyle} value={form.type} onChange={set("type")}>
              {DEVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.installationLocation} onChange={set("installationLocation")} />
          </div>
          <div>
            <label style={labelStyle}>Mesh Address</label>
            <input style={inputStyle} value={form.meshAddress} onChange={set("meshAddress")} />
          </div>
          <div>
            <label style={labelStyle}>MAC Address</label>
            <input style={inputStyle} value={form.macAddress} onChange={set("macAddress")} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            onClick={() => onSave(form)}
            style={{
              flex: 1, padding: "7px 0", background: "#2563eb", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}
          >
            <Check size={13} /> Save
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: "7px 12px", background: "#fef2f2", color: "#dc2626",
              border: "1px solid #fecaca", borderRadius: 6, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main MapEditor component ──────────────────────────────────────
export default function MapEditor({ mapUrl, devices, siteId, areaId, onDevicesChange }) {
  // Working copy of devices — changes here don't go to DB until Save
  const [deviceList, setDeviceList]   = useState(
    (devices || []).map((d) => ({ ...d, x: d.x ?? 50, y: d.y ?? 50 }))
  );

  const [mode, setMode]               = useState("view");   // "view" | "edit"
  const [draggingId, setDraggingId]   = useState(null);
  const [dragOffset, setDragOffset]   = useState({ x: 0, y: 0 });
  const [selectedDevice, setSelected] = useState(null);     // device whose popup is open
  const [saving, setSaving]           = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);  // "Add Device" dropdown

  const mapRef    = useRef(null);
  // Keep original data for Cancel
  const originalRef = useRef(
    (devices || []).map((d) => ({ ...d, x: d.x ?? 50, y: d.y ?? 50 }))
  );

  // ── Enter edit mode ──
  const enterEdit = () => {
    originalRef.current = deviceList.map((d) => ({ ...d }));
    setMode("edit");
    setShowTypeMenu(false);
  };

  // ── Cancel — restore original state ──
  const cancelEdit = () => {
    setDeviceList(originalRef.current.map((d) => ({ ...d })));
    setMode("view");
    setDraggingId(null);
    setSelected(null);
    setShowTypeMenu(false);
  };

  // ── Save — send positions to DB ──
  const saveMap = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `/api/sites/${siteId}/areas/${areaId}/devices/bulk`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deviceList),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setDeviceList(updated);
        originalRef.current = updated.map((d) => ({ ...d }));
        setMode("view");
        onDevicesChange && onDevicesChange(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Add a new device icon to the centre of the map ──
  const addDeviceToMap = (type) => {
    const newDevice = {
      _id:      `temp_${Date.now()}`,   // temp ID until saved to DB
      name:     `New ${type}`,
      type,
      x:        50,
      y:        50,
      meshAddress: "",
      macAddress:  "",
      installationLocation: "",
      isNew:    true,                   // flag so we know to POST not PUT
    };
    setDeviceList((prev) => [...prev, newDevice]);
    setShowTypeMenu(false);
  };

  // ── Mouse down on an icon — start drag ──
  const handleIconMouseDown = useCallback((e, device) => {
    if (mode !== "edit") return;
    e.preventDefault();
    e.stopPropagation();

    const mapRect = mapRef.current.getBoundingClientRect();
    // Where on the map (in px) is the icon's current centre?
    const iconCentreX = (device.x / 100) * mapRect.width;
    const iconCentreY = (device.y / 100) * mapRect.height;
    // How far from that centre did the user click?
    const cursorX = e.clientX - mapRect.left;
    const cursorY = e.clientY - mapRect.top;

    setDragOffset({
      x: cursorX - iconCentreX,
      y: cursorY - iconCentreY,
    });
    setDraggingId(device._id);
  }, [mode]);

  // ── Mouse move on map container — move the dragged icon ──
  const handleMapMouseMove = useCallback((e) => {
    if (!draggingId || mode !== "edit") return;
    e.preventDefault();

    const mapRect = mapRef.current.getBoundingClientRect();
    const rawX = e.clientX - mapRect.left - dragOffset.x;
    const rawY = e.clientY - mapRect.top  - dragOffset.y;

    // Convert px to percentage, clamp between 0–100
    const xPercent = Math.max(0, Math.min(100, (rawX / mapRect.width)  * 100));
    const yPercent = Math.max(0, Math.min(100, (rawY / mapRect.height) * 100));

    setDeviceList((prev) =>
      prev.map((d) =>
        d._id === draggingId ? { ...d, x: xPercent, y: yPercent } : d
      )
    );
  }, [draggingId, dragOffset, mode]);

  // ── Mouse up — stop drag ──
  const handleMapMouseUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  // ── Click on icon (not dragging) — open edit popup ──
  const handleIconClick = useCallback((e, device) => {
    if (mode !== "edit") return;
    e.stopPropagation();
    if (draggingId) return;       // don't open popup if we just finished dragging
    setSelected(device);
  }, [mode, draggingId]);

  // ── Save edits from popup ──
  const handlePopupSave = (updatedFields) => {
    setDeviceList((prev) =>
      prev.map((d) =>
        d._id === selectedDevice._id ? { ...d, ...updatedFields } : d
      )
    );
    setSelected(null);
  };

  // ── Delete from popup ──
  const handlePopupDelete = () => {
    setDeviceList((prev) => prev.filter((d) => d._id !== selectedDevice._id));
    setSelected(null);
  };

  // ── Touch support (mobile) ──
  const handleIconTouchStart = useCallback((e, device) => {
    if (mode !== "edit") return;
    e.stopPropagation();
    const touch = e.touches[0];
    const mapRect = mapRef.current.getBoundingClientRect();
    const iconCentreX = (device.x / 100) * mapRect.width;
    const iconCentreY = (device.y / 100) * mapRect.height;
    const cursorX = touch.clientX - mapRect.left;
    const cursorY = touch.clientY - mapRect.top;
    setDragOffset({ x: cursorX - iconCentreX, y: cursorY - iconCentreY });
    setDraggingId(device._id);
  }, [mode]);

  const handleMapTouchMove = useCallback((e) => {
    if (!draggingId || mode !== "edit") return;
    e.preventDefault();
    const touch = e.touches[0];
    const mapRect = mapRef.current.getBoundingClientRect();
    const rawX = touch.clientX - mapRect.left - dragOffset.x;
    const rawY = touch.clientY - mapRect.top  - dragOffset.y;
    const xPercent = Math.max(0, Math.min(100, (rawX / mapRect.width)  * 100));
    const yPercent = Math.max(0, Math.min(100, (rawY / mapRect.height) * 100));
    setDeviceList((prev) =>
      prev.map((d) =>
        d._id === draggingId ? { ...d, x: xPercent, y: yPercent } : d
      )
    );
  }, [draggingId, dragOffset, mode]);

  // ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ marginBottom: 24 }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 12, flexWrap: "wrap",
      }}>
      

        {mode === "view" ? (
          /* VIEW MODE toolbar */
          <button
            onClick={enterEdit}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", background: "#2563eb", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Pencil size={13} /> Edit Map
          </button>
        ) : (
          /* EDIT MODE toolbar */
          <>
            {/* Add Device dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowTypeMenu((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", background: "#fff", color: "#374151",
                  border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13,
                  fontWeight: 600, cursor: "pointer",
                }}
              >
                + Add Device <ChevronDown size={13} />
              </button>

              {showTypeMenu && (
                <div style={{
                  position: "absolute", top: "110%", left: 0,
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 50, minWidth: 180, overflow: "hidden",
                }}>
                  {DEVICE_TYPES.map((type) => {
                    const Icon = LucideIconMap[type];
                    return (
                      <button
                        key={type}
                        onClick={() => addDeviceToMap(type)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          width: "100%", padding: "10px 14px", background: "none",
                          border: "none", cursor: "pointer", fontSize: 13,
                          color: "#374151", textAlign: "left",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                      >
                        <span style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: typeColor[type] + "22",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Icon size={13} color={typeColor[type]} />
                        </span>
                        {type}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Save */}
            <button
              onClick={saveMap}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", background: "#16a34a", color: "#fff",
                border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={13} /> {saving ? "Saving…" : "Save Map"}
            </button>

            {/* Cancel */}
            <button
              onClick={cancelEdit}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", background: "#fff", color: "#6b7280",
                border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13,
                fontWeight: 600, cursor: "pointer",
              }}
            >
              <X size={13} /> Cancel
            </button>
          </>
        )}
      </div>

      {/* ── Edit mode hint ── */}
      {mode === "edit" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          marginBottom: 10, padding: "7px 12px",
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: 6, fontSize: 12, color: "#1d4ed8",
        }}>
          <Move size={13} />
          Drag icons to reposition · Click an icon to edit its details
        </div>
      )}

      {/* ── Map container ── */}
      <div
        ref={mapRef}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
        onMouseLeave={handleMapMouseUp}      // stop drag if cursor leaves map
        onTouchMove={handleMapTouchMove}
        onTouchEnd={() => setDraggingId(null)}
        style={{
          position: "relative",
          width: "100%",
          border: "1px solid #e3e6ef",
          borderRadius: 8,
          overflow: "hidden",
          userSelect: "none",                 // prevent text selection while dragging
          cursor: draggingId ? "grabbing" : "default",
          boxShadow: mode === "edit"
            ? "0 0 0 2px #2563eb44"           // blue ring in edit mode
            : "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Map image */}
        {mapUrl ? (
          <img
            src={mapUrl}
            alt="Area Map"
            draggable={false}                 // prevent browser's native image drag
            style={{ display: "block", width: "100%", height: "auto", borderRadius: 8 }}
          />
        ) : (
          <div style={{
            height: 240, display: "flex", alignItems: "center",
            justifyContent: "center", background: "#f9fafb", color: "#9ca3af", fontSize: 14,
          }}>
            No map uploaded for this area
          </div>
        )}

        {/* ── Device icons ── */}
        {deviceList.map((device) => {
          const x = device.x ?? 50;
          const y = device.y ?? 50;
          const Icon = LucideIconMap[device.type] || Lightbulb;
          const color = typeColor[device.type] || "#6b7280";
          const isDragging = draggingId === device._id;

          return (
            <div
              key={device._id}
              onMouseDown={(e) => handleIconMouseDown(e, device)}
              onTouchStart={(e) => handleIconTouchStart(e, device)}
              onClick={(e) => handleIconClick(e, device)}
              title={`${device.name} (${device.type})`}
              style={{
                position: "absolute",
                left: `${x}%`,
                top:  `${y}%`,
                transform: "translate(-50%, -50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#fff",
                border: `2.5px solid ${color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: mode === "edit" ? (isDragging ? "grabbing" : "grab") : "default",
                boxShadow: isDragging
                  ? `0 6px 20px ${color}66`
                  : `0 2px 8px rgba(0,0,0,0.18)`,
                transform: isDragging
                  ? "translate(-50%, -50%) scale(1.2)"
                  : "translate(-50%, -50%) scale(1)",
                transition: isDragging ? "none" : "box-shadow 0.15s, transform 0.15s",
                zIndex: isDragging ? 30 : 10,
              }}
            >
              {/* Try PNG icon first, fall back to Lucide */}
              {iconMap[device.type] ? (
                <img
                  src={iconMap[device.type]}
                  alt={device.type}
                  draggable={false}
                  style={{ width: 18, height: 18 }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <Icon size={16} color={color} />
              )}

              {/* Device name label */}
              <div style={{
                position: "absolute",
                top: "110%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(17,24,39,0.82)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 500,
                padding: "2px 6px",
                borderRadius: 4,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}>
                {device.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Edit popup ── */}
      {selectedDevice && mode === "edit" && (
        <DevicePopup
          device={selectedDevice}
          onSave={handlePopupSave}
          onClose={() => setSelected(null)}
          onDelete={handlePopupDelete}
        />
      )}
    </div>
  );
}