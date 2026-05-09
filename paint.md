# Collaborative Drawing Workout App Roadmap

## Goal

Reuse this monorepo as the foundation for a collaborative drawing workout app:
two or more users join the same workout session and draw on a shared canvas in
real time.

The current task app is not important. Keep the existing fullstack stack,
deployment shape, auth pattern, API structure, and generated API client, but
replace the product with live drawing sessions, stroke history, participants,
presence, reconnect recovery, and saved workout canvases.

The drawing surface should not sync full bitmap images during live drawing.
Treat the canvas as an event-driven system: `stroke.start`, `stroke.point`,
`stroke.end`, `undo`, `clear`, cursor movement, participant presence, and
server acknowledgements.

## Stack To Keep

- Monorepo: `pnpm`, Turborepo.
- API: Hono, TypeScript, Zod, `@hono/zod-openapi`, Prisma, PostgreSQL,
  `hono/jwt`.
- Web: Next.js App Router, React, TypeScript, MUI, MUI icons, SWR, axios,
  Zustand, react-hot-toast.
- API contract: OpenAPI from Hono/Zod and generated TypeScript client through
  `packages/api-client` for REST endpoints.
- Local state: Zustand for fast drawing state that should not re-render React on
  every pointer movement.
- Database: PostgreSQL through `DATABASE_URL`.
- Deployment: existing API Docker/Yandex Cloud flow, web deploys separately.

## Stack To Add

- WebSocket support in `apps/api`, preferably with Hono's Node WebSocket adapter
  for the first version.
- A shared realtime contract package, for example:

```text
packages/realtime-contract/
```

This package should contain TypeScript types and Zod schemas for drawing events,
ack/nack messages, cursors, presence, and reconnect payloads.

Can wait:

- Redis Streams or Redis Pub/Sub for multi-instance live sync.
- MessagePack or Protobuf for dense point events.
- Object Storage for long-term bitmap snapshots or exports.
- Dedicated worker service for snapshot generation.

## What Stays From This Repo

- The monorepo structure.
- `apps/api` as the authoritative backend.
- `apps/web` as the product frontend.
- `packages/api-client` for generated REST types.
- Shared ESLint and TypeScript config packages.
- Prisma and PostgreSQL.
- Existing auth direction: email/password, JWT, argon2, Hono middleware.
- Existing API feature-module pattern:

```text
*.schemas.ts
*.openapi.ts
*.controller.ts
*.service.ts
*.repository.ts
```

- Swagger/OpenAPI for REST routes.
- Deployment files and general environment-variable approach.
- MUI/SWR/Zustand frontend conventions.
- Toast feedback for API/socket errors and saved actions.

## What Gets Deleted Or Replaced

Delete or replace:

- `apps/api/src/features/tasks`
- `apps/web/src/features/tasks`
- `apps/web/src/app/tasks`
- Task Prisma model and task-related seed data.
- Task routes from `apps/api/src/router.ts`.
- Task generated API client types after regenerating from the new OpenAPI doc.
- Task copy in `README.md`.
- Demo task table, task filters, task forms, and task ordering state.

Keep but rename/adapt:

- User model.
- Auth endpoints.
- Auth middleware.
- API client generation flow.
- Root app shell and providers.
- Deployment docs.

Optional deletion later:

- Role/admin user blocking UI if the drawing product does not need admin
  moderation in MVP.

## Product Direction

The app should have three connected surfaces:

- A live collaborative canvas for a workout session.
- A session dashboard with participants, status, saved drawings, and recent
  activity.
- A personal gallery/history of completed drawing workouts.

Main user workflow:

1. User signs in or starts an anonymous local trial session.
2. User creates a drawing workout session.
3. User invites another participant or joins an existing session.
4. Both users draw on the same canvas with immediate local feedback.
5. Server validates events, assigns sequence numbers, and broadcasts events to
   the room.
6. Client reconciles local pending strokes with server-confirmed events.
7. User can undo own latest stroke, clear canvas if permitted, or finish the
   workout.
8. Completed session is saved and can be replayed or viewed later.

## Frontend Plan

Use `apps/web` as a custom Next.js App Router app.

Routes:

