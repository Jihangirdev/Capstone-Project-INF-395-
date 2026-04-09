import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { login, register } from "../api/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "DEVELOPER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.name, form.role);
      }
      navigate("/startups");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <Link to="/" className="text-sm text-sky-300 hover:underline">← Back to Home</Link>

        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-2xl bg-sky-400/20 p-3 text-sky-300">
            <LogIn className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-bold">{isLogin ? "Login" : "Register"}</h1>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300">{error}</p>}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
                  <option value="DEVELOPER">Developer</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="FOUNDER">Founder</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 outline-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-50">
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-sky-300 hover:underline">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </main>
  );
}