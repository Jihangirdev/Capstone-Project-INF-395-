import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhoWeAreSection from "../components/WhoWeAreSection";
import Footer from "../components/Footer";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <WhoWeAreSection />
      <Footer />
    </div>
  );
}