import { ArrowRight, Rocket, Users } from "lucide-react";

export default function WhoWeAreSection() {
  const cards = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Who we are",
      text: "We are building a platform that connects startup ideas with users, founders, and future partners.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "What we do",
      text: "StartupHub helps people discover startup projects, view information, and interact through a clean interface.",
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      title: "Why it matters",
      text: "Many strong startup ideas stay hidden. Our goal is to make them visible and easier to explore.",
    },
  ];

  return (
    <section id="who-we-are" className="mx-auto max-w-6xl px-6 py-16">
      <div className="w-full flex flex-col items-center">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
            About us
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white">Who We Are</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            StartupHub is made for people who want to explore startup ideas in a
            simple and modern way.
          </p>
        </div>
      </div>  

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((item) => (
          <div
            key={item.title}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-sky-400/20 p-3 text-sky-300">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}