import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  checkSupabaseConnection,
  updateSupabaseConfig,
  demoWarehouseUsers,
  demoGovUsers,
  demoStateStats,
  supabase,
  supabaseUrl
} from './supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. System Health & Supabase Connection Status
app.get('/api/status', async (req, res) => {
  const dbStatus = await checkSupabaseConnection();
  res.json({
    app: 'Maha Inventory API',
    version: '1.0.0',
    state: 'Maharashtra Agricultural Intelligence System',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    stats: demoStateStats
  });
});

// 2. Authentication Endpoint for Both Portals
app.post('/api/auth/login', async (req, res) => {
  const { role, identifier, password, securityPin } = req.body;

  if (!role || !identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid identification and password credentials.'
    });
  }

  // Check if live Supabase is connected
  const dbStatus = await checkSupabaseConnection();

  if (dbStatus.connected && supabase) {
    try {
      if (role === 'wharehousebuyer') {
        const { data, error } = await supabase
          .from('vendors')
          .select('*, godowns(*)')
          .or(`contact_email.eq.${identifier},id.eq.${identifier}`)
          .single();

        if (error || !data) {
          return res.status(401).json({
            success: false,
            message: 'Warehouse Buyer account not found in database.'
          });
        }

        return res.json({
          success: true,
          role: 'wharehousebuyer',
          user: {
            id: data.id,
            businessName: data.business_name,
            ownerName: data.owner_name,
            email: data.contact_email,
            district: data.district,
            taluka: data.taluka,
            godowns: data.godowns || []
          },
          token: `token_wh_${Date.now()}`,
          message: 'Warehouse Operator authenticated successfully via Supabase'
        });
      } else if (role === 'government') {
        const { data, error } = await supabase
          .from('government_officials')
          .select('*')
          .or(`email.eq.${identifier},official_id.eq.${identifier}`)
          .single();

        if (error || !data) {
          return res.status(401).json({
            success: false,
            message: 'Government Official credentials not found in authorized roster.'
          });
        }

        return res.json({
          success: true,
          role: 'government',
          user: {
            id: data.id,
            officialId: data.official_id,
            name: data.full_name,
            email: data.email,
            department: data.department,
            designation: data.designation,
            jurisdiction: data.district_jurisdiction,
            accessLevel: data.access_level
          },
          token: `token_gov_${Date.now()}`,
          message: 'Maharashtra Government Official verified via Supabase'
        });
      }
    } catch (err) {
      console.error('Supabase query error, switching to fallback:', err.message);
    }
  }

  // Fallback / Demonstration Engine
  if (role === 'wharehousebuyer') {
    const user = demoWarehouseUsers.find(
      u => (u.email.toLowerCase() === identifier.toLowerCase() || u.godownId.toLowerCase() === identifier.toLowerCase())
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Warehouse Buyer ID or Email. Try demo: buyer@sahyadriagro.in'
      });
    }

    if (password !== 'password123' && password !== user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. (Demo password: password123)'
      });
    }

    return res.json({
      success: true,
      role: 'wharehousebuyer',
      source: 'Local Engine (Supabase ready)',
      user: {
        id: user.id,
        businessName: user.businessName,
        ownerName: user.ownerName,
        email: user.email,
        phone: user.phone,
        godownId: user.godownId,
        godownName: user.godownName,
        district: user.district,
        taluka: user.taluka,
        capacityMt: user.capacityMt,
        currentStockMt: user.currentStockMt
      },
      token: `demo_session_wh_${Date.now()}`,
      message: `Welcome back, ${user.businessName}! Stock ledger synchronized.`
    });
  } else if (role === 'government') {
    const officer = demoGovUsers.find(
      g => (g.email.toLowerCase() === identifier.toLowerCase() || g.officialId.toLowerCase() === identifier.toLowerCase())
    );

    if (!officer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Government Official ID or Email. Try demo: agri.director@maharashtra.gov.in'
      });
    }

    if (password !== 'admin' && password !== officer.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid government portal credentials. (Demo password: admin)'
      });
    }

    return res.json({
      success: true,
      role: 'government',
      source: 'Local Engine (Supabase ready)',
      user: {
        id: officer.id,
        officialId: officer.officialId,
        name: officer.name,
        email: officer.email,
        department: officer.department,
        designation: officer.designation,
        jurisdiction: officer.jurisdiction,
        role: officer.role
      },
      token: `demo_session_gov_${Date.now()}`,
      message: `Access Granted: ${officer.designation} (${officer.name}). State Intelligence Loaded.`
    });
  }

  res.status(400).json({ success: false, message: 'Invalid portal role.' });
});

