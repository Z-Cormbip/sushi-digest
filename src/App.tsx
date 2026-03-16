import { ArrowUpRight } from "lucide-react";
import SushiSlides from "./components/SushiSlides";
import { DataProvider } from "./DataProvider";
import { slides } from "./data/sushiData";

function App() {
  return (
    <>
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
