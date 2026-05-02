import { Mail, MapPin, Phone, Rocket } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-2">
        <div>
          <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 text-white">
            <div className="rounded-2xl bg-sky-400/20 p-2 text-sky-300">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold">StartupHub</h3>
          </div>

          <p className="mt-3 max-w-md text-slate-300">
            A simple web application built with React Vite on the frontend and
            Spring on the backend.
          </p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white">Contacts</h4>
          <div className="w-full flex flex-col items-center">
          <div className="mt-4 space-y-3 text-slate-300">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              info@startuphub.com
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4" />
              +7 707 808 57 68
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4" />
              Almaty, Kazakhstan
            </p>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}