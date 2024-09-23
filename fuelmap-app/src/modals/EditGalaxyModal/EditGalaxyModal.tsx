import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonLabel,
  IonContent,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import { arrowBackSharp, createSharp } from "ionicons/icons";
import { Galaxy } from "../../types/galaxy";
import { useState } from "react";
import { useAppDispatch } from "../../store/store";
import Tooltip from "../../components/Tooltip/Tooltip";

import "./EditGalaxyModal.scss";
type Props = {
  onDismiss: () => void;
  galaxy: Galaxy;
};

const EditGalaxyModal: React.FC<Props> = ({ onDismiss, galaxy }) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>(galaxy?.name || "");
  const [description, setDescription] = useState<string>(
    galaxy?.description || "",
  );

  function handleSubmit() {
    closeModal();
  }

  function closeModal() {
    onDismiss();
  }

  return (
    <IonPage className="edit-galaxy-modal modal-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="primary" onClick={closeModal}>
              <IonIcon slot="icon-only" icon={arrowBackSharp} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            {galaxy.name.length > 0 ? (
              <span>
                Edit Galaxy <strong>{galaxy.name}</strong>
              </span>
            ) : (
              <span>Create Galaxy</span>
            )}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              color="primary"
              disabled={name.length == 0}
              onClick={handleSubmit}
            >
              <IonIcon slot="start" icon={createSharp} />
              <IonLabel>Create</IonLabel>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="edit-galaxy-modal-container modal-container">
          <div className="id">{galaxy.id}</div>

          <div className="item">
            <div className="item-label">
              <IonLabel>Name</IonLabel>
              <Tooltip text="" />
            </div>
            <div className="item-data">
              <IonInput
                value={name}
                onIonInput={(e: any) => setName(e.detail.value?.trim() || "")}
                placeholder="Project name"
              />
            </div>
          </div>

          <div className="item">
            <div className="item-label">
              <IonLabel>Description</IonLabel>
              <Tooltip text="" />
            </div>
            <div className="item-data">
              <IonTextarea
                value={description}
                rows={2}
                autoGrow={true}
                onIonInput={(e: any) => setDescription(e.detail.value || "")}
                placeholder="Project description"
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default EditGalaxyModal;
