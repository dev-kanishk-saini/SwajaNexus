"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

/* ─── Button ──────────────────────────────────────────────── */
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
  };

  const variants = {
    primary: { background: "var(--accent)", color: "#fff" },
    secondary: {
      background: "var(--bg-elevated)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border)",
    },
    danger: { background: "var(--danger)", color: "#fff" },
    ghost: { background: "transparent", color: "var(--text-secondary)" },
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

/* ─── Badge ───────────────────────────────────────────────── */
export function Badge({ label, color = "default" }) {
  const colors = {
    default: { bg: "var(--bg-elevated)", text: "var(--text-secondary)" },
    blue: { bg: "var(--accent-dim)", text: "var(--accent)" },
    green: { bg: "rgba(52,201,126,0.12)", text: "var(--success)" },
    orange: { bg: "rgba(245,166,35,0.12)", text: "var(--warning)" },
    red: { bg: "rgba(255,92,92,0.12)", text: "var(--danger)" },
  };
  const c = colors[color] || colors.default;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        background: c.bg,
        color: c.text,
      }}
    >
      {label}
    </span>
  );
}

/* ─── Modal ───────────────────────────────────────────────── */
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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: 17, fontFamily: "'Syne',sans-serif" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── FormField ───────────────────────────────────────────── */
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

/* ─── Input ───────────────────────────────────────────────── */
export function Input({ value, onChange, placeholder, type = "text", required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "9px 12px",
        color: "var(--text-primary)",
        fontSize: 14,
        fontFamily: "'DM Sans',sans-serif",
        outline: "none",
        width: "100%",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

/* ─── Select ──────────────────────────────────────────────── */
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
        fontFamily: "'DM Sans',sans-serif",
        outline: "none",
        width: "100%",
        cursor: "pointer",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

/* ─── PageHeader ──────────────────────────────────────────── */
export function PageHeader({ title, subtitle, actions, breadcrumb , controlNodeMeshAddress , controlNodeMacAddress }) {
  return (
    <div
      style={{
        padding: "32px 40px 24px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-surface)",
      }}
    >
      {breadcrumb && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          {breadcrumb}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>{title}</h1>
          {subtitle && <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{subtitle}</p>}
          {controlNodeMeshAddress && <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{controlNodeMeshAddress}</p>}
          {controlNodeMacAddress && <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{controlNodeMacAddress}</p>}
        </div>

        {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  );
}

/* ─── EmptyState ──────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: 16,
        color: "var(--text-muted)",
        textAlign: "center",
      }}
    >
      {Icon && (
        <div
          style={{
            width: 56,
            height: 56,
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <Icon size={24} color="var(--text-muted)" />
        </div>
      )}
      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "'Syne',sans-serif" }}>
        {title}
      </p>
      {description && <p style={{ fontSize: 13, maxWidth: 320 }}>{description}</p>}
      {action}
    </div>
  );
}

/* ─── ConfirmDialog ───────────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}>
      <p style={{ color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  );
}

/* ─── Spinner ─────────────────────────────────────────────── */
export function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
