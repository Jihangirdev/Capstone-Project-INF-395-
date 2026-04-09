import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { createStartup, getCurrentUser } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = ["Tech", "EcoTech", "HealthTech", "EdTech", "AgriTech", "FinTech", "Other"];
const STAGES = ["IDEA", "MVP", "GROWTH"];

export default function CreateStartupPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Tech",
    stage: "IDEA",
    fundingGoal: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "FOUNDER") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Only FOUNDERs can create startups.</p>
      </div>
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await createStartup({
        ...form,
        fundingGoal: form.fundingGoal ? Number(form.fundingGoal) : null,
      });
      navigate(`/startups/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link to="/startups" className="text-sm text-sky-300 hover:underline">
          ← Back to Startups
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <div className="rounded-2xl bg-sky-400/20 p-3 text-sky-300">
            <PlusCircle className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">Create Startup</h1>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300">{error}</p>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Title *</label>
            <input
              name="title" value={form.title} onChange={handleChange} required
              placeholder="Your startup name"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="Describe your startup..."
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400/50"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Stage</label>
              <select
                name="stage" value={form.stage} onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400/50"
              >
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Funding Goal ($)</label>
            <input
              name="fundingGoal" type="number" value={form.fundingGoal} onChange={handleChange}
              placeholder="e.g. 50000"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400/50"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Startup"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
