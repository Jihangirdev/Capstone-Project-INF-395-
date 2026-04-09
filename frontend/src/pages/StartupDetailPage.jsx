import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, TrendingUp, Heart, Send } from "lucide-react";
import { getStartup, applyToStartup, toggleFavorite, getCurrentUser } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STAGE_COLORS = {
  IDEA: "text-purple-300 bg-purple-400/20",
  MVP: "text-yellow-300 bg-yellow-400/20",
  GROWTH: "text-green-300 bg-green-400/20",
};

export default function StartupDetailPage() {
  const { id } = useParams();
  const user = getCurrentUser();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyForm, setApplyForm] = useState({ type: "AS_DEVELOPER", message: "" });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState("");
  const [applyError, setApplyError] = useState("");
  const [favMsg, setFavMsg] = useState("");

  useEffect(() => {
    fetchStartup();
  }, [id]);

  async function fetchStartup() {
    try {
      const data = await getStartup(id);
      setStartup(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(e) {
    e.preventDefault();
    setApplyError("");
    setApplySuccess("");
    setApplyLoading(true);
    try {
      await applyToStartup(id, applyForm.type, applyForm.message);
      setApplySuccess("Application submitted successfully!");
      setApplyForm({ type: "AS_DEVELOPER", message: "" });
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplyLoading(false);
    }
  }

  async function handleFavorite() {
    try {
      const msg = await toggleFavorite(id);
      setFavMsg(msg);
      setTimeout(() => setFavMsg(""), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Startup not found.</p>
      </div>
    );
  }

  const isOwner = user && startup.ownerId === user.id;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link to="/startups" className="text-sm text-sky-300 hover:underline">
          ← Back to Startups
        </Link>

        {/* Header */}
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-sky-300">{startup.category}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STAGE_COLORS[startup.stage]}`}>
                  {startup.stage}
                </span>
              </div>
              <h1 className="mt-3 text-4xl font-bold">{startup.title}</h1>
              <p className="mt-2 text-slate-400">by {startup.ownerName}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Eye className="h-4 w-4" />
                {startup.views} views
              </div>
              {user && !isOwner && (
                <button
                  onClick={handleFavorite}
                  className="flex items-center gap-1 rounded-2xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
                >
                  <Heart className="h-4 w-4 text-sky-300" />
                  {favMsg || "Favorite"}
                </button>
              )}
            </div>
          </div>

          <p className="mt-6 leading-7 text-slate-300">{startup.description}</p>

          {/* Funding */}
          {startup.fundingGoal && (
            <div className="mt-6 rounded-2xl bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp className="h-4 w-4" />
                Funding
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl font-bold text-white">
                  ${startup.currentFunding?.toLocaleString()}
                </span>
                <span className="text-slate-400">
                  / ${startup.fundingGoal?.toLocaleString()} goal
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-700">
                <div
                  className="h-2 rounded-full bg-sky-400 transition-all"
                  style={{
                    width: `${Math.min((startup.currentFunding / startup.fundingGoal) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Apply form — только для не-owner авторизованных */}
        {user && !isOwner && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-400/20 p-2 text-sky-300">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Apply to this Startup</h2>
            </div>

            {applySuccess && (
              <p className="mt-4 rounded-xl bg-green-500/20 px-4 py-2 text-sm text-green-300">{applySuccess}</p>
            )}
            {applyError && (
              <p className="mt-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300">{applyError}</p>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleApply}>
              <div>
                <label className="mb-2 block text-sm text-slate-300">I want to join as</label>
                <select
                  value={applyForm.type}
                  onChange={e => setApplyForm({ ...applyForm, type: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                >
                  <option value="AS_DEVELOPER">Developer</option>
                  <option value="AS_INVESTOR">Investor</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Message</label>
                <textarea
                  value={applyForm.message}
                  onChange={e => setApplyForm({ ...applyForm, message: e.target.value })}
                  placeholder="Tell them why you want to join..."
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit" disabled={applyLoading}
                className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-50"
              >
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}

        {/* Заявки — только для owner */}
        {isOwner && <ApplicationsSection startupId={id} />}
      </main>
      <Footer />
    </div>
  );
}

// Компонент списка заявок для owner
import { getStartupApplications, updateApplicationStatus } from "../api/api";

function ApplicationsSection({ startupId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const data = await getStartupApplications(startupId);
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(appId, status) {
    try {
      await updateApplicationStatus(appId, status);
      setApplications(prev =>
        prev.map(a => a.id === appId ? { ...a, status } : a)
      );
    } catch (err) {
      console.error(err);
    }
  }

  const STATUS_STYLE = {
    PENDING: "text-yellow-300 bg-yellow-400/20",
    ACCEPTED: "text-green-300 bg-green-400/20",
    REJECTED: "text-red-300 bg-red-400/20",
  };

  return (
    <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
      <h2 className="text-2xl font-bold">Applications ({applications.length})</h2>

      {loading ? (
        <p className="mt-4 text-slate-400">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="mt-4 text-slate-400">No applications yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {applications.map(app => (
            <div key={app.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{app.userName}</span>
                    <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                      {app.type === "AS_DEVELOPER" ? "Developer" : "Investor"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  {app.message && (
                    <p className="mt-2 text-sm text-slate-400">{app.message}</p>
                  )}
                </div>

                {app.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(app.id, "ACCEPTED")}
                      className="rounded-xl bg-green-500/20 px-3 py-1 text-sm text-green-300 transition hover:bg-green-500/30"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatus(app.id, "REJECTED")}
                      className="rounded-xl bg-red-500/20 px-3 py-1 text-sm text-red-300 transition hover:bg-red-500/30"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
