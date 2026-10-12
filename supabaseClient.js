import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL || '';
let supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err.message);
  }
}

// In-memory robust fallback store for initial setup and demonstration
export const demoWarehouseUsers = [
  {
    id: 'wh-user-01',
    businessName: 'Sahyadri Agro Cold Storage & Wholesale Godown',
    ownerName: 'Sunil Rao Patil',
    email: 'buyer@sahyadriagro.in',
    phone: '+91 98220 12345',
    godownId: 'WH-MH-NSK-101',
    godownName: 'Pimpalgaon Lasalgaon Central Godown #1',
    district: 'Nashik',
    taluka: 'Niphad',
    capacityMt: 1200,
    currentStockMt: 845,
    role: 'wharehousebuyer',
    verified: true,
    password: 'password123'
  },
  {
    id: 'wh-user-02',
    businessName: 'Baramati Krishi Godown & Logistic Hub',
    ownerName: 'Dnyaneshwar Jagtap',
    email: 'buyer@baramatikrishigodown.com',
    phone: '+91 94230 67890',
    godownId: 'WH-MH-PUN-204',
    godownName: 'Baramati APMC Sector 4 Warehouse',
    district: 'Pune',
    taluka: 'Baramati',
    capacityMt: 2000,
    currentStockMt: 1420,
    role: 'wharehousebuyer',
    verified: true,
    password: 'password123'
  }
];

export const demoGovUsers = [
  {
    id: 'gov-user-01',
    officialId: 'GOV-MH-001',
    name: 'Dr. Rajesh Deshmukh, IAS',
    email: 'agri.director@maharashtra.gov.in',
    department: 'Commissioner of Agriculture, Pune Headquarters',
    designation: 'Director of Agricultural Marketing & Intelligence',
    jurisdiction: 'Entire State (36 Districts)',
    role: 'government',
    securityPin: '7890',
    password: 'admin'
  },
  {
    id: 'gov-user-02',
    officialId: 'GOV-MH-NSK-14',
    name: 'Smt. Kavita Sonawane',
    email: 'dao.nashik@maharashtra.gov.in',
    department: 'District Agriculture Office, Nashik Division',
    designation: 'District Agricultural Officer (DAO)',
    jurisdiction: 'Nashik District (15 Talukas)',
    role: 'government',
    securityPin: '4321',
    password: 'admin'
  }
];

export const demoStateStats = {
  activeGodowns: 248,
  activeDistricts: 36,
  totalCapacityMt: 350000,
  currentStockMt: 218450,
  inflowTodayMt: 4210,
  outflowTodayMt: 3680,
  spoilageRatePct: 1.4,
  freshnessPct: 98.7,
  topCommodities: [
    { name: 'Onion (कांदा)', stockTonnes: 78500, district: 'Nashik / Ahmednagar', trend: 'Adequate' },
    { name: 'Soybean (सोयाबीन)', stockTonnes: 62300, district: 'Latur / Nanded', trend: 'High Inflow' },
    { name: 'Cotton (कापूस)', stockTonnes: 45100, district: 'Nagpur / Yavatmal', trend: 'Stable' },
    { name: 'Tomato (टोमॅटो)', stockTonnes: 19400, district: 'Pune / Narayangaon', trend: 'Rapid Outflow' },
    { name: 'Tur Dal (तूर)', stockTonnes: 13150, district: 'Solapur / Kalaburagi Border', trend: 'Watchlist' }
  ]
};

export async function checkSupabaseConnection() {
  if (!supabaseUrl || !supabaseKey || !supabase) {
    return {
      connected: false,
      mode: 'standalone_mock',
      message: 'Supabase URL/Key not configured. Using active demo persistence engine.'
    };
  }

  try {
    // Attempt a lightweight query
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) {
      return {
        connected: false,
        mode: 'error',
        message: `Supabase responded with error: ${error.message}. Check schema tables.`
      };
    }
    return {
      connected: true,
      mode: 'live_supabase',
      message: 'Connected to live Supabase PostgreSQL database.'
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'error',
      message: `Failed to reach Supabase: ${err.message}`
    };
  }
}

export function updateSupabaseConfig(url, key) {
  supabaseUrl = url;
  supabaseKey = key;
  if (url && key) {
    try {
      supabase = createClient(url, key);
      return { success: true, message: 'Supabase client updated successfully.' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  } else {
    supabase = null;
    return { success: true, message: 'Switched to local demo engine.' };
  }
}

export { supabase, supabaseUrl };
