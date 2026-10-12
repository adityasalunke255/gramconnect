// ==========================================================================
// MAHA INVENTORY - WAREHOUSE OPERATOR CLIENT LOGIC
// Stock Entry, Facility Gallery & Live Godown Ledger
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Gallery elements
  const mainFacilityImg = document.getElementById('mainFacilityImg');
  const galleryBadge = document.getElementById('galleryBadge');
  const galleryTitle = document.getElementById('galleryTitle');
  const galleryDesc = document.getElementById('galleryDesc');
  const thumbBtns = document.querySelectorAll('.thumb-btn');

  // Capacity Gauge
  const utilizationPctBadge = document.getElementById('utilizationPctBadge');
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugeCenterLabel = document.getElementById('gaugeCenterLabel');
  const dispTotalStock = document.getElementById('dispTotalStock');
  const dispTotalQuintals = document.getElementById('dispTotalQuintals');
  const dispFreeSpace = document.getElementById('dispFreeSpace');

  // Entry Form & Movement Tabs
  const movementTabs = document.querySelectorAll('.m-tab-btn');
  const entryMovementType = document.getElementById('entryMovementType');
  const entryModeBanner = document.getElementById('entryModeBanner');
  const modeIcon = document.getElementById('modeIcon');
  const modeTitle = document.getElementById('modeTitle');
  const modeDesc = document.getElementById('modeDesc');
  const lblPartyName = document.getElementById('lblPartyName');
  const entryFarmerName = document.getElementById('entryFarmerName');
  const lblNotes = document.getElementById('lblNotes');
  const entryCommodity = document.getElementById('entryCommodity');
  const entryQuantity = document.getElementById('entryQuantity');
  const entryUnit = document.getElementById('entryUnit');
  const convertedKgDisplay = document.getElementById('convertedKgDisplay');
  const entryRefNo = document.getElementById('entryRefNo');
  const entryNotes = document.getElementById('entryNotes');
  const stockEntryForm = document.getElementById('stockEntryForm');
  const btnSubmitEntry = document.getElementById('btnSubmitEntry');
  const btnEntryIcon = document.getElementById('btnEntryIcon');
  const btnEntryLabel = document.getElementById('btnEntryLabel');
  const entryFeedbackToast = document.getElementById('entryFeedbackToast');

  // Commodity Balances & Movements Table
  const commodityCardsGrid = document.getElementById('commodityCardsGrid');
  const movementsTableBody = document.getElementById('movementsTableBody');
  const tblFilterPills = document.querySelectorAll('.tbl-filter-pill');
  const btnPrintDailyReport = document.getElementById('btnPrintDailyReport');

  let currentMovements = [];
  let currentFilter = 'all';

  // 1. Photographic Showcase Thumbnail Switching
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgUrl = btn.getAttribute('data-img');
      const badge = btn.getAttribute('data-badge');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');

      mainFacilityImg.style.opacity = '0.4';
      setTimeout(() => {
        mainFacilityImg.src = imgUrl;
        galleryBadge.textContent = badge;
        galleryTitle.textContent = title;
        galleryDesc.textContent = desc;
        mainFacilityImg.style.opacity = '1';
      }, 150);
    });
  });

  // 2. Fetch Godown State from Server
  async function loadWarehouseState() {
    try {
      const storedUser = JSON.parse(localStorage.getItem('maha_warehouse_user') || '{}');
      if (storedUser.businessName) {
        const titleEl = document.querySelector('.wh-main-title');
        if (titleEl) titleEl.textContent = storedUser.businessName;
      }
      if (storedUser.ownerName) {
        const nameEl = document.querySelector('.operator-name');
        if (nameEl) nameEl.textContent = storedUser.ownerName;
        const avatarEl = document.querySelector('.operator-avatar');
        if (avatarEl) {
          const initials = storedUser.ownerName.split(' ').map(n => n[0]).join('').slice(0, 2);
          avatarEl.textContent = initials || 'OP';
        }
      }
      if (storedUser.godownId) {
        const codeEl = document.querySelector('.wh-badge-code');
        if (codeEl) codeEl.textContent = storedUser.godownId;
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/warehouse/data');
      const json = await res.json();
      if (json.success && json.data) {
        renderGodownOverview(json.data);
      }
    } catch (err) {
      console.error('Failed to load warehouse data:', err);
    }
  }

  function renderGodownOverview(data) {
    const totalCap = data.totalCapacityMt || 1200;
    const currentStock = data.currentStockMt || 0;
    const freeSpace = Math.max(0, parseFloat((totalCap - currentStock).toFixed(2)));
    const pct = Math.min(100, Math.round((currentStock / totalCap) * 100));

    // Gauge updates
    gaugeFill.style.width = `${pct}%`;
    utilizationPctBadge.textContent = `${pct}% Full`;
    gaugeCenterLabel.textContent = `${currentStock.toLocaleString()} MT Stored`;
    dispTotalStock.innerHTML = `${currentStock.toLocaleString()} <small>MT</small>`;
    dispTotalQuintals.textContent = `${(currentStock * 10).toLocaleString()} Quintals`;
    dispFreeSpace.innerHTML = `${freeSpace.toLocaleString()} <small>MT</small>`;

    // Commodities grid
    renderCommodities(data.commodities || []);

    // Movements table
    currentMovements = data.movements || [];
    renderMovementsTable();
  }

  function getCommodityIcon(code) {
    if (code.includes('ONION')) return '🧅';
    if (code.includes('TOMATO')) return '🍅';
    if (code.includes('SOYBEAN')) return '🌱';
    if (code.includes('COTTON')) return '🌾';
    if (code.includes('GRAPES')) return '🍇';
    if (code.includes('POMEGRANATE')) return '🍎';
    if (code.includes('TUR')) return '🥣';
    return '📦';
  }

  function renderCommodities(commodities) {
    commodityCardsGrid.innerHTML = commodities.map(c => {
      const icon = getCommodityIcon(c.code);
      return `
        <div class="comm-card">
          <div>
            <div class="comm-header">
              <span class="comm-icon">${icon}</span>
              <span class="comm-category-tag">${c.category}</span>
            </div>
            <h4 class="comm-name">${c.name}</h4>
            <div class="comm-stock-val">${c.stockMt.toLocaleString()} <small>MT</small></div>
            <div class="comm-quintals-sub">${(c.stockMt * 10).toLocaleString()} Quintals (${(c.stockMt * 1000).toLocaleString()} kg)</div>
          </div>
          <div class="comm-footer">
            <span>⏳ Shelf: ${c.shelfLife}</span>
            <span>⭐ ${c.grade}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderMovementsTable() {
    let list = currentMovements;
    if (currentFilter !== 'all') {
      list = list.filter(m => m.type === currentFilter);
    }

    if (list.length === 0) {
      movementsTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 2rem; color: var(--text-muted);">
            No movement entries recorded for this filter.
          </td>
        </tr>
      `;
      return;
    }

    movementsTableBody.innerHTML = list.map(m => {
      let badgeHtml = '';
      if (m.type === 'purchase_inward' || m.type === 'transfer_in') {
        badgeHtml = `<span class="badge-stock badge-inward">🌾 Farmer Purchase Inward</span>`;
      } else if (m.type === 'sale_dispatch') {
        badgeHtml = `<span class="badge-stock badge-dispatch">🚚 Sale / Outward Dispatch</span>`;
      } else if (m.type === 'transfer_out') {
        badgeHtml = `<span class="badge-stock badge-warning">⇄ Inter-Godown Transfer</span>`;
      } else if (m.type === 'spoilage_damage') {
        badgeHtml = `<span class="badge-stock" style="background:rgba(239,68,68,0.2); color:#fca5a5;">⚠️ Spoilage / Sorting Loss</span>`;
      }

      return `
        <tr>
          <td><strong style="font-family:var(--font-mono); color:#93c5fd;">${m.id}</strong></td>
          <td style="color:var(--text-secondary);">${m.date}</td>
          <td><strong>${m.commodity}</strong></td>
          <td>${badgeHtml}</td>
          <td><strong>${m.reportedQuantity} ${m.unit}</strong></td>
          <td style="font-family:var(--font-mono); color:#34d399;">${m.normalizedKg.toLocaleString()} kg</td>
          <td>${m.farmerName}</td>
          <td><code style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${m.refNo}</code></td>
          <td><span style="color:#34d399; font-weight:600;">✓ ${m.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  // 3. Table Filters
  tblFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tblFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderMovementsTable();
    });
  });

  // 4. Movement Mode Switching (Inward, Outward, Transfer, Spoilage)
  movementTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      movementTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.getAttribute('data-type');
      entryMovementType.value = mode;

      if (mode === 'purchase_inward') {
        entryModeBanner.className = 'entry-mode-banner inward-mode';
        modeIcon.textContent = '🌾';
        modeTitle.textContent = 'Farmer Purchase Inward (शेतकरी आवक नोंद)';
        modeDesc.textContent = 'Record incoming agricultural produce directly from farmers. Farmers do NOT need an account.';
        lblPartyName.innerHTML = 'Farmer Name & Village (शेतकऱ्याचे नाव / गाव) <span class="label-optional">(Optional)</span>';
        entryFarmerName.placeholder = 'e.g. Ramesh Patil (Sinnar, Nashik)';
        btnEntryIcon.textContent = '🌾';
        btnEntryLabel.textContent = 'Record Farmer Inward into Godown Ledger';
      } else if (mode === 'sale_dispatch') {
        entryModeBanner.className = 'entry-mode-banner dispatch-mode';
        modeIcon.textContent = '🚚';
        modeTitle.textContent = 'Sale / Outward Dispatch (जावक / विक्री नोंद)';
        modeDesc.textContent = 'Record produce leaving the godown to wholesale merchants, APMC mandis, or processors.';
        lblPartyName.innerHTML = 'Buyer / Consignee APMC Name (खरेदीदार / बाजार समिती) *';
        entryFarmerName.placeholder = 'e.g. Vashi Navi Mumbai APMC Wholesaler';
        btnEntryIcon.textContent = '🚚';
        btnEntryLabel.textContent = 'Record Outward Dispatch (Reduce Stock)';
      } else if (mode === 'transfer_out') {
        entryModeBanner.className = 'entry-mode-banner transfer-mode';
        modeIcon.textContent = '⇄';
        modeTitle.textContent = 'Inter-Godown Transfer (गोदाम-ते-गोदाम ट्रान्सफर)';
        modeDesc.textContent = 'Transfer stock to another participating Maharashtra godown without inflating statewide net total.';
        lblPartyName.innerHTML = 'Destination Godown Code & Location *';
        entryFarmerName.placeholder = 'e.g. Baramati Krishi Godown (WH-MH-PUN-204)';
        btnEntryIcon.textContent = '⇄';
        btnEntryLabel.textContent = 'Dispatch Godown Transfer (Transit Pass)';
      } else if (mode === 'spoilage_damage') {
        entryModeBanner.className = 'entry-mode-banner spoilage-mode';
        modeIcon.textContent = '⚠️';
        modeTitle.textContent = 'Spoilage / Sorting Loss Audit (खराब / घट नोंद)';
        modeDesc.textContent = 'Audit damaged or spoiled inventory. Deducts from usable stock and tracks in state spoilage register.';
        lblPartyName.innerHTML = 'Disposal / Verification Officer *';
        entryFarmerName.placeholder = 'e.g. S. Patil (Godown Quality Inspector)';
        lblNotes.innerHTML = 'Damage Reason (घटीचे कारण: Perishable rot, Moisture loss, Sorting waste) *';
        btnEntryIcon.textContent = '⚠️';
        btnEntryLabel.textContent = 'Audit & Deduct Spoilage from Balance';
      }
    });
  });

  // 5. Live Weight Standardization Converter
  function updateStandardWeight() {
    const qty = parseFloat(entryQuantity.value);
    const unit = entryUnit.value;

    if (isNaN(qty) || qty <= 0) {
      convertedKgDisplay.textContent = '0 kg (0.00 MT)';
      return;
    }

    let kg = qty;
    if (unit === 'quintal') kg = qty * 100;
    if (unit === 'tonne') kg = qty * 1000;
    const mt = (kg / 1000).toFixed(2);

    convertedKgDisplay.textContent = `${kg.toLocaleString()} kg (${mt} Metric Tonnes)`;
  }

  entryQuantity.addEventListener('input', updateStandardWeight);
  entryUnit.addEventListener('change', updateStandardWeight);

  // 6. Form Submission (Add Stock Movement)
  stockEntryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideToast();

    const movementType = entryMovementType.value;
    const commodityCode = entryCommodity.value;
    const quantity = parseFloat(entryQuantity.value);
    const unit = entryUnit.value;
    const farmerName = entryFarmerName.value.trim();
    const refNo = entryRefNo.value.trim();
    const notes = entryNotes.value.trim();

    if (isNaN(quantity) || quantity <= 0) {
      showToast('Please specify a valid positive quantity.', 'error');
      return;
    }

    btnSubmitEntry.disabled = true;
    const oldText = btnEntryLabel.textContent;
    btnEntryLabel.textContent = 'Committing Movement to Ledger...';

    try {
      const res = await fetch('/api/warehouse/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movementType,
          commodityCode,
          quantity,
          unit,
          farmerName,
          refNo,
          notes
        })
      });

      const result = await res.json();

      if (result.success) {
        showToast(result.message, 'success');
        if (result.updatedStock) {
          renderGodownOverview(result.updatedStock);
        }

        // Reset form inputs
        entryQuantity.value = '';
        entryFarmerName.value = '';
        entryRefNo.value = '';
        entryNotes.value = '';
        updateStandardWeight();
      } else {
        showToast(result.message || 'Failed to record entry.', 'error');
      }
    } catch (err) {
      showToast('Connection error with server.', 'error');
    } finally {
      btnSubmitEntry.disabled = false;
      btnEntryLabel.textContent = oldText;
    }
  });

  function showToast(msg, type) {
    entryFeedbackToast.textContent = msg;
    entryFeedbackToast.className = `entry-feedback-toast show ${type}`;
    setTimeout(hideToast, 5000);
  }

  function hideToast() {
    entryFeedbackToast.className = 'entry-feedback-toast';
  }

  // 7. Print Daily Report Handler
  if (btnPrintDailyReport) {
    btnPrintDailyReport.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial load
  loadWarehouseState();
});
