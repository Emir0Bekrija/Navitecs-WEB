"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

type Props = {
  value: string;           // current URL (empty string = none)
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — mirrors server limit

export default function ImageUploader({ value, onChange, label, hint, className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    // Basic client-side guards (UX only — server re-validates everything)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are accepted");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image too large (max 10 MB)");
      return;
    }

    setUploading(true);
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("/api/admin/images", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    onChange(data.url as string);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected after removal
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function clear() {
    onChange("");
    setError(null);
  }

  const hasImage = Boolean(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <p className="block text-sm font-medium text-gray-300">{label}</p>
      )}
      {hint && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}

      {/* Preview + clear button when image is set */}
      {hasImage && (
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded image preview"
            className="w-full max-h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur border border-white/20 text-white rounded-lg text-xs hover:bg-white/20 transition-colors"
            >
              <Upload size={12} />
              Replace
            </button>
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 backdrop-blur border border-red-500/30 text-red-300 rounded-lg text-xs hover:bg-red-500/30 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone — shown when no image is set */}
      {!hasImage && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 w-full py-8 border border-dashed rounded-xl transition-colors cursor-pointer
            ${uploading
              ? "border-[#00AEEF]/40 bg-[#00AEEF]/5 cursor-wait"
              : "border-white/15 bg-white/2 hover:border-[#00AEEF]/50 hover:bg-[#00AEEF]/5"
            }`}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="text-[#00AEEF] animate-spin" />
              <span className="text-xs text-gray-400">Uploading…</span>
            </>
          ) : (
            <>
              <ImageIcon size={22} className="text-gray-600" />
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Drop image here or <span className="text-[#00AEEF]">click to browse</span>
                </p>
                <p className="text-xs text-gray-600 mt-0.5">JPEG, PNG, WebP · max 10 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Show URL for reference (read-only) */}
      {hasImage && (
        <p className="text-xs text-gray-600 truncate font-mono">{value}</p>
      )}
    </div>
  );
}