```text
/
/sessions
/sessions/new
/sessions/[sessionId]
/sessions/[sessionId]/replay
/gallery
/login
/account
```

Feature structure:

```text
apps/web/src/features/
  auth/
  drawing-canvas/
  workout-sessions/
  gallery/
```

Drawing canvas files:

```text
drawing-canvas/
  components/
    drawing-canvas.tsx
    drawing-toolbar.tsx
    participants-overlay.tsx
    connection-status.tsx
  hooks/
    useDrawingSocket.ts
    useCanvasRenderer.ts
    usePointerDrawing.ts
  store/
    useDrawingStore.ts
  types.ts
```

State split:

- Zustand local drawing state:
  - current tool
  - color
  - width
  - current local stroke
  - pending local events
  - remote cursors
  - socket connection status
  - last seen server sequence
- SWR server state:
  - session metadata
  - participants
  - permissions
  - initial snapshot/strokes for reconnect
  - completed workout summary
- Canvas imperative state:
  - draw directly to `<canvas>`
  - batch point rendering with `requestAnimationFrame`
  - avoid React state updates for every pointer event

UI:

- Use MUI for app shell, dialogs, toolbars, lists, tabs, forms, menus, sliders,
  icon buttons, tooltips, and status indicators.
- Use MUI icons for toolbar buttons: pen, eraser, undo, clear, color, width,
  invite, finish, reconnect.
- Keep the first screen useful: recent sessions, create session, join session.
- Do not make the drawing canvas a marketing landing page.

## Backend Plan

Use `apps/api` and keep the existing feature structure:

```text
features/
  auth/
  users/
  workout-sessions/
  drawing-strokes/
  drawing-snapshots/
```

Add realtime modules outside REST features:

```text
realtime/
  drawing-room-manager.ts
  drawing-events.ts
  drawing-sequencer.ts
  drawing-persistence.ts
  websocket-auth.ts
```

REST endpoints:

```text
POST /api/workout-sessions
GET  /api/workout-sessions
GET  /api/workout-sessions/:id
POST /api/workout-sessions/:id/join
POST /api/workout-sessions/:id/finish
GET  /api/workout-sessions/:id/canvas
GET  /api/workout-sessions/:id/events
POST /api/workout-sessions/:id/realtime-ticket
```

WebSocket endpoint:

```text
GET /api/realtime/drawing?ticket=...
```

The server is authoritative:

- Validate user identity and session membership.
- Validate all incoming events with Zod.
- Assign monotonically increasing `serverSeq` per workout session.
- Deduplicate by `idempotencyKey`.
- Return ack/nack for client actions.
- Broadcast accepted events to all participants in the room.
- Persist aggregated strokes, not every mousemove as a permanent row.
- Support reconnect with `lastSeenSeq`.

## Realtime Event Contract

Client events:

```text
session.join
stroke.start
stroke.point
stroke.end
cursor.move
undo.request
clear.request
heartbeat
```

Server events:

```text
session.joined
event.ack
event.nack
stroke.started
stroke.point
stroke.ended
cursor.moved
stroke.undone
canvas.cleared
participant.joined
participant.left
reconnect.required
heartbeat.ack
```

Each mutating client event should include:

```text
sessionId
userId
clientSeq
idempotencyKey
ts
```

Each accepted server event should include:

```text
sessionId
serverSeq
acceptedAt
```

Point event example:

```json
{
  "type": "stroke.point",
  "sessionId": "session_123",
  "strokeId": "stroke_456",
  "userId": "user_789",
  "x": 120.5,
  "y": 88.25,
  "pressure": 0.71,
  "ts": 1778336400000,
  "clientSeq": 42,
  "idempotencyKey": "user_789:42"
}
```

## Data Model

Replace task models with drawing/workout models.

Minimum Prisma models:

```text
User
  id
  fullName
  email
  password
  imageUrl
  role
  status
  createdAt
  updatedAt

WorkoutSession
  id
  title
  status
  ownerId
  canvasWidth
  canvasHeight
  lastServerSeq
  startedAt
  finishedAt
  createdAt
  updatedAt

WorkoutParticipant
  id
  sessionId
  userId
  role
  joinedAt
  leftAt

DrawingStroke
  id
  sessionId
  userId
  tool
  color
  width
  pointsJson
  serverSeqStart
  serverSeqEnd
  undoneAt
  createdAt

DrawingCanvasEvent
  id
  sessionId
  userId
  type
  payloadJson
  idempotencyKey
  clientSeq
  serverSeq
  createdAt

DrawingSnapshot
  id
  sessionId
  serverSeq
  imageUrl
  strokesJson
  createdAt
```

