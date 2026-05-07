# RBAC Todo

## Requirement Summary From `rbac.md`

- Build a backend application with a custom authentication and authorization system.
- Do not rely entirely on framework-provided auth/RBAC behavior.
- Store access-control structure in the database.
- Explain the access-control model in documentation.
- Return `401 Unauthorized` when the current user cannot be identified.
- Return `403 Forbidden` when the user is authenticated but lacks access.
- Allow an administrator/company owner to view and change user access rules.
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
- [ ] Project access rules are not stored in database tables yet.
- [ ] Permissions are still hard-coded in store methods.
- [ ] Company owner cannot manage project membership yet.
- [ ] Final company/project/task business resources are not implemented yet.
- [ ] README does not yet describe the final access-control data model.

## Product Direction

Build the app around a simple company/project/task access model instead of a fully dynamic custom-role system.

The access model should stay intentionally small:

- Every registered user gets a company created during registration.
- The registering user becomes that company's owner.
- A company owner can create projects, add users to projects, create tasks, edit tasks, delete tasks, and change any task status.
- Regular users can access only projects where they are listed as project members.
- Project members can see all tasks in those projects and change task statuses.
- Project members cannot create tasks, edit task fields other than status, delete tasks, or manage project membership.
- Custom roles should be dropped for now because they add too much implementation and UI complexity for this project.

Core permission rule:

```txt
Project access controls visibility and status updates.
Company ownership controls management.
```

Target user experience:

- `/tasks` or `/projects` is the main app screen after login.
- Company owners see all company projects and tasks.
- Company owners can manage project membership and task data.
- Regular users see only projects they have access to.
- Regular users can open any task in those projects and update only the task status.
- A "My Tasks" view can be added if task assignment is kept, but assignment should not control project visibility.

## Target Access Model

Use database-backed company ownership and project membership instead of dynamic RBAC tables.

- [ ] Add `Company` table.
  - Fields: `id`, `name`, `ownerId`, `createdAt`, `updatedAt`.
  - `ownerId` references `User.id`.
  - The company owner is the implicit admin for that company.

- [ ] Update `User` table.
  - Fields should include `id`, `companyId`, `email`, `name`, `createdAt`, `updatedAt`.
  - `companyId` references `Company.id`.
  - Keep `email` unique.
  - Decide whether to keep existing `role` temporarily only for migration; it should not drive final permissions.

- [ ] Add `Project` table.
  - Fields: `id`, `companyId`, `ownerId`, `name`, `description`, `createdAt`, `updatedAt`.
  - `companyId` references `Company.id`.
  - `ownerId` references `User.id`.
  - Add indexes on `companyId` and `ownerId`.

- [ ] Add `ProjectMember` table.
  - Fields: `projectId`, `userId`, `addedAt`.
  - `projectId` references `Project.id`.
  - `userId` references `User.id`.
  - Primary key: `projectId + userId`.
  - Use this table to decide which regular users can see a project and update task statuses inside it.

- [ ] Add `Task` table.
  - Fields: `id`, `companyId`, `projectId`, `title`, `description`, `status`, `priority`, `dueDate`, `createdAt`, `updatedAt`.
  - `companyId` references `Company.id`.
  - `projectId` references `Project.id`.
  - Add indexes on `companyId`, `projectId`, `status`, and `dueDate`.
  - Keep `companyId` directly on tasks even though it can be inferred from project, because it makes company scoping and authorization simpler.

- [ ] Optional: keep/add `TaskAssignee` table.
  - Fields: `taskId`, `userId`, `assignedAt`.
  - Primary key: `taskId + userId`.
  - Use this only for "assigned to me" views and responsibility tracking.
  - Do not use assignment as the main visibility rule; project membership controls visibility.

- [ ] Decide how to represent inactive users.
  - Current enum has `ACTIVE` and `BLOCKED`.
  - Add `DELETED` or rename to a clearer business state if soft deletion must be distinct from admin block.

### Permission Rules

- [ ] Anonymous or invalid token requests to protected routes return `401`.
- [ ] Authenticated users without access return `403`.
- [ ] Blocked/deleted users cannot authenticate.
- [ ] Company owners can:
  - read all company projects and tasks
  - create/edit/delete projects
  - add/remove project members
  - create/edit/delete tasks
  - change any task status
  - invite/manage users in their company
- [ ] Project members can:
  - read projects where they are in `ProjectMember`
  - read all tasks in those projects
  - change task status in those projects
- [ ] Project members cannot:
  - create tasks
  - edit task title, description, priority, due date, project, or assignees
  - delete tasks
  - manage project membership
  - see projects where they are not a member
- [ ] Every project/task query must be scoped by `companyId`.

