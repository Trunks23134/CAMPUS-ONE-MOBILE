# APIcenter Alumni Backend

This backend scaffold follows your rulebook:

- Next.js route handlers for the API layer
- Strict TypeScript with DTOs and interfaces
- Supabase/Postgres tables with no primary keys, foreign keys, unique constraints, or not-null constraints
- Event-log style writes where table relationships are handled by APIs, not database links

## Implemented routes

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/alumni/register`
- `POST /api/alumni/profile/update`
- `POST /api/alumni/record-request`
- `POST /api/alumni/card-application`

## Event names

- `auth.user.login.v1`
- `auth.user.logout.v1`
- `alumni.registration.submitted.v1`
- `alumni.profile.updated.v1`
- `alumni.record.requested.v1`
- `alumni.card.application.submitted.v1`

## Setup

1. Run the SQL in [database/supabase-schema.sql](d:\NAVAL, J-Documents\3rdYear-Term2\APIcenter_Alumni_User\backend\database\supabase-schema.sql) inside Supabase SQL Editor.
2. Copy `.env.example` to `.env.local`.
3. Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Install dependencies with `npm install`.
5. Start the backend with `npm run dev`.

## Important note

This scaffold currently logs events exactly the way your rulebook describes. It does not yet do credential verification, JWT issuance, or read-model aggregation. The next step is to add:

- an identity read model for actual login verification
- token generation and middleware
- query endpoints that build a current alumni profile from the append-only logs
