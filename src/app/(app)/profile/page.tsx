"use client";

import { useFormState } from "react-dom";
import { changePasswordAction } from "@/app/actions/profile";

const initialState: string | null = null;

export default function ProfilePage() {
  const [message, formAction] = useFormState(changePasswordAction, initialState);
  const isSuccess = message === "success";

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">My Profile</h1>
      <p className="text-sm text-gray-500 mb-6">Manage your account settings.</p>

      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Change Password</h2>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            isSuccess
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {isSuccess ? "Password changed successfully." : message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirm_password"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
