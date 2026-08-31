## Project Architecture Decisions

# Project's Expected user

Expected user is assumed to be around 500.
So choosing Drizzle ORM as schema builder with Database as SQLite

## Backend Database and ORM Info

### 1. Real-Time Engine: Server-Sent Events (SSE)

* **Decision:** Selected Server-Sent Events (SSE) over WebSockets and HTTP Polling for live score updates.
* **Rationale:**
  * **Low Resource Footprint:** Since score updates only happen when an admin manually inputs an event (goals, fouls, time stops), the server spends most of its time idling. SSE maintains persistent HTTP streams with minimal memory overhead (~2–5 MB RAM for 100+ clients).
  * **One-Way Broadcast Architecture:** Spectators only need to receive live updates (Server $\rightarrow$ Client), while admin actions are submitted via standard, secure REST routes (`POST /api/admin/...`). Bi-directional WebSockets were unnecessary.
  * **Native Resiliency:** Browser-native `EventSource` handles automatic reconnection seamlessy if a spectator's mobile device temporarily drops Wi-Fi or locks the screen.

### 2. Database & Data Access: SQLite (WAL Mode) + Drizzle ORM

* **Decision:** Selected SQLite running in Write-Ahead Logging (WAL) mode paired with Drizzle ORM.
* **Rationale:**
  * **Zero Background Service Overhead:** SQLite runs directly inside the Node.js application process, eliminating the 30–100+ MB RAM footprint required by background database daemons like PostgreSQL or MySQL on the laptop host.
  * **Concurrent Reads/Writes with WAL:** Executing `PRAGMA journal_mode = WAL;` enables non-blocking concurrent reads while admin writes occur, preventing `SQLITE_BUSY` errors during live matches.
  * **Drizzle ORM Efficiency:** Drizzle compiles down to lightweight JavaScript function calls using `better-sqlite3` rather than executing a separate engine binary (like Prisma), conserving CPU threads and RAM while providing full TypeScript type safety.
  * **In-Memory Streaming Pattern:** Database operations are isolated strictly to admin event writes. Once updated, the data object is broadcast directly from server memory to SSE streams, preventing database connection exhaustion under spectator load.
