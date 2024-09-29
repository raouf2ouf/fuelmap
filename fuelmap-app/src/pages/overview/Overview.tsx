import { memo } from "react";
import { IonContent, IonPage } from "@ionic/react";

import "./Overview.scss";
import { Redirect } from "react-router";
import { useAppSelector } from "../../store/store";
import TaskList from "../../components/TaskDisplay/TaskList/TaskList";
const OverviewPage: React.FC = () => {
  const currentGalaxyId = useAppSelector(
    (state) => state.galaxies.currentGalaxyId,
  );

  return (
    <IonPage>
      <IonContent className="page-content">
        <div className="page-main-container overview-page">
          {currentGalaxyId ? <TaskList /> : <Redirect to="/projects" />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default memo(OverviewPage);
