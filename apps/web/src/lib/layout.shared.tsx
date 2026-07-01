import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        text: "Core Concepts",
        url: "/core-concepts",
        active: "nested-url",
      },
      {
        text: "Event Loop",
        url: "/event-loop",
        active: "nested-url",
      },
      {
        text: "Promises",
        url: "/promises",
        active: "nested-url",
      },
      {
        text: "Data Structures",
        url: "/map-and-set",
        active: "nested-url",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
