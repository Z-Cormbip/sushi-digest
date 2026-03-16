import { useEffect, useRef, useState } from "react";
import PlateSVG from "../assets/svg/plate.svg?react";
import { useHeroAnimate } from "../assets/hooks/useHeroAnimate";
import { useShowMaterials } from "../assets/hooks/useShowMaterials";
import type { Slide } from "../data/sushiData";

type SushiCarouselProps = {
  slides: Slide[];
  activeIndex: number;
  isSnapping: boolean;
  showMaterials: boolean;
  navSkew: {
    tick: number;
    direction: number;
  };
};

const SushiCarousel = ({
  slides,
  activeIndex,
  isSnapping,
  showMaterials,
  navSkew,
}: SushiCarouselProps) => {
  const sushiSlideRef = useRef<HTMLUListElement | null>(null);
  const [layoutKey, setLayoutKey] = useState(0);
  useHeroAnimate({
    listRef: sushiSlideRef,
    showMaterials,
    navSkew,
    layoutKey,
  });
  useShowMaterials({ listRef: sushiSlideRef, showMaterials, layoutKey });
  const [stepSize, setStepSize] = useState(0);

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
      const nextStepSize = getStepSize(sushiSlideRef.current);
      setStepSize((prev) => (prev === nextStepSize ? prev : nextStepSize));
    };

    const schedule = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(update);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    if (sushiSlideRef.current) observer.observe(sushiSlideRef.current);
    window.addEventListener("resize", schedule);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [slides.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => setLayoutKey((prev) => prev + 1);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    const list = sushiSlideRef.current;
    if (!list) return;

    let frameId: number | null = null;
    const update = () => {
      frameId = null;
      const slidesList = Array.from(
        list.querySelectorAll<HTMLElement>(".sushi-list"),
      );

      slidesList.forEach((slide) => {
        const overlay =
          slide.querySelector<SVGSVGElement>(".connector-overlay");
        const line1 = overlay?.querySelector<SVGLineElement>(
          '[data-connector="1"]',
        );
        const line2 = overlay?.querySelector<SVGLineElement>(
          '[data-connector="2"]',
        );
        const marker1 =
          slide.querySelector<SVGGraphicsElement>("#connector1-start");
        const marker2 =
          slide.querySelector<SVGGraphicsElement>("#connector2-start");
        const wraps = slide.querySelectorAll<HTMLElement>(
          ".material-img__wrap",
        );

        if (
          !overlay ||
          !line1 ||
          !line2 ||
          !marker1 ||
          !marker2 ||
          wraps.length < 2
        ) {
          return;
        }

        const overlayRect = overlay.getBoundingClientRect();
        const wrap1Rect = wraps[0].getBoundingClientRect();
        const wrap2Rect = wraps[1].getBoundingClientRect();

        const toLocal = (x: number, y: number) => ({
          x: x - overlayRect.left,
          y: y - overlayRect.top,
        });

        const getMarkerCenter = (marker: SVGGraphicsElement) => {
          try {
            const bbox = marker.getBBox();
            const matrix = marker.getScreenCTM();
            if (matrix) {
              const point = new DOMPoint(
                bbox.x + bbox.width / 2,
                bbox.y + bbox.height / 2,
              ).matrixTransform(matrix);
              return { x: point.x, y: point.y };
            }
          } catch {
            // Fall through to bounding rect.
          }

          const rect = marker.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        };

        const marker1Center = getMarkerCenter(marker1);
        const marker2Center = getMarkerCenter(marker2);

        const start1 = toLocal(marker1Center.x, marker1Center.y);
        const start2 = toLocal(marker2Center.x, marker2Center.y);
        const endInset = 1;
        const end1 = toLocal(wrap1Rect.left + endInset, wrap1Rect.bottom);
        const end2 = toLocal(wrap2Rect.left + endInset, wrap2Rect.bottom);

        const setLine = (
          line: SVGLineElement,
          start: { x: number; y: number },
          end: { x: number; y: number },
        ) => {
          line.setAttribute("x1", start.x.toFixed(2));
          line.setAttribute("y1", start.y.toFixed(2));
          line.setAttribute("x2", end.x.toFixed(2));
          line.setAttribute("y2", end.y.toFixed(2));
        };

        setLine(line1, start1, end1);
        setLine(line2, start2, end2);
      });
    };

    const schedule = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(update);
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    observer.observe(list);
    window.addEventListener("resize", schedule);

    const images = Array.from(list.querySelectorAll("img"));
    images.forEach((img) => img.addEventListener("load", schedule));

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      images.forEach((img) => img.removeEventListener("load", schedule));
    };
  }, [slides.length, showMaterials]);

  return (
    <div
      className="sushi-carousel mb-6"
      data-materials-shown={showMaterials ? "true" : "false"}
    >
      <PlateSVG className="plate-svg" />
      <ul
        className={`sushi-slide ${isSnapping ? "" : "transition-util"}`}
        ref={sushiSlideRef}
        style={{
          transform: `translateX(${-activeIndex * stepSize}px)`,
        }}
      >
        {slides.map(({ id, Svg, alt, header }) => (
          <li key={id} data-slide={id} className="sushi-list relative">
            {/* MATERIAL CHART */}
            <div className="material-img absolute ">
              {[header.features.top, header.features.base].map(
                (feature, index) => (
                  <div
                    key={`${id}-feature-${index}`}
                    className="material-img__wrap"
                  >
                    <img
                      src={feature.image}
                      alt={feature.text}
                      className="scale-200 origin-center"
                    />
                    <span className="enum-icon absolute top-2 left-2">
                      {index + 1}
                    </span>
                  </div>
                ),
              )}
            </div>
            <svg className="connector-overlay" aria-hidden="true">
              <line className="connector-line" data-connector="1" />
              <line className="connector-line" data-connector="2" />
            </svg>
            <Svg aria-label={alt} role="img" className="main-sushi" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SushiCarousel;
