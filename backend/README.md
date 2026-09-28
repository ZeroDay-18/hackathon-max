# Backend changes for MAX registration

Changed/added files are kept with their original backend paths.

1. Add `JWT_SECRET` to backend `.env` (at least 32 characters).
2. Copy the files from this archive into your backend with overwrite.
3. Restart backend. Sequelize `sync({ alter: true })` will create/update `groups` and `users`.
4. Mini App auth endpoint: `POST /api/auth/max-miniapp` with JSON `{ "initData": window.WebApp.initData }`.
5. Endpoint returns one access JWT with 2-hour lifetime; there is no refresh token.

Important: the bot cannot directly write into Pinia. The token is therefore issued when the registered user opens the Mini App, after server-side MAX initData validation.
