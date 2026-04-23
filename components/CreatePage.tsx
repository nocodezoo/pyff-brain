"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types
interface VideoSettings {
  voice: string;
  template: string;
  fontSize: number;
  textColor: string;
  bgColor: string;
  effect: string;
  music: string;
  musicUrl: string;
  transition: string;
  ratio: string;
  duration: string;
  filter: string;
  imagesPerSlide: number;
  motion: string;
  cta: string;
}

interface UploadedFile {
  name: string;
  data: string;
  _isUrl?: boolean;
}

// ── Helpers
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Voice options
const VOICES = [
  { id: "CwhRBWXzGAHq8TQ4Fs17", label: "Roger" },
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah" },
  { id: "FGY2WhTYpPnrIDTdsKH5", label: "Laura" },
  { id: "SOYHLrjzK2X1ezoPC6cr", label: "Harry" },
  { id: "cgSgspJ2msm6clMCkdW9", label: "Jessica" },
  { id: "IKne3meq5aSn9XLyUdCD", label: "Charlie" },
  { id: "JBFqnCBsd6RMkjVDRZzb", label: "George" },
  { id: "hpp4J3VqNfWAUOO0d1Us", label: "Bella" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Liam" },
  { id: "bIHbv24MWmeRgasZH58o", label: "Will" },
  { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel" },
  { id: "pNInz6obpgDQGcFmaJgB", label: "Adam" },
];

// ── Option grid buttons
const TEMPLATES = ["word-focus", "explosive", "classic", "minimalist", "hype", "retro-gaming"];
const TEMPLATE_LABELS: Record<string, string> = {
  "word-focus": "Word Focus",
  explosive: "Explosive",
  classic: "Classic",
  minimalist: "Minimal",
  hype: "Hype",
  "retro-gaming": "Retro",
};

const EFFECTS = ["random", "zoom", "slow", "vintage", "glow", "contrast"];
const EFFECT_LABELS: Record<string, string> = {
  random: "🔀 Random",
  zoom: "🔍 Zoom",
  slow: "🐢 Slow",
  vintage: "📺 Vintage",
  glow: "✨ Glow",
  contrast: "◐ Contrast",
};

const TRANSITIONS = ["fade", "slide", "zoom", "none", "blur", "slideup"];
const TRANSITION_LABELS: Record<string, string> = {
  fade: "Fade",
  slide: "Slide",
  zoom: "Zoom",
  none: "Cut",
  blur: "Blur",
  slideup: "Slide Up",
};

const MUSIC_OPTS = ["none", "upbeat", "chill", "cinematic", "positive"];
const MUSIC_LABELS: Record<string, string> = {
  none: "🔇 None",
  upbeat: "🎵 Upbeat",
  chill: "🎵 Chill",
  cinematic: "🎵 Cinematic",
  positive: "🎵 Positive",
};

const TEXT_COLORS = ["#FF69B4", "#FFFFFF", "#FFFF00", "#00FF88", "#FF4444", "#00CCFF", "#FF9500", "transparent"];
const BG_COLORS = ["#000000", "#1a1a2e", "#2d1b4e", "#0a1628", "#1a0a0a", "transparent"];

// ── Image grid modal
function ImageGridModal({
  open,
  onClose,
  images,
  selected,
  onConfirm,
  onSelectAll,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  selected: Record<string, boolean>;
  onConfirm: (urls: string[]) => void;
  onSelectAll: () => void;
}) {
  const [localSelected, setLocalSelected] = useState<Record<string, boolean>>({});
  const MAX_IMAGES = 15;

  useEffect(() => {
    setLocalSelected({ ...selected });
  }, [selected, images]);

  if (!open) return null;

  const toggle = (url: string) => {
    setLocalSelected((prev) => {
      const next = { ...prev };
      if (next[url]) {
        delete next[url];
      } else {
        if (Object.keys(next).length >= MAX_IMAGES) return prev;
        next[url] = true;
      }
      return next;
    });
  };

  const count = Object.keys(localSelected).length;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(26,26,46,0.85)",
        zIndex: 9999,
        overflow: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#F5F7FA",
          border: "1px solid #DDE4ED",
          borderRadius: 16,
          maxWidth: 900,
          margin: "40px auto",
          padding: 28,
          color: "#1a1a2e",
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "#778899",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h2 style={{ fontSize: "1.3rem", marginBottom: 16 }}>Select Listing Images</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 8,
            maxHeight: 420,
            overflowY: "auto",
            marginTop: 12,
          }}
        >
          {images.map((url, i) => (
            <div
              key={url}
              onClick={() => toggle(url)}
              style={{
                position: "relative",
                cursor: "pointer",
                padding: 4,
                outline: localSelected[url] ? "3px solid #B0E0E6" : undefined,
                borderRadius: 8,
              }}
            >
              <img
                src={url}
                alt=""
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: 6,
                  opacity: localSelected[url] ? 1 : 0.8,
                }}
                onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.3")}
              />
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(176,224,230,0.9)",
                  color: "#1a1a2e",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <button onClick={onSelectAll}>Select All</button>
          <button
            className="primary"
            onClick={() => onConfirm(Object.keys(localSelected))}
            disabled={count === 0}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "1px solid #DDE4ED",
              background: count > 0 ? "linear-gradient(135deg, #B0E0E6, #E6E6FA)" : "#fff",
              color: "#1a1a2e",
              cursor: count === 0 ? "not-allowed" : "pointer",
              opacity: count === 0 ? 0.4 : 1,
              fontWeight: 600,
            }}
          >
            Confirm ({count})
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component
export default function CreatePage() {
  // ── State
  const [settings, setSettings] = useState<VideoSettings>({
    voice: "CwhRBWXzGAHq8TQ4Fs17",
    template: "word-focus",
    fontSize: 55,
    textColor: "#FF69B4",
    bgColor: "#000000",
    effect: "random",
    music: "none",
    musicUrl: "",
    transition: "fade",
    ratio: "16:9",
    duration: "60",
    filter: "normal",
    imagesPerSlide: 1,
    motion: "cinematic",
    cta: "Call today to schedule your private showing",
  });

  const [listingUrl, setListingUrl] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [lookupStatus, setLookupStatus] = useState<{ msg: string; type: "err" | "ok" | "info" } | null>(null);
  const [status, setStatus] = useState<{ msg: string; type: "err" | "ok" | "info" } | null>(null);
  const [imgCount, setImgCount] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Image handling
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [scanTab, setScanTab] = useState<"url" | "paste">("url");
  const [pasteHtml, setPasteHtml] = useState("");
  const [manualUrls, setManualUrls] = useState("");
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>({});
  const [modalProgress, setModalProgress] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterResults, setFilterResults] = useState("");

  // Property details from lookup
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [script, setScript] = useState("");

  // Music URL
  const [musicUrlInput, setMusicUrlInput] = useState("");

  // ── Selection helpers
  const selectOpt = useCallback(
    (key: keyof VideoSettings, val: string, groupRef: React.RefObject<HTMLDivElement | null>) => {
      setSettings((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  // ── Fetch listing data
  const parseListingData = useCallback((html: string, baseUrl: string) => {
    const data: {
      images: string[];
      address: string;
      price: string;
      beds: string;
      baths: string;
      sqft: string;
    } = {
      images: [],
      address: "",
      price: "",
      beds: "",
      baths: "",
      sqft: "",
    };

    const resolveUrl = (u: string, base: string) => {
      if (!u || !base) return u;
      if (
        u.startsWith("data:") ||
        u.startsWith("blob:") ||
        u.startsWith("http://") ||
        u.startsWith("https://") ||
        u.startsWith("//")
      )
        return u;
      if (u.startsWith("/")) {
        const m = base.match(/^(https?:\/\/[^/]+)/);
        return m ? m[1] + u : u;
      }
      return base.replace(/\/[^/]*$/, "/") + u;
    };

    try {
      const jsonld = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
      for (const script of jsonld) {
        try {
          const obj = JSON.parse(script.replace(/<[^>]+>/g, ""));
          if (obj.address) {
            data.address = obj.address.streetAddress || "";
            if (obj.address.addressLocality) data.address += ", " + obj.address.addressLocality;
            if (obj.address.addressRegion) data.address += ", " + obj.address.addressRegion;
            if (obj.address.postalCode) data.address += " " + obj.address.postalCode;
            data.address = data.address.trim();
          }
          if (obj.price) data.price = obj.price;
          if (obj.numberOfBedrooms) data.beds = obj.numberOfBedrooms + " bed";
          if (obj.floorSize) data.sqft = obj.floorSize.replace(/[^0-9,]/g, "") + " sq ft";
          if (obj.image) {
            data.images = Array.isArray(obj.image) ? obj.image.slice(0, 15) : [obj.image];
          }
        } catch {}
      }
    } catch {}

    if (!data.address) {
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        const title = titleMatch[1].replace(/\s*\|\s*/g, " ").trim();
        const parts = title.split(" ");
        for (let j = 0; j < parts.length; j++) {
          if (parts[j].length === 2 && parts[j] === parts[j].toUpperCase()) {
            data.address = parts.slice(0, j).join(" ");
            break;
          }
        }
      }
    }

    const allUrls =
      html.match(/https?:\/\/[^\"'\\s>)]+\.(jpg|jpeg|png|webp)[^\"')]*|\/[^\"'\\s>)]+\.(jpg|jpeg|png|webp)[^\"')]*/gi) || [];
    const seen: Record<string, boolean> = {};
    const urls: string[] = [];
    for (const raw of allUrls) {
      const u = resolveUrl(raw, baseUrl);
      if (!seen[u] && u.match(/\.(jpg|jpeg|png|webp)/i) && u.length < 2000) {
        seen[u] = true;
        urls.push(u);
      }
    }
    urls.sort((a, b) => b.length - a.length);
    const normalized: Record<string, boolean> = {};
    const unique: string[] = [];
    for (const u of urls) {
      const norm = u.split("?")[0].replace(/\/$/, "");
      if (!normalized[norm]) {
        normalized[norm] = true;
        unique.push(u);
      }
    }
    data.images = unique.slice(0, 30);

    return data;
  }, []);

  const fetchPropertyDetails = useCallback(async () => {
    if (!listingUrl) {
      setLookupStatus({ msg: "⚠️ Enter a listing URL first", type: "err" });
      return;
    }
    if (!listingUrl.startsWith("http")) {
      setLookupStatus({ msg: "⚠️ Enter a full URL starting with http", type: "err" });
      return;
    }
    setLookupStatus({ msg: "Looking up property details…", type: "info" });
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: listingUrl }),
      });
      const data = await res.json();
      if (data.error) {
        setLookupStatus({ msg: "⚠️ " + data.error, type: "err" });
        return;
      }
      if (data.address) setAddress(data.address);
      if (data.price) setPrice(" $" + data.price);
      if (data.beds) setBeds(data.beds);
      if (data.baths) setBaths(data.baths);
      if (data.sqft) setSqft(data.sqft);
      if (data.script) setScript(data.script);
      const details = [data.address, data.price, data.beds, data.baths].filter(Boolean).join(" · ");
      setLookupStatus({ msg: "✅ " + (details || "Property details loaded"), type: "ok" });
    } catch (e: unknown) {
      setLookupStatus({ msg: "⚠️ Connection error: " + (e instanceof Error ? e.message : String(e)), type: "err" });
    }
  }, [listingUrl]);

  // ── Open scan modal
  const openScanModal = useCallback(() => {
    if (!listingUrl && !pasteHtml) {
      setStatus({ msg: "⚠️ Enter the listing URL in the URL field first.", type: "err" });
      return;
    }
    setModalOpen(true);
    setSelectedImages({});
    setFetchedImages([]);
    if (listingUrl) {
      fetch("/api/fetch-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: listingUrl }),
      })
        .then((r) => r.text())
        .then((html) => {
          const data = parseListingData(html, listingUrl);
          setFetchedImages(data.images);
          if (data.address) setAddress(data.address);
          if (data.price) setPrice(" $" + data.price);
          if (data.beds) setBeds(data.beds);
          if (data.baths) setBaths(data.baths);
          if (data.sqft) setSqft(data.sqft);
          if (data.images.length === 0) {
            setStatus({ msg: "⚠️ No images found.", type: "err" });
          } else {
            setStatus({ msg: "✅ Found " + data.images.length + " images!", type: "info" });
          }
        })
        .catch((e: unknown) => {
          setStatus({ msg: "⚠️ Fetch failed: " + (e instanceof Error ? e.message : String(e)), type: "err" });
        });
    }
  }, [listingUrl, pasteHtml, parseListingData]);

  // ── Handle image file upload
  const handleImgUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newFiles: UploadedFile[] = [];
    let completed = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newFiles.push({
          name: file.name,
          data: (e.target?.result as string)?.split(",")[1] || "",
        });
        completed++;
        if (completed === files.length) {
          setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 15));
          setImgCount(newFiles.length + " image(s) selected");
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // ── Confirm image selection from modal
  const confirmSelection = useCallback(
    async (urls: string[]) => {
      if (urls.length === 0) return;
      setModalProgress("Starting...");
      const CONCURRENT = 3;
      const queue = [...urls];
      const results: UploadedFile[] = [];
      let active = 0;
      let done = 0;
      let failed = 0;
      const total = urls.length;

      const startNext = () => {
        while (active < CONCURRENT && queue.length > 0) {
          const imgUrl = queue.shift()!;
          active++;
          const corsSafe = /cloudfront\.net|cloudinary\.com|imgix\.net|photobucket\.com/i.test(imgUrl);
          const proxy = "https://vybord.com/api/proxy-img.php?url=" + encodeURIComponent(imgUrl);

          const fetchPromise = corsSafe
            ? fetch(imgUrl, { mode: "cors" })
                .then((r) => {
                  if (!r.ok) throw new Error("HTTP " + r.status);
                  return r.blob();
                })
                .then(
                  (blob) =>
                    new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.readAsDataURL(blob);
                    })
                )
            : fetch(proxy)
                .then((r) => {
                  if (!r.ok) throw new Error("Proxy HTTP " + r.status);
                  return r.json().catch(() => null);
                })
                .then((data) => {
                  if (data && data.data) return "data:image/" + (data.ext || "jpg") + ";base64," + data.data;
                  throw new Error(data && data.error ? data.error : "Proxy returned no data");
                });

          fetchPromise
            .then((dataUrl) => {
              const extMatch = imgUrl.match(/\.(jpg|jpeg|png|webp)/i);
              const ext = extMatch ? extMatch[0].replace(".", "").replace("jpeg", "jpg") : "jpg";
              results.push({
                name: "image_" + String(done + 1).padStart(3, "0") + "." + ext,
                data: dataUrl,
              });
            })
            .catch(() => {
              failed++;
              results.push({
                name: "image_" + String(done + 1).padStart(3, "0") + ".jpg",
                data: imgUrl,
                _isUrl: true,
              });
            })
            .finally(() => {
              done++;
              active--;
              setModalProgress(
                "Downloaded " + done + "/" + total + (failed > 0 ? " (" + failed + " failed)" : "") + "..."
              );
              if (queue.length === 0 && active === 0) {
                setUploadedFiles(results);
                setImgCount(results.length + " image(s) selected");
                setStatus(
                  { msg: results.length + " images ready" + (failed > 0 ? " (" + failed + " failed)." : "."), type: "info" },
                  )
                setModalOpen(false);
              } else {
                startNext();
              }
            });
        }
      };

      startNext();
    },
    []
  );

  // ── Compress for upload
  const compressForUpload = useCallback((dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 800;
        let w = img.width,
          h = img.height;
        if (w > maxW) {
          h = Math.round((h * maxW) / w);
          w = maxW;
        } else if (h > maxW) {
          w = Math.round((w * maxW) / h);
          h = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = dataUrl.startsWith("data:") ? dataUrl : "data:image/jpeg;base64," + dataUrl;
    });
  }, []);

  // ── Submit / generate
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsGenerating(true);
      setStatus({ msg: "⏳ Sending...", type: "info" });

      const total = uploadedFiles.length;
      if (total === 0) {
        setStatus({ msg: "⚠️ No images loaded. Click Scan first, then Confirm.", type: "err" });
        setIsGenerating(false);
        return;
      }

      const priceClean = price.replace(/[^0-9,]/g, "");
      const priceVal = /^\d/.test(priceClean) ? priceClean : "";

      const metaPayload = {
        url: listingUrl,
        settings: {
          voice: settings.voice,
          template: settings.template,
          fontSize: settings.fontSize,
          textColor: settings.textColor.replace("#", ""),
          effect: settings.effect,
          filter: settings.filter,
          motion: settings.motion,
          music: settings.music,
          musicUrl: settings.musicUrl || musicUrlInput,
          transition: settings.transition,
          ratio: settings.ratio,
          duration: settings.duration,
          address: address,
          price: priceVal,
          beds,
          baths,
          sqft,
          script,
        },
        address,
        price: priceVal,
        beds,
        baths,
        sqft,
        userEmail,
      };

      let jobId: string | null = null;
      try {
        const res = await fetch("/api/send.php", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metaPayload),
        });
        if (!res.ok) {
          const text = await res.text();
          setStatus({ msg: "⚠️ Server error " + res.status + ": " + text.slice(0, 100), type: "err" });
          setIsGenerating(false);
          return;
        }
        const result = await res.json();
        if (result.error) {
          setStatus({ msg: "⚠️ " + result.error, type: "err" });
          setIsGenerating(false);
          return;
        }
        jobId = result.job_id;
        if (!jobId) {
          setStatus({ msg: "⚠️ No job_id from server (cf/Rate limit?)", type: "err" });
          setIsGenerating(false);
          return;
        }

        for (let i = 0; i < total; i++) {
          setStatus({ msg: "📤 Uploading image " + (i + 1) + "/" + total + "...", type: "info" });
          const compressed = await compressForUpload(uploadedFiles[i].data);
          const b64 = compressed.split(",")[1];
          const r = await fetch("/api/upload-images/" + jobId, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              images: [
                {
                  name: uploadedFiles[i].name || "img" + (i + 1) + ".jpg",
                  data: b64,
                },
              ],
            }),
          }).then((res) => res.json());
          if (r.error) {
            setStatus({ msg: "⚠️ " + r.error, type: "err" });
            setIsGenerating(false);
            return;
          }
        }

        setStatus({ msg: "🎬 Building video...", type: "info" });
        await fetch("/api/build/" + jobId, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceJobId: jobId }),
        }).then((res) => res.json());

        window.location.href = "/review/" + jobId;
      } catch (err: unknown) {
        setStatus({ msg: "⚠️ Network error: " + (err instanceof Error ? err.message : String(err)), type: "err" });
        setIsGenerating(false);
      }
    },
    [uploadedFiles, listingUrl, settings, address, price, beds, baths, sqft, script, userEmail, musicUrlInput, compressForUpload]
  );

  // ── Logout
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
      const trimmed = c.trim();
      if (trimmed.startsWith("vyb_token=")) {
        document.cookie = trimmed.split("=")[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure";
      }
    }
    window.location.href = "/?t=" + Date.now();
  }, []);

  // ── Opt button helper
  const OptBtn = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn("opt-btn", selected ? "sel" : "")}
    >
      {label}
    </button>
  );

  // ── Swatch helper
  const Swatch = ({
    color,
    selected,
    onClick,
    transparent,
  }: {
    color: string;
    selected: boolean;
    onClick: () => void;
    transparent?: boolean;
  }) => (
    <div
      onClick={onClick}
      className={cn("swatch", selected ? "sel" : "")}
      style={{
        background: transparent ? "rgba(255,255,255,0.13)" : color,
        border: transparent ? "1px dashed #778899" : undefined,
      }}
    />
  );

  // ── Voice button helper
  const VoiceBtn = ({
    id,
    label,
    selected,
    onClick,
  }: {
    id: string;
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick} className={cn("voice-btn", selected ? "sel" : "")}>
      🎤 {label}
    </button>
  );

  return (
    <>
      {/* ── Image Grid Modal */}
      <ImageGridModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        images={fetchedImages}
        selected={selectedImages}
        onConfirm={(urls) => {
          const sel: Record<string, boolean> = {};
          urls.forEach((u) => (sel[u] = true));
          setSelectedImages(sel);
          confirmSelection(urls);
        }}
        onSelectAll={() => {
          const sel: Record<string, boolean> = {};
          fetchedImages.slice(0, 15).forEach((u) => (sel[u] = true));
          setSelectedImages(sel);
        }}
      />

      <div className="content">
        {/* ── Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#DDE4ED]">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/create" className="logo">
              <div className="logo-icon">V</div>
              <span className="logo-text gradient-text">Vybord</span>
            </a>
            <div className="flex items-center gap-3">
              <span
                style={{
                  background: "#F5F7FA",
                  border: "1px solid #DDE4ED",
                  color: "#778899",
                  borderRadius: 6,
                  padding: "0.15rem 0.6rem",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                v3.7
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          {/* ── Page header */}
          <div className="mb-6">
            <div className="accent-bar" />
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem,5vw,2.2rem)",
                fontWeight: 600,
                lineHeight: 1.2,
                marginBottom: "0.4rem",
                color: "#1a1a2e",
              }}
            >
              Create Your Video
            </h1>
            <p className="text-[#778899] text-sm">Configure every detail. We'll handle the rest.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* ── Step 1: Property */}
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="step-badge">1</div>
                <div className="step-title">Property</div>
              </div>
              <div className="space-y-3">
                {/* Listing URL */}
                <div>
                  <label className="section-label">Listing URL</label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      id="listing-url"
                      className="form-input"
                      placeholder="https://www.corcoran.com/... (listing URL)"
                      style={{ flex: 1 }}
                      value={listingUrl}
                      onChange={(e) => setListingUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={fetchPropertyDetails}
                      style={{
                        background: "linear-gradient(135deg, #B0E0E6, #E6E6FA)",
                        color: "#1a1a2e",
                        border: "none",
                        borderRadius: "0.75rem",
                        padding: "0.7rem 1.1rem",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      &#128269; Lookup
                    </button>
                  </div>
                  <div id="address-display" style={{ color: "#1a1a2e", fontSize: "0.9rem", marginTop: 4, fontWeight: 600 }}>
                    {address}
                  </div>
                  <div id="price-display" style={{ color: "#00aa66", fontSize: "0.85rem", marginTop: 2 }}>
                    {price}
                  </div>
                  <div
                    id="lookup-status"
                    style={{
                      fontSize: "0.82rem",
                      marginTop: 4,
                      display: lookupStatus ? "block" : "none",
                      color:
                        lookupStatus?.type === "err"
                          ? "#dc2626"
                          : lookupStatus?.type === "ok"
                            ? "#00aa66"
                            : "#778899",
                    }}
                  >
                    {lookupStatus?.msg}
                  </div>
                  <input type="hidden" id="m-beds" value={beds} />
                  <input type="hidden" id="m-baths" value={baths} />
                  <input type="hidden" id="m-sqft" value={sqft} />
                  <input type="hidden" id="m-script" value={script} />
                  <div style={{ marginTop: "0.75rem" }}>
                    <button type="button" className="btn-fetch" onClick={openScanModal} style={{ width: "100%" }}>
                      &#128247; Scan / Paste Images &amp; Details
                    </button>
                  </div>
                </div>

                {/* Or Upload Images */}
                <div>
                  <label className="section-label">Or Upload Images</label>
                  <input
                    type="file"
                    id="image-files"
                    className="form-input"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImgUpload(e.target.files)}
                  />
                  <div id="img-count" className="section-label" style={{ color: "#778899", fontSize: "0.8rem", marginTop: 4 }}>
                    {imgCount}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="section-label">Your Email (for delivery)</label>
                  <input
                    type="email"
                    id="user-email"
                    className="form-input"
                    placeholder="you@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ── Step 2: AI Voice */}
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="step-badge">2</div>
                <div className="step-title">AI Voice</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {VOICES.map((v) => (
                  <VoiceBtn
                    key={v.id}
                    id={v.id}
                    label={v.label}
                    selected={settings.voice === v.id}
                    onClick={() => setSettings((s) => ({ ...s, voice: v.id }))}
                  />
                ))}
              </div>
            </div>

            {/* ── Step 3: Captions */}
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="step-badge">3</div>
                <div className="step-title">Captions (PyCaps)</div>
              </div>
              <div className="space-y-4">
                {/* Template */}
                <div>
                  <label className="section-label">Template</label>
                  <div className="opt-grid">
                    {TEMPLATES.map((t) => (
                      <OptBtn
                        key={t}
                        label={TEMPLATE_LABELS[t]}
                        selected={settings.template === t}
                        onClick={() => setSettings((s) => ({ ...s, template: t }))}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="section-label">
                    Font Size — <span id="fs-val">{settings.fontSize}</span>px
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#778899]">20</span>
                    <input
                      type="range"
                      id="font-size"
                      min="20"
                      max="80"
                      value={settings.fontSize}
                      onInput={(e) =>
                        setSettings((s) => ({
                          ...s,
                          fontSize: parseInt((e.target as HTMLInputElement).value),
                        }))
                      }
                    />
                    <span className="text-xs text-[#778899]">80</span>
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="section-label">Text Color</label>
                  <div className="color-row">
                    {TEXT_COLORS.map((c) => (
                      <Swatch
                        key={c}
                        color={c}
                        selected={settings.textColor === c}
                        onClick={() => setSettings((s) => ({ ...s, textColor: c }))}
                        transparent={c === "transparent"}
                      />
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="section-label">Background</label>
                  <div className="color-row">
                    {BG_COLORS.map((c) => (
                      <Swatch
                        key={c}
                        color={c}
                        selected={settings.bgColor === c}
                        onClick={() => setSettings((s) => ({ ...s, bgColor: c }))}
                        transparent={c === "transparent"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Step 4: Video Settings */}
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="step-badge">4</div>
                <div className="step-title">Video Settings</div>
              </div>
              <div className="space-y-3">
                {/* Ratio */}
                <div>
                  <label className="section-label">Format / Ratio</label>
                  <select
                    id="ratio"
                    className="form-input"
                    value={settings.ratio}
                    onChange={(e) => setSettings((s) => ({ ...s, ratio: e.target.value }))}
                  >
                    <option value="16:9">16:9 — YouTube / Web</option>
                    <option value="9:16">9:16 — TikTok / Reels</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="section-label">Duration</label>
                  <select
                    id="duration"
                    className="form-input"
                    value={settings.duration}
                    onChange={(e) => setSettings((s) => ({ ...s, duration: e.target.value }))}
                  >
                    <option value="15">15 seconds</option>
                    <option value="40">40 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                </div>

                {/* Filter */}
                <div>
                  <label className="section-label">Filter</label>
                  <select
                    id="filter-select"
                    className="form-input"
                    value={settings.filter}
                    onChange={(e) => setSettings((s) => ({ ...s, filter: e.target.value }))}
                  >
                    <option value="normal">Normal (no filter)</option>
                    <option value="nashville">Nashville</option>
                    <option value="earlybird">Earlybird</option>
                    <option value="brannan">Brannan</option>
                    <option value="lofi">Lo-Fi</option>
                    <option value="1977">1977</option>
                    <option value="amaro">Amaro</option>
                    <option value="hudson">Hudson</option>
                    <option value="inkwell">Inkwell</option>
                  </select>
                </div>

                {/* Effect */}
                <div>
                  <label className="section-label">Image Effect</label>
                  <div className="opt-grid">
                    {EFFECTS.map((e) => (
                      <OptBtn
                        key={e}
                        label={EFFECT_LABELS[e]}
                        selected={settings.effect === e}
                        onClick={() => setSettings((s) => ({ ...s, effect: e }))}
                      />
                    ))}
                  </div>
                </div>

                {/* Transition */}
                <div>
                  <label className="section-label">Transition</label>
                  <div className="opt-grid">
                    {TRANSITIONS.map((t) => (
                      <OptBtn
                        key={t}
                        label={TRANSITION_LABELS[t]}
                        selected={settings.transition === t}
                        onClick={() => setSettings((s) => ({ ...s, transition: t }))}
                      />
                    ))}
                  </div>
                </div>

                {/* Images Per Slide */}
                <div>
                  <label className="section-label">Images Per Slide</label>
                  <select
                    id="imagesPerSlide"
                    className="form-input"
                    value={settings.imagesPerSlide}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, imagesPerSlide: parseInt(e.target.value) }))
                    }
                  >
                    <option value="1">1 image per slide</option>
                    <option value="2">2 images per slide</option>
                    <option value="3">3 images per slide</option>
                  </select>
                </div>

                {/* Motion */}
                <div>
                  <label className="section-label">Motion</label>
                  <select
                    id="motion-select"
                    className="form-input"
                    value={settings.motion}
                    onChange={(e) => setSettings((s) => ({ ...s, motion: e.target.value }))}
                  >
                    <option value="cinematic">Cinematic Drift (default)</option>
                    <option value="zoom_in">Zoom In</option>
                    <option value="zoom_out">Zoom Out</option>
                    <option value="pan_left">Pan Left</option>
                    <option value="pan_right">Pan Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Step 5: Music */}
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="step-badge">5</div>
                <div className="step-title">Background Music</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="section-label">Music Preset</label>
                  <div className="opt-grid">
                    {MUSIC_OPTS.map((m) => (
                      <OptBtn
                        key={m}
                        label={MUSIC_LABELS[m]}
                        selected={settings.music === m}
                        onClick={() => setSettings((s) => ({ ...s, music: m }))}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="section-label">Or Music URL</label>
                  <input
                    type="text"
                    id="music-url"
                    className="form-input"
                    placeholder="https://...mp3"
                    value={musicUrlInput}
                    onChange={(e) => {
                      setMusicUrlInput(e.target.value);
                      setSettings((s) => ({ ...s, musicUrl: e.target.value }));
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── Step 6: CTA */}
            <div className="section-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="step-badge">6</div>
                <div className="step-title">Call to Action</div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="section-label">CTA Button Text</label>
                  <input
                    type="text"
                    id="cta-text"
                    className="form-input"
                    placeholder="Schedule a Tour"
                    value={settings.cta}
                    onChange={(e) => setSettings((s) => ({ ...s, cta: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* ── Generate */}
            <button
              type="submit"
              className="btn-generate"
              id="gen-btn"
              disabled={isGenerating}
            >
              {isGenerating ? "⏳ Sending..." : "🚀 Generate Video"}
            </button>

            {/* ── Status */}
            {status && (
              <div
                id="status"
                className={`status-box ${status.type}`}
                style={{ display: "block", visibility: "visible", marginTop: "1rem" }}
              >
                {status.msg}
              </div>
            )}

            <div className="mt-6 text-center text-xs text-[#DDE4ED]">
              By generating, you agree our AI may process this content.
            </div>
          </form>
        </main>

        <footer className="text-center py-8 text-xs text-[#DDE4ED] mt-8">
          © 2026 Vybord · Built with OpenClaw
        </footer>
      </div>

      <style>{`
        :root { --accent: #B0E0E6; --accent2: #E6E6FA; --green: #00aa66; --text: #1a1a2e; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #FFFFFF; color: var(--text); min-height: 100vh; }
        .content { position: relative; z-index: 1; }
        .gradient-text { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .section-card { background: #F5F7FA; border: 1px solid #DDE4ED; border-radius: 1.25rem; padding: 1.5rem; margin-bottom: 1.25rem; }
        .step-badge { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; flex-shrink: 0; color: #1a1a2e; }
        .step-title { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
        .form-input { background: #FFFFFF; border: 1px solid #DDE4ED; border-radius: 0.75rem; padding: 0.8rem 1rem; color: #1a1a2e; width: 100%; font-size: 0.9rem; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif; }
        .form-input:focus { border-color: var(--accent); outline: none; }
        .form-input::placeholder { color: #778899; }
        .opt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .opt-btn { padding: 0.6rem 0.5rem; border: 1px solid #DDE4ED; border-radius: 0.6rem; text-align: center; cursor: pointer; transition: all 0.2s; font-size: 0.8rem; color: #778899; background: #FFFFFF; }
        .opt-btn:hover { border-color: var(--accent); color: #1a1a2e; }
        .opt-btn.sel { border-color: var(--accent); background: rgba(176,224,230,0.2); color: #1a1a2e; }
        .color-row { display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center; }
        .swatch { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s; flex-shrink: 0; }
        .swatch:hover { border-color: #778899; }
        .swatch.sel { border-color: #1a1a2e; }
        .range-val { font-size: 0.8rem; color: #778899; min-width: 2rem; text-align: right; }
        input[type=range] { -webkit-appearance: none; height: 6px; background: #DDE4ED; border-radius: 3px; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 50%; cursor: pointer; }
        select.form-input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23778899' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.8rem center; padding-right: 2.2rem; }
        .btn-fetch { white-space: nowrap; padding: 0.5rem 1rem; border-radius: 0.6rem; border: 1px solid #B0E0E6; background: rgba(176,224,230,0.15); color: #1a1a2e; cursor: pointer; font-size: 0.85rem; }
        .btn-generate { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #1a1a2e; font-size: 1.1rem; font-weight: 700; border: none; border-radius: 1rem; cursor: pointer; transition: opacity 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-generate:hover { opacity: 0.85; }
        .btn-generate:disabled { opacity: 0.4; cursor: not-allowed; }
        .status-box { margin-top: 1rem; padding: 1rem; border-radius: 0.75rem; font-size: 0.88rem; display: none; background: #F5F7FA; border: 1px solid #DDE4ED; color: #1a1a2e; }
        .status-box.ok { border-color: #00aa66; color: #00aa66; }
        .status-box.err { border-color: #dc2626; color: #dc2626; }
        .status-box.info { border-color: var(--accent2); color: #778899; }
        .voice-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.8rem; border: 1px solid #DDE4ED; border-radius: 0.6rem; cursor: pointer; transition: all 0.2s; font-size: 0.82rem; color: #778899; background: #FFFFFF; }
        .voice-btn:hover { border-color: var(--accent); color: #1a1a2e; }
        .voice-btn.sel { border-color: var(--accent); background: rgba(176,224,230,0.2); color: #1a1a2e; }
        .section-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #778899; margin-bottom: 0.75rem; font-weight: 600; }
        .logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
        .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; }
        .logo-text { font-weight: 700; font-size: 1.1rem; }
        .accent-bar { width: 40px; height: 3px; background: linear-gradient(90deg, var(--accent), var(--accent2)); border-radius: 2px; margin-bottom: 0.75rem; }
      `}</style>
    </>
  );
}