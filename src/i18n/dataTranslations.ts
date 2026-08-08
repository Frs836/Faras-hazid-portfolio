import { Language, Project, PricingPackage, ServiceOffering, ExperienceItem } from '../types';

// Map of translations for projects by project ID and language
export const projectTranslations: Record<
  string,
  Record<
    Language,
    {
      title: string;
      subtitle: string;
      summary: string;
      role: string;
      problemStatement: string;
      workflowSteps: { title: string; description: string }[];
      solution: string;
      results: string[];
    }
  >
> = {
  'proj-1': {
    en: {
      title: 'EluckyGame App Mobile & Web Platform',
      subtitle: 'Game E-Commerce & Interactive Rewards UI/UX',
      summary: 'End-to-end mobile app and web portal design for Indonesia’s first Game E-commerce application featuring interactive rewards, wireframes, and Figma prototypes.',
      role: 'UI/UX Designer',
      problemStatement: 'E-commerce users experienced friction during multi-step game token transactions and reward redemption flows.',
      workflowSteps: [
        {
          title: '1. Wireframing & Information Architecture',
          description: 'Constructed low-fidelity and high-fidelity wireframes in Figma to structure gaming rewards, daily tasks, and checkout steps.',
        },
        {
          title: '2. UX Optimization & Convenience',
          description: 'Simplified navigation hierarchy to reduce transaction clicks by 35% and enhanced mobile responsiveness across web/app viewports.',
        },
        {
          title: '3. Developer Technical Synergy',
          description: 'Collaborated closely with engineering teams to ensure pixel-perfect design implementation and smooth micro-interactions.',
        },
      ],
      solution: 'Created an engaging, vibrant game-centric e-commerce experience with interactive reward redemption cards and high-conversion UI flows.',
      results: [
        '+45% User Retention Rate',
        'Improved transaction flow convenience',
        'Seamless mobile & desktop web synchronization',
      ],
    },
    id: {
      title: 'Aplikasi Mobile & Platform Web EluckyGame',
      subtitle: 'E-Commerce Game & UI/UX Imbalan Interaktif',
      summary: 'Desain menyeluruh aplikasi mobile dan portal web e-commerce game pertama di Indonesia dengan sistem imbalan interaktif, wireframe, dan prototipe Figma.',
      role: 'Desainer UI/UX',
      problemStatement: 'Pengguna e-commerce mengalami hambatan alur saat melakukan transaksi koin game multi-langkah dan penukaran imbalan.',
      workflowSteps: [
        {
          title: '1. Wireframing & Arsitektur Informasi',
          description: 'Membuat wireframe low-fidelity dan high-fidelity di Figma untuk menyusun struktur imbalan game, tugas harian, dan alur pembayaran.',
        },
        {
          title: '2. Optimasi UX & Kemudahan Transaksi',
          description: 'Menyederhanakan hierarki navigasi untuk mengurangi klik transaksi hingga 35% serta mengoptimalkan responsivitas seluler.',
        },
        {
          title: '3. Sinergi Teknis Tim Pengembang',
          description: 'Bekerja sama erat dengan tim developer untuk memastikan implementasi desain yang presisi dan mikro-interaksi yang mulus.',
        },
      ],
      solution: 'Menciptakan pengalaman e-commerce bertema game yang menarik dengan kartu penukaran imbalan interaktif dan alur UI berkonversi tinggi.',
      results: [
        '+45% Tingkat Retensi Pengguna',
        'Kemudahan alur transaksi yang jauh lebih cepat',
        'Sinkronisasi mulus antara web desktop dan aplikasi seluler',
      ],
    },
    ja: {
      title: 'EluckyGame モバイルアプリ＆Webプラットフォーム',
      subtitle: 'ゲームEコマース＆インタラクティブ特典UI/UX',
      summary: 'インドネシア初のゲームEコマースアプリ向けのモバイルアプリおよびWebポータルのエンドツーエンドデザイン。ワイヤーフレームとFigmaプロトタイプを構築。',
      role: 'UI/UXデザイナー',
      problemStatement: 'Eコマースユーザーがゲームトークンの購入や特典交換の際に複数ステップで離脱する課題がありました。',
      workflowSteps: [
        {
          title: '1. ワイヤーフレーム＆情報アーキテクチャ',
          description: 'Figmaでローファイおよびハイファイワイヤーフレームを作成し、ゲーム特典や決済手順を整理。',
        },
        {
          title: '2. UX最適化＆利便性向上',
          description: 'ナビゲーション構造を簡素化し、決済クリック数を35%削減してレスポンシブ対応を強化。',
        },
        {
          title: '3. 開発チームとの完全連携',
          description: 'エンジニアリングチームと緊密に連携し、ピクセルパーフェクトな実装とスムーズなアニメーションを実現。',
        },
      ],
      solution: 'ゲームに特化した魅力的なEコマース体験と、高いコンバージョン率を誇るUIフローを構築しました。',
      results: [
        'ユーザー保持率 +45% 向上',
        '取引フローの劇的な高速化と簡素化',
        'モバイルとデスクトップWebのシームレスな同期',
      ],
    },
    ar: {
      title: 'تطبيق EluckyGame للهاتف ومنصة الويب',
      subtitle: 'متجر الألعاب والتكافؤ التفاعلي UI/UX',
      summary: 'تصميم متكامل لتطبيق الهاتف وبوابة الويب لأول متجر ألعاب إلكترونية في إندونيسيا يتميز بمكافآت تفاعلية وهياكل سلكية ونماذج Figma.',
      role: 'مصمم UI/UX',
      problemStatement: 'واجه مستخدمو التجارة الإلكترونية عقبات أثناء معاملات شراء العملات وتداول المكافآت متعددة الخطوات.',
      workflowSteps: [
        {
          title: '1. الهياكل السلكية وهندسة المعلومات',
          description: 'بناء هياكل سلكية منخفضة وعالية الدقة في Figma لتنظيم مكافآت الألعاب وخطوات الدفع.',
        },
        {
          title: '2. تحسين تجربة المستخدم وسهولة الاستخدام',
          description: 'تبسيط التنقل لتقليل نقرات المعاملات بنسبة 35٪ وتعزيز الاستجابة للهواتف المحمولة.',
        },
        {
          title: '3. التعاون التقني مع المطورين',
          description: 'العمل عن كثب مع فرق الهندسة لضمان تنفيذ التصميم بدقة عالية وتفاعلات سلسة.',
        },
      ],
      solution: 'إنشاء تجربة تسوق إلكترونية ممتعة مخصصة للألعاب مع بطاقات مكافآت تفاعلية وتدفقات واجهة مستخدم عالية التحويل.',
      results: [
        'زيادة نسبة الاحتفاظ بالمستخدمين بنسبة +45٪',
        'تحسين سهولة وسرعة المعاملات',
        'مزامنة سلسة بين الويب والتطبيق',
      ],
    },
  },
  'proj-2': {
    en: {
      title: 'Website Masjid Nurul Musthofa Center',
      subtitle: 'Mosque Digital Portal & Community Information Web System',
      summary: 'Comprehensive web design portal for Masjid Nurul Musthofa Center featuring video hero section, event schedules, donation channels, and congregation updates.',
      role: 'Media & Branding Lead / UI Designer',
      problemStatement: 'The congregation lacked a centralized digital platform to check upcoming Islamic events, prayer schedules, and official donation records.',
      workflowSteps: [
        {
          title: '1. Brand Modernization & Visual Standards',
          description: 'Modernized the mosque’s visual identity with clean Islamic geometric motifs and soft blue-green color harmony.',
        },
        {
          title: '2. Responsive Portal & Video Showcase',
          description: 'Designed a desktop and mobile web portal with video hero integrations and organized event calendars.',
        },
      ],
      solution: 'Built a serene, modern digital portal bridging traditional congregational values with accessible digital web interfaces.',
      results: [
        '+200% Increase in Congregational Engagement',
        'Streamlined digital donation and event information distribution',
      ],
    },
    id: {
      title: 'Situs Web Masjid Nurul Musthofa Center',
      subtitle: 'Portal Digital Masjid & Sistem Informasi Jamaah',
      summary: 'Portal web komprehensif untuk Masjid Nurul Musthofa Center yang dilengkapi hero video, jadwal majelis, saluran donasi, dan pembaruan informasi jamaah.',
      role: 'Media & Branding Lead / Desainer UI',
      problemStatement: 'Jamaah membutuhkan platform digital terpusat untuk memeriksa jadwal kegiatan keagamaan, waktu shalat, dan transparansi laporan donasi.',
      workflowSteps: [
        {
          title: '1. Modernisasi Brand & Standar Visual',
          description: 'Memodernisasi identitas visual masjid dengan ornamen geometris Islam yang bersih dan harmonisasi warna biru-hijau yang sejuk.',
        },
        {
          title: '2. Portal Responsif & Showcase Video',
          description: 'Merancang portal web desktop dan mobile dengan integrasi video latar utama serta kalender kegiatan terorganisir.',
        },
      ],
      solution: 'Membangun portal digital yang tenang dan modern, menjembatani nilai tradisi jamaah dengan kemudahan akses antarmuka web.',
      results: [
        '+200% Peningkatan Keterlibatan Jamaah',
        'Penyebaran informasi kegiatan dan donasi digital yang sangat efisien',
      ],
    },
    ja: {
      title: 'ヌルル・ムストファ・センター・モスクWebサイト',
      subtitle: 'モスクデジタルポータル＆コミュニティ情報システム',
      summary: 'ビデオヒーローセクション、イベントスケジュール、寄付機能、礼拝者向けニュースを備えた総合モスクポータルサイトのデザイン。',
      role: 'メディア＆ブランディングリード / UIデザイナー',
      problemStatement: '礼拝者コミュニティがイスラムイベントのスケジュールや寄付の記録を確認できる集中型デジタルプラットフォームが不足していました。',
      workflowSteps: [
        {
          title: '1. ブランドの現代化とビジュアル基準',
          description: 'クリーンなイスラム幾何学モチーフと洗練されたブルーグリーンの配色でモスクのビジュアルアイデンティティを刷新。',
        },
        {
          title: '2. レスポンシブポータル＆動画統合',
          description: '動画ヒーローセクションと整理されたイベントカレンダーを備えた、デスクトップおよびモバイル対応Webポータルを設計。',
        },
      ],
      solution: '伝統的なコミュニティの価値観とアクセシブルなデジタルWebインターフェースを融合させた心安らぐ現代的ポータルを構築しました。',
      results: [
        '礼拝者エンゲージメント +200% 増加',
        'デジタル寄付およびイベント情報伝達の効率化',
      ],
    },
    ar: {
      title: 'موقع مركز مسجد نور المصطفى',
      subtitle: 'بوابة المسجد الرقمية ونظام معلومات المجتمع',
      summary: 'تصميم بوابة ويب شاملة لمركز مسجد نور المصطفى تتميز بقسم فيديو رئيسي وجداول الفعاليات وقنوات التبرع وتحديثات المصلين.',
      role: 'قائد الإعلام والعلامة التجارية / مصمم UI',
      problemStatement: 'كان المصلون يفتقرون إلى منصة رقمية مركزية للاطلاع على الفعاليات الإسلامية القادمة ومواقيت الصلاة وسجلات التبرعات الرسمية.',
      workflowSteps: [
        {
          title: '1. تحديث العلامة التجارية والمعايير البصرية',
          description: 'تحديث الهوية البصرية للمسجد بزخارف هندسية إسلامية أنيقة وتناغم ألوان أزرق وأخضر هادئ.',
        },
        {
          title: '2. بوابة استجابية واستعراض الفيديو',
          description: 'تصميم بوابة ويب أفقية وعمودية مع إدمج فيديو رئيسي وتقويم فعاليات منظم.',
        },
      ],
      solution: 'بناء بوابة رقمية هادئة وحديثة تجسر بين القيم التقليدية للمصلين وواجهات الويب الرقمية المتاحة.',
      results: [
        'زيادة تفاعل المصلين بنسبة +200٪',
        'تبسيط التبرعات الرقمية وتوزيع معلومات الفعاليات',
      ],
    },
  },
  'proj-3': {
    en: {
      title: 'Brand Identity & Logo Design Collection',
      subtitle: 'Comprehensive Logo Systems for Organizations & Businesses',
      summary: 'Collection of brand logos created for Haul Akbar Tuan Guru, Pusat Informasi NM, Kemas Digital Printing, SegalaBaca.ID, and HIMAIRO Robotics Student Association.',
      role: 'Graphic Designer',
      problemStatement: 'Brands required distinctive, scalable vector logomarks that maintain legibility across physical print banners and small mobile screen icons.',
      workflowSteps: [
        {
          title: '1. Concept Sketching & Vector Geometry',
          description: 'Explored arabic calligraphy grid structures, geometric typography, and iconic symbols in Adobe Illustrator.',
        },
        {
          title: '2. Brand Guidelines & Color Palettes',
          description: 'Defined primary and secondary brand palettes, clear space rules, and application mockups.',
        },
      ],
      solution: 'Delivered timeless, versatile logomarks with vector precision for diverse industries ranging from Islamic media to AI robotics.',
      results: [
        '15+ Logomarks deployed in physical & digital media',
        '100% Client satisfaction across print & web assets',
      ],
    },
    id: {
      title: 'Koleksi Identitas Brand & Desain Logo',
      subtitle: 'Sistem Logo Komprehensif untuk Organisasi & Usaha',
      summary: 'Kumpulan desain logo brand yang diciptakan untuk Haul Akbar Tuan Guru, Pusat Informasi NM, Kemas Digital Printing, SegalaBaca.ID, dan Himpunan Mahasiswa Robotika HIMAIRO.',
      role: 'Desainer Grafis',
      problemStatement: 'Brand membutuhkan logo vektor yang unik dan dapat diperbesar/diperkecil tanpa kehilangan kejelasan visual baik di spanduk cetak maupun ikon layar HP.',
      workflowSteps: [
        {
          title: '1. Sketsa Konsep & Geometri Vektor',
          description: 'Mengeksplorasi struktur kisi kaligrafi, tipografi geometris, dan simbol ikonik menggunakan Adobe Illustrator.',
        },
        {
          title: '2. Panduan Brand & Palet Warna',
          description: 'Menentukan palet warna utama dan sekunder, aturan jarak aman logo, serta mockup aplikasi produk.',
        },
      ],
      solution: 'Menghasilkan logo yang ikonik dan serbaguna dengan presisi vektor tinggi untuk berbagai industri mulai dari media Islam hingga robotika AI.',
      results: [
        '15+ Logo resmi yang diimplementasikan di media cetak & digital',
        'Kepuasan klien 100% pada semua aset cetak dan web',
      ],
    },
    ja: {
      title: 'ブランドアイデンティティ＆ロゴデザインコレクション',
      subtitle: '企業・組織向け総合ロゴシステム',
      summary: 'Haul Akbar Tuan Guru、Pusat Informasi NM、Kemas Digital Printing、SegalaBaca.ID、HIMAIROロボティクス学生会などのロゴデザインコレクション。',
      role: 'グラフィックデザイナー',
      problemStatement: '巨大な印刷横断幕から小さなスマートフォンのアイコンまで、視認性を維持するスケーラブルなベクトルロゴが必要とされていました。',
      workflowSteps: [
        {
          title: '1. コンセプトスケッチ＆ベクター幾何学',
          description: 'Adobe Illustratorでアラビア書道のグリッド構造、幾何学的タイポグラフィ、象徴的シンボルを追求。',
        },
        {
          title: '2. ブランドガイドライン＆カラーパレット',
          description: 'プライマリ＆セカンダリカラーパレット、クリアスペース規定、使用モックアップを作成。',
        },
      ],
      solution: 'イスラムメディアからAIロボティクスまで、様々な業界に対応する不朽で汎用性の高いロゴマークを制作しました。',
      results: [
        '15以上のロゴマークが印刷物およびデジタルメディアで展開',
        '全クライアントにおいて高い評価を獲得',
      ],
    },
    ar: {
      title: 'مجموعة الهوية البصرية وتصميم الشعارات',
      subtitle: 'أنظمة شعارات شاملة للمؤسسات والشركات',
      summary: 'مجموعة من الشعارات المصممة لـ Haul Akbar Tuan Guru، ومركـز معلومات NM، وKemas Digital Printing، وSegalaBaca.ID، وجمعية طلاب الروبوتات HIMAIRO.',
      role: 'مصمم غرافيك',
      problemStatement: 'احتاجت العلامات التجارية إلى شعارات متجهة مميزة وقابلة للتكبير تحافظ على وضوحها عبر اللافتات المطبوعة وأيقونات الهاتف الصغرى.',
      workflowSteps: [
        {
          title: '1. رسم المفاهيم والهندسة المتجهة',
          description: 'استكشاف هياكل الخط العربي والخطوط الهندسية والرموز الأيقونية في Adobe Illustrator.',
        },
        {
          title: '2. إرشادات العلامة التجارية ولوحات الألوان',
          description: 'تحديد لوحات الألوان الأساسية والثانوية وقواعد المسافة الآمنة ونماذج التطبيقات.',
        },
      ],
      solution: 'تقديم شعارات متجهة دقيقة وخالدة لمختلف القطاعات بدءًا من الإعلام الإسلامي وحتى الروبوتات والذكاء الاصطناعي.',
      results: [
        'أكثر من 15 شعارًا مستخدمًا في الوسائط المطبوعة والرقمية',
        'رضا العملاء بنسبة 100٪ عبر كافة الأصول المطبوعة والويب',
      ],
    },
  },
  'proj-4': {
    en: {
      title: 'Book Cover Series & Ebook Design',
      subtitle: 'Creative Graphic Design for Books & Digital Publications',
      summary: 'Custom book cover designs including "Kumpulan Qosidah", "Red Flag & Green Flag", "Seni Mengatur Uang Dengan Hati", and "5 Cara Biar Ga Mager Seharian".',
      role: 'Graphic Designer & Illustrator',
      problemStatement: 'Authors needed eye-catching cover graphics that immediately communicate book themes and appeal to modern readers.',
      workflowSteps: [
        {
          title: '1. Visual Metaphor & Character Illustration',
          description: 'Created custom vector character art and typographic hierarchy matching the emotional tone of each book.',
        },
      ],
      solution: 'Designed memorable book covers optimized for physical bookstore displays and Amazon/Ebook thumbnail previews.',
      results: ['Published in physical bookstores & digital ebook platforms'],
    },
    id: {
      title: 'Seri Sampul Buku & Desain Ebook',
      subtitle: 'Desain Grafis Kreatif untuk Buku & Publikasi Digital',
      summary: 'Desain sampul buku kustom mencakup "Kumpulan Qosidah", "Red Flag & Green Flag", "Seni Mengatur Uang Dengan Hati", dan "5 Cara Biar Ga Mager Seharian".',
      role: 'Desainer Grafis & Ilustrator',
      problemStatement: 'Penulis membutuhkan grafis sampul yang memikat mata untuk langsung menyampaikan tema buku dan menarik minat pembaca modern.',
      workflowSteps: [
        {
          title: '1. Metafora Visual & Ilustrasi Karakter',
          description: 'Membuat ilustrasi karakter vektor kustom dan hierarki tipografi yang sesuai dengan nada emosional setiap buku.',
        },
      ],
      solution: 'Merancang sampul buku yang berkesan dan dioptimalkan untuk rak toko buku fisik maupun pratinjau thumbnail ebook digital.',
      results: ['Diterbitkan di toko buku fisik & platform ebook digital'],
    },
    ja: {
      title: 'ブックカバーシリーズ＆電子書籍デザイン',
      subtitle: '書籍およびデジタル出版物のクリエイティブグラフィック',
      summary: '「Kumpulan Qosidah」「Red Flag & Green Flag」「Seni Mengatur Uang Dengan Hati」などのオリジナル書籍カバーデザイン。',
      role: 'グラフィックデザイナー＆イラストレーター',
      problemStatement: '著者は、本のテーマをひと目で伝え、現代の読者の目を引く魅力的なカバーグラフィックを必要としていました。',
      workflowSteps: [
        {
          title: '1. ビジュアルメタファー＆キャラクターイラスト',
          description: '各書籍の感情的トーンに合わせたオリジナルのベクターキャラクターアートとタイポグラフィ階層を作成。',
        },
      ],
      solution: '実店舗の書店ディスプレイおよび電子書籍のサムネイルプレビューに最適化された記憶に残るカバーをデザインしました。',
      results: ['実店舗書店およびデジタル電子書籍プラットフォームで出版'],
    },
    ar: {
      title: 'سلسلة تصميم أغطية الكتب والكتب الإلكترونية',
      subtitle: 'تصميم غرافيكي إبداعي للكتب والمطبوعات الرقمية',
      summary: 'تصميمات مخصصة لأغلفة الكتب تشمل "مجموعة القصائد" و"Red Flag & Green Flag" و"فن إدارة المال بالقلب".',
      role: 'مصمم غرافيك ومصمم رسومات',
      problemStatement: 'احتاج المؤلفون إلى غلاف لافت للنظر ينقل موضوع الكتاب فورًا ويجذب القراء المعاصرين.',
      workflowSteps: [
        {
          title: '1. الاستعارة البصرية ورسم الشخصيات',
          description: 'إنشاء رسومات شخصيات متجهة مخصصة وتدرج خطي يتطابق مع النغمة العاطفية لكل كتاب.',
        },
      ],
      solution: 'تصميم أغلفة كتب مميزة محسّنة للعرض في المكتبات المادية ومعاينات الصور المصغرة للكتب الإلكترونية.',
      results: ['نشرت في المكتبات المادية ومناطق الكتب الإلكترونية الرقمية'],
    },
  },
  'proj-5': {
    en: {
      title: 'Social Media & Insta Story Suite',
      subtitle: 'Digital Content Creation & Campaign Feeds',
      summary: 'High-impact social media campaign graphics, Instagram stories, and event posters for Nuzulul Qur’an, Gema Ramadhan, and Haul Habib Musthofa.',
      role: 'Media Lead',
      problemStatement: 'Promotional event flyers needed to stand out in fast-scrolling mobile feeds and convey key dates clearly.',
      workflowSteps: [
        {
          title: '1. Daily Content Production',
          description: 'Produced daily digital content, event countdown stories, and live activity documentations.',
        },
      ],
      solution: 'Vibrant, structured social templates with strong contrast and readable event schedules.',
      results: ['Over 100,000+ total social media impressions'],
    },
    id: {
      title: 'Paket Konten Media Sosial & Insta Story',
      subtitle: 'Pembuatan Konten Digital & Feed Kampanye',
      summary: 'Grafis kampanye media sosial berpotensi tinggi, Instagram story, dan poster acara untuk Nuzulul Qur’an, Gema Ramadhan, dan Haul Habib Musthofa.',
      role: 'Media Lead',
      problemStatement: 'Flyer promosi acara perlu menonjol di feed aplikasi seluler yang bergerak cepat dan menyampaikan tanggal acara dengan sangat jelas.',
      workflowSteps: [
        {
          title: '1. Produksi Konten Harian',
          description: 'Memproduksi konten digital harian, story hitung mundur acara, dan dokumentasi kegiatan langsung.',
        },
      ],
      solution: 'Template media sosial yang cerah, terstruktur dengan kontras kuat dan jadwal acara yang mudah dibaca.',
      results: ['Lebih dari 100.000+ total tayangan media sosial'],
    },
    ja: {
      title: 'SNS＆Instagramストーリーデザインスイート',
      subtitle: 'デジタルコンテンツ制作＆キャンペーンフィード',
      summary: 'Nuzulul Qur’an、Gema Ramadhan、Haul Habib Musthofaなどのイベント向けSNSキャンペーン画像、ストーリー、ポスター制作。',
      role: 'メディアリード',
      problemStatement: '高速でスクロールされるスマートフォンのフィードの中で目を引き、重要な日時を明確に伝えるイベントフライヤーが必要でした。',
      workflowSteps: [
        {
          title: '1. 日次コンテンツ制作',
          description: '毎日のデジタルコンテンツ、カウントダウンストーリー、リアルタイム活動記録を制作。',
        },
      ],
      solution: '高いコントラストと読みやすいスケジュールを備えた、鮮やかで構造化されたSNSテンプレートをデザイン。',
      results: ['総インプレッション数 100,000回以上を達成'],
    },
    ar: {
      title: 'حزمة تصميم وسائل التواصل الاجتماعي واستوري إنستغرام',
      subtitle: 'إنشاء المحتوى الرقمي وتغذية الحملات',
      summary: 'رسوم حملات وسائل تواصل اجتماعي عالية التأثير وقصص إنستغرام وملصقات لفعاليات نزول القرآن وجزء رمضان وحول الحبيب مصطفى.',
      role: 'قائد الإعلام',
      problemStatement: 'احتاجت المنشورات الترويجية إلى البروز في التمرير السريع عبر الهاتف وتوصيل المواعيد الرئيسية بوضوح.',
      workflowSteps: [
        {
          title: '1. إنتاج المحتوى اليومي',
          description: 'إنتاج محتوى رقمي يومي وقصص تنازلية وتوثيق للأنشطة المباشرة.',
        },
      ],
      solution: 'قوالب اجتماعية حيوية ومنظمة ذات تباين قوي وجداول فعاليات سهلة القراءة.',
      results: ['أكثر من 100,000+ إجمالي انطباعات وسائل التواصل الاجتماعي'],
    },
  },
  'proj-6': {
    en: {
      title: 'Printing Set, T-Shirt & PDH Uniform Design',
      subtitle: 'Physical Merchandising & Official Team Uniforms',
      summary: 'Production-ready print sets, calendar cards, Eid greeting banners, Haul Akbar event t-shirts, and official green PDH long-sleeve uniform mockups.',
      role: 'Graphic Design Operator',
      problemStatement: 'Required exact pre-printing file resolution, color separation (CMYK), and plotter machine alignment for flawless physical production.',
      workflowSteps: [
        {
          title: '1. Pre-Printing & Color Optimization',
          description: 'Optimized file DPI resolution and color profiles to guarantee vibrant print quality on fabrics and vinyl banners.',
        },
      ],
      solution: 'Designed professional merchandise and uniforms with durable embroidery and screen-print layouts.',
      results: ['Zero pre-press manufacturing defects across 1,000+ printed units'],
    },
    id: {
      title: 'Set Cetak, Desain Kaos & Seragam PDH',
      subtitle: 'Merchandise Fisik & Seragam Resmi Tim',
      summary: 'Set cetak siap produksi, kartu kalender, spanduk ucapan Idul Fitri, kaos acara Haul Akbar, dan mockup seragam PDH lengan panjang warna hijau resmi.',
      role: 'Operator Desain Grafis',
      problemStatement: 'Membutuhkan resolusi berkas pracetak yang presisi, pemisahan warna CMYK, dan keselarasan mesin plotter untuk produksi fisik tanpa cacat.',
      workflowSteps: [
        {
          title: '1. Pra-Cetak & Optimasi Warna',
          description: 'Mengoptimalkan resolusi DPI berkas dan profil warna untuk menjamin kualitas cetak yang tajam pada kain dan spanduk banner.',
        },
      ],
      solution: 'Merancang merchandise profesional dan seragam dengan bordir tahan lama serta tata letak sablon berkualitas.',
      results: ['Nol cacat produksi pracetak pada lebih dari 1.000+ unit cetakan fisik'],
    },
    ja: {
      title: '印刷セット・Tシャツ・PDHユニフォームデザイン',
      subtitle: '物理的マーチャンダイジング＆チーム公式ユニフォーム',
      summary: '印刷可能なカレンダー、イベント用Tシャツ、公式グリーンの長袖PDHユニフォームモックアップの制作。',
      role: 'グラフィックデザインオペレーター',
      problemStatement: '完璧な物理的製造のため、精密な印刷前ファイル解像度、CMYK色分解、プロッターマシンの調整が求められました。',
      workflowSteps: [
        {
          title: '1. 印刷前準備＆カラー最適化',
          description: '生地やビニールバナーで鮮やかな印刷品質を保証するため、DPI解像度とカラープロファイルを最適化。',
        },
      ],
      solution: '耐久性のある刺繍とスクリーン印刷レイアウトを備えたプロ仕様のグッズとユニフォームをデザイン。',
      results: ['1,000点以上の印刷において製造欠陥ゼロを達成'],
    },
    ar: {
      title: 'طقم المطبوعات وتصميم القمصان والزي الرسمي PDH',
      subtitle: 'البضائع المادية والزي الرسمي للفرق',
      summary: 'مجموعات مطبوعات جاهزة للإنتاج، بطاقات تقويم، لافتات التهنئة بالعيد، قمصان الفعاليات، ونماذج الزي الرسمي الأخضر بأكمام طويلة.',
      role: 'مشغل تصميم غرافيكي',
      problemStatement: 'تطلب الأمر دقة ملفات ما قبل الطباعة وفصل الألوان (CMYK) ومحاذاة آلات الطباعة لإنتاج مادي خالي من العيوب.',
      workflowSteps: [
        {
          title: '1. ما قبل الطباعة وتحسين الألوان',
          description: 'تحسين دقة DPI للملفات وملفات تعريف الألوان لضمان جودة طباعة زاهية على الأقمشة واللافتات.',
        },
      ],
      solution: 'تصميم بضائع وزي رسمي احترافي مع تخطيطات تطريز وطباعة شاشة متينة.',
      results: ['صفر عيوب تصنيع ما قبل الطباعة عبر أكثر من 1,000 وحدة مطبوعة'],
    },
  },
};

