import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  basePath: string;
}

export function Pagination({ page, totalPages, total, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
      <span className="text-sm text-gray-500">{total} total</span>
      <div className="flex items-center gap-1">
        {page > 1 && (
          <Link
            href={`${basePath}?page=${page - 1}`}
            className="px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            ← Prev
          </Link>
        )}
        {pages.map((p) => (
          <Link
            key={p}
            href={`${basePath}?page=${p}`}
            className={`px-3 py-1.5 text-sm rounded border ${
              p === page
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </Link>
        ))}
        {page < totalPages && (
          <Link
            href={`${basePath}?page=${page + 1}`}
            className="px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
