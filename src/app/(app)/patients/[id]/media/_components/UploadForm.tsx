"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm({ patientId }: { patientId: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fileRef.current?.files?.[0]) return;

    setUploading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/patients/${patientId}/upload`, {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Upload failed");
    }

    setUploading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
    >
      <div className="flex-1 min-w-48">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Select File (jpg, png, pdf — max 10 MB)
        </label>
        <input
          ref={fileRef}
          type="file"
          name="file"
          accept="image/*,.pdf"
          required
          className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white file:border file:border-gray-300 file:text-gray-600 hover:file:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Category
        </label>
        <select
          name="photograph_type"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {["Photo", "X-Ray", "Intraoral", "Extraoral", "Consent", "Other"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </form>
  );
}
