import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ZoomGrid from "@/components/ZoomGrid";
import Chapters from "@/components/Chapters";
import MenuSection from "@/components/MenuSection";
import MoodPicker from "@/components/MoodPicker";
import Brew from "@/components/Brew";
import Visit from "@/components/Visit";
import FloatingControls from "@/components/FloatingControls";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <ZoomGrid />
        <Chapters />
        <MenuSection />
        <MoodPicker />
        <Brew />
        <Visit />
      </main>
      <footer>
        <div className="wrap">
          <span>© 2026 Comitea</span>
          <span>  Coffee Milk Tea</span>
        </div>
      </footer>
      <FloatingControls />
    </>
  );
}