MVP simplification:

- Use `DrawingStroke` for durable history.
- Use `DrawingCanvasEvent` only for important events and reconnect gaps.
- Persist point arrays inside `DrawingStroke.pointsJson`.
- Skip `DrawingSnapshot.imageUrl` until sessions become large.

## Persistence Strategy

Live sync:

- MVP: in-memory room manager inside one API instance.
- Later: Redis Pub/Sub or Redis Streams between API instances.

Durable storage:

- Save aggregated strokes to Postgres on `stroke.end`.
- Save undo/clear events so replay stays correct.
- Save session metadata and participants in Postgres.

Reconnect:

- Client stores `lastSeenSeq`.
- On reconnect, call `GET /api/workout-sessions/:id/events?afterSeq=...`.
- If events are still available, replay missing events.
- If there is a gap, fetch latest snapshot plus events after the snapshot.

Snapshotting:

- Can wait for MVP.
- Add periodic snapshots every N strokes or every N seconds only after replay
  becomes slow.

## Reconciliation Plan

Client drawing flow:

1. User presses pointer down.
2. Client creates `strokeId` and `clientSeq`.
3. Client draws locally immediately.
4. Client sends `stroke.start`.
5. Pointer movement adds local points and sends throttled/batched
   `stroke.point` events.
6. Pointer up sends `stroke.end`.
7. Server responds with `event.ack` and broadcasts authoritative events.
8. Client marks pending stroke as confirmed.

If the server rejects an event:

- Show toast only for meaningful errors, not every transient point issue.
- Remove or mark rejected local pending events.
- Rebuild canvas from latest server snapshot, confirmed events, and still
  pending local events.

If events arrive out of order:

- Buffer events with future `serverSeq`.
- Apply events only when the next sequence is available.
- If the gap does not close quickly, request missing events by `lastSeenSeq`.

## Auth And Permissions

Keep custom auth in Hono.

Required permissions:

- Owner can finish session.
- Owner can clear canvas.
- Participant can draw if session is active.
- Participant can undo own latest stroke.
- Admin can view sessions if moderation is kept.

Auth endpoints can stay close to the current app:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

WebSocket auth:

- Browser requests a short-lived realtime ticket over REST.
- WebSocket connects with that ticket.
- Server resolves ticket to `userId` and `sessionId`.
- Ticket expires quickly and is single-use if practical.

## MVP Delivery Plan

### Phase 1 - Product Reset

- [ ] Create `paint.md` as the drawing app roadmap.
- [ ] Decide app name and route names.
- [ ] Keep the current monorepo, API, web, Prisma, and deployment structure.
- [ ] Remove task UI after the drawing session shell exists.
- [ ] Replace task copy in README after the first drawing flow works.

Acceptance:

- The repo direction is clear.
- No new frontend/backend framework is introduced.

### Phase 2 - Data Model And REST Sessions

- [ ] Replace task Prisma model with workout session, participant, stroke, event,
      and snapshot models.
- [ ] Add Prisma migration.
- [ ] Add workout session feature module.
- [ ] Add session create/list/detail/join/finish endpoints.
- [ ] Add canvas bootstrap endpoint.
- [ ] Regenerate `packages/api-client`.

Acceptance:

- Signed-in user can create and join a workout session.
- Session metadata is persisted in Postgres.

### Phase 3 - WebSocket MVP

- [ ] Add WebSocket support to `apps/api`.
- [ ] Add shared realtime contract types and Zod schemas.
- [ ] Implement in-memory drawing rooms.
- [ ] Implement `stroke.start`, `stroke.point`, and `stroke.end`.
- [ ] Implement server sequence numbers.
- [ ] Implement ack/nack.
- [ ] Persist completed strokes on `stroke.end`.

Acceptance:

- Two browser tabs can draw in the same session.
- The server, not the client, assigns authoritative order.

