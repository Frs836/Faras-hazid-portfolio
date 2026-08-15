import { PageContentRow, DbFaq, Language } from '../types';

const LANGS: Language[] = ['en', 'id', 'ja', 'ar'];

/** Build a localized value; id/ja/ar fall back to en so nothing is ever blank. */
const L = (en: string, id = en, ja = en, ar = en) => ({ en, id, ja, ar });

let cursor = 0;
const nextSort = () => cursor++;

/** Single text field row. */
function row(page: string, section: string, field: string, type: string, values: Record<string, string>, sort = 0): PageContentRow {
  return { id: `${page}__${section}__${field}__${sort}`, page, section, field, type, values, sort };
}
function text(page: string, section: string, field: string, en: string, id?: string, ja?: string, ar?: string): PageContentRow {
  return row(page, section, field, 'text', L(en, id, ja, ar) as any, nextSort());
}
function textarea(page: string, section: string, field: string, en: string, id?: string, ja?: string, ar?: string): PageContentRow {
  return row(page, section, field, 'textarea', L(en, id, ja, ar) as any, nextSort());
}
function list(page: string, section: string, field: string, items: string[], idItems?: string[]): PageContentRow[] {
  return items.map((en, i) => {
    const id = idItems?.[i] || en;
    return row(page, section, field, 'list', L(en, id) as any, i);
  });
}

