import { defineConfig } from "orval";

const typesOnlyClient = () => ({
  client: () => ({
    implementation: "",
    imports: [],
  }),
});

export default defineConfig({
  api: {
    input: {
      target: "./openapi.json",
    },
    output: {
      mode: "single",
      client: typesOnlyClient,
      target: "./src/generated/_orval.ts",
      schemas: "./src/generated/models",
      operationSchemas: "./src/generated/operations",
      clean: ["./src/generated"],
    },
  },
});
