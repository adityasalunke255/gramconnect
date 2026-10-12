# gramconnect
## 🌾 Maha Inventory (महा इन्व्हेंटरी) - Agricultural Intelligence System
### Digital Supply-Chain & Food Security Network for Maharashtra State

Based on the **Maha Inventory Project Workflow & Build Blueprint**, this web application connects wholesale buyers, private godown operators, and Maharashtra Government planning authorities into a unified real-time stock ledger and intelligence network.

---

## 📋 Table of Contents
1. [Overview](#-overview)
2. [Prerequisites](#-prerequisites)
3. [How to Run (Quick Start)](#-how-to-run-quick-start)
4. [How to Use the Application](#-how-to-use-the-application)
   - [A. Gateway & Dual Authentication](#a-gateway--dual-authentication)
   - [B. Warehouse Buyer & Godown Operator Portal](#b-warehouse-buyer--godown-operator-portal)
   - [C. Government State Intelligence Portal](#c-government-state-intelligence-portal)
5. [Database Setup (Supabase PostgreSQL)](#-database-setup-supabase-postgresql)
6. [Project Architecture](#-project-architecture)
7. [Tech Stack](#-tech-stack)

---

## 🌟 Overview
Based on the **Maha Inventory Project Workflow & Build Blueprint**, **GramConnect** is an enterprise-grade digital agricultural inventory intelligence system. It seamlessly bridges private wholesale warehouses, cold storages, and the Government of Maharashtra Agricultural Marketing Directorate into a unified, real-time stock ledger and predictive food security network.

---

## 💻 Prerequisites
Before running the application locally, ensure you have installed:
- **Node.js** (v18.0.0 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js)
- **Git**: [Download Git](https://git-scm.com/)
- Modern Web Browser (Chrome, Edge, Firefox, Brave, Safari)

---

## 🚀 How to Run (Quick Start)

### 1. Clone the Repository
```bash
git clone https://github.com/adityasalunke255/gramconnect.git
cd gramconnect
```

### 2. Install Dependencies
Install all required Node.js packages (`express`, `cors`, `@supabase/supabase-js`, `dotenv`):
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
The system is built with an intelligent local state engine and works **out of the box** without any external keys required. If connecting to a live Supabase database, create a `.env` file in the root directory:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start the Application Server
Run the Node.js server:
```bash
npm start
```
*(Alternatively: `node server.js`)*

### 5. Access the Web Application
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 📖 How to Use the Application

### A. Gateway & Dual Authentication (`http://localhost:3000`)
The gateway page features a dual-role authentication terminal with auto-fill test credentials:

#### 1. Warehouse Buyer / Godown Operator Login:
- Select the **"Warehouse Buyer / Godown"** tab (Emerald green theme).
- Click **"⚡ Auto-Fill Demo Account"** or enter:
  - **Email / Godown ID**: `buyer@sahyadriagro.in` *(or `WH-MH-NSK-101`)*
  - **Password**: `password123`
- Click **"🚀 Access Godown Management Ledger"** to enter `warehouse.html`.

#### 2. Government Official & State Analyst Login:
- Select the **"Government Official"** tab (Saffron orange & emerald theme).
- Click **"⚡ Auto-Fill State Director Account"** or enter:
  - **Official ID / Email**: `agri.director@maharashtra.gov.in` *(or `GOV-MH-001`)*
  - **Password**: `admin`
  - **2FA Security PIN**: `7890`
- Click **"🏛️ Verify Credentials & Access Intelligence"** to enter `government.html`.

---

### B. Warehouse Buyer & Godown Operator Portal (`warehouse.html`)
*Designed for private warehouse operators, wholesale aggregators, and cold chains.*

1. **Godown Capacity Telemetry**:
   - Inspect live storage metrics: Current Godown Balance (`845 MT`), Today's Farmer Purchases (`+42.5 MT`), Dispatches (`-18.2 MT`), Cold Vault Temperature (`2.1°C`), and Relative Humidity (`68%`).
2. **Operational Visual Gallery**:
   - Click thumbnails to inspect high-resolution photo documentation of godown bays, digital weighbridge intake docks, and cold storage racks.
3. **Log Stock Movements ("➕ Log Inward / Movement Receipt")**:
   - **Farmer Purchases (Direct Inward)**: Select movement type `Farmer Purchase (Inward)`, pick produce (*Nashik Red Onion, Soybean, Tomato Hybrid, Tur Dal*), enter quantity (*Quintal, Tonne, or KG*), farmer name, and receipt note.
   - **Internal Weight Normalization**: The system automatically normalizes all inputs into standard KG and MT units.
   - **Other Movements**: Record outward APMC sales, godown-to-godown transit transfers, and perishable spoilage audit write-offs.
4. **Real-Time Synchronized Ledger**:
   - Review live chronological ledger entries, filtered by movement type pills (*All, Inward, Outward, Spoilage*).

---

### C. Government State Intelligence Portal (`government.html`)
*Designed for State Directors, District Agricultural Officers (DAOs), and APMC vigilance.*

1. **🏢 36-District Ledger & Command (`#view-command`)**:
   - **Command Gallery**: Review operational photography of MSAICC Headquarters, DAO Godown Audits, APMC Mandi Inspections, and State Taskforce sessions.
   - **State Buffer Target Gauge**: Live tracking of Maharashtra's usable food reserves against the statutory buffer target (`2,50,000 MT`).
   - **36-District Interactive Heatmap Table**: Real-time district-wise inventory balances, freshness percentages, and forecast risk indicators. Use the search bar or division filter pills (*Nashik, Pune, Marathwada, Vidarbha*).
   - **Row 3-Dot (⋮) Actions**: Click any district's `⋮` menu to immediately inspect dossiers, schedule field audits, initiate buffer transfers, or issue advisories.

2. **📢 Directives Broadcast Studio (`#view-directives`)**:
   - **Radar Antenna Transmitter**: Glowing radar wave signal studio broadcasting binding food security directives to 36 DAOs and 305 APMCs.
   - **Quick-Fill Templates**: Click preset chips (*Onion Price Stabilization & Transit Subsidy, Soybean MSP Procurement, Tur Dal Emergency Buffer, Weighbridge Audit Notice*) to auto-fill the directive composer.
   - **Live Broadcast Feed**: Real-time chronological audit trail of all issued state advisories.

3. **🔄 Buffer Re-Allocation Studio (`#view-reallocate`)**:
   - **Animated Freight Highway Corridor**: Live visual simulation with moving truck convoys (`🚚`) along Maharashtra Green Freight corridors (NH-60, NH-52).
   - **Dynamic Quota Controls**: Select surplus origin (*e.g., Nashik 78,500 MT*) and deficit destination (*e.g., Solapur 13,150 MT*). Use preset volume buttons (`+1,000 MT`, `+2,500 MT`, `+5,000 MT`) or fine slider.
   - **Real-Time Impact Calculator**: Instantly computes remaining surplus reserve, deficit gap reduction percentage, and required heavy transport vehicle fleet.
   - **Dispatched Transits Ledger**: Tracks active convoys in transit with toll-free clearance passes.

4. **📍 District Dossier Inspector (`#view-dossier`)**:
   - **Quick District Chips Bar**: Instant switcher for key surveillance districts (*Nashik, Solapur, Pune, Latur, Nagpur, Ahmednagar, Kolhapur, etc.*).
   - **Capacity Gauges**: Animated visual meters for Cold Storage Vaults vs Standard Dry Godowns, and produce freshness quality score.
   - **DAO Officer Executive Card**: View assigned DAO contact details, direct phone dialer link, and one-click **"📋 Schedule On-Site Audit"** dispatcher.

5. **🔮 AI Risk Forecast Engine (`#view-forecast`)**:
   - Machine-learning predictive cards detailing surplus zones, shortage warnings, and equilibrium status with automated policy directives.

6. **⚖️ MSP Market Parity Monitor (`#view-msp`)**:
   - Live APMC modal prices monitored against statutory Minimum Support Price (MSP) benchmarks across 18 Price Support Scheme (PSS) centers.

---

## ⚡ Database Setup (Supabase PostgreSQL)

GramConnect includes complete PostgreSQL schema definitions:
1. Open your Supabase project dashboard at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab.
3. Open and run [supabase_schema.sql](file:///c:/projects/cep%20project/supabase_schema.sql) from this repository.
4. Set your keys in `.env` or click **"Configure Keys"** in the web app header to connect live database synchronization.

---

## 📁 Project Architecture
```text
gramconnect/
├── server.js               # Node.js + Express backend, dual auth, state APIs
├── supabaseClient.js       # Supabase client with smart fallback local engine
├── supabase_schema.sql     # Complete PostgreSQL migration schema & test seeds
├── package.json            # Project dependencies & startup scripts
├── .gitignore              # Git ignore rules (node_modules, .env, logs)
├── README.md               # Documentation & User Manual
├── public/
│   ├── index.html          # Dual-Role Portal Gateway & Auth (NexaCore UI)
│   ├── style.css           # Gateway styles & 6-stage flow pipeline animations
│   ├── app.js              # Gateway portal switcher & state telemetry
│   ├── warehouse.html      # Dedicated Warehouse Operator & Inward Desk Portal
│   ├── warehouse.css       # Warehouse terminal styles & capacity gauges
│   ├── warehouse.js        # Stock entry logic & normalized movement ledger
│   ├── government.html     # Dedicated Government State Intelligence Portal
│   ├── government.css      # Saffron/Emerald theme, radar & freight animations
│   ├── government.js       # Executive tab switching, studios & impact engine
│   └── images/             # Operational photo documentation
│       ├── warehouse_facility.jpg   # Pimpalgaon Godown #1 exterior & bays
│       ├── produce_intake.jpg       # Digital weighbridge intake dock
│       ├── cold_storage_racks.jpg   # Temperature-controlled pallet vaults
│       ├── gov_command_center.jpg   # State Intelligence Command Center
│       ├── gov_field_audit.jpg      # DAO Godown on-site stack audit
│       ├── gov_mandi_inspection.jpg # APMC Mandi price vigilance inspection
│       └── gov_policy_session.jpg   # Inter-district planning taskforce
```

---

## 🛠️ Tech Stack
- **Runtime & Server**: Node.js (ES Modules), Express.js
- **Styling**: Vanilla CSS3 (Custom design tokens, glassmorphism, keyframe animations, dark executive theme)
- **Frontend Logic**: Vanilla JavaScript (ES6+, zero bundler/build friction, instant local reload)
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`)
- **Architecture**: Dual-Role Role-Based Access Control (RBAC) Architecture

---

## 📄 License & Attribution
Developed for the **Maharashtra State Agricultural Inventory Intelligence Network (Maha Inventory)**.
© 2026 Government of Maharashtra • Department of Agriculture & APMC Directorate.
