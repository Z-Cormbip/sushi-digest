import gsap from "gsap";
import type { RefObject } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";

type HeroAnimateOptions = {
  listRef: RefObject<HTMLElement | null>;
  showMaterials: boolean;
  navSkew: {
    tick: number;
    direction: number;
  };
  layoutKey?: number;
};

export function useHeroAnimate({
  listRef,
  showMaterials,
  navSkew,
  layoutKey,
}: HeroAnimateOptions) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const svgNodesRef = useRef<SVGSVGElement[]>([]);
  const prefersReducedMotionRef = useRef(false);
  const navSkewReadyRef = useRef(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    prefersReducedMotionRef.current = prefersReducedMotion;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const svgNodes = gsap.utils.toArray<SVGSVGElement>(".main-sushi", list);
      svgNodesRef.current = svgNodes;
      const oddTops = gsap.utils.toArray<SVGGraphicsElement>(
        ".sushi-list:nth-child(odd) #sushi-top",
        list,
      );
      const evenTops = gsap.utils.toArray<SVGGraphicsElement>(
        ".sushi-list:nth-child(even) #sushi-top",
        list,
      );
      const shadowNodes = gsap.utils.toArray<SVGGraphicsElement>(
        ".sushi-list #sushi-shadow",
        list,
      );

      gsap.set(svgNodes, {
        scaleY: 1,
        skewX: 0,
        transformOrigin: "50% 70%",
      });
      gsap.set([...oddTops, ...evenTops], {
        y: 4,
        transformOrigin: "center bottom",
      });
      gsap.set(shadowNodes, {
        opacity: 1,
        filter: "blur(0px)",
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { duration: 0.5, ease: "power2.out" },
      });

      tl.to(svgNodes, { scaleY: 0.96, duration: 0.12, ease: "power1.out" }, 0);
      tl.to(svgNodes, { scaleY: 1, duration: 0.2, ease: "power1.out" }, 0.12);
      tl.to(oddTops, { y: "-10rem" }, 0.12);
      tl.to(evenTops, { y: "-15rem" }, 0.12);
      tl.to(
        shadowNodes,
        {
          opacity: 0.8,
          filter: "blur(4px)",
          duration: 0.4,
          ease: "power2.out",
        },
        0.12,
      );

      tlRef.current = tl;
    }, list);

    return () => {
      tlRef.current = null;
      svgNodesRef.current = [];
      ctx.revert();
    };
  }, [listRef, layoutKey]);

  useEffect(() => {
    if (!navSkewReadyRef.current) {
      navSkewReadyRef.current = true;
      return;
    }
    const nodes = svgNodesRef.current;
    if (!nodes.length || prefersReducedMotionRef.current) return;
    const direction = navSkew.direction >= 0 ? 1 : -1;
    const targetSkew = -direction * 3;
    gsap.timeline({ delay: 0.16, defaults: { overwrite: "auto" } })
      .to(nodes, { skewX: targetSkew, duration: 0.10, ease: "power1.out" })
      .to(nodes, { skewX: 0, duration: 0.30, ease: "power2.out" });
  }, [navSkew.tick, navSkew.direction]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (showMaterials) {
      tl.reverse();
    } else {
      tl.play();
    }
  }, [showMaterials]);
}