// Helper function to resolve localized Project
export function getLocalizedProject(project: Project, language: Language): Project {
  const trans = projectTranslations[project.id]?.[language];
  if (!trans) return project;

  return {
    ...project,
    title: trans.title || project.title,
    subtitle: trans.subtitle || project.subtitle,
    summary: trans.summary || project.summary,
    role: trans.role || project.role,
    problemStatement: trans.problemStatement || project.problemStatement,
    workflowSteps: trans.workflowSteps || project.workflowSteps,
    solution: trans.solution || project.solution,
    results: trans.results || project.results,
  };
}

// Map for Services
export const serviceTranslations: Record<
  string,
  Record<Language, { title: string; description: string; deliverables: string[] }>
> = {
  'srv-1': {
    en: {
      title: 'UI/UX & Mobile App Design',
      description: 'Bridging business and non-business needs into intuitive digital interface design for mobile apps and web platforms using Figma and Adobe Xd.',
      deliverables: ['Wireframing & Information Architecture', 'Figma Interactive Prototypes', 'Responsive Layouting', 'Developer-Ready Tokens'],
    },
    id: {
      title: 'Desain UI/UX & Aplikasi Mobile',
      description: 'Menjembatani kebutuhan bisnis dan non-bisnis menjadi antarmuka digital yang intuitif untuk aplikasi mobile dan web menggunakan Figma dan Adobe Xd.',
      deliverables: ['Wireframing & Arsitektur Informasi', 'Prototipe Interaktif Figma', 'Tata Letak Responsif', 'Spesifikasi Handout Developer'],
    },
    ja: {
      title: 'UI/UX＆モバイルアプリデザイン',
      description: 'FigmaやAdobe Xdを活用し、ビジネスニーズを理解しやすい直感的なデジタルインターフェースに落とし込みます。',
      deliverables: ['ワイヤーフレーム＆情報設計', 'Figmaインタラクティブプロトタイプ', 'レスポンシブデザイン', '開発者向け仕様書'],
    },
    ar: {
      title: 'تصميم UI/UX وتطبيقات الهاتف',
      description: 'الجسر بين متطلبات الأعمال وواجهات المستخدم الرقمية السلسة لتطبيقات الهاتف والويب باستخدام Figma وAdobe Xd.',
      deliverables: ['الهياكل السلكية وهندسة المعلومات', 'نماذج Figma التفاعلية', 'التخطيط الاستجابي', 'رموز جاهزة للمطورين'],
    },
  },
  'srv-2': {
    en: {
      title: 'Branding & Logo Systems',
      description: 'Crafting memorable visual identities, logo marks, typography standards, and brand books that leave a tangible impact.',
      deliverables: ['Primary & Secondary Logomarks', 'Brand Identity Guidelines', 'Vector Assets (AI, SVG, PDF)', 'Color & Type Tokens'],
    },
    id: {
      title: 'Sistem Branding & Logo',
      description: 'Menciptakan identitas visual yang berkesan, desain logo, standar tipografi, dan buku panduan brand yang berdampak nyata.',
      deliverables: ['Logo Utama & Sekunder', 'Panduan Identitas Brand', 'Aset Vektor (AI, SVG, PDF)', 'Aturan Warna & Tipografi'],
    },
    ja: {
      title: 'ブランディング＆ロゴシステム',
      description: '記憶に残るビジュアルアイデンティティ、ロゴマーク、タイポグラフィの標準化、ブランドブックを作成します。',
      deliverables: ['プライマリ＆セカンダリロゴ', 'ブランドアイデンティティガイドライン', 'ベクター素材 (AI, SVG, PDF)', 'カラー＆タイプ規定'],
    },
    ar: {
      title: 'أنظمة الهوية البصرية والشعارات',
      description: 'صناعة هويات بصرية مميزة وشعارات ومعايير خطية وكتب علامات تجارية تترك أثرًا ملموسًا.',
      deliverables: ['الشعارات الأساسية والثانوية', 'إرشادات الهوية البصرية', 'ملفات متجهة (AI, SVG, PDF)', 'رموز الألوان والخطوط'],
    },
  },
  'srv-3': {
    en: {
      title: 'Social Media & Graphic Media',
      description: 'Producing daily digital content, Instagram story campaigns, book cover illustrations, and thumbnail designs that drive engagement.',
      deliverables: ['Social Media Feeds & Stories', 'Book & Ebook Cover Art', 'Thumbnail Design', 'Digital Event Banners'],
    },
    id: {
      title: 'Media Sosial & Grafis Digital',
      description: 'Memproduksi konten digital harian, kampanye story Instagram, ilustrasi sampul buku, dan desain thumbnail berpotensi tinggi.',
      deliverables: ['Feed & Story Media Sosial', 'Desain Sampul Buku & Ebook', 'Desain Thumbnail', 'Spanduk Acara Digital'],
    },
    ja: {
      title: 'ソーシャルメディア＆グラフィック制作',
      description: '日々のデジタルコンテンツ、Instagramストーリー、書籍カバーイラスト、サムネイルデザインを制作。',
      deliverables: ['SNSフィード＆ストーリー', '書籍・電子書籍カバーアート', 'サムネイルデザイン', 'デジタルイベントバナー'],
    },
    ar: {
      title: 'وسائل التواصل الاجتماعي والوسائط',
      description: 'إنتاج محتوى رقمي يومي وحملات قصص إنستغرام ورسومات أغلفة الكتب والتصاميم المصغرة لتنشيط التفاعل.',
      deliverables: ['منشورات وقصص التواصل', 'أغلفة الكتب والكتب الإلكترونية', 'تصميم الصور المصغرة', 'لافتات الفعاليات الرقمية'],
    },
  },
  'srv-4': {
    en: {
      title: 'Physical Printing & Merch Sets',
      description: 'Expertise in pre-printing file optimization, color correction, banners, billboards, calendars, T-shirt prints, and official PDH team uniforms.',
      deliverables: ['CMYK Print-Ready Files', 'Calendar & ID Card Sets', 'T-Shirt & Event Merchandise', 'PDH Uniform Mockups'],
    },
    id: {
      title: 'Cetak Fisik & Set Merchandise',
      description: 'Keahlian dalam optimasi berkas pracetak, koreksi warna CMYK, spanduk, baliho, kalender, sablon kaos, dan seragam resmi PDH.',
      deliverables: ['Berkas Siap Cetak CMYK', 'Set Kalender & Kartu ID', 'Kaos & Merchandise Acara', 'Mockup Seragam PDH'],
    },
    ja: {
      title: '印刷物＆マーチャンダイジング',
      description: '印刷用ファイル最適化、CMYK補正、バナー、カレンダー、Tシャツプリント、公式PDHユニフォームの制作。',
      deliverables: ['CMYK入稿用データ', 'カレンダー＆IDカードセット', 'Tシャツ＆イベントグッズ', 'PDHユニフォームモックアップ'],
    },
    ar: {
      title: 'المطبوعات المادية ومجموعات الهدايا',
      description: 'خبرة في تحسين ملفات ما قبل الطباعة وتصحيح الألوان واللافتات والتقاويم والقمصان والزي الرسمي PDH.',
      deliverables: ['ملفات جاهزة للطباعة CMYK', 'أطقم التقاويم وبطاقات الهوية', 'قمصان وبضائع الفعاليات', 'نماذج الزي الرسمي PDH'],
    },
  },
};

