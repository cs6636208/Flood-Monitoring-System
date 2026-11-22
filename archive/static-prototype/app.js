(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const icons = {
    alert: '<svg class="icon"><use href="#i-alert"/></svg>',
    pin: '<svg class="icon"><use href="#i-pin"/></svg>',
    water: '<svg class="icon"><use href="#i-water"/></svg>',
    box: '<svg class="icon"><use href="#i-box"/></svg>',
    phone: '<svg class="icon"><use href="#i-phone"/></svg>'
  };
  const caseStatusOptions = ['รับเรื่องแล้ว', 'รอตรวจสอบ', 'กำลังตรวจสอบ', 'จ่ายงาน', 'กำลังเดินทาง', 'ถึงจุดเกิดเหตุ', 'ช่วยเหลือแล้ว'];
  const cases = [
    { id: 'FM-DEMO-2401', kind: 'help', title: 'ขออพยพผู้สูงอายุ', location: 'จุดตัวอย่าง C', urgency: 'เร่งด่วน', time: '14:12 น.', status: 'รับเรื่องแล้ว', detail: 'มีผู้สูงอายุ 1 คน ต้องการความช่วยเหลือในการเดินทาง' },
    { id: 'FM-DEMO-2402', kind: 'report', title: 'มีน้ำขังบนถนนชุมชน', location: 'จุดตัวอย่าง A', urgency: 'ปกติ', time: '14:08 น.', status: 'รอตรวจสอบ', detail: 'รายงานชุมชนตัวอย่าง · ยังไม่ยืนยัน' },
    { id: 'FM-DEMO-2403', kind: 'report', title: 'น้ำเริ่มเอ่อใกล้ทางแยก', location: 'จุดตัวอย่าง B', urgency: 'เฝ้าระวัง', time: '13:52 น.', status: 'รอตรวจสอบ', detail: 'รายงานชุมชนตัวอย่าง · ยังไม่ยืนยัน' },
    { id: 'FM-DEMO-2404', kind: 'supply', title: 'ขอถุงยังชีพ 1 ชุด', location: 'จุดตัวอย่าง E', urgency: 'ปกติ', time: '13:40 น.', status: 'รับเรื่องแล้ว', detail: 'รองรับผู้รับ 1 คน · คำขอตัวอย่าง' }
  ];
  let nextId = 2405;
  let selectedVehicle = 'car';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function showToast(message, detail = '') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${escapeHtml(message)}${detail ? `<small>${escapeHtml(detail)}</small>` : ''}`;
    $('#toast-region').append(toast);
    window.setTimeout(() => toast.remove(), 4200);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal && typeof modal.showModal === 'function') modal.showModal();
  }

  function closeModal(element) {
    const modal = element.closest('dialog');
    if (modal?.open) modal.close();
  }

  $$('[data-open-modal]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.openModal)));
  $$('[data-close-modal]').forEach((button) => button.addEventListener('click', () => closeModal(button)));
  $$('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  }));

  function createCase({ kind, title, location, urgency = 'ปกติ', detail = '', status = 'รับเรื่องแล้ว' }) {
    const item = {
      id: `FM-DEMO-${nextId++}`,
      kind,
      title,
      location,
      urgency,
      time: new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' น.',
      status,
      detail
    };
    cases.unshift(item);
    renderCases();
    renderReports();
    return item;
  }

  function updateMetrics() {
    const open = cases.filter((item) => item.kind !== 'supply' && item.status !== 'ช่วยเหลือแล้ว').length;
    const urgent = cases.filter((item) => item.kind === 'help' && item.urgency === 'เร่งด่วน' && item.status !== 'ช่วยเหลือแล้ว').length;
    const supplies = cases.filter((item) => item.kind === 'supply' && item.status !== 'ช่วยเหลือแล้ว').length;
    const pending = cases.filter((item) => item.kind === 'report' && !['ถึงจุดเกิดเหตุ', 'ช่วยเหลือแล้ว'].includes(item.status)).length;
    $('#open-cases').textContent = open;
    $('.team-metrics article:nth-child(2) b').textContent = urgent;
    $('#supply-cases').textContent = supplies;
    $('#pending-count').textContent = pending;
    $('#report-count').innerHTML = `${pending} <span>รายการ</span>`;
  }

  function caseIcon(item) {
    if (item.kind === 'supply') return icons.box;
    if (item.kind === 'report') return item.title.toLowerCase().includes('น้ำ') ? icons.water : icons.alert;
    return icons.phone;
  }

  function renderCases() {
    const filter = $('#case-filter')?.value ?? 'all';
    const shown = cases.filter((item) => filter === 'all' || item.kind === filter);
    const list = $('#incident-list');
    if (!list) return;
    list.innerHTML = shown.map((item) => {
      const priorityClass = item.urgency === 'เร่งด่วน' ? '' : item.urgency === 'เฝ้าระวัง' ? ' priority-amber' : ' priority-green';
      const statusClass = item.status === 'ช่วยเหลือแล้ว' ? ' case-done' : item.status === 'กำลังเดินทาง' ? ' case-enroute' : item.urgency === 'เร่งด่วน' ? ' case-red' : '';
      const kindLabel = item.kind === 'help' ? 'ขอความช่วยเหลือ' : item.kind === 'report' ? 'รายงานเหตุ' : 'ถุงยังชีพ';
      const options = caseStatusOptions.map((status) => `<option value="${escapeHtml(status)}" ${item.status === status ? 'selected' : ''}>${escapeHtml(status)}</option>`).join('');
      return `<article class="incident-item" data-case-id="${escapeHtml(item.id)}">
        <span class="incident-priority${priorityClass}">${caseIcon(item)}</span>
        <div class="incident-copy"><div class="incident-title">${escapeHtml(item.title)}</div><div class="incident-meta"><span>${escapeHtml(kindLabel)}</span><span>·</span><span>${escapeHtml(item.location)}</span><span>·</span><span>${escapeHtml(item.time)}</span><span>·</span><span>${escapeHtml(item.id)}</span></div><p class="incident-description">${escapeHtml(item.detail || 'ยังไม่มีรายละเอียดเพิ่มเติม')}</p></div>
        <div class="incident-actions"><span class="case-status${statusClass}">${escapeHtml(item.status)}</span><select aria-label="อัปเดตสถานะ ${escapeHtml(item.id)}" data-status-id="${escapeHtml(item.id)}">${options}</select></div>
      </article>`;
    }).join('') || '<div class="empty-cases">ไม่มีเคสในหมวดนี้</div>';
    updateMetrics();
  }

  function renderReports() {
    const reports = cases.filter((item) => item.kind === 'report');
    const list = $('#report-list');
    list.innerHTML = reports.slice(0, 4).map((item) => {
      const confirmed = item.status === 'ช่วยเหลือแล้ว' || item.status === 'ถึงจุดเกิดเหตุ';
      return `<article class="report-card"><span class="report-status ${confirmed ? 'status-confirmed' : 'status-review'}">${confirmed ? 'ตรวจสอบแล้ว' : 'รอตรวจสอบ'}</span><div class="report-main"><b>${escapeHtml(item.title)}</b><span>${icons.pin} ${escapeHtml(item.location)} · รายงานเมื่อ ${escapeHtml(item.time)}</span></div><span class="report-type">${escapeHtml(item.urgency === 'เร่งด่วน' ? 'เร่งด่วน' : 'รายงานชุมชน')}</span></article>`;
    }).join('') || '<div class="empty-cases">ยังไม่มีรายงานในตัวอย่างนี้</div>';
    updateMetrics();
  }

  $('#case-filter').addEventListener('change', renderCases);
  $('#incident-list').addEventListener('change', (event) => {
    const id = event.target.dataset.statusId;
    if (!id) return;
    const item = cases.find((entry) => entry.id === id);
    if (!item) return;
    item.status = event.target.value;
    renderCases();
    renderReports();
    showToast('อัปเดตสถานะเคสแล้ว', `${item.id} · ${item.status} (สาธิต)`);
  });

  $$('.vehicle-option').forEach((button) => button.addEventListener('click', () => {
    selectedVehicle = button.dataset.vehicle;
    $$('.vehicle-option').forEach((option) => option.classList.toggle('selected', option === button));
  }));

  const routeGuidance = {
    car: { vehicle: 'รถเก๋ง', status: 'เส้นทางตัวอย่าง · ควรตรวจสอบซ้ำ', details: ['ประมาณ 4.8 กม.', '18 นาที*'], warning: 'หลีกเลี่ยงถนนชุมชนริมน้ำ เส้นทางนี้เป็นการจำลอง ไม่มีข้อมูลถนนจริง', red: false, steps: 'ถนนสายหลัก → ทางยกระดับ → ปลายทาง' },
    motorcycle: { vehicle: 'มอเตอร์ไซค์', status: 'มีจุดเสี่ยง · ควรระวัง', details: ['ประมาณ 5.1 กม.', '17 นาที*'], warning: 'หลีกเลี่ยงบริเวณน้ำขังและกระแสน้ำ รถจักรยานยนต์เสียการทรงตัวได้ง่าย', red: true, steps: 'เส้นทางเหนือ → จุดกลับรถ → ปลายทาง' },
    pickup: { vehicle: 'รถกระบะยกสูง', status: 'ข้อมูลไม่พอสำหรับยืนยัน', details: ['ประมาณ 4.8 กม.', '18 นาที*'], warning: 'รถยกสูงไม่ได้แปลว่าผ่านน้ำท่วมหรือกระแสน้ำได้อย่างปลอดภัย อย่าฝ่าจุดน้ำท่วม', red: true, steps: 'มีทางเลือกบนถนนหลัก · ตรวจสอบหน้างาน' },
    bus: { vehicle: 'รถเมล์', status: 'เส้นทางตัวอย่าง · จำกัดการเข้าถึง', details: ['ประมาณ 6.2 กม.', '25 นาที*'], warning: 'ต้องยืนยันถนนที่รถใหญ่ผ่านได้และสถานะปลายทางก่อนเดินทาง', red: true, steps: 'ถนนสายหลัก → จุดจอดที่กำหนด → ปลายทาง' },
    boat: { vehicle: 'เรือ', status: 'ไม่มีข้อมูลเส้นทางเรือ', details: ['ยังคำนวณไม่ได้', '—'], warning: 'ไม่มีข้อมูลกระแสน้ำและสิ่งกีดขวางที่ตรวจสอบได้ ห้ามใช้ถนนเป็นเส้นทางเรือ', red: true, steps: 'ติดต่อทีมปฏิบัติการในพื้นที่ก่อนออกเรือ' }
  };

  $('#route-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const destination = $('#route-to').value.trim();
    if (!destination) return;
    const route = routeGuidance[selectedVehicle];
    $('#route-result').innerHTML = `<div class="route-result-card"><div class="route-result-top"><b>${escapeHtml(route.vehicle)} · ไป ${escapeHtml(destination)}</b><span class="route-badge">${escapeHtml(route.status)}</span></div><div class="route-details"><span>${escapeHtml(route.details[0])}</span><span>${escapeHtml(route.details[1])}</span></div><div class="route-warning${route.red ? ' warn-red' : ''}">${escapeHtml(route.warning)}</div><div class="route-steps">${escapeHtml(route.steps)}</div></div>`;
    showToast('แสดงการประเมินเส้นทางจำลอง', 'ไม่ใช่ข้อมูลนำทางหรือสภาพถนนจริง');
  });

  function openTeam() {
    document.body.classList.add('team-mode');
    $('#team-view').hidden = false;
    $('#team-footer').hidden = false;
    $('#team-view').scrollIntoView({ behavior: 'smooth', block: 'start' });
    renderCases();
  }
  function openPublic() {
    document.body.classList.remove('team-mode');
    $('#team-view').hidden = true;
    $('#team-footer').hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $('#team-toggle').addEventListener('click', openTeam);
  $('#back-to-public').addEventListener('click', openPublic);
  $('#view-public-map').addEventListener('click', openPublic);

  $('#help-type').addEventListener('change', () => {
    $('#animal-note').hidden = $('#help-type').value !== 'สัตว์อันตราย';
  });
  $('#use-location').addEventListener('click', () => showToast('ต้นแบบนี้ไม่ได้เปิดใช้ GPS', 'โปรดแก้ไขตำแหน่งตัวอย่างด้วยตนเอง'));

  $('#help-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const type = $('#help-type').value;
    const people = Number($('#help-people').value) || 1;
    const shared = $('#share-location').checked;
    const item = createCase({
      kind: 'help',
      title: `ขอความช่วยเหลือ: ${type}`,
      location: $('#help-location').value.trim(),
      urgency: 'เร่งด่วน',
      status: 'รับเรื่องแล้ว',
      detail: `${people} คน${$('#help-contact').value.trim() ? ' · มีเบอร์ติดต่อ' : ''}${$('#help-detail').value.trim() ? ` · ${$('#help-detail').value.trim()}` : ''}${shared ? ' · ยินยอมแชร์ตำแหน่ง (จำลอง)' : ''}`
    });
    $('#help-modal').close();
    event.target.reset();
    $('#help-people').value = '1';
    $('#help-location').value = 'ตำแหน่งตัวอย่าง · ปักหมุดบนแผนที่';
    $('#animal-note').hidden = true;
    showToast('สร้างเคสตัวอย่างแล้ว', `${item.id} · ยังไม่มีทีมช่วยเหลือได้รับแจ้ง`);
  });

  $('#report-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const type = $('#report-type').value;
    const detail = $('#report-detail').value.trim();
    const urgency = type.includes('ไฟรั่ว') || type.includes('สายไฟ') ? 'เร่งด่วน' : 'ปกติ';
    const item = createCase({ kind: 'report', title: detail || type, location: $('#report-location').value.trim(), urgency, status: 'รอตรวจสอบ', detail: `${type} · ${detail || 'รอข้อมูลเพิ่มเติม'} · ยังไม่ยืนยัน` });
    $('#report-modal').close();
    event.target.reset();
    $('#report-location').value = 'จุดตัวอย่าง C';
    showToast('เพิ่มรายงานตัวอย่างแล้ว', `${item.id} · อยู่ระหว่างรอตรวจสอบ`);
  });

  $('#supply-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const count = Number($('#supply-count').value) || 1;
    const people = Number($('#supply-people').value) || 1;
    const item = createCase({ kind: 'supply', title: `ขอถุงยังชีพ ${count} ชุด`, location: $('#supply-location').value.trim(), urgency: 'ปกติ', status: 'รับเรื่องแล้ว', detail: `ผู้รับ ${people} คน${$('#supply-needs').value.trim() ? ` · ต้องการ ${$('#supply-needs').value.trim()}` : ''} · คำขอตัวอย่าง` });
    $('#supply-modal').close();
    event.target.reset();
    $('#supply-count').value = '1';
    $('#supply-people').value = '1';
    $('#supply-location').value = 'ตำแหน่งตัวอย่าง · ปักหมุดบนแผนที่';
    showToast('เพิ่มคำขอถุงยังชีพตัวอย่างแล้ว', `${item.id} · ยังไม่มีทีมจัดส่งได้รับแจ้ง`);
  });

  $$('.map-marker').forEach((marker) => marker.addEventListener('click', () => showToast(marker.dataset.point, 'ตำแหน่งและสถานะในแผนที่เป็นข้อมูลจำลอง')));
  $$('[data-toast]').forEach((button) => button.addEventListener('click', () => showToast(button.dataset.toast, 'สถานะตัวอย่างอัปเดตแล้ว')));
  $('#all-places').addEventListener('click', () => showToast('จุดปลอดภัยในพื้นที่สาธิต', 'มีข้อมูลตัวอย่าง 3 แห่ง · โปรดยืนยันสถานะก่อนเดินทาง'));
  $('#area-select').addEventListener('click', () => showToast('พื้นที่แผนที่สาธิต', 'ข้อมูลไม่ได้เชื่อมกับตำแหน่งจริง'));
  $('#map-refresh').addEventListener('click', () => {
    const now = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    $('.freshness').innerHTML = `<i class="fresh-dot"></i> ข้อมูลสาธิต · แสดงตัวอย่าง ${now} น.`;
    showToast('รีเฟรชหน้าจอตัวอย่างแล้ว', 'ไม่มีการดึงข้อมูลสถานการณ์จริง');
  });
  $('#map-expand').addEventListener('click', () => {
    const map = $('#map-view');
    map.classList.toggle('map-fullscreen');
    document.body.classList.toggle('map-open', map.classList.contains('map-fullscreen'));
    $('#map-expand').textContent = map.classList.contains('map-fullscreen') ? '×' : '⤢';
  });
  $('#map-close').addEventListener('click', () => {
    $('#map-view').classList.remove('map-fullscreen');
    document.body.classList.remove('map-open');
    $('#map-expand').textContent = '⤢';
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && $('#map-view').classList.contains('map-fullscreen')) {
      $('#map-view').classList.remove('map-fullscreen');
      document.body.classList.remove('map-open');
      $('#map-expand').textContent = '⤢';
    }
  });

  const guideContent = {
    'ก่อนออกเดินทาง': ['ตรวจสอบเส้นทางและสถานะปลายทางก่อนออกจากบ้าน', 'แจ้งคนใกล้ชิดถึงแผนการเดินทางและจุดหมาย', 'เตรียมยา น้ำดื่ม เอกสารสำคัญ โทรศัพท์ และแบตเตอรี่สำรอง', 'หากข้อมูลเส้นทางไม่ชัดเจน ให้เลื่อนการเดินทางหรือขอคำแนะนำจากทีมในพื้นที่'],
    'เมื่อเจอน้ำท่วม': ['อย่าเดินหรือขับรถฝ่ากระแสน้ำและจุดที่มองไม่เห็นพื้นถนน', 'หากระดับน้ำเพิ่มเร็ว ให้ถอยไปยังพื้นที่สูงและปลอดภัย', 'หลีกเลี่ยงการสัมผัสน้ำใกล้สายไฟ ปลั๊ก หรืออุปกรณ์ไฟฟ้า', 'โทรขอความช่วยเหลือเมื่อมีผู้ติดค้างหรือเสี่ยงอันตราย'],
    'ไฟฟ้าและสัตว์อันตราย': ['อยู่ห่างจากสายไฟที่ตกและบริเวณที่สงสัยว่าไฟรั่ว ห้ามแตะต้อง', 'ห้ามเข้าใกล้หรือพยายามจับสัตว์อันตราย', 'แจ้งตำแหน่งจากระยะปลอดภัย พร้อมภาพถ่ายเมื่อทำได้โดยไม่เสี่ยง', 'เตือนคนรอบข้างให้ออกห่างและรอเจ้าหน้าที่หรือทีมผู้เชี่ยวชาญ']
  };
  $$('[data-guide]').forEach((button) => button.addEventListener('click', () => {
    const title = button.dataset.guide;
    $('#guide-modal-title').textContent = title;
    $('#guide-modal-content').innerHTML = `<ul>${guideContent[title].map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
    openModal('guide-modal');
  }));

  $('#mobile-menu').addEventListener('click', () => $('.main-nav').classList.toggle('nav-open'));
  $$('.main-nav a').forEach((link) => link.addEventListener('click', () => $('.main-nav').classList.remove('nav-open')));

  renderCases();
  renderReports();
})();
