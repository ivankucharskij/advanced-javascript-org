declare namespace NodeJS {
  interface ProcessEnv {
    ADMIN_CODE?: string;
    AUTH_SECRET?: string;
    GOOSE_DBSTRING?: string;
    GOOSE_DRIVER?: string;
    GOOSE_MIGRATION_DIR?: string;
    GOOSE_TABLE?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_REDIRECT_URI?: string;
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
    WEB_ORIGIN?: string;
    DB_CONNECTION_STRING?: string;
  }
}
