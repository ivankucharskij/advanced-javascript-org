declare namespace NodeJS {
  interface ProcessEnv {
    LOCAL_API_URL?: string;
    NODE_ENV?: "development" | "production" | "test";
    OPENAPI_URL?: string;
    PORT?: string;
  }
}
