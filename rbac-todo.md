# RBAC Todo

## Requirement Summary From `rbac.md`

- Build a backend application with a custom authentication and authorization system.
- Do not rely entirely on framework-provided auth/RBAC behavior.
- Store access-control structure in the database.
- Explain the access-control model in documentation.
- Return `401 Unauthorized` when the current user cannot be identified.
- Return `403 Forbidden` when the user is authenticated but lacks access.
- Allow an administrator to view and change user access rules.
- Seed enough test data to demonstrate the system.
- Add minimal mock business resources that prove the permission system works.

## Current Repo Baseline

- [x] Hono API exists in `apps/api`.
- [x] Next.js frontend exists in `apps/web`.
- [x] Prisma/Postgres setup is owned by `apps/api`.
- [x] User registration exists at `POST /api/auth/register`.
- [x] Login exists at `POST /api/auth/login`.
- [x] Password hashing exists via `argon2`.
- [x] JWT creation and verification exists in `apps/api/src/features/users/tokens.ts`.
- [x] Auth middleware resolves `currentUser` from bearer token or `accessToken` cookie.
- [x] Users have basic `role` and `status` fields.
- [x] Blocked users are rejected during login/auth.
- [x] Current task feature already demonstrates owner scoping through `userId`.
- [x] User list/block endpoints are currently admin-only.
- [ ] Logout endpoint is missing.
- [ ] Profile update endpoint is missing.
- [ ] Soft account deletion endpoint is missing.
- [ ] Registration does not include password confirmation.
- [ ] RBAC rules are not stored in database tables.
- [ ] Permissions are hard-coded in store methods.
- [ ] Admin cannot manage permissions dynamically.
- [ ] Mock business resources for permission demonstration are missing.
- [ ] README does not yet describe a full RBAC data model.

## Product Direction

Replace the current task-management surface with a simpler `documents` business resource for the final RBAC demo.

Documents make the permission model easier to understand than tasks:

- Ownership is obvious: my documents vs all documents.
- CRUD permissions map directly to `readOwn`, `readAll`, `create`, `updateOwn`, `updateAll`, `deleteOwn`, and `deleteAll`.
- The UI can stay focused on access decisions instead of task-specific fields like priority, due date, parent tasks, and filters.
- The demo can clearly show why a button or row is visible, editable, or forbidden.

Target user experience:

- `/documents` is the main app screen after login.
- `/admin/users` manages users and their roles.
- `/admin/roles` manages role permissions through a checkbox matrix.
- Normal users see and manage only their own documents.
- Managers can read all documents but only update their own unless granted broader permissions.
- Admins can manage all documents, users, roles, and permissions.

## Target RBAC Model

Use database-backed RBAC instead of only `User.role`.

- [ ] Add `Role` table.
  - Fields: `id`, `code`, `name`, `description`, `createdAt`, `updatedAt`.
  - Seed roles: `admin`, `manager`, `user`, optionally `guest`.

- [ ] Add `UserRoleAssignment` table.
  - Fields: `id`, `userId`, `roleId`, `createdAt`.
  - Add unique constraint on `userId + roleId`.
  - Keep one-role-per-user initially if simplicity matters, but model many-to-many for extensibility.

- [ ] Add `Resource` table.
  - Fields: `id`, `code`, `name`, `description`, `createdAt`, `updatedAt`.
  - Seed resources: `users`, `documents`, `access_rules`.

- [ ] Add `RolePermission` table.
  - Fields: `id`, `roleId`, `resourceId`.
  - Boolean permission fields:
    - `readOwn`
    - `readAll`
    - `create`
    - `updateOwn`
    - `updateAll`
    - `deleteOwn`
    - `deleteAll`
    - `manage`
  - Add unique constraint on `roleId + resourceId`.

- [ ] Decide how to represent inactive users.
  - Current enum has `ACTIVE` and `BLOCKED`.
  - Add `DELETED` or rename to a clearer business state if soft deletion must be distinct from admin block.

## Backend Implementation Plan

### Phase 1: Database Schema

- [ ] Update `apps/api/prisma/schema.prisma`.
- [ ] Add `Role`, `UserRoleAssignment`, `Resource`, and `RolePermission`.
- [ ] Add relations from `User` to role assignments.
- [ ] Add indexes for permission lookups:
  - `Role.code`
  - `Resource.code`
  - `UserRoleAssignment.userId`
  - `RolePermission.roleId`
  - `RolePermission.resourceId`
- [ ] Create a Prisma migration.
- [ ] Regenerate Prisma client.