## Backend Implementation Plan

### Phase 1: Database Schema

- [ ] Update `apps/api/prisma/schema.prisma`.
- [ ] Add `Company`, `Project`, `ProjectMember`, `Task`, and optionally `TaskAssignee`.
- [ ] Update `User` with `companyId` and company relations.
- [ ] Add indexes for access lookups:
  - `Company.ownerId`
  - `User.companyId`
  - `Project.companyId`
  - `Project.ownerId`
  - `ProjectMember.userId`
  - `Task.companyId`
  - `Task.projectId`
  - `Task.status`
- [ ] Create a Prisma migration.
- [ ] Regenerate Prisma client.

### Phase 2: Registration And Seed Data

- [ ] Update registration so it creates a user and a company together.
- [ ] Register flow:
  - validate name, email, password, and repeated password
  - create the user
  - create a company owned by the user
  - attach the user to the company
  - return/login the user as the company owner
- [ ] Extend `apps/api/src/scripts/seed.ts`.
- [ ] Seed at least one company.
- [ ] Seed one company owner.
- [ ] Seed several regular users in the same company.
- [ ] Seed multiple projects for that company.
- [ ] Seed `ProjectMember` rows showing that different users can access different projects.
- [ ] Seed tasks across different projects.
- [ ] Optionally seed task assignees for "My Tasks".
- [ ] Keep demo credentials in README after seed is updated.

### Phase 3: Authorization Service

- [ ] Create `apps/api/src/features/access/`.
- [ ] Add access helpers based on company ownership and project membership.
- [ ] Implement `isCompanyOwner(currentUser)`.
- [ ] Implement `canReadProject(currentUser, projectId)`.
- [ ] Implement `canManageProject(currentUser, projectId)`.
- [ ] Implement `canReadTask(currentUser, taskId)`.
- [ ] Implement `canManageTask(currentUser, taskId)`.
- [ ] Implement `canUpdateTaskStatus(currentUser, taskId)`.
- [ ] Keep `authMiddleware` focused on authentication only.
- [ ] Use access helpers in route/store boundaries before returning or mutating data.

### Phase 4: Middleware Helpers

- [ ] Keep `authMiddleware` focused on authentication only.
- [ ] Add authorization middleware/helper:
  - `requireCompanyOwner()`
  - `requireProjectAccess(getProjectId)`
  - `requireProjectManagement(getProjectId)`
  - `requireTaskAccess(getTaskId)`
  - `requireTaskStatusAccess(getTaskId)`
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
- [ ] Make user-management endpoints use company ownership checks:
  - `GET /api/users` returns users from the current user's company; owner only unless regular users need a project-member picker.
  - `GET /api/users/:id` allows own profile or company owner.
  - `PATCH /api/users/:id/block` requires company owner.

### Phase 6: Company And Project API

- [ ] Add company endpoint:
  - `GET /api/company`
- [ ] Add project endpoints:
  - `GET /api/projects`
  - `GET /api/projects/:id`
  - `POST /api/projects`
  - `PATCH /api/projects/:id`
  - `DELETE /api/projects/:id`
- [ ] `GET /api/projects`:
  - owner sees all company projects
  - regular user sees only projects where they are in `ProjectMember`
- [ ] `GET /api/projects/:id`:
  - owner can access
  - project member can access
  - otherwise return `403`
- [ ] `POST /api/projects`, `PATCH /api/projects/:id`, and `DELETE /api/projects/:id`:
  - company owner only
- [ ] Add project member endpoints:
  - `GET /api/projects/:id/members`
  - `POST /api/projects/:id/members`
  - `DELETE /api/projects/:id/members/:userId`
- [ ] Project member management:
  - company owner only
  - only users from the same company can be added
- [ ] Add OpenAPI definitions for every endpoint.

### Phase 7: Task API

- [ ] Add/update `apps/api/src/features/tasks/`.
- [ ] Add task schemas and OpenAPI definitions.
- [ ] Add task store with company-scoped, permission-aware reads and writes.
- [ ] Add routes:
  - `GET /api/projects/:projectId/tasks`
  - `GET /api/tasks/:id`
  - `POST /api/projects/:projectId/tasks`
  - `PATCH /api/tasks/:id`
  - `PATCH /api/tasks/:id/status`
  - `DELETE /api/tasks/:id`
- [ ] `GET /api/projects/:projectId/tasks`:
  - owner can read all tasks in company project
  - project members can read all tasks in that project
  - non-members receive `403`
- [ ] `GET /api/tasks/:id`:
  - owner can read
  - project member can read
  - otherwise return `403`
- [ ] `POST /api/projects/:projectId/tasks`:
  - company owner only
