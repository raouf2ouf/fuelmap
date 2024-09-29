import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import { addSharp } from "ionicons/icons";
import { memo, useRef } from "react";
import { useAppDispatch } from "../../../store/store";
import { addNewTask, addTask } from "../../../store/tasks.slice";

const AddTask: React.FC = () => {
  const dispatch = useAppDispatch();

  const divRef = useRef<HTMLIonButtonElement>(null);

  function handleAddTask(e: any) {
    if (e.code) {
      if (e.code == "Enter") {
        e.stopPropagation();
        dispatch(addNewTask());
      }
    } else {
      dispatch(addNewTask());
    }
  }
  return (
    <IonButton
      fill="clear"
      expand="full"
      onClick={handleAddTask}
      onKeyDown={handleAddTask}
      ref={divRef}
      tabIndex={0}
      id="add-task"
    >
      <IonIcon slot="start" icon={addSharp} />
      <IonLabel>Add Task</IonLabel>
    </IonButton>
  );
};

export default memo(AddTask);