### Phase 2: Seed Data

- [ ] Extend `apps/api/src/scripts/seed.ts`.
- [ ] Seed roles:
  - `admin`
  - `manager`
  - `user`
  - optional `guest`
- [ ] Seed resources:
  - `users`
  - `documents`
  - `access_rules`
- [ ] Seed permissions:
  - Admin can manage all resources.
  - User can read/create/update/delete own documents.
  - User can read/update own profile.
  - User cannot list all users or manage permissions.
  - Manager can read all documents and update own-created documents.
- [ ] Assign seeded users to roles through `UserRoleAssignment`.
- [ ] Seed documents owned by different users.
- [ ] Keep demo credentials in README after seed is updated.

### Phase 3: Authorization Service

- [ ] Create `apps/api/src/features/access/`.
- [ ] Add access schemas:
  - role schema
  - resource schema
  - permission schema
  - access decision schema
- [ ] Add an access store/service responsible for permission checks.
- [ ] Implement `can(currentUser, action, resourceCode, ownerId?)`.
- [ ] Map actions to permission fields:
  - `read` with owner -> `readOwn` or `readAll`
  - `create` -> `create`
  - `update` with owner -> `updateOwn` or `updateAll`
  - `delete` with owner -> `deleteOwn` or `deleteAll`
  - `manage` -> `manage`
- [ ] Admin role should pass all checks through permissions, not hard-coded role string checks.
- [ ] Keep a small explicit escape hatch only if needed for bootstrapping seeded admin.

### Phase 4: Middleware Helpers

- [ ] Keep `authMiddleware` focused on authentication only.
- [ ] Add authorization middleware/helper:
  - `requirePermission(resourceCode, action)`
  - `requireOwnedPermission(resourceCode, action, getOwnerId)`
- [ ] Ensure missing/invalid token returns `401`.
- [ ] Ensure authenticated user without permission returns `403`.
- [ ] Ensure blocked/deleted users cannot authenticate.

### Phase 5: User Account API

- [ ] Add `GET /api/users/me`.
- [ ] Add `PATCH /api/users/me` for profile update.
- [ ] Add `DELETE /api/users/me` for soft deletion.
  - Mark user inactive/deleted.
  - Clear auth cookie.
  - Prevent future login.
- [ ] Add `POST /api/auth/logout`.
  - Clear auth cookie.
  - Return success even if token is already absent.
- [ ] Add password confirmation to registration request schema.
- [ ] Make user-management endpoints use permission checks:
  - `GET /api/users` requires `users.readAll` or `users.manage`.
  - `GET /api/users/:id` allows own profile or permission.
  - `PATCH /api/users/:id/block` requires `users.manage`.

### Phase 6: Access Management API

- [ ] Add admin endpoints for roles:
  - `GET /api/access/roles`
  - `POST /api/access/roles`
  - `PATCH /api/access/roles/:id`
  - optional `DELETE /api/access/roles/:id`
- [ ] Add admin endpoints for resources:
  - `GET /api/access/resources`
  - `POST /api/access/resources`
  - `PATCH /api/access/resources/:id`
- [ ] Add admin endpoints for permissions:
  - `GET /api/access/permissions`
  - `PUT /api/access/roles/:roleId/resources/:resourceId`
- [ ] Add admin endpoints for user role assignments:
  - `GET /api/users/:id/roles`
  - `PUT /api/users/:id/roles`
- [ ] Protect all access-management endpoints with `access_rules.manage`.
- [ ] Add OpenAPI definitions for every endpoint.

### Phase 7: Replace Tasks With Documents

- [ ] Add `Document` model.
  - Fields: `id`, `title`, `content`, `category`, `ownerId`, `createdAt`, `updatedAt`.
  - Add relation from `Document.ownerId` to `User.id`.
  - Add index on `ownerId`.
- [ ] Add `apps/api/src/features/documents/`.
- [ ] Add document schemas and OpenAPI definitions.
- [ ] Add document store with permission-aware reads and writes.
- [ ] Add routes:
  - `GET /api/documents`
  - `GET /api/documents/:id`
  - `POST /api/documents`
  - `PATCH /api/documents/:id`
  - `DELETE /api/documents/:id`
- [ ] `GET /api/documents`:
  - If user has `documents.readAll`, allow all documents.
  - Else if user has `documents.readOwn`, filter by `ownerId = currentUser.id`.
  - Else return `403`.
- [ ] `GET /api/documents/:id`:
  - Load document owner.
  - Check `readOwn` or `readAll`.