export const SITE_CONTENT_SEED: PageContentRow[] = [
  // ================= HOME =================
  text('home', 'hero', 'badge', 'Open for UI/UX & Graphic Projects', 'Terbuka untuk Proyek UI/UX & Grafis', 'UI/UX・グラフィック案件募集中', 'متاح لمشاريع UI/UX والجرافيك'),
  text('home', 'hero', 'greeting', "Hi, I'm Faras Hazid 👋", 'Halo, saya Faras Hazid 👋', 'こんにちは、ファラス・ハジドです', 'مرحباً، أنا فاراس حازد 👋'),
  text('home', 'hero', 'role', 'UI/UX Designer & Creative Tech Specialist', 'UI/UX Designer & Spesialis Kreatif Teknologi', 'UI/UXデザイナー＆テックスペシャリスト', 'مصمم UI/UX ومتخصص تقني'),
  textarea('home', 'hero', 'bio', 'I craft functional, human-centered UI/UX and brand systems that bridge business goals and user needs.', 'Saya merancang UI/UX yang fungsional dan berpusat pada manusia serta sistem brand yang menjembatani tujuan bisnis dengan kebutuhan pengguna.', '機能的で人を中心としたUI/UXと、ビジネス目標とユーザー体験を結ぶブランドシステムを設計します。', 'أصمم واجهات وتجارب مستخدم إنسانية متقنة وعناصر هوية تربط أهداف الأعمال باحتياجات المستخدم.'),
  text('home', 'hero', 'cta_work', 'View Work', 'Lihat Karya', '作品を見る', 'شاهد الأعمال'),
  text('home', 'hero', 'cta_contact', 'Start a Conversation', 'Mulai Percakapan', '相談を始める', 'ابدأ المحادثة'),

  text('home', 'stats', 'label_project', 'Projects Delivered', 'Proyek Selesai', '納品プロジェクト', 'مشاريع منجزة'),
  text('home', 'stats', 'label_exp', 'Years Experience', 'Tahun Pengalaman', '経験年数', 'سنوات من الخبرة'),
  text('home', 'stats', 'label_sat', 'Client Satisfaction', 'Kepuasan Klien', '顧客満足度', 'رضا العملاء'),
  text('home', 'stats', 'label_awards', 'Design Honors', 'Penghargaan Desain', 'デザイン受賞', 'جوائز التصميم'),
  text('home', 'stats', 'val_project', '45+', '45+', '45以上', '+45'),
  text('home', 'stats', 'val_exp', '4+', '4+', '4年以上', '+4'),
  text('home', 'stats', 'val_sat', '100%', '100%', '100%', '100٪'),
  text('home', 'stats', 'val_awards', '12+', '12+', '12以上', '+12'),

  ...list('home', 'marquee', 'words', [
    'UI/UX Design', 'Brand Identity', 'Graphic Design', 'Web Development', 'Print Layout', 'Social Media',
  ]),

  text('home', 'featured', 'header', 'Selected Works', 'Karya Pilihan', '厳選作品', 'أعمال مختارة'),
  text('home', 'featured', 'sub', 'A curated selection of UI/UX case studies and brand systems.', 'Kurasi kasus studi UI/UX dan sistem merek terbaik.', '厳選したUI/UXケースとブランドデザイン。', 'مجموعة مختارة من حالات UI/UX وأنظمة الهوية.'),
  text('home', 'featured', 'view_all', 'View All Work', 'Lihat Semua', 'すべて見る', 'عرض الكل'),

  text('home', 'trust', 'header', 'Why Work With Me', 'Kenapa Bekerja Dengan Saya', '私との仕事を選ぶ理由', 'لماذا تعمل معي'),
  text('home', 'trust', 'title', "Design that doesn't just look good — it converts.", 'Desain yang bukan hanya terlihat bagus — ia mengonversi.', '見た目だけでなくコンバージョンにつながるデザイン。', 'تصميم لا يبدو جميلاً فقط — بل يحقق تحويلات.'),
  textarea('home', 'trust', 'sub', 'Backed by AI & Robotics background, combining structured logic with precise visual craft.', 'Didukung latar AI & Robotika, menggabungkan logika terstruktur dengan ketelitian visual.', 'AI・ロボット工学の知識を背景に、論理と精密なビジュアルを組み合わせます。', 'بدعم من خلفية في الذكاء الاصطناعي والروبوتات، أجمع بين المنطق وإتقان البصري.'),
  ...list('home', 'trust', 'points', [
    'Human-centered research before pixels',
    'Clean, scalable design systems',
    'On-time delivery with clear communication',
    'Industry tools & modern workflows',
  ]),

  text('home', 'teaser', 'title', 'Get a transparent estimate in 30 seconds', 'Dapatkan estimasi transparan dalam 30 detik', '30秒で透明な見積もりを取得', 'احصل على تقدير شفاف في 30 ثانية'),
  textarea('home', 'teaser', 'desc', 'Pick a service, scope and timeline — see the price in USD & IDR before you reach out.', 'Pilih layanan, skala dan durasi — lihat harga dalam USD & IDR sebelum menghubungi.', 'サービス・規模・期間を選ぶと、USDとIDRで価格がすぐ分かります。', 'اختر الخدمة والنطاق والمدة — وشاهد السعر بالدولار والروبية قبل التواصل.'),
  text('home', 'teaser', 'btn', 'Open estimator', 'Buka Estimator', '見積もりを開く', 'افتح الحاسبة'),

  // ================= ABOUT =================
  text('about', 'hero', 'greeting', "Hi, I'm Faras Hazid 👋", 'Halo, saya Faras Hazid 👋', 'こんにちは、ファラス・ハジドです', 'مرحباً، أنا فراس حازد 👋'),
  text('about', 'hero', 'role', 'Graphic & UI Designer · Focal Hyperspace Creative', 'Graphic & UI Designer · Focal Hyperspace Creative', 'グラフィック&UIデザイナー', 'مصمم جرافيك وUI'),
  textarea('about', 'hero', 'bio_full', 'Multidisciplinary designer with over 4 years crafting UI/UX, brand identity and print media — grounded in a background in AI & Robotics.', 'Desainer multidisiplin dengan 4+ tahun merancang UI/UX, identitas merek, dan media cetak — berpijak pada latar AI & Robotika.', 'UI/UX・ブランド・印刷メディアを4年以上手掛ける。AI・ロボット工学分野の出身。', 'مصمم متعدد التخصصات بخبرة من 4 سنوات في UI/UX والهوية والطباعة.'),
  text('about', 'hero', 'cv_en', 'Download CV (EN)', 'Unduh CV (EN)', 'CVダウンロード（英語）', 'تحميل السيرة (إنجليزي)'),
  text('about', 'hero', 'cv_id', 'Download CV (ID)', 'Unduh CV (ID)', 'CVダウンロード（印尼）', 'تحميل السيرة (إندونيسي)'),

  text('about', 'skills', 'design_title', 'Design Skills', 'Kemampuan Desain', 'デザインスキル', 'مهارات التصميم'),
  text('about', 'skills', 'personal_title', 'Core Ways of Working', 'Cara Bekerja Saya', '働き方', 'أسلوب العمل'),
  ...list('about', 'skills', 'design_list', [
    'Branding', 'Layouting', 'Mobile App & Web Design', 'Social Media Content', 'Logo Design', 'Thumbnail Design',
  ]),
  ...list('about', 'skills', 'personal_list', [
    'Time Management', 'Creative Thinking', 'Team Work', 'Problem Solving', 'Communication', 'Responsibility',
  ]),

  text('about', 'work', 'title', 'Experience', 'Pengalaman Kerja', '職歴', 'الخبرة'),
  text('about', 'work', 'sub', 'Professional career history', 'Riwayat karir profesional', 'プロフェッショナルな経歴', 'السيرة المهنية'),
  text('about', 'edu', 'title', 'Education', 'Pendidikan', '学歴', 'التعليم'),
  text('about', 'tools', 'title', 'Tools & Capabilities', 'Tools & Keahlian', 'ツールとスキル', 'الأدوات والقدرات'),
  text('about', 'tools', 'sub', 'Software and proficiency levels.', 'Perangkat lunak dan tingkat kemahiran.', 'ソフトウェアと習熟度。', 'البرامج ومستويات الإتقان.'),

  // ================= PORTFOLIO =================
  text('portfolio', 'hero', 'title', 'Work & Case Studies', 'Karya & Studi Kasus', '制作実績', 'الأعمال ودراسات الحالة'),
  textarea('portfolio', 'hero', 'subtitle', 'A curated archive of UI/UX, brand, and print projects.', 'Arsip kurasi proyek UI/UX, brand, dan cetakan.', 'UI/UX・ブランド・印刷の厳選アーカイブ。', 'أرشيف مختار من مشاريع UI/UX والهوية والطباعة.'),
  text('portfolio', 'filters', 'all', 'All', 'Semua', 'すべて', 'الكل'),
  text('portfolio', 'filters', 'search', 'Search projects…', 'Cari proyek…', 'プロジェクトを検索…', 'ابدأ البحث…'),
  text('portfolio', 'modal', 'view_case', 'View Case Study', 'Lihat Studi Kasus', 'ケースを見る', 'عرض الحالة'),
  text('portfolio', 'modal', 'close', 'Close', 'Tutup', '閉じる', 'إغلاق'),
  text('portfolio', 'modal', 'client', 'Client', 'Klien', 'クライアント', 'العميل'),
  text('portfolio', 'modal', 'year', 'Year', 'Tahun', '年', 'السنة'),
  text('portfolio', 'modal', 'role', 'Role', 'Peran', '役割', 'الدور'),
  text('portfolio', 'modal', 'problem', 'Problem', 'Masalah', '課題', 'المشكلة'),
  text('portfolio', 'modal', 'process', 'Process', 'Proses', '工程', 'العملية'),
  text('portfolio', 'modal', 'solution', 'Solution', 'Solusi', '解決策', 'الحل'),
  text('portfolio', 'modal', 'results', 'Results', 'Hasil', '成果', 'النتائج'),
  text('portfolio', 'modal', 'tools', 'Tools', 'Tools', 'ツール', 'الأدوات'),

  // ================= SERVICES =================
  text('services', 'hero', 'title', 'Services & Pricing', 'Layanan & Harga', 'サービスと料金', 'الخدمات والأسعار'),
  textarea('services', 'hero', 'subtitle', 'Clear design services with transparent pricing and a 30-second estimator.', 'Layanan desain jelas dengan harga transparan dan alat estimasi 30 detik.', '明確なデザインサービスと、30秒で分かる透明な料金。', 'خدمات تصميم واضحة بأسعار شفافية وحاسبة 30 ثانية.'),
  text('services', 'offer', 'title', 'What I Do', 'Yang Saya Kerjakan', '得意分野', 'خدماتي'),
  text('services', 'offer', 'deliverables', 'Deliverables', 'Isi Paket', '成果物', 'التسليمات'),
  text('services', 'pricing', 'title', 'Packages & Pricing', 'Paket & Harga', 'パッケージと料金', 'الباقات والأسعار'),
  textarea('services', 'pricing', 'sub', 'Fixed scope, fixed price. USD & IDR, no surprises.', 'Lingkup dan harga tetap. USD & IDR, tanpa kejutan.', '固定の範囲と料金。USD&IDR。', 'نطاق وسعر ثابت.'),
  text('services', 'pricing', 'included', 'Included Features', 'Fitur Termasuk', '含まれる機能', 'الميزات المشمولة'),
  text('services', 'pricing', 'delivery', 'Delivery', 'Pengerjaan', '納期', 'التسليم'),
  text('services', 'pricing', 'order', 'Order Package', 'Pesan Paket', '注文する', 'اطلب الباقة'),
  text('services', 'pricing', 'popular', 'Popular', 'Populer', '人気', 'الأكثر طلبا'),
  text('services', 'why', 'title', 'Why Choose Me', 'Kenapa Memilih Saya', '私を選ぶ理由', 'لماذا تختارني'),
  text('services', 'faq', 'title', 'Frequently Asked Questions', 'Pertanyaan Umum', 'よくある質問', 'أسئلة شائعة'),
  textarea('services', 'faq', 'sub', "Everything you'd want to know before starting.", 'Semua yang perlu kamu tahu sebelum mulai.', '始める前に知っておきたいこと。', 'كل ما تحتاج معرفته قبل البدء.'),
  text('services', 'cta', 'btn', 'Start a project', 'Mulai Proyek', 'プロジェクト開始', 'ابدأ مشروعا'),

  // ================= CONTACT =================
  text('contact', 'hero', 'title', "Let's Work Together", 'Mari Bekerja Bersama', '一緒に仕事しよう', 'لنعمل معاً'),
  textarea('contact', 'hero', 'subtitle', "Tell me about your project — I'll reply within 24h.", 'Ceritakan proyekmu — saya balas dalam 24 jam.', 'プロジェクトを教えてください。24時間以内にお返事します。', 'أخبرني عن مشروعك وسأرد خلال 24 ساعة.'),
  text('contact', 'form', 'title', 'Send a Message', 'Kirim Pesan', 'メッセージを送る', 'أرسل رسالة'),
  text('contact', 'form', 'name', 'Name', 'Nama', 'お名前', 'الاسم'),
  text('contact', 'form', 'email', 'Email', 'Email', 'メール', 'البريد'),
  text('contact', 'form', 'service', 'Service Interest', 'Layanan yang Diminati', '関心サービス', 'الخدمة المطلوبة'),
  text('contact', 'form', 'budget', 'Budget', 'Budget', '予算', 'الميزانية'),
  text('contact', 'form', 'message', 'Message', 'Pesan', 'メッセージ', 'الرسالة'),
  text('contact', 'form', 'send', 'Send Message', 'Kirim', '送信', 'إرسال'),
  text('contact', 'form', 'send_wa', 'Send via WhatsApp', 'Kirim via WhatsApp', 'WhatsAppで送る', 'إرسال عبر واتساب'),
  text('contact', 'info', 'direct', 'Direct Contact', 'Kontak Langsung', 'ダイレクト連絡', 'التواصل المباشر'),
  text('contact', 'info', 'socials', 'Socials', 'Media Sosial', 'SNS', 'السوشيال ميديا'),

  // ================= FOOTER =================
  text('footer', 'cta', 'title', 'Have an idea worth building?', 'Punya ide yang layak dibangun?', '実現したいアイデアはありますか？', 'لديك فكرة تستحق التقدير؟'),
  text('footer', 'cta', 'btn', "Let's talk", 'Mari bicara', '相談する', 'لنتحدث'),
  text('footer', 'lt', 'menu', 'Menu', 'Menu', 'メニュー', 'القائمة'),
  text('footer', 'lt', 'connect', 'Connect', 'Terhubung', 'つながる', 'تواصل'),
  text('footer', 'lt', 'status', 'Status', 'Status', 'ステータス', 'الحالة'),
  textarea('footer', 'brand', 'description', 'Focal Hyperspace Creative — the personal brand of Faras Hazid, delivering UI/UX, brand identity, and print that converts.', 'Focal Hyperspace Creative — personal branding Faras Hazid, menghadirkan UI/UX, identitas merek, dan desain cetak.', 'Focal Hyperspace Creative — ファラス・ハジドのパーソナルブランド。', 'Focal Hyperspace Creative — العلامة الشخصية لفراس حازد.'),
  text('footer', 'brand', 'status', 'Open for freelance & remote contracts', 'Terbuka untuk freelance & kontrak remote', 'フリーランス・リモート歓迎', 'متاح للمشروعات الحرة والبعانية'),
  text('footer', 'brand', 'copyright', '© 2026 FARAS HAZID — Focal Hyperspace Creative', '© 2026 FARAS HAZID — Focal Hyperspace Creative', '© 2026 FARAS HAZID — Focal Hyperspace Creative', '© 2026 فراس حازد — Focal Hyperspace Creative'),
  ...list('footer', 'brand', 'marquee', ['UI/UX Design', 'Brand Identity', 'Graphic Design', 'Web Development', 'Print Layout', 'Social Media', 'Motion']),

  // ================= EDITORIAL — visible labels/eyebrows/static copy (DB > i18n fallback) =================
  // Home
  text('home', 'hero', 'loc_a', 'Based in Indonesia', 'Berbasis di Indonesia', 'インドネシア拠点', 'مقيم في إندونيسيا'),
  text('home', 'hero', 'loc_b', 'Working worldwide', 'Bekerja di seluruh dunia', '世界中で活動中', 'أعمل حول العالم'),
  // About
  text('about', 'header', 'eyebrow', 'About', 'Tentang', '私について', 'عني'),
  text('about', 'header', 'design', '01 — Design', '01 — Desain', '01 — デザイン', '01 — تصميم'),
  text('about', 'header', 'personal', '02 — Personal', '02 — Personal', '02 — パーソナル', '02 — شخصي'),
  text('about', 'header', 'experience', 'Experience', 'Pengalaman', '経歴', 'الخبرات'),
  text('about', 'header', 'education', 'Education', 'Pendidikan', '学歴', 'التعليم'),
  text('about', 'header', 'capabilities', 'Capabilities', 'Kemampuan', 'スキル', 'القدرات'),
  text('about', 'tools', 'sub', 'Design software, frameworks, and the craft behind the work.', 'Software desain, framework, dan keahlian di balik karya.', '作品の背景にあるデザインツールとスキル。', 'أدوات التصميم والخبرات خلف الأعمال.'),
  // Portfolio
  text('portfolio', 'header', 'eyebrow', 'Portfolio', 'Portofolio', '作品集', 'معرض الأعمال'),
  text('portfolio', 'empty', 'title', 'No projects found matching your criteria.', 'Tidak ada proyek yang cocok dengan kriteria Anda.', '条件に一致するプロジェクトが見つかりません。', 'لا توجد مشاريع تطابق معاييرك.'),
  text('portfolio', 'empty', 'reset', 'Reset Filters', 'Reset Filter', 'フィルターをリセット', 'إعادة تعيين الفلاتر'),
  // Services
  text('services', 'header', 'eyebrow', 'Services', 'Layanan', 'サービス', 'الخدمات'),
  text('services', 'offer', 'eyebrow', '01 — What I do', '01 — Yang saya kerjakan', '01 — 提供サービス', '01 — خدماتي'),
  text('services', 'pricing', 'eyebrow', '02 — Pricing', '02 — Harga', '02 — 料金', '02 — الأسعار'),
  text('services', 'pricing', 'title', 'Transparent Packages', 'Paket Transparan', '明確なパッケージ', 'باقات شفافة'),
  text('services', 'pricing', 'sub', 'Fixed packages in USD & IDR — every deliverable listed upfront.', 'Paket tetap dalam USD & IDR — semua deliverable tercantum di awal.', 'USD・IDR表示の固定プラン。納品物も明記。', 'باقات ثابتة بالدولار والروبية — كل شيء موضح مسبقاً.'),
  text('services', 'est', 'eyebrow', '03 — Estimator', '03 — Estimator', '03 — 見積もり', '03 — الحاسبة'),
  text('services', 'est', 'title', 'Transparent cost estimator', 'Estimator biaya transparan', '透明な費用見積もり', 'حاسبة تكلفة شفافة'),
  text('services', 'est', 'sub', 'Pick a service, scope, and timeline — see USD & IDR before reaching out.', 'Pilih layanan, skala, dan durasi — lihat USD & IDR sebelum menghubungi.', 'サービス・規模・期間を選ぶと、先にUSDとIDRが分かります。', 'اختر الخدمة والنطاق والمدة — لترى التكلفة قبل التواصل.'),
  text('services', 'why', 'eyebrow', '04 — Why me', '04 — Kenapa saya', '04 — 選ばれる理由', '04 — لماذا أنا'),
  text('services', 'faq', 'eyebrow', '05 — FAQ', '05 — FAQ', '05 — よくある質問', '05 — الأسئلة الشائعة'),
  text('services', 'cta', 'kicker', 'Have a project in mind?', 'Punya proyek dalam pikiran?', 'プロジェクトのご相談はありますか？', 'هل لديك مشروع في ذهنك؟'),
  text('services', 'cta', 'title', "Let's make something unforgettable.", 'Mari ciptakan sesuatu yang berkesan.', '忘れられないものを作りましょう。', 'لنصنع شيئاً لا يُنسى.'),
  text('services', 'cta', 'btn', 'Start a project', 'Mulai Proyek', 'プロジェクトを開始', 'ابدأ مشروع'),
  // Contact
  text('contact', 'header', 'eyebrow', 'Contact', 'Kontak', 'お問い合わせ', 'تواصل'),
  text('contact', 'info', 'location', 'Indonesia (UTC+7)', 'Indonesia (UTC+7)', 'インドネシア (UTC+7)', 'إندونيسيا (UTC+7)'),
  text('contact', 'info', 'hours', 'Mon - Sat: 08:00 - 18:00 WIB', 'Senin - Sabtu: 08:00 - 18:00 WIB', '月-土: 8:00-18:00 WIB', 'الإثنين - السبت: 08:00 - 18:00 بتوقيت إندونيسيا'),
];

