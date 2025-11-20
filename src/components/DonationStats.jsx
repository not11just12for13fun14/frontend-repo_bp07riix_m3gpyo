import { useEffect, useState } from "react";

export default function DonationStats() {
  const [stats, setStats] = useState({ total_donations: 0, total_amount: 0, recurring_count: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r] = await Promise.all([
          fetch(`${baseUrl}/donations/summary`).then((res) => res.json()),
          fetch(`${baseUrl}/donations`).then((res) => res.json()),
        ]);
        setStats(s);
        setRecent(r);
      } catch (e) {
        setError("Could not load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-slate-300">Loading stats...</div>;
  if (error) return <div className="text-red-300">{error}</div>;

  return (
    <div className="grid sm:grid-cols-3 gap-4 text-white">
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-slate-300 text-sm">Total Raised</p>
        <p className="text-2xl font-bold">${stats.total_amount?.toFixed(2)}</p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-slate-300 text-sm">Donations</p>
        <p className="text-2xl font-bold">{stats.total_donations}</p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-slate-300 text-sm">Monthly Supporters</p>
        <p className="text-2xl font-bold">{stats.recurring_count}</p>
      </div>

      <div className="sm:col-span-3">
        <h4 className="text-white font-semibold mt-6 mb-2">Recent Support</h4>
        <div className="space-y-2 max-h-48 overflow-auto pr-2">
          {recent.length === 0 && <p className="text-slate-300 text-sm">No donations yet.</p>}
          {recent.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex flex-col">
                <span className="text-white font-medium">{d.anonymous ? "Anonymous" : d.name}</span>
                {d.message && <span className="text-slate-300 text-xs">“{d.message}”</span>}
              </div>
              <div className="text-white font-semibold">${Number(d.amount).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
