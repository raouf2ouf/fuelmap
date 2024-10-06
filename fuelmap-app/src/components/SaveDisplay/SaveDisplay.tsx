import { memo } from "react";

import "./SaveDisplay.scss";
import { useAppDispatch, useAppSelector } from "@store/store";
import {
  deployGalaxy,
  downloadCurrentGalaxy,
  exportGalaxyToDeploy,
  saveCurrentGalaxyLocally,
  selectCurrentGalaxySaveStatus,
} from "@store/galaxies.slice";
import { IonButton, IonIcon } from "@ionic/react";
import { bonfireSharp, downloadSharp, saveSharp } from "ionicons/icons";
import { SaveStatus } from "@models/galaxy";
import { useWallet } from "@fuels/react";
import { FuelmapTemplate, FuelmapTemplateFactory } from "$sway-api/contracts";
import { TaskActionInput } from "$sway-api/contracts/FuelmapTemplate";

const SaveDisplay: React.FC = () => {
  const dispatch = useAppDispatch();
  const saveStatus = useAppSelector(selectCurrentGalaxySaveStatus);
  const galaxy = useAppSelector(exportGalaxyToDeploy);

  const { wallet } = useWallet();

  function handleSaveLocally() {
    dispatch(saveCurrentGalaxyLocally());
  }

  function padString(str: string): string {
    if (str.length > 29) return str.slice(0, 29);
    return str.padEnd(29, " ");
  }

  async function handleSaveToBlockchain() {
    const actions: Array<TaskActionInput> = [];
    let galaxyData = { ...galaxy! };
    galaxyData.tasks.forEach((sector) => {
      actions.push({
        Add: {
          id: sector.blockchainId!,
          name: padString(sector.name),
          checked: sector.checked,
          description: sector.description,
        },
      });
      sector.children.forEach((system) => {
        actions.push({
          Add: {
            id: system.blockchainId!,
            name: padString(system.name),
            checked: system.checked,
            description: system.description,
          },
        });
        system.children.forEach((planet) => {
          actions.push({
            Add: {
              id: planet.blockchainId!,
              name: padString(planet.name),
              checked: planet.checked,
              description: planet.description,
            },
          });
        });
      });
    });
    const factory = new FuelmapTemplateFactory(wallet!);
    const { waitForResult, contractId, waitForTransactionId } =
      await factory.deploy();
    const transactionId = await waitForTransactionId();
    const { contract, transactionResult } = await waitForResult();
    galaxyData.blockchainId = contract.id.toAddress();

    const address = wallet!.address;
    const addressInput = { bits: address.toB256() };
    const addressIdentityInput = { Address: addressInput };
    const { waitForResult: waitForConstructor } = await (
      contract as FuelmapTemplate
    ).functions
      .constructor(addressIdentityInput, actions)
      .call();

    const r = await waitForConstructor();
    console.log("finished", contract.id);
    dispatch(deployGalaxy(galaxyData));
  }

  function handleDownload() {
    dispatch(downloadCurrentGalaxy());
  }
  return (
    <>
      <div className="save-display">
        <IonButton
          fill="clear"
          disabled={saveStatus != SaveStatus.NEED_TO_SAVE}
          onClick={handleSaveLocally}
        >
          <IonIcon icon={saveSharp} slot="icon-only" />
        </IonButton>
        {saveStatus == SaveStatus.NEED_TO_SAVE && <div className="indicator" />}
      </div>
      <IonButton
        fill="clear"
        onClick={handleDownload}
        disabled={saveStatus == undefined}
      >
        <IonIcon icon={downloadSharp} slot="icon-only" />
      </IonButton>
      <IonButton
        fill="clear"
        onClick={handleSaveToBlockchain}
        disabled={!wallet}
      >
        <IonIcon icon={bonfireSharp} slot="icon-only" />
      </IonButton>
    </>
  );
};

export default memo(SaveDisplay);