// 3. Live State-Wide Overview Statistics
app.get('/api/system/stats', (req, res) => {
  res.json({
    success: true,
    data: demoStateStats
  });
});

// In-memory active warehouse state for WH-MH-NSK-101
export const warehouseInventoryState = {
  godownId: 'WH-MH-NSK-101',
  name: 'Sahyadri Agro Cold Storage & Wholesale Godown',
  location: 'Pimpalgaon Baswant, Lasalgaon Road, Niphad, Nashik',
  district: 'Nashik',
  taluka: 'Niphad',
  operator: 'Sunil Rao Patil',
  contact: '+91 98220 12345',
  totalCapacityMt: 1200,
  currentStockMt: 845.0,
  storageTempC: 2.1,
  humidityPct: 68,
  activeBays: 4,
  commodities: [
    { code: 'ONION_RED', name: 'Nashik Red Onion (नाशिक लाल कांदा)', category: 'Vegetables', stockMt: 490.0, stockQuintals: 4900, shelfLife: '45 days', grade: 'Grade A Export' },
    { code: 'SOYBEAN_YELLOW', name: 'Yellow Soybean (पिवळी सोयाबीन)', category: 'Pulses', stockMt: 215.0, stockQuintals: 2150, shelfLife: '180 days', grade: 'Standard Fair Avg' },
    { code: 'TOMATO_HYBRID', name: 'Tomato Hybrid (टोमॅटो हायब्रिड)', category: 'Vegetables', stockMt: 95.0, stockQuintals: 950, shelfLife: '10 days', grade: 'Local Market Fresh' },
    { code: 'TUR_DAL', name: 'Tur / Arhar Dal (तूर डाळ)', category: 'Pulses', stockMt: 45.0, stockQuintals: 450, shelfLife: '240 days', grade: 'Desi Whole' }
  ],
  movements: [
    {
      id: 'MOV-1049',
      date: 'Today, 18:20',
      timestamp: new Date().toISOString(),
      type: 'purchase_inward',
      commodity: 'Nashik Red Onion (नाशिक लाल कांदा)',
      commodityCode: 'ONION_RED',
      reportedQuantity: 140,
      unit: 'quintal',
      normalizedKg: 14000,
      farmerName: 'Sanjay Shinde (Sinnar)',
      refNo: 'RCPT-MH-9482',
      status: 'Verified Inward'
    },
    {
      id: 'MOV-1048',
      date: 'Today, 14:15',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      type: 'sale_dispatch',
      commodity: 'Tomato Hybrid (टोमॅटो हायब्रिड)',
      commodityCode: 'TOMATO_HYBRID',
      reportedQuantity: 60,
      unit: 'quintal',
      normalizedKg: 6000,
      farmerName: 'Vashi APMC Wholesale Merchant',
      refNo: 'CHALLAN-DISP-9021',
      status: 'Dispatched'
    },
    {
      id: 'MOV-1047',
      date: 'Today, 11:30',
      timestamp: new Date(Date.now() - 25200000).toISOString(),
      type: 'transfer_out',
      commodity: 'Yellow Soybean (पिवळी सोयाबीन)',
      commodityCode: 'SOYBEAN_YELLOW',
      reportedQuantity: 80,
      unit: 'quintal',
      normalizedKg: 8000,
      farmerName: 'Transfer to Baramati Godown WH-204',
      refNo: 'TRANS-PASS-881',
      status: 'In Transit'
    },
    {
      id: 'MOV-1046',
      date: 'Yesterday, 17:00',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'spoilage_damage',
      commodity: 'Tomato Hybrid (टोमॅटो हायब्रिड)',
      commodityCode: 'TOMATO_HYBRID',
      reportedQuantity: 3.5,
      unit: 'quintal',
      normalizedKg: 350,
      farmerName: 'Perishable sorting damage',
      refNo: 'SPOIL-AUDIT-412',
      status: 'Audit Recorded'
    }
  ]
};

