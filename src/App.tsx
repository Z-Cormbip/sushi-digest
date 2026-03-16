import { ArrowUpRight } from "lucide-react";
import SushiSlides from "./components/SushiSlides";
import { DataProvider } from "./DataProvider";
import { slides } from "./data/sushiData";
import { useRef } from "react";
import { useIntroAnimate } from "./assets/hooks/useIntroAnimate";
import SDlogo from "./assets/svg/brand-logo.svg?react";

function IntroOverlay() {
  const introRef = useRef<HTMLDivElement | null>(null);
  useIntroAnimate({ wrapperRef: introRef });

  return (
    <div ref={introRef} data-intro>
      <SDlogo className="intro-logo" />
    </div>
  );
}

function App() {
  return (
    <>
      <IntroOverlay />
      <main className="main-wrap bg-bg">
        <DataProvider data={slides}>
          <SushiSlides />
        </DataProvider>
      </main>
      <footer className="footer-wrap">
        <a href="/" className="footer-link">
          <p className="">Design & Coded -</p>
          <p className="font-medium">Zeke Galeon</p>
          <span>
            <ArrowUpRight />
          </span>
        </a>
      </footer>
    </>
  );
}

export default App;
