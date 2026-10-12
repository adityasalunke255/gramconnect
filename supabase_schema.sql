-- ====================================================================
-- MAHA INVENTORY (महाराष्ट्र कृषी इन्व्हेंटरी गुप्तचर प्रणाली)
-- Supabase PostgreSQL Database Schema
-- Based on Maha Inventory Architectural Blueprint & Build Plan
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Wholesale Vendors / Warehouse Buyer Accounts
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(150) UNIQUE NOT NULL,
    gstin VARCHAR(30),
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    verified_status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Godowns / Warehouses managed by Vendors
CREATE TABLE IF NOT EXISTS public.godowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    godown_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    taluka VARCHAR(100) NOT NULL,
    capacity_tonnes NUMERIC(10, 2) DEFAULT 500.00,
    active_status BOOLEAN DEFAULT true,
    last_stock_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Standard Produce Catalog (Vegetables, Fruits, Grains, Cash Crops)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_mr VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Vegetables, Fruits, Pulses, Commercial
    default_unit VARCHAR(20) DEFAULT 'kg', -- kg, quintal, tonne
    shelf_life_days INT DEFAULT 14,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Stock Movements Ledger (Purchases, Dispatches, Transfers, Spoilage, Adjustments)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movement_id VARCHAR(50) UNIQUE NOT NULL,
    godown_id UUID REFERENCES public.godowns(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    movement_type VARCHAR(30) NOT NULL, -- 'purchase_inward', 'sale_dispatch', 'transfer_out', 'transfer_in', 'spoilage_damage', 'correction'
    quantity NUMERIC(12, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'quintal', 'tonne'
    normalized_kg NUMERIC(12, 2) NOT NULL, -- converted internal standard: 1 quintal = 100kg, 1 tonne = 1000kg
    destination_godown_id UUID REFERENCES public.godowns(id),
    reference_no VARCHAR(100), -- farmer receipt, invoice, gate pass
    farmer_name VARCHAR(150),  -- optional note; farmers do NOT need accounts
    reason_notes TEXT,
    recorded_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Current Usable Inventory Balance per Godown & Product
CREATE TABLE IF NOT EXISTS public.inventory_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    godown_id UUID REFERENCES public.godowns(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    current_stock_kg NUMERIC(14, 2) DEFAULT 0.00,
    total_purchased_kg NUMERIC(14, 2) DEFAULT 0.00,
    total_dispatched_kg NUMERIC(14, 2) DEFAULT 0.00,
    total_spoilage_kg NUMERIC(14, 2) DEFAULT 0.00,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(godown_id, product_id)
);

-- 7. Government Analysts and Authorized Officials
CREATE TABLE IF NOT EXISTS public.government_officials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    official_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    department VARCHAR(150) DEFAULT 'Department of Agriculture, Maharashtra',
    designation VARCHAR(100) NOT NULL, -- 'District Agricultural Officer', 'State Planning Analyst', 'Director of Marketing'
    district_jurisdiction VARCHAR(100) DEFAULT 'ALL_MAHARASHTRA',
    access_level VARCHAR(50) DEFAULT 'GOVT_ANALYST',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Realistic Catalog Data for Maharashtra
INSERT INTO public.products (code, name_en, name_mr, category, default_unit, shelf_life_days)
VALUES 
    ('ONION_RED', 'Nashik Red Onion', 'नाशिक लाल कांदा', 'Vegetables', 'quintal', 45),
    ('TOMATO_HYBRID', 'Tomato (Hybrid)', 'टोमॅटो (हायब्रिड)', 'Vegetables', 'kg', 10),
    ('SOYBEAN_YELLOW', 'Yellow Soybean', 'पिवळी सोयाबीन', 'Pulses', 'quintal', 180),
    ('COTTON_BT', 'Cotton (Medium Staple)', 'कापूस', 'Commercial', 'quintal', 365),
    ('GRAPES_THOMPSON', 'Grapes (Thompson Seedless)', 'द्राक्षे (थॉमसन)', 'Fruits', 'kg', 15),
    ('POMEGRANATE_BHAGWA', 'Pomegranate (Bhagwa)', 'डाळिंब (भगवा)', 'Fruits', 'kg', 30),
    ('TUR_DAL', 'Tur / Arhar Dal', 'तूर डाळ', 'Pulses', 'quintal', 240)
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Government Officials
INSERT INTO public.government_officials (official_id, email, full_name, designation, district_jurisdiction)
VALUES 
    ('GOV-MH-001', 'agri.director@maharashtra.gov.in', 'Dr. Rajesh Deshmukh, IAS', 'Director of Agricultural Marketing', 'ALL_MAHARASHTRA'),
    ('GOV-MH-002', 'dao.nashik@maharashtra.gov.in', 'Smt. Sunita Patil', 'District Agricultural Officer (Nashik)', 'Nashik'),
    ('GOV-MH-003', 'dao.pune@maharashtra.gov.in', 'Shri. Vikram Shinde', 'District Agricultural Officer (Pune)', 'Pune')
ON CONFLICT (official_id) DO NOTHING;
