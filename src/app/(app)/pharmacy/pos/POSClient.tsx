"use client";

import { useState, useMemo } from "react";

type StockItem = {
  id: string;
  name: string | null;
  itemCode: string | null;
  measuringUnit: string | null;
};

type CartItem = {
  id: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
};

export function PharmacyPOSClient({ items }: { items: StockItem[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return items.slice(0, 50);
    return items.filter(
      (i) =>
        i.name?.toLowerCase().includes(q) ||
        i.itemCode?.toLowerCase().includes(q)
    );
  }, [items, search]);

  function addToCart(item: StockItem) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name ?? "Unknown",
          unit: item.measuringUnit ?? "pcs",
          price: 0,
          qty: 1,
        },
      ];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  }

  function updatePrice(id: string, price: number) {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, price: Math.max(0, price) } : c))
    );
  }

  function clearCart() {
    setCart([]);
    setDiscount(0);
  }

  function handleCheckout() {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }
    alert(
      `Sale recorded!\nItems: ${cart.length}\nTotal: ₹${net.toFixed(2)}`
    );
    clearCart();
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const discountAmt = Math.min(discount, subtotal);
  const net = subtotal - discountAmt;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: item search + list */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item name or code…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-y-auto max-h-64 divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No items found.
              </p>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.itemCode ?? ""}{" "}
                      {item.measuringUnit ? `· ${item.measuringUnit}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0 ml-4"
                  >
                    + Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Cart</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Unit Price (₹)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-gray-400 text-sm"
                    >
                      Cart is empty — add items from the list above.
                    </td>
                  </tr>
                ) : (
                  cart.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2">
                        <span className="font-medium text-gray-800">
                          {c.name}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {c.unit}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={c.price}
                          onChange={(e) =>
                            updatePrice(c.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(c.id, c.qty - 1)}
                            className="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm leading-none"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">
                            {c.qty}
                          </span>
                          <button
                            onClick={() => updateQty(c.id, c.qty + 1)}
                            className="w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm leading-none"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium">
                        ₹{(c.price * c.qty).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => removeFromCart(c.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Discount (₹)</span>
            <input
              type="number"
              min={0}
              max={subtotal}
              value={discount}
              onChange={(e) =>
                setDiscount(Math.max(0, parseFloat(e.target.value) || 0))
              }
              className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-base">
            <span>Net Total</span>
            <span className="text-blue-700">₹{net.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Checkout — ₹{net.toFixed(2)}
          </button>
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="w-full py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear Cart
          </button>
        </div>

        {cart.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            {cart.reduce((s, c) => s + c.qty, 0)} item(s) in cart
          </p>
        )}
      </div>
    </div>
  );
}
