# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev          # Hot reload dev server
npm run build              # Compile TypeScript
npm run clean              # Clean build artifacts

# Code quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier format
npm run precommit          # Run all checks before commit

# Testing
npm test                   # Unit tests
npm run test:watch         # Watch mode
npm run test:cov           # Coverage report
npm run test:e2e           # End-to-end tests

# Database
npm run migration:generate -- --name=<MigrationName>   # Generate migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run migration:show     # Show migration status
npm run seed:run           # Run seeds (requires build first)

# Setup
npm run setup              # Initial project setup (copies .env, installs deps)
npm run setup:db           # DB setup only (migrations + seeds)
```

## Architecture

**Module structure** — Feature modules live in `src/modules/`: `auth`, `profile`, `user`, `user-token`, `queue`. Shared utilities are in `src/shared/` (EnvService, TokenService, EncryptionService, GeneratorService, UtilService) exported via `SharedModule` which is global.

**Request lifecycle:**
1. Helmet + Compression middleware
2. Global `AuthGuard` — extracts/decrypts token, verifies JWT, loads user from DB, attaches to `request.user`
3. Global `RolesGuard` — checks `@Roles()` decorator
4. Global `ValidateIncomingInput` pipe — DTO validation via class-validator
5. Route handler
6. Global `ResponseInterceptor` — wraps all responses as `{ success, message, data }`
7. `AppExceptionFilter` + `GlobalExceptionFilter` — standardize error responses as `{ success: false, message, code }`

**Auth strategy** — Tokens are JWTs (payload: `{ id }`, 7-day expiry) that are **AES-encrypted** before being sent to clients. The client sends the encrypted token in `Authorization: Bearer`. The server decrypts then verifies the JWT. Use `@Public()` to allow optional-auth routes; use `@UseUnauthGuard()` to skip all auth (login/register). Inject with `@AuthUser()` and `@AccessToken()`.

**Route definitions** — All routes are centrally defined in `src/routes.ts` using a nested path structure, then imported in feature modules.

**Repository pattern** — Each module has a `*.repo.ts` extending `BaseRepo`. All entities extend `AbstractEntity` (id, createdAt, updatedAt). Password hashing (bcrypt, 12 rounds) and password comparison happen in entity lifecycle hooks (`@BeforeInsert`, `@BeforeUpdate`), not in services.

**Queue system** — BullMQ backed by Redis. Queue names and job types are defined in `src/constants/queue.enum.ts`. The `IN_APP_EMAIL` queue handles all transactional emails (verify-email, welcome-email, get-in-touch). In development, emails are logged to console instead of sent. Email templates use Handlebars and live in `src/templates/`.

**Config validation** — All environment variables are validated synchronously at startup via class-validator in `src/config/config.schema.ts`. The app exits with a colored error if validation fails. Access config through `EnvService` (injected via SharedModule).

## Environment Variables

Required variables (see `.env.example`):
- `NODE_ENV`, `API_PORT`, `APP_URL`
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET` (min 8 chars), `ENCRYPTION_SECRET` (min 8 chars)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_USER`, `REDIS_PASSWORD`
- `SMTP_URL`, `GOOGLE_RECAPTCHA_SECRET_KEY`

## Database

TypeORM with PostgreSQL. Migrations in `database/migrations/`, seeds in `database/seeds/`. The data source for CLI operations is `database/data-source.ts` — it points to compiled JS in `dist/`, so always `npm run build` before running migrations or seeds. Seeds use `typeorm-extension` with tracking (won't re-run already-applied seeds).

Default seeded admin: `admin@mail.com` / `defaultPass123!`

## Key Conventions

- **Custom exceptions** — Use the typed exceptions in `src/exceptions/` (e.g., `NotFoundException`, `UnprocessableException`). These feed into `AppExceptionFilter` and produce consistent error shapes.
- **Roles** — Currently only `OWNER` role exists (`src/constants/role.enum.ts`). Add new roles there and guard routes with `@Roles(Role.X)`.
- **Token purposes** — Verification token types (e.g., `VERIFY_EMAIL`) are defined in `src/constants/purpose.enum.ts` and stored in the `user_tokens` table via `UserTokenRepository`.
- **Swagger** — Only enabled in development. Access at `/api/docs`.
- **API versioning** — URI-based (`/v1/...`). Version is set globally in `main.ts`.
