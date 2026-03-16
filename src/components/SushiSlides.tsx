import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../assets/hooks/useData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SDLogo from "../assets/svg/brand-logo.svg?react";
import RicePattern from "./RicePattern";
import SushiConveyor from "./SushiConveyor";
import SpeedCtrl from "./SpeedCtrl";
import MaterialToggle from "./MaterialToggle";
import SushiCarousel from "./SushiCarousel";

const SushiSlides = () => {
  const slides = useData();
  const [speed, setSpeed] = useState(60);
  const [activeId, setActiveId] = useState(slides[0]?.id ?? "");
  const nameTrackRef = useRef<HTMLUListElement | null>(null);
  const infoTrackRef = useRef<HTMLUListElement | null>(null);
  const prevIndexRef = useRef(0);
  const snapRafRef = useRef<number[]>([]);
  const [isSnapping, setIsSnapping] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [navSkew, setNavSkew] = useState({ tick: 0, direction: 1 });
  const [stepSizes, setStepSizes] = useState({
    name: 0,
    info: 0,
  });

  const activeIndex = useMemo(
    () =>
      Math.max(
        0,
        slides.findIndex((slide) => slide.id === activeId),
      ),
    [activeId, slides],
  );

  const handlePrev = useCallback(() => {
    if (slides.length === 0) return;
    setNavSkew((prev) => ({ tick: prev.tick + 1, direction: 1 }));
    const nextIndex = (activeIndex - 1 + slides.length) % slides.length;
    setActiveId(slides[nextIndex].id);
  }, [activeIndex, slides]);

  const handleNext = useCallback(() => {
    if (slides.length === 0) return;
    setNavSkew((prev) => ({ tick: prev.tick + 1, direction: -1 }));
    const nextIndex = (activeIndex + 1) % slides.length;
    setActiveId(slides[nextIndex].id);
  }, [activeIndex, slides]);

  const handleMaterialsToggle = useCallback(() => {
    setShowMaterials((prev) => !prev);
  }, []);

  useEffect(() => {
    const getStepSize = (list: HTMLUListElement | null) => {
      if (!list || list.children.length === 0) return 0;
      const first = list.children[0] as HTMLElement;
      const style = window.getComputedStyle(list);
      const gapValue =
        style.columnGap !== "normal" ? style.columnGap : style.gap;
      const parsedGap = parseFloat(gapValue || "0");
      const gap = Number.isFinite(parsedGap) ? parsedGap : 0;
      return first.getBoundingClientRect().width + gap;
    };

    let frameId: number | null = null;
    const update = () => {
      frameId = null;
      const next = {
        name: getStepSize(nameTrackRef.current),
        info: getStepSize(infoTrackRef.current),
      };
      setStepSizes((prev) =>
        prev.name === next.name && prev.info === next.info ? prev : next,
      );
    };

    const schedule = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(update);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    if (nameTrackRef.current) observer.observe(nameTrackRef.current);
    if (infoTrackRef.current) observer.observe(infoTrackRef.current);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [slides.length]);

  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    const distance = Math.abs(activeIndex - prevIndex);
    prevIndexRef.current = activeIndex;

    if (snapRafRef.current.length) {
      snapRafRef.current.forEach((id) => cancelAnimationFrame(id));
      snapRafRef.current = [];
    }

    if (distance <= 1) {
      const id = requestAnimationFrame(() => {
        setIsSnapping(false);
      });
      snapRafRef.current.push(id);
      return;
    }

    const first = requestAnimationFrame(() => {
      setIsSnapping(true);
      const second = requestAnimationFrame(() => {
        setIsSnapping(false);
      });
      snapRafRef.current.push(second);
    });
    snapRafRef.current.push(first);

    return () => {
      if (snapRafRef.current.length) {
        snapRafRef.current.forEach((id) => cancelAnimationFrame(id));
        snapRafRef.current = [];
      }
    };
  }, [activeIndex]);

  return (
    <>
      <RicePattern
        className="slide-wrap"
        width={8}
        stroke-width={3}
        spacing={20}
        scale={0.8}
        color="#ebebe3"
        patternHeight={850}
        patternAnchor="bottom"
      >
        <header className="header-logo">
          <SDLogo aria-label="Sushi Digest logo" />
        </header>
        <div className="hero-wrap">
          {/* SUSHI CAROUSEL */}
          <SushiCarousel
            slides={slides}
            activeIndex={activeIndex}
            isSnapping={isSnapping}
            showMaterials={showMaterials}
            navSkew={navSkew}
          />
        </div>
        <div className="controls-group">
          <MaterialToggle
            isShown={showMaterials}
            onToggle={handleMaterialsToggle}
          />
          <div className="btn-wrap">
            <button
              className="slide-btn"
              onClick={handlePrev}
              aria-label="Slide to previous sushi"
              role="button"
            >
              <ChevronLeft />
            </button>
            <div className="name-wrap">
              <ul
                className={`name-track ${isSnapping ? "" : "transition-util"}`}
                ref={nameTrackRef}
                style={{
                  transform: `translateX(${-activeIndex * stepSizes.name}px)`,
                }}
              >
                {slides.map(({ name, id, Icon }) => (
                  <li key={id} data-slide={id} className="name-list">
                    <h2>{name}</h2>
                    <Icon className="slide-icon" />
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="slide-btn"
              onClick={handleNext}
              aria-label="Slide to next sushi"
              role="button"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        {/* SUSHI INFO LIST */}
        <div className="info-wrap">
          <ul
            className={`info-track ${isSnapping ? "" : "transition-util"}`}
            ref={infoTrackRef}
            style={{
              transform: `translateX(${-activeIndex * stepSizes.info}px)`,
            }}
          >
            {slides.map(({ id, header, content, specs }) => (
              <li key={id} data-slide={id} className="info-list">
                <h2 className="text-lg text-center lg:text-xl">
                  {header.title}
                </h2>
                <div className="flex flex-col gap-4">
                  {[header.features.top, header.features.base].map(
                    (feature, index) => (
                      <div
                        key={`${id}-feature-${index}`}
                        className="flex flex-col gap-4"
                      >
                        <div className="flex gap-4 items-center">
                          <span className="enum-icon">{index + 1}</span>
                          <p className="text-sm lg:text-base">{feature.text}</p>
                        </div>
                        <div className="feature-img">
                          <img src={feature.image} alt={feature.text} />
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <p className="text-sm lg:text-base">{content.paragraph}</p>
                <p className="text-xs lg:text-sm">{specs}</p>
              </li>
            ))}
          </ul>
        </div>
      </RicePattern>
      {/* SUSHI CONVEYOR */}
      <SushiConveyor speed={speed} onSelect={setActiveId} />
      <div className="speed-wrap">
        <SpeedCtrl onSpeedChange={setSpeed} />
      </div>
    </>
  );
};

export default SushiSlides;
