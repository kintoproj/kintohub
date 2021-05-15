import React, { useContext } from 'react';
import { REACT_APP_SERVER_URL } from 'libraries/envVars';
import { KintoCoreServiceClient } from 'types/proto/coreapi_pb_service';

export type GRPCClients = {
  kkcClient: KintoCoreServiceClient;
};

const GRPCClientContext = React.createContext<GRPCClients>({
  kkcClient: new KintoCoreServiceClient(REACT_APP_SERVER_URL),
});

type Props = {
  children: React.ReactNode;
};

export const GRPCClientsProvider = ({ children }: Props) => {
  return (
    <GRPCClientContext.Provider
      value={{
        kkcClient: new KintoCoreServiceClient(REACT_APP_SERVER_URL),
      }}
    >
      {children}
    </GRPCClientContext.Provider>
  );
};

// custom hooks
export const useGRPCClients = (): GRPCClients => {
  const clients = useContext(GRPCClientContext);
  return clients;
};
