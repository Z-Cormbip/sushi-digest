import { LucideEye, LucideEyeClosed } from "lucide-react";

type MaterialToggleProps = {
  isShown: boolean;
  onToggle: () => void;
};

const MaterialToggle = ({ isShown, onToggle }: MaterialToggleProps) => {
  return (
    <div className="material-wrap">
      <p className="text-sm">Show Materials</p>
      <div className="toggle-wrap">
        <button
          type="button"
          className="show-toggle group"
          onClick={onToggle}
          aria-pressed={isShown}
          aria-label="Show materials"
        >
          {isShown ? (
            <LucideEye className="show-toggle__icon" />
          ) : (
            <LucideEyeClosed className="show-toggle__icon" />
          )}
        </button>
      </div>
    </div>
  );
};
export default MaterialToggle;
