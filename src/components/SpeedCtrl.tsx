import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RabbitIcon, TurtleIcon } from "../assets/svg/icon";

type SpeedCtrlProps = {
  baseSpeed?: number;
  step?: number;
  steps?: number;
  onSpeedChange?: (speed: number) => void;
};

const SpeedCtrl = ({
  baseSpeed = 60,
  step = 10,
  steps = 9,
  onSpeedChange,
}: SpeedCtrlProps) => {
  const centerIndex = Math.floor(steps / 2);
  const offsetRange = step * centerIndex;
  const [speedIndex, setSpeedIndex] = useState(centerIndex);
  const barRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const speedOffset = (speedIndex - centerIndex) * step;
  const speed = baseSpeed + speedOffset;
  const speedZone =
    speedIndex < centerIndex
      ? "turtle"
      : speedIndex > centerIndex
        ? "rabbit"
        : "idle";

  useEffect(() => {
    onSpeedChange?.(speed);
  }, [onSpeedChange, speed]);

  const updateSpeedFromClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const clampedX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const ratio = rect.width === 0 ? 0 : clampedX / rect.width;
    const nextIndex = Math.round(ratio * (steps - 1));
    setSpeedIndex(nextIndex);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateSpeedFromClientX(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateSpeedFromClientX(event.clientX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="speed-ctrl" data-speed-zone={speedZone}>
      <TurtleIcon className="turtle-icon" />
      <div
        className="speed-bar"
        ref={barRef}
        role="slider"
        aria-label="Conveyor speed control"
        aria-valuemin={-offsetRange}
        aria-valuemax={offsetRange}
        aria-valuenow={speedOffset}
        aria-valuetext={`${speedOffset} speed offset, ${speed} pixels per second`}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {Array.from({ length: steps }, (_, index) => (
          <button
            key={`speed-${index}`}
            type="button"
            className="speed-bar__line"
            data-active={index === speedIndex}
            style={{ height: "27px" }}
            onClick={() => setSpeedIndex(index)}
            aria-label={`Speed level ${index + 1}`}
          />
        ))}
      </div>
      <RabbitIcon className="rabbit-icon" />
    </div>
  );
};

export default SpeedCtrl;
