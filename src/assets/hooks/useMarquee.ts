import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type MarqueeOptions = {
  speed?: number;
  pauseOnHover?: boolean;
};

export function useMarquee(options: MarqueeOptions = {}) {
  const { speed = 60, pauseOnHover = true } = options;
  const containerRef = useRef<HTMLUListElement | null>(null);
  const speedRef = useRef<number>(speed);
  const tickerRef = useRef<((time: number, deltaTime: number) => void) | null>(
    null,
  );
  const pausedRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let cleanupHover: (() => void) | null = null;

    const setup = () => {
      cleanupHover?.();
      cleanupHover = null;
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }
      gsap.set(container, { x: 0 });

      Array.from(
        container.querySelectorAll("[data-marquee-clone='true']"),
      ).forEach((node) => node.remove());

      const baseWidth = container.scrollWidth;
      if (baseWidth === 0) return;

      let gap = 0;
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length >= 2) {
        const first = children[0];
        const second = children[1];
        gap = second.offsetLeft - first.offsetLeft - first.offsetWidth;
        if (!Number.isFinite(gap) || gap < 0) gap = 0;
      } else {
        const style = window.getComputedStyle(container);
        const gapValue =
          style.columnGap !== "normal" ? style.columnGap : style.gap;
        const parsedGap = parseFloat(gapValue || "0");
        gap = Number.isFinite(parsedGap) ? parsedGap : 0;
      }

      const cycleWidth = baseWidth + gap;

      const parentWidth = container.parentElement?.offsetWidth ?? 0;
      const originals = Array.from(container.children);
      let totalWidth = baseWidth;

      while (totalWidth < cycleWidth + parentWidth) {
        originals.forEach((node) => {
          const clone = node.cloneNode(true) as HTMLElement;
          clone.setAttribute("data-marquee-clone", "true");
          clone.setAttribute("aria-hidden", "true");
          clone.setAttribute("tabindex", "-1");
          clone.removeAttribute("role");
          clone.removeAttribute("aria-pressed");
          container.appendChild(clone);
        });
        totalWidth += cycleWidth;
      }

      const wrapX = gsap.utils.wrap(-cycleWidth, 0);
      const tick = (_time: number, deltaTime: number) => {
        if (pausedRef.current) return;
        const currentX = gsap.getProperty(container, "x") as number;
        const nextX =
          currentX - Math.abs(speedRef.current) * (deltaTime / 1000);
        gsap.set(container, { x: wrapX(nextX) });
      };

      tickerRef.current = tick;
      gsap.ticker.add(tick);

      if (pauseOnHover) {
        const hoverTarget = container.parentElement ?? container;
        const handleEnter = () => {
          pausedRef.current = true;
        };
        const handleLeave = () => {
          pausedRef.current = false;
        };
        hoverTarget.addEventListener("mouseenter", handleEnter);
        hoverTarget.addEventListener("mouseleave", handleLeave);
        cleanupHover = () => {
          hoverTarget.removeEventListener("mouseenter", handleEnter);
          hoverTarget.removeEventListener("mouseleave", handleLeave);
        };
      }
    };

    setup();

    const resizeObserver = new ResizeObserver(() => {
      setup();
    });

    resizeObserver.observe(container);
    if (container.parentElement) {
      resizeObserver.observe(container.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      cleanupHover?.();
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }
    };
  }, [pauseOnHover]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return containerRef;
}
