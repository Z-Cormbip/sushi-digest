import { useCallback, useState, type MouseEvent } from "react";
import { useData } from "../assets/hooks/useData";
import { useMarquee } from "../assets/hooks/useMarquee";

type SushiConveyorProps = {
  speed: number;
  onSelect?: (id: string) => void;
};

const SushiConveyor = ({ speed, onSelect }: SushiConveyorProps) => {
  const slides = useData();
  const conveyorRef = useMarquee({ speed, pauseOnHover: true });
  const [pressedId, setPressedId] = useState<string | null>(null);

  const triggerPress = useCallback((id: string | null) => {
    if (!id) return;
    setPressedId(id);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLUListElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const item = target.closest<HTMLElement>("[data-slide]");
      if (!item || !event.currentTarget.contains(item)) return;
      const id = item.getAttribute("data-slide");
      if (id) {
        onSelect?.(id);
        triggerPress(id);
      }
    },
    [onSelect, triggerPress],
  );
  return (
    <div className="conveyor-wrap">
      <ul className="sushi-conveyor" ref={conveyorRef} onClick={handleClick}>
        {slides.map(({ id, Svg, alt }) => (
          <li
            key={id}
            data-slide={id}
            className="cursor-pointer group"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(id);
                triggerPress(id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <Svg
              aria-label={alt}
              role="img"
              className={`conveyor-item ${pressedId === id ? " is-pressed" : ""}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SushiConveyor;
