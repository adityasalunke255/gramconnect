// ==========================================================================
// MAHA INVENTORY - GOVERNMENT STATE INTELLIGENCE CLIENT LOGIC
// Executive Command, Tab Navigation, 3-Dot Actions & AI Forecasts
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Gallery elements
  const govHeroImg = document.getElementById('govHeroImg');
  const govGalleryBadge = document.getElementById('govGalleryBadge');
  const govGalleryTitle = document.getElementById('govGalleryTitle');
  const govGalleryDesc = document.getElementById('govGalleryDesc');
  const govThumbBtns = document.querySelectorAll('.gov-thumb-btn');

  // KPI elements
  const dispStateStock = document.getElementById('dispStateStock');
  const dispFreshness = document.getElementById('dispFreshness');
  const dispTotalGodowns = document.getElementById('dispTotalGodowns');
  const dispBufferPct = document.getElementById('dispBufferPct');
  const dispBufferFill = document.getElementById('dispBufferFill');
  const govOfficerName = document.getElementById('govOfficerName');
  const govOfficerRole = document.getElementById('govOfficerRole');

  // Executive Tab Switching Elements
  const govNavTabs = document.querySelectorAll('.gov-nav-tab');
  const govTabPanes = document.querySelectorAll('.gov-tab-pane');

  // Master Operations 3-Dot Dropdown
  const btnMasterMenu = document.getElementById('btnMasterMenu');
  const masterDropdown = document.getElementById('masterDropdown');
  const menuItemDirective = document.getElementById('menuItemDirective');
  const menuItemReallocate = document.getElementById('menuItemReallocate');
  const menuItemExportCsv = document.getElementById('menuItemExportCsv');
  const menuItemPrintDossier = document.getElementById('menuItemPrintDossier');

  // District Table & Filters
  const searchDistrictInput = document.getElementById('searchDistrictInput');
  const distFilterPills = document.querySelectorAll('.dist-filter-pill');
  const districtsTableBody = document.getElementById('districtsTableBody');
  const btnExportCsv = document.getElementById('btnExportCsv');

  // Row Context Menu (3-Dots on District Rows)
  const distContextMenu = document.getElementById('distContextMenu');
  const contextMenuTitle = document.getElementById('contextMenuTitle');
  const contextInspect = document.getElementById('contextInspect');
  const contextAudit = document.getElementById('contextAudit');
  const contextTransfer = document.getElementById('contextTransfer');
  const contextDirective = document.getElementById('contextDirective');

  // MSP Table
  const mspTableBody = document.getElementById('mspTableBody');

  // Dedicated Directives Studio Elements
  const directivesList = document.getElementById('directivesList');
  const activeDirectiveCountBadge = document.getElementById('activeDirectiveCountBadge');
  const studioDirectiveForm = document.getElementById('studioDirectiveForm');
  const studioDirTitle = document.getElementById('studioDirTitle');
  const studioDirDivision = document.getElementById('studioDirDivision');
  const studioDirPriority = document.getElementById('studioDirPriority');
  const studioDirMessage = document.getElementById('studioDirMessage');
  const directivePresetBtns = document.querySelectorAll('.tmpl-chip-btn[data-preset]');

  // Dedicated Buffer Re-Allocation Studio Elements
  const studioReallocForm = document.getElementById('studioReallocForm');
  const studioReallocFrom = document.getElementById('studioReallocFrom');
  const studioReallocTo = document.getElementById('studioReallocTo');
  const studioReallocCommodity = document.getElementById('studioReallocCommodity');
  const studioReallocQty = document.getElementById('studioReallocQty');
  const studioReallocSlider = document.getElementById('studioReallocSlider');
  const sliderQtyDisplay = document.getElementById('sliderQtyDisplay');
  const reallocPresetBtns = document.querySelectorAll('.realloc-preset-btn');
  const corridorSourceDistrict = document.getElementById('corridorSourceDistrict');
  const corridorSourceStock = document.getElementById('corridorSourceStock');
  const corridorTargetDistrict = document.getElementById('corridorTargetDistrict');
  const corridorTargetStock = document.getElementById('corridorTargetStock');
  const corridorLorryCommodity = document.getElementById('corridorLorryCommodity');
  const calcRemainingSurplus = document.getElementById('calcRemainingSurplus');
  const calcDeficitReduction = document.getElementById('calcDeficitReduction');
  const calcTrucksRequired = document.getElementById('calcTrucksRequired');
  const reallocTransitsTableBody = document.getElementById('reallocTransitsTableBody');

  // Dedicated District Dossier Inspector Elements
  const studioDossierSelect = document.getElementById('studioDossierSelect');
  const dossierQuickChips = document.querySelectorAll('.dossier-chip-btn');
  const studioDossierTitle = document.getElementById('studioDossierTitle');
  const studioDossierDivisionBadge = document.getElementById('studioDossierDivisionBadge');
  const studioDossierRiskBadge = document.getElementById('studioDossierRiskBadge');
  const studioDossierStock = document.getElementById('studioDossierStock');
  const studioDossierStockBar = document.getElementById('studioDossierStockBar');
  const studioDossierGodowns = document.getElementById('studioDossierGodowns');
  const studioDossierColdVal = document.getElementById('studioDossierColdVal');
  const studioDossierColdBar = document.getElementById('studioDossierColdBar');
  const studioDossierFreshness = document.getElementById('studioDossierFreshness');
  const studioDossierLeadCrop = document.getElementById('studioDossierLeadCrop');
  const studioDaoName = document.getElementById('studioDaoName');
  const studioDaoRole = document.getElementById('studioDaoRole');
  const studioDaoPhoneLink = document.getElementById('studioDaoPhoneLink');
  const btnStudioDispatchAudit = document.getElementById('btnStudioDispatchAudit');
  const btnExportDossierPdf = document.getElementById('btnExportDossierPdf');

  // Quick Action Buttons
  const btnOpenAdvisoryModal = document.getElementById('btnOpenAdvisoryModal');
  const btnOpenReallocateModal = document.getElementById('btnOpenReallocateModal');
  const btnPrintStateReport = document.getElementById('btnPrintStateReport');

  // Fallback Modals (Fixed Overlay)
  const advisoryModal = document.getElementById('advisoryModal');
  const btnCloseAdvisoryModal = document.getElementById('btnCloseAdvisoryModal');
  const btnCancelDirective = document.getElementById('btnCancelDirective');
  const reallocateModal = document.getElementById('reallocateModal');
  const btnCloseReallocateModal = document.getElementById('btnCloseReallocateModal');
  const btnCancelReallocate = document.getElementById('btnCancelReallocate');
  const districtDetailModal = document.getElementById('districtDetailModal');
  const btnCloseDistrictModal = document.getElementById('btnCloseDistrictModal');
  const btnCloseDossierBottom = document.getElementById('btnCloseDossierBottom');
  const btnDispatchAuditFromDossier = document.getElementById('btnDispatchAuditFromDossier');

  let currentDistricts = [];
  let currentDivision = 'all';
  let activeSelectedDistrict = null;
  let activeContextDistrict = null;

  // 1. Hydrate Logged in Official Profile
  try {
    const govUser = JSON.parse(localStorage.getItem('maha_gov_user') || '{}');
    if (govUser.name) govOfficerName.textContent = govUser.name;
    if (govUser.designation) govOfficerRole.textContent = govUser.designation;
    if (govUser.name) {
      const initials = govUser.name.split(' ').map(n => n[0]).join('').slice(0, 2);
      const avatarEl = document.querySelector('.official-avatar');
      if (avatarEl) avatarEl.textContent = initials || 'GOV';
    }
  } catch (e) {}

  // 2. Executive Tab Navigation (Overview, Forecast, MSP, Directives)
  // 2. Executive Tab Navigation Helper
  function switchTab(targetId) {
    govNavTabs.forEach(t => {
      if (t.getAttribute('data-target') === targetId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    govTabPanes.forEach(p => {
      if (p.id === targetId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    closeContextMenu();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  govNavTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      switchTab(targetId);
    });
  });

  // 3. Master 3-Dots Operations Menu
  if (btnMasterMenu && masterDropdown) {
    btnMasterMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      masterDropdown.classList.toggle('open');
      closeContextMenu();
    });

    document.addEventListener('click', (e) => {
      if (!masterDropdown.contains(e.target) && e.target !== btnMasterMenu) {
        masterDropdown.classList.remove('open');
      }
    });

    if (menuItemDirective) menuItemDirective.addEventListener('click', () => {
      masterDropdown.classList.remove('open');
      switchTab('view-directives');
    });

    if (menuItemReallocate) menuItemReallocate.addEventListener('click', () => {
      masterDropdown.classList.remove('open');
      switchTab('view-reallocate');
    });

    if (menuItemExportCsv) menuItemExportCsv.addEventListener('click', () => {
      masterDropdown.classList.remove('open');
      exportDistrictsCsv();
    });

    if (menuItemPrintDossier) menuItemPrintDossier.addEventListener('click', () => {
      masterDropdown.classList.remove('open');
      window.print();
    });
  }

  // Quick Action Buttons on Overview Hero
  if (btnOpenAdvisoryModal) btnOpenAdvisoryModal.addEventListener('click', () => switchTab('view-directives'));
  if (btnOpenReallocateModal) btnOpenReallocateModal.addEventListener('click', () => switchTab('view-reallocate'));

  // 4. Command Showcase Gallery Switching (4 Authentic Photos)
  govThumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      govThumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const imgUrl = btn.getAttribute('data-img');
      const badge = btn.getAttribute('data-badge');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');

      govHeroImg.style.opacity = '0.35';
      setTimeout(() => {
        govHeroImg.src = imgUrl;
        govGalleryBadge.textContent = badge;
        govGalleryTitle.textContent = title;
        govGalleryDesc.textContent = desc;
        govHeroImg.style.opacity = '1';
      }, 150);
    });
  });

  // 5. Fetch State Summary Data
  async function loadStateSummary() {
    try {
      const res = await fetch('/api/gov/state-summary');
      const json = await res.json();
      if (json.success) {
        if (json.stats) {
          dispStateStock.innerHTML = `${json.stats.currentStockMt.toLocaleString()} <small>MT</small>`;
          dispFreshness.textContent = `${json.stats.freshnessPct}%`;
          if (dispTotalGodowns) dispTotalGodowns.textContent = `${json.stats.activeGodowns} Godowns`;

          // Buffer target calculation (2,50,000 MT Statutory Target)
          const statutoryTarget = 250000;
          const bufferPct = ((json.stats.currentStockMt / statutoryTarget) * 100).toFixed(1);
          if (dispBufferPct) dispBufferPct.textContent = `${bufferPct}% Secured`;
          if (dispBufferFill) dispBufferFill.style.width = `${Math.min(bufferPct, 100)}%`;
        }

        currentDistricts = json.districts || [];
        renderDistrictsTable();
        renderMspTable(json.mspWatch || []);
        renderDirectives(json.directives || []);
        loadStudioDistrictDossier('Nashik');
        updateReallocImpact();
      }
    } catch (err) {
      console.error('Failed to load government state summary:', err);
    }
  }

  // 6. Render Districts Table with 3-Dot (⋮) Action Menus
  function renderDistrictsTable() {
    let list = currentDistricts;

    // Filter by division
    if (currentDivision !== 'all') {
      list = list.filter(d => d.division.toLowerCase() === currentDivision.toLowerCase());
    }

    // Filter by search query
    const query = searchDistrictInput.value.trim().toLowerCase();
    if (query) {
      list = list.filter(d => 
        d.district.toLowerCase().includes(query) ||
        d.division.toLowerCase().includes(query) ||
        d.leadCrop.toLowerCase().includes(query) ||
        (d.daoOfficer && d.daoOfficer.toLowerCase().includes(query))
      );
    }

    if (list.length === 0) {
      districtsTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align:center; padding: 2.5rem; color: var(--text-muted);">
            No district matches the active filter or search keyword.
          </td>
        </tr>
      `;
      return;
    }

    districtsTableBody.innerHTML = list.map(d => {
      let riskBadge = '';
      if (d.forecastRisk === 'Surplus') {
        riskBadge = `<span class="f-risk-badge surplus">✓ Surplus Buffer</span>`;
      } else if (d.forecastRisk.includes('Shortage') || d.forecastRisk.includes('Tight')) {
        riskBadge = `<span class="f-risk-badge shortage">⚠️ Shortage Alert</span>`;
      } else {
        riskBadge = `<span class="f-risk-badge stable">● Balanced</span>`;
      }

      let trendColor = '#34d399';
      if (d.trendType === 'tight' || d.trendType === 'deficit') trendColor = '#f87171';

      return `
        <tr data-district="${d.district}">
          <td>
            <strong>${d.district}</strong>
            <small style="display:block; color:var(--text-muted); font-size:0.75rem;">${d.talukas} Talukas mapped</small>
          </td>
          <td><span style="font-size:0.78rem; color:#cbd5e1;">${d.division} Division</span></td>
          <td><strong style="color:#fbbf24;">${d.activeGodowns} Godowns</strong></td>
          <td><strong style="font-family:var(--font-mono); color:#fff; font-size:1.05rem;">${d.stockMt.toLocaleString()} MT</strong></td>
          <td>${d.leadCrop}</td>
          <td><span style="color:${trendColor}; font-weight:700;">${d.trend}</span></td>
          <td><span style="color:#34d399; font-weight:600;">✓ ${d.freshnessPct}% Fresh</span></td>
          <td>${riskBadge}</td>
          <td><span style="color:#94a3b8; font-size:0.8rem;">${d.daoOfficer || 'Assigned DAO'}</span></td>
          <td class="action-cell">
            <button type="button" class="btn-row-dots" data-district="${d.district}" title="Operations for ${d.district}">
              ⋮
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row click listeners (outside the 3-dot button)
    const rows = districtsTableBody.querySelectorAll('tr[data-district]');
    rows.forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('.btn-row-dots')) return;
        const distName = row.getAttribute('data-district');
        openDistrictDossier(distName);
      });
    });

    // Attach 3-Dot (⋮) Button Listeners
    const dotBtns = districtsTableBody.querySelectorAll('.btn-row-dots');
    dotBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const distName = btn.getAttribute('data-district');
        const item = currentDistricts.find(d => d.district.toLowerCase() === distName.toLowerCase());
        if (!item) return;

        activeContextDistrict = item;
        contextMenuTitle.textContent = `${item.district} Operations`;

        // Position menu directly below the 3-dot button
        const rect = btn.getBoundingClientRect();
        const menuWidth = 230;
        let left = rect.right - menuWidth;
        if (left < 10) left = 10;
        let top = rect.bottom + 6;
        if (top + 180 > window.innerHeight) top = rect.top - 180;

        distContextMenu.style.top = `${top}px`;
        distContextMenu.style.left = `${left}px`;
        distContextMenu.classList.add('open');
      });
    });
  }

  // 7. Context Menu Actions
  function closeContextMenu() {
    if (distContextMenu) distContextMenu.classList.remove('open');
  }

  document.addEventListener('click', (e) => {
    if (distContextMenu && !distContextMenu.contains(e.target) && !e.target.closest('.btn-row-dots')) {
      closeContextMenu();
    }
  });

  if (contextInspect) contextInspect.addEventListener('click', () => {
    if (activeContextDistrict) {
      loadStudioDistrictDossier(activeContextDistrict.district);
      switchTab('view-dossier');
    }
    closeContextMenu();
  });

  if (contextAudit) contextAudit.addEventListener('click', () => {
    if (activeContextDistrict) {
      alert(`Official Audit Notice Dispatched!\nDAO Officer: ${activeContextDistrict.daoOfficer}\nDistrict: ${activeContextDistrict.district} HQ\nStatus: Electronic Audit Scheduled.`);
    }
    closeContextMenu();
  });

  if (contextTransfer) contextTransfer.addEventListener('click', () => {
    if (activeContextDistrict) {
      if (studioReallocFrom) studioReallocFrom.value = activeContextDistrict.district;
      updateReallocImpact();
      switchTab('view-reallocate');
    }
    closeContextMenu();
  });

  if (contextDirective) contextDirective.addEventListener('click', () => {
    if (activeContextDistrict) {
      if (studioDirTitle) studioDirTitle.value = `${activeContextDistrict.district} Agricultural Buffer & Supply Directive`;
      switchTab('view-directives');
    }
    closeContextMenu();
  });

  // 8. Open District Dossier (Both Studio View & Modal Fallback)
  function openDistrictDossier(districtName) {
    loadStudioDistrictDossier(districtName);
    switchTab('view-dossier');
  }

  // 9. Dedicated District Dossier Inspector Engine
  function loadStudioDistrictDossier(districtName) {
    if (!currentDistricts || currentDistricts.length === 0) return;
    const item = currentDistricts.find(d => d.district.toLowerCase() === districtName.toLowerCase()) || currentDistricts[0];
    if (!item) return;

    activeSelectedDistrict = item;

    if (studioDossierTitle) studioDossierTitle.textContent = `${item.district} District Dossier`;
    if (studioDossierDivisionBadge) studioDossierDivisionBadge.textContent = `${item.division} Division`;
    if (studioDossierRiskBadge) {
      studioDossierRiskBadge.textContent = `● ${item.forecastRisk || 'Monitored Reserve'}`;
      if (item.forecastRisk.includes('Shortage') || item.forecastRisk.includes('Tight')) {
        studioDossierRiskBadge.style.color = '#f87171';
        studioDossierRiskBadge.style.borderColor = 'rgba(239,68,68,0.4)';
      } else {
        studioDossierRiskBadge.style.color = '#34d399';
        studioDossierRiskBadge.style.borderColor = 'rgba(16,185,129,0.4)';
      }
    }

    if (studioDossierStock) studioDossierStock.textContent = `${item.stockMt.toLocaleString()} MT`;
    if (studioDossierStockBar) studioDossierStockBar.style.width = `${Math.min(100, Math.round(item.stockMt / 1000))}%`;
    if (studioDossierGodowns) studioDossierGodowns.textContent = `${item.activeGodowns} Facilities`;

    const coldCount = item.coldVaults || Math.round(item.activeGodowns * 0.6);
    if (studioDossierColdVal) studioDossierColdVal.textContent = `${coldCount} Facilities`;
    if (studioDossierColdBar) studioDossierColdBar.style.width = `${Math.min(100, Math.round((coldCount / item.activeGodowns) * 100))}%`;

    if (studioDossierFreshness) studioDossierFreshness.textContent = `${item.freshnessPct || 98.5}%`;
    if (studioDossierLeadCrop) {
      studioDossierLeadCrop.textContent = `${item.leadCrop} • Weekly inward velocity ${item.trend}. APMC modal monitoring active. ${item.talukas} Talukas submitting daily electronic returns.`;
    }

    if (studioDaoName) studioDaoName.textContent = item.daoOfficer || 'District Agricultural Officer';
    if (studioDaoRole) studioDaoRole.textContent = `District Agricultural Officer (DAO) • Govt of Maharashtra • ${item.district} HQ`;
    
    const phone = item.contact || '+91 20-26123401';
    if (studioDaoPhoneLink) {
      studioDaoPhoneLink.href = `tel:${phone}`;
      studioDaoPhoneLink.innerHTML = `<span>📞</span> Call DAO (${phone})`;
    }

    // Quick Chips active state
    dossierQuickChips.forEach(chip => {
      if (chip.getAttribute('data-dist').toLowerCase() === item.district.toLowerCase()) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    if (studioDossierSelect) studioDossierSelect.value = item.district;
  }

  dossierQuickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const d = chip.getAttribute('data-dist');
      loadStudioDistrictDossier(d);
    });
  });

  if (studioDossierSelect) {
    studioDossierSelect.addEventListener('change', () => {
      loadStudioDistrictDossier(studioDossierSelect.value);
    });
  }

  if (btnStudioDispatchAudit) {
    btnStudioDispatchAudit.addEventListener('click', () => {
      const currentDist = studioDossierSelect ? studioDossierSelect.value : 'District';
      alert(`Official On-Site Field Audit Notice Dispatched!\nTarget District: ${currentDist} HQ\nAudit Directive: Electronic weighbridge inspection & stock ledger audit order confirmed.`);
    });
  }

  if (btnExportDossierPdf) {
    btnExportDossierPdf.addEventListener('click', () => {
      window.print();
    });
  }

  // 10. Render MSP Price Parity Table
  function renderMspTable(items) {
    if (!mspTableBody) return;
    if (!items || items.length === 0) {
      mspTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No active MSP watch records.</td></tr>`;
      return;
    }

    mspTableBody.innerHTML = items.map(m => {
      let pillClass = 'stable';
      if (m.status.includes('Below MSP') || m.status.includes('Alert')) pillClass = 'alert';
      else if (m.status.includes('Spike') || m.status.includes('Deficit')) pillClass = 'spike';

      return `
        <tr>
          <td><strong style="color:#fff;">${m.crop}</strong></td>
          <td><span style="font-family:var(--font-mono); font-weight:700; color:#cbd5e1;">${m.msp}</span></td>
          <td><span style="font-family:var(--font-mono); font-weight:800; color:#fbbf24; font-size:1rem;">${m.market}</span></td>
          <td><strong style="color:${pillClass === 'alert' ? '#f87171' : '#34d399'}; font-family:var(--font-mono);">${m.trend}</strong></td>
          <td><span class="msp-status-pill ${pillClass}">${m.status}</span></td>
          <td><span style="font-size:0.8rem; color:#94a3b8;">${m.intervention}</span></td>
        </tr>
      `;
    }).join('');
  }

  // Division Filter Tabs
  distFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      distFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDivision = pill.getAttribute('data-div');
      renderDistrictsTable();
    });
  });

  // Search input live filtering
  searchDistrictInput.addEventListener('input', renderDistrictsTable);

  // 11. Render Active Directives List
  function renderDirectives(directives) {
    if (activeDirectiveCountBadge) {
      activeDirectiveCountBadge.textContent = `${directives ? directives.length : 0} Active Directives`;
    }

    if (!directives || directives.length === 0) {
      directivesList.innerHTML = `<p style="color:var(--text-muted); padding:1rem;">No active planning directives at this moment.</p>`;
      return;
    }

    directivesList.innerHTML = directives.map(dir => `
      <div class="directive-item-card">
        <div class="dir-meta">
          <div class="dir-header-line">
            <span class="dir-code">${dir.id}</span>
            <span class="dir-priority-tag ${dir.priority}">${dir.priority} PRIORITY</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${dir.date}</span>
            <span style="font-size:0.75rem; color:#34d399; font-weight:600;">● ${dir.status}</span>
          </div>
          <h4 class="dir-title">${dir.title}</h4>
          <p class="dir-message">${dir.message}</p>
          <div class="dir-footer">
            <span>📍 Target Division: <strong style="color:#fbbf24;">${dir.targetDivision}</strong></span>
            <span> • </span>
            <span>Authority: <strong>${dir.issuedBy}</strong></span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 12. Directive Broadcast Studio Presets & Submission
  directivePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (preset === 'onion') {
        if (studioDirTitle) studioDirTitle.value = "Nashik Red Onion Buffer Transfer to Solapur & Konkan Deficit Zones";
        if (studioDirDivision) studioDirDivision.value = "Nashik & Ahmednagar Division";
        if (studioDirPriority) studioDirPriority.value = "HIGH";
        if (studioDirMessage) studioDirMessage.value = "Surplus intake exceeding local holding storage (+14.2%). Authorizing 5,000 MT freight subsidy to transport buffer stock to Solapur APMC and Konkan cold chain terminals.";
      } else if (preset === 'soybean') {
        if (studioDirTitle) studioDirTitle.value = "Statewide Soybean MSP Procurement Scheme (PSS) Active";
        if (studioDirDivision) studioDirDivision.value = "Vidarbha & Nagpur Division";
        if (studioDirPriority) studioDirPriority.value = "MEDIUM";
        if (studioDirMessage) studioDirMessage.value = "Modal prices at ₹4,480/Qtl (below MSP ₹4,892). Mandating opening of 18 Price Support Scheme (PSS) procurement centers across Latur, Nanded, and Amravati.";
      } else if (preset === 'tur') {
        if (studioDirTitle) studioDirTitle.value = "Urgent Tur / Arhar Dal Strategic Buffer Release";
        if (studioDirDivision) studioDirDivision.value = "Solapur & Marathwada Division";
        if (studioDirPriority) studioDirPriority.value = "HIGH";
        if (studioDirMessage) studioDirMessage.value = "Retail prices spiked +37.7% above benchmark. Directing immediate transfer of 5,000 MT Tur Dal from Latur reserves under Green Freight Corridor priority.";
      } else if (preset === 'audit') {
        if (studioDirTitle) studioDirTitle.value = "Statewide Cold Storage & Weighbridge Calibration Audit Notice";
        if (studioDirDivision) studioDirDivision.value = "Statewide All Divisions";
        if (studioDirPriority) studioDirPriority.value = "LOW";
        if (studioDirMessage) studioDirMessage.value = "All 248 participating private godowns must submit electronic weighbridge calibration audit certificates to their respective DAO within 7 business days.";
      }
    });
  });

  if (studioDirectiveForm) {
    studioDirectiveForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = studioDirTitle.value.trim();
      const targetDivision = studioDirDivision.value;
      const priority = studioDirPriority.value;
      const message = studioDirMessage.value.trim();

      if (!title || !message) return;

      try {
        const res = await fetch('/api/gov/advisory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, targetDivision, priority, message })
        });
        const data = await res.json();
        if (data.success) {
          alert(`Official Planning Directive Broadcasted Successfully!\nDirective ID: ${data.directive.id}\nTarget: ${targetDivision}\nPriority: ${priority}`);
          studioDirectiveForm.reset();
          loadStateSummary();
        }
      } catch (err) {
        alert('Failed to broadcast directive. Server unreachable.');
      }
    });
  }

  // 13. Strategic Buffer Re-Allocation Studio Engine & Calculations
  function updateReallocImpact() {
    if (!studioReallocQty || !studioReallocFrom || !studioReallocTo) return;
    const qty = parseFloat(studioReallocQty.value) || 2500;
    const fromDist = studioReallocFrom.value;
    const toDist = studioReallocTo.value;
    const commodity = studioReallocCommodity ? studioReallocCommodity.value : 'Produce';

    const srcObj = currentDistricts.find(d => d.district.toLowerCase() === fromDist.toLowerCase());
    const dstObj = currentDistricts.find(d => d.district.toLowerCase() === toDist.toLowerCase());

    const srcStock = srcObj ? srcObj.stockMt : 78500;
    const dstStock = dstObj ? dstObj.stockMt : 13150;

    const remaining = Math.max(0, srcStock - qty);
    const deficitGap = 4850;
    const reductionPct = Math.min(100, Math.round((qty / deficitGap) * 100));
    const trucks = Math.ceil(qty / 20);

    if (sliderQtyDisplay) sliderQtyDisplay.textContent = `${qty.toLocaleString()} MT`;
    if (corridorSourceDistrict) corridorSourceDistrict.textContent = fromDist;
    if (corridorSourceStock) corridorSourceStock.innerHTML = `${srcStock.toLocaleString()} <small>MT</small>`;
    if (corridorTargetDistrict) corridorTargetDistrict.textContent = toDist;
    if (corridorTargetStock) corridorTargetStock.innerHTML = `${dstStock.toLocaleString()} <small>MT</small>`;
    if (corridorLorryCommodity) corridorLorryCommodity.textContent = `${qty.toLocaleString()} MT Buffer`;
    if (calcRemainingSurplus) calcRemainingSurplus.textContent = `${remaining.toLocaleString()} MT`;
    if (calcDeficitReduction) calcDeficitReduction.textContent = `+${reductionPct}%`;
    if (calcTrucksRequired) calcTrucksRequired.textContent = `${trucks} Heavy Trucks`;
  }

  if (studioReallocSlider && studioReallocQty) {
    studioReallocSlider.addEventListener('input', () => {
      studioReallocQty.value = studioReallocSlider.value;
      updateReallocImpact();
    });
    studioReallocQty.addEventListener('input', () => {
      studioReallocSlider.value = studioReallocQty.value;
      updateReallocImpact();
    });
  }

  if (studioReallocFrom) studioReallocFrom.addEventListener('change', updateReallocImpact);
  if (studioReallocTo) studioReallocTo.addEventListener('change', updateReallocImpact);
  if (studioReallocCommodity) studioReallocCommodity.addEventListener('change', updateReallocImpact);

  reallocPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-qty');
      if (studioReallocQty) studioReallocQty.value = q;
      if (studioReallocSlider) studioReallocSlider.value = q;
      updateReallocImpact();
    });
  });

  if (studioReallocForm) {
    studioReallocForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fromDistrict = studioReallocFrom.value;
      const toDistrict = studioReallocTo.value;
      const commodity = studioReallocCommodity.value;
      const quantityMt = studioReallocQty.value;

      try {
        const res = await fetch('/api/gov/reallocate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromDistrict, toDistrict, commodity, quantityMt })
        });
        const data = await res.json();
        if (data.success) {
          alert(`Buffer Stock Transfer Authorized & Dispatched!\n${data.message}`);
          if (reallocTransitsTableBody) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><span style="font-family:var(--font-mono); color:#fbbf24; font-weight:700;">#DISP-MH-${Date.now().toString().slice(-4)}</span></td>
              <td><strong>${fromDistrict} Cluster</strong></td>
              <td><strong>${toDistrict} Hub</strong></td>
              <td>${commodity}</td>
              <td><strong style="font-family:var(--font-mono); color:#34d399;">${parseFloat(quantityMt).toLocaleString()} MT</strong></td>
              <td>Green Freight Corridor</td>
              <td><span class="msp-status-pill stable">🚚 Dispatched Just Now</span></td>
            `;
            reallocTransitsTableBody.prepend(tr);
          }
          loadStateSummary();
        } else {
          alert(data.message || 'Buffer transfer failed.');
        }
      } catch (err) {
        alert('Failed to dispatch buffer stock order.');
      }
    });
  }

  // 14. Export Districts to CSV
  function exportDistrictsCsv() {
    if (currentDistricts.length === 0) return;

    const headers = ['District', 'Division', 'Active Godowns', 'Stock MT', 'Lead Crop', '7-Day Trend', 'Freshness %', 'Forecast Risk', 'DAO Officer', 'Cold Vaults', 'Dry Godowns', 'Contact'];
    const rows = currentDistricts.map(d => [
      `"${d.district}"`,
      `"${d.division}"`,
      d.activeGodowns,
      d.stockMt,
      `"${d.leadCrop.replace(/"/g, '""')}"`,
      `"${d.trend}"`,
      d.freshnessPct,
      `"${d.forecastRisk}"`,
      `"${d.daoOfficer || ''}"`,
      d.coldVaults || 0,
      d.dryGodowns || 0,
      `"${d.contact || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Maha_Inventory_36_Districts_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', exportDistrictsCsv);
  }

  // 15. Print State Dossier
  if (btnPrintStateReport) {
    btnPrintStateReport.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial load
  loadStateSummary();
});
