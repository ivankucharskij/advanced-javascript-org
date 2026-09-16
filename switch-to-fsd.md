# Migrating `apps/web` to Feature-Sliced Design

This document describes the target architecture for the **frontend** application
in `apps/web`. It is a migration plan, not a proposal to rewrite the API,
`@repo/shared-types`, or backend routes at the same time.

## Why change the current structure

The code is currently organized primarily around Next routes and technical file
types:

- `src/app/challenges/_components/player.tsx` fetches data, runs mutations,
  manages session state, and renders the screen at the same time;
- `src/app/check-auth/page.tsx` contains HTTP calls, the SWR cache, the logic
  for five actions, the Google redirect, and the debug-screen markup;
- `src/api/challenges.ts`, `src/lib/fetchers.ts`, and `src/components/*` are
  separated from the domains that own them.

That is reasonable for a small application. As the number of screens grows,
however, route files become the place for all application logic. The migration
goal is to keep routes as entry points and organize the rest of the code by
responsibility.

## Feature-Sliced Design adapted for the Next.js App Router

The classic FSD layer is called `pages`, but `src/pages` has a special meaning
in Next.js: it enables the legacy Pages Router. This project therefore uses
`views` for the FSD Pages layer, avoiding a framework conflict.

`src/app` remains the Next.js App Router and acts as the FSD `app` layer:
providers, global styles, the root layout, metadata, and route entry points.
It does not contain domain logic. Route handlers in `src/app/api` are outside
the scope of this frontend refactor.

Target dependency direction:

```text
app (Next routing, providers)
  -> views (FSD Pages)
    -> widgets
      -> features
        -> entities
          -> shared
```

Imports are allowed only downward in this hierarchy. A layer must not import a
higher layer, and slices in the same layer should not depend on one another.

This project deliberately does **not** use barrel `index.ts` files. Consumers
import the exact module they need, for example
`@/features/answer-challenge/model/use-answer-challenge`. This makes a
dependency's origin visible, avoids an implicit public API, and prevents a
barrel from becoming a catch-all export surface. A slice's public modules are
the named files in this document; helpers that should stay private use a clear
`lib/` or `internal/` name and are not imported outside their slice.

## Target structure

```text
apps/web/src/
├── app/                              # Next routes and application setup
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── global.css
│   ├── challenges/
│   │   ├── page.tsx
│   │   ├── practice/page.tsx
│   │   └── review/page.tsx
│   ├── check-auth/page.tsx
│   └── api/                          # Outside this document's scope
├── views/                            # FSD Pages, not the Next Pages Router
│   ├── challenges/
│   │   └── ui/challenges-page.tsx
│   ├── challenge-session/
│   │   └── ui/challenge-session-page.tsx
│   └── auth-session-debug/
│       └── ui/auth-session-debug-page.tsx
├── widgets/
│   ├── challenge-player/
│   │   └── ui/challenge-player.tsx
│   └── challenge-dashboard/
│       └── ui/challenge-dashboard.tsx
├── features/
│   ├── answer-challenge/
│   │   ├── model/use-answer-challenge.ts
│   │   └── ui/answer-feedback.tsx
│   ├── restart-challenge-progress/
│   │   └── model/use-restart-challenge-progress.ts
│   ├── authenticate-with-google/
│   │   └── model/start-google-auth.ts
│   └── manage-guest-session/
│       └── model/use-guest-session-actions.ts
├── entities/
│   ├── challenge/
│   │   ├── api/challenge-api.ts
│   │   ├── model/use-challenge-dashboard.ts
│   │   ├── model/use-next-challenge.ts
│   │   ├── model/types.ts
│   │   └── ui/challenge-option.tsx
│   ├── user/
│   │   ├── api/user-api.ts
│   │   └── model/use-current-user.ts
│   └── guest-session/
│       ├── api/guest-session-api.ts
│       └── model/use-guest-session.ts
└── shared/
    ├── api/fetchers.ts
    ├── config/env-config.ts
    ├── lib/cn.ts
    ├── lib/source.ts
    ├── ui/button/button.tsx
    ├── ui/code-runner/code-runner.tsx
    └── ui/markdown/markdown.tsx
```

`snippets/` can remain alongside `shared/` when it is treated as static
content. If snippets become a business domain with fetching, editing, or
progress tracking, they should become `entities/snippet/`.

## Exact code moves

