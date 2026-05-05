import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Save } from "lucide-react";
import { getMe, updateProfile, getMyApplications, getReceivedApplications, getUserStartups, getCurrentUser } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { deleteStartup } from "../api/api";

const STATUS_STYLE = {
  PENDING: "text-yellow-300 bg-yellow-400/20",
  ACCEPTED: "text-green-300 bg-green-400/20",
  REJECTED: "text-red-300 bg-red-400/20",
};

const STAGE_COLORS = {
  IDEA: "text-purple-300",
  MVP: "text-yellow-300",
  GROWTH: "text-green-300",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", bio: "", skills: "" });
  const [applications, setApplications] = useState([]);
  const [myStartups, setMyStartups] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const prof = await getMe();
      setProfile(prof);
      setForm({ name: prof.name, bio: prof.bio || "", skills: prof.skills || "" });

      if (prof.role === "FOUNDER") {
        
        const [received, startups] = await Promise.all([
          getReceivedApplications(),
          getUserStartups(prof.id)
        ]);
        setApplications(received);
        setMyStartups(startups);
      } else {
        const apps = await getMyApplications();
        setApplications(apps);
      }
    } catch (err) {
      console.error("fetchAll error:", err);
    }
  }

  async function handleDelete(startupId) {
    if (!window.confirm("Are you sure you want to delete this startup?")) return;
    try {
      await deleteStartup(startupId);
      setMyStartups(prev => prev.filter(s => s.id !== startupId));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const updated = await updateProfile(form.name, form.bio, form.skills);
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleStatus(appId, status) {
    try {
      const { updateApplicationStatus } = await import("../api/api");
      await updateApplicationStatus(appId, status);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    } catch (err) {
      console.error(err);
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const isFounder = profile.role === "FOUNDER";

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "applications", label: isFounder ? `Incoming Applications (${applications.length})` : `My Applications (${applications.length})` },
    ...(isFounder ? [{ key: "startups", label: `My Startups (${myStartups.length})` }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/20 text-sky-300">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                <span>{profile.email}</span>
                <span>·</span>
                <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-xs text-sky-300">
                  {profile.role}
                </span>
              </div>
              {profile.bio && <p className="mt-2 text-sm text-slate-400">{profile.bio}</p>}
              {profile.skills && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.skills.split(",").map(s => (
                    <span key={s} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 border-b border-white/10">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`rounded-t-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSave}>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400/50" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={3} placeholder="Tell us about yourself..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none resize-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Skills</label>
                <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g. React, Java, Python..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400/50" />
              </div>
              <button type="submit" disabled={saveLoading}
                className="flex items-center gap-2 rounded-2xl bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-50">
                <Save className="h-4 w-4" />
                {saveLoading ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="mt-6 space-y-4">
            {applications.length === 0 ? (
              <p className="text-slate-400">
                {isFounder ? "No applications received yet." : "You haven't applied to any startups yet."}
              </p>
            ) : (
              applications.map(app => (
                <div key={app.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {isFounder ? (
                          <>
                            <span className="font-semibold">{app.userName}</span>
                            <span className="text-slate-400 text-sm">wants to join</span>
                            <Link to={`/startups/${app.startupId}`}
                              className="text-sky-300 hover:underline text-sm font-medium">
                              {app.startupTitle}
                            </Link>
                            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                              {app.type === "AS_DEVELOPER" ? "Developer" : "Investor"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Link to={`/startups/${app.startupId}`}
                              className="font-semibold text-sky-300 hover:underline">
                              {app.startupTitle}
                            </Link>
                            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                              {app.type === "AS_DEVELOPER" ? "As Developer" : "As Investor"}
                            </span>
                          </>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      {app.message && (
                        <p className="mt-2 text-sm text-slate-400">{app.message}</p>
                      )}
                    </div>

                    {isFounder && app.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatus(app.id, "ACCEPTED")}
                          className="rounded-xl bg-green-500/20 px-3 py-1 text-sm text-green-300 transition hover:bg-green-500/30">
                          Accept
                        </button>
                        <button onClick={() => handleStatus(app.id, "REJECTED")}
                          className="rounded-xl bg-red-500/20 px-3 py-1 text-sm text-red-300 transition hover:bg-red-500/30">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === "startups" && isFounder && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-end">
              <Link to="/create"
                className="rounded-2xl bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
                + New Startup
              </Link>
            </div>
            {myStartups.length === 0 ? (
              <p className="text-slate-400">You haven't created any startups yet.</p>
            ) : (
              myStartups.map(startup => (
                <div key={startup.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${STAGE_COLORS[startup.stage]}`}>{startup.stage}</span>
                        <span className="text-sm text-slate-400">{startup.category}</span>
                        <span className="text-xs text-slate-500">{startup.views} views</span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold">{startup.title}</h3>
                      <p className="mt-1 text-sm text-slate-400 line-clamp-2">{startup.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/startups/${startup.id}`}
                        className="rounded-xl border border-white/10 px-3 py-1 text-sm transition hover:bg-white/10">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(startup.id)}
                        className="rounded-xl border border-red-400/20 px-3 py-1 text-sm text-red-300 transition hover:bg-red-400/10">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}