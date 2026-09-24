# Database setup

ClearLedger uses PostgreSQL through Prisma.

## 1. Create a database

Create a PostgreSQL database named `clearledger`, then copy `.env.example` to `.env` and update `DATABASE_URL` with the database credentials.

## 2. Install and generate Prisma

Run these commands from the project folder:

```powershell
npm.cmd install
npx prisma generate
npx prisma migrate dev --name init
```

## 3. Data model

- `Student` stores admission, class, and guardian details.
- `FeeStructure` defines a fee for an academic year and term.
- `Invoice` records what a student is billed.
- `Payment` records money received and can be linked to an invoice.
- `Vehicle` stores fleet routes, inspection status, and optional GPS coordinates.
- `InventoryItem` tracks campus stock and reorder thresholds.
- `VisitorLog` records badge-based campus entry and exit activity.
- `HealthRecord` stores restricted medical information linked to a student.
- `AlumniProfile` supports graduate networking and fundraising records.
- `StudentRiskFlag` stores explainable, counselor-reviewed predictive support flags.

The dashboard currently keeps its demo transactions in browser memory. The next wiring step is to add Prisma API routes and replace the demo payment handler with database-backed reads and writes after `DATABASE_URL` is configured.

Predictive flags must remain decision-support only: staff should review the underlying attendance, assessment, and engagement signals before contacting a family or taking action.
