import gsap from "gsap";
import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";

type ShowMaterialsOptions = {
  listRef: RefObject<HTMLElement | null>;
  showMaterials: boolean;
  layoutKey?: number;
};

export function useShowMaterials({
  listRef,
  showMaterials,
  layoutKey,
}: ShowMaterialsOptions) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const prefersReducedMotionRef = useRef(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    prefersReducedMotionRef.current = prefersReducedMotion;

    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>(
        ".material-img__wrap",
        list,
      );
      const markers = gsap.utils.toArray<SVGGraphicsElement>(
        "#connectors [id^=\"connector\"]",
        list,
      );
      const lines = gsap.utils.toArray<SVGLineElement>(
        ".connector-line",
        list,
      );

      gsap.set([...wraps, ...markers], { opacity: showMaterials ? 1 : 0 });
      lines.forEach((line) => {
        if (!line.getTotalLength) return;
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = showMaterials ? "0" : `${length}`;
        gsap.set(line, { opacity: showMaterials ? 1 : 0 });
      });
    }, list);

    return () => {
      ctx.revert();
    };
  }, [listRef, showMaterials, layoutKey]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let frameId: number | null = null;

    const run = () => {
      frameId = null;

      const wraps = gsap.utils.toArray<HTMLElement>(
        ".material-img__wrap",
        list,
      );
      const markers = gsap.utils.toArray<SVGGraphicsElement>(
        "#connectors [id^=\"connector\"]",
        list,
      );
      const lines = gsap.utils.toArray<SVGLineElement>(
        ".connector-line",
        list,
      );

      tlRef.current?.kill();

      if (prefersReducedMotionRef.current) {
        gsap.set([...wraps, ...markers], { opacity: showMaterials ? 1 : 0 });
        lines.forEach((line) => {
          if (!line.getTotalLength) return;
          const length = line.getTotalLength();
          line.style.strokeDasharray = `${length}`;
          line.style.strokeDashoffset = showMaterials ? "0" : `${length}`;
          gsap.set(line, { opacity: showMaterials ? 1 : 0 });
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (showMaterials) {
        gsap.set([...wraps, ...markers], { opacity: 0 });
        lines.forEach((line) => {
          if (!line.getTotalLength) return;
          const length = line.getTotalLength();
          line.style.strokeDasharray = `${length}`;
          line.style.strokeDashoffset = `${length}`;
          gsap.set(line, { opacity: 1 });
        });

        tl.to(
          [...wraps, ...markers],
          { opacity: 1, duration: 0.3, stagger: 0.03 },
          0.12,
        );
        tl.to(
          lines,
          {
            strokeDashoffset: (_index, target) => {
              const line = target as SVGLineElement;
              if (!line.getTotalLength) return 0;
              return 0;
            },
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.22,
        );
      } else {
        tl.to(
          lines,
          {
            strokeDashoffset: (_index, target) => {
              const line = target as SVGLineElement;
              if (!line.getTotalLength) return 0;
              const length = line.getTotalLength();
              line.style.strokeDasharray = `${length}`;
              return length;
            },
            duration: 0.3,
            stagger: 0.04,
            ease: "power1.in",
          },
          0,
        );
        tl.to(
          [...wraps, ...markers],
          { opacity: 0, duration: 0.2 },
          0.05,
        );
        tl.set(lines, { opacity: 0 }, 0.3);
      }

      tlRef.current = tl;
    };

    frameId = requestAnimationFrame(run);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [listRef, showMaterials, layoutKey]);
}
