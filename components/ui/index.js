


"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

/* ─── Button ── */
export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
  style: extraStyle = {},
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: "var(--radius-sm)",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    transition: "all 0.15s",
    padding: size === "sm" ? "6px 12px" : "9px 18px",
    fontSize: size === "sm" ? 13 : 14,
    whiteSpace: "nowrap",
  };

  const variants = {
    primary: {
      background: "var(--accent)",
      color: "#fff",
      boxShadow: "0 1px 3px rgba(79,142,255,0.3)",
    },
    secondary: {
      background: "var(--bg-surface)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
    },
    danger: {
      background: "var(--danger)",
      color: "#fff",
      boxShadow: "0 1px 3px rgba(229,72,72,0.3)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-secondary)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...extraStyle }}
    >
      {children}
    </button>
  );
}

/* ─── Badge ── */
export function Badge({ label, color = "default" }) {
  const colors = {
    default: { bg: "var(--bg-elevated)", text: "var(--text-secondary)", border: "var(--border)" },
    blue:    { bg: "var(--accent-dim)",  text: "var(--accent)",          border: "rgba(79,142,255,0.2)" },
    green:   { bg: "var(--success-dim)", text: "var(--success)",         border: "rgba(46,184,114,0.2)" },
    orange:  { bg: "var(--warning-dim)", text: "var(--warning)",         border: "rgba(224,159,31,0.2)" },
    red:     { bg: "var(--danger-dim)",  text: "var(--danger)",          border: "rgba(229,72,72,0.2)" },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 9px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {label}
    </span>
  );
}

/* ─── Modal ── */
export function Modal({ open, onClose, title, children, width = 520 }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(3px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(8px, 3vw, 20px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          width: "100%",
          maxWidth: width,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 22px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "var(--bg-card)",
          zIndex: 1,
        }}>
          <h3 style={{ fontSize: 17, fontFamily: "'Syne',sans-serif", color: "var(--text-primary)" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none",
              color: "var(--text-muted)", cursor: "pointer",
              display: "flex", padding: 4, borderRadius: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "clamp(16px, 3vw, 24px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── FormField ── */
export function FormField({ label, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{hint}</p>}
    </div>
  );
}

/* ─── Input ── */
export function Input({ value, onChange, placeholder, type = "text", required, name }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "9px 12px",
        color: "var(--text-primary)",
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        outline: "none",
        width: "100%",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--accent)";
        e.target.style.boxShadow = "0 0 0 3px rgba(79,142,255,0.12)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

/* ─── Select ── */
export function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "9px 12px",
        color: value ? "var(--text-primary)" : "var(--text-muted)",
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        outline: "none",
        width: "100%",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
      onBlur={(e)  => e.target.style.borderColor = "var(--border)"}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

/* ─── PageHeader ── */
export function PageHeader({ title, subtitle, actions, breadcrumb, controlNodeMeshAddress, controlNodeMacAddress }) {
  return (
    <div className="page-header">
      {breadcrumb && (
        <div className="breadcrumb">
          {breadcrumb}
        </div>
      )}
      <div className="page-header-inner">
        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontSize: "clamp(18px, 3vw, 26px)",
            marginBottom: 4,
            color: "var(--text-primary)",
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{subtitle}</p>
          )}
          {controlNodeMeshAddress && (
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
              {controlNodeMeshAddress}
            </p>
          )}
          {controlNodeMacAddress && (
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>
              {controlNodeMacAddress}
            </p>
          )}
        </div>
        {actions && (
          <div className="page-header-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── EmptyState ── */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(40px, 8vw, 80px) 20px",
      gap: 14,
      color: "var(--text-muted)",
      textAlign: "center",
    }}>
      {Icon && (
        <div style={{
          width: 52,
          height: 52,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}>
          <Icon size={22} color="var(--text-muted)" />
        </div>
      )}
      <p style={{
        fontSize: 16,
        fontWeight: 600,
        color: "var(--text-secondary)",
        fontFamily: "'Syne', sans-serif",
      }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: 13, maxWidth: 300, lineHeight: 1.6 }}>{description}</p>
      )}
      {action}
    </div>
  );
}

/* ─── ConfirmDialog ── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  );
}

/* ─── Spinner ── */
export function Spinner() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 60,
    }}>
      <div style={{
        width: 26,
        height: 26,
        border: "3px solid var(--border)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}