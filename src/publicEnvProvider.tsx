'use client';
import * as React from 'react'; // Import the env from env/env.js
import { getPublicEnv, type PublicEnvType } from './publicEnv';

export const PublicEnvContext = React.createContext(null as PublicEnvType | null);

export const PublicEnvProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [envState, setEnvState] = React.useState<PublicEnvType | null>(null);
  // Create a reference to insure that the environment provider is only initialized once.
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      void getPublicEnv().then((env) => {
        setEnvState(env);
      });
    }
  }, []);

  return <PublicEnvContext.Provider value={envState}>{children}</PublicEnvContext.Provider>;
};

export const usePublicEnv = () => {
  return React.useContext(PublicEnvContext)!;
};
