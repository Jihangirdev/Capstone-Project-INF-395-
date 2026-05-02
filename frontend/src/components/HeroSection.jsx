import { Link } from "react-router-dom";
import { LogIn, Rocket, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { getCurrentUser } from "../api/api";

export default function HeroSection() {
  const user = getCurrentUser();

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_35%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-300">
            Startup platform
          </p>

          <h1 className="text-5xl font-black leading-tight text-white md:text-6xl">
            Discover startups, ideas, and people in one place.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            StartupHub is a modern platform where users can explore startup
            projects, learn about teams, and sign in to continue their journey.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {!user ? (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.03]"
              >
                <LogIn className="h-4 w-4" />
                Authorization
              </Link>
            ) : (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.03]"
              >
                <LogIn className="h-4 w-4" />
                My Profile
              </Link>
            )}

            <Link
              to="/startups"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <Rocket className="h-4 w-4" />
              Show Startups
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
        >
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Featured startup</p>
              <h3 className="mt-2 text-2xl font-bold text-white">GreenBox</h3>
              <p className="mt-2 text-slate-300">
                Eco-friendly delivery packaging for local businesses and online stores.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <div className="mb-2 text-sky-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-400">Startups</p>
                <p className="mt-2 text-3xl font-bold text-white">120+</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <div className="mb-2 text-sky-300">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-400">Active users</p>
                <p className="mt-2 text-3xl font-bold text-white">3.4K</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}