- [ ] `PATCH /api/tasks/:id`:
  - company owner only for title, description, priority, due date, project, and assignees
- [ ] `PATCH /api/tasks/:id/status`:
  - company owner can update
  - project member can update
  - validate status transitions if business rules are added later
- [ ] `DELETE /api/tasks/:id`:
  - company owner only
- [ ] Optional assignee endpoints:
  - `POST /api/tasks/:id/assignees`
  - `DELETE /api/tasks/:id/assignees/:userId`
  - company owner only

### Phase 8: Project And Task UI

Use projects and tasks as the business resources that demonstrate authorization rules.

- [ ] Keep `/tasks` or add `/projects` as the main authenticated app surface.
- [ ] Owner view:
  - all company projects
  - project create/edit/delete controls
  - project member management
  - task create/edit/delete controls
  - status controls
- [ ] Regular user view:
  - only accessible projects
  - all tasks inside accessible projects
  - status controls only
  - no create/edit/delete task buttons
  - no project management controls
- [ ] Optional "My Tasks" view:
  - uses `TaskAssignee`
  - shows assigned tasks across accessible projects
  - does not replace project membership authorization
- [ ] Always rely on backend access checks for the final decision.
- [ ] Use frontend access hints only to hide/show controls.

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

### Phase 3: Company Owner Screens

- [ ] Add owner-only user management route.
- [ ] Add project member management UI.
- [ ] Disable owner-only navigation for regular users.
- [ ] Do not build dynamic custom role or permission matrix screens.

### Phase 4: Projects And Tasks

- [ ] Add project list/page.
- [ ] Add project detail with task list.
- [ ] Show task fields:
  - title
  - description
  - status
  - priority
  - due date
  - updated date
- [ ] Owner can see create/edit/delete task controls.
- [ ] Regular project members can see only status controls.
- [ ] Add forbidden and empty states.

## Documentation Plan

- [ ] Add RBAC model section to root `README.md`.
- [ ] Document database tables:
  - `companies`
  - `users`
  - `projects`
  - `project_members`
  - `tasks`
  - `task_assignees` if used
- [ ] Document permission semantics:
  - company owner vs project member
  - company scoping
  - project access
  - status-only updates for project members
  - 401 vs 403
- [ ] Document seeded companies, users, projects, and tasks.
- [ ] Document example API calls for allowed and forbidden access.
- [ ] Document how to regenerate Prisma and API client after schema/API changes.

## Testing And Verification Plan

- [ ] Add API tests if a test runner is introduced.
- [ ] Minimum manual verification matrix:
  - Anonymous request to protected route returns `401`.
  - Regular user cannot manage company users and receives `403`.
  - Company owner can list/manage company users.
  - Blocked/deleted user cannot login.
  - Registration creates both user and company.
  - Company owner can create a project.
  - Company owner can add a user to a project.
  - Project member can see that project.
  - Project member cannot see a project where they are not a member.
  - Project member can see all tasks in an accessible project.
  - Project member can update task status in an accessible project.
  - Project member cannot create, edit, or delete tasks.
  - Company owner can create, edit, delete, and update status for tasks.
  - Users cannot access data from another company.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm build`.
- [ ] Run Prisma migration and seed from a clean database.
- [ ] Regenerate API client after OpenAPI changes.

## Suggested Implementation Order

- [ ] 1. Finalize company/project/task schema and migration.
- [ ] 2. Update registration to create user plus company owner.
- [ ] 3. Seed company, owner, users, projects, project members, and tasks.
- [ ] 4. Build backend access service and permission helpers.
- [ ] 5. Replace hard-coded admin checks with company owner checks.
- [ ] 6. Add logout, profile update, and soft delete.
- [ ] 7. Add project and project-member APIs.
- [ ] 8. Add task API with status-only member updates.
- [ ] 9. Regenerate API client.
- [ ] 10. Add frontend auth/account updates.
- [ ] 11. Add owner/project/task UI.
- [ ] 12. Update README with final model and demo instructions.

## Design Notes For This Repo

- Prefer adding RBAC as a new `features/access` module instead of spreading permission logic across stores.
- Keep `authMiddleware` simple: authenticate only, set `currentUser`, and stop.
- Do permission checks in route/store boundaries before returning or mutating data.
- Use company ownership and project membership as the primary authorization example.
- Keep the task feature as the final business resource instead of replacing it with documents.
- Do not remove existing `User.role` immediately if it helps migration, but the final source of truth should be company owner and project membership checks.
- Keep API responses and OpenAPI schemas consistent with the existing feature-folder pattern.
- Regenerate `@repo/api-client` after every OpenAPI change because the web app imports generated operation types.
