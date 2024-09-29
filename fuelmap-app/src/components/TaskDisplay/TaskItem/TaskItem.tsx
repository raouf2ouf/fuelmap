import { memo, useEffect, useRef } from "react";

import {
  chevronDownSharp,
  chevronForwardSharp,
  createOutline,
  createSharp,
  ellipsisHorizontalSharp,
  removeSharp,
  returnDownBackSharp,
  returnDownForwardSharp,
  returnUpBackSharp,
  trashSharp,
} from "ionicons/icons";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  useIonAlert,
} from "@ionic/react";

import { attachDndChildListeners } from "../../../hooks/dnd-hook";
import {
  DRAG_ENDED_EVENT,
  DRAG_STARTED_EVENT,
} from "../../../hooks/dnd.helpers";

import { useAppDispatch, useAppSelector } from "../../../store/store";

import {
  addNewTask,
  deleteTask,
  selectTaskById,
  setEdit,
  toggleTask,
} from "../../../store/tasks.slice";
import { TaskType } from "../../../types/enums";
import Checkcircle from "../Checkcircle/Checkcircle";
import { getTypeGivenId, getTypeText } from "../../../store/tasks.utils";

import "./TaskItem.scss";
import TaskItemEditOn from "./TaskItemEditOn";
import TaskItemEditOff from "./TaskItemEditOff";
type Props = {
  id: number;
};
const TaskItem: React.FC<Props> = ({ id }) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector(
    (state) => selectTaskById(state, id) ?? state.tasks.newTask,
  )!;
  const edit = useAppSelector((state) => state.tasks.edit == task.id);
  const wasOpen = useRef<boolean>(false);

  const divRef = useRef<HTMLDivElement>(null);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    const node = divRef.current;
    const dndChildListeners = attachDndChildListeners(node);
    const handleDragStarted = () => {
      wasOpen.current = task.closed;
      dispatch(setEdit());
      dispatch(toggleTask({ taskId: task.id, toggle: true }));
    };
    const handleDragEnded = () => {
      dispatch(toggleTask({ taskId: task.id, toggle: wasOpen.current }));
    };
    if (node) {
      node.addEventListener(DRAG_STARTED_EVENT, handleDragStarted);
      node.addEventListener(DRAG_ENDED_EVENT, handleDragEnded);
    }

    return () => {
      dndChildListeners();
      if (node) {
        node.removeEventListener(DRAG_STARTED_EVENT, handleDragStarted);
        node.removeEventListener(DRAG_ENDED_EVENT, handleDragEnded);
      }
    };
  }, [divRef.current, task]);

  useEffect(() => {
    if (edit) {
      setTimeout(() => {
        const input: HTMLIonInputElement | undefined | null =
          divRef.current?.querySelector("ion-input");
        if (input) {
          input.setFocus();
        }
      }, 200);
    }
  }, [edit]);

  function handleKeydown(e: React.KeyboardEvent) {
    switch (e.code) {
      // case "Enter": // wierd behavior when clicking buttons, not worth it
      //   e.stopPropagation();
      //   dispatch(toggleChecked({ taskId: task.id }));
      //   break;
      case "KeyE":
        e.stopPropagation();
        handleToggleEdit();
        break;

      case "ArrowLeft":
      case "KeyL":
        if (e.shiftKey) {
          e.stopPropagation();
          // dispatch(moveTaskLeft(task.id));
        }
        break;

      case "ArrowRight":
      case "KeyH":
        if (e.shiftKey) {
          e.stopPropagation();
          // dispatch(moveTaskRight(task.id));
        }
        break;

      case "ArrowUp":
      case "KeyK":
        if (e.shiftKey) {
          e.stopPropagation();
          // dispatch(moveTaskUp(task.id));
        }
        break;

      case "ArrowDown":
      case "KeyJ":
        if (e.shiftKey) {
          e.stopPropagation();
          // dispatch(moveTaskDown(task.id));
        }
        break;
    }
  }

  function handleToggleTask() {
    if (id) {
      dispatch(toggleTask({ taskId: id }));
    }
  }

  function handleToggleEdit() {
    dispatch(setEdit(task.id));
  }

  function handleAddTaskAbove() {
    dispatch(
      addNewTask({
        addAfterId: task.id,
      }),
    );
  }
  function handleAddTaskBelow() {
    dispatch(
      addNewTask({
        addBeforeId: task.id,
      }),
    );
  }
  function handleAddSubTask() {
    dispatch(
      addNewTask({
        parentId: task.id,
      }),
    );
  }
  function handleDeleteTask() {
    presentAlert({
      cssClass: "delete-task-alert",
      header: "Delete",
      subHeader: task.name,
      message: `Are you sure you want to delete this task and all of its children?`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "confirm",
          cssClass: "alert-delete",
          handler: () => {
            dispatch(deleteTask(task.id));
          },
        },
      ],
    });
  }

  return (
    <>
      {task && task.displayed && (
        <div
          ref={divRef}
          id={`${id ? "" : "new-"}${task.id}`}
          className={`task-container type${getTypeText(task.id)}`}
          style={
            {
              "--task-color": task.color,
              "--task-color-shade": `${task.color}44`,
            } as any
          }
          role="button"
          tabIndex={-1}
          onKeyDown={handleKeydown}
        >
          {/* <IonLabel color="danger">{task.index}</IonLabel> */}
          {/* Toogle */}
          <div className="toggle">
            {getTypeGivenId(task.id) < TaskType.MOON ? (
              <IonButton fill="clear" onClick={handleToggleTask}>
                {task.closed ? (
                  <IonIcon icon={chevronForwardSharp} slot="icon-only" />
                ) : (
                  <IonIcon icon={chevronDownSharp} slot="icon-only" />
                )}
              </IonButton>
            ) : (
              <IonButton fill="clear">
                <IonIcon icon={removeSharp} />
              </IonButton>
            )}
          </div>
          {/* Checkbox */}
          <Checkcircle id={task.id} checked={task.checked} />

          {/* Task Type */}
          <div className="type-text hide-sm">{getTypeText(task.id)}</div>

          {/* Task Text and Description */}
          <div className="task-content">
            {edit ? (
              <TaskItemEditOn
                id={task.id}
                name={task.name}
                description={task.description ?? ""}
                color={task.color}
              />
            ) : (
              <TaskItemEditOff
                id={task.id}
                name={task.name}
                description={task.description ?? ""}
                checked={task.checked}
              />
            )}
          </div>

          {/* Buttons */}
          {!edit && (
            <div className="task-buttons">
              <IonButton fill="clear" onClick={handleToggleEdit}>
                <IonIcon icon={createOutline} slot="icon-only" />
              </IonButton>
              <IonButton fill="clear" id={`trigger-menu-${task.id}`}>
                <IonIcon icon={ellipsisHorizontalSharp} slot="icon-only" />
              </IonButton>
              <IonPopover
                trigger={`trigger-menu-${task.id}`}
                dismissOnSelect={true}
                showBackdrop={false}
                className="task-menu-popover"
              >
                <IonContent>
                  <IonList>
                    <IonItem
                      button={true}
                      detail={false}
                      onClick={handleAddTaskAbove}
                    >
                      <IonIcon slot="start" icon={returnUpBackSharp} />
                      <IonLabel>Add Task Above</IonLabel>
                    </IonItem>
                    <IonItem
                      button={true}
                      detail={false}
                      onClick={handleAddTaskBelow}
                    >
                      <IonIcon slot="start" icon={returnDownBackSharp} />
                      <IonLabel>Add Task Below</IonLabel>
                    </IonItem>
                    <IonItem
                      button={true}
                      detail={false}
                      onClick={handleAddSubTask}
                    >
                      <IonIcon slot="start" icon={returnDownForwardSharp} />
                      <IonLabel>Add Sub-Task</IonLabel>
                    </IonItem>

                    <IonItem
                      button={true}
                      detail={false}
                      onClick={handleToggleEdit}
                    >
                      <IonIcon slot="start" icon={createSharp} />
                      <IonLabel>Edit Task</IonLabel>
                    </IonItem>
                    <IonItem
                      button={true}
                      detail={false}
                      className="delete"
                      onClick={handleDeleteTask}
                      id={`alert-${task.id}`}
                    >
                      <IonIcon slot="start" icon={trashSharp} />
                      <IonLabel>Delete Task</IonLabel>
                    </IonItem>
                  </IonList>
                </IonContent>
              </IonPopover>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(TaskItem);
