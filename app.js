/* ═══════════════════════════════════════════════════════════════
   TABIB — application logic with a real database
   Storage backends (picked automatically at start):
     1. Supabase  — when TABIB_CONFIG.SUPABASE_URL is filled in (index.html)
     2. Claude shared database — when the page runs as a claude.ai artifact
     3. Browser storage — fallback, data stays on this device only
═══════════════════════════════════════════════════════════════ */

/* ── TRANSLATIONS (from the original design) ── */
const T = {
  en: {
    role_patient: 'Patient', role_doctor: 'Doctor', role_pharm: 'Pharmacist', role_admin: 'Administrator',
    national_id: 'National ID Number', medical_license: 'Medical License ID', pharmacy_license: 'Pharmacy License Number',
    ph_patient: 'Enter your 14-digit national ID', ph_doctor: 'e.g. MED-2019-00342', ph_pharm: 'e.g. PH-2021-00891',
    verify_patient: 'Verified against NIDA database', verify_doctor: 'Live check — Medical Syndicate API', verify_pharm: 'Live check — Pharmacists Syndicate API',
    password: 'Password', sign_in: 'Sign in', live_verified: 'Live verified', sign_out: 'Sign out',
    nav_history: 'Medical history', nav_my_rx: 'My prescriptions', nav_profile: 'My profile', nav_book: 'Book Examination', nav_pharmacies: 'Pharmacies',
    nav_search: 'Patient search', nav_new_report: 'New report', nav_new_rx: 'New prescription', nav_my_patients: 'My patients', nav_appts: 'Appointments',
    nav_rx: 'Prescriptions', nav_scan: 'Scan & dispense',
    ph_title: 'Medical history', ph_desc: 'Your complete medical record — read only',
    readonly_msg: 'This record is read-only. All changes must be made by your doctor.', report_error: 'Report an error',
    pat_info: 'Patient information', nida_verified: 'NIDA verified', full_name: 'Full name', nat_id: 'National ID',
    dob: 'Date of birth', blood: 'Blood type', visits: 'Visits', diag: 'Diagnosis', bp: 'BP reading', follow: 'Follow-up',
    my_rx_title: 'My prescriptions', my_rx_desc: 'Active, dispensed, and expired prescriptions',
    rx_active: 'Active', rx_dispensed: 'Dispensed', rx_expired: 'Expired',
    issued_by: 'Issued by', issued_on: 'Issued on', expires: 'Expires', qr_required: 'QR required', one_time: 'Yes — one-time use',
    dispensed_at: 'Dispensed at', expired_on: 'Expired on',
    profile_title: 'My profile', profile_desc: 'Personal information linked to your national ID',
    profile_msg: 'Medical entries can only be added by a verified doctor. You can update your contact details below.',
    gov: 'Governorate', phone: 'Phone',
    search_title: 'Patient search', search_desc: "Search by national ID to access a patient's full history",
    search_alert: 'You have access to all historical records from every treating physician to support complete clinical decisions.',
    search_placeholder: 'Enter patient national ID (14 digits)...', search_btn: 'Search', age: 'Age', known_allergies: 'Known allergies',
    full_hist: 'Full history across all doctors', issue_rx: 'Issue prescription', new_report_btn: 'New report',
    new_rx_title: 'New prescription', new_rx_desc: 'Issue a verified prescription with auto-generated QR code',
    pat_id: 'Patient national ID', expiry_date: 'Expiry date',
    allergy_notes: 'Allergy / clinical notes (visible to all treating physicians)', issue_qr: 'Issue & generate QR',
    report_title: 'New medical report', report_desc: 'This report will be visible to all future treating physicians',
    specialty_label: 'Specialty / department', diagnosis_label: 'Diagnosis',
    clinical_notes: 'Clinical notes & allergy warnings (shared with all physicians)', save_report: 'Save report',
    my_patients_title: 'My patients', my_patients_desc: 'Patients you have treated recently',
    rx_pharm_title: 'Prescriptions', pharm_info_alert: "You can only view prescription details — not the patient's full medical history.",
    prev_dispensed: 'Previously dispensed — no scan needed', dispensed_on: 'Dispensed on', dispensed_by: 'Dispensed by',
    expired_section: 'Expired prescriptions',
    pharm_avail_note: 'Pharmacist availability note (optional)', avail_placeholder: 'e.g. Brand substituted — patient counselled',
    mark_dispensed: 'Mark dispensed', dispensed_done: 'Dispensed ✓',
    scan_title: 'Scan & dispense', scan_desc: "Scan a patient's prescription QR code to unlock and dispense",
    qr_onetime_note: 'Once a prescription is scanned and dispensed here, the QR code is invalidated. The patient cannot use it at another pharmacy.',
    badge_patient: 'Patient', badge_doctor: 'Doctor', badge_pharm: 'Pharmacist', badge_admin: 'Admin',
    years: 'years',
  },
  ar: {
    role_patient: 'مريض', role_doctor: 'طبيب', role_pharm: 'صيدلاني', role_admin: 'مدير النظام',
    national_id: 'رقم الهوية الوطنية', medical_license: 'رقم الترخيص الطبي', pharmacy_license: 'رقم رخصة الصيدلة',
    ph_patient: 'أدخل الرقم القومي المكون من 14 رقماً', ph_doctor: 'مثال: MED-2019-00342', ph_pharm: 'مثال: PH-2021-00891',
    verify_patient: 'التحقق عبر قاعدة بيانات NIDA', verify_doctor: 'فحص مباشر — نقابة الأطباء', verify_pharm: 'فحص مباشر — نقابة الصيادلة',
    password: 'كلمة المرور', sign_in: 'تسجيل الدخول', live_verified: 'تحقق فوري', sign_out: 'تسجيل الخروج',
    nav_history: 'السجل الطبي', nav_my_rx: 'وصفاتي الطبية', nav_profile: 'ملفي الشخصي', nav_book: 'حجز فحص', nav_pharmacies: 'الصيدليات',
    nav_search: 'بحث عن مريض', nav_new_report: 'تقرير جديد', nav_new_rx: 'وصفة طبية جديدة', nav_my_patients: 'مرضاي', nav_appts: 'المواعيد',
    nav_rx: 'الوصفات الطبية', nav_scan: 'مسح وصرف',
    ph_title: 'السجل الطبي', ph_desc: 'سجلك الطبي الكامل — للقراءة فقط',
    readonly_msg: 'هذا السجل للقراءة فقط. يجب أن تتم جميع التعديلات بواسطة طبيبك.', report_error: 'الإبلاغ عن خطأ',
    pat_info: 'معلومات المريض', nida_verified: 'موثق من NIDA', full_name: 'الاسم الكامل', nat_id: 'الرقم القومي',
    dob: 'تاريخ الميلاد', blood: 'فصيلة الدم', visits: 'الزيارات', diag: 'التشخيص', bp: 'قراءة ضغط الدم', follow: 'المتابعة',
    my_rx_title: 'وصفاتي الطبية', my_rx_desc: 'الوصفات النشطة والمصروفة والمنتهية',
    rx_active: 'نشطة', rx_dispensed: 'مصروفة', rx_expired: 'منتهية الصلاحية',
    issued_by: 'صادرة من', issued_on: 'تاريخ الإصدار', expires: 'تاريخ الانتهاء', qr_required: 'مطلوب رمز QR', one_time: 'نعم — استخدام واحد',
    dispensed_at: 'تم الصرف في', expired_on: 'انتهت في',
    profile_title: 'ملفي الشخصي', profile_desc: 'المعلومات الشخصية المرتبطة برقمك القومي',
    profile_msg: 'لا يضيف البيانات الطبية إلا طبيب موثق. يمكنك تحديث بيانات التواصل بالأسفل.',
    gov: 'المحافظة', phone: 'الهاتف',
    search_title: 'بحث عن مريض', search_desc: 'ابحث بالرقم القومي للوصول إلى السجل الكامل للمريض',
    search_alert: 'لديك إمكانية الوصول إلى جميع السجلات التاريخية من كل الأطباء المعالجين لدعم القرارات السريرية الشاملة.',
    search_placeholder: 'أدخل الرقم القومي للمريض (14 رقماً)...', search_btn: 'بحث', age: 'العمر', known_allergies: 'الحساسية المعروفة',
    full_hist: 'السجل الكامل عبر جميع الأطباء', issue_rx: 'إصدار وصفة', new_report_btn: 'تقرير جديد',
    new_rx_title: 'وصفة طبية جديدة', new_rx_desc: 'إصدار وصفة موثقة مع رمز QR تلقائي',
    pat_id: 'الرقم القومي للمريض', expiry_date: 'تاريخ الانتهاء',
    allergy_notes: 'ملاحظات الحساسية / السريرية (مرئية لجميع الأطباء المعالجين)', issue_qr: 'إصدار وتوليد رمز QR',
    report_title: 'تقرير طبي جديد', report_desc: 'سيكون هذا التقرير مرئياً لجميع الأطباء المعالجين في المستقبل',
    specialty_label: 'التخصص / القسم', diagnosis_label: 'التشخيص',
    clinical_notes: 'الملاحظات السريرية وتحذيرات الحساسية (مشتركة مع جميع الأطباء)', save_report: 'حفظ التقرير',
    my_patients_title: 'مرضاي', my_patients_desc: 'المرضى الذين عالجتهم مؤخراً',
    rx_pharm_title: 'الوصفات الطبية', pharm_info_alert: 'يمكنك عرض تفاصيل الوصفة فقط — لا يمكنك الاطلاع على السجل الطبي الكامل للمريض.',
    prev_dispensed: 'تم الصرف سابقاً — لا يلزم مسح', dispensed_on: 'تاريخ الصرف', dispensed_by: 'صرف بواسطة',
    expired_section: 'الوصفات المنتهية الصلاحية',
    pharm_avail_note: 'ملاحظة الصيدلاني حول التوفر (اختياري)', avail_placeholder: 'مثال: تم استبدال الماركة — تم إرشاد المريض',
    mark_dispensed: 'تأشير كمصروف', dispensed_done: 'تم الصرف ✓',
    scan_title: 'مسح وصرف', scan_desc: 'امسح رمز QR الخاص بوصفة المريض لفتحها وصرفها',
    qr_onetime_note: 'بمجرد مسح الوصفة وصرفها هنا، يصبح رمز QR غير صالح. لا يمكن للمريض استخدامه في صيدلية أخرى.',
    badge_patient: 'مريض', badge_doctor: 'طبيب', badge_pharm: 'صيدلاني', badge_admin: 'مدير',
    years: 'سنة',
  }
};

const DEPARTMENTS = [
  { id:'internal',  en:'Internal Medicine',          ar:'الطب الباطني',              icon:'fa-heart-pulse',        color:'#e53e3e', bg:'#fff5f5' },
  { id:'surgery',   en:'General Surgery',             ar:'الجراحة العامة',            icon:'fa-hand-holding-medical', color:'#2b6cb0', bg:'#ebf8ff' },
  { id:'peds',      en:'Pediatrics',                  ar:'طب الأطفال',               icon:'fa-baby',               color:'#d69e2e', bg:'#fffff0' },
  { id:'obgyn',     en:'Obstetrics & Gynecology',    ar:'النساء والتوليد',           icon:'fa-venus',              color:'#b83280', bg:'#fff5f7' },
  { id:'eye',       en:'Ophthalmology',               ar:'طب العيون',                icon:'fa-eye',                color:'#2c7a7b', bg:'#e6fffa' },
  { id:'ent',       en:'Otorhinolaryngology (ENT)',   ar:'الأنف والأذن والحنجرة',    icon:'fa-ear-deaf',           color:'#744210', bg:'#fffaf0' },
  { id:'ortho',     en:'Orthopedic Surgery',          ar:'جراحة العظام',             icon:'fa-bone',               color:'#744210', bg:'#faf5ff' },
  { id:'cthoracic', en:'Cardiothoracic Surgery',      ar:'جراحة القلب والصدر',       icon:'fa-lungs',              color:'#9b2c2c', bg:'#fff5f5' },
  { id:'neuro',     en:'Neurosurgery',                ar:'جراحة الأعصاب',            icon:'fa-brain',              color:'#553c9a', bg:'#faf5ff' },
  { id:'chest',     en:'Chest Disease',               ar:'أمراض الصدر',             icon:'fa-lungs-virus',        color:'#2c5282', bg:'#ebf8ff' },
  { id:'psych',     en:'Psychiatry & Neurology',      ar:'الطب النفسي والأعصاب',     icon:'fa-brain',              color:'#44337a', bg:'#faf5ff' },
];

const DRUG_INTERACTIONS = [
  { drugs: ['warfarin','aspirin'], severity: 'high', msg_en: 'Warfarin + Aspirin: High risk of serious bleeding', msg_ar: 'وارفارين + أسبرين: خطر نزيف شديد' },
  { drugs: ['warfarin','ibuprofen'], severity: 'high', msg_en: 'Warfarin + Ibuprofen: Increases bleeding risk significantly', msg_ar: 'وارفارين + إيبوبروفين: يزيد خطر النزيف بشكل كبير' },
  { drugs: ['losartan','potassium'], severity: 'moderate', msg_en: 'Losartan + Potassium supplements: Risk of hyperkalemia', msg_ar: 'لوسارتان + مكملات البوتاسيوم: خطر فرط بوتاسيوم الدم' },
  { drugs: ['amlodipine','simvastatin'], severity: 'moderate', msg_en: 'Amlodipine + Simvastatin >20mg: Risk of myopathy', msg_ar: 'أملوديبين + سيمفاستاتين: خطر اعتلال العضلات' },
  { drugs: ['sertraline','tramadol'], severity: 'high', msg_en: 'SSRI (Sertraline) + Tramadol: Risk of serotonin syndrome', msg_ar: 'سيرترالين + ترامادول: خطر متلازمة السيروتونين' },
  { drugs: ['fluoxetine','tramadol'], severity: 'high', msg_en: 'SSRI (Fluoxetine) + Tramadol: Risk of serotonin syndrome', msg_ar: 'فلوكستين + ترامادول: خطر متلازمة السيروتونين' },
  { drugs: ['metformin','contrast'], severity: 'high', msg_en: 'Metformin + Contrast dye: Risk of lactic acidosis', msg_ar: 'ميتفورمين + صبغة التباين: خطر الحماض اللاكتيكي' },
  { drugs: ['sildenafil','nitroglycerin'], severity: 'high', msg_en: 'Sildenafil + Nitrates: Dangerous drop in blood pressure', msg_ar: 'سيلدينافيل + النترات: هبوط خطير في ضغط الدم' },
  { drugs: ['clarithromycin','simvastatin'], severity: 'high', msg_en: 'Clarithromycin + Simvastatin: Risk of rhabdomyolysis', msg_ar: 'كلاريثروميسين + سيمفاستاتين: خطر انحلال العضلات' },
];
const NSAIDS = ['ibuprofen','diclofenac','naproxen','indomethacin','celecoxib','ketoprofen','meloxicam','nsaid'];

/* ── STATE ── */
let lang = 'en';
let role = null;          // role chosen on the landing page / of the signed-in user
let me = null;            // signed-in user record
let activeNav = null;
let authMode = 'signin';
let isNewUser = false;
let unlockedRx = new Set();
let pendingPatient = '';

/* ── HELPERS ── */
const L = () => lang === 'ar';
function t(key) { return T[lang][key] || T.en[key] || key; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function $(id) { return document.getElementById(id); }
function val(id) { const el = $(id); return el ? String(el.value || '').trim() : ''; }
function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function today() { return new Date().toISOString().slice(0, 10); }
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function fmtDate(iso, opts) {
  if (!iso) return '—';
  const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso);
  if (isNaN(d)) return esc(iso);
  return d.toLocaleDateString(L() ? 'ar-EG' : 'en-US', opts || { year: 'numeric', month: 'long', day: 'numeric' });
}
function nm(u) { if (!u) return L() ? 'غير معروف' : 'Unknown'; return (L() && u.nameAr) ? u.nameAr : (u.name || u.login); }
function loc(u, f) { return (L() && u[f + 'Ar']) ? u[f + 'Ar'] : (u[f] || ''); }
function initials(s) { return String(s || '?').replace(/^(Dr\.|د\.)\s*/,'').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(); }
function splitList(s) { return String(s || '').split(/[,،\n]/).map(x => x.trim()).filter(Boolean); }
function ageOf(dob) { if (!dob) return ''; const d = new Date(dob); if (isNaN(d)) return ''; const n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; }
function rxStatus(r) { if (r.dispensedAt) return 'dispensed'; if (r.expires && r.expires < today()) return 'expired'; return 'active'; }
function medLines(r) { return String(r.meds || '').split('\n').map(x => x.trim()).filter(Boolean); }
function normLogin(role, s) { s = String(s || '').trim(); return role === 'patient' ? s.replace(/\D/g, '') : s.toUpperCase().replace(/\s+/g, ''); }
function deptName(id) { const d = DEPARTMENTS.find(x => x.id === id); return d ? (L() ? d.ar : d.en) : (id || ''); }
function rxCode() { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; const r = crypto.getRandomValues(new Uint8Array(6)); r.forEach(b => s += a[b % a.length]); return s; }

async function hashPw(pw, salt) {
  const data = new TextEncoder().encode(salt + '::' + pw);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function setPassword(user, pw) { user.salt = newId(); user.hash = await hashPw(pw, user.salt); delete user._pw; return user; }

function toast(kind, title, desc) {
  const map = { ok: ['fa-circle-check', 'notif-icon-ok'], err: ['fa-triangle-exclamation', 'notif-icon-err'], info: ['fa-circle-info', 'notif-icon-info'], gift: ['fa-gift', 'notif-icon-gift'] };
  const [icon, cls] = map[kind] || map.info;
  showNotification(icon, cls, esc(title), esc(desc || ''));
}
function errBox(msg) { return `<div class="alert alert-danger anim-scale-in" style="margin-top:12px"><i class="fa-solid fa-triangle-exclamation"></i><span>${esc(msg)}</span></div>`; }
function okBox(msg) { return `<div class="alert alert-success anim-scale-in" style="margin-top:12px"><i class="fa-solid fa-circle-check"></i><span>${esc(msg)}</span></div>`; }
function emptyState(icon, title, desc) {
  return `<div class="empty-state"><div class="empty-icon"><i class="fa-solid ${icon}"></i></div><div class="empty-title">${esc(title)}</div>${desc ? `<div class="empty-desc">${esc(desc)}</div>` : ''}</div>`;
}
function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { return null; } }