export function getLocalizedService(service: ServiceOffering, language: Language): ServiceOffering {
  const trans = serviceTranslations[service.id]?.[language];
  if (!trans) return service;
  return {
    ...service,
    title: trans.title || service.title,
    description: trans.description || service.description,
    deliverables: trans.deliverables || service.deliverables,
  };
}

// Map for Packages
export const packageTranslations: Record<
  string,
  Record<
    Language,
    {
      name: string;
      badge?: string;
      description: string;
      features: string[];
      recommendedFor: string;
      deliveryTime: string;
    }
  >
> = {
  'pkg-1': {
    en: {
      name: 'Branding & Visual Starter',
      badge: 'Essential Brand Identity',
      description: 'Ideal for small businesses and organizations needing a professional logo, brand guidelines, and key social media templates.',
      features: [
        'Logo Design (2 Concept Variations)',
        'Brand Color Palette & Typography Rules',
        'Social Media Post & Banner Templates (5 Posts)',
        'Vector Source Files (AI, EPS, SVG, PNG, PDF)',
        '2 Rounds of Revisions',
        '4 Days Fast Delivery',
      ],
      recommendedFor: 'Startups, Small Businesses, Event Promoters',
      deliveryTime: '4 Business Days',
    },
    id: {
      name: 'Starter Branding & Visual',
      badge: 'Identitas Brand Esensial',
      description: 'Sangat cocok untuk usaha kecil dan organisasi yang membutuhkan logo profesional, panduan brand, dan template media sosial utama.',
      features: [
        'Desain Logo (2 Variasi Konsep)',
        'Palet Warna Brand & Aturan Tipografi',
        'Template Post & Banner Media Sosial (5 Konten)',
        'Berkas Sumber Vektor (AI, EPS, SVG, PNG, PDF)',
        '2 Kali Kesempatan Revisi',
        'Pengerjaan Cepat 4 Hari Kerja',
      ],
      recommendedFor: 'Startup, Usaha Kecil, Promotor Acara',
      deliveryTime: '4 Hari Kerja',
    },
    ja: {
      name: 'ブランディング＆ビジュアルスターター',
      badge: '基本ブランドアイデンティティ',
      description: 'プロフェッショナルなロゴ、ブランドガイドライン、主要SNSテンプレートを必要とするスモールビジネスに最適です。',
      features: [
        'ロゴデザイン（2つのコンセプト案）',
        'カラーパレット＆タイポグラフィ規定',
        'SNS投稿＆バナーテンプレート (5点)',
        'ベクター納品データ (AI, EPS, SVG, PNG, PDF)',
        '2回の修正対応',
        '4日間のスピード納品',
      ],
      recommendedFor: 'スタートアップ、中小企業、イベント主催者',
      deliveryTime: '4営業日',
    },
    ar: {
      name: 'حزمة البداية للهوية البصرية',
      badge: 'هوية بصرية أساسية',
      description: 'مثالية للشركات الناشئة والمؤسسات التي تحتاج إلى شعار احترافي وإرشادات العلامة التجارية وقوالب وسائل التواصل.',
      features: [
        'تصميم الشعار (مفهومان مختلفان)',
        'لوحة ألوان العلامة التجارية وقواعد الخطوط',
        'قوالب منشورات التواصل الاجتماعي (5 منشورات)',
        'ملفات المصدر المتجهة (AI, EPS, SVG, PNG, PDF)',
        'جولتان من التعديلات',
        'تسليم سريع خلال 4 أيام',
      ],
      recommendedFor: 'الشركات الناشئة، الأعمال الصغيرة، المنظمون',
      deliveryTime: '4 أيام عمل',
    },
  },
  'pkg-2': {
    en: {
      name: 'UI/UX App & Web Prototype Pro',
      badge: 'Most Popular',
      description: 'Complete UI/UX design for mobile apps or web platforms with interactive Figma prototypes and wireframes.',
      features: [
        'End-to-End User Experience & Flow Wireframing',
        'Up to 10 Custom Application Screens',
        'Interactive Clickable Figma Prototype',
        'Design System Components & Typography Tokens',
        'Developer Handout (Tailwind / CSS Specifications)',
        '3 Rounds of Revisions',
        'Direct WhatsApp Consultation',
      ],
      recommendedFor: 'Mobile Apps, E-Commerce, Web Portals',
      deliveryTime: '10 Business Days',
    },
    id: {
      name: 'Pro UI/UX Aplikasi & Web Prototipe',
      badge: 'Paling Populer',
      description: 'Desain UI/UX lengkap untuk aplikasi seluler atau platform web dengan prototipe interaktif Figma dan wireframe.',
      features: [
        'Wireframe Alur & Pengalaman Pengguna Lengkap',
        'Hingga 10 Tampilan Layar Aplikasi Kustom',
        'Prototipe Interaktif Figma Dapat Diklik',
        'Komponen Design System & Token Tipografi',
        'Handout Developer (Spesifikasi Tailwind / CSS)',
        '3 Kali Kesempatan Revisi',
        'Konsultasi Langsung via WhatsApp',
      ],
      recommendedFor: 'Aplikasi Mobile, E-Commerce, Portal Web',
      deliveryTime: '10 Hari Kerja',
    },
    ja: {
      name: 'UI/UX アプリ＆Webプロトタイプ Pro',
      badge: '一番人気',
      description: 'インタラクティブなFigmaプロトタイプとワイヤーフレームを備えた、モバイルアプリおよびWeb向けの完全なUI/UXデザイン。',
      features: [
        'エンドツーエンドのUXフロー＆ワイヤーフレーム',
        '最大10画面のカスタムデザイン',
        'クリック可能なFigmaプロトタイプ',
        'デザインシステムコンポーネント＆トークン',
        '開発者向けハンドアウト（Tailwind / CSS仕様）',
        '3回の修正対応',
        'WhatsAppによるダイレクト相談',
      ],
      recommendedFor: 'モバイルアプリ、Eコマース、Webポータル',
      deliveryTime: '10営業日',
    },
    ar: {
      name: 'حزمة UI/UX الاحترافية للتطبيقات والويب',
      badge: 'الأكثر شعبية',
      description: 'تصميم UI/UX كامل لتطبيقات الهاتف أو منصات الويب مع نماذج تفاعلية قابلة للنقر في Figma.',
      features: [
        'هياكل سلكية وتجربة مستخدم متكاملة',
        'حتى 10 شاشات مخصصة للتطبيق',
        'نموذج تفاعلي قابل للنقر في Figma',
        'مكونات نظام التصميم ورموز الخطوط',
        'دليل المطورين (مواصفات Tailwind / CSS)',
        '3 جولات من التعديلات',
        'استشارة مباشرة عبر WhatsApp',
      ],
      recommendedFor: 'تطبيقات الهاتف، المتاجر، البوابات',
      deliveryTime: '10 أيام عمل',
    },
  },
  'pkg-3': {
    en: {
      name: 'Full Media & Print Package',
      badge: 'Physical & Digital Complete',
      description: 'Comprehensive branding, social media suite, printing sets (calendars, banners), and T-Shirt / PDH uniform mockups.',
      features: [
        'Full Logo & Brand System Guidelines',
        'Complete Social Media Feed & Story Suite (15 Assets)',
        'Printing Set (Calendars, Banners, Id Cards)',
        'Official T-Shirt & PDH Uniform Embroidery Mockups',
        'Pre-Printing CMYK Production-Ready Files',
        'Unlimited Revisions during active project',
        'Priority Delivery',
      ],
      recommendedFor: 'Media Centers, Community Orgs, Event Merch',
      deliveryTime: '14 Business Days',
    },
    id: {
      name: 'Paket Lengkap Media & Cetak Fisik',
      badge: 'Solusi Lengkap Digital & Cetak',
      description: 'Branding komprehensif, paket media sosial, set cetak fisik (kalender, spanduk), serta mockup kaos dan seragam resmi PDH.',
      features: [
        'Panduan Logo & Sistem Brand Lengkap',
        'Paket Feed & Story Media Sosial (15 Aset)',
        'Set Cetak Fisik (Kalender, Spanduk, Kartu ID)',
        'Mockup Bordir Kaos Resmi & Seragam PDH',
        'Berkas Siap Produksi Pracetak CMYK',
        'Revisi Tanpa Batas selama proyek aktif',
        'Pengiriman Prioritas',
      ],
      recommendedFor: 'Pusat Media, Organisasi, Merchandise Acara',
      deliveryTime: '14 Hari Kerja',
    },
    ja: {
      name: 'フルメディア＆印刷パッケージ',
      badge: 'デジタル＆物理印刷の完全版',
      description: 'ブランディング、SNS素材、印刷セット（カレンダー・バナー）、Tシャツ＆PDHユニフォームモックアップまで網羅。',
      features: [
        'フルロゴ＆ブランドガイドライン',
        'SNSフィード＆ストーリーセット (15点)',
        '印刷セット（カレンダー・バナー・IDカード）',
        'Tシャツ＆PDHユニフォーム刺繍モックアップ',
        'CMYK印刷用完全入稿データ',
        'プロジェクト期間中の無制限修正',
        '優先納品サポート',
      ],
      recommendedFor: 'メディアセンター、コミュニティ、イベントグッズ',
      deliveryTime: '14営業日',
    },
    ar: {
      name: 'الحزمة الكاملة للمطبوعات والإعلام',
      badge: 'حل متكامل رقمي ومطبوع',
      description: 'هوية بصرية شاملة وحزمة وسائل التواصل والمطبوعات (تقاويم، لافتات) ونماذج القمصان والزي الرسمي PDH.',
      features: [
        'إرشادات العلامة التجارية وشعار كامل',
        'حزمة منشورات وقصص التواصل الاجتماعي (15 عنصرًا)',
        'طقم المطبوعات (تقاويم، لافتات، بطاقات)',
        'نماذج تطريز القمصان والزي الرسمي PDH',
        'ملفات جاهزة للطباعة CMYK',
        'تعديلات غير محدودة أثناء المشروع',
        'أولوية التسليم',
      ],
      recommendedFor: 'المراكز الإعلامية، الجمعيات، بضائع الفعاليات',
      deliveryTime: '14 يوم عمل',
    },
  },
  'pkg-4': {
    en: {
      name: 'Monthly Design Retainer',
      badge: 'Monthly Support',
      description: 'Ongoing dedicated design support for monthly social media feeds, banner layouts, and UI/UX updates.',
      features: [
        '20 Custom Social Media & Story Banners per month',
        'UI/UX Screen Iterations & Web Banner Tweaks',
        'Print Asset Layouts (Flyers, Stickers, Merch)',
        'Fast 24-48 Hour Request Turnaround',
        'Direct WhatsApp Priority Communication',
      ],
      recommendedFor: 'Businesses, Media Centers, Content Teams',
      deliveryTime: 'Ongoing Monthly',
    },
    id: {
      name: 'Retainer Desain Bulanan',
      badge: 'Dukungan Bulanan',
      description: 'Dukungan desain berkelanjutan untuk feed media sosial bulanan, spanduk web, dan pembaruan antarmuka UI/UX.',
      features: [
        '20 Konten Media Sosial & Story Kustom per bulan',
        'Iterasi Layar UI/UX & Penyesuaian Banner Web',
        'Tata Letak Aset Cetak (Brosur, Stiker, Merchandise)',
        'Waktu Pengerjaan Cepat 24-48 Jam per Permintaan',
        'Komunikasi Prioritas Langsung via WhatsApp',
      ],
      recommendedFor: 'Perusahaan, Pusat Media, Tim Konten',
      deliveryTime: 'Berkelanjutan Bulanan',
    },
    ja: {
      name: '月額デザインリテーナー',
      badge: '月額継続サポート',
      description: '毎月のSNSコンテンツ、バナーレイアウト、UI/UX更新を継続的にサポートする月額定額プラン。',
      features: [
        '毎月20点のカスタムSNS＆ストーリーバナー',
        'UI/UX画面の改善＆Webバナーの調整',
        '印刷用レイアウト（フライヤー・ステッカー等）',
        '24〜48時間以内の迅速なリクエスト対応',
        'WhatsAppによる優先コミュニケーション',
      ],
      recommendedFor: '企業、メディアセンター、コンテンツチーム',
      deliveryTime: '毎月継続対応',
    },
    ar: {
      name: 'الاشتراك الشهري للتصميم',
      badge: 'دعم شهري مستمر',
      description: 'دعم تصميم مخصص ومستمر لمنشورات وسائل التواصل الشهرية وتحديثات UI/UX واللافتات.',
      features: [
        '20 تصميمًا مخصصًا لمنشورات وقصص التواصل شهريًا',
        'تعديلات شاشات UI/UX ولافتات الويب',
        'تصاميم المطبوعات (منشورات، ملصقات، بضائع)',
        'زمن تنفيذ سريع خلال 24-48 ساعة',
        'تواصل أولوية عبر WhatsApp',
      ],
      recommendedFor: 'الشركات، المراكز الإعلامية، فرق المحتوى',
      deliveryTime: 'دعم شهري مستمر',
    },
  },
};