| Current code | Target | Reason |
| --- | --- | --- |
| `app/challenges/page.tsx` | `views/challenges` | Page composition; the route becomes a thin adapter. |
| `app/challenges/{practice,review}/page.tsx` | `views/challenge-session` | One page view accepts `mode`; routes only pass `practice` or `review`. |
| `app/challenges/_components/player.tsx` | `widgets/challenge-player` plus feature/entity hooks | The visual composition remains a widget; requests and mutations leave it. |
| `answer.tsx` | `features/answer-challenge/ui/answer-feedback.tsx` | It is feedback for the user action “answer a challenge”. |
| `option.tsx` | `entities/challenge/ui/challenge-option.tsx` | It displays a challenge option, a domain entity. |
| `dashboard.tsx`, `results.tsx` | `widgets/challenge-dashboard` | A larger, independent progress block. |
| `auth-required.tsx` | `features/authenticate-with-google/ui/auth-required.tsx` | It leads to an authentication action, not generic UI. |
| `api/challenges.ts` | `entities/challenge/api/challenge-api.ts` | Transport belongs alongside its domain. |
| `lib/fetchers.ts` | `shared/api/fetchers.ts` | The generic HTTP client has no domain knowledge. |
| `components/ui/button.tsx` | `shared/ui/button` | A reusable design-system primitive. |
| `components/code-runner.tsx` | `shared/ui/code-runner` initially | Generic code-execution UI; move it later only if it becomes challenge-specific. |
| `app/check-auth/page.tsx` | `views/auth-session-debug` plus user/guest-session features and entities | Separates diagnostic UI from session requests and actions. |

Existing types from `@repo/shared-types` remain the API contract. The entity
layer may re-export the types it needs from `model/types.ts`, but must not
duplicate backend schemas in the frontend.

## The referenced `check-auth` route after migration

The route becomes deliberately small:

```tsx
// src/app/check-auth/page.tsx
import { AuthSessionDebugPage } from "@/views/auth-session-debug/ui/auth-session-debug-page";

export default function CheckAuthRoute() {
  return <AuthSessionDebugPage />;
}
```

`AuthSessionDebugPage` renders the buttons and response panels. It composes:

- `useGuestSession()` from `entities/guest-session` to read the guest session;
- `useCurrentUser()` from `entities/user` to read `/api/me`;
- `useGuestSessionActions()` from `features/manage-guest-session` for the
  start, refresh, and discard mutations;
- `startGoogleAuth()` from `features/authenticate-with-google` for the browser
  redirect.

This preserves the current behavior while making each concern reusable. Since
this is a diagnostic page, separately decide whether it remains a
non-production route, is protected, or is removed; FSD does not make that
product or security decision.

## Incremental migration order

1. Create `shared/` and move generic code without changing public behavior:
   fetchers, utility functions, and UI primitives. Keep temporary re-export
   shims at old paths until imports have moved.
2. Introduce `entities/challenge`, `entities/user`, and
   `entities/guest-session`. Move request functions first, then read hooks.
   Keep every SWR key next to the request function that owns it.
3. Extract mutations into features: answer a challenge, restart progress,
   Google authentication, and guest-session management. A feature owns its
   action-specific pending/error state and cache invalidation.
4. Move presentational blocks to widgets and pages to `views/`. Convert Next
   `page.tsx` files into thin adapters only after their target view exists.
5. Remove compatibility re-exports and the now-empty `components/`, `api/`,
   and `lib/` locations. Add ESLint import-boundary rules to prevent
   regressions.

Migrate one slice at a time, starting with challenges or check-auth, rather
than moving the entire codebase in a single pull request. Every slice should
retain the same URLs, response types, SWR cache semantics, and visible
behavior.

## Resulting responsibilities

The challenge flow will become:

```text
Next route
  -> ChallengeSessionPage (view)
    -> ChallengePlayer (widget)
      -> useNextChallenge / useChallengeDashboard (challenge entity)
      -> useAnswerChallenge / useRestartChallengeProgress (features)
        -> challengeApi (challenge entity)
          -> fetchers (shared)
            -> /api/challenges/*
```

The widget may coordinate its children, but it must not construct HTTP
requests or implement answer/restart mutations. A feature may use the
challenge entity, but the challenge entity must never import a feature.
`shared` stays business-agnostic: no challenge-, user-, auth-, or
purchase-specific components belong there.

## Non-goals

- No REST contract, API route, or database changes.
- No mandatory global-state library: SWR remains suitable for server state,
  and local `useState` remains local unless state is genuinely shared.
- No artificial layer for tiny, one-off code. Create a slice when it has a
  clear domain or action responsibility, not merely because FSD has a
  directory available.
