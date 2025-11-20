import { useState } from "react";

const presetAmounts = [10, 25, 50, 100];

export default function DonationForm({ onSuccess }) {
  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const normalizeAmount = () => {
    const val = custom !== "" ? parseFloat(custom) : amount;
    if (isNaN(val) || val <= 0) return null;
    return Math.round(val * 100) / 100;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const finalAmount = normalizeAmount();
    if (!finalAmount) {
      setError("Please enter a valid amount");
      return;
    }
    if (!email || !name) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          amount: finalAmount,
          message: message || undefined,
          anonymous,
          recurring,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      onSuccess?.(data);
      setCustom("");
      setMessage("");
      setAnonymous(false);
      setRecurring(false);
      setAmount(25);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Choose an amount</h3>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {presetAmounts.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => { setAmount(amt); setCustom(""); }}
            className={`py-3 rounded-xl border transition-all ${amount === amt && custom === "" ? "bg-blue-600 border-blue-500 text-white" : "bg-white/5 hover:bg-white/10 border-white/10"}`}
          >
            ${amt}
          </button>
        ))}
      </div>

      <label className="block text-sm text-slate-200 mb-1">Or enter a custom amount</label>
      <div className="flex items-center gap-2 mb-6">
        <span className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">$</span>
        <input
          type="number"
          step="0.01"
          min="1"
          inputMode="decimal"
          placeholder="50.00"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-400"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-slate-200 mb-1">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-400"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-200 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-400"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-slate-200 mb-1">Message (optional)</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-400"
            placeholder="Keep up the great work!"
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 select-none">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
            <span className="text-slate-200">Give anonymously</span>
          </label>
          <label className="flex items-center gap-2 select-none">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            <span className="text-slate-200">Make it monthly</span>
          </label>
        </div>
      </div>

      {error && <p className="text-red-300 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-colors font-semibold"
      >
        {loading ? "Processing..." : `Donate $${normalizeAmount() ?? amount}`}
      </button>
      <p className="text-xs text-slate-400 mt-3 text-center">Secure and encrypted. No payment details stored here.</p>
    </form>
  );
}
