import { IonIcon } from "@ionic/react";
import { checkmarkSharp } from "ionicons/icons";
import { memo } from "react";
import { TaskType } from "../../../types/enums";
import { useAppDispatch } from "../../../store/store";
import { toggleChecked } from "../../../store/tasks.slice";
import { getTypeText } from "../../../store/tasks.utils";

import "./Checkcircle.scss";

type Props = {
  id: number;
  checked: boolean;
};

const Checkcircle: React.FC<Props> = ({ id, checked }) => {
  const dispatch = useAppDispatch();

  function handleToggleChecked() {
    dispatch(toggleChecked({ id }));
  }

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.code == "Enter") {
      handleToggleChecked();
      e.stopPropagation();
    }
  }
  return (
    <div
      className="checkcircle-container"
      tabIndex={0}
      onKeyDown={handleKeydown}
      onClick={handleToggleChecked}
    >
      <div className="checkcircle">
        {checked && (
          <div className="checkmark">
            <IonIcon icon={checkmarkSharp} />
          </div>
        )}
      </div>
      <div className={getTypeText(id)}>
        <div className="inside"></div>
      </div>
    </div>
  );
};

export default memo(Checkcircle);
