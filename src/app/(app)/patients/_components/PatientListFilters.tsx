"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

export default function PatientListFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    const sp = new URLSearchParams();
    const q = (fd.get("q") as string).trim();
    const date = fd.get("date") as string;
    if (q) sp.set("q", q);
    if (date) sp.set("date", date);
    sp.set("page", "1");
    router.push(`${pathname}?${sp.toString()}`);
  }

  function clear() {
    router.push(pathname);
  }

  return (
    <form
      ref={formRef}
      onSubmit={apply}
      className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end shadow-sm"
    >
      <div className="w-full sm:w-auto">
        <label className="block text-xs text-gray-500 mb-1">Search</label>
        <input
          name="q"
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Name / number / phone"
          className="w-full sm:w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full sm:w-auto">
        <label className="block text-xs text-gray-500 mb-1">Reg date</label>
        <input
          name="date"
          type="date"
          defaultValue={params.get("date") ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Button type="submit" size="sm">Search</Button>
      {(params.get("q") || params.get("date")) && (
        <Button type="button" variant="secondary" size="sm" onClick={clear}>
          Clear
        </Button>
      )}
    </form>
  );
}
