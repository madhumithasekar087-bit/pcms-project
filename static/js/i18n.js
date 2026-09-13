/**
 * PCMS — Internationalization (i18n)
 * Bilingual support: English & Tamil
 */

const TRANSLATIONS = {
    // ── Navigation ────────────────────────────────────────────────
    'nav.home': { en: 'Home', ta: 'முகப்பு' },
    'nav.dashboard': { en: 'Dashboard', ta: 'கட்டுப்பாட்டு பலகை' },
    'nav.chatbot': { en: 'File Complaint', ta: 'புகார் பதிவு' },
    'nav.track': { en: 'Track Complaint', ta: 'புகார் கண்காணிப்பு' },
    'nav.features': { en: 'Features & Guide', ta: 'அம்சங்கள் & வழிகாட்டி' },
    'nav.admin': { en: 'Admin Panel', ta: 'நிர்வாக பலகை' },
    'nav.login': { en: 'Login', ta: 'உள்நுழை' },
    'nav.logout': { en: 'Logout', ta: 'வெளியேறு' },

    // ── Landing Page ──────────────────────────────────────────────
    'hero.badge': { en: '🏛️ Government Complaint Portal', ta: '🏛️ அரசு புகார் போர்ட்டல்' },
    'hero.title1': { en: 'Your Voice', ta: 'உங்கள் குரல்' },
    'hero.title2': { en: 'Matters', ta: 'முக்கியம்' },
    'hero.subtitle': {
        en: 'File public complaints easily through our intelligent chatbot. Attach photos, videos, share your location, and let the system automatically route your complaint to the right department.',
        ta: 'எங்கள் அறிவார்ந்த சாட்பாட் மூலம் எளிதாக பொதுப் புகார்களைப் பதிவு செய்யுங்கள். புகைப்படங்கள், வீடியோக்களை இணைத்து, உங்கள் இருப்பிடத்தைப் பகிர்ந்து, சரியான துறைக்கு தானாகவே அனுப்புங்கள்.'
    },
    'hero.fileBtn': { en: '🤖 File a Complaint', ta: '🤖 புகார் பதிவு செய்' },
    'hero.trackBtn': { en: '🔍 Track Complaint', ta: '🔍 புகார் கண்காணி' },

    // ── Features ──────────────────────────────────────────────────
    'features.title': { en: 'Powerful Features', ta: 'சக்திவாய்ந்த அம்சங்கள்' },
    'features.subtitle': { en: 'Everything you need to file and track public complaints', ta: 'பொதுப் புகார்களை பதிவு செய்து கண்காணிக்க தேவையான அனைத்தும்' },
    'feature.chatbot.title': { en: 'AI Chatbot', ta: 'AI சாட்பாட்' },
    'feature.chatbot.desc': { en: 'Guided step-by-step complaint filing through an intelligent conversational interface', ta: 'அறிவார்ந்த உரையாடல் இடைமுகம் மூலம் படிப்படியான புகார் பதிவு' },
    'feature.media.title': { en: 'Photos & Videos', ta: 'புகைப்படங்கள் & வீடியோக்கள்' },
    'feature.media.desc': { en: 'Attach evidence with your complaint — photos, videos with drag & drop support', ta: 'உங்கள் புகாருடன் சான்றுகளை இணைக்கவும் — புகைப்படங்கள், வீடியோக்கள்' },
    'feature.gps.title': { en: 'GPS Location', ta: 'GPS இருப்பிடம்' },
    'feature.gps.desc': { en: 'Auto-detect your location or pick on map for precise complaint placement', ta: 'உங்கள் இருப்பிடத்தை தானாக கண்டறியவும் அல்லது வரைபடத்தில் தேர்வு செய்யவும்' },
    'feature.routing.title': { en: 'Smart Routing', ta: 'தானியங்கி வழிநடத்தல்' },
    'feature.routing.desc': { en: 'Automatically detects the right department and routes your complaint', ta: 'சரியான துறையை தானாகவே கண்டறிந்து உங்கள் புகாரை அனுப்புகிறது' },
    'feature.track.title': { en: 'Real-time Tracking', ta: 'நிகழ்நேர கண்காணிப்பு' },
    'feature.track.desc': { en: 'Track your complaint status anytime with your unique complaint ID', ta: 'உங்கள் தனிப்பட்ட புகார் எண் மூலம் எந்நேரமும் நிலையை கண்காணிக்கவும்' },
    'feature.escalation.title': { en: 'Auto Escalation', ta: 'தானியங்கி முன்னிலைப்படுத்தல்' },
    'feature.escalation.desc': { en: 'Complaints automatically escalated if no action taken within 48 hours', ta: '48 மணி நேரத்தில் நடவடிக்கை எடுக்கவில்லை என்றால் புகார் தானாகவே முன்னிலைப்படுத்தப்படும்' },

    // ── Auth Page ─────────────────────────────────────────────────
    'auth.loginTab': { en: 'Login', ta: 'உள்நுழை' },
    'auth.registerTab': { en: 'Register', ta: 'பதிவு' },
    'auth.name': { en: 'Full Name', ta: 'முழுப்பெயர்' },
    'auth.email': { en: 'Email Address', ta: 'மின்னஞ்சல்' },
    'auth.phone': { en: 'Phone Number', ta: 'தொலைபேசி எண்' },
    'auth.password': { en: 'Password', ta: 'கடவுச்சொல்' },
    'auth.confirmPassword': { en: 'Confirm Password', ta: 'கடவுச்சொல்லை உறுதிப்படுத்து' },
    'auth.loginBtn': { en: 'Login', ta: 'உள்நுழை' },
    'auth.registerBtn': { en: 'Create Account', ta: 'கணக்கை உருவாக்கு' },
    'auth.adminLogin': { en: 'Admin Login', ta: 'நிர்வாகி உள்நுழைவு' },
    'auth.adminHint': { en: 'admin@pcms.gov.in / admin123', ta: 'admin@pcms.gov.in / admin123' },

    // ── Dashboard ─────────────────────────────────────────────────
    'dash.title': { en: 'My Dashboard', ta: 'என் கட்டுப்பாட்டு பலகை' },
    'dash.welcome': { en: 'Welcome back', ta: 'மீண்டும் வரவேற்கிறோம்' },
    'dash.total': { en: 'Total Complaints', ta: 'மொத்த புகார்கள்' },
    'dash.pending': { en: 'Pending', ta: 'நிலுவையில்' },
    'dash.inProgress': { en: 'In Progress', ta: 'செயலில்' },
    'dash.resolved': { en: 'Resolved', ta: 'தீர்க்கப்பட்டது' },
    'dash.escalated': { en: 'Escalated', ta: 'முன்னிலைப்படுத்தப்பட்டது' },
    'dash.newComplaint': { en: '+ New Complaint', ta: '+ புதிய புகார்' },
    'dash.myComplaints': { en: 'My Complaints', ta: 'என் புகார்கள்' },
    'dash.noComplaints': { en: 'No complaints yet', ta: 'இதுவரை புகார்கள் இல்லை' },
    'dash.fileFirst': { en: 'File your first complaint using the chatbot!', ta: 'சாட்பாட் மூலம் உங்கள் முதல் புகாரை பதிவு செய்யுங்கள்!' },

    // ── Admin ─────────────────────────────────────────────────────
    'admin.title': { en: 'Admin Dashboard', ta: 'நிர்வாக கட்டுப்பாட்டு பலகை' },
    'admin.subtitle': { en: 'Manage and monitor all complaints', ta: 'அனைத்து புகார்களையும் நிர்வகித்து கண்காணிக்கவும்' },
    'admin.allComplaints': { en: 'All Complaints', ta: 'அனைத்து புகார்கள்' },
    'admin.escalateCheck': { en: '⚡ Check Escalations', ta: '⚡ முன்னிலைப்படுத்தல் சரிபார்' },
    'admin.filterStatus': { en: 'Filter by Status', ta: 'நிலை வடிகட்டி' },
    'admin.filterDept': { en: 'Filter by Department', ta: 'துறை வடிகட்டி' },
    'admin.search': { en: 'Search complaints...', ta: 'புகார்களை தேடுங்கள்...' },
    'admin.updateStatus': { en: 'Update Status', ta: 'நிலையை புதுப்பி' },
    'admin.addComment': { en: 'Add comment...', ta: 'கருத்து சேர்...' },

    // ── Status Labels ─────────────────────────────────────────────
    'status.all': { en: 'All', ta: 'அனைத்தும்' },
    'status.pending': { en: 'Pending', ta: 'நிலுவை' },
    'status.in_progress': { en: 'In Progress', ta: 'செயலில்' },
    'status.resolved': { en: 'Resolved', ta: 'தீர்வு' },
    'status.escalated': { en: 'Escalated', ta: 'முன்னிலை' },
    'status.closed': { en: 'Closed', ta: 'மூடப்பட்டது' },

    // ── Priority Labels ──────────────────────────────────────────
    'priority.low': { en: 'Low', ta: 'குறைவு' },
    'priority.medium': { en: 'Medium', ta: 'நடுத்தரம்' },
    'priority.high': { en: 'High', ta: 'அதிகம்' },
    'priority.urgent': { en: 'Urgent', ta: 'அவசரம்' },

    // ── Chatbot Messages ──────────────────────────────────────────
    'chat.welcome': {
        en: "Hello! 👋 I'm your complaint assistant. I'll help you file a public complaint step by step. Let's get started!\n\nWhat type of issue would you like to report?",
        ta: "வணக்கம்! 👋 நான் உங்கள் புகார் உதவியாளர். படிப்படியாக பொதுப் புகாரை பதிவு செய்ய உதவுவேன். தொடங்குவோம்!\n\nஎந்த வகையான பிரச்சனையை புகார் செய்ய விரும்புகிறீர்கள்?"
    },
    'chat.askDescription': {
        en: "Please describe the problem in detail. What exactly is the issue?",
        ta: "பிரச்சனையை விரிவாக விவரிக்கவும். சரியாக என்ன பிரச்சனை?"
    },
    'chat.deptDetected': {
        en: "🎯 Department auto-detected:",
        ta: "🎯 துறை தானாக கண்டறியப்பட்டது:"
    },
    'chat.askTitle': {
        en: "Give a short title for your complaint (e.g., 'Pothole on Main Road')",
        ta: "உங்கள் புகாருக்கு ஒரு சுருக்கமான தலைப்பு கொடுங்கள் (எ.கா., 'பிரதான சாலையில் குழி')"
    },
    'chat.askMedia': {
        en: "Would you like to attach photos or videos as evidence? You can drag & drop files or click to browse.",
        ta: "சான்றாக புகைப்படங்கள் அல்லது வீடியோக்களை இணைக்க விரும்புகிறீர்களா? கோப்புகளை இழுத்து விடவும் அல்லது உலாவ கிளிக் செய்யவும்."
    },
    'chat.askLocation': {
        en: "Please share the location of the issue. I can auto-detect your GPS location or you can pick on the map.",
        ta: "பிரச்சனையின் இருப்பிடத்தைப் பகிரவும். உங்கள் GPS இருப்பிடத்தை தானாக கண்டறியலாம் அல்லது வரைபடத்தில் தேர்வு செய்யலாம்."
    },
    'chat.askPriority': {
        en: "What is the priority level of this complaint?",
        ta: "இந்தப் புகாரின் முன்னுரிமை நிலை என்ன?"
    },
    'chat.summary': {
        en: "📋 Here's a summary of your complaint. Please review and confirm:",
        ta: "📋 உங்கள் புகாரின் சுருக்கம் இதோ. சரிபார்த்து உறுதிப்படுத்தவும்:"
    },
    'chat.success': {
        en: "✅ Your complaint has been successfully registered!",
        ta: "✅ உங்கள் புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!"
    },
    'chat.trackInfo': {
        en: "You can track your complaint using this ID anytime.",
        ta: "இந்த எண்ணைப் பயன்படுத்தி எந்நேரமும் உங்கள் புகாரை கண்காணிக்கலாம்."
    },
    'chat.skipMedia': { en: 'Skip', ta: 'தவிர்' },
    'chat.skipLocation': { en: 'Skip Location', ta: 'இருப்பிடம் தவிர்' },
    'chat.detectLocation': { en: '📍 Detect My Location', ta: '📍 என் இருப்பிடம் கண்டறி' },
    'chat.confirmSubmit': { en: '✅ Confirm & Submit', ta: '✅ உறுதி & சமர்ப்பி' },
    'chat.edit': { en: '✏️ Edit', ta: '✏️ திருத்து' },
    'chat.newComplaint': { en: '📝 New Complaint', ta: '📝 புதிய புகார்' },
    'chat.viewDashboard': { en: '📊 View Dashboard', ta: '📊 டாஷ்போர்டு காண்' },
    'chat.placeholder': { en: 'Type your message...', ta: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...' },
    'chat.uploadHint': { en: 'Drag & drop or click to upload (Images & Videos)', ta: 'இழுத்து விடுங்கள் அல்லது பதிவேற்ற கிளிக் செய்யுங்கள்' },
    'chat.filesAttached': { en: 'files attached', ta: 'கோப்புகள் இணைக்கப்பட்டன' },
    'chat.continue': { en: 'Continue ➜', ta: 'தொடர் ➜' },
    'chat.done': { en: 'Done ✓', ta: 'முடிந்தது ✓' },

    // ── Categories ────────────────────────────────────────────────
    'cat.road': { en: '🛣️ Roads & Infrastructure', ta: '🛣️ சாலை & உட்கட்டமைப்பு' },
    'cat.water': { en: '💧 Water Supply', ta: '💧 நீர் வழங்கல்' },
    'cat.electricity': { en: '⚡ Electricity', ta: '⚡ மின்சாரம்' },
    'cat.sanitation': { en: '🧹 Sanitation & Garbage', ta: '🧹 தூய்மை & குப்பை' },
    'cat.safety': { en: '👮 Public Safety', ta: '👮 பொது பாதுகாப்பு' },
    'cat.health': { en: '🏥 Health', ta: '🏥 சுகாதாரம்' },
    'cat.education': { en: '📚 Education', ta: '📚 கல்வி' },
    'cat.environment': { en: '🌿 Environment', ta: '🌿 சுற்றுச்சூழல்' },
    'cat.other': { en: '📋 Other', ta: '📋 மற்றவை' },

    // ── Track Page ────────────────────────────────────────────────
    'track.title': { en: 'Track Your Complaint', ta: 'உங்கள் புகாரை கண்காணிக்கவும்' },
    'track.subtitle': { en: 'Enter your Complaint ID to check the current status', ta: 'தற்போதைய நிலையைச் சரிபார்க்க உங்கள் புகார் எண்ணை உள்ளிடவும்' },
    'track.placeholder': { en: 'PCMS-2026-XXXXXX', ta: 'PCMS-2026-XXXXXX' },
    'track.btn': { en: '🔍 Track', ta: '🔍 கண்காணி' },
    'track.notFound': { en: 'Complaint not found. Please check the ID.', ta: 'புகார் கிடைக்கவில்லை. எண்ணை சரிபார்க்கவும்.' },

    // ── Details Page ──────────────────────────────────────────────
    'detail.title': { en: 'Complaint Details', ta: 'புகார் விவரங்கள்' },
    'detail.complaintId': { en: 'Complaint ID', ta: 'புகார் எண்' },
    'detail.category': { en: 'Category', ta: 'வகை' },
    'detail.department': { en: 'Department', ta: 'துறை' },
    'detail.priority': { en: 'Priority', ta: 'முன்னுரிமை' },
    'detail.status': { en: 'Status', ta: 'நிலை' },
    'detail.description': { en: 'Description', ta: 'விவரம்' },
    'detail.location': { en: 'Location', ta: 'இருப்பிடம்' },
    'detail.filedOn': { en: 'Filed On', ta: 'பதிவு தேதி' },
    'detail.lastUpdate': { en: 'Last Updated', ta: 'கடைசி புதுப்பிப்பு' },
    'detail.timeline': { en: 'Status Timeline', ta: 'நிலை காலவரிசை' },
    'detail.evidence': { en: 'Evidence / Attachments', ta: 'சான்று / இணைப்புகள்' },
    'detail.noMedia': { en: 'No attachments', ta: 'இணைப்புகள் இல்லை' },

    // ── Common ────────────────────────────────────────────────────
    'common.loading': { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
    'common.error': { en: 'Something went wrong', ta: 'ஏதோ தவறு நடந்தது' },
    'common.success': { en: 'Success!', ta: 'வெற்றி!' },
    'common.cancel': { en: 'Cancel', ta: 'ரத்து' },
    'common.save': { en: 'Save', ta: 'சேமி' },
    'common.delete': { en: 'Delete', ta: 'நீக்கு' },
    'common.back': { en: 'Back', ta: 'பின்' },
    'common.yes': { en: 'Yes', ta: 'ஆம்' },
    'common.no': { en: 'No', ta: 'இல்லை' },
};

// Current language state
let currentLang = localStorage.getItem('pcms_lang') || 'en';

/**
 * Get translated text
 */
function t(key) {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[currentLang] || entry['en'] || key;
}

/**
 * Get both languages text
 */
function tBoth(key) {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return `${entry['en']} / ${entry['ta']}`;
}

/**
 * Toggle language
 */
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ta' : 'en';
    localStorage.setItem('pcms_lang', currentLang);
    updatePageLanguage();
    return currentLang;
}

/**
 * Set specific language
 */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pcms_lang', currentLang);
    updatePageLanguage();
}

/**
 * Update all [data-i18n] elements on page
 */
function updatePageLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    // Update lang toggle button
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.textContent = currentLang === 'en' ? 'தமிழ்' : 'ENG';
    }
}
