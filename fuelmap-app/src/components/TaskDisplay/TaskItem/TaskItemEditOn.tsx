import { TaskColor, TaskType } from "../../../types/enums";
import { IonButton, IonIcon, IonInput, IonTextarea } from "@ionic/react";
import { memo, useRef, useState } from "react";

import "./TaskItemEditOn.scss";
import { useAppDispatch } from "../../../store/store";
import { setEdit } from "../../../store/tasks.slice";
import { Task } from "../../../types/task";
import { checkmarkSharp, closeSharp } from "ionicons/icons";
import ColorPicker from "../../ColorPicker/ColorPicker";
type Props = {
  id: number;
  type: TaskType;
  name: string;
  description: string;
  color: number;
};
const TaskItemEditOn: React.FC<Props> = ({
  id,
  type,
  name,
  description,
  color,
}) => {
  const dispatch = useAppDispatch();
  const [nameE, setNameE] = useState<string>(name);
  const [descriptionE, setDescriptionE] = useState<string>(description);
  const [colorE, setColorE] = useState<number>(color);

  const confirmRef = useRef<HTMLIonButtonElement>(null);

  function handleNameChange({ detail }: { detail: { value?: any } }) {
    const value = (detail.value || "").trim();
    if (value.length > 0) {
      setNameE(value);
    }
  }

  function handleDescriptionChange({ detail }: { detail: { value?: any } }) {
    const value = (detail.value || "").trim();
    if (value.length > 0) {
      setDescriptionE(value);
    }
  }

  function cancel() {
    dispatch(setEdit());
  }

  function confirm() {
    const changes: Partial<Task> = {};
    const previousValues: Partial<Task> = {};
    if (nameE != name) {
      changes.name = nameE;
      previousValues.name = name;
    }
    if (descriptionE != description) {
      changes.description = descriptionE;
      previousValues.description = description;
    }
    if (colorE != color) {
      changes.color = colorE;
      previousValues.color = color;
    }
    if (Object.keys(changes).length > 0) {
      // something changed
      dispatch(
        updateAndBackupTask({
          rollback: { id, changes: previousValues },
          rollforward: { id, changes },
        }),
      );
    }
    dispatch(setEdit());
  }

  function handleNameKeydown(e: React.KeyboardEvent) {
    if (e.code == "Enter") {
      e.stopPropagation();
      const value = (e.target as any).value;
      confirm();
    } else if (e.code != "Escape") {
      e.stopPropagation();
    }
  }

  function handleDescriptionKeydown(e: React.KeyboardEvent) {
    if (e.code != "Escape") {
      e.stopPropagation();
    }
  }

  function handleContainerKeydown(e: React.KeyboardEvent) {
    switch (e.code) {
      case "KeyC":
        e.stopPropagation();
        confirm();
        break;
      case "Escape":
        e.stopPropagation();
        cancel();
        break;
    }
  }
  return (
    <div className="task-edit" onKeyDown={handleContainerKeydown}>
      <div className="name-input">
        <IonInput
          type="text"
          placeholder="Task name"
          value={nameE}
          onIonInput={handleNameChange}
          onKeyDown={handleNameKeydown}
        />
      </div>
      <div className="description-input">
        <IonTextarea
          placeholder="Task description"
          autoGrow={true}
          rows={2}
          value={descriptionE}
          onIonInput={handleDescriptionChange}
          onKeyDown={handleDescriptionKeydown}
        />
      </div>
      <div className="toolbar">
        <div className="toolbar-specific">
          {type == TaskType.SECTOR && (
            <ColorPicker color={colorE} onChange={setColorE} />
          )}
        </div>
      </div>
      <div className="buttons">
        <IonButton
          fill="clear"
          color="success"
          onClick={confirm}
          ref={confirmRef}
        >
          <IonIcon icon={checkmarkSharp} slot="icon-only" />
        </IonButton>
        <IonButton fill="clear" color="warning" onClick={cancel}>
          <IonIcon icon={closeSharp} slot="icon-only" />
        </IonButton>
      </div>
    </div>
  );
};

export default memo(TaskItemEditOn);