export const FAQ_SEED: DbFaq[] = [
  {
    id: 'faq-1',
    sort: 0,
    question: L('How quickly can you deliver?', 'Seberapa cepat kamu mengerjakan?') as any,
    answer: L('Most projects ship in 3-10 working days depending on scope.', 'Mayoritas proyek selesai dalam 3-10 hari kerja tergantung skala.') as any,
  },
  {
    id: 'faq-2',
    sort: 1,
    question: L('Do you work with international clients?', 'Bekerja dengan klien internasional?') as any,
    answer: L('Yes — remote-first, working across time zones Asia-Pacific and beyond.', 'Ya — remote, bekerja lintas zona waktu Asia-Pasifik.') as any,
  },
  {
    id: 'faq-3',
    sort: 2,
    question: L('What files do I receive at the end?', 'File apa yang saya dapatkan?') as any,
    answer: L('You get source files (Figma/AI), final exports, plus a style handoff.', 'Anda dapat file source (Figma/AI), hasil export, plus dokumentasi.') as any,
  },
];

// Normalize: ensure all 4 languages present (fallback chain en->id->ja->ar)
function normalize(v: any) {
  const o: any = {};
  for (const lang of LANGS) {
    o[lang] = v && v[lang] != null && v[lang] !== '' ? v[lang] : (o.en ?? v?.en ?? '');
  }
  return o;
}
SITE_CONTENT_SEED.forEach((r) => (r.values = normalize(r.values)));