/* ═══════════════ DATA STORE ═══════════════ */
const COLS = ['users', 'visits', 'rx', 'bookings', 'tickets'];
const Store = {
  mode: 'local',          // 'supabase' | 'cloud' | 'local'
  cache: { users: {}, visits: {}, rx: {}, bookings: {}, tickets: {} },
  db: null, sb: null,
  ready: null,

  async init() {
    const cfg = window.TABIB_CONFIG || {};
    if (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
      try { await this.initSupabase(cfg); this.mode = 'supabase'; return; }
      catch (e) { console.error('Supabase failed, falling back', e); }
    }
    if (window.claude && typeof window.claude.use === 'function') {
      try {
        const db = await Promise.race([window.claude.use('db'), new Promise(r => setTimeout(() => r(null), 10000))]);
        if (db) { await this.initCloud(db); this.mode = 'cloud'; return; }
      } catch (e) { console.error('Cloud db failed, falling back', e); }
    }
    this.initLocal();
  },

  /* Supabase: one table holds every collection (see supabase.sql) */
  async initSupabase(cfg) {
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js');
    this.sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    await this.pullSupabase();
    try {
      this.sb.channel('tabib').on('postgres_changes', { event: '*', schema: 'public', table: 'tabib_records' }, () => this.pullSupabaseSoon()).subscribe();
    } catch (e) {}
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.pullSupabaseSoon(); });
  },
  async pullSupabase() {
    const fresh = { users: {}, visits: {}, rx: {}, bookings: {}, tickets: {} };
    let from = 0;
    for (;;) {
      const { data, error } = await this.sb.from('tabib_records').select('col,id,data').range(from, from + 999);
      if (error) throw error;
      data.forEach(r => { if (fresh[r.col]) fresh[r.col][r.id] = Object.assign({}, r.data, { id: r.id }); });
      if (data.length < 1000) break;
      from += 1000;
    }
    this.cache = fresh;
  },
  _pullTimer: null,
  pullSupabaseSoon() {
    clearTimeout(this._pullTimer);
    this._pullTimer = setTimeout(async () => { try { await this.pullSupabase(); refreshCurrentUser(); rerenderIfIdle(); } catch (e) {} }, 400);
  },

  /* Claude shared database: one collection per table, live updates */
  initCloud(db) {
    this.db = db;
    return new Promise(resolve => {
      let pending = COLS.length, done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      setTimeout(finish, 10000);
      COLS.forEach(col => {
        let first = true;
        db.collection(col).onSnapshot(snap => {
          const m = {};
          snap.docs.forEach(d => { m[d.id] = Object.assign({}, d.data(), { id: d.id }); });
          this.cache[col] = m;
          if (first && !snap.metadata.fromCache) { first = false; if (--pending === 0) finish(); }
          else if (!first) { refreshCurrentUser(); rerenderIfIdle(); }
        }, err => { console.error(col, err); if (first) { first = false; if (--pending === 0) finish(); } });
      });
    });
  },

  initLocal() {
    try { const raw = localStorage.getItem('tabib_db_v1'); if (raw) { const d = JSON.parse(raw); COLS.forEach(c => this.cache[c] = d[c] || {}); } } catch (e) {}
    window.addEventListener('storage', e => { if (e.key === 'tabib_db_v1') { this.initLocal(); refreshCurrentUser(); rerenderIfIdle(); } });
  },
  saveLocal() { try { localStorage.setItem('tabib_db_v1', JSON.stringify(this.cache)); } catch (e) { toast('err', L() ? 'تعذر الحفظ' : 'Could not save', L() ? 'مساحة التخزين في المتصفح ممتلئة أو محظورة.' : 'Browser storage is full or blocked.'); } },

  all(col) { return Object.values(this.cache[col] || {}); },
  get(col, id) { return (this.cache[col] || {})[id] || null; },

  async put(col, obj) {
    if (!obj.id) obj.id = newId();
    obj.updatedAt = new Date().toISOString();
    const body = JSON.parse(JSON.stringify(obj)); delete body._pw;
    const prev = this.cache[col][obj.id];
    this.cache[col][obj.id] = body;
    try {
      if (this.mode === 'supabase') {
        const data = Object.assign({}, body); delete data.id;
        const { error } = await this.sb.from('tabib_records').upsert({ col, id: body.id, data, updated_at: body.updatedAt });
        if (error) throw error;
      } else if (this.mode === 'cloud') {
        const data = Object.assign({}, body); delete data.id;
        await this.db.collection(col).doc(body.id).set(data);
      } else this.saveLocal();
      return body;
    } catch (e) {
      if (prev) this.cache[col][obj.id] = prev; else delete this.cache[col][obj.id];
      console.error(e);
      toast('err', L() ? 'لم يتم الحفظ' : 'Not saved', (L() ? 'تعذر الكتابة في قاعدة البيانات: ' : 'The database refused the change: ') + (e.message || e.code || ''));
      throw e;
    }
  },

  async del(col, id) {
    const prev = this.cache[col][id];
    delete this.cache[col][id];
    try {
      if (this.mode === 'supabase') { const { error } = await this.sb.from('tabib_records').delete().eq('col', col).eq('id', id); if (error) throw error; }
      else if (this.mode === 'cloud') await this.db.collection(col).doc(id).delete();
      else this.saveLocal();
    } catch (e) {
      if (prev) this.cache[col][id] = prev;
      toast('err', L() ? 'لم يتم الحذف' : 'Not deleted', e.message || e.code || '');
      throw e;
    }
  }
};

function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

/* Query helpers */
const Q = {
  users: (r) => Store.all('users').filter(u => !r || u.role === r),
  userByLogin: (r, login) => Store.all('users').find(u => u.role === r && u.login === normLogin(r, login)),
  patient: (natId) => Q.userByLogin('patient', natId),
  doctor: (id) => Store.get('users', id),
  visitsOf: (natId) => Store.all('visits').filter(v => v.patientId === natId).sort((a, b) => (b.date || '').localeCompare(a.date || '')),
  rxOf: (natId) => Store.all('rx').filter(r => r.patientId === natId).sort((a, b) => (b.issued || '').localeCompare(a.issued || '')),
  bookingsOf: (natId) => Store.all('bookings').filter(b => b.patientId === natId),
};