### Phase 4 - Canvas Frontend

- [ ] Add `/sessions` and `/sessions/[sessionId]`.
- [ ] Add canvas component using imperative Canvas API.
- [ ] Add drawing toolbar: pen, color, width, undo, clear.
- [ ] Add Zustand drawing store.
- [ ] Add socket hook with reconnect state.
- [ ] Add participant/cursor overlay.

Acceptance:

- Local drawing feels immediate.
- Remote strokes appear without full page or React rerender churn.

### Phase 5 - Reconnect And Reconciliation

- [ ] Track `lastSeenSeq` on the client.
- [ ] Add missing event replay endpoint.
- [ ] Rebuild canvas from persisted strokes/events after reload.
- [ ] Keep pending local events separate from confirmed server events.
- [ ] Handle duplicate ack and duplicate server event cases.
- [ ] Add heartbeat and reconnect timeout handling.

Acceptance:

- Reloading a session restores the drawing.
- Temporary disconnect does not lose confirmed strokes.

### Phase 6 - Undo, Clear, And Finish

- [ ] Add `undo.request` for own latest stroke.
- [ ] Add `clear.request` with owner permission.
- [ ] Persist undo/clear events.
- [ ] Add finish session endpoint and UI.
- [ ] Make finished sessions read-only.

Acceptance:

- Undo and clear stay consistent across users and reloads.
- Completed sessions cannot be accidentally modified.

### Phase 7 - Gallery And Replay

- [ ] Add `/gallery`.
- [ ] List completed sessions.
- [ ] Add read-only canvas viewer.
- [ ] Add simple replay by server sequence.
- [ ] Add session summary: participants, duration, stroke count.

Acceptance:

- User can revisit completed drawing workouts.
- Replay uses event history, not a live socket.

### Phase 8 - Production Hardening

- [ ] Add rate limits for point events.
- [ ] Batch or throttle point events on the client.
- [ ] Add Redis Pub/Sub or Redis Streams for multi-instance deployment.
- [ ] Add periodic snapshots if replay becomes slow.
- [ ] Add monitoring for room count, socket count, reconnects, nack rate, and
      event lag.
- [ ] Add load testing with multiple simulated participants.
- [ ] Update deployment docs for WebSocket support.

Acceptance:

- The app can run beyond a single local API instance.
- Realtime behavior is observable and debuggable.

## Testing Plan

Backend:

- Sequencer unit tests.
- Idempotency key tests.
- Permission tests.
- Reconnect `afterSeq` tests.
- Stroke persistence tests.

Frontend:

- Zustand store tests for pending/confirmed/rejected events.
- Canvas renderer smoke tests where practical.
- Manual two-tab test for live drawing.
- Manual disconnect/reconnect test.
- Manual reload and replay test.

Commands:

```bash
pnpm --filter api lint
pnpm --filter web lint
pnpm build
```

## Can Wait

- Redis and multi-instance realtime.
- Binary protocol for point events.
- Pressure/tilt polishing beyond basic pointer support.
- Infinite canvas.
- Layers.
- Selection and transform tools.
- Voice/video during workouts.
- Public templates.
- Admin moderation dashboard.
- AI drawing feedback.
- Export to PNG/PDF.
- Object Storage for generated snapshots.

## Estimated Time

MVP with two users, one API instance, JSON WebSocket, Postgres stroke
persistence, reconnect, undo, and clear:

```text
4-6 working days
```

Production-ready version with Redis Streams, snapshots, observability, load
testing, deployment hardening, and replay polish:

```text
2-3 weeks
```

Suggested implementation order:

1. REST session model and endpoints.
2. WebSocket protocol and room manager.
3. Canvas UI and local optimistic drawing.
4. Reconnect/replay.
5. Undo/clear/finish.
6. Gallery and production hardening.

## Final Positioning

Use this as the main repo:

> A collaborative drawing workout app built with Next.js App Router, Hono,
> Prisma, PostgreSQL, custom JWT auth, OpenAPI-generated REST types, a shared
> realtime event contract, optimistic canvas rendering, server-authoritative
> WebSocket sync, reconnect recovery, saved sessions, and replayable drawing
> history.
