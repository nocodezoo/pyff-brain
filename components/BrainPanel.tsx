"use client";

import { useState, useEffect } from "react";
import AIBrainMap from "./AIBrainMap";

interface BrainNode {
  id: string;
  label: string;
  icon: string;
  detail: string;
  category: "python" | "ffmpeg" | "special" | "vybord";
  color: string;
  codeRef?: string;
}

const VYBORD_NODES: BrainNode[] = [
  {
    id: "vy-create",
    label: "CREATE PAGE",
    icon: "🎬",
    detail: "Main video creation interface — all generation logic lives here",
    category: "vybord",
    color: "#6366f1",
    codeRef: "components/CreatePage.tsx",
  },
  {
    id: "vy-state",
    label: "VIDEO STATE",
    icon: "📊",
    detail: "State: voice, template, fontSize, textColor, effect, music, ratio, duration, filter, cta",
    category: "vybord",
    color: "#6366f1",
    codeRef: "components/CreatePage.tsx — VideoSettings state",
  },
  {
    id: "vy-images",
    label: "IMAGE HANDLER",
    icon: "🖼️",
    detail: "URL fetch, HTML paste, CORS proxy, image grid selection, concurrent download, max 15 images",
    category: "vybord",
    color: "#6366f1",
    codeRef: "components/CreatePage.tsx — Image Scan Modal",
  },
  {
    id: "vy-voice",
    label: "VOICE ENGINE",
    icon: "🎙️",
    detail: "12 AI voices: Roger, Sarah, Laura, Harry, Jessica, Charlie, George, Bella, Liam, Will, Daniel, Adam",
    category: "vybord",
    color: "#6366f1",
    codeRef: "components/CreatePage.tsx — voice selection grid",
  },
  {
    id: "vy-captions",
    label: "CAPTION SYSTEM",
    icon: "💬",
    detail: "6 PyCaps templates, font size slider (20–80px), text + background color swatches",
    category: "vybord",
    color: "#6366f1",
    codeRef: "components/CreatePage.tsx — Captions section",
  },
  {
    id: "vy-submit",
    label: "GENERATE PIPELINE",
    icon: "🚀",
    detail: "Sequential image upload → /api/upload → /api/generate → job polling → /api/status",
    category: "vybord",
    color: "#6366f1",
    codeRef: "components/CreatePage.tsx — handleSubmit + useEffect status polling",
  },
  {
    id: "vy-auth",
    label: "AUTH HANDLER",
    icon: "🔐",
    detail: "GET /api/me · POST /api/auth/logout · vyb_token cookie management",
    category: "vybord",
    color: "#6366f1",
    codeRef: "app/auth/page.tsx",
  },
  {
    id: "vy-api",
    label: "API LAYER",
    icon: "🌐",
    detail: "/api/me · /api/generate · /api/upload · /api/status/{jobId} · /api/auth/logout",
    category: "vybord",
    color: "#6366f1",
    codeRef: "app/api/*.ts",
  },
];