// 4. Warehouse Specific API Endpoints
app.get('/api/warehouse/data', (req, res) => {
  res.json({
    success: true,
    data: warehouseInventoryState
  });
});

app.post('/api/warehouse/entry', (req, res) => {
  const { movementType, commodityCode, quantity, unit, farmerName, refNo, notes } = req.body;

  if (!movementType || !commodityCode || !quantity || !unit) {
    return res.status(400).json({ success: false, message: 'Missing required stock fields.' });
  }

  const numQty = parseFloat(quantity);
  if (isNaN(numQty) || numQty <= 0) {
    return res.status(400).json({ success: false, message: 'Quantity must be a positive number.' });
  }

  // Unit normalization: 1 quintal = 100 kg, 1 tonne = 1000 kg, 1 kg = 1 kg
  let normalizedKg = numQty;
  if (unit === 'quintal') normalizedKg = numQty * 100;
  if (unit === 'tonne') normalizedKg = numQty * 1000;
  const deltaMt = normalizedKg / 1000;

  // Find or create commodity
  let commodity = warehouseInventoryState.commodities.find(c => c.code === commodityCode);
  if (!commodity) {
    commodity = {
      code: commodityCode,
      name: commodityCode.replace('_', ' '),
      category: 'Produce',
      stockMt: 0,
      stockQuintals: 0,
      shelfLife: '30 days',
      grade: 'Standard'
    };
    warehouseInventoryState.commodities.push(commodity);
  }

  // Update balances according to blueprint rules
  if (movementType === 'purchase_inward' || movementType === 'transfer_in') {
    commodity.stockMt = parseFloat((commodity.stockMt + deltaMt).toFixed(2));
    commodity.stockQuintals = parseFloat((commodity.stockQuintals + (normalizedKg / 100)).toFixed(2));
    warehouseInventoryState.currentStockMt = parseFloat((warehouseInventoryState.currentStockMt + deltaMt).toFixed(2));
  } else if (movementType === 'sale_dispatch' || movementType === 'transfer_out' || movementType === 'spoilage_damage') {
    if (commodity.stockMt < deltaMt) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock! Available: ${commodity.stockMt} MT, Attempted to reduce: ${deltaMt} MT.`
      });
    }
    commodity.stockMt = parseFloat((commodity.stockMt - deltaMt).toFixed(2));
    commodity.stockQuintals = parseFloat((commodity.stockQuintals - (normalizedKg / 100)).toFixed(2));
    warehouseInventoryState.currentStockMt = parseFloat((warehouseInventoryState.currentStockMt - deltaMt).toFixed(2));
  }

  // Create movement entry
  const newMovement = {
    id: `MOV-${Date.now().toString().slice(-4)}`,
    date: 'Just now',
    timestamp: new Date().toISOString(),
    type: movementType,
    commodity: commodity.name,
    commodityCode: commodity.code,
    reportedQuantity: numQty,
    unit,
    normalizedKg,
    farmerName: farmerName || 'General Consignment',
    refNo: refNo || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Verified'
  };

  warehouseInventoryState.movements.unshift(newMovement);

  res.json({
    success: true,
    message: `Stock entry recorded successfully! Normalized: ${normalizedKg.toLocaleString()} kg (${deltaMt} MT)`,
    movement: newMovement,
    updatedStock: warehouseInventoryState
  });
});

// 5. Government State Intelligence Endpoints
export const govDirectivesList = [
  {
    id: 'DIR-MH-2026-08',
    date: 'Today, 15:30',
    title: 'Solapur & Osmanabad Tur Dal Buffer Replenishment',
    targetDivision: 'Solapur & Marathwada Division',
    priority: 'HIGH',
    status: 'Active Advisory',
    issuedBy: 'Dr. Rajesh Deshmukh, IAS (Director of Agri Marketing)',
    message: 'Authorized inter-district transfer of 5,000 MT Tur Dal from Latur & Nashik reserves to stabilize retail prices.'
  },
  {
    id: 'DIR-MH-2026-07',
    date: 'Yesterday, 11:00',
    title: 'Nashik Onion APMC Procurement & Storage Incentive',
    targetDivision: 'Nashik & Ahmednagar APMCs',
    priority: 'MEDIUM',
    status: 'In Progress',
    issuedBy: 'State Agri Intelligence Taskforce',
    message: 'High inward volume (+14.2% surplus). Encouraging participating cold vaults to extend storage duration with subsidized power rates.'
  }
];

export const mspMarketWatch = [
  { crop: 'Nashik Red Onion (कांदा)', msp: '₹1,650 / Qtl (Benchmark)', market: '₹1,820 / Qtl', trend: '+4.2%', status: 'Stable', intervention: 'Commercial APMC trading active' },
  { crop: 'Yellow Soybean (सोयाबीन)', msp: '₹4,892 / Qtl (Govt MSP)', market: '₹4,480 / Qtl', trend: '-8.4%', status: 'Below MSP Alert', intervention: 'Active PSS procurement across 18 centers' },
  { crop: 'Cotton Med. Staple (कापूस)', msp: '₹7,121 / Qtl (Govt MSP)', market: '₹7,250 / Qtl', trend: '+1.8%', status: 'Equilibrium', intervention: 'CCI godowns receiving stock smoothly' },
  { crop: 'Tur / Arhar Dal (तूर डाळ)', msp: '₹7,550 / Qtl (Govt MSP)', market: '₹10,400 / Qtl', trend: '+37.7%', status: 'High Price Spike', intervention: 'Strategic buffer release to Solapur & Konkan' }
];

export const districtIntelligenceData = [
  { district: 'Nashik', division: 'Nashik', activeGodowns: 38, talukas: 15, stockMt: 78500, leadCrop: 'Nashik Red Onion (कांदा)', trend: '+14.2%', trendType: 'surplus', freshnessPct: 99.2, forecastRisk: 'Surplus', daoOfficer: 'Smt. Sunita Patil', coldVaults: 24, dryGodowns: 14, contact: '+91 253-2578912' },
  { district: 'Pune', division: 'Pune', activeGodowns: 31, talukas: 14, stockMt: 34200, leadCrop: 'Tomato & Pomegranate (टोमॅटो)', trend: '-8.2%', trendType: 'tight', freshnessPct: 98.5, forecastRisk: 'Moderate Tight', daoOfficer: 'Shri. Vikram Shinde', coldVaults: 18, dryGodowns: 13, contact: '+91 20-26123401' },
  { district: 'Latur', division: 'Marathwada', activeGodowns: 24, talukas: 10, stockMt: 38400, leadCrop: 'Yellow Soybean (सोयाबीन)', trend: '+5.1%', trendType: 'positive', freshnessPct: 97.9, forecastRisk: 'Sufficient', daoOfficer: 'Shri. Ashok Deshmukh', coldVaults: 8, dryGodowns: 16, contact: '+91 2382-243201' },
  { district: 'Solapur', division: 'Pune', activeGodowns: 19, talukas: 11, stockMt: 13150, leadCrop: 'Tur / Arhar Dal (तूर डाळ)', trend: '-18.0%', trendType: 'deficit', freshnessPct: 96.8, forecastRisk: 'Shortage Alert', daoOfficer: 'Smt. Pradnya Gaikwad', coldVaults: 5, dryGodowns: 14, contact: '+91 217-2731802' },
  { district: 'Ahmednagar', division: 'Nashik', activeGodowns: 26, talukas: 14, stockMt: 29100, leadCrop: 'Red Onion & Bajra (कांदा)', trend: '+2.4%', trendType: 'positive', freshnessPct: 99.0, forecastRisk: 'Balanced', daoOfficer: 'Shri. Nilesh Thorat', coldVaults: 12, dryGodowns: 14, contact: '+91 241-2324560' },
  { district: 'Nagpur', division: 'Vidarbha', activeGodowns: 22, talukas: 14, stockMt: 25100, leadCrop: 'Cotton Medium Staple (कापूस)', trend: '+1.8%', trendType: 'positive', freshnessPct: 98.1, forecastRisk: 'Stable Reserve', daoOfficer: 'Dr. Suresh Bawankar', coldVaults: 7, dryGodowns: 15, contact: '+91 712-2563214' },
  { district: 'Chhatrapati Sambhajinagar', division: 'Marathwada', activeGodowns: 20, talukas: 9, stockMt: 22400, leadCrop: 'Maize & Cotton (मका/कापूस)', trend: '+3.1%', trendType: 'positive', freshnessPct: 98.4, forecastRisk: 'Balanced', daoOfficer: 'Shri. Anil Jadhav', coldVaults: 9, dryGodowns: 11, contact: '+91 240-2334812' },
  { district: 'Amravati', division: 'Vidarbha', activeGodowns: 18, talukas: 14, stockMt: 19800, leadCrop: 'Orange & Soybean (संत्री/सोयाबीन)', trend: '+4.5%', trendType: 'positive', freshnessPct: 97.6, forecastRisk: 'Sufficient', daoOfficer: 'Smt. Madhuri Bhende', coldVaults: 11, dryGodowns: 7, contact: '+91 721-2662198' },
  { district: 'Jalgaon', division: 'Nashik', activeGodowns: 18, talukas: 15, stockMt: 18200, leadCrop: 'Pulses & Banana (केळी/डाळी)', trend: '+3.9%', trendType: 'positive', freshnessPct: 97.4, forecastRisk: 'Adequate', daoOfficer: 'Shri. Kishor Mahajan', coldVaults: 10, dryGodowns: 8, contact: '+91 257-2227189' },
  { district: 'Kolhapur', division: 'Pune', activeGodowns: 16, talukas: 12, stockMt: 14800, leadCrop: 'Jaggery & Rice (भात/गूळ)', trend: '+0.5%', trendType: 'positive', freshnessPct: 98.9, forecastRisk: 'Balanced', daoOfficer: 'Smt. Rohini Kulkarni', coldVaults: 6, dryGodowns: 10, contact: '+91 231-2654320' },
  { district: 'Nanded', division: 'Marathwada', activeGodowns: 15, talukas: 16, stockMt: 16900, leadCrop: 'Soybean & Gram (सोयाबीन/हरभरा)', trend: '+2.8%', trendType: 'positive', freshnessPct: 97.2, forecastRisk: 'Balanced', daoOfficer: 'Shri. Dnyaneshwar More', coldVaults: 4, dryGodowns: 11, contact: '+91 2462-248910' },
  { district: 'Satara', division: 'Pune', activeGodowns: 14, talukas: 11, stockMt: 12600, leadCrop: 'Ginger & Strawberry (आले/स्ट्रॉबेरी)', trend: '+1.2%', trendType: 'positive', freshnessPct: 98.0, forecastRisk: 'Adequate', daoOfficer: 'Shri. Sachin Chavan', coldVaults: 9, dryGodowns: 5, contact: '+91 2162-234501' }
];

app.get('/api/gov/state-summary', (req, res) => {
  res.json({
    success: true,
    stats: demoStateStats,
    districts: districtIntelligenceData,
    directives: govDirectivesList,
    mspWatch: mspMarketWatch
  });
});

app.post('/api/gov/advisory', (req, res) => {
  const { title, targetDivision, priority, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Advisory title and message are mandatory.' });
  }

  const newDirective = {
    id: `DIR-MH-2026-${Math.floor(10 + Math.random() * 90)}`,
    date: 'Just now',
    title,
    targetDivision: targetDivision || 'Statewide All Divisions',
    priority: priority || 'MEDIUM',
    status: 'Dispatched to Gram Panchayats',
    issuedBy: 'Dr. Rajesh Deshmukh, IAS (Director of Agri Marketing)',
    message
  };

  govDirectivesList.unshift(newDirective);

  res.json({
    success: true,
    message: 'Planning Directive officially broadcasted to Gram Panchayats, FPOs, and APMCs.',
    directive: newDirective
  });
});

// Emergency Buffer Re-Allocation API
app.post('/api/gov/reallocate', (req, res) => {
  const { fromDistrict, toDistrict, commodity, quantityMt } = req.body;
  const numQty = parseFloat(quantityMt);

  if (!fromDistrict || !toDistrict || !numQty || isNaN(numQty) || numQty <= 0) {
    return res.status(400).json({ success: false, message: 'Please provide valid source, destination, and quantity in MT.' });
  }

  const src = districtIntelligenceData.find(d => d.district.toLowerCase() === fromDistrict.toLowerCase());
  const dst = districtIntelligenceData.find(d => d.district.toLowerCase() === toDistrict.toLowerCase());

  if (!src || !dst) {
    return res.status(404).json({ success: false, message: 'Source or destination district not found in active database.' });
  }

  if (src.stockMt < numQty) {
    return res.status(400).json({ success: false, message: `Insufficient reserve in ${src.district}. Available: ${src.stockMt} MT.` });
  }

  src.stockMt = parseFloat((src.stockMt - numQty).toFixed(2));
  dst.stockMt = parseFloat((dst.stockMt + numQty).toFixed(2));

  // If Solapur receives buffer, mitigate shortage
  if (dst.district === 'Solapur' && dst.stockMt >= 15000) {
    dst.forecastRisk = 'Stabilized Buffer';
    dst.trend = '+4.5%';
    dst.trendType = 'positive';
  }

  const newDirective = {
    id: `DIR-ALLOC-${Date.now().toString().slice(-4)}`,
    date: 'Just now',
    title: `Emergency Strategic Stock Transfer: ${fromDistrict} → ${toDistrict}`,
    targetDivision: `${src.division} & ${dst.division} Division`,
    priority: 'HIGH',
    status: 'In Transit via State Freight Corridor',
    issuedBy: 'State Agri Intelligence Taskforce (Automated Re-Allocation)',
    message: `Mobilized ${numQty.toLocaleString()} MT of ${commodity || 'produce'} from ${fromDistrict} reserves to alleviate buffer deficits in ${toDistrict}. Subsidized transport order active.`
  };

  govDirectivesList.unshift(newDirective);

  res.json({
    success: true,
    message: `Successfully mobilized ${numQty.toLocaleString()} MT from ${fromDistrict} to ${toDistrict}. Transit directive logged.`,
    fromStock: src.stockMt,
    toStock: dst.stockMt,
    directive: newDirective
  });
});

// Dedicated routes for warehouse and government pages
app.get('/warehouse', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'warehouse.html'));
});

app.get('/government', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'government.html'));
});

// Fallback to index.html for single-page routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🌾 MAHA INVENTORY SERVER RUNNING ON PORT ${PORT} `);
  console.log(`  🔗 Local URL: http://localhost:${PORT}             `);
  console.log(`  🏛️ Dual Portals: Warehouse Buyer & Govt Official   `);
  console.log(`  ⚡ Database: Supabase PostgreSQL Adapter Ready      `);
  console.log(`====================================================`);
});
