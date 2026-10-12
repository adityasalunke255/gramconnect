// ==========================================================================
// MAHA INVENTORY - ADVANCED PORTAL LOGIC & ANIMATED ARCHITECTURE
// Government of Maharashtra & Private Godowns Network
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM References - Header & Navigation
  const clockDisplay = document.getElementById('clockDisplay');
  const ambientOrb1 = document.getElementById('ambientOrb1');

  // Metrics
  const statGodowns = document.getElementById('statGodowns');
  const statStock = document.getElementById('statStock');
  const statFreshness = document.getElementById('statFreshness');
  const statDistricts = document.getElementById('statDistricts');

  // Auth Card
  const tabWarehouse = document.getElementById('tabWarehouse');
  const tabGovernment = document.getElementById('tabGovernment');
  const authCard = document.getElementById('authCard');
  const authRoleInput = document.getElementById('authRole');
  const portalTag = document.getElementById('portalTag');
  const portalTagText = document.getElementById('portalTagText');
  const portalTitle = document.getElementById('portalTitle');
  const portalDesc = document.getElementById('portalDesc');
  const lblIdentifier = document.getElementById('lblIdentifier');
  const authIdentifier = document.getElementById('authIdentifier');
  const authPassword = document.getElementById('authPassword');
  const pwdHint = document.getElementById('pwdHint');
  const authPin = document.getElementById('authPin');
  const groupGovPin = document.getElementById('groupGovPin');
  const btnSubmitLogin = document.getElementById('btnSubmitLogin');
  const btnSubmitIcon = document.getElementById('btnSubmitIcon');
  const btnSubmitLabel = document.getElementById('btnSubmitLabel');
  const btnQuickFill = document.getElementById('btnQuickFill');
  const quickfillPrompt = document.getElementById('quickfillPrompt');
  const quickfillBtnText = document.getElementById('quickfillBtnText');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const loginForm = document.getElementById('loginForm');
  const authAlert = document.getElementById('authAlert');
  const alertIcon = document.getElementById('alertIcon');
  const alertText = document.getElementById('alertText');

  // 6-Stage Flow Pipeline
  const flowStages = document.querySelectorAll('.flow-stage');
  const activeFlowStatus = document.getElementById('activeFlowStatus');
  const btnSimulateFlow = document.getElementById('btnSimulateFlow');
  const pipelineLaser = document.getElementById('pipelineLaser');

  // Post-Login Workspace
  const workspaceOverlay = document.getElementById('workspaceOverlay');
  const btnLogout = document.getElementById('btnLogout');
  const wsAvatar = document.getElementById('wsAvatar');
  const wsUserName = document.getElementById('wsUserName');
  const wsUserRole = document.getElementById('wsUserRole');
  const wsDynamicContent = document.getElementById('wsDynamicContent');

  let currentRole = 'wharehousebuyer';
  let activeStageIndex = 0;
  let autoCycleTimer = null;

  // 1. Live System IST Clock
  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockDisplay.textContent = `${now.toLocaleTimeString('en-IN', options)} IST`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 2. Fetch Statewide Stats
  async function fetchStats() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.stats) {
        statGodowns.innerHTML = `${data.stats.activeGodowns} <span class="metric-unit">Verified</span>`;
        statStock.innerHTML = `${data.stats.currentStockMt.toLocaleString()} <span class="metric-unit">MT</span>`;
        statFreshness.innerHTML = `${data.stats.freshnessPct}<span class="metric-unit">%</span>`;
        statDistricts.innerHTML = `${data.stats.activeDistricts} <span class="metric-unit">Districts</span>`;
      }
    } catch (e) {
      console.log('Using default cached indicators');
    }
  }
  fetchStats();

  // 3. Dual Role Portal Switcher
  function setPortalRole(role) {
    currentRole = role;
    authRoleInput.value = role;

    if (role === 'wharehousebuyer') {
      tabWarehouse.classList.add('active', 'wh-tab');
      tabWarehouse.setAttribute('aria-selected', 'true');
      tabGovernment.classList.remove('active', 'gov-tab');
      tabGovernment.setAttribute('aria-selected', 'false');

      authCard.className = 'auth-card role-wh';
      portalTag.className = 'portal-tag tag-wh';
      portalTagText.textContent = 'Wholesale Vendor & Godown Operator Terminal';
      portalTitle.textContent = 'Godown Operator Access';
      portalDesc.textContent = 'Log incoming farmer purchases, dispatch orders to APMC/buyers, manage inter-godown transfers, and audit storage spoilage.';
      lblIdentifier.textContent = 'Registered Business Email or Godown Code';
      authIdentifier.placeholder = 'e.g. buyer@sahyadriagro.in or WH-MH-NSK-101';
      pwdHint.textContent = 'Demo: password123';
      pwdHint.style.color = '#34d399';
      groupGovPin.style.display = 'none';

      btnSubmitLogin.className = 'btn-submit btn-wh';
      btnSubmitIcon.textContent = '🚀';
      btnSubmitLabel.textContent = 'Access Godown Management Ledger';

      quickfillPrompt.textContent = 'Instant test credentials:';
      quickfillBtnText.textContent = 'Auto-Fill Nashik Godown #101';

      if (ambientOrb1) ambientOrb1.style.background = 'radial-gradient(circle, #059669 0%, transparent 70%)';
    } else {
      tabGovernment.classList.add('active', 'gov-tab');
      tabGovernment.setAttribute('aria-selected', 'true');
      tabWarehouse.classList.remove('active', 'wh-tab');
      tabWarehouse.setAttribute('aria-selected', 'false');

      authCard.className = 'auth-card role-gov';
      portalTag.className = 'portal-tag tag-gov';
      portalTagText.textContent = 'Dept of Agriculture • Government of Maharashtra';
      portalTitle.textContent = 'State Agricultural Intelligence Portal';
      portalDesc.textContent = 'Evaluate district-wise inventory balances, stock freshness index, and predictive shortage/surplus models for statewide coordination.';
      lblIdentifier.textContent = 'Authorized Government Official ID or Email';
      authIdentifier.placeholder = 'e.g. agri.director@maharashtra.gov.in or GOV-MH-001';
      pwdHint.textContent = 'Demo: admin';
      pwdHint.style.color = '#fbbf24';
      groupGovPin.style.display = 'block';

      btnSubmitLogin.className = 'btn-submit btn-gov';
      btnSubmitIcon.textContent = '🏛️';
      btnSubmitLabel.textContent = 'Verify Credentials & Access Intelligence';

      quickfillPrompt.textContent = 'Instant test credentials:';
      quickfillBtnText.textContent = 'Auto-Fill State Director Account';

      if (ambientOrb1) ambientOrb1.style.background = 'radial-gradient(circle, #d97706 0%, transparent 70%)';
    }

    hideAlert();
  }

  tabWarehouse.addEventListener('click', () => setPortalRole('wharehousebuyer'));
  tabGovernment.addEventListener('click', () => setPortalRole('government'));

  // 4. Quick-Fill Demo Credentials
  btnQuickFill.addEventListener('click', () => {
    if (currentRole === 'wharehousebuyer') {
      authIdentifier.value = 'buyer@sahyadriagro.in';
      authPassword.value = 'password123';
      showAlert('Pre-filled: Sahyadri Agro Godown #101 (Nashik)', 'success');
    } else {
      authIdentifier.value = 'agri.director@maharashtra.gov.in';
      authPassword.value = 'admin';
      authPin.value = '7890';
      showAlert('Pre-filled: State Director of Agri Marketing (Maharashtra Govt)', 'success');
    }
  });

  // 5. Password Visibility Toggle
  btnTogglePassword.addEventListener('click', () => {
    const isPassword = authPassword.type === 'password';
    authPassword.type = isPassword ? 'text' : 'password';
    btnTogglePassword.textContent = isPassword ? '🙈' : '👁️';
  });

  // 6. Alert Toast
  function showAlert(message, type = 'error') {
    authAlert.className = `auth-alert ${type}`;
    alertIcon.textContent = type === 'error' ? '⚠️' : '✅';
    alertText.textContent = message;
    authAlert.style.display = 'flex';
  }

  function hideAlert() {
    authAlert.style.display = 'none';
  }

  // 7. Login Submission Handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const identifier = authIdentifier.value.trim();
    const password = authPassword.value;
    const pin = authPin ? authPin.value.trim() : '';

    if (!identifier || !password) {
      showAlert('Please enter your identifier and password.');
      return;
    }

    btnSubmitLogin.disabled = true;
    const originalLabel = btnSubmitLabel.textContent;
    btnSubmitLabel.textContent = 'Synchronizing with Secure Ledger...';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentRole,
          identifier,
          password,
          securityPin: pin
        })
      });

      const result = await response.json();

      if (result.success) {
        if (result.role === 'government' || currentRole === 'government') {
          localStorage.setItem('maha_gov_user', JSON.stringify(result.user || {}));
          window.location.href = 'government.html';
          return;
        } else {
          localStorage.setItem('maha_warehouse_user', JSON.stringify(result.user || {}));
          window.location.href = 'warehouse.html';
          return;
        }
      } else {
        showAlert(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      showAlert('Network error: Ensure the Node.js server is actively running.');
    } finally {
      btnSubmitLogin.disabled = false;
      btnSubmitLabel.textContent = originalLabel;
    }
  });

  // 8. ANIMATED 6-STAGE AGRICULTURAL ARCHITECTURE FLOW MODEL
  const stageDescriptions = [
    'Stage 1: Wholesale Vendors & 248 Godowns Registered Across Maharashtra',
    'Stage 2: Direct Farmer Purchases Inward (+4,210 MT Logged Today)',
    'Stage 3: Standard Weight Standardization (100% Normalized in KG)',
    'Stage 4: State Intelligence & Regional Shortage/Surplus Forecasting',
    'Stage 5: Priority Planning Transmitted to Gram Panchayats & FPOs',
    'Stage 6: Continuous Feedback & Machine Learning Accuracy Calibration'
  ];

  function highlightStage(index) {
    flowStages.forEach((stage, i) => {
      if (i === index) {
        stage.classList.add('active');
        stage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        stage.classList.remove('active');
      }
    });

    if (activeFlowStatus && stageDescriptions[index]) {
      activeFlowStatus.textContent = stageDescriptions[index];
    }
  }

  function startAutoCycle() {
    stopAutoCycle();
    autoCycleTimer = setInterval(() => {
      activeStageIndex = (activeStageIndex + 1) % flowStages.length;
      highlightStage(activeStageIndex);
    }, 4000);
  }

  function stopAutoCycle() {
    if (autoCycleTimer) {
      clearInterval(autoCycleTimer);
      autoCycleTimer = null;
    }
  }

  // Click on any stage to focus it
  flowStages.forEach((stage, i) => {
    stage.addEventListener('click', () => {
      activeStageIndex = i;
      highlightStage(i);
      stopAutoCycle();
      // Resume auto cycle after 10 seconds of user interaction
      setTimeout(startAutoCycle, 10000);
    });
  });

  // "Simulate Flow" Rapid Particle Burst
  btnSimulateFlow.addEventListener('click', () => {
    stopAutoCycle();
    let currentStep = 0;
    btnSimulateFlow.style.opacity = '0.5';

    const rapidInterval = setInterval(() => {
      highlightStage(currentStep);
      currentStep++;
      if (currentStep >= flowStages.length) {
        clearInterval(rapidInterval);
        btnSimulateFlow.style.opacity = '1';
        setTimeout(startAutoCycle, 3000);
      }
    }, 600);
  });

  startAutoCycle();

  // 9. Post-Login Router
  function openWorkspace(role, user) {
    if (role === 'government' || currentRole === 'government') {
      localStorage.setItem('maha_gov_user', JSON.stringify(user || {}));
      window.location.href = 'government.html';
    } else {
      localStorage.setItem('maha_warehouse_user', JSON.stringify(user || {}));
      window.location.href = 'warehouse.html';
    }
  }
});
