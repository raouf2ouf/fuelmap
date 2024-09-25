import { memo } from "react";
import { TaskColor } from "../../types/enums";
import "./ColorPicker.scss";
type Props = {
  color: number;
  onChange: (color: number) => void;
};
const ColorPicker: React.FC<Props> = ({ color, onChange }) => {
  function handleKeydown(e: React.KeyboardEvent, color: number) {
    if (e.code == "Enter") {
      e.stopPropagation();
      onChange(color);
    }
  }
  return (
    <div className="color-picker">
      {TaskColor.map((c, idx) => (
        <div
          key={idx}
          className={`color ${color == idx && "active"}`}
          style={{ backgroundColor: c }}
          role="button"
          tabIndex={0}
          onClick={() => onChange(idx)}
          onKeyDown={(e) => handleKeydown(e, idx)}
        ></div>
      ))}
    </div>
  );
};

export default memo(ColorPicker);
