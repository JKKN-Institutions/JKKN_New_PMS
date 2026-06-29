import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/login");

  if (!session.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-6">You need Admin privileges to access this section.</p>
        <a href="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</a>
      </div>
    );
  }

  return <>{children}</>;
}