export function getLocalizedPackage(pkg: PricingPackage, language: Language): PricingPackage {
  const trans = packageTranslations[pkg.id]?.[language];
  if (!trans) return pkg;
  return {
    ...pkg,
    name: trans.name || pkg.name,
    badge: trans.badge || pkg.badge,
    description: trans.description || pkg.description,
    features: trans.features || pkg.features,
    recommendedFor: trans.recommendedFor || pkg.recommendedFor,
    deliveryTime: trans.deliveryTime || pkg.deliveryTime,
  };
}

export const experienceTranslations: Record<
  string,
  Record<
    Language,
    {
      role: string;
      companyOrOrg: string;
      location: string;
      description: string;
      highlights: string[];
    }
  >
> = {
  'exp-1': {
    en: {
      role: 'Media & Branding Lead',
      companyOrOrg: 'Nurul Musthofa Media Center',
      location: 'Depok / Jakarta, Indonesia',
      description: 'Modernizing the mosque’s visual identity and media design standards across all physical and digital platforms.',
      highlights: [
        'Branding & Visual: Modernizing the mosque’s visual identity and media design standards.',
        'Creative Production: Producing daily content and documenting activities for digital platforms.',
        'Engagement: Systematic distribution of information to increase congregational engagement.',
      ],
    },
    id: {
      role: 'Ketua Media & Branding',
      companyOrOrg: 'Nurul Musthofa Media Center',
      location: 'Depok / Jakarta, Indonesia',
      description: 'Memodernisasi identitas visual dan standar desain media masjid di seluruh platform fisik maupun digital.',
      highlights: [
        'Branding & Visual: Memodernisasi identitas visual masjid dan standar desain media.',
        'Produksi Kreatif: Memproduksi konten harian dan mendokumentasikan kegiatan untuk platform digital.',
        'Engagement: Distribusi informasi terstruktur untuk meningkatkan keterlibatan jemaah.',
      ],
    },
    ja: {
      role: 'メディア＆ブランディングリード',
      companyOrOrg: 'Nurul Musthofa Media Center',
      location: 'インドネシア・デポック/ジャカルタ',
      description: 'モスクのビジュアルアイデンティティとメディアデザイン基準を物理・デジタル両面でモダン化。',
      highlights: [
        'ブランディング：ビジュアルアイデンティティとメディアデザイン基準の刷新。',
        'クリエイティブ制作：デジタルプラットフォーム向けの日次コンテンツ制作と活動記録。',
        'エンゲージメント：参拝者の関わりを高める情報配信の体系化。',
      ],
    },
    ar: {
      role: 'قائد الإعلام والهوية البصرية',
      companyOrOrg: 'مركز نور المصطفى الإعلامي',
      location: 'ديبوك / جاكرتا، إندونيسيا',
      description: 'تحديث الهوية البصرية للمسجد ومعايير تصميم الإعلام عبر جميع المنصات المطبوعة والرقمية.',
      highlights: [
        'الهوية البصرية: حديث الهوية البصرية ومعايير تصميم الإعلام للمسجد.',
        'الإنتاج الإبداعي: إنتاج محتوى يومي وتوثيق الأنشطة للمنصات الرقمية.',
        'التفاعل: توزيع منهجي للمعلومات لزيادة تفاعل المصلين.',
      ],
    },
  },
  'exp-2': {
    en: {
      role: 'UI/UX Designer',
      companyOrOrg: 'PT. Elucky Game Technology Asia',
      location: 'Indonesia',
      description: 'Designing end-to-end wireframes, web portals, and mobile app interfaces for Indonesia’s first Game E-commerce platform.',
      highlights: [
        'End-to-End Design: Design wireframes to interactive web/app prototypes using Figma.',
        'UX Optimization: Improve navigation flow to enhance transaction convenience.',
        'Technical Synergy: Collaborate with developers to ensure accurate design implementation.',
      ],
    },
    id: {
      role: 'Desainer UI/UX',
      companyOrOrg: 'PT. Elucky Game Technology Asia',
      location: 'Indonesia',
      description: 'Mendesain wireframe menyeluruh, portal web, dan antarmuka aplikasi mobile untuk platform E-commerce Game pertama di Indonesia.',
      highlights: [
        'Desain Menyeluruh: Membuat wireframe hingga prototipe web/aplikasi interaktif menggunakan Figma.',
        'Optimasi UX: Meningkatkan alur navigasi untuk kenyamanan transaksi pengguna.',
        'Sinergi Teknis: Bekerja sama dengan developer untuk memastikan implementasi desain yang akurat.',
      ],
    },
    ja: {
      role: 'UI/UXデザイナー',
      companyOrOrg: 'PT. Elucky Game Technology Asia',
      location: 'インドネシア',
      description: 'インドネシア初のゲームEコマースプラットフォーム向けにワイヤーフレーム、Webポータル、アプリ画面を制作。',
      highlights: [
        'エンドツーエンドデザイン：Figmaを使用したワイヤーフレームからインタラクティブなプロトタイプ作成。',
        'UX最適化：取引の利便性を高めるナビゲーションフローの改善。',
        '技術的シナジー：開発者と連携し、正確なデザイン実装を保証。',
      ],
    },
    ar: {
      role: 'مصمم UI/UX',
      companyOrOrg: 'شركة Elucky Game Technology Asia',
      location: 'إندونيسيا',
      description: 'تصميم المخططات الهيكلية وبوابات الويب وواجهات التطبيقات لأول منصة تجارة إلكترونية للألعاب في إندونيسيا.',
      highlights: [
        'التصميم الشامل: إنشاء مخططات هيكلية إلى نماذج تفاعلية باستخدام Figma.',
        'تحسين UX: تحسين تدفق التنقل لتعزيز سهولة المعاملات.',
        'التعاون التقني: التعاون مع المطورين لضمان تنفيذ التصميم بدقة.',
      ],
    },
  },
  'exp-3': {
    en: {
      role: 'Graphic Design Operator',
      companyOrOrg: 'Kemaslayatama Digital Printing',
      location: 'Indonesia',
      description: 'Handling promotional design, pre-printing optimization, and digital print production control.',
      highlights: [
        'Promotional Design: Design banners, billboards, and brochures according to client requirements.',
        'Pre-Printing: Optimize file resolution and color correction for print quality.',
        'Production & QC: Operate digital printing machines and plotters with strict quality control.',
      ],
    },
    id: {
      role: 'Operator Desain Grafis & Cetak',
      companyOrOrg: 'Kemaslayatama Digital Printing',
      location: 'Indonesia',
      description: 'Menangani desain promosi, optimasi pra-cetak (pre-press), dan kontrol produksi cetak digital.',
      highlights: [
        'Desain Promosi: Mendesain spanduk, baliho, dan brosur sesuai kebutuhan spesifik klien.',
        'Pra-Cetak: Mengoptimalkan resolusi file dan koreksi warna CMYK untuk kualitas cetak maksimal.',
        'Produksi & QC: Mengoperasikan mesin cetak digital & plotter dengan kontrol kualitas yang ketat.',
      ],
    },
    ja: {
      role: 'グラフィックデザイン＆印刷オペレーター',
      companyOrOrg: 'Kemaslayatama Digital Printing',
      location: 'インドネシア',
      description: '販促デザイン、プリプレス（印刷前作業）の最適化、およびデジタル印刷の生産管理を担当。',
      highlights: [
        '販促デザイン：クライアントの要望に応じたバナー、看板、パンフレットのデザイン。',
        'プリプレス：印刷品質向上のための解像度最適化およびカラー補正。',
        '生産＆品質管理：厳格な品質管理のもとデジタル印刷機およびプロッターを操作。',
      ],
    },
    ar: {
      role: 'مشغل تصميم جرافيكي وطباعة',
      companyOrOrg: 'Kemaslayatama للطباعة الرقمية',
      location: 'إندونيسيا',
      description: 'إدارة التصاميم الترويجية، تحسين ما قبل الطباعة، والتحكم في إنتاج الطباعة الرقمية.',
      highlights: [
        'التصميم الترويجي: تصميم اللافتات واللوحات الإعلانية والكتيبات حسب متطلبات العملاء.',
        'ما قبل الطباعة: تحسين دقة الملفات وتصحيح الألوان لضمان جودة الطباعة.',
        'الإنتاج وجودة التحكم: تشغيل ماكينات الطباعة الرقمية مع مراقبة صارمة للجودة.',
      ],
    },
  },
  'exp-4': {
    en: {
      role: 'Universitas Pakuan',
      companyOrOrg: 'Higher Education Student',
      location: 'Indonesia',
      description: 'Continuing higher education specializing in creative technology and interface design.',
      highlights: ['Focus on AI & Robotics background synergy with creative design logic.'],
    },
    id: {
      role: 'Universitas Pakuan',
      companyOrOrg: 'Mahasiswa Perguruan Tinggi',
      location: 'Indonesia',
      description: 'Melanjutkan pendidikan tinggi dengan spesialisasi dalam teknologi kreatif dan desain antarmuka.',
      highlights: ['Fokus pada sinergi latar belakang AI & Robotika dengan logika desain kreatif.'],
    },
    ja: {
      role: 'Pakuan大学',
      companyOrOrg: '高等教育学生',
      location: 'インドネシア',
      description: 'クリエイティブテクノロジーとインターフェースデザインを専門とする高等教育を専攻。',
      highlights: ['AI・ロボティクスのバックグラウンドとデザイン論理のシナジーに焦点。'],
    },
    ar: {
      role: 'جامعة باكووان',
      companyOrOrg: 'طالب تعليم عالي',
      location: 'إندونيسيا',
      description: 'متابعة التعليم العالي المتخصص في التكنولوجيا الإبداعية وتصميم الواجهات.',
      highlights: ['التركيز على دمج الذكاء الاصطناعي والروبوتات مع منطق التصميم الإبداعي.'],
    },
  },
  'exp-5': {
    en: {
      role: 'SMA Negeri 5 Depok',
      companyOrOrg: 'Senior High School Graduate',
      location: 'Depok, Indonesia',
      description: 'Graduated with high honors in technology and science fundamentals.',
      highlights: ['Active leadership in robotics and visual media clubs.'],
    },
    id: {
      role: 'SMA Negeri 5 Depok',
      companyOrOrg: 'Lulusan Sekolah Menengah Atas',
      location: 'Depok, Indonesia',
      description: 'Lulus dengan prestasi baik pada fondasi sains dan teknologi.',
      highlights: ['Kepemimpinan aktif di klub robotika dan media visual sekolah.'],
    },
    ja: {
      role: 'SMA Negeri 5 Depok 高校',
      companyOrOrg: '高校卒業',
      location: 'インドネシア・デポック',
      description: '科学および技術の基礎において優秀な成績で卒業。',
      highlights: ['ロボティクスおよびビジュアルメディアクラブでの積極的なリーダーシップ。'],
    },
    ar: {
      role: 'مدرسة ديبوك الثانوية الخامسة',
      companyOrOrg: 'خريج المرحلة الثانوية',
      location: 'ديبوك، إندونيسيا',
      description: 'التخرج بتميز في أساسيات العلوم والتكنولوجيا.',
      highlights: ['قيادة نشطة في أندية الروبوتات والوسائط البصرية.'],
    },
  },
  'exp-6': {
    en: {
      role: 'PP Tahfidz Az-Zikra',
      companyOrOrg: 'Islamic Boarding Education',
      location: 'Bogor, Indonesia',
      description: 'Completed Islamic boarding education and character building.',
      highlights: ['Focus on discipline, ethics, and community leadership.'],
    },
    id: {
      role: 'PP Tahfidz Az-Zikra',
      companyOrOrg: 'Pendidikan Pesantren',
      location: 'Bogor, Indonesia',
      description: 'Menyelesaikan pendidikan pesantren dan pembentukan karakter kepemimpinan.',
      highlights: ['Fokus pada kedisiplinan, etika, dan kepemimpinan masyarakat.'],
    },
    ja: {
      role: 'PP Tahfidz Az-Zikra 寄宿学校',
      companyOrOrg: 'イスラム寄宿教育',
      location: 'インドネシア・ボゴール',
      description: 'イスラム寄宿教育および人格形成プログラムを修了。',
      highlights: ['規律、倫理、コミュニティリーダーシップの育成。'],
    },
    ar: {
      role: 'معهد أذكار لتحفيظ القرآن',
      companyOrOrg: 'التعليم الإسلامي الداخلي',
      location: 'بوجور، إندونيسيا',
      description: 'إتمام التعليم الداخلي الإسلامي وبناء الشخصية.',
      highlights: ['التركيز على الانضباط، الأخلاق، والقيادة المجتمعية.'],
    },
  },
};

export function getLocalizedExperience(exp: ExperienceItem, language: Language): ExperienceItem {
  const trans = experienceTranslations[exp.id]?.[language];
  if (!trans) return exp;
  return {
    ...exp,
    role: trans.role || exp.role,
    companyOrOrg: trans.companyOrOrg || exp.companyOrOrg,
    location: trans.location || exp.location,
    description: trans.description || exp.description,
    highlights: trans.highlights || exp.highlights,
  };
}

