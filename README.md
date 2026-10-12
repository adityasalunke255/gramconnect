# gramconnect
## 🌾 Maha Inventory (महा इन्व्हेंटरी) - Agricultural Intelligence System
### Digital Supply-Chain & Food Security Network for Maharashtra State

Based on the **Maha Inventory Project Workflow & Build Blueprint**, this web application connects wholesale buyers, private godown operators, and Maharashtra Government planning authorities into a unified real-time stock ledger and intelligence network.

---

## 🚀 Live Local Application
The application server is actively running on:
**[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Dual Login Portals & Pre-configured Test Accounts

### 1. Warehouse Buyer & Godown Operator Portal
*Designed for private cold storages, wholesale aggregators, and godowns across Maharashtra.*
- **Portal Tab**: "Warehouse Buyer / Godown" (Emerald Theme)
- **Email / Godown ID**: `buyer@sahyadriagro.in` *(or `WH-MH-NSK-101`)*
- **Password**: `password123`
- **Capabilities**:
  - Direct inward stock entry from farmers (no farmer app account required).
  - Outward dispatches & APMC sales.
  - Godown-to-godown transfer reconciliation.
  - Spoilage and sorting damage audits.

---

### 2. Maharashtra Government Official & Analyst Portal
*Designed for the Department of Agriculture, District Agricultural Officers (DAOs), and State Market Intelligence.*
- **Portal Tab**: "Government Official" (Royal Amber / Gold Theme)
- **Official ID / Email**: `agri.director@maharashtra.gov.in` *(or `GOV-MH-001`)*
- **Password**: `admin`
- **Security PIN**: `7890`
- **Capabilities**:
  - District-wise aggregated inventory oversight (36 Districts).
  - Real-time stock availability in Metric Tonnes (MT).
  - Spoilage rate and data freshness metrics (updated within hours).
  - Shortage/surplus forecast indicators for proactive local coordination (Gram Panchayats, FPOs, NGOs).

---

## ⚡ Supabase Database Connection

The app uses `@supabase/supabase-js` and is architected to run in two modes:
1. **Interactive Demo Engine**: Active immediately with realistic Maharashtra godown balances and stock movements.
2. **Live Supabase PostgreSQL Database**:
   - Click the **"Supabase Connected / Local Engine"** pill badge or **"Configure Keys"** in the UI to enter your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
   - Run the included [supabase_schema.sql](file:///c:/projects/cep%20project/supabase_schema.sql) in your Supabase SQL Editor.
   - Click **"View DB Schema (SQL)"** in the top navigation to view or copy the entire database script directly.

---

## 📁 Project Architecture
```text
c:\projects\cep project\
├── server.js               # Node.js + Express backend, auth & warehouse APIs
├── supabaseClient.js       # Supabase client with smart fallback engine
├── supabase_schema.sql     # Complete PostgreSQL migration schema
├── package.json            # Node.js project dependencies
├── .env                    # Environment variables (Port, Supabase keys)
└── public/
    ├── index.html          # Gateway & Dual Login Interface (NexaCore UI)
    ├── style.css           # Gateway design system & 6-stage animated pipeline
    ├── app.js              # Gateway portal switcher & state intelligence
    ├── warehouse.html      # Dedicated Warehouse Operator & Inward Desk Portal
    ├── warehouse.css       # Warehouse terminal styles & capacity gauge
    ├── warehouse.js        # Stock entry logic & live godown ledger
    └── images/             # Warehouse operational photography
        ├── warehouse_facility.jpg   # Pimpalgaon Godown #1 exterior & bays
        ├── produce_intake.jpg       # Digital weighbridge intake dock
        └── cold_storage_racks.jpg   # Temperature-controlled pallet vaults
```
