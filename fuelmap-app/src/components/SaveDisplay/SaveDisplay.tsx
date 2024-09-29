import { memo, useMemo } from "react";

import { IonButton, IonIcon } from "@ionic/react";
import { downloadSharp, saveSharp } from "ionicons/icons";

import { useAppDispatch, useAppSelector } from "../../store/store";

import "./SaveDisplay.scss";
import {
  downloadCurrentGalaxy,
  saveCurrentGalaxyLocally,
  selectCurrentGalaxy,
} from "../../store/galaxies.slice";

const SaveDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentGalaxy = useAppSelector(selectCurrentGalaxy);

  function handleSaveLocally() {
    dispatch(saveCurrentGalaxyLocally());
  }

  function handleDownload() {
    dispatch(downloadCurrentGalaxy());
  }
  return (
    <>
      <div className="save-display">
        <IonButton
          fill="clear"
          disabled={!currentGalaxy?.needToSave}
          onClick={handleSaveLocally}
        >
          <IonIcon icon={saveSharp} slot="icon-only" />
        </IonButton>
        {currentGalaxy?.needToSave && <div className="indicator" />}
      </div>
      <IonButton
        fill="clear"
        onClick={handleDownload}
        disabled={!currentGalaxy}
      >
        <IonIcon icon={downloadSharp} slot="icon-only" />
      </IonButton>
    </>
  );
};

export default memo(SaveDisplay);
