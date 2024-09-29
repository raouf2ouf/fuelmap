import { memo } from "react";
import TaskStats from "./TaskStats";
import { chatboxSharp, documentTextSharp } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

import "./TaskItemEditOff.scss";
type Props = {
  id: number;
  name: string;
  description: string;
  nbrComments?: number;
  content?: string;
  checked: boolean;
};
const TaskItemEditOff: React.FC<Props> = ({
  id,
  name,
  description,
  nbrComments,
  content,
  checked,
}) => {
  return (
    <div className={`task-display ${checked && "checked"}`}>
      <div className="task-name">{name}</div>
      <div className="task-description">{description}</div>
      <div className="infos-line-1"></div>
      <div className="infos-line-2">
        <TaskStats id={id} />
        {nbrComments && nbrComments > 0 && <IonIcon icon={chatboxSharp} />}
        {content && <IonIcon icon={documentTextSharp} />}
      </div>
    </div>
  );
};

export default memo(TaskItemEditOff);
