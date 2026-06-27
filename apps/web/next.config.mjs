/* global process */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiUrl = process.env.LOCAL_API_URL ?? 'http://localhost:8080';
const apiDestination = apiUrl.replace(/\/$/, '');

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../..'),
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiDestination}/api/:path*`,
      },
    ];
  },
};

export default withMDX(config);
