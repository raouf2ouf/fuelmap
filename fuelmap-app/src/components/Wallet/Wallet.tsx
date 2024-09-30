import { memo, useEffect, useMemo } from "react";
import {
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useNetwork,
  useWallet,
} from "@fuels/react";

import "./Wallet.scss";
import { IonButton } from "@ionic/react";
import { providerUrl } from "$fuels/lib";
const Wallet: React.FC = () => {
  const { connect } = useConnectUI();
  const { disconnect } = useDisconnect();
  const { isConnected, refetch } = useIsConnected();
  const { network } = useNetwork();
  const { wallet } = useWallet();
  const address = useMemo(() => wallet?.address.toB256(), [wallet]);

  const isConnectedToCorrectNetwork = network?.url === providerUrl;

  useEffect(() => {
    refetch();
  }, [refetch]);

  function shortenAddress(addr: any) {
    return addr?.slice(0, 7) || "" + "..." + addr?.slice(-5) || "";
  }

  function handleConnect() {
    connect();
  }

  function handleDisconnect() {
    disconnect();
  }

  return (
    <div className="wallet-container">
      {isConnected ? (
        isConnectedToCorrectNetwork ? (
          <IonButton fill="outline">Wrong network!</IonButton>
        ) : (
          <IonButton fill="outline" onClick={handleDisconnect}>
            {shortenAddress(address)}
          </IonButton>
        )
      ) : (
        <IonButton fill="outline" onClick={handleConnect}>
          Connect Wallet
        </IonButton>
      )}
    </div>
  );
};

export default memo(Wallet);
