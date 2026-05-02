import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, TrendingUp, Heart, Send, Users } from "lucide-react";
import { 
  getStartup, 
  applyToStartup, 
  toggleFavorite, 
  getCurrentUser, 
  getStartupApplications, 
  updateApplicationStatus,
  updateStartup 
} from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STAGE_COLORS = {
  IDEA: "text-purple-300 bg-purple-400/20",
  MVP: "text-yellow-300 bg-yellow-400/20",
  GROWTH: "text-green-300 bg-green-400/20",
};

const STATUS_STYLE = {
  PENDING: "text-yellow-300 bg-yellow-400/20",
  ACCEPTED: "text-green-300 bg-green-400/20",
  REJECTED: "text-red-300 bg-red-400/20",
};

export default function StartupDetailPage() {
  const { id } = useParams();
  const user = getCurrentUser();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [applyForm, setApplyForm] = useState({ type: "AS_DEVELOPER", message: "" });
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState("");
  const [applyError, setApplyError] = useState("");
  const [favMsg, setFavMsg] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [updateForm, setUpdateForm] = useState({ stage: "", currentFunding: 0 });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [id]);

  useEffect(() => {
    if (startup) {
      setUpdateForm({ 
        stage: startup.stage, 
        currentFunding: startup.currentFunding || 0 
      });
    }
  }, [startup]);

  async function fetchAll() {
    try {
      const data = await getStartup(id);
      setStartup(data);
      if (user && data.ownerId === user.id) {
        const apps = await getStartupApplications(id);
        setApplications(apps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updated = await updateStartup(id, updateForm);
      setStartup(updated);
      setIsEditing(false);
      setFavMsg("Updated!");
      setTimeout(() => setFavMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setApplyError("Update failed");
    } finally {
      setUpdateLoading(false);
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

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
    </div>
  );

  if (!startup) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p className="text-slate-400">Startup not found.</p>
    </div>
  );

  const isOwner = user && startup.ownerId === user.id;
  const acceptedDevs = applications.filter(a => a.status === "ACCEPTED" && a.type === "AS_DEVELOPER");
  const acceptedInvestors = applications.filter(a => a.status === "ACCEPTED" && a.type === "AS_INVESTOR");
  const pendingApps = applications.filter(a => a.status === "PENDING");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link to="/startups" className="text-sm text-sky-300 hover:underline">← Back to Startups</Link>

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
              
              {isOwner && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`rounded-2xl border px-4 py-2 text-sm transition ${isEditing ? "border-red-500/50 text-red-400" : "border-sky-500/50 text-sky-300"}`}
                >
                  {isEditing ? "Cancel" : "Edit Status"}
                </button>
              )}

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

          {startup.fundingGoal && (
            <div className="mt-6 rounded-2xl bg-slate-900 p-4 border border-white/5">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Startup Stage</label>
                      <select
                        value={updateForm.stage}
                        onChange={e => setUpdateForm({...updateForm, stage: e.target.value})}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none"
                      >
                        <option value="IDEA">IDEA</option>
                        <option value="MVP">MVP</option>
                        <option value="GROWTH">GROWTH</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Funding ($)</label>
                      <input
                        type="number"
                        value={updateForm.currentFunding}
                        onChange={e => setUpdateForm({...updateForm, currentFunding: Number(e.target.value)})}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit" disabled={updateLoading}
                    className="w-full rounded-xl bg-sky-400 py-2 font-bold text-slate-950 hover:bg-sky-300 transition disabled:opacity-50"
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <TrendingUp className="h-4 w-4" /> Funding
                  </div>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">${startup.currentFunding?.toLocaleString()}</span>
                    <span className="text-slate-400">/ ${startup.fundingGoal?.toLocaleString()} goal</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-2 bg-sky-400 transition-all duration-500"
                      style={{ width: `${Math.min((startup.currentFunding / startup.fundingGoal) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {isOwner && (acceptedDevs.length > 0 || acceptedInvestors.length > 0) && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-sky-400/20 p-2 text-sky-300"><Users className="h-5 w-5" /></div>
              <h2 className="text-2xl font-bold">Project Team & Investors</h2>
            </div>
            {acceptedDevs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-sky-300 mb-3">👨‍💻 Developers ({acceptedDevs.length})</h3>
                <div className="space-y-2">
                  {acceptedDevs.map(app => (
                    <div key={app.id} className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/20 text-sky-300 font-bold text-sm">{app.userName.charAt(0).toUpperCase()}</div>
                      <span className="font-medium">{app.userName}</span>
                      <span className="ml-auto rounded-full bg-green-400/20 px-2 py-0.5 text-xs text-green-300">Accepted</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {acceptedInvestors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-yellow-300 mb-3">💰 Investors ({acceptedInvestors.length})</h3>
                <div className="space-y-2">
                  {acceptedInvestors.map(app => (
                    <div key={app.id} className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-300 font-bold text-sm">{app.userName.charAt(0).toUpperCase()}</div>
                      <span className="font-medium">{app.userName}</span>
                      <span className="ml-auto rounded-full bg-green-400/20 px-2 py-0.5 text-xs text-green-300">Accepted</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isOwner && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-2xl font-bold">Incoming Applications ({pendingApps.length})</h2>
            {pendingApps.length === 0 ? (
              <p className="mt-4 text-slate-400">No pending applications.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {pendingApps.map(app => (
                  <div key={app.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{app.userName}</span>
                          <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">{app.type === "AS_DEVELOPER" ? "Developer" : "Investor"}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[app.status]}`}>{app.status}</span>
                        </div>
                        {app.message && <p className="mt-2 text-sm text-slate-400">{app.message}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(app.id, "ACCEPTED")} className="rounded-xl bg-green-500/20 px-3 py-1 text-sm text-green-300 hover:bg-green-500/30">Accept</button>
                        <button onClick={() => handleStatus(app.id, "REJECTED")} className="rounded-xl bg-red-500/20 px-3 py-1 text-sm text-red-300 hover:bg-red-500/30">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user && !isOwner && (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-400/20 p-2 text-sky-300"><Send className="h-5 w-5" /></div>
              <h2 className="text-2xl font-bold">Apply to this Startup</h2>
            </div>
            {applySuccess && <p className="mt-4 rounded-xl bg-green-500/20 px-4 py-2 text-sm text-green-300">{applySuccess}</p>}
            {applyError && <p className="mt-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300">{applyError}</p>}
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
                className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 hover:scale-[1.01] transition disabled:opacity-50"
              >
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}