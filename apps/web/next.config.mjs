/* global process */

import path from "node:path";
import { fileURLToPath } from "node:url";

import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiUrl = process.env.LOCAL_API_URL ?? "http://localhost:8080";
const apiDestination = apiUrl.replace(/\/$/, "");
const legacyRedirects = [
  ["/advanced-javascript.pdf", "/"],
  ["/get-started", "/"],
  ["/graph-algorithms", "/graph-traversal"],
  ["/graph-algorithms/graph-traversal", "/graph-traversal"],
  ["/js-native/map-ds", "/map-and-set"],
  ["/js-native/mutating-methods", "/array-methods"],
  ["/js-native/promises", "/promises"],
  ["/js-native/read-only-methods", "/array-methods"],
  ["/js-native/set-and-object", "/map-and-set"],
  ["/js-native/transform-methods", "/array-methods"],
  ["/learn-js-and-mdn", "/core-concepts"],
  ["/learn-js-and-mdn/advanced-patterns", "/core-concepts"],
  ["/learn-js-and-mdn/async-and-timers", "/event-loop"],
  ["/learn-js-and-mdn/core-concepts", "/core-concepts"],
  ["/learn-js-and-mdn/event-loop", "/event-loop"],
  ["/learn-js-and-mdn/object-methods", "/core-concepts"],
  ["/react", "/composition-vs-inheritance"],
  ["/lodash/array-helpers", "/lodash"],
  ["/lodash/difference-and-intersection", "/lodash"],
  ["/lodash/sets-and-objects", "/lodash"],
  ["/react/rendering", "/composition-vs-inheritance"],
  ["/system-design", "/solid"],
  ["/system-design/redux-and-twitter", "/solid"],
  ["/system-design/stack-and-queue", "/map-and-set"],
  ["/theory", "/solid"],
  ["/theory/composition-vs-inheritance", "/composition-vs-inheritance"],
  ["/theory/solid-react", "/solid"],
  ["/theory/type-conversions", "/type-conversions"],
  ["/various", "/random"],
  ["/various/call-bind-apply", "/core-concepts"],
  ["/various/dictionary-of-nested", "/dictionary-of-nested"],
  ["/various/group-list-by-quarters", "/group-list-by-quarters"],
  ["/various/list-to-tree", "/list-to-tree"],
  ["/various/promises-closures-async", "/promises"],
  ["/various/sorting", "/sorting"],
  ["/various/utils", "/random"],
].map(([source, destination]) => ({
  source,
  destination,
  permanent: true,
}));

/** @type {import('next').NextConfig} */
const config = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  reactStrictMode: true,
  async redirects() {
    return legacyRedirects;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiDestination}/api/:path*`,
      },
    ];
  },
};

export default withMDX(config);
