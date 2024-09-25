import { memo } from "react";
import "./OverviewPage.scss";
import { IonContent, IonPage } from "@ionic/react";

import "./OverviewPage.scss";
import { Redirect } from "react-router";
import { useAppSelector } from "../../store/store";
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
