/* TABIB — sample data used by Admin › Settings › "Load sample data".
   Every sample account uses the password 123456. */
(function (root) {
  function day(offset) {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }

  function buildSeed() {
    const users = [];
    const P = (o) => users.push(Object.assign({ role: 'patient', verified: true, _pw: '123456' }, o));
    const D = (o) => users.push(Object.assign({ role: 'doctor', verified: true, _pw: '123456' }, o));
    const R = (o) => users.push(Object.assign({ role: 'pharm', verified: true, _pw: '123456' }, o));

    P({ id: 'p1', login: '29801011234567', name: 'Ahmed Mostafa Ibrahim', nameAr: 'أحمد مصطفى إبراهيم', phone: '+20 10 1234 5678', dob: '1998-01-01', blood: 'B+', gov: 'Cairo', allergies: 'Penicillin, Amoxicillin, Ampicillin, Sulfa', chronicMeds: 'Aspirin 81mg' });
    P({ id: 'p2', login: '30105051234561', name: 'Sara Khalil', nameAr: 'سارة خليل', phone: '+20 11 2233 4455', dob: '2001-05-05', blood: 'A+', gov: 'Giza', allergies: '', chronicMeds: 'Metformin 500mg' });
    P({ id: 'p3', login: '29507141234562', name: 'Mahmoud Adel', nameAr: 'محمود عادل', phone: '+20 12 9988 7766', dob: '1995-07-14', blood: 'O-', gov: 'Alexandria', allergies: 'Ibuprofen', chronicMeds: 'Salbutamol inhaler' });

    D({ id: 'd1', login: 'MED-2019-00342', name: 'Dr. Layla Hassan', nameAr: 'د. ليلى حسن', dept: 'internal', specialty: 'Consultant — Internal Medicine', specialtyAr: 'استشاري طب باطني', hospital: 'Tabib Medical Center, Cairo', hospitalAr: 'مركز طبيب الطبي، القاهرة', address: '12 Al-Tahrir St, Dokki, Giza', addressAr: '12 شارع التحرير، الدقي، الجيزة', phone: '+20 2 3748 1200', exp: '14', rating: '4.9', slots: '9:00 AM, 9:30 AM, 10:30 AM, 11:00 AM, 2:00 PM, 2:30 PM, 3:30 PM' });
    D({ id: 'd2', login: 'MED-2016-00118', name: 'Dr. Khalid Nour', nameAr: 'د. خالد نور', dept: 'internal', specialty: 'Senior Specialist — Internal Medicine', specialtyAr: 'أخصائي أول طب باطني', hospital: 'Cairo Heart Center', hospitalAr: 'مركز القلب بالقاهرة', address: '5 Corniche El-Nil, Maadi, Cairo', addressAr: '5 كورنيش النيل، المعادي، القاهرة', phone: '+20 2 2516 3300', exp: '9', rating: '4.7', slots: '10:00 AM, 10:30 AM, 11:30 AM, 4:00 PM, 4:30 PM' });
    D({ id: 'd3', login: 'MED-2014-00560', name: 'Dr. Samira Fadl', nameAr: 'د. سميرة فضل', dept: 'internal', specialty: 'Specialist — Internal Medicine & Endocrinology', specialtyAr: 'أخصائية طب باطني وغدد', hospital: 'Al-Salam Hospital, Alexandria', hospitalAr: 'مستشفى السلام، الإسكندرية', address: '88 Mostafa Kamel St, Alexandria', addressAr: '88 شارع مصطفى كامل، الإسكندرية', phone: '+20 3 4862 5500', exp: '11', rating: '4.8', slots: '9:00 AM, 11:00 AM, 12:00 PM, 5:00 PM, 5:30 PM' });
    D({ id: 'd4', login: 'MED-2007-00071', name: 'Dr. Tarek Mansour', nameAr: 'د. طارق منصور', dept: 'surgery', specialty: 'Consultant — General & Laparoscopic Surgery', specialtyAr: 'استشاري جراحة عامة وتنظير', hospital: 'Dar Al-Fouad Hospital, Cairo', hospitalAr: 'مستشفى دار الفؤاد، القاهرة', address: '26 July St, Mohandessin, Giza', addressAr: 'شارع 26 يوليو، المهندسين، الجيزة', phone: '+20 2 3346 0000', exp: '18', rating: '4.9', slots: '8:00 AM, 8:30 AM, 10:00 AM, 12:00 PM, 3:00 PM' });
    D({ id: 'd6', login: 'MED-2009-00233', name: 'Dr. Noha Abdel-Aziz', nameAr: 'د. نهى عبد العزيز', dept: 'peds', specialty: 'Consultant Pediatrician & Neonatologist', specialtyAr: 'استشارية أطفال وحديثي الولادة', hospital: "Children's Hospital, Ain Shams", hospitalAr: 'مستشفى الأطفال، عين شمس', address: 'El-Abbasia, Cairo', addressAr: 'العباسية، القاهرة', phone: '+20 2 2482 5500', exp: '16', rating: '5.0', slots: '10:00 AM, 10:30 AM, 11:00 AM, 4:00 PM, 4:30 PM, 5:00 PM' });
    D({ id: 'd8', login: 'MED-2005-00012', name: 'Dr. Rania El-Sayed', nameAr: 'د. رانيا السيد', dept: 'obgyn', specialty: 'Consultant — OB/GYN', specialtyAr: 'استشارية نساء وتوليد', hospital: 'Al-Galaa Teaching Hospital', hospitalAr: 'مستشفى الجلاء التعليمي', address: 'Bab El-Khalq, Cairo', addressAr: 'باب الخلق، القاهرة', phone: '+20 2 2591 3500', exp: '20', rating: '4.9', slots: '9:00 AM, 9:30 AM, 10:00 AM, 3:00 PM, 3:30 PM' });
    D({ id: 'd9', login: 'MED-2010-00415', name: 'Dr. Mostafa Gamal', nameAr: 'د. مصطفى جمال', dept: 'eye', specialty: 'Consultant — Cornea & Refractive Surgery', specialtyAr: 'استشاري قرنية وجراحة انكسار', hospital: 'Maghrabi Eye Hospital, Cairo', hospitalAr: 'مستشفى المغربي للعيون، القاهرة', address: '14 El-Batal Ahmed Abd El-Aziz St, Mohandessin', addressAr: '14 شارع البطل أحمد عبد العزيز، المهندسين', phone: '+20 2 3303 4000', exp: '15', rating: '4.9', slots: '10:00 AM, 10:30 AM, 11:30 AM, 2:30 PM, 3:00 PM' });
    D({ id: 'd11', login: 'MED-2008-00190', name: 'Dr. Youssef Kamel', nameAr: 'د. يوسف كامل', dept: 'ortho', specialty: 'Consultant Orthopedic & Spine Surgery', specialtyAr: 'استشاري جراحة العظام والعمود الفقري', hospital: 'Cleopatra Hospital, Cairo', hospitalAr: 'مستشفى كليوباترا، القاهرة', address: '87 Cleopatra St, Heliopolis', addressAr: '87 شارع كليوباترا، مصر الجديدة', phone: '+20 2 2414 4000', exp: '17', rating: '4.8', slots: '9:00 AM, 10:00 AM, 12:00 PM, 5:00 PM, 5:30 PM' });
    D({ id: 'd14', login: 'MED-2015-00702', name: 'Dr. Amr Badawi', nameAr: 'د. عمرو بدوي', dept: 'chest', specialty: 'Consultant Pulmonologist', specialtyAr: 'استشاري أمراض الصدر', hospital: 'Abbasia Chest Hospital', hospitalAr: 'مستشفى العباسية للصدر', address: 'Abbasia, Cairo', addressAr: 'العباسية، القاهرة', phone: '+20 2 2482 7700', exp: '10', rating: '4.7', slots: '9:00 AM, 9:30 AM, 11:00 AM, 3:00 PM, 3:30 PM, 5:00 PM' });

    R({ id: 'ph1', login: 'PH-2021-00891', name: 'Omar Fathy', nameAr: 'عمر فتحي', pharmacyName: 'Al-Shifa Pharmacy', pharmacyNameAr: 'صيدلية الشفاء', address: '14 Tahrir Square, Dokki, Giza', addressAr: '14 ميدان التحرير، الدقي، الجيزة', phone: '+20 2 3761 4400', hours: 'Open 24/7', hoursAr: 'مفتوح 24 ساعة' });
    R({ id: 'ph2', login: 'PH-2020-00445', name: 'Sara Kamel', nameAr: 'سارة كامل', pharmacyName: 'Life Care Pharmacy', pharmacyNameAr: 'صيدلية لايف كير', address: '7 Mohamed Farid St, Downtown Cairo', addressAr: '7 شارع محمد فريد، وسط البلد', phone: '+20 2 2393 5500', hours: '8:00 AM – 11:00 PM', hoursAr: '8 صباحاً – 11 مساءً' });
    R({ id: 'ph3', login: 'PH-2022-01123', name: 'Hany Mostafa', nameAr: 'هاني مصطفى', pharmacyName: 'Sehha Pharmacy', pharmacyNameAr: 'صيدلية صحة', address: '32 Nasr City Ring Road, Cairo', addressAr: '32 طريق مدينة نصر الدائري، القاهرة', phone: '+20 2 2404 8800', hours: '9:00 AM – 10:00 PM', hoursAr: '9 صباحاً – 10 مساءً' });
    R({ id: 'ph4', login: 'PH-2023-00677', name: 'Dina Salah', nameAr: 'دينا صلاح', pharmacyName: 'Dawaa Pharmacy', pharmacyNameAr: 'صيدلية دواء', address: '18 Alexandria Desert Road, Giza', addressAr: '18 طريق الإسكندرية الصحراوي، الجيزة', phone: '+20 2 3578 9900', hours: '8:00 AM – Midnight', hoursAr: '8 صباحاً – منتصف الليل', verified: false });

    const visits = [
      { id: 'v1', patientId: '29801011234567', doctorId: 'd2', date: day(-45), specialty: 'Cardiology consult', diagnosis: 'Hypertension stage 1', bp: '148/94 mmHg', followUp: 'In 3 months', notes: 'Strong family history of cardiovascular disease. Avoid NSAIDs. No beta-blockers without ECG baseline first.' },
      { id: 'v2', patientId: '29801011234567', doctorId: 'd1', date: day(-110), specialty: 'General practice visit', diagnosis: 'Upper respiratory infection', bp: '', followUp: 'None required', notes: 'Treated with Azithromycin 500mg — avoid Amoxicillin (penicillin allergy confirmed).' },
      { id: 'v3', patientId: '30105051234561', doctorId: 'd1', date: day(-20), specialty: 'Internal Medicine', diagnosis: 'Type 2 Diabetes', bp: '126/82 mmHg', followUp: 'HbA1c in 3 months', notes: 'Continue Metformin. Diet counselling given.' },
      { id: 'v4', patientId: '29507141234562', doctorId: 'd14', date: day(-60), specialty: 'Chest Disease', diagnosis: 'Asthma', bp: '', followUp: 'As needed', notes: 'Ibuprofen intolerance reported. Use Paracetamol for pain.' }
    ];

    const rx = [
      { id: 'r1', num: '2026-0001', code: 'K7Q2MX', patientId: '29801011234567', doctorId: 'd1', issued: day(-10), expires: day(80), meds: 'Amlodipine 5mg — 1 tab daily — 30 tabs\nLosartan 50mg — 1 tab daily — 30 tabs', notes: 'Hypertension follow-up.', dispensedMeds: [] },
      { id: 'r2', num: '2026-0002', code: 'P3ZT8C', patientId: '29801011234567', doctorId: 'd1', issued: day(-110), expires: day(-20), meds: 'Azithromycin 500mg — 1 tab daily × 5 days\nParacetamol 500mg — as needed', notes: '', dispensedMeds: [0, 1], dispensedAt: day(-108), dispensedBy: 'ph1', pharmNote: 'Azithromycin dispensed as generic equivalent. Patient counselled on dosing.' },
      { id: 'r3', num: '2026-0003', code: 'W9HD4N', patientId: '29801011234567', doctorId: 'd2', issued: day(-300), expires: day(-210), meds: 'Vitamin D3 1000IU — 1 tab daily', notes: '', dispensedMeds: [] },
      { id: 'r4', num: '2026-0004', code: 'B6RJ2F', patientId: '30105051234561', doctorId: 'd1', issued: day(-20), expires: day(70), meds: 'Metformin 500mg — 1 tab twice daily — 60 tabs', notes: '', dispensedMeds: [] }
    ];

    const bookings = [
      { id: 'b1', patientId: '29801011234567', doctorId: 'd1', date: day(3), slot: '10:30 AM', status: 'booked', createdAt: new Date().toISOString() }
    ];

    return { users, visits, rx, bookings };
  }

  root.TABIB_SEED = buildSeed;
  if (typeof module !== 'undefined') module.exports = buildSeed;
})(typeof window !== 'undefined' ? window : globalThis);
