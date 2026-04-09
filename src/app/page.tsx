import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Work />
        <Process />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
