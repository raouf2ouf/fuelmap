import { memo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import "./TaskList.scss";
import { attachDndZoneListeners } from "../../../hooks/dnd-hook";
import { TaskType } from "../../../types/enums";
import {
  moveTask,
  selectAllCurrentGalaxyTasksIds,
  setFocusIndexDown,
  setFocusIndexUp,
} from "../../../store/tasks.slice";
import { DRAG_ENDED_EVENT } from "../../../hooks/dnd.helpers";
import { saveCurrentGalaxyLocally } from "../../../store/galaxies.slice";
import { rollback, rollforward } from "../../../store/backup.slice";
import TaskItem from "../TaskItem/TaskItem";
import AddTask from "./AddTask";
const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks: number[] = useAppSelector(selectAllCurrentGalaxyTasksIds);
  const newTaskId: number | undefined = useAppSelector(
    (state) => state.tasks.newTask?.id,
  );
  const focusId = useAppSelector((state) => state.tasks.focusId);
  const edit = useAppSelector((state) => state.tasks.edit);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = divRef.current;
    if (container && !edit) {
      try {
        document.getElementById(focusId)?.focus();
      } catch (e) {
        console.error(e);
      }
    }
  }, [focusId, edit]);

  useEffect(() => {
    const node = divRef.current;
    const unlisten = attachDndZoneListeners(node);

    const handleDragEnded = async (evt: Event) => {
      const e = evt as CustomEvent<{
        taskId: string;
        newType: TaskType;
        oldType: TaskType;
        startIdx: number;
        endIdx: number;
      }>;
      const { taskId, startIdx, endIdx, newType, oldType } = e.detail;
      if (startIdx == endIdx && newType == oldType) return;
      await dispatch(
        moveTask({
          taskId,
          newType,
          previousDisplayIdx: startIdx,
          newDisplayIdx: endIdx,
        }),
      );
      setTimeout(() => {
        document.getElementById(taskId)?.focus();
      }, 200);
    };

    if (node) {
      node.addEventListener(DRAG_ENDED_EVENT, handleDragEnded);
    }
    return () => {
      unlisten();
      if (node) {
        node.removeEventListener(DRAG_ENDED_EVENT, handleDragEnded);
      }
    };
  }, [divRef.current]);

  function handleKeydown(e: React.KeyboardEvent) {
    switch (e.code) {
      case "ArrowDown":
      case "KeyJ":
        e.preventDefault();
        dispatch(setFocusIndexDown());
        break;
      case "ArrowUp":
      case "KeyK":
        e.preventDefault();
        dispatch(setFocusIndexUp());
        break;

      case "KeyS":
        if (e.ctrlKey) {
          e.preventDefault();
          dispatch(saveCurrentGalaxyLocally());
        }
        break;
      case "KeyU":
        if (e.ctrlKey) {
          e.preventDefault();
          dispatch(rollback());
        }
        break;
      case "KeyR":
        if (e.ctrlKey) {
          e.preventDefault();
          dispatch(rollforward());
        }
    }
  }
  return (
    <>
      <div ref={divRef} onKeyDown={handleKeydown}>
        {[...(tasks || []), ...(newTaskId ? [newTaskId] : [])]
          .sort((a, b) => a - b)
          .map((t) => (
            <TaskItem id={t} key={t} />
          ))}
        <AddTask />
      </div>
    </>
  );
};

export default memo(TaskList);
