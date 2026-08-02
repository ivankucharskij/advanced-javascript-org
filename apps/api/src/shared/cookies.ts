import { getEnv } from "../config/env.js";

export const shouldUseSecureCookies = () => {
  const { NODE_ENV, WEB_ORIGIN } = getEnv();

  if (WEB_ORIGIN) {
    return WEB_ORIGIN.startsWith("https://");
  }

  return NODE_ENV === "production";
};