export default function BrainPanel() {
  const [open, setOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<BrainNode | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "code" | "trace">("map");

  // Cmd/Ctrl+B toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const statusOf = (id: string) => {
    if (id === "vy-create") return "MAPPED — source extracted from live v3.vybord.com";
    if (id === "vy-api") return "PARTIAL — backend API endpoints identified";
    if (id === "vy-auth") return "TODO — auth page pending creation";
    return "MAPPED — vanilla JS converted to React";
  };

  return (
    <>
      {/* Brain Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Open Brain (⌘B)"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          background: "linear-gradient(135deg, #FFD700, #FF4500)",
          color: "#0a0a0f",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(255,215,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🧠
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9997,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: open ? 520 : 0,
          height: "100vh",
          zIndex: 9998,
          background: "#0a0a0f",
          borderLeft: open ? "1px solid rgba(99,102,241,0.3)" : "none",
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        {open && (
          <div style={{ width: 520, height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid rgba(99,102,241,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(99,102,241,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🧠</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#E0E0E0", letterSpacing: "0.05em" }}>
                  VYBORD BRAIN
                </span>
                <span
                  style={{
                    fontSize: 10,
                    background: "rgba(99,102,241,0.2)",
                    color: "#a78bfa",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  v3.7
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9ca3af",
                  borderRadius: 8,
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: "8px 20px",
                borderBottom: "1px solid rgba(99,102,241,0.15)",
              }}
            >
              {(["map", "code", "trace"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background:
                      activeTab === tab
                        ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                        : "rgba(255,255,255,0.05)",
                    color: activeTab === tab ? "#fff" : "#9ca3af",
                  }}
                >
                  {tab === "map" ? "🗺️ Map" : tab === "code" ? "📄 Code" : "📊 Trace"}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
              {activeTab === "map" && (
                <div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12, lineHeight: 1.5 }}>
                    Visual map of the Vybord codebase. Click any node to jump to its code reference.
                  </p>
                  {/* Node grid */}
                  <div
                    style={{
                      background: "rgba(99,102,241,0.04)",
                      border: "1px solid rgba(99,102,241,0.15)",
                      borderRadius: 12,
                      padding: 16,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {VYBORD_NODES.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => { setSelectedNode(node); setActiveTab("code"); }}
                        style={{
                          background: "rgba(99,102,241,0.08)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "rgba(99,102,241,0.18)";
                          el.style.borderColor = "#6366f1";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = "rgba(99,102,241,0.08)";
                          el.style.borderColor = "rgba(99,102,241,0.25)";
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{node.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#E0E0E0", lineHeight: 1.2 }}>
                            {node.label}
                          </div>
                          <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>
                            {node.detail.substring(0, 55)}…
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    {[
                      { label: "Vybord Nodes", value: VYBORD_NODES.length, color: "#6366f1" },
                      { label: "Python Nodes", value: 8, color: "#00BFFF" },
                      { label: "FFmpeg Nodes", value: 9, color: "#FF4500" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 10,
                          padding: "8px 12px",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Embedded Brain Map */}
                  <div
                    style={{
                      marginTop: 12,
                      background: "#0a0a0f",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: 12,
                      overflow: "hidden",
                      height: 300,
                    }}
                  >
                    <AIBrainMap />
                  </div>
                </div>
              )}

              {activeTab === "code" && (
                <div>
                  {selectedNode ? (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 20 }}>{selectedNode.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#E0E0E0" }}>{selectedNode.label}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af" }}>{selectedNode.codeRef}</div>
                        </div>
                        <button
                          onClick={() => setSelectedNode(null)}
                          style={{
                            marginLeft: "auto",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "#9ca3af",
                            borderRadius: 6,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: 11,
                          }}
                        >
                          ✕ Clear
                        </button>
                      </div>
                      <div
                        style={{
                          background: "#111827",
                          border: "1px solid rgba(99,102,241,0.2)",
                          borderRadius: 10,
                          padding: 16,
                          fontSize: 11.5,
                          lineHeight: 1.7,
                          color: "#d1d5db",
                          fontFamily: "monospace",
                        }}
                      >
                        <div style={{ color: "#9ca3af", fontSize: 10, marginBottom: 8 }}>
                          // {selectedNode.detail}
                        </div>
                        <div style={{ color: "#10b981", marginBottom: 4 }}>
                          {/* Module: */} {selectedNode.label}
                        </div>
                        <div style={{ color: "#a78bfa" }}>📄 {selectedNode.codeRef}</div>
                        <div
                          style={{
                            marginTop: 12,
                            padding: "10px 12px",
                            background: "rgba(99,102,241,0.08)",
                            borderRadius: 8,
                            border: "1px solid rgba(99,102,241,0.2)",
                            color: "#60a5fa",
                            fontSize: 10.5,
                          }}
                        >
                          📌 Status: {statusOf(selectedNode.id)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        Select a module to view its code reference
                      </div>
                      <div style={{ fontSize: 11 }}>
                        Go to{" "}
                        <button
                          onClick={() => setActiveTab("map")}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#6366f1",
                            cursor: "pointer",
                            fontSize: 11,
                            textDecoration: "underline",
                          }}
                        >
                          🗺️ Map
                        </button>{" "}
                        and click any Vybord module node
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "trace" && (
                <div>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 12, lineHeight: 1.5 }}>
                    Live execution trace of the Vybord generation pipeline.
                  </p>
                  <div
                    style={{
                      background: "#111827",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: 10,
                      padding: 16,
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                  >
                    {[
                      { step: 1, label: "handleSubmit()", status: "idle", color: "#9ca3af" },
                      { step: 2, label: "→ validateState()", status: "idle", color: "#9ca3af" },
                      { step: 3, label: "→ uploadImages() [sequential]", status: "idle", color: "#9ca3af" },
                      { step: 4, label: "→ POST /api/generate", status: "idle", color: "#9ca3af" },
                      { step: 5, label: "→ poll /api/status/{jobId}", status: "idle", color: "#9ca3af" },
                      { step: 6, label: "→ onComplete() → download", status: "idle", color: "#9ca3af" },
                    ].map((t) => (
                      <div
                        key={t.step}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "6px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "rgba(99,102,241,0.15)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 9,
                            color: "#6366f1",
                            flexShrink: 0,
                          }}
                        >
                          {t.step}
                        </span>
                        <span style={{ color: t.color }}>{t.label}</span>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 9,
                            color: "#9ca3af",
                            background: "rgba(255,255,255,0.05)",
                            padding: "1px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, fontSize: 10, color: "#9ca3af", textAlign: "center" }}>
                      🔴 Red = error · 🟡 Yellow = running · 🟢 Green = complete · ⚪ Gray = idle
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 20px",
                borderTop: "1px solid rgba(99,102,241,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(99,102,241,0.03)",
              }}
            >
              <span style={{ fontSize: 10, color: "#9ca3af" }}>⌘B to toggle · Click nodes to explore</span>
              <span style={{ fontSize: 10, color: "#6366f1", fontWeight: 600 }}>🧠 Brain Active</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
