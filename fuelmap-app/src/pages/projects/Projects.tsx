import { v4 as uuid } from "uuid";
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonPage,
  useIonModal,
} from "@ionic/react";
import { memo, useRef } from "react";
import { useAppDispatch } from "../../store/store";
import EditGalaxyModal from "../../modals/EditGalaxyModal/EditGalaxyModal";
import { addSharp, documentSharp } from "ionicons/icons";

import "./Projects.scss";

const ProjectsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [present, dismiss] = useIonModal(EditGalaxyModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
    galaxy: {
      id: uuid(),
      name: "",
      description: "",
    },
  });

  function createGalaxy() {
    present();
  }

  function handleImportClick() {
    fileInputRef?.current?.click();
  }

  function importGalaxy(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      try {
        const json = JSON.parse(text as string);
        // dispatch(addGalaxyAndLoadChildren(json));
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  return (
    <IonPage>
      <IonContent className="page-content">
        <div className="page-main-container projects-page">
          <section className="user-projects">
            <IonCard
              type="button"
              className="card-button add-galaxy"
              onClick={createGalaxy}
            >
              <IonCardContent>
                <IonIcon icon={addSharp} />
                <div className="title">Create Galaxy</div>
              </IonCardContent>
            </IonCard>

            <IonCard
              type="button"
              className="card-button import-galaxy"
              onClick={handleImportClick}
            >
              <input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={importGalaxy}
                ref={fileInputRef}
              />
              <IonCardContent>
                <IonIcon icon={documentSharp} />
                <div className="title">Import Galaxy</div>
              </IonCardContent>
            </IonCard>
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default memo(ProjectsPage);