- [ ] `POST /api/documents`:
  - Check `documents.create`.
  - Use current user as owner unless `documents.manage` allows assigning another owner.
- [ ] `PATCH /api/documents/:id`:
  - Load document owner.
  - Check `updateOwn` or `updateAll`.
- [ ] `DELETE /api/documents/:id`:
  - Load document owner.
  - Check `deleteOwn` or `deleteAll`.
- [ ] Remove or archive task routes/components after documents are in place.

### Phase 8: Documents UI

Use documents as the business resource that demonstrates authorization rules.

- [ ] Replace `/tasks` route with `/documents`.
- [ ] Build a clean document table or list.
- [ ] Show fields:
  - title
  - category
  - owner
  - updated date
- [ ] Add create/edit/delete document dialogs.
- [ ] Show or hide actions based on frontend permission hints.
- [ ] Always rely on backend permission checks for the final decision.
- [ ] Use this UI to demonstrate:
  - own-only access
  - all-record access
  - forbidden update/delete

## Frontend Plan

### Phase 1: Auth UX

- [ ] Add password confirmation to registration form.
- [ ] Add logout button/action.
- [ ] Add profile page or account dialog.
- [ ] Add soft-delete-account action with confirmation.
- [ ] Handle `401` by routing to login.
- [ ] Handle `403` with a clear forbidden state.

### Phase 2: Current User State

- [ ] Add `GET /api/users/me` client usage.
- [ ] Store current user and permissions in a small auth/session hook.
- [ ] Avoid trusting frontend permissions for security; use them only to hide/show UI.

### Phase 3: Admin RBAC Screens

- [ ] Add admin route for user management.
- [ ] Add user role assignment UI.
- [ ] Add role list/editor UI.
- [ ] Add resource permission matrix UI.
- [ ] Use checkboxes for permission booleans.
- [ ] Disable admin-only navigation for users without access.

### Phase 4: Documents Demo

- [ ] Add `/documents` page.
- [ ] Show create/edit/delete buttons only when frontend permissions allow.
- [ ] Still rely on backend for final access decision.
- [ ] Add forbidden and empty states.

## Documentation Plan

- [ ] Add RBAC model section to root `README.md`.
- [ ] Document database tables:
  - `roles`
  - `user_role_assignments`
  - `resources`
  - `role_permissions`
- [ ] Document permission semantics:
  - own vs all
  - manage
  - 401 vs 403
- [ ] Document seeded roles and demo users.
- [ ] Document example API calls for allowed and forbidden access.
- [ ] Document how to regenerate Prisma and API client after schema/API changes.

## Testing And Verification Plan

- [ ] Add API tests if a test runner is introduced.
- [ ] Minimum manual verification matrix:
  - Anonymous request to protected route returns `401`.
  - Normal user cannot list users and receives `403`.
  - Admin can list users.
  - Blocked/deleted user cannot login.
  - User can read own document.
  - User cannot read another user's document unless granted `readAll`.
  - Admin can update permissions.
  - Permission change affects subsequent requests.
  - Documents return allowed data for permitted roles.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build`.
- [ ] Run Prisma migration and seed from a clean database.
- [ ] Regenerate API client after OpenAPI changes.

## Suggested Implementation Order

- [ ] 1. Finalize RBAC schema and migration.
- [ ] 2. Seed roles, resources, permissions, and role assignments.
- [ ] 3. Build backend access service and permission helpers.
- [ ] 4. Replace hard-coded admin checks in users.
- [ ] 5. Add logout, profile update, and soft delete.
- [ ] 6. Add admin permission-management API.
- [ ] 7. Add documents API and migrate the app surface from tasks to documents.
- [ ] 8. Regenerate API client.
- [ ] 9. Add frontend auth/account updates.
- [ ] 10. Add admin RBAC UI.
- [ ] 11. Add documents UI.
- [ ] 12. Update README with final model and demo instructions.

## Design Notes For This Repo

- Prefer adding RBAC as a new `features/access` module instead of spreading permission logic across stores.
- Keep `authMiddleware` simple: authenticate only, set `currentUser`, and stop.
- Do permission checks in route/store boundaries before returning or mutating data.
- Use document ownership through `Document.ownerId` as the primary own-vs-all permission example.
- Treat the existing task feature as scaffolding that can be replaced, not as the final demo resource.
- Do not remove existing `User.role` immediately if it helps migration, but the final source of truth should be role assignment tables.
- Keep API responses and OpenAPI schemas consistent with the existing feature-folder pattern.
- Regenerate `@repo/api-client` after every OpenAPI change because the web app imports generated operation types.
