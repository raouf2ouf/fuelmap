import { ReactNode } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { defaultConnectors } from "@fuels/connectors";
import { FuelProvider as FuelProviderReact } from "@fuels/react";
import { Provider as FuelProvider } from "fuels";
import { providerUrl } from "$fuels/lib";

const queryClient = new QueryClient();

const connectors = defaultConnectors({
  devMode: true,
  burnerWalletConfig: { fuelProvider: FuelProvider.create(providerUrl) },
});

export function Providers(props: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProviderReact theme="dark" fuelConfig={{ connectors }}>
        <Provider store={store}>{props.children}</Provider>;
      </FuelProviderReact>
    </QueryClientProvider>
  );
}
