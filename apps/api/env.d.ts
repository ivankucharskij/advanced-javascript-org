declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_SECRET?: string;
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
    WEB_ORIGIN?: string;
  }
}
