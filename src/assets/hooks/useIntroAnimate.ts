import { useLayoutEffect } from "react";
import gsap from "gsap";
import type { RefObject } from "react";

type IntroAnimateOptions = {
  wrapperRef?: RefObject<HTMLElement | null>;
};

export function useIntroAnimate({ wrapperRef }: IntroAnimateOptions = {}) {
  useLayoutEffect(() => {
    const wrapper =
      wrapperRef?.current ??
      document.querySelector<HTMLElement>("[data-intro]");
    if (!wrapper) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(wrapper, {
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-primary)",
        zIndex: 9999,
        yPercent: 0,
        willChange: "transform",
        pointerEvents: "auto",
      });

      const maskGroup = wrapper.querySelector<SVGGElement>("#mask");
      const sdSub = wrapper.querySelector<SVGPathElement>("#sd-sub");
      const sdS = wrapper.querySelector<SVGPathElement>("#sd-s");
      const sdDCurve = wrapper.querySelector<SVGPathElement>("#sd-d-curve");
      const sdDLine = wrapper.querySelector<SVGPathElement>("#sd-d-line");

      if (maskGroup) {
        gsap.set(maskGroup, { display: "block", opacity: 1 });
      }

      if (sdSub) {
        gsap.set(sdSub, { opacity: 0 });
      }

      const maskPaths = [sdS, sdDCurve, sdDLine].filter(
        Boolean,
      ) as SVGPathElement[];

      const pathLengths = new Map<SVGPathElement, number>();
      maskPaths.forEach((path) => {
        if (!path.getTotalLength) return;
        const length = path.getTotalLength();
        pathLengths.set(path, length);
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });

      if (prefersReducedMotion) {
        gsap.set(maskPaths, { strokeDashoffset: 0 });
        if (sdSub) gsap.set(sdSub, { opacity: 1 });
        gsap.set(wrapper, {
          yPercent: -100,
          display: "none",
          pointerEvents: "none",
        });
        return;
      }

      const drawTl = gsap.timeline({
        defaults: { ease: "power1.inOut" },
      });

      if (sdS && sdDCurve) {
        drawTl.fromTo(
          [sdS, sdDCurve],
          {
            strokeDashoffset: 0,
          },
          {
            strokeDashoffset: (index: number) => {
              const node = index === 0 ? sdS : sdDCurve;
              return node ? pathLengths.get(node) ?? 0 : 0;
            },
            duration: 1.2,
          },
          0,
        );
      }

      if (sdDLine) {
        drawTl.fromTo(
          sdDLine,
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: pathLengths.get(sdDLine) ?? 0,
            duration: 1.0,
          },
          0.2,
        );
      }

      const subTl = gsap.timeline({ paused: true });
      if (sdSub) {
        subTl.to(sdSub, { opacity: 1, duration: 0.5, ease: "power1.out" });
      }

      const exitTl = gsap.timeline({ paused: true });
      exitTl
        .to(
          wrapper,
          {
            left: "50%",
            xPercent: -50,
            yPercent: -100,
            duration: 0.8,
            ease: "power2.inOut",
          },
          0,
        )
        .set(wrapper, { display: "none", pointerEvents: "none" });

      drawTl.eventCallback("onComplete", () => {
        subTl.play(0);
      });

      subTl.eventCallback("onComplete", () => {
        exitTl.play(0);
      });
    }, wrapper);

    return () => ctx.revert();
  }, [wrapperRef]);
}