function refreshCurrentUser() {
  if (!me) return;
  const fresh = Store.get('users', me.id);
  if (fresh) me = fresh;
  else { logout(); }
}
let lastInputAt = 0;
document.addEventListener('input', () => { lastInputAt = Date.now(); }, true);
function rerenderIfIdle() {
  // re-render live pages only when the person isn't in the middle of typing
  if (!me || !activeNav) return;
  const a = document.activeElement;
  if (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return;
  if (Date.now() - lastInputAt < 4000) return;
  const liveSafe = ['history', 'my-rx', 'pharmacies', 'my-patients', 'appts', 'a-overview', 'a-patients', 'a-doctors', 'a-pharms', 'a-visits', 'a-rx', 'a-bookings', 'a-tickets'];
  if (liveSafe.includes(activeNav)) { renderSidebar(); renderPage(activeNav); }
}

/* ═══════════════ LANGUAGE ═══════════════ */
function setLang(l) {
  lang = l;
  ss('tabib_lang', l);
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  ['btn-en', 'btn-ar', 'app-btn-en', 'app-btn-ar'].forEach(id => {
    const el = $(id);
    if (el) { const isEn = id.endsWith('en'); el.classList.toggle('active', l === 'en' ? isEn : !isEn); el.setAttribute('aria-pressed', String(l === 'en' ? isEn : !isEn)); }
  });
  document.querySelectorAll('[data-en]').forEach(el => { el.textContent = l === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en'); });
  if (!$('auth-modal').classList.contains('hidden')) renderAuth();
  if (me) { updateTopbar(); renderSidebar(); renderPage(activeNav); }
}

/* ═══════════════ AUTH MODAL ═══════════════ */
function showAuthModal(r) {
  role = r;
  authMode = 'signin';
  ['patient', 'doctor', 'pharm'].forEach(id => { const b = $('login-btn-' + id); if (b) b.classList.toggle('active-login', id === r); });
  $('auth-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderAuth();
}
function showAdminLogin() { role = 'admin'; authMode = 'signin'; $('auth-modal').classList.remove('hidden'); document.body.style.overflow = 'hidden'; renderAuth(); }
function hideAuthModal() { $('auth-modal').classList.add('hidden'); document.body.style.overflow = ''; }
function closeModalOutside(e) { if (e.target === $('auth-modal')) hideAuthModal(); }
function switchAuthMode(mode) { authMode = mode; renderAuth(); }

function authTabs() {
  const on = 'background:var(--forest-700);color:#fff', off = 'background:transparent;color:var(--text-muted)';
  const base = 'flex:1;padding:7px;border:none;border-radius:var(--r-md);font-size:12px;font-family:var(--font-body);font-weight:600;cursor:pointer;transition:all 0.15s;';
  return `<div style="display:flex;gap:6px;margin-bottom:16px;background:var(--ink-50);border-radius:var(--r-lg);padding:4px">
    <button type="button" onclick="switchAuthMode('signin')" id="mode-signin" style="${base}${authMode === 'signin' ? on : off}">${L() ? 'تسجيل الدخول' : 'Sign In'}</button>
    <button type="button" onclick="switchAuthMode('signup')" id="mode-signup" style="${base}${authMode === 'signup' ? on : off}">${L() ? 'إنشاء حساب' : 'Sign Up'}</button>
  </div>`;
}

function renderAuth() {
  if (!Store.isReady) {
    $('modal-body').innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:13px"><i class="fa-solid fa-circle-notch fa-spin" style="margin-inline-end:8px"></i>${L() ? 'جارٍ الاتصال بقاعدة البيانات...' : 'Connecting to the database...'}</div>`;
    Store.ready.then(() => { if (!$('auth-modal').classList.contains('hidden')) renderAuth(); });
    return;
  }
  if (role === 'admin') return renderAdminAuth();
  if (authMode === 'signup') return renderSignupBody(role);
  renderModalBody(role);
}

function renderModalBody(r) {
  const cfg = {
    patient: { label: t('national_id'), ph: t('ph_patient'), verify: t('verify_patient'), ariClass: 'ari-patient', icon: 'fa-user', mode: 'numeric' },
    doctor:  { label: t('medical_license'), ph: t('ph_doctor'), verify: t('verify_doctor'), ariClass: 'ari-doctor', icon: 'fa-stethoscope', mode: 'text' },
    pharm:   { label: t('pharmacy_license'), ph: t('ph_pharm'), verify: t('verify_pharm'), ariClass: 'ari-pharm', icon: 'fa-pills', mode: 'text' }
  }[r];
  $('modal-body').innerHTML = `
    ${authTabs()}
    <div class="auth-role-indicator ${cfg.ariClass}"><i class="fa-solid ${cfg.icon}"></i><span>${t('role_' + r)}</span></div>
    <form onsubmit="event.preventDefault();doLoginFromModal()">
      <div class="field-wrap">
        <div class="field-label">${cfg.label}<span class="verify-chip"><i class="fa-solid fa-shield-halved" style="font-size:9px"></i> ${t('live_verified')}</span></div>
        <input class="field-input" id="modal-id-input" placeholder="${cfg.ph}" inputmode="${cfg.mode}" autocomplete="username" dir="ltr">
        <div class="field-hint"><i class="fa-solid fa-lock" style="font-size:10px"></i> ${cfg.verify}</div>
      </div>
      <div class="field-wrap">
        <div class="field-label">${t('password')}</div>
        <input class="field-input" id="modal-pw-input" type="password" autocomplete="current-password">
      </div>
      <div id="auth-error"></div>
      <button class="btn-signin" id="signin-btn" type="submit"><i class="fa-solid fa-right-to-bracket"></i> ${t('sign_in')}</button>
    </form>`;
  setTimeout(() => { const i = $('modal-id-input'); if (i) i.focus(); }, 50);
}

function renderSignupBody(r) {
  const Lr = L();
  const ariClass = { patient: 'ari-patient', doctor: 'ari-doctor', pharm: 'ari-pharm' }[r];
  const icon = { patient: 'fa-user', doctor: 'fa-stethoscope', pharm: 'fa-pills' }[r];
  const F = (id, label, ph, type, extra) => `<div class="field-wrap"><div class="field-label">${label}${extra || ''}</div><input class="field-input" id="${id}" placeholder="${esc(ph)}" type="${type || 'text'}"${type === 'tel' ? ' dir="ltr"' : ''}></div>`;
  let extra = '';
  if (r === 'patient') {
    extra = `
      <div class="field-wrap">
        <div class="field-label">${Lr ? 'رقم الهوية الوطنية' : 'National ID Number'}<span class="verify-chip"><i class="fa-solid fa-shield-halved" style="font-size:9px"></i> ${Lr ? 'تحقق فوري NIDA' : 'NIDA Verified'}</span></div>
        <input class="field-input" placeholder="${Lr ? '14 رقماً' : '14-digit national ID'}" id="su-login" inputmode="numeric" dir="ltr">
        <div class="field-hint"><i class="fa-solid fa-lock" style="font-size:10px"></i> ${Lr ? 'يتم التحقق عبر قاعدة بيانات NIDA' : 'Verified against NIDA database'}</div>
      </div>
      ${F('su-name', Lr ? 'الاسم الكامل' : 'Full Name', Lr ? 'الاسم كما في الهوية' : 'As on national ID')}
      ${F('su-phone', Lr ? 'رقم الهاتف' : 'Phone Number', '+20 1X XXXX XXXX', 'tel')}`;
  } else if (r === 'doctor') {
    extra = `
      <div class="field-wrap">
        <div class="field-label">${Lr ? 'رقم الترخيص الطبي' : 'Medical License ID'}<span class="verify-chip"><i class="fa-solid fa-shield-halved" style="font-size:9px"></i> ${Lr ? 'نقابة الأطباء' : 'Medical Syndicate'}</span></div>
        <input class="field-input" placeholder="${Lr ? 'مثال: MED-2019-00342' : 'e.g. MED-2019-00342'}" id="su-login" dir="ltr">
        <div class="field-hint"><i class="fa-solid fa-lock" style="font-size:10px"></i> ${Lr ? 'فحص مباشر عبر API نقابة الأطباء' : 'Live check — Medical Syndicate API'}</div>
      </div>
      ${F('su-name', Lr ? 'الاسم الكامل' : 'Full Name', Lr ? 'د. الاسم' : 'Dr. Name')}
      <div class="field-wrap"><div class="field-label">${Lr ? 'القسم' : 'Department'}</div>
        <select class="field-input" id="su-dept">${DEPARTMENTS.map(d => `<option value="${d.id}">${Lr ? d.ar : d.en}</option>`).join('')}</select></div>
      ${F('su-specialty', Lr ? 'التخصص / اللقب' : 'Specialty / Title', Lr ? 'مثال: استشاري طب باطني' : 'e.g. Consultant — Internal Medicine')}
      <div class="signup-section-label">${Lr ? 'عنوان العيادة' : 'Clinic Address'}</div>
      ${F('su-hospital', Lr ? 'اسم المستشفى / العيادة' : 'Hospital / Clinic Name', Lr ? 'اسم المنشأة الطبية' : 'Medical facility name')}
      ${F('su-address', Lr ? 'العنوان الكامل' : 'Full Address', Lr ? 'الشارع، المنطقة، المحافظة' : 'Street, District, Governorate')}
      ${F('su-phone', Lr ? 'رقم هاتف العيادة' : 'Clinic Phone Number', '+20 2 XXXX XXXX', 'tel')}`;
  } else {
    extra = `
      <div class="field-wrap">
        <div class="field-label">${Lr ? 'رقم ترخيص الصيدلية' : 'Pharmacy License Number'}<span class="verify-chip"><i class="fa-solid fa-shield-halved" style="font-size:9px"></i> ${Lr ? 'نقابة الصيادلة' : 'Pharmacists Syndicate'}</span></div>
        <input class="field-input" placeholder="${Lr ? 'مثال: PH-2021-00891' : 'e.g. PH-2021-00891'}" id="su-login" dir="ltr">
        <div class="field-hint"><i class="fa-solid fa-lock" style="font-size:10px"></i> ${Lr ? 'فحص مباشر عبر نقابة الصيادلة' : 'Live check — Pharmacists Syndicate API'}</div>
      </div>
      ${F('su-name', Lr ? 'اسم الصيدلي' : 'Pharmacist Name', Lr ? 'الاسم الكامل' : 'Full name')}
      ${F('su-pharmacy', Lr ? 'اسم الصيدلية' : 'Pharmacy Name', Lr ? 'اسم الصيدلية' : 'Pharmacy name')}
      <div class="signup-section-label">${Lr ? 'عنوان الصيدلية' : 'Pharmacy Address'}</div>
      ${F('su-address', Lr ? 'العنوان الكامل' : 'Full Address', Lr ? 'الشارع، المنطقة، المحافظة' : 'Street, District, Governorate')}
      ${F('su-phone', Lr ? 'رقم الهاتف' : 'Phone Number', '+20 2 XXXX XXXX', 'tel')}`;
  }
  $('modal-body').innerHTML = `
    ${authTabs()}
    <div class="auth-role-indicator ${ariClass}"><i class="fa-solid ${icon}"></i><span>${Lr ? 'إنشاء حساب جديد — ' : 'Create Account — '}${t('role_' + r)}</span></div>
    <form onsubmit="event.preventDefault();doSignupFromModal()">
      ${extra}
      <div class="field-wrap"><div class="field-label">${Lr ? 'كلمة المرور' : 'Password'}</div><input class="field-input" id="su-pw" type="password" autocomplete="new-password" placeholder="${Lr ? '6 أحرف على الأقل' : 'At least 6 characters'}"></div>
      <div class="field-wrap"><div class="field-label">${Lr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</div><input class="field-input" id="su-pw2" type="password" autocomplete="new-password" placeholder="${Lr ? 'أعد كتابة كلمة المرور' : 'Repeat password'}"></div>
      <div id="auth-error"></div>
      <button class="btn-signin" id="signin-btn" type="submit"><i class="fa-solid fa-user-plus"></i> ${Lr ? 'إنشاء الحساب' : 'Create Account'}</button>
    </form>`;
}

function authError(msg) { $('auth-error').innerHTML = `<div class="alert alert-danger" style="margin:0 0 6px"><i class="fa-solid fa-triangle-exclamation"></i><span>${esc(msg)}</span></div>`; }
function btnBusy(on) {
  const b = $('signin-btn'); if (!b) return;
  if (on) { b.dataset.html = b.innerHTML; b.classList.add('btn-loading'); b.innerHTML = ''; b.disabled = true; }
  else { b.classList.remove('btn-loading'); if (b.dataset.html) b.innerHTML = b.dataset.html; b.disabled = false; }
}

async function doLoginFromModal() {
  const login = normLogin(role, val('modal-id-input')), pw = $('modal-pw-input').value;
  if (!login || !pw) return authError(L() ? 'أدخل رقم الدخول وكلمة المرور.' : 'Enter your ID and password.');
  btnBusy(true);
  try {
    const u = Q.userByLogin(role, login);
    if (!u || (await hashPw(pw, u.salt)) !== u.hash) { btnBusy(false); return authError(L() ? 'رقم الدخول أو كلمة المرور غير صحيحة.' : 'The ID or password is incorrect.'); }
    hideAuthModal();
    startSession(u);
  } catch (e) { btnBusy(false); authError(e.message); }
}

async function doSignupFromModal() {
  const Lr = L();
  const login = normLogin(role, val('su-login')), name = val('su-name'), pw = $('su-pw').value, pw2 = $('su-pw2').value;
  if (role === 'patient' && !/^[23]\d{13}$/.test(login)) return authError(Lr ? 'الرقم القومي يجب أن يكون 14 رقماً ويبدأ بـ 2 أو 3.' : 'The national ID must be 14 digits starting with 2 or 3.');
  if (role !== 'patient' && login.length < 4) return authError(Lr ? 'أدخل رقم ترخيص صحيح.' : 'Enter a valid license number.');
  if (!name) return authError(Lr ? 'أدخل الاسم.' : 'Enter your name.');
  if (pw.length < 6) return authError(Lr ? 'كلمة المرور يجب ألا تقل عن 6 أحرف.' : 'The password must be at least 6 characters.');
  if (pw !== pw2) return authError(Lr ? 'كلمتا المرور غير متطابقتين.' : 'The passwords do not match.');
  if (Q.userByLogin(role, login)) return authError(Lr ? 'يوجد حساب مسجل بهذا الرقم بالفعل. سجّل الدخول بدلاً من ذلك.' : 'An account with this ID already exists. Sign in instead.');
  const u = { id: newId(), role, login, name, phone: val('su-phone'), createdAt: new Date().toISOString(), verified: role === 'patient' };
  if (role === 'doctor') Object.assign(u, { dept: val('su-dept'), specialty: val('su-specialty'), hospital: val('su-hospital'), address: val('su-address'), slots: '9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 4:00 PM, 5:00 PM', rating: '', exp: '' });
  if (role === 'pharm') Object.assign(u, { pharmacyName: val('su-pharmacy'), address: val('su-address'), hours: '' });
  btnBusy(true);
  try {
    await setPassword(u, pw);
    await Store.put('users', u);
    hideAuthModal();
    isNewUser = true;
    startSession(u);
  } catch (e) { btnBusy(false); authError(e.message || String(e)); }
}

/* Admin sign-in (open with #admin or by clicking the landing logo 5 times) */
function renderAdminAuth() {
  const Lr = L();
  const hasAdmin = Q.users('admin').length > 0;
  $('modal-body').innerHTML = `
    <div class="auth-role-indicator ari-admin"><i class="fa-solid fa-user-shield"></i><span>${hasAdmin ? (Lr ? 'دخول مدير النظام' : 'Administrator sign in') : (Lr ? 'إعداد حساب المدير لأول مرة' : 'First-time administrator setup')}</span></div>
    ${hasAdmin ? '' : `<div class="alert alert-info"><i class="fa-solid fa-circle-info"></i><span>${Lr ? 'لا يوجد مدير بعد. اختر اسم دخول وكلمة مرور لإنشاء حساب المدير — احتفظ بهما جيداً.' : 'No administrator exists yet. Choose a username and password to create the admin account — keep them safe.'}</span></div>`}
    <form onsubmit="event.preventDefault();doAdminAuth()">
      <div class="field-wrap"><div class="field-label">${Lr ? 'اسم الدخول' : 'Username'}</div><input class="field-input" id="ad-login" autocomplete="username" dir="ltr" value="${hasAdmin ? '' : 'ADMIN'}"></div>
      <div class="field-wrap"><div class="field-label">${t('password')}</div><input class="field-input" id="ad-pw" type="password" autocomplete="${hasAdmin ? 'current-password' : 'new-password'}"></div>
      ${hasAdmin ? '' : `<div class="field-wrap"><div class="field-label">${Lr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</div><input class="field-input" id="ad-pw2" type="password" autocomplete="new-password"></div>`}
      <div id="auth-error"></div>
      <button class="btn-signin" id="signin-btn" type="submit"><i class="fa-solid fa-right-to-bracket"></i> ${hasAdmin ? t('sign_in') : (Lr ? 'إنشاء حساب المدير' : 'Create admin account')}</button>
    </form>`;
}
async function doAdminAuth() {
  const Lr = L();
  const login = normLogin('admin', val('ad-login')), pw = $('ad-pw').value;
  const admins = Q.users('admin');
  if (!login || !pw) return authError(Lr ? 'أدخل اسم الدخول وكلمة المرور.' : 'Enter the username and password.');
  btnBusy(true);
  try {
    if (!admins.length) {
      if (pw.length < 6) { btnBusy(false); return authError(Lr ? 'كلمة المرور يجب ألا تقل عن 6 أحرف.' : 'The password must be at least 6 characters.'); }
      if (pw !== $('ad-pw2').value) { btnBusy(false); return authError(Lr ? 'كلمتا المرور غير متطابقتين.' : 'The passwords do not match.'); }
      const u = await setPassword({ id: 'admin_' + newId(), role: 'admin', login, name: 'Administrator', nameAr: 'مدير النظام', verified: true, createdAt: new Date().toISOString() }, pw);
      await Store.put('users', u);
      hideAuthModal(); startSession(u); return;
    }
    const u = admins.find(a => a.login === login);
    if (!u || (await hashPw(pw, u.salt)) !== u.hash) { btnBusy(false); return authError(Lr ? 'بيانات الدخول غير صحيحة.' : 'The username or password is incorrect.'); }
    hideAuthModal(); startSession(u);
  } catch (e) { btnBusy(false); authError(e.message || String(e)); }
}

/* ═══════════════ SESSION / SHELL ═══════════════ */
function startSession(u) {
  me = u; role = u.role;
  ss('tabib_session', u.id);
  if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search);
  $('landing-view').style.display = 'none';
  $('app-shell').style.display = 'flex';
  updateTopbar();
  const defaults = { patient: 'history', doctor: 'search', pharm: 'rx', admin: 'a-overview' };
  navigateTo(defaults[role]);
  if (isNewUser) { setTimeout(fireNewUserNotifications, 600); isNewUser = false; }
}
function updateTopbar() {
  const uname = nm(me);
  const cls = { patient: 'patient', doctor: 'doctor', pharm: 'pharm', admin: 'admin' }[role];
  $('topbar-badge').className = 'topbar-badge tb-' + cls;
  $('topbar-badge').textContent = t('badge_' + role);
  $('topbar-avatar').className = 'user-avatar ua-' + cls;
  $('topbar-avatar').textContent = initials(uname);
  $('topbar-username').textContent = uname;
}
function logout() {
  me = null; role = null; activeNav = null; unlockedRx = new Set(); pendingPatient = '';
  ss('tabib_session', null);
  $('notif-container').innerHTML = '';
  $('landing-view').style.display = 'flex';
  $('app-shell').style.display = 'none';
  ['patient', 'doctor', 'pharm'].forEach((id, i) => { const b = $('login-btn-' + id); if (b) b.classList.toggle('active-login', i === 0); });
}

function navItems() {
  return {
    patient: [
      { id: 'history', icon: 'fa-notes-medical', label: t('nav_history') },
      { id: 'my-rx', icon: 'fa-file-prescription', label: t('nav_my_rx') },
      { id: 'profile', icon: 'fa-circle-user', label: t('nav_profile') },
      { id: 'book', icon: 'fa-calendar-plus', label: t('nav_book') },
      { id: 'pharmacies', icon: 'fa-store', label: t('nav_pharmacies') },
    ],
    doctor: [
      { id: 'search', icon: 'fa-magnifying-glass', label: t('nav_search') },
      { id: 'new-report', icon: 'fa-file-circle-plus', label: t('nav_new_report') },
      { id: 'new-rx', icon: 'fa-prescription', label: t('nav_new_rx') },
      { id: 'my-patients', icon: 'fa-clipboard-list', label: t('nav_my_patients') },
      { id: 'appts', icon: 'fa-calendar-check', label: t('nav_appts') },
    ],
    pharm: [
      { id: 'rx', icon: 'fa-file-medical', label: t('nav_rx') },
      { id: 'scan', icon: 'fa-qrcode', label: t('nav_scan') },
    ],
    admin: [
      { id: 'a-overview', icon: 'fa-gauge', label: L() ? 'نظرة عامة' : 'Overview' },
      { id: 'a-patients', icon: 'fa-user', label: L() ? 'المرضى' : 'Patients' },
      { id: 'a-doctors', icon: 'fa-user-doctor', label: L() ? 'الأطباء' : 'Doctors' },
      { id: 'a-pharms', icon: 'fa-pills', label: L() ? 'الصيادلة' : 'Pharmacists' },
      { id: 'a-visits', icon: 'fa-notes-medical', label: L() ? 'التقارير الطبية' : 'Medical reports' },
      { id: 'a-rx', icon: 'fa-file-prescription', label: L() ? 'الوصفات' : 'Prescriptions' },
      { id: 'a-bookings', icon: 'fa-calendar-days', label: L() ? 'الحجوزات' : 'Bookings' },
      { id: 'a-tickets', icon: 'fa-headset', label: L() ? 'طلبات الدعم' : 'Support requests' },
      { id: 'a-settings', icon: 'fa-gear', label: L() ? 'الإعدادات' : 'Settings' },
    ]
  }[role];
}
function renderSidebar() {
  const items = navItems();
  $('sidebar').innerHTML = `
    <div class="sidebar-section-label">${L() ? 'التنقل' : 'Navigation'}</div>
    ${items.map(n => `<div class="nav-item ${activeNav === n.id ? 'active' : ''}" role="button" tabindex="0" onclick="navigateTo('${n.id}')" onkeydown="if(event.key==='Enter')navigateTo('${n.id}')"><i class="fa-solid ${n.icon}"></i>${esc(n.label)}</div>`).join('')}
    <div class="sidebar-footer">
      <div class="sf-name">${esc(nm(me))}</div>
      <div class="sf-id">${esc(me.login)}</div>
      <div class="sf-mode"><i class="fa-solid ${Store.mode === 'local' ? 'fa-hard-drive' : 'fa-cloud'}"></i> ${modeLabel()}</div>
    </div>`;
}
function modeLabel() {
  return { supabase: L() ? 'قاعدة بيانات Supabase' : 'Supabase database', cloud: L() ? 'قاعدة بيانات سحابية مشتركة' : 'Shared cloud database', local: L() ? 'تخزين محلي على هذا الجهاز' : 'Stored on this device only' }[Store.mode];
}

const PAGES = {
  'history': pagePatientHistory, 'my-rx': pagePatientRx, 'profile': pageProfile, 'book': pageBookExamination, 'pharmacies': pagePharmacies,
  'search': pageDoctorSearch, 'new-report': pageNewReport, 'new-rx': pageNewRx, 'my-patients': pageMyPatients, 'appts': pageAppointments,
  'rx': pagePharmRx, 'scan': pageScan,
  'a-overview': pageAdminOverview, 'a-patients': () => pageAdminList('patients'), 'a-doctors': () => pageAdminList('doctors'), 'a-pharms': () => pageAdminList('pharms'),
  'a-visits': () => pageAdminList('visits'), 'a-rx': () => pageAdminList('rx'), 'a-bookings': () => pageAdminList('bookings'), 'a-tickets': pageAdminTickets, 'a-settings': pageAdminSettings,
};
function renderPage(page) { const fn = PAGES[page]; if (fn) fn(); }
function navigateTo(page) {
  if (!me) return;
  activeNav = page;
  renderSidebar();
  const area = $('content');
  area.style.transition = 'none'; area.style.opacity = '0'; area.style.transform = 'translateY(8px)';
  renderPage(page);
  $('content-area').scrollTop = 0; window.scrollTo(0, 0);
  requestAnimationFrame(() => requestAnimationFrame(() => { area.style.transition = 'opacity 0.25s ease, transform 0.25s ease'; area.style.opacity = '1'; area.style.transform = 'translateY(0)'; }));
}
function pageHead(title, desc, icon) {
  return `<div class="pg-header"><div class="pg-title">${icon ? `<i class="fa-solid ${icon}" style="color:var(--forest-500);margin-inline-end:10px"></i>` : ''}${esc(title)}</div><div class="pg-desc">${esc(desc)}</div></div>`;
}
function supportLink() { return `<span class="help-link" role="button" tabindex="0" onclick="openSupport()"><i class="fa-solid fa-headset"></i> ${t('report_error')}</span>`; }
function pendingAlert() {
  if (me.verified) return '';
  return `<div class="alert alert-warn"><i class="fa-solid fa-hourglass-half"></i><span>${L() ? 'حسابك قيد المراجعة من إدارة المنصة. يمكنك التصفح، لكن لا يمكنك إصدار أو صرف الوصفات حتى يتم توثيق ترخيصك.' : 'Your account is awaiting verification by the platform administrator. You can browse, but issuing or dispensing prescriptions is locked until your license is verified.'}</span></div>`;
}

/* Support request ("Report an error") */
function openSupport() {
  const Lr = L();
  const box = $('support-box');
  if (box) { box.remove(); return; }
  const html = `<div class="card anim-scale-in" id="support-box" style="border-color:var(--azure-100)">
    <div class="card-head"><span class="card-title"><i class="fa-solid fa-headset" style="color:var(--azure-600);margin-inline-end:8px"></i>${Lr ? 'الإبلاغ عن خطأ في السجل' : 'Report an error in your record'}</span></div>
    <div class="form-field"><label class="f-label" for="support-msg">${Lr ? 'صف الخطأ' : 'Describe the error'}</label><textarea class="f-input" id="support-msg" placeholder="${Lr ? 'مثال: تاريخ الزيارة غير صحيح' : 'e.g. The visit date is wrong'}"></textarea></div>
    <div style="margin-top:12px;display:flex;gap:8px"><button class="btn-primary-action" onclick="sendSupport()"><i class="fa-solid fa-paper-plane"></i> ${Lr ? 'إرسال' : 'Send'}</button></div>
  </div>`;
  const anchor = document.querySelector('#content .alert');
  if (anchor) anchor.insertAdjacentHTML('afterend', html); else $('content').insertAdjacentHTML('afterbegin', html);
  $('support-msg').focus();
}
async function sendSupport() {
  const msg = val('support-msg');
  if (!msg) return;
  try {
    await Store.put('tickets', { userId: me.id, userLogin: me.login, userName: me.name, role: me.role, page: activeNav, message: msg, createdAt: new Date().toISOString(), status: 'open' });
    $('support-box').remove();
    toast('ok', L() ? 'تم إرسال الطلب' : 'Request sent', L() ? 'تم إرسال طلب الدعم. سيتواصل معك أحد المندوبين خلال 24 ساعة.' : 'Support request sent. A representative will contact you within 24 hours.');
  } catch (e) {}
}

/* ═══════════════ PATIENT ═══════════════ */
function visitCard(v, opts) {
  const doc = Q.doctor(v.doctorId);
  const docName = doc ? nm(doc) : (v.doctorName || (L() ? 'طبيب' : 'Doctor'));
  const place = doc ? loc(doc, 'hospital') : '';
  return `<div class="card">
    <div class="card-head">
      <span class="card-title">${esc(v.specialty || (L() ? 'زيارة' : 'Visit'))}</span>
      <span class="card-meta">${fmtDate(v.date)} · ${esc(docName)}${place ? ' — ' + esc(place) : ''}</span>
    </div>
    <div class="info-grid">
      <div class="info-row"><span class="info-lbl">${t('diag')}</span><span class="info-val">${esc(v.diagnosis || '—')}</span></div>
      ${v.bp ? `<div class="info-row"><span class="info-lbl">${t('bp')}</span><span class="info-val warn">${esc(v.bp)}</span></div>` : ''}
      ${v.followUp ? `<div class="info-row"><span class="info-lbl">${t('follow')}</span><span class="info-val">${esc(v.followUp)}</span></div>` : ''}
    </div>
    ${v.notes ? `<div class="doc-note"><i class="fa-solid fa-notes-medical" style="margin-inline-end:6px"></i>${L() ? 'ملاحظة الطبيب: ' : 'Doctor note: '}${esc(v.notes)}</div>` : ''}
    ${opts && opts.actions ? opts.actions : ''}
  </div>`;
}

function pagePatientHistory() {
  const vs = Q.visitsOf(me.login);
  let html = pageHead(t('ph_title'), t('ph_desc'));
  html += `<div class="alert alert-lock"><i class="fa-solid fa-lock"></i><span>${t('readonly_msg')}</span>${supportLink()}</div>`;
  if (!vs.length) html += emptyState('fa-notes-medical', L() ? 'لا توجد زيارات مسجلة بعد' : 'No visits recorded yet', L() ? 'ستظهر هنا تقارير أطبائك فور حفظها. يمكنك تفويض طبيب من صفحة ملفي الشخصي.' : 'Reports from your doctors appear here as soon as they are saved. You can authorize a doctor from My profile.');
  let year = null;
  vs.forEach(v => {
    const y = (v.date || '').slice(0, 4);
    if (y !== year) { year = y; html += `<div class="divider"><span>${t('visits')} — ${esc(y)}</span></div>`; }
    html += visitCard(v);
  });
  $('content').innerHTML = html;
}

function rxBadge(st) {
  if (st === 'active') return `<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> ${t('rx_active')}</span>`;
  if (st === 'dispensed') return `<span class="badge badge-dispensed"><i class="fa-solid fa-box-archive"></i> ${t('rx_dispensed')}</span>`;
  return `<span class="badge badge-expired"><i class="fa-solid fa-clock-rotate-left"></i> ${t('rx_expired')}</span>`;
}
function qrText(r) { return 'TABIB-RX:' + r.id + ':' + r.code; }
function drawQRs() {
  document.querySelectorAll('[data-qr]').forEach(el => {
    if (el.dataset.drawn) return;
    el.dataset.drawn = '1';
    if (window.QRCode) { el.innerHTML = ''; new QRCode(el, { text: el.dataset.qr, width: 150, height: 150, colorDark: '#0d2b1e', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); }
    else el.innerHTML = '<i class="fa-solid fa-qrcode" style="font-size:60px;color:var(--forest-700)"></i>';
  });
}

function pagePatientRx() {
  const list = Q.rxOf(me.login);
  let html = pageHead(t('my_rx_title'), t('my_rx_desc'));
  html += `<div class="alert alert-lock"><i class="fa-solid fa-lock"></i><span>${t('readonly_msg')}</span>${supportLink()}</div>`;
  if (!list.length) html += emptyState('fa-file-prescription', L() ? 'لا توجد وصفات بعد' : 'No prescriptions yet', L() ? 'عندما يصدر لك طبيب وصفة ستظهر هنا مع رمز QR الخاص بها.' : 'When a doctor issues you a prescription it appears here with its QR code.');
  const order = { active: 0, dispensed: 1, expired: 2 };
  list.sort((a, b) => order[rxStatus(a)] - order[rxStatus(b)]).forEach(r => {
    const st = rxStatus(r), doc = Q.doctor(r.doctorId);
    const done = r.dispensedMeds || [];
    const pharm = r.dispensedBy ? Store.get('users', r.dispensedBy) : null;
    html += `<div class="card" ${st === 'expired' ? 'style="opacity:0.75"' : ''}>
      <div class="card-head"><span class="card-title">Rx #${esc(r.num)}</span>${rxBadge(st)}</div>
      <div class="info-grid">
        <div class="info-row"><span class="info-lbl">${t('issued_by')}</span><span class="info-val">${esc(doc ? nm(doc) : '—')}</span></div>
        <div class="info-row"><span class="info-lbl">${t('issued_on')}</span><span class="info-val">${fmtDate(r.issued)}</span></div>
        ${st === 'dispensed'
          ? `<div class="info-row"><span class="info-lbl">${t('dispensed_at')}</span><span class="info-val">${esc(pharm ? loc(pharm, 'pharmacyName') : '—')}</span></div><div class="info-row"><span class="info-lbl">${t('dispensed_on')}</span><span class="info-val">${fmtDate(r.dispensedAt)}</span></div>`
          : st === 'expired'
            ? `<div class="info-row"><span class="info-lbl">${t('expired_on')}</span><span class="info-val danger">${fmtDate(r.expires)}</span></div>`
            : `<div class="info-row"><span class="info-lbl">${t('expires')}</span><span class="info-val">${fmtDate(r.expires)}</span></div><div class="info-row"><span class="info-lbl">${t('qr_required')}</span><span class="info-val">${t('one_time')}</span></div>`}
      </div>
      <ul class="med-list">${medLines(r).map((m, i) => `<li class="med-item ${st !== 'active' || done.includes(i) ? 'used' : ''}"><span>${esc(m)}</span></li>`).join('')}</ul>
      ${r.notes ? `<div class="doc-note"><i class="fa-solid fa-notes-medical" style="margin-inline-end:6px"></i>${esc(r.notes)}</div>` : ''}
      ${r.pharmNote ? `<div class="pharm-note"><i class="fa-solid fa-notes-medical" style="margin-inline-end:6px"></i>${L() ? 'ملاحظة الصيدلاني: ' : 'Pharmacist note: '}${esc(r.pharmNote)}</div>` : ''}
      ${st === 'active' ? `<div class="rx-qr-panel">
        <div class="rx-qr" data-qr="${esc(qrText(r))}"></div>
        <div>
          <div class="rx-qr-title">${L() ? 'اعرض هذا الرمز في الصيدلية' : 'Show this code at the pharmacy'}</div>
          <div class="rx-qr-code" dir="ltr">${esc(r.code)}</div>
          <div class="rx-qr-hint">${L() ? 'صالح لمرة واحدة فقط. لا تشاركه إلا مع الصيدلي عند الصرف.' : 'Valid once. Share it only with the pharmacist when collecting your medicine.'}</div>
        </div>
      </div>` : ''}
    </div>`;
  });
  $('content').innerHTML = html;
  drawQRs();
}

function pageProfile() {
  const Lr = L(), u = me;
  const authDocs = (u.authorizedDoctors || []).map(id => Store.get('users', id)).filter(Boolean);
  $('content').innerHTML = `
    ${pageHead(t('profile_title'), t('profile_desc'))}
    <div class="alert alert-lock"><i class="fa-solid fa-lock"></i><span>${t('profile_msg')}</span>${supportLink()}</div>
    <div class="card">
      <div class="card-head" style="margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:14px">
          <div class="avatar av-blue" style="width:54px;height:54px;font-size:16px">${esc(initials(nm(u)))}</div>
          <div>
            <div style="font-size:16px;font-weight:600">${esc(nm(u))}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:2px;font-family:var(--font-mono)">${esc(u.login)}</div>
            <div class="tag-row" style="margin-top:6px"><span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> ${t('nida_verified')}</span></div>
          </div>
        </div>
        <button class="btn-ghost" onclick="toggleProfileEdit()"><i class="fa-solid fa-pen"></i> ${Lr ? 'تعديل' : 'Edit'}</button>
      </div>
      <div class="info-grid" id="profile-view">
        <div class="info-row"><span class="info-lbl">${t('dob')}</span><span class="info-val">${u.dob ? fmtDate(u.dob) : '—'}</span></div>
        <div class="info-row"><span class="info-lbl">${t('blood')}</span><span class="info-val warn">${esc(u.blood || '—')}</span></div>
        <div class="info-row"><span class="info-lbl">${t('gov')}</span><span class="info-val">${esc(u.gov || '—')}</span></div>
        <div class="info-row"><span class="info-lbl">${t('phone')}</span><span class="info-val" style="font-family:var(--font-mono)" dir="ltr">${esc(u.phone || '—')}</span></div>
        <div class="info-row"><span class="info-lbl">${t('known_allergies')}</span><span class="info-val ${u.allergies ? 'danger' : ''}">${esc(u.allergies || (Lr ? 'لا توجد' : 'None recorded'))}</span></div>
      </div>
      <div id="profile-edit" hidden>
        <div class="form-grid-2">
          <div class="form-field"><label class="f-label" for="pf-name">${t('full_name')}</label><input class="f-input" id="pf-name" value="${esc(u.name || '')}"></div>
          <div class="form-field"><label class="f-label" for="pf-namear">${Lr ? 'الاسم بالعربية' : 'Name in Arabic'}</label><input class="f-input" id="pf-namear" dir="rtl" value="${esc(u.nameAr || '')}"></div>
          <div class="form-field"><label class="f-label" for="pf-dob">${t('dob')}</label><input class="f-input" id="pf-dob" type="date" value="${esc(u.dob || '')}"></div>
          <div class="form-field"><label class="f-label" for="pf-blood">${t('blood')}</label><select class="f-input" id="pf-blood">${['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => `<option ${u.blood === b ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
          <div class="form-field"><label class="f-label" for="pf-gov">${t('gov')}</label><input class="f-input" id="pf-gov" value="${esc(u.gov || '')}"></div>
          <div class="form-field"><label class="f-label" for="pf-phone">${t('phone')}</label><input class="f-input" id="pf-phone" type="tel" dir="ltr" value="${esc(u.phone || '')}"></div>
          <div class="form-field"><label class="f-label" for="pf-pw">${Lr ? 'كلمة مرور جديدة (اختياري)' : 'New password (optional)'}</label><input class="f-input" id="pf-pw" type="password" autocomplete="new-password"></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn-primary-action" onclick="saveProfile()"><i class="fa-solid fa-floppy-disk"></i> ${Lr ? 'حفظ' : 'Save'}</button><button class="btn-ghost" onclick="toggleProfileEdit()">${Lr ? 'إلغاء' : 'Cancel'}</button></div>
        <div id="profile-result"></div>
      </div>
    </div>
    <div class="doctor-license-box">
      <div class="dlb-title"><i class="fa-solid fa-user-doctor" style="margin-inline-end:6px"></i>${Lr ? 'تفويض طبيب لملء سجلك الطبي' : 'Authorize a Doctor to Fill Your Medical History'}</div>
      <div class="dlb-desc">${Lr ? 'أدخل رقم ترخيص الطبيب لمنحه الإذن بإضافة بيانات إلى سجلك الطبي.' : "Enter your doctor's license number to give them permission to add to your medical history."}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <input class="f-input" id="doc-license-input" dir="ltr" placeholder="${Lr ? 'رقم ترخيص الطبيب — مثال MED-2019-00342' : 'Doctor license ID — e.g. MED-2019-00342'}" style="flex:1;min-width:200px">
        <button class="btn-azure" onclick="submitDoctorLicense()"><i class="fa-solid fa-paper-plane"></i> ${Lr ? 'إرسال' : 'Submit'}</button>
      </div>
      <div id="doc-license-result" style="margin-top:8px"></div>
      ${authDocs.length ? `<div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">${authDocs.map(d => `<div class="med-item"><span><i class="fa-solid fa-user-doctor" style="color:var(--azure-600);margin-inline-end:6px"></i>${esc(nm(d))} · <span style="font-family:var(--font-mono);font-size:11px">${esc(d.login)}</span></span><button class="btn-dispense" style="background:var(--crimson-600)" onclick="revokeDoctor('${esc(d.id)}')">${Lr ? 'إلغاء التفويض' : 'Revoke'}</button></div>`).join('')}</div>` : ''}
    </div>`;
}
function toggleProfileEdit() { const e = $('profile-edit'), v = $('profile-view'); e.hidden = !e.hidden; v.hidden = !e.hidden ? true : false; }
async function saveProfile() {
  const u = Object.assign({}, me, { name: val('pf-name') || me.name, nameAr: val('pf-namear'), dob: val('pf-dob'), blood: val('pf-blood'), gov: val('pf-gov'), phone: val('pf-phone') });
  const pw = $('pf-pw').value;
  if (pw && pw.length < 6) { $('profile-result').innerHTML = errBox(L() ? 'كلمة المرور يجب ألا تقل عن 6 أحرف.' : 'The password must be at least 6 characters.'); return; }
  if (pw) await setPassword(u, pw);
  try { me = await Store.put('users', u); updateTopbar(); pageProfile(); toast('ok', L() ? 'تم الحفظ' : 'Saved', L() ? 'تم تحديث ملفك الشخصي.' : 'Your profile was updated.'); } catch (e) {}
}
async function submitDoctorLicense() {
  const Lr = L(), res = $('doc-license-result');
  const lic = normLogin('doctor', val('doc-license-input'));
  if (!lic) { res.innerHTML = '<div class="alert alert-warn" style="margin:0"><i class="fa-solid fa-triangle-exclamation"></i> ' + (Lr ? 'يرجى إدخال رقم الترخيص' : 'Please enter a license number') + '</div>'; return; }
  const d = Q.userByLogin('doctor', lic);
  if (!d) { res.innerHTML = errBox(Lr ? 'لا يوجد طبيب مسجل بهذا الرقم على منصة طبيب.' : 'No doctor with this license is registered on TABIB.'); return; }
  if (!d.verified) { res.innerHTML = errBox(Lr ? 'هذا الطبيب لم يتم توثيقه بعد.' : 'This doctor has not been verified yet.'); return; }
  const list = Array.from(new Set([...(me.authorizedDoctors || []), d.id]));
  try { me = await Store.put('users', Object.assign({}, me, { authorizedDoctors: list })); pageProfile(); $('doc-license-result').innerHTML = okBox((Lr ? 'تم التحقق من الترخيص وتفويض ' : 'License verified. Authorized ') + nm(d) + (Lr ? '.' : ' to update your medical history.')); } catch (e) {}
}
async function revokeDoctor(id) { try { me = await Store.put('users', Object.assign({}, me, { authorizedDoctors: (me.authorizedDoctors || []).filter(x => x !== id) })); pageProfile(); } catch (e) {} }

/* Booking */
function pageBookExamination() {
  const Lr = L();
  const mine = Q.bookingsOf(me.login).filter(b => b.status === 'booked' && b.date >= today()).sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
  $('content').innerHTML = `
    ${pageHead(Lr ? 'حجز فحص طبي' : 'Book an Examination', Lr ? 'اختر القسم الطبي للبحث عن الأطباء المتاحين وحجز موعد.' : 'Select a clinical department to find available doctors and book an appointment.', 'fa-calendar-plus')}
    ${mine.length ? `<div class="divider" style="margin-top:0"><span>${Lr ? 'مواعيدي القادمة' : 'My upcoming appointments'}</span></div>
      ${mine.map(b => { const d = Q.doctor(b.doctorId); return `<div class="patient-row" style="cursor:default">
        <div class="p-avatar pav-forest">${esc(initials(nm(d)))}</div>
        <div style="min-width:0"><div class="pr-name">${esc(nm(d))}</div><div class="pr-sub">${fmtDate(b.date, { weekday: 'short', month: 'short', day: 'numeric' })} · ${esc(b.slot)}</div></div>
        <button class="btn-ghost danger" style="margin-inline-start:auto" onclick="cancelBooking('${esc(b.id)}',this)"><i class="fa-solid fa-xmark"></i> ${Lr ? 'إلغاء' : 'Cancel'}</button>
      </div>`; }).join('')}<div class="divider"><span>${Lr ? 'حجز جديد' : 'New booking'}</span></div>` : ''}
    <div id="dept-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-top:4px">
      ${DEPARTMENTS.map(dep => {
        const n = Q.users('doctor').filter(d => d.dept === dep.id && d.verified).length;
        return `<div class="dept-card" role="button" tabindex="0" onclick="showDeptDoctors('${dep.id}')" onkeydown="if(event.key==='Enter')showDeptDoctors('${dep.id}')" style="--dc:${dep.color}">
          <div class="dept-icon" style="background:${dep.bg};border-color:${dep.color}22"><i class="fa-solid ${dep.icon}" style="color:${dep.color}"></i></div>
          <div><div style="font-size:13px;font-weight:500;color:var(--text-primary);line-height:1.4">${Lr ? dep.ar : dep.en}</div><div style="font-size:11px;color:var(--text-faint)">${n} ${Lr ? 'طبيب' : (n === 1 ? 'doctor' : 'doctors')}</div></div>
        </div>`; }).join('')}
    </div>
    <div id="dept-doctors"></div>`;
}
async function cancelBooking(id, btn) {
  if (!btn.dataset.confirm) { btn.dataset.confirm = '1'; btn.innerHTML = `<i class="fa-solid fa-check"></i> ${L() ? 'تأكيد الإلغاء' : 'Confirm cancel'}`; return; }
  const b = Store.get('bookings', id); if (!b) return;
  try { await Store.put('bookings', Object.assign({}, b, { status: 'cancelled' })); toast('ok', L() ? 'تم الإلغاء' : 'Cancelled', L() ? 'تم إلغاء الموعد.' : 'The appointment was cancelled.'); renderPage(activeNav); } catch (e) {}
}
function showDeptDoctors(deptId) {
  const Lr = L();
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  const doctors = Q.users('doctor').filter(d => d.dept === deptId && d.verified);
  const el = $('dept-doctors');
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin:24px 0 14px;flex-wrap:wrap">
      <button class="btn-ghost" onclick="pageBookExamination()"><i class="fa-solid ${Lr ? 'fa-arrow-right' : 'fa-arrow-left'}"></i> ${Lr ? 'الأقسام' : 'Departments'}</button>
      <div style="font-size:16px;font-weight:600;color:var(--text-primary)">${Lr ? dept.ar : dept.en}</div>
      <span class="badge badge-info" style="margin-inline-start:auto">${doctors.length} ${Lr ? 'طبيب' : 'doctors'}</span>
    </div>
    ${!doctors.length ? emptyState('fa-user-doctor', Lr ? 'لا يوجد أطباء في هذا القسم حالياً' : 'No doctors in this department yet', Lr ? 'سيظهر الأطباء هنا بعد تسجيلهم وتوثيقهم.' : 'Doctors appear here once they register and are verified.') : ''}
    <div style="display:grid;gap:12px">
      ${doctors.map(doc => `
        <div class="card" style="margin:0">
          <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px">
            <div style="width:52px;height:52px;border-radius:50%;background:var(--forest-50);border:2px solid var(--forest-100);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:var(--forest-700);flex-shrink:0">${esc(initials(nm(doc)))}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:15px;font-weight:600;color:var(--text-primary)">${esc(nm(doc))}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${esc(loc(doc, 'specialty'))}</div>
              <div style="display:flex;align-items:center;gap:4px;margin-top:6px;flex-wrap:wrap">
                ${doc.rating ? `<i class="fa-solid fa-star" style="color:var(--gold-400);font-size:11px"></i><span style="font-size:12px;font-weight:600;color:var(--text-primary)">${esc(doc.rating)}</span>` : ''}
                ${doc.exp ? `<span style="font-size:11px;color:var(--text-muted);margin-inline-start:8px"><i class="fa-solid fa-briefcase-medical" style="margin-inline-end:3px"></i>${esc(doc.exp)} ${Lr ? 'سنة خبرة' : 'yrs experience'}</span>` : ''}
              </div>
            </div>
          </div>
          <div style="background:var(--bg-raised);border-radius:var(--r-md);padding:10px 14px;margin-bottom:12px;display:flex;flex-direction:column;gap:5px">
            ${doc.hospital ? `<div class="pharm-detail"><i class="fa-solid fa-hospital" style="color:var(--forest-400);width:14px;text-align:center"></i><span>${esc(loc(doc, 'hospital'))}</span></div>` : ''}
            ${doc.address ? `<div class="pharm-detail"><i class="fa-solid fa-location-dot" style="color:var(--crimson-400);width:14px;text-align:center"></i><span>${esc(loc(doc, 'address'))}</span></div>` : ''}
            ${doc.phone ? `<div class="pharm-detail"><i class="fa-solid fa-phone" style="color:var(--azure-400);width:14px;text-align:center"></i><span dir="ltr">${esc(doc.phone)}</span></div>` : ''}
          </div>
          <button class="btn-primary-action" onclick="showBookingSlots('${esc(doc.id)}')"><i class="fa-solid fa-calendar-check"></i> ${Lr ? 'احجز موعداً' : 'Book Appointment'}</button>
          <div id="slots-${esc(doc.id)}"></div>
        </div>`).join('')}
    </div>`;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function showBookingSlots(docId) {
  const Lr = L();
  const el = $('slots-' + docId);
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { label: d.toLocaleDateString(Lr ? 'ar-EG' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' }), key: d.toISOString().slice(0, 10) };
  });
  el.innerHTML = `
    <div style="margin-top:14px;background:var(--forest-50);border:1px solid var(--forest-100);border-radius:var(--r-lg);padding:16px">
      <div style="font-size:13px;font-weight:600;color:var(--forest-700);margin-bottom:12px"><i class="fa-solid fa-calendar-days" style="margin-inline-end:6px"></i>${Lr ? 'اختر يوماً وموعداً' : 'Select a date and time'}</div>
      <div id="days-tabs-${docId}" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
        ${days.map((day, i) => `<button class="day-tab ${i === 0 ? 'on' : ''}" onclick="selectDay('${docId}','${day.key}',this)">${day.label}</button>`).join('')}
      </div>
      <div id="slots-grid-${docId}"></div>
    </div>`;
  showSlotGrid(docId, days[0].key);
}
function selectDay(docId, dateKey, btn) {
  btn.parentElement.querySelectorAll('.day-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  showSlotGrid(docId, dateKey);
}
function showSlotGrid(docId, dateKey) {
  const doc = Q.doctor(docId);
  const slots = splitList(doc && doc.slots);
  const taken = new Set(Store.all('bookings').filter(b => b.doctorId === docId && b.date === dateKey && b.status === 'booked').map(b => b.slot));
  $('slots-grid-' + docId).innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${slots.length ? slots.map(slot => `<button class="slot-btn" ${taken.has(slot) ? 'disabled title="' + (L() ? 'محجوز' : 'Taken') + '"' : ''} onclick="confirmBooking('${esc(docId)}','${dateKey}','${esc(slot)}',this)"><i class="fa-regular fa-clock" style="margin-inline-end:4px"></i>${esc(slot)}</button>`).join('') : `<span style="font-size:12px;color:var(--text-muted)">${L() ? 'لا توجد مواعيد متاحة لهذا الطبيب.' : 'This doctor has no open time slots.'}</span>`}
    </div>
    <div id="confirm-${esc(docId)}" style="margin-top:10px"></div>`;
}
async function confirmBooking(docId, dateKey, slot, btn) {
  const Lr = L();
  const clash = Store.all('bookings').find(b => b.doctorId === docId && b.date === dateKey && b.slot === slot && b.status === 'booked');
  if (clash) { toast('err', Lr ? 'الموعد محجوز' : 'Slot taken', Lr ? 'اختر موعداً آخر.' : 'Please choose another time.'); showSlotGrid(docId, dateKey); return; }
  btn.disabled = true;
  try {
    await Store.put('bookings', { patientId: me.login, doctorId: docId, date: dateKey, slot, status: 'booked', createdAt: new Date().toISOString() });
    const doctor = Q.doctor(docId);
    btn.classList.add('booked'); btn.innerHTML = `<i class="fa-solid fa-check" style="margin-inline-end:4px"></i>${esc(slot)}`;
    const count = Store.all('bookings').filter(b => b.patientId === me.login && b.doctorId === docId && b.status !== 'cancelled').length;
    $('confirm-' + docId).innerHTML = `
      <div class="alert alert-success anim-scale-in" style="margin-top:8px">
        <i class="fa-solid fa-circle-check" style="font-size:18px"></i>
        <div>
          <div style="font-weight:600;margin-bottom:3px">${Lr ? 'تم تأكيد الحجز!' : 'Appointment Confirmed!'}</div>
          <div style="font-size:12px;opacity:0.9">${esc(nm(doctor))} · ${fmtDate(dateKey, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · ${esc(slot)}</div>
          ${count >= 3 ? `<div style="font-size:11px;margin-top:3px;font-weight:600">${Lr ? '🎁 هذه زيارتك الثالثة مع نفس الطبيب — خصم 25% تلقائي!' : '🎁 This is your 3rd visit with this doctor — 25% discount applied!'}</div>` : ''}
        </div>
      </div>`;
  } catch (e) { btn.disabled = false; }
}

function pagePharmacies() {
  const Lr = L();
  $('content').innerHTML = `
    ${pageHead(Lr ? 'الصيدليات المسجلة' : 'Registered Pharmacies', Lr ? 'جميع الصيدليات المسجلة في منصة طبيب.' : 'All pharmacies registered on the TABIB platform.', 'fa-store')}
    <div class="alert alert-info" style="margin-bottom:18px"><i class="fa-solid fa-circle-info"></i>${Lr ? 'الصيدليات الموثقة عبر نقابة الصيادلة المصرية متاحة لصرف وصفاتك الطبية.' : 'Pharmacies verified through the Egyptian Pharmacists Syndicate can dispense your prescriptions.'}</div>
    <div style="display:flex;gap:8px;margin-bottom:16px"><input id="pharm-search-input" class="f-input" style="flex:1" placeholder="${Lr ? 'ابحث باسم الصيدلية أو الموقع...' : 'Search by pharmacy name or location...'}" oninput="filterPharmacies(this.value)"></div>
    <div id="pharmacies-list">${renderPharmacyCards(Q.users('pharm'))}</div>`;
}
function filterPharmacies(q) {
  q = q.trim().toLowerCase();
  const list = Q.users('pharm').filter(p => !q || [p.pharmacyName, p.pharmacyNameAr, p.address, p.addressAr, p.name, p.nameAr].join(' ').toLowerCase().includes(q));
  $('pharmacies-list').innerHTML = renderPharmacyCards(list);
}
function renderPharmacyCards(list) {
  const Lr = L();
  if (!list.length) return emptyState('fa-store', Lr ? 'لا توجد نتائج' : 'No pharmacies found', '');
  return list.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0)).map(p => `
    <div class="pharmacy-card">
      <div class="pharmacy-icon"><i class="fa-solid fa-prescription-bottle-medical"></i></div>
      <div style="flex:1;min-width:0">
        <div class="pharm-name">${esc(loc(p, 'pharmacyName') || nm(p))}</div>
        <div class="pharm-license">${esc(p.login)}</div>
        ${p.address ? `<div class="pharm-detail"><i class="fa-solid fa-location-dot" style="color:var(--crimson-400);width:13px;text-align:center"></i>${esc(loc(p, 'address'))}</div>` : ''}
        ${p.phone ? `<div class="pharm-detail"><i class="fa-solid fa-phone" style="color:var(--azure-400);width:13px;text-align:center"></i><span dir="ltr">${esc(p.phone)}</span></div>` : ''}
        ${p.hours ? `<div class="pharm-detail"><i class="fa-solid fa-clock" style="color:var(--forest-400);width:13px;text-align:center"></i>${esc(loc(p, 'hours'))}</div>` : ''}
        <div class="pharm-detail" style="margin-top:4px"><i class="fa-solid fa-user-tie" style="color:var(--text-faint);width:13px;text-align:center"></i>${esc(nm(p))}</div>
      </div>
      <div class="pharm-badge">
        ${p.verified ? `<span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> ${Lr ? 'موثق' : 'Verified'}</span>` : `<span class="badge badge-scan"><i class="fa-solid fa-clock"></i> ${Lr ? 'قيد المراجعة' : 'Pending'}</span>`}
      </div>
    </div>`).join('');
}

/* ═══════════════ DOCTOR ═══════════════ */
function patientSummaryCard(p, opts) {
  const Lr = L();
  const allergies = splitList(p.allergies);
  return `<div class="card anim-scale-in">
    <div class="card-head">
      <span class="card-title"><i class="fa-solid fa-user" style="color:var(--azure-400);margin-inline-end:6px"></i>${esc(nm(p))}</span>
      <span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> ${t('nida_verified')}</span>
    </div>
    <div class="info-grid">
      <div class="info-row"><span class="info-lbl">${t('nat_id')}</span><span class="info-val" style="font-family:var(--font-mono)">${esc(p.login)}</span></div>
      <div class="info-row"><span class="info-lbl">${opts && opts.dob ? t('dob') : t('age')}</span><span class="info-val">${opts && opts.dob ? (p.dob ? fmtDate(p.dob) : '—') : (p.dob ? ageOf(p.dob) + ' ' + t('years') : '—')}</span></div>
      <div class="info-row"><span class="info-lbl">${t('blood')}</span><span class="info-val warn">${esc(p.blood || '—')}</span></div>
      ${opts && opts.dob ? '' : `<div class="info-row"><span class="info-lbl">${t('known_allergies')}</span><span class="info-val ${allergies.length ? 'danger' : ''}">${esc(allergies.join(', ') || (Lr ? 'لا توجد' : 'None recorded'))}</span></div>`}
      ${p.chronicMeds && !(opts && opts.dob) ? `<div class="info-row"><span class="info-lbl">${Lr ? 'أدوية مزمنة' : 'Chronic medications'}</span><span class="info-val">${esc(p.chronicMeds)}</span></div>` : ''}
      ${p.phone && !(opts && opts.dob) ? `<div class="info-row"><span class="info-lbl">${t('phone')}</span><span class="info-val" dir="ltr" style="font-family:var(--font-mono)">${esc(p.phone)}</span></div>` : ''}
    </div>
    ${allergies.length ? `<div class="tag-row">${allergies.map(a => `<span class="badge badge-allergy"><i class="fa-solid fa-triangle-exclamation"></i> ${Lr ? 'حساسية: ' : ''}${esc(a)}${Lr ? '' : ' allergy'}</span>`).join('')}</div>` : ''}
  </div>`;
}

function pageDoctorSearch() {
  $('content').innerHTML = `
    ${pageHead(t('search_title'), t('search_desc'))}
    ${pendingAlert()}
    <div class="alert alert-info"><i class="fa-solid fa-circle-info"></i>${t('search_alert')}</div>
    <form class="search-bar" onsubmit="event.preventDefault();renderPatientRecord()">
      <input id="sid" placeholder="${t('search_placeholder')}" inputmode="numeric" dir="ltr" value="${esc(pendingPatient)}">
      <button class="btn-search" type="submit"><i class="fa-solid fa-magnifying-glass"></i> ${t('search_btn')}</button>
    </form>
    <div id="pat-record"></div>`;
  if (pendingPatient) renderPatientRecord();
}
function renderPatientRecord() {
  const Lr = L();
  const id = normLogin('patient', val('sid'));
  const out = $('pat-record');
  if (!id) return;
  const p = Q.patient(id);
  if (!p) { out.innerHTML = errBox(Lr ? 'لا يوجد مريض مسجل بهذا الرقم القومي.' : 'No patient is registered with this national ID.'); return; }
  pendingPatient = id;
  const vs = Q.visitsOf(id), rxs = Q.rxOf(id);
  const recentActive = rxs.filter(r => rxStatus(r) === 'active' && r.issued >= addDays(-30));
  const docsCount = new Set(recentActive.map(r => r.doctorId)).size;
  let html = patientSummaryCard(p);
  if (recentActive.length >= 3 && docsCount >= 2)
    html += `<div class="alert alert-danger"><i class="fa-solid fa-triangle-exclamation"></i>${Lr ? `تنبيه: هذا المريض لديه ${recentActive.length} وصفات نشطة من ${docsCount} أطباء مختلفين خلال الـ 30 يوماً الماضية.` : `Drug-seeking alert: This patient has ${recentActive.length} active prescriptions from ${docsCount} different physicians in the past 30 days.`}</div>`;
  html += `<div class="divider"><span>${t('full_hist')}</span></div>`;
  html += vs.length ? vs.map(v => visitCard(v)).join('') : emptyState('fa-notes-medical', Lr ? 'لا توجد زيارات مسجلة' : 'No visits recorded', '');
  if (rxs.length) {
    html += `<div class="divider"><span>${Lr ? 'الوصفات' : 'Prescriptions'}</span></div>`;
    html += rxs.map(r => { const d = Q.doctor(r.doctorId); return `<div class="card"><div class="card-head"><div><span class="card-title">Rx #${esc(r.num)}</span><div class="card-meta" style="margin-top:3px">${esc(d ? nm(d) : '—')} · ${fmtDate(r.issued)}</div></div>${rxBadge(rxStatus(r))}</div><ul class="med-list" style="margin-top:0">${medLines(r).map(m => `<li class="med-item ${rxStatus(r) !== 'active' ? 'used' : ''}"><span>${esc(m)}</span></li>`).join('')}</ul></div>`; }).join('');
  }
  html += `<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
    <button class="btn-primary-action" onclick="navigateTo('new-rx')"><i class="fa-solid fa-prescription"></i> ${t('issue_rx')}</button>
    <button class="btn-secondary-action" onclick="navigateTo('new-report')"><i class="fa-solid fa-file-circle-plus"></i> ${t('new_report_btn')}</button>
  </div>`;
  out.innerHTML = html;
}

function patientAlertFor(id) {
  const p = Q.patient(normLogin('patient', id));
  if (!id) return '';
  if (!p) return `<div class="alert alert-danger"><i class="fa-solid fa-triangle-exclamation"></i><span>${L() ? 'لا يوجد مريض مسجل بهذا الرقم القومي.' : 'No patient is registered with this national ID.'}</span></div>`;
  const al = splitList(p.allergies);
  return `<div class="alert ${al.length ? 'alert-warn' : 'alert-info'}"><i class="fa-solid ${al.length ? 'fa-triangle-exclamation' : 'fa-user'}"></i><span><strong>${esc(nm(p))}</strong> — ${al.length ? (L() ? 'حساسية معروفة: ' : 'Known allergies: ') + esc(al.join(', ')) : (L() ? 'لا توجد حساسية مسجلة' : 'No allergies on record')}</span></div>`;
}

function pageNewRx() {
  const Lr = L();
  $('content').innerHTML = `
    ${pageHead(t('new_rx_title'), t('new_rx_desc'))}
    ${pendingAlert()}
    <div id="rx-patient-alert">${patientAlertFor(pendingPatient)}</div>
    <div class="card">
      <div class="form-grid-2">
        <div class="form-field"><label class="f-label" for="rx-patient-id">${t('pat_id')}</label><input class="f-input" id="rx-patient-id" dir="ltr" inputmode="numeric" value="${esc(pendingPatient)}" placeholder="${Lr ? '14 رقماً' : '14-digit ID'}" onchange="pendingPatient=normLogin('patient',this.value);$('rx-patient-alert').innerHTML=patientAlertFor(this.value);lockIssue()"></div>
        <div class="form-field"><label class="f-label" for="rx-expiry">${t('expiry_date')}</label><input class="f-input" id="rx-expiry" type="date" value="${addDays(90)}" min="${today()}"></div>
        <div class="form-field full"><label class="f-label" for="rx-meds-input">${Lr ? 'الأدوية (سطر لكل دواء: الاسم، الجرعة، التكرار)' : 'Medications to prescribe (one per line: drug, dose, frequency)'}</label>
          <textarea class="f-input" id="rx-meds-input" oninput="lockIssue()" placeholder="${Lr ? 'مثال: أزيثروميسين 500 ملغ — قرص يومياً × 5 أيام' : 'e.g. Azithromycin 500mg — 1 tab daily × 5 days'}" style="min-height:90px"></textarea></div>
        <div class="form-field full"><label class="f-label" for="rx-notes">${t('allergy_notes')}</label><textarea class="f-input" id="rx-notes" style="min-height:52px"></textarea></div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap">
        <button class="btn-primary-action" onclick="runDrugCheck()" style="background:var(--azure-600)"><i class="fa-solid fa-shield-virus"></i> ${Lr ? 'فحص التفاعلات الدوائية' : 'Check Drug Interactions'}</button>
        <button class="btn-primary-action" id="issue-rx-btn" disabled onclick="issueRx()" style="opacity:0.4;cursor:not-allowed"><i class="fa-solid fa-qrcode"></i> ${t('issue_qr')}</button>
        <span style="font-size:12px;color:var(--text-muted)">${Lr ? '* يجب فحص التفاعلات أولاً' : '* Must check interactions first'}</span>
      </div>
    </div>
    <div id="drug-check-result"></div>
    <div id="rx-result"></div>`;
}
function lockIssue() { const b = $('issue-rx-btn'); if (b) { b.disabled = true; b.style.opacity = '0.4'; b.style.cursor = 'not-allowed'; } }
function unlockIssue() { const b = $('issue-rx-btn'); if (b) { b.disabled = false; b.style.opacity = '1'; b.style.cursor = 'pointer'; } }

function runDrugCheck() {
  const Lr = L();
  const patId = normLogin('patient', val('rx-patient-id'));
  const medsRaw = val('rx-meds-input');
  const resultEl = $('drug-check-result');
  if (!me.verified) { resultEl.innerHTML = errBox(Lr ? 'لا يمكن إصدار وصفات قبل توثيق حسابك.' : 'You cannot issue prescriptions until your account is verified.'); return; }
  const patient = Q.patient(patId);
  if (!patient) { resultEl.innerHTML = errBox(Lr ? 'أدخل رقماً قومياً لمريض مسجل.' : 'Enter the national ID of a registered patient.'); return; }
  if (!medsRaw) { resultEl.innerHTML = `<div class="alert alert-warn" style="margin-top:12px"><i class="fa-solid fa-triangle-exclamation"></i>${Lr ? 'يرجى إدخال الأدوية أولاً.' : 'Please enter medications first.'}</div>`; return; }

  const newMeds = medsRaw.toLowerCase().split('\n').map(l => l.trim()).filter(Boolean);
  const allergies = splitList(patient.allergies).map(a => a.toLowerCase());
  if (allergies.some(a => a.includes('penicillin'))) allergies.push('amoxicillin', 'ampicillin', 'augmentin', 'flucloxacillin');
  if (allergies.some(a => a.includes('sulfa'))) allergies.push('sulfamethoxazole', 'septrin', 'sulfasalazine');
  if (allergies.some(a => NSAIDS.some(n => a.includes(n)))) allergies.push(...NSAIDS);
  const currentMeds = [
    ...splitList(patient.chronicMeds),
    ...Q.rxOf(patient.login).filter(r => rxStatus(r) === 'active').flatMap(medLines)
  ].map(m => m.toLowerCase());
  const issues = [];
  newMeds.forEach(med => {
    const allergen = allergies.find(a => a && med.includes(a.split(' ')[0]));
    if (allergen) issues.push({ severity: 'allergy', msg_en: `ALLERGY CONFLICT: "${med.split('—')[0].trim()}" — patient has a documented ${allergen} allergy`, msg_ar: `تعارض حساسية: "${med.split('—')[0].trim()}" — لدى المريض حساسية موثقة (${allergen})` });
  });
  const allMeds = [...newMeds, ...currentMeds];
  DRUG_INTERACTIONS.forEach(rule => {
    const hit = rule.drugs.every(d => allMeds.some(m => m.includes(d))) && rule.drugs.some(d => newMeds.some(m => m.includes(d)));
    if (hit) issues.push(rule);
  });
  const prescribingNSAID = newMeds.some(m => NSAIDS.some(n => m.includes(n)));
  if (prescribingNSAID && currentMeds.some(m => m.includes('amlodipine'))) issues.push({ severity: 'moderate', msg_en: 'NSAIDs may reduce the antihypertensive effect of Amlodipine', msg_ar: 'مضادات الالتهاب غير الستيرويدية تقلل تأثير أملوديبين' });
  if (prescribingNSAID && currentMeds.some(m => m.includes('losartan'))) issues.push({ severity: 'moderate', msg_en: 'NSAIDs + Losartan: Reduced efficacy, risk of kidney injury', msg_ar: 'مضادات الالتهاب غير الستيرويدية + لوسارتان: تقليل الفاعلية وخطر تلف الكلى' });
  if (prescribingNSAID && currentMeds.some(m => m.includes('aspirin') || m.includes('warfarin'))) issues.push({ severity: 'moderate', msg_en: 'NSAIDs with Aspirin/anticoagulants: increased GI bleeding risk', msg_ar: 'مضادات الالتهاب مع الأسبرين/مضادات التجلط: زيادة خطر نزيف المعدة' });

  const blocking = issues.filter(i => i.severity === 'allergy' || i.severity === 'high');
  const moderate = issues.filter(i => i.severity === 'moderate');
  let html = '';
  if (!issues.length) {
    html = `<div class="alert alert-success anim-scale-in" style="margin-top:14px"><i class="fa-solid fa-circle-check" style="font-size:18px"></i><div><div style="font-weight:600;margin-bottom:3px">${Lr ? 'لم يتم اكتشاف أي تعارضات دوائية ✓' : 'No drug interactions or conflicts detected ✓'}</div><div style="font-size:12px;opacity:0.85">${Lr ? 'الوصفة آمنة للإصدار.' : 'The prescription is safe to issue.'}</div></div></div>
      <div class="card" style="margin-top:10px;border-color:var(--forest-100)">
        <div style="font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">${Lr ? 'ملف المريض المُفحوص' : 'Checked Against Patient Profile'}</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-lbl">${Lr ? 'الحساسيات المعروفة' : 'Known allergies'}</span><span class="info-val danger">${esc(patient.allergies || (Lr ? 'لا توجد' : 'None'))}</span></div>
          <div class="info-row"><span class="info-lbl">${Lr ? 'الأدوية الحالية' : 'Current medications'}</span><span class="info-val">${esc(currentMeds.length ? [...splitList(patient.chronicMeds), ...Q.rxOf(patient.login).filter(r => rxStatus(r) === 'active').flatMap(medLines).map(m => m.split('—')[0].trim())].join(', ') : (Lr ? 'لا توجد' : 'None'))}</span></div>
        </div></div>`;
    unlockIssue();
  } else {
    if (blocking.length) {
      html += `<div class="rx-blocked"><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><i class="fa-solid fa-ban" style="font-size:20px;color:var(--crimson-600)"></i><div><div style="font-size:15px;font-weight:700;color:var(--crimson-700)">${Lr ? '🚫 الوصفة محظورة' : '🚫 Prescription Blocked'}</div><div style="font-size:12px;color:var(--crimson-600);margin-top:2px">${Lr ? 'تم اكتشاف تعارضات خطيرة. لا يمكن إصدار الوصفة.' : 'Critical conflicts detected. Prescription cannot be issued.'}</div></div></div>
        ${blocking.map(i => `<div class="issue-row crit"><i class="fa-solid fa-triangle-exclamation"></i><span>${esc(Lr ? i.msg_ar : i.msg_en)}</span></div>`).join('')}</div>`;
      lockIssue();
    }
    if (moderate.length) {
      html += `<div class="rx-moderate"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><i class="fa-solid fa-circle-exclamation" style="color:var(--gold-600);font-size:17px"></i><div style="font-size:14px;font-weight:600;color:var(--gold-600)">${Lr ? 'تحذيرات تفاعل معتدلة' : 'Moderate Interaction Warnings'}</div></div>
        ${moderate.map(i => `<div class="issue-row mod"><i class="fa-solid fa-arrow-right"></i><span>${esc(Lr ? i.msg_ar : i.msg_en)}</span></div>`).join('')}
        ${!blocking.length ? `<div style="font-size:12px;color:var(--gold-600);margin-top:8px;padding-top:8px;border-top:1px solid var(--gold-100)">${Lr ? 'يمكنك المتابعة مع التوثيق المناسب لهذه التفاعلات.' : 'You may proceed with appropriate documentation of these interactions.'}</div>` : ''}</div>`;
      if (!blocking.length) unlockIssue();
    }
  }
  resultEl.innerHTML = html;
}

async function issueRx() {
  const Lr = L();
  const patId = normLogin('patient', val('rx-patient-id'));
  if (!Q.patient(patId) || !me.verified) return;
  const year = new Date().getFullYear();
  const nums = Store.all('rx').map(r => r.num || '').filter(n => n.startsWith(year + '-')).map(n => parseInt(n.split('-')[1], 10) || 0);
  const num = year + '-' + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4, '0');
  const r = { patientId: patId, doctorId: me.id, num, code: rxCode(), issued: today(), expires: val('rx-expiry') || addDays(90), meds: val('rx-meds-input'), notes: val('rx-notes'), dispensedMeds: [], createdAt: new Date().toISOString() };
  const b = $('issue-rx-btn'); b.disabled = true;
  try {
    const saved = await Store.put('rx', r);
    $('drug-check-result').innerHTML = '';
    $('rx-result').innerHTML = `
      <div class="alert alert-success anim-scale-in"><i class="fa-solid fa-circle-check"></i>${Lr ? `تم إصدار الوصفة Rx #${saved.num}. تم إنشاء رمز QR وربطه وأصبحت ظاهرة في حساب المريض.` : `Prescription Rx #${saved.num} issued. QR code generated, linked, and visible in the patient's account.`}</div>
      <div class="card anim-scale-in" style="background:var(--forest-50);border-color:var(--forest-100);text-align:center;padding:28px">
        <div class="rx-qr" style="margin:0 auto 14px" data-qr="${esc(qrText(saved))}"></div>
        <div style="font-size:14px;font-weight:600;color:var(--forest-700);margin-bottom:4px">Rx #${esc(saved.num)} — ${Lr ? 'رمز QR نشط' : 'Active QR'}</div>
        <div class="rx-qr-code" dir="ltr" style="justify-content:center">${esc(saved.code)}</div>
        <div style="font-size:12px;color:var(--forest-600)">${Lr ? 'استخدام واحد · ينتهي ' : 'Single-use · Expires '}${fmtDate(saved.expires)}</div>
      </div>`;
    $('rx-meds-input').value = ''; $('rx-notes').value = '';
    drawQRs();
    lockIssue();
  } catch (e) { b.disabled = false; }
}

function pageNewReport() {
  const Lr = L();
  $('content').innerHTML = `
    ${pageHead(t('report_title'), t('report_desc'))}
    ${pendingAlert()}
    <div id="rep-patient-alert">${patientAlertFor(pendingPatient)}</div>
    <div class="card">
      <div class="form-grid-2">
        <div class="form-field"><label class="f-label" for="rep-pid">${t('pat_id')}</label><input class="f-input" id="rep-pid" dir="ltr" inputmode="numeric" value="${esc(pendingPatient)}" onchange="pendingPatient=normLogin('patient',this.value);$('rep-patient-alert').innerHTML=patientAlertFor(this.value)"></div>
        <div class="form-field"><label class="f-label" for="rep-date">${Lr ? 'تاريخ الزيارة' : 'Visit date'}</label><input class="f-input" id="rep-date" type="date" value="${today()}"></div>
        <div class="form-field"><label class="f-label" for="rep-spec">${t('specialty_label')}</label><input class="f-input" id="rep-spec" value="${esc(deptName(me.dept))}"></div>
        <div class="form-field"><label class="f-label" for="rep-diag">${t('diagnosis_label')}</label><input class="f-input" id="rep-diag" placeholder="${Lr ? 'التشخيص الأساسي' : 'Primary diagnosis'}"></div>
        <div class="form-field"><label class="f-label" for="rep-bp">${t('bp')}</label><input class="f-input" id="rep-bp" dir="ltr" placeholder="120/80 mmHg"></div>
        <div class="form-field"><label class="f-label" for="rep-follow">${t('follow')}</label><input class="f-input" id="rep-follow" placeholder="${Lr ? 'مثال: بعد 3 أشهر' : 'e.g. In 3 months'}"></div>
        <div class="form-field full"><label class="f-label" for="rep-allergy">${Lr ? 'إضافة حساسية جديدة للسجل (اختياري، افصل بفاصلة)' : 'Add new allergies to the record (optional, comma-separated)'}</label><input class="f-input" id="rep-allergy" placeholder="${Lr ? 'مثال: Penicillin, Sulfa' : 'e.g. Penicillin, Sulfa'}"></div>
        <div class="form-field full"><label class="f-label" for="rep-notes">${t('clinical_notes')}</label><textarea class="f-input" id="rep-notes"></textarea></div>
      </div>
      <div style="margin-top:16px"><button class="btn-primary-action" id="rep-save" onclick="saveReport()"><i class="fa-solid fa-floppy-disk"></i> ${t('save_report')}</button></div>
      <div id="rep-result"></div>
    </div>`;
}
async function saveReport() {
  const Lr = L();
  const pid = normLogin('patient', val('rep-pid'));
  const p = Q.patient(pid);
  if (!me.verified) { $('rep-result').innerHTML = errBox(Lr ? 'لا يمكن حفظ التقارير قبل توثيق حسابك.' : 'You cannot save reports until your account is verified.'); return; }
  if (!p) { $('rep-result').innerHTML = errBox(Lr ? 'أدخل رقماً قومياً لمريض مسجل.' : 'Enter the national ID of a registered patient.'); return; }
  if (!val('rep-diag')) { $('rep-result').innerHTML = errBox(Lr ? 'أدخل التشخيص.' : 'Enter a diagnosis.'); return; }
  $('rep-save').disabled = true;
  try {
    await Store.put('visits', { patientId: pid, doctorId: me.id, date: val('rep-date') || today(), specialty: val('rep-spec'), diagnosis: val('rep-diag'), bp: val('rep-bp'), followUp: val('rep-follow'), notes: val('rep-notes'), createdAt: new Date().toISOString() });
    const add = splitList(val('rep-allergy'));
    if (add.length) {
      const merged = Array.from(new Set([...splitList(p.allergies), ...add]));
      await Store.put('users', Object.assign({}, p, { allergies: merged.join(', ') }));
    }
    pageNewReport();
    $('rep-result').innerHTML = okBox(Lr ? 'تم حفظ التقرير وإضافته إلى السجل الوطني للمريض.' : 'Report saved and added to the patient’s national record.');
  } catch (e) { $('rep-save').disabled = false; }
}

function pageMyPatients() {
  const Lr = L();
  const vs = Store.all('visits').filter(v => v.doctorId === me.id);
  const rxs = Store.all('rx').filter(r => r.doctorId === me.id);
  const last = {};
  vs.forEach(v => { if (!last[v.patientId] || last[v.patientId].date < v.date) last[v.patientId] = { date: v.date, dx: v.diagnosis }; });
  rxs.forEach(r => { if (!last[r.patientId]) last[r.patientId] = { date: r.issued, dx: '' }; });
  const ids = Object.keys(last).sort((a, b) => (last[b].date || '').localeCompare(last[a].date || ''));
  const month = today().slice(0, 7);
  $('content').innerHTML = `
    ${pageHead(t('my_patients_title'), t('my_patients_desc'))}
    <div class="stats-grid">
      <div class="stat-card sc-forest"><div class="stat-num">${ids.length}</div><div class="stat-lbl">${Lr ? 'إجمالي المرضى' : 'Total patients'}</div></div>
      <div class="stat-card sc-gold"><div class="stat-num">${vs.filter(v => (v.date || '').startsWith(month)).length}</div><div class="stat-lbl">${Lr ? 'زيارات هذا الشهر' : 'Visits this month'}</div></div>
      <div class="stat-card sc-azure"><div class="stat-num">${rxs.filter(r => rxStatus(r) === 'active').length}</div><div class="stat-lbl">${Lr ? 'وصفات نشطة' : 'Active prescriptions'}</div></div>
    </div>
    ${!ids.length ? emptyState('fa-clipboard-list', Lr ? 'لم تعالج أي مريض على المنصة بعد' : 'You have not treated anyone on TABIB yet', Lr ? 'عند حفظ تقرير أو إصدار وصفة يظهر المريض هنا.' : 'Patients appear here once you save a report or issue a prescription.') : ''}
    ${ids.map((id, i) => { const p = Q.patient(id); const av = ['pav-azure', 'pav-forest', 'pav-sand'][i % 3]; return `
      <div class="patient-row" role="button" tabindex="0" onclick="pendingPatient='${esc(id)}';navigateTo('search')">
        <div class="p-avatar ${av}">${esc(initials(nm(p)))}</div>
        <div style="min-width:0"><div class="pr-name">${esc(p ? nm(p) : id)}</div><div class="pr-sub">${t('nat_id')}: ${esc(id)}</div></div>
        <div class="pr-right"><div class="pr-date">${fmtDate(last[id].date)}</div><div class="pr-dx">${esc(last[id].dx || '')}</div></div>
      </div>`; }).join('')}`;
}

function pageAppointments() {
  const Lr = L();
  const list = Store.all('bookings').filter(b => b.doctorId === me.id && b.status !== 'cancelled').sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
  const upcoming = list.filter(b => b.date >= today() && b.status === 'booked'), past = list.filter(b => !(b.date >= today() && b.status === 'booked'));
  const row = (b) => { const p = Q.patient(b.patientId); return `<div class="patient-row" style="cursor:default">
      <div class="p-avatar pav-azure">${esc(initials(nm(p)))}</div>
      <div style="min-width:0"><div class="pr-name">${esc(p ? nm(p) : b.patientId)}</div><div class="pr-sub">${fmtDate(b.date, { weekday: 'short', month: 'short', day: 'numeric' })} · ${esc(b.slot)}</div></div>
      <div style="margin-inline-start:auto;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
        ${b.status === 'booked' ? `<button class="btn-ghost" onclick="pendingPatient='${esc(b.patientId)}';navigateTo('search')"><i class="fa-solid fa-folder-open"></i> ${Lr ? 'السجل' : 'Record'}</button><button class="btn-ghost" onclick="setBookingStatus('${esc(b.id)}','done')"><i class="fa-solid fa-check"></i> ${Lr ? 'تمت' : 'Done'}</button>` : `<span class="badge badge-dispensed">${Lr ? 'تمت' : 'Completed'}</span>`}
      </div></div>`; };
  $('content').innerHTML = `
    ${pageHead(Lr ? 'مواعيدي' : 'My appointments', Lr ? 'الحجوزات التي قام بها المرضى عبر المنصة' : 'Appointments patients booked with you through TABIB')}
    <div class="divider" style="margin-top:0"><span>${Lr ? 'القادمة' : 'Upcoming'} (${upcoming.length})</span></div>
    ${upcoming.length ? upcoming.map(row).join('') : emptyState('fa-calendar', Lr ? 'لا توجد مواعيد قادمة' : 'No upcoming appointments', '')}
    ${past.length ? `<div class="divider"><span>${Lr ? 'السابقة' : 'Past'}</span></div>${past.slice(-20).reverse().map(row).join('')}` : ''}`;
}
async function setBookingStatus(id, status) { const b = Store.get('bookings', id); if (!b) return; try { await Store.put('bookings', Object.assign({}, b, { status })); renderPage(activeNav); } catch (e) {} }

/* ═══════════════ PHARMACIST ═══════════════ */
function pagePharmRx() {
  const Lr = L();
  $('content').innerHTML = `
    ${pageHead(t('rx_pharm_title'), Lr ? 'ابحث عن المريض أولاً للتحقق من هويته قبل مسح الوصفة' : 'Search for the patient first to verify identity before scanning their prescription')}
    ${pendingAlert()}
    <div class="alert alert-info"><i class="fa-solid fa-circle-info"></i>${t('pharm_info_alert')}</div>
    <div class="card" id="pharm-search-card">
      <div class="card-head"><span class="card-title"><i class="fa-solid fa-magnifying-glass" style="color:var(--forest-500);margin-inline-end:8px"></i>${Lr ? 'الخطوة 1 — ابحث عن المريض' : 'Step 1 — Find Patient'}</span><span class="badge badge-info">${Lr ? 'مطلوب' : 'Required'}</span></div>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px">${Lr ? 'أدخل الرقم القومي للمريض للتحقق من هويته وعرض وصفاته النشطة.' : "Enter the patient's national ID to verify their identity and view their active prescriptions."}</p>
      <form class="search-bar" style="margin-bottom:0" onsubmit="event.preventDefault();pharmFindPatient()">
        <input id="pharm-patient-id" dir="ltr" inputmode="numeric" placeholder="${Lr ? 'الرقم القومي للمريض (14 رقماً)' : 'Patient national ID (14 digits)...'}" value="${esc(pendingPatient)}">
        <button class="btn-search" type="submit"><i class="fa-solid fa-magnifying-glass"></i> ${Lr ? 'بحث' : 'Search'}</button>
      </form>
    </div>
    <div id="pharm-patient-result"></div>`;
  if (pendingPatient) pharmFindPatient();
}
function pharmFindPatient() {
  const Lr = L();
  const id = normLogin('patient', val('pharm-patient-id'));
  const out = $('pharm-patient-result');
  if (!id) return;
  const p = Q.patient(id);
  if (!p) { out.innerHTML = errBox(Lr ? 'لا يوجد مريض مسجل بهذا الرقم القومي.' : 'No patient is registered with this national ID.'); return; }
  pendingPatient = id;
  const rxs = Q.rxOf(id);
  const active = rxs.filter(r => rxStatus(r) === 'active'), disp = rxs.filter(r => rxStatus(r) === 'dispensed'), exp = rxs.filter(r => rxStatus(r) === 'expired');
  let html = patientSummaryCard(p, { dob: true });
  html += `<div class="divider"><span>${Lr ? 'الخطوة 2 — وصفات نشطة تتطلب مسح QR' : 'Step 2 — Active Prescriptions Requiring QR Scan'}</span></div>`;
  html += active.length ? active.map(r => pharmRxCard(r, p)).join('') : emptyState('fa-file-prescription', Lr ? 'لا توجد وصفات نشطة لهذا المريض' : 'This patient has no active prescriptions', '');
  if (disp.length) html += `<div class="divider"><span>${t('prev_dispensed')}</span></div>` + disp.map(r => doneRxCard(r)).join('');
  if (exp.length) html += `<div class="divider"><span>${t('expired_section')}</span></div>` + exp.map(r => `<div class="card" style="opacity:0.65"><div class="card-head"><span class="card-title">Rx #${esc(r.num)}</span><span class="badge badge-expired"><i class="fa-solid fa-ban"></i> ${t('rx_expired')}</span></div><div class="info-row"><span class="info-lbl">${t('expired_on')}</span><span class="info-val danger">${fmtDate(r.expires)} — ${Lr ? 'لا يمكن الصرف' : 'cannot be dispensed'}</span></div><ul class="med-list">${medLines(r).map(m => `<li class="med-item used"><span>${esc(m)}</span></li>`).join('')}</ul></div>`).join('');
  out.innerHTML = html;
}
function doneRxCard(r) {
  const ph = r.dispensedBy ? Store.get('users', r.dispensedBy) : null;
  return `<div class="card"><div class="card-head"><span class="card-title">Rx #${esc(r.num)}</span><span class="badge badge-dispensed"><i class="fa-solid fa-box-archive"></i> ${t('rx_dispensed')}</span></div>
    <div class="info-grid"><div class="info-row"><span class="info-lbl">${t('dispensed_on')}</span><span class="info-val">${fmtDate(r.dispensedAt)}</span></div><div class="info-row"><span class="info-lbl">${t('dispensed_by')}</span><span class="info-val">${esc(ph ? nm(ph) + ' · ' + loc(ph, 'pharmacyName') : '—')}</span></div></div>
    <ul class="med-list">${medLines(r).map(m => `<li class="med-item used"><span>${esc(m)}</span><span class="badge badge-dispensed">${t('rx_dispensed')}</span></li>`).join('')}</ul>
    ${r.pharmNote ? `<div class="pharm-note"><i class="fa-solid fa-notes-medical" style="margin-inline-end:6px"></i>${L() ? 'ملاحظة الصيدلاني: ' : 'Pharmacist note: '}${esc(r.pharmNote)}</div>` : ''}</div>`;
}
function pharmRxCard(r, p) {
  const Lr = L(), d = Q.doctor(r.doctorId), open = unlockedRx.has(r.id);
  const done = r.dispensedMeds || [];
  const allergies = splitList(p && p.allergies);
  return `<div class="card" id="rxc-${esc(r.id)}">
    <div class="card-head"><div><span class="card-title">Rx #${esc(r.num)}</span><div class="card-meta" style="margin-top:3px">${esc(d ? nm(d) : '—')} · ${fmtDate(r.issued)} · ${Lr ? 'تنتهي ' : 'Expires '}${fmtDate(r.expires)}</div></div>
      ${open ? `<span class="badge badge-verified"><i class="fa-solid fa-unlock"></i> ${Lr ? 'تم التحقق' : 'QR verified'}</span>` : `<span class="badge badge-scan"><i class="fa-solid fa-qrcode"></i> ${Lr ? 'في انتظار المسح' : 'Awaiting scan'}</span>`}</div>
    ${!open ? `
      <div class="alert alert-warn" style="margin-bottom:0"><i class="fa-solid fa-triangle-exclamation"></i>${Lr ? 'هذه الوصفة مقفلة. اطلب من المريض عرض رمز QR الخاص به للتحقق من ملكيتها وفتح محتوياتها.' : 'This prescription is locked. Ask the patient to show their QR code to verify ownership and unlock its contents.'}</div>
      <div class="qr-gate" style="margin-top:14px">
        <div class="qr-icon-box"><i class="fa-solid fa-qrcode"></i></div>
        <span class="qr-gate-text">${Lr ? 'امسح رمز QR بالكاميرا أو اكتب الرمز المكون من 6 أحرف الظاهر أسفله' : 'Scan the QR with your camera, or type the 6-character code shown under it'}</span>
        <div class="code-row">
          <input class="f-input code-input" id="code-${esc(r.id)}" maxlength="6" dir="ltr" placeholder="K7Q2MX" autocomplete="off" onkeydown="if(event.key==='Enter')verifyRxCode('${esc(r.id)}')">
          <button class="btn-scan" onclick="verifyRxCode('${esc(r.id)}')"><i class="fa-solid fa-unlock-keyhole"></i> ${Lr ? 'تحقق' : 'Verify'}</button>
          <label class="btn-scan btn-scan-alt"><i class="fa-solid fa-camera"></i> ${Lr ? 'مسح QR' : 'Scan QR Code'}<input type="file" accept="image/*" capture="environment" hidden onchange="scanQrImage(this,'${esc(r.id)}')"></label>
        </div>
        <div id="code-msg-${esc(r.id)}"></div>
      </div>` : `
      <div class="alert alert-success" style="margin-top:4px"><i class="fa-solid fa-circle-check"></i>${Lr ? `تم التحقق من رمز QR — تم فتح Rx #${esc(r.num)}. الأدوية موضحة أدناه.` : `QR verified — Rx #${esc(r.num)} unlocked. Medications shown below.`}</div>
      <ul class="med-list">${medLines(r).map((m, i) => `<li class="med-item ${done.includes(i) ? 'used' : ''}"><span>${esc(m)}</span><button class="btn-dispense ${done.includes(i) ? 'done' : ''}" ${done.includes(i) || !me.verified ? 'disabled' : ''} onclick="markDispensed('${esc(r.id)}',${i},this)">${done.includes(i) ? t('dispensed_done') : t('mark_dispensed')}</button></li>`).join('')}</ul>
      ${r.notes ? `<div class="doc-note"><i class="fa-solid fa-notes-medical" style="margin-inline-end:6px"></i>${esc(r.notes)}</div>` : ''}
      <div class="form-field" style="margin-top:12px"><label class="f-label" for="pnote-${esc(r.id)}">${t('pharm_avail_note')}</label><input class="f-input" id="pnote-${esc(r.id)}" placeholder="${t('avail_placeholder')}"></div>
      ${allergies.length ? `<div class="alert alert-warn" style="margin-top:12px"><i class="fa-solid fa-triangle-exclamation"></i>${Lr ? 'تحذير: يوجد في سجل المريض حساسية لـ ' : 'Warning: Patient allergy on record — '}${esc(allergies.join(', '))}. ${Lr ? 'تحقق من عدم وجود مركبات متقاطعة.' : 'Verify no cross-reactive compounds in dispensed medications.'}</div>` : ''}
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:4px">
        <button class="btn-primary-action" ${!me.verified ? 'disabled style="opacity:.4"' : ''} onclick="completeDispense('${esc(r.id)}')"><i class="fa-solid fa-box-archive"></i> ${Lr ? 'إتمام الصرف وإبطال الرمز' : 'Complete & invalidate QR'}</button>
        <span style="font-size:11.5px;color:var(--text-muted)">${t('qr_onetime_note')}</span>
      </div>`}
  </div>`;
}
function rerenderRxCard(id) {
  const r = Store.get('rx', id); const el = $('rxc-' + id);
  if (!r || !el) return;
  if (rxStatus(r) === 'dispensed') { el.outerHTML = doneRxCard(r); return; }
  el.outerHTML = pharmRxCard(r, Q.patient(r.patientId));
}
function verifyRxCode(id, given) {
  const Lr = L(), r = Store.get('rx', id);
  const code = (given || val('code-' + id)).toUpperCase().replace(/[^A-Z0-9]/g, '');
  const msg = $('code-msg-' + id);
  if (!r) return;
  if (rxStatus(r) !== 'active') { if (msg) msg.innerHTML = errBox(Lr ? 'هذه الوصفة لم تعد صالحة للصرف.' : 'This prescription can no longer be dispensed.'); return; }
  if (code !== r.code) { if (msg) msg.innerHTML = errBox(Lr ? 'الرمز لا يطابق هذه الوصفة. تأكد من أن الوصفة تخص هذا المريض.' : 'The code does not match this prescription. Make sure it belongs to this patient.'); return; }
  unlockedRx.add(id);
  rerenderRxCard(id);
}
async function scanQrImage(input, rxId) {
  const Lr = L(); const file = input.files && input.files[0]; if (!file) return;
  const msgEl = rxId ? $('code-msg-' + rxId) : $('scan-msg');
  if (msgEl) msgEl.innerHTML = `<div style="font-size:12px;color:var(--text-muted);margin-top:8px"><i class="fa-solid fa-circle-notch fa-spin"></i> ${Lr ? 'جارٍ قراءة الرمز...' : 'Reading the code...'}</div>`;
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js');
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
    const ctx = c.getContext('2d'); ctx.drawImage(bmp, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const res = window.jsQR(img.data, c.width, c.height);
    if (!res) throw new Error('none');
    const m = /^TABIB-RX:([^:]+):([A-Z0-9]+)$/.exec(res.data.trim());
    if (!m) throw new Error('none');
    if (rxId) {
      if (m[1] !== rxId) { msgEl.innerHTML = errBox(Lr ? 'هذا الرمز يخص وصفة أخرى.' : 'This QR belongs to a different prescription.'); return; }
      verifyRxCode(rxId, m[2]);
    } else openRxByCode(m[2], m[1]);
  } catch (e) {
    if (msgEl) msgEl.innerHTML = errBox(Lr ? 'لم نتمكن من قراءة رمز QR من الصورة. جرّب صورة أوضح أو اكتب الرمز يدوياً.' : 'Could not read a QR code from that photo. Try a sharper photo or type the code.');
  } finally { input.value = ''; }
}
async function markDispensed(id, idx, btn) {
  const r = Store.get('rx', id); if (!r || !unlockedRx.has(id)) return;
  btn.disabled = true;
  const done = Array.from(new Set([...(r.dispensedMeds || []), idx]));
  try {
    const upd = Object.assign({}, r, { dispensedMeds: done, dispensedBy: me.id });
    if (done.length >= medLines(r).length) { upd.dispensedAt = today(); upd.pharmNote = val('pnote-' + id) || r.pharmNote || ''; }
    await Store.put('rx', upd);
    if (upd.dispensedAt) { unlockedRx.delete(id); toast('ok', L() ? 'تم الصرف' : 'Dispensed', L() ? `تم صرف الوصفة Rx #${r.num} بالكامل وإبطال رمزها.` : `Rx #${r.num} fully dispensed and its QR invalidated.`); }
    rerenderRxCard(id);
  } catch (e) { btn.disabled = false; }
}
async function completeDispense(id) {
  const r = Store.get('rx', id); if (!r || !unlockedRx.has(id) || !me.verified) return;
  try {
    await Store.put('rx', Object.assign({}, r, { dispensedMeds: medLines(r).map((_, i) => i), dispensedAt: today(), dispensedBy: me.id, pharmNote: val('pnote-' + id) }));
    unlockedRx.delete(id);
    toast('ok', L() ? 'تم الصرف' : 'Dispensed', L() ? `تم صرف الوصفة Rx #${r.num} وإبطال رمزها.` : `Rx #${r.num} dispensed and its QR invalidated.`);
    rerenderRxCard(id);
  } catch (e) {}
}

function pageScan() {
  const Lr = L();
  $('content').innerHTML = `
    ${pageHead(t('scan_title'), t('scan_desc'))}
    ${pendingAlert()}
    <div class="card">
      <div class="qr-gate" style="margin-top:0">
        <div class="qr-icon-box"><i class="fa-solid fa-qrcode"></i></div>
        <span class="qr-gate-text">${Lr ? 'صوّر رمز QR الخاص بوصفة المريض، أو اكتب الرمز المكون من 6 أحرف' : "Photograph the patient's prescription QR, or type the 6-character code"}</span>
        <div class="code-row">
          <input class="f-input code-input" id="scan-code" maxlength="6" dir="ltr" placeholder="K7Q2MX" autocomplete="off" onkeydown="if(event.key==='Enter')openRxByCode(val('scan-code'))">
          <button class="btn-scan" onclick="openRxByCode(val('scan-code'))"><i class="fa-solid fa-unlock-keyhole"></i> ${Lr ? 'فتح الوصفة' : 'Open prescription'}</button>
          <label class="btn-scan btn-scan-alt"><i class="fa-solid fa-camera"></i> ${Lr ? 'مسح QR' : 'Scan QR Code'}<input type="file" accept="image/*" capture="environment" hidden onchange="scanQrImage(this)"></label>
        </div>
        <div id="scan-msg"></div>
      </div>
      <div class="alert alert-info" style="margin:14px 0 0"><i class="fa-solid fa-circle-info"></i>${t('qr_onetime_note')}</div>
    </div>
    <div id="scan-result"></div>`;
}
function openRxByCode(code, rid) {
  const Lr = L();
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const r = Store.all('rx').find(x => x.code === code && (!rid || x.id === rid));
  if (!r) { $('scan-msg').innerHTML = errBox(Lr ? 'لا توجد وصفة بهذا الرمز.' : 'No prescription matches this code.'); return; }
  const st = rxStatus(r);
  if (st !== 'active') { $('scan-msg').innerHTML = errBox(st === 'dispensed' ? (Lr ? 'تم صرف هذه الوصفة من قبل — الرمز لم يعد صالحاً.' : 'This prescription was already dispensed — the code is no longer valid.') : (Lr ? 'انتهت صلاحية هذه الوصفة.' : 'This prescription has expired.')); return; }
  $('scan-msg').innerHTML = '';
  unlockedRx.add(r.id);
  const p = Q.patient(r.patientId);
  $('scan-result').innerHTML = (p ? patientSummaryCard(p, { dob: true }) : '') + pharmRxCard(r, p);
}

/* ═══════════════ ADMIN ═══════════════ */
const BLOOD = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
function doctorOptions() { return Q.users('doctor').map(d => [d.id, nm(d) + ' · ' + d.login]); }
const ENT = {
  patients: {
    col: 'users', role: 'patient', icon: 'fa-user', title: ['Patients', 'المرضى'], single: ['patient', 'مريض'],
    fields: [
      ['login', 'National ID', 'الرقم القومي', 'text', { required: true, ltr: true }], ['name', 'Name (English)', 'الاسم (إنجليزي)', 'text', { required: true }], ['nameAr', 'Name (Arabic)', 'الاسم (عربي)', 'text'],
      ['phone', 'Phone', 'الهاتف', 'tel'], ['dob', 'Date of birth', 'تاريخ الميلاد', 'date'], ['blood', 'Blood type', 'فصيلة الدم', 'select', { options: BLOOD.map(b => [b, b || '—']) }],
      ['gov', 'Governorate', 'المحافظة', 'text'], ['allergies', 'Allergies (comma-separated)', 'الحساسية (افصل بفاصلة)', 'text'], ['chronicMeds', 'Chronic medications', 'أدوية مزمنة', 'text'],
      ['password', 'Password', 'كلمة المرور', 'password'],
    ],
    cols: (u) => [esc(nm(u)), `<span class="mono">${esc(u.login)}</span>`, esc(u.phone || '—'), esc(u.blood || '—'), `<span class="${u.allergies ? 'txt-danger' : ''}">${esc(u.allergies || '—')}</span>`],
    heads: [['Name', 'الاسم'], ['National ID', 'الرقم القومي'], ['Phone', 'الهاتف'], ['Blood', 'الفصيلة'], ['Allergies', 'الحساسية']],
  },
  doctors: {
    col: 'users', role: 'doctor', icon: 'fa-user-doctor', title: ['Doctors', 'الأطباء'], single: ['doctor', 'طبيب'],
    fields: [
      ['login', 'Medical license', 'رقم الترخيص', 'text', { required: true, ltr: true }], ['name', 'Name (English)', 'الاسم (إنجليزي)', 'text', { required: true }], ['nameAr', 'Name (Arabic)', 'الاسم (عربي)', 'text'],
      ['dept', 'Department', 'القسم', 'select', { options: () => DEPARTMENTS.map(d => [d.id, L() ? d.ar : d.en]) }], ['specialty', 'Specialty / title', 'التخصص', 'text'], ['specialtyAr', 'Specialty (Arabic)', 'التخصص (عربي)', 'text'],
      ['hospital', 'Hospital / clinic', 'المستشفى / العيادة', 'text'], ['hospitalAr', 'Hospital (Arabic)', 'المستشفى (عربي)', 'text'], ['address', 'Address', 'العنوان', 'text'], ['addressAr', 'Address (Arabic)', 'العنوان (عربي)', 'text'],
      ['phone', 'Phone', 'الهاتف', 'tel'], ['exp', 'Years of experience', 'سنوات الخبرة', 'number'], ['rating', 'Rating (0–5)', 'التقييم (0–5)', 'text'],
      ['slots', 'Time slots (comma-separated)', 'المواعيد (افصل بفاصلة)', 'text', { full: true }], ['verified', 'Verified license', 'ترخيص موثق', 'checkbox'], ['password', 'Password', 'كلمة المرور', 'password'],
    ],
    cols: (u) => [esc(nm(u)), `<span class="mono">${esc(u.login)}</span>`, esc(deptName(u.dept)), esc(loc(u, 'hospital') || '—'), verifiedPill(u)],
    heads: [['Name', 'الاسم'], ['License', 'الترخيص'], ['Department', 'القسم'], ['Hospital', 'المستشفى'], ['Status', 'الحالة']],
  },
  pharms: {
    col: 'users', role: 'pharm', icon: 'fa-pills', title: ['Pharmacists', 'الصيادلة'], single: ['pharmacist', 'صيدلي'],
    fields: [
      ['login', 'Pharmacy license', 'رقم الترخيص', 'text', { required: true, ltr: true }], ['name', 'Pharmacist name', 'اسم الصيدلي', 'text', { required: true }], ['nameAr', 'Pharmacist name (Arabic)', 'اسم الصيدلي (عربي)', 'text'],
      ['pharmacyName', 'Pharmacy name', 'اسم الصيدلية', 'text'], ['pharmacyNameAr', 'Pharmacy name (Arabic)', 'اسم الصيدلية (عربي)', 'text'],
      ['address', 'Address', 'العنوان', 'text'], ['addressAr', 'Address (Arabic)', 'العنوان (عربي)', 'text'], ['phone', 'Phone', 'الهاتف', 'tel'],
      ['hours', 'Opening hours', 'مواعيد العمل', 'text'], ['hoursAr', 'Opening hours (Arabic)', 'مواعيد العمل (عربي)', 'text'], ['verified', 'Verified license', 'ترخيص موثق', 'checkbox'], ['password', 'Password', 'كلمة المرور', 'password'],
    ],
    cols: (u) => [esc(loc(u, 'pharmacyName') || '—'), esc(nm(u)), `<span class="mono">${esc(u.login)}</span>`, esc(u.phone || '—'), verifiedPill(u)],
    heads: [['Pharmacy', 'الصيدلية'], ['Pharmacist', 'الصيدلي'], ['License', 'الترخيص'], ['Phone', 'الهاتف'], ['Status', 'الحالة']],
  },
  visits: {
    col: 'visits', icon: 'fa-notes-medical', title: ['Medical reports', 'التقارير الطبية'], single: ['report', 'تقرير'],
    fields: [
      ['patientId', 'Patient national ID', 'الرقم القومي للمريض', 'text', { required: true, ltr: true }], ['doctorId', 'Doctor', 'الطبيب', 'select', { options: doctorOptions, required: true }],
      ['date', 'Visit date', 'تاريخ الزيارة', 'date', { required: true }], ['specialty', 'Specialty / visit type', 'التخصص / نوع الزيارة', 'text'], ['diagnosis', 'Diagnosis', 'التشخيص', 'text', { required: true }],
      ['bp', 'BP reading', 'ضغط الدم', 'text'], ['followUp', 'Follow-up', 'المتابعة', 'text'], ['notes', 'Clinical notes', 'ملاحظات', 'textarea'],
    ],
    cols: (v) => { const p = Q.patient(v.patientId), d = Q.doctor(v.doctorId); return [fmtDate(v.date, { year: 'numeric', month: 'short', day: 'numeric' }), esc(p ? nm(p) : v.patientId), esc(d ? nm(d) : '—'), esc(v.diagnosis || '—')]; },
    heads: [['Date', 'التاريخ'], ['Patient', 'المريض'], ['Doctor', 'الطبيب'], ['Diagnosis', 'التشخيص']],
    sort: (a, b) => (b.date || '').localeCompare(a.date || ''),
  },
  rx: {
    col: 'rx', icon: 'fa-file-prescription', title: ['Prescriptions', 'الوصفات'], single: ['prescription', 'وصفة'],
    fields: [
      ['num', 'Rx number', 'رقم الوصفة', 'text', { ltr: true, auto: true }], ['code', 'QR code (6 characters)', 'رمز QR (6 أحرف)', 'text', { ltr: true, auto: true }],
      ['patientId', 'Patient national ID', 'الرقم القومي للمريض', 'text', { required: true, ltr: true }], ['doctorId', 'Doctor', 'الطبيب', 'select', { options: doctorOptions, required: true }],
      ['issued', 'Issued on', 'تاريخ الإصدار', 'date', { required: true }], ['expires', 'Expires', 'تاريخ الانتهاء', 'date', { required: true }],
      ['meds', 'Medications (one per line)', 'الأدوية (سطر لكل دواء)', 'textarea', { required: true }], ['notes', 'Doctor notes', 'ملاحظات الطبيب', 'textarea'],
      ['dispensedAt', 'Dispensed on (empty = not dispensed)', 'تاريخ الصرف (فارغ = لم تُصرف)', 'date'], ['pharmNote', 'Pharmacist note', 'ملاحظة الصيدلي', 'text'],
    ],
    cols: (r) => { const p = Q.patient(r.patientId), d = Q.doctor(r.doctorId); return [`<span class="mono">#${esc(r.num)}</span>`, esc(p ? nm(p) : r.patientId), esc(d ? nm(d) : '—'), fmtDate(r.issued, { year: 'numeric', month: 'short', day: 'numeric' }), rxBadge(rxStatus(r))]; },
    heads: [['Rx', 'الوصفة'], ['Patient', 'المريض'], ['Doctor', 'الطبيب'], ['Issued', 'الإصدار'], ['Status', 'الحالة']],
    sort: (a, b) => (b.issued || '').localeCompare(a.issued || ''),
  },
  bookings: {
    col: 'bookings', icon: 'fa-calendar-days', title: ['Bookings', 'الحجوزات'], single: ['booking', 'حجز'],
    fields: [
      ['patientId', 'Patient national ID', 'الرقم القومي للمريض', 'text', { required: true, ltr: true }], ['doctorId', 'Doctor', 'الطبيب', 'select', { options: doctorOptions, required: true }],
      ['date', 'Date', 'التاريخ', 'date', { required: true }], ['slot', 'Time', 'الوقت', 'text', { required: true }],
      ['status', 'Status', 'الحالة', 'select', { options: () => [['booked', L() ? 'محجوز' : 'Booked'], ['done', L() ? 'تم' : 'Completed'], ['cancelled', L() ? 'ملغي' : 'Cancelled']] }],
    ],
    cols: (b) => { const p = Q.patient(b.patientId), d = Q.doctor(b.doctorId); const st = { booked: ['badge-active', L() ? 'محجوز' : 'Booked'], done: ['badge-dispensed', L() ? 'تم' : 'Completed'], cancelled: ['badge-expired', L() ? 'ملغي' : 'Cancelled'] }[b.status] || ['badge-info', b.status]; return [fmtDate(b.date, { year: 'numeric', month: 'short', day: 'numeric' }) + ' · ' + esc(b.slot), esc(p ? nm(p) : b.patientId), esc(d ? nm(d) : '—'), `<span class="badge ${st[0]}">${esc(st[1])}</span>`]; },
    heads: [['When', 'الموعد'], ['Patient', 'المريض'], ['Doctor', 'الطبيب'], ['Status', 'الحالة']],
    sort: (a, b) => (b.date + b.slot).localeCompare(a.date + a.slot),
  },
};
function verifiedPill(u) { return u.verified ? `<span class="badge badge-verified"><i class="fa-solid fa-shield-halved"></i> ${L() ? 'موثق' : 'Verified'}</span>` : `<span class="badge badge-scan"><i class="fa-solid fa-clock"></i> ${L() ? 'قيد المراجعة' : 'Pending'}</span>`; }
function entRows(key) { const e = ENT[key]; let rows = Store.all(e.col); if (e.role) rows = rows.filter(u => u.role === e.role); return rows.sort(e.sort || ((a, b) => (b.createdAt || b.updatedAt || '').localeCompare(a.createdAt || a.updatedAt || ''))); }

let adminEdit = null; let adminFilter = '';
function pageAdminList(key, keepForm) {
  const Lr = L(), e = ENT[key];
  if (!keepForm) { adminEdit = null; adminFilter = ''; }
  const all = entRows(key);
  const q = adminFilter.toLowerCase();
  const rows = q ? all.filter(r => JSON.stringify(r).toLowerCase().includes(q) || (e.cols(r).join(' ').toLowerCase().includes(q))) : all;
  const pending = e.role && e.role !== 'patient' ? all.filter(u => !u.verified).length : 0;
  $('content').innerHTML = `
    <div class="pg-header admin-head">
      <div><div class="pg-title"><i class="fa-solid ${e.icon}" style="color:var(--forest-500);margin-inline-end:10px"></i>${Lr ? e.title[1] : e.title[0]}</div>
      <div class="pg-desc">${all.length} ${Lr ? 'سجل' : (all.length === 1 ? 'record' : 'records')}${pending ? ` · <span style="color:var(--gold-600);font-weight:600">${pending} ${Lr ? 'بانتظار التوثيق' : 'awaiting verification'}</span>` : ''}</div></div>
      <button class="btn-primary-action" onclick="adminOpenForm('${key}')"><i class="fa-solid fa-plus"></i> ${Lr ? 'إضافة ' + e.single[1] : 'Add ' + e.single[0]}</button>
    </div>
    <div id="admin-form"></div>
    <div class="search-bar" style="margin-bottom:14px"><input id="admin-filter" placeholder="${Lr ? 'بحث في السجلات...' : 'Search records...'}" value="${esc(adminFilter)}" oninput="adminFilter=this.value;clearTimeout(window._af);window._af=setTimeout(()=>{pageAdminList('${key}',true);const f=$('admin-filter');f.focus();f.setSelectionRange(f.value.length,f.value.length)},250)"></div>
    ${rows.length ? `<div class="table-wrap"><table class="data-table">
      <thead><tr>${e.heads.map(h => `<th>${Lr ? h[1] : h[0]}</th>`).join('')}<th class="act-col"></th></tr></thead>
      <tbody>${rows.map(r => `<tr>${e.cols(r).map(c => `<td>${c}</td>`).join('')}<td class="act-col">
        ${e.role && e.role !== 'patient' && !r.verified ? `<button class="icon-btn ok" title="${Lr ? 'توثيق' : 'Verify'}" onclick="adminVerify('${esc(r.id)}','${key}')"><i class="fa-solid fa-shield-halved"></i></button>` : ''}
        <button class="icon-btn" title="${Lr ? 'تعديل' : 'Edit'}" onclick="adminOpenForm('${key}','${esc(r.id)}')"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn danger" title="${Lr ? 'حذف' : 'Delete'}" onclick="adminDelete('${key}','${esc(r.id)}',this)"><i class="fa-solid fa-trash"></i></button>
      </td></tr>`).join('')}</tbody></table></div>`
      : emptyState(e.icon, q ? (Lr ? 'لا توجد نتائج مطابقة' : 'No matching records') : (Lr ? 'لا توجد سجلات بعد' : 'No records yet'), q ? '' : (Lr ? 'استخدم زر الإضافة لإنشاء أول سجل، أو حمّل البيانات التجريبية من الإعدادات.' : 'Use the Add button to create the first record, or load sample data from Settings.'))}`;
  if (keepForm && adminEdit && adminEdit.key === key) adminOpenForm(key, adminEdit.id);
}
function adminOpenForm(key, id) {
  const Lr = L(), e = ENT[key];
  const rec = id ? Store.get(e.col, id) : null;
  adminEdit = { key, id: id || null };
  const fieldHtml = e.fields.map(([f, en, ar, type, o]) => {
    o = o || {};
    const label = (Lr ? ar : en) + (o.required ? ' *' : '') + (type === 'password' && rec ? (Lr ? ' (اتركها فارغة للإبقاء عليها)' : ' (leave blank to keep)') : '') + (o.auto && !rec ? (Lr ? ' (تلقائي إن تُرك فارغاً)' : ' (auto if left blank)') : '');
    const v = rec ? (rec[f] == null ? '' : rec[f]) : (f === 'date' || f === 'issued' ? today() : f === 'expires' ? addDays(90) : f === 'verified' ? true : '');
    const fid = 'af-' + f;
    let input;
    if (type === 'select') { const opts = typeof o.options === 'function' ? o.options() : o.options; input = `<select class="f-input" id="${fid}">${opts.map(([k, lbl]) => `<option value="${esc(k)}" ${String(v) === String(k) ? 'selected' : ''}>${esc(lbl)}</option>`).join('')}</select>`; }
    else if (type === 'textarea') input = `<textarea class="f-input" id="${fid}">${esc(v)}</textarea>`;
    else if (type === 'checkbox') return `<label class="check-field"><input type="checkbox" id="${fid}" ${v ? 'checked' : ''}> ${esc(Lr ? ar : en)}</label>`;
    else input = `<input class="f-input" id="${fid}" type="${type}" ${o.ltr || type === 'tel' ? 'dir="ltr"' : ''} value="${type === 'password' ? '' : esc(v)}" ${type === 'password' ? 'autocomplete="new-password"' : ''}>`;
    return `<div class="form-field ${type === 'textarea' || o.full ? 'full' : ''}"><label class="f-label" for="${fid}">${esc(label)}</label>${input}</div>`;
  }).join('');
  $('admin-form').innerHTML = `<div class="card anim-scale-in admin-form-card">
    <div class="card-head"><span class="card-title">${rec ? (Lr ? 'تعديل ' + e.single[1] : 'Edit ' + e.single[0]) : (Lr ? 'إضافة ' + e.single[1] : 'New ' + e.single[0])}</span><button class="modal-close" style="position:static" onclick="adminCloseForm()" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div>
    <form onsubmit="event.preventDefault();adminSave()"><div class="form-grid-2">${fieldHtml}</div>
    <div id="admin-form-err"></div>
    <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap"><button class="btn-primary-action" type="submit" id="admin-save-btn"><i class="fa-solid fa-floppy-disk"></i> ${Lr ? 'حفظ' : 'Save'}</button><button class="btn-ghost" type="button" onclick="adminCloseForm()">${Lr ? 'إلغاء' : 'Cancel'}</button></div></form>
  </div>`;
  $('admin-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function adminCloseForm() { adminEdit = null; $('admin-form').innerHTML = ''; }
async function adminSave() {
  const Lr = L(), { key, id } = adminEdit, e = ENT[key];
  const rec = id ? Object.assign({}, Store.get(e.col, id)) : { id: newId(), createdAt: new Date().toISOString() };
  const errs = [];
  let pw = '';
  e.fields.forEach(([f, en, ar, type, o]) => {
    o = o || {};
    const el = $('af-' + f); if (!el) return;
    if (type === 'checkbox') { rec[f] = el.checked; return; }
    let v = String(el.value || '').trim();
    if (type === 'password') { pw = v; return; }
    if (f === 'login') v = normLogin(e.role, v);
    if (f === 'patientId') v = normLogin('patient', v);
    if (o.required && !v) errs.push((Lr ? ar : en) + (Lr ? ' مطلوب' : ' is required'));
    rec[f] = v;
  });
  if (e.role) {
    rec.role = e.role;
    if (e.role === 'patient' && rec.login && !/^\d{14}$/.test(rec.login)) errs.push(Lr ? 'الرقم القومي يجب أن يكون 14 رقماً' : 'National ID must be 14 digits');
    const dup = Store.all('users').find(u => u.role === e.role && u.login === rec.login && u.id !== rec.id);
    if (dup) errs.push(Lr ? 'يوجد حساب آخر بنفس رقم الدخول' : 'Another account already uses this ID');
    if (!id && !pw) errs.push(Lr ? 'كلمة المرور مطلوب' : 'Password is required');
    if (pw && pw.length < 6) errs.push(Lr ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
    if (e.role === 'patient') rec.verified = true;
  }
  if (rec.patientId !== undefined && rec.patientId && !Q.patient(rec.patientId)) errs.push(Lr ? 'لا يوجد مريض بهذا الرقم القومي' : 'No patient has this national ID');
  if (key === 'rx') {
    if (!rec.code) rec.code = rxCode(); rec.code = rec.code.toUpperCase();
    if (!rec.num) { const y = (rec.issued || today()).slice(0, 4); const ns = Store.all('rx').map(r => r.num || '').filter(n => n.startsWith(y + '-')).map(n => parseInt(n.split('-')[1], 10) || 0); rec.num = y + '-' + String((ns.length ? Math.max(...ns) : 0) + 1).padStart(4, '0'); }
    if (!rec.dispensedAt) { rec.dispensedMeds = rec.dispensedMeds && rec.dispensedMeds.length < medLines(rec).length ? rec.dispensedMeds : []; delete rec.dispensedBy; }
    else if (!rec.dispensedMeds || rec.dispensedMeds.length < medLines(rec).length) rec.dispensedMeds = medLines(rec).map((_, i) => i);
  }
  if (errs.length) { $('admin-form-err').innerHTML = errBox(errs.join(' · ')); return; }
  $('admin-save-btn').disabled = true;
  try {
    if (pw) await setPassword(rec, pw);
    await Store.put(e.col, rec);
    if (me && rec.id === me.id) me = rec;
    adminEdit = null;
    toast('ok', Lr ? 'تم الحفظ' : 'Saved', Lr ? 'تم حفظ السجل في قاعدة البيانات.' : 'The record was saved to the database.');
    pageAdminList(key, true);
  } catch (err) { $('admin-save-btn').disabled = false; }
}
async function adminDelete(key, id, btn) {
  const Lr = L();
  if (!btn.dataset.confirm) { btn.dataset.confirm = '1'; btn.classList.add('confirming'); btn.innerHTML = `<i class="fa-solid fa-check"></i> ${Lr ? 'تأكيد' : 'Confirm'}`; setTimeout(() => { if (btn.isConnected) { delete btn.dataset.confirm; btn.classList.remove('confirming'); btn.innerHTML = '<i class="fa-solid fa-trash"></i>'; } }, 4000); return; }
  try { await Store.del(ENT[key].col, id); toast('ok', Lr ? 'تم الحذف' : 'Deleted', Lr ? 'تم حذف السجل.' : 'The record was deleted.'); pageAdminList(key, true); } catch (e) {}
}
async function adminVerify(id, key) { const u = Store.get('users', id); if (!u) return; try { await Store.put('users', Object.assign({}, u, { verified: true })); toast('ok', L() ? 'تم التوثيق' : 'Verified', nm(u)); if (key) pageAdminList(key, true); else pageAdminOverview(); } catch (e) {} }

function pageAdminOverview() {
  const Lr = L();
  const c = (r) => Q.users(r).length;
  const rxs = Store.all('rx');
  const pendingUsers = Store.all('users').filter(u => (u.role === 'doctor' || u.role === 'pharm') && !u.verified);
  const openTickets = Store.all('tickets').filter(x => x.status !== 'closed').length;
  const upcoming = Store.all('bookings').filter(b => b.status === 'booked' && b.date >= today()).length;
  const tile = (n, en, ar, cls, nav) => `<div class="stat-card ${cls}" role="button" tabindex="0" style="cursor:pointer" onclick="navigateTo('${nav}')"><div class="stat-num">${n}</div><div class="stat-lbl">${Lr ? ar : en}</div></div>`;
  $('content').innerHTML = `
    ${pageHead(Lr ? 'لوحة الإدارة' : 'Admin dashboard', Lr ? 'إدارة كل بيانات المنصة: إضافة وتعديل وحذف' : 'Manage every record on the platform: add, edit and delete')}
    <div class="alert ${Store.mode === 'local' ? 'alert-warn' : 'alert-success'}"><i class="fa-solid ${Store.mode === 'local' ? 'fa-hard-drive' : 'fa-cloud'}"></i><span><strong>${modeLabel()}</strong> — ${Store.mode === 'local' ? (Lr ? 'البيانات محفوظة في هذا المتصفح فقط. لربط قاعدة بيانات مشتركة راجع الإعدادات.' : 'Data is saved in this browser only. See Settings to connect a shared database.') : (Lr ? 'كل التغييرات تُحفظ فوراً ويراها جميع المستخدمين.' : 'Every change is saved instantly and seen by every user.')}</span></div>
    <div class="stats-grid">
      ${tile(c('patient'), 'Patients', 'المرضى', 'sc-azure', 'a-patients')}
      ${tile(c('doctor'), 'Doctors', 'الأطباء', 'sc-forest', 'a-doctors')}
      ${tile(c('pharm'), 'Pharmacists', 'الصيادلة', 'sc-gold', 'a-pharms')}
      ${tile(Store.all('visits').length, 'Medical reports', 'التقارير الطبية', 'sc-forest', 'a-visits')}
      ${tile(rxs.filter(r => rxStatus(r) === 'active').length + ' / ' + rxs.length, 'Active / all prescriptions', 'وصفات نشطة / الكل', 'sc-gold', 'a-rx')}
      ${tile(upcoming, 'Upcoming bookings', 'حجوزات قادمة', 'sc-azure', 'a-bookings')}
    </div>
    ${pendingUsers.length ? `<div class="divider"><span>${Lr ? 'بانتظار التوثيق' : 'Awaiting verification'} (${pendingUsers.length})</span></div>
      ${pendingUsers.map(u => `<div class="patient-row" style="cursor:default"><div class="p-avatar ${u.role === 'doctor' ? 'pav-forest' : 'pav-sand'}">${esc(initials(nm(u)))}</div><div style="min-width:0"><div class="pr-name">${esc(nm(u))}</div><div class="pr-sub">${t('role_' + u.role)} · ${esc(u.login)}</div></div><button class="btn-primary-action" style="margin-inline-start:auto" onclick="adminVerify('${esc(u.id)}')"><i class="fa-solid fa-shield-halved"></i> ${Lr ? 'توثيق' : 'Verify'}</button></div>`).join('')}` : ''}
    ${openTickets ? `<div class="alert alert-info" style="margin-top:14px"><i class="fa-solid fa-headset"></i><span>${openTickets} ${Lr ? 'طلبات دعم مفتوحة' : 'open support requests'}</span><span class="help-link" onclick="navigateTo('a-tickets')">${Lr ? 'عرض' : 'View'}</span></div>` : ''}
    ${!Store.all('users').some(u => u.role !== 'admin') ? `<div class="card" style="margin-top:14px"><div class="card-head"><span class="card-title">${Lr ? 'قاعدة البيانات فارغة' : 'The database is empty'}</span></div><p style="font-size:13px;color:var(--text-muted);margin-bottom:12px">${Lr ? 'أضف السجلات من القوائم الجانبية، أو حمّل بيانات تجريبية جاهزة (مرضى وأطباء وصيدليات ووصفات) لتجربة المنصة.' : 'Add records from the sections in the menu, or load ready-made sample data (patients, doctors, pharmacies, prescriptions) to try the platform.'}</p><button class="btn-primary-action" onclick="loadSample(this)"><i class="fa-solid fa-database"></i> ${Lr ? 'تحميل البيانات التجريبية' : 'Load sample data'}</button></div>` : ''}`;
}
function pageAdminTickets() {
  const Lr = L();
  const list = Store.all('tickets').sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  $('content').innerHTML = `${pageHead(Lr ? 'طلبات الدعم' : 'Support requests', Lr ? 'بلاغات المستخدمين عن أخطاء في سجلاتهم' : 'Reports users sent about errors in their records')}
    ${!list.length ? emptyState('fa-headset', Lr ? 'لا توجد طلبات' : 'No requests', '') : list.map(x => `<div class="card" style="${x.status === 'closed' ? 'opacity:.6' : ''}">
      <div class="card-head"><div><span class="card-title">${esc(x.userName || '')} <span class="mono" style="font-size:11px;color:var(--text-faint)">${esc(x.userLogin || '')}</span></span><div class="card-meta">${t('role_' + x.role)} · ${fmtDate(x.createdAt, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div></div>
      <span class="badge ${x.status === 'closed' ? 'badge-dispensed' : 'badge-scan'}">${x.status === 'closed' ? (Lr ? 'مغلق' : 'Closed') : (Lr ? 'مفتوح' : 'Open')}</span></div>
      <p style="font-size:13px;white-space:pre-wrap">${esc(x.message)}</p>
      <div style="display:flex;gap:8px;margin-top:12px">${x.status !== 'closed' ? `<button class="btn-ghost" onclick="closeTicket('${esc(x.id)}')"><i class="fa-solid fa-check"></i> ${Lr ? 'إغلاق' : 'Mark closed'}</button>` : ''}<button class="btn-ghost danger" onclick="delTicket('${esc(x.id)}',this)"><i class="fa-solid fa-trash"></i> ${Lr ? 'حذف' : 'Delete'}</button></div>
    </div>`).join('')}`;
}
async function closeTicket(id) { const x = Store.get('tickets', id); if (!x) return; try { await Store.put('tickets', Object.assign({}, x, { status: 'closed' })); pageAdminTickets(); } catch (e) {} }
async function delTicket(id, btn) { if (!btn.dataset.confirm) { btn.dataset.confirm = 1; btn.innerHTML = `<i class="fa-solid fa-check"></i> ${L() ? 'تأكيد الحذف' : 'Confirm delete'}`; return; } try { await Store.del('tickets', id); pageAdminTickets(); } catch (e) {} }

function pageAdminSettings() {
  const Lr = L();
  $('content').innerHTML = `
    ${pageHead(Lr ? 'الإعدادات' : 'Settings', Lr ? 'حساب المدير وقاعدة البيانات' : 'Administrator account and database')}
    <div class="card">
      <div class="card-head"><span class="card-title"><i class="fa-solid fa-key" style="color:var(--forest-500);margin-inline-end:8px"></i>${Lr ? 'بيانات دخول المدير' : 'Administrator sign-in'}</span></div>
      <div class="form-grid-2">
        <div class="form-field"><label class="f-label" for="st-login">${Lr ? 'اسم الدخول' : 'Username'}</label><input class="f-input" id="st-login" dir="ltr" value="${esc(me.login)}"></div>
        <div class="form-field"><label class="f-label" for="st-pw">${Lr ? 'كلمة مرور جديدة' : 'New password'}</label><input class="f-input" id="st-pw" type="password" autocomplete="new-password"></div>
      </div>
      <div style="margin-top:14px"><button class="btn-primary-action" onclick="saveAdminCreds()"><i class="fa-solid fa-floppy-disk"></i> ${Lr ? 'حفظ' : 'Save'}</button></div>
      <div id="st-result"></div>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-title"><i class="fa-solid ${Store.mode === 'local' ? 'fa-hard-drive' : 'fa-cloud'}" style="color:var(--forest-500);margin-inline-end:8px"></i>${Lr ? 'قاعدة البيانات' : 'Database'}</span><span class="badge ${Store.mode === 'local' ? 'badge-scan' : 'badge-verified'}">${modeLabel()}</span></div>
      <p style="font-size:13px;color:var(--text-secondary);line-height:1.7">${Store.mode === 'local'
        ? (Lr ? 'الموقع يعمل الآن بتخزين محلي: كل جهاز يرى بياناته فقط. لتصبح البيانات مشتركة بين كل المستخدمين على الإنترنت، أنشئ مشروعاً مجانياً على Supabase، شغّل ملف supabase.sql، ثم ضع الرابط والمفتاح في TABIB_CONFIG أعلى ملف index.html. التفاصيل في ملف README.' : 'The site is running on local storage: each device sees only its own data. To share data between every user online, create a free Supabase project, run supabase.sql, then put the URL and key in TABIB_CONFIG at the top of index.html. Details are in the README.')
        : (Lr ? 'البيانات محفوظة في قاعدة بيانات سحابية ومتزامنة لحظياً بين كل المستخدمين.' : 'Data is stored in a cloud database and synced live between every user.')}</p>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-title"><i class="fa-solid fa-database" style="color:var(--forest-500);margin-inline-end:8px"></i>${Lr ? 'البيانات' : 'Data'}</span></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-primary-action" onclick="loadSample(this)"><i class="fa-solid fa-flask"></i> ${Lr ? 'تحميل البيانات التجريبية' : 'Load sample data'}</button>
        <button class="btn-secondary-action" onclick="showBackup()"><i class="fa-solid fa-file-export"></i> ${Lr ? 'نسخة احتياطية' : 'Back up (export)'}</button>
        <button class="btn-ghost" onclick="showRestore()"><i class="fa-solid fa-file-import"></i> ${Lr ? 'استرجاع نسخة' : 'Restore (import)'}</button>
        <button class="btn-ghost danger" onclick="wipeAll(this)"><i class="fa-solid fa-trash"></i> ${Lr ? 'حذف كل البيانات' : 'Delete all data'}</button>
      </div>
      <div class="field-hint" style="margin-top:10px"><i class="fa-solid fa-circle-info"></i>${Lr ? 'كل الحسابات التجريبية كلمة مرورها 123456 — مثال: مريض 29801011234567، طبيب MED-2019-00342، صيدلي PH-2021-00891.' : 'Every sample account uses password 123456 — e.g. patient 29801011234567, doctor MED-2019-00342, pharmacist PH-2021-00891.'}</div>
      <div id="data-panel"></div>
    </div>`;
}
async function saveAdminCreds() {
  const Lr = L(), login = normLogin('admin', val('st-login')), pw = $('st-pw').value;
  if (!login) return;
  if (pw && pw.length < 6) { $('st-result').innerHTML = errBox(Lr ? 'كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters'); return; }
  const u = Object.assign({}, me, { login });
  if (pw) await setPassword(u, pw);
  try { me = await Store.put('users', u); renderSidebar(); $('st-result').innerHTML = okBox(Lr ? 'تم الحفظ.' : 'Saved.'); $('st-pw').value = ''; } catch (e) {}
}
async function loadSample(btn) {
  const Lr = L();
  if (!window.TABIB_SEED) return;
  btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${Lr ? 'جارٍ التحميل...' : 'Loading...'}`;
  const s = window.TABIB_SEED();
  try {
    for (const u of s.users) { if (Store.get('users', u.id)) continue; if (Q.userByLogin(u.role, u.login)) continue; await Store.put('users', await setPassword(Object.assign({ createdAt: new Date().toISOString() }, u), u._pw)); }
    for (const col of ['visits', 'rx', 'bookings']) for (const r of s[col]) { if (!Store.get(col, r.id)) await Store.put(col, Object.assign({ createdAt: new Date().toISOString() }, r)); }
    toast('ok', Lr ? 'تم التحميل' : 'Loaded', Lr ? 'تمت إضافة البيانات التجريبية.' : 'Sample data was added.');
    renderPage(activeNav);
  } catch (e) { btn.disabled = false; }
}
function showBackup() {
  const Lr = L();
  const data = JSON.stringify({ app: 'tabib', exportedAt: new Date().toISOString(), data: Store.cache }, null, 1);
  $('data-panel').innerHTML = `<div style="margin-top:14px"><textarea class="f-input mono" id="backup-text" style="min-height:160px;font-size:11px" readonly>${esc(data)}</textarea>
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn-ghost" onclick="copyBackup(this)"><i class="fa-solid fa-copy"></i> ${Lr ? 'نسخ' : 'Copy'}</button><button class="btn-ghost" onclick="downloadBackup()"><i class="fa-solid fa-download"></i> ${Lr ? 'تنزيل ملف' : 'Download file'}</button></div>
    <div class="field-hint">${Lr ? 'احفظ هذا النص في ملف لاسترجاعه لاحقاً.' : 'Keep this text in a file to restore it later.'}</div></div>`;
}
function copyBackup(btn) { const ta = $('backup-text'); try { navigator.clipboard.writeText(ta.value).then(() => btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + (L() ? 'تم النسخ' : 'Copied'), () => { ta.select(); }); } catch (e) { ta.select(); } }
function downloadBackup() { try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([$('backup-text').value], { type: 'application/json' })); a.download = 'tabib-backup-' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) { $('backup-text').select(); } }
function showRestore() {
  const Lr = L();
  $('data-panel').innerHTML = `<div style="margin-top:14px"><textarea class="f-input mono" id="restore-text" style="min-height:140px;font-size:11px" placeholder="${Lr ? 'الصق نص النسخة الاحتياطية هنا' : 'Paste the backup text here'}"></textarea>
    <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;align-items:center"><button class="btn-primary-action" onclick="doRestore(this)"><i class="fa-solid fa-file-import"></i> ${Lr ? 'استرجاع (دمج)' : 'Restore (merge)'}</button><label class="btn-ghost" style="cursor:pointer"><i class="fa-solid fa-folder-open"></i> ${Lr ? 'اختيار ملف' : 'Choose file'}<input type="file" accept=".json,application/json" hidden onchange="readRestoreFile(this)"></label></div><div id="restore-msg"></div></div>`;
}
function readRestoreFile(inp) { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $('restore-text').value = r.result; }; r.readAsText(f); }
async function doRestore(btn) {
  const Lr = L();
  let obj; try { obj = JSON.parse($('restore-text').value); } catch (e) { $('restore-msg').innerHTML = errBox(Lr ? 'النص ليس نسخة احتياطية صالحة.' : 'That text is not a valid backup.'); return; }
  const data = obj.data || obj; btn.disabled = true; let n = 0;
  try { for (const col of COLS) for (const rec of Object.values(data[col] || {})) { if (rec && rec.id) { await Store.put(col, rec); n++; } } $('restore-msg').innerHTML = okBox((Lr ? 'تم استرجاع ' : 'Restored ') + n + (Lr ? ' سجل.' : ' records.')); refreshCurrentUser(); }
  catch (e) { btn.disabled = false; }
}
async function wipeAll(btn) {
  const Lr = L();
  if (!btn.dataset.confirm) { btn.dataset.confirm = '1'; btn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${Lr ? 'اضغط مرة أخرى لحذف كل شيء نهائياً (عدا حساب المدير)' : 'Click again to permanently delete everything (except the admin account)'}`; return; }
  btn.disabled = true;
  try { for (const col of COLS) for (const r of Store.all(col)) { if (col === 'users' && r.role === 'admin') continue; await Store.del(col, r.id); } toast('ok', Lr ? 'تم الحذف' : 'Deleted', Lr ? 'تم مسح قاعدة البيانات.' : 'The database was cleared.'); pageAdminSettings(); } catch (e) { btn.disabled = false; }
}

/* ═══════════════ NOTIFICATIONS ═══════════════ */
function showNotification(icon, iconClass, title, desc, delay = 0) {
  setTimeout(() => {
    const container = $('notif-container'); if (!container) return;
    const id = 'notif-' + Date.now() + Math.random().toString(36).slice(2, 5);
    const div = document.createElement('div');
    div.className = 'notif-toast'; div.id = id; div.setAttribute('role', 'status');
    div.innerHTML = `<div class="notif-icon ${iconClass}"><i class="fa-solid ${icon}"></i></div><div style="flex:1"><div class="notif-title">${title}</div><div class="notif-desc">${desc}</div></div><button class="notif-close" onclick="dismissNotif('${id}')" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>`;
    container.appendChild(div);
    setTimeout(() => dismissNotif(id), 9000);
  }, delay);
}
function dismissNotif(id) { const el = $(id); if (!el) return; el.style.transition = 'opacity 0.3s, transform 0.3s'; el.style.opacity = '0'; el.style.transform = 'translateX(30px)'; setTimeout(() => el.remove(), 350); }
function fireNewUserNotifications() {
  const Lr = L();
  if (role === 'patient') {
    showNotification('fa-file-medical', 'notif-icon-info', Lr ? '📋 ملاحظة حول سجلك الطبي' : '📋 About Your Medical History', Lr ? 'لا يضيف سجلك الطبي إلا طبيب موثق. أدخل رقم ترخيص طبيبك في صفحة الملف الشخصي لتفويضه.' : "Your medical history can only be filled by a verified doctor. Go to My Profile and enter your doctor's license number to authorize them.", 400);
    showNotification('fa-gift', 'notif-icon-gift', Lr ? '🎁 عرض خاص للحجز المتكرر' : '🎁 Loyalty Booking Offer', Lr ? 'احجز مع نفس الطبيب 3 مرات عبر المنصة واحصل على خصم 25% في الزيارة الثالثة تلقائياً!' : 'Book the same doctor 3 times through TABIB and get an automatic 25% discount on your third visit!', 1800);
  } else if (role === 'doctor' || role === 'pharm') {
    showNotification('fa-hourglass-half', 'notif-icon-gift', Lr ? 'تم إنشاء حسابك' : 'Account created', Lr ? 'ترخيصك قيد المراجعة من إدارة المنصة. ستتمكن من الإصدار والصرف بعد التوثيق.' : 'Your license is being reviewed by the platform administrator. Issuing and dispensing unlock after verification.', 400);
  }
}

/* ═══════════════ BOOT ═══════════════ */
(function boot() {
  const saved = ss('tabib_lang'); if (saved === 'ar') setLang('ar');
  // role cards on the landing page open the matching sign-in
  document.querySelectorAll('.role-entry-card').forEach(card => {
    const r = card.classList.contains('rcard-doctor') ? 'doctor' : card.classList.contains('rcard-pharm') ? 'pharm' : 'patient';
    card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => showAuthModal(r));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') showAuthModal(r); });
  });
  // hidden admin entry: click the landing logo 5 times, or open the page with #admin
  let clicks = 0, timer;
  const logo = document.querySelector('.landing-logo');
  if (logo) logo.addEventListener('click', () => { clicks++; clearTimeout(timer); timer = setTimeout(() => clicks = 0, 1500); if (clicks >= 5) { clicks = 0; showAdminLogin(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('auth-modal').classList.contains('hidden')) hideAuthModal(); });
  const checkHash = () => { if (location.hash === '#admin' && !me) showAdminLogin(); };
  window.addEventListener('hashchange', checkHash);

  Store.ready = Store.init().then(() => {
    Store.isReady = true;
    const sid = ss('tabib_session');
    const u = sid && Store.get('users', sid);
    if (u) startSession(u);
    checkHash();
  });
})();
