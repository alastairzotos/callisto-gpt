import getConfig from "next/config";

export const getEnv = () => ({
  defaultServerUrl: getConfig().publicRuntimeConfig.NEXT_PUBLIC_DEFAULT_SERVER_URL as string,
});
