/**
 * PCMS — Chatbot Engine
 * Handles step-by-step complaint filing conversation
 */

// ── Chatbot State ─────────────────────────────────────────────────────────
const chatState = {
    step: 'welcome',    // welcome, category, description, title, media, location, priority, summary, submitted
    category: '',
    description: '',
    title: '',
    department: '',
    priority: 'medium',
    latitude: null,
    longitude: null,
    address: '',
    mediaFiles: [],
    complaintId: null,
};

const STEPS = ['welcome', 'category', 'description', 'title', 'media', 'location', 'priority', 'summary', 'submitted'];

// ── Category Quick Replies ────────────────────────────────────────────────
const CATEGORIES = [
    { key: 'road', icon: '🛣️', en: 'Roads & Infrastructure', ta: 'சாலை & உட்கட்டமைப்பு' },
    { key: 'water', icon: '💧', en: 'Water Supply', ta: 'நீர் வழங்கல்' },
    { key: 'electricity', icon: '⚡', en: 'Electricity', ta: 'மின்சாரம்' },
    { key: 'sanitation', icon: '🧹', en: 'Sanitation & Garbage', ta: 'தூய்மை & குப்பை' },
    { key: 'safety', icon: '👮', en: 'Public Safety', ta: 'பொது பாதுகாப்பு' },
    { key: 'health', icon: '🏥', en: 'Health', ta: 'சுகாதாரம்' },
    { key: 'education', icon: '📚', en: 'Education', ta: 'கல்வி' },
    { key: 'environment', icon: '🌿', en: 'Environment', ta: 'சுற்றுச்சூழல்' },
    { key: 'other', icon: '📋', en: 'Other', ta: 'மற்றவை' },
];

const PRIORITIES = [
    { key: 'low', icon: '🟢', en: 'Low', ta: 'குறைவு' },
    { key: 'medium', icon: '🟡', en: 'Medium', ta: 'நடுத்தரம்' },
    { key: 'high', icon: '🟠', en: 'High', ta: 'அதிகம்' },
    { key: 'urgent', icon: '🔴', en: 'Urgent', ta: 'அவசரம்' },
];

// ── DOM References ────────────────────────────────────────────────────────
let messagesContainer, chatInput, sendBtn, fileInput;

// ── Initialize Chatbot ────────────────────────────────────────────────────
function initChatbot() {
    messagesContainer = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('chatSendBtn');
    fileInput = document.getElementById('fileInput');

    if (!messagesContainer) return;

    // Send button
    sendBtn.addEventListener('click', handleSendMessage);

    // Enter key
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // File input
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Start conversation
    setTimeout(() => {
        showWelcomeMessage();
    }, 500);
}

// ── Message Display Functions ─────────────────────────────────────────────
function addBotMessage(text, delay = 600) {
    // Show typing indicator
    const typing = showTypingIndicator();

    return new Promise(resolve => {
        setTimeout(() => {
            typing.remove();
            const msgEl = createMessageElement('bot', text);
            messagesContainer.appendChild(msgEl);
            scrollToBottom();
            resolve(msgEl);
        }, delay);
    });
}

function addUserMessage(text) {
    const msgEl = createMessageElement('user', text);
    messagesContainer.appendChild(msgEl);
    scrollToBottom();
}

function createMessageElement(type, text) {
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'bot' ? '🤖' : '👤';

    const content = document.createElement('div');
    content.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>');

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    content.appendChild(bubble);
    content.appendChild(time);
    msg.appendChild(avatar);
    msg.appendChild(content);

    return msg;
}

function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'message message-bot';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typing);
    scrollToBottom();
    return typing;
}

function addQuickReplies(options) {
    const container = document.createElement('div');
    container.className = 'quick-replies';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = `${opt.icon || ''} ${currentLang === 'ta' ? opt.ta : opt.en}`.trim();
        btn.addEventListener('click', () => {
            container.remove();
            opt.action();
        });
        container.appendChild(btn);
    });

    messagesContainer.appendChild(container);
    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// ── Conversation Flow ─────────────────────────────────────────────────────
async function showWelcomeMessage() {
    await addBotMessage(t('chat.welcome'), 800);

    // Show category quick replies
    chatState.step = 'category';
    addQuickReplies(CATEGORIES.map(cat => ({
        icon: cat.icon,
        en: cat.en,
        ta: cat.ta,
        action: () => selectCategory(cat)
    })));

    updateInputState();
}

async function selectCategory(cat) {
    chatState.category = `${cat.icon} ${currentLang === 'ta' ? cat.ta : cat.en}`;
    addUserMessage(chatState.category);

    chatState.step = 'description';
    await addBotMessage(t('chat.askDescription'));
    updateInputState();
    chatInput.focus();
}

async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    chatInput.style.height = 'auto';

    switch (chatState.step) {
        case 'category':
            chatState.category = text;
            addUserMessage(text);
            chatState.step = 'description';
            await addBotMessage(t('chat.askDescription'));
            break;

        case 'description':
            chatState.description = text;
            addUserMessage(text);

            // Auto-detect department
            try {
                const result = await apiCall('/api/classify', {
                    method: 'POST',
                    body: { text: `${chatState.category} ${text}` }
                });
                chatState.department = result.department;

                await addBotMessage(`${t('chat.deptDetected')}`);
                const deptBadge = document.createElement('div');
                deptBadge.className = 'dept-detected';
                deptBadge.innerHTML = `<span class="dept-icon">🏛️</span> ${chatState.department}`;
                messagesContainer.appendChild(deptBadge);
                scrollToBottom();
            } catch (e) {
                chatState.department = 'General / பொது';
            }

            chatState.step = 'title';
            await addBotMessage(t('chat.askTitle'), 800);
            break;

        case 'title':
            chatState.title = text;
            addUserMessage(text);
            chatState.step = 'media';
            await addBotMessage(t('chat.askMedia'));
            showMediaUpload();
            break;

        case 'location_manual':
            chatState.address = text;
            addUserMessage(text);
            chatState.step = 'priority';
            await addBotMessage(t('chat.askPriority'));
            showPriorityOptions();
            break;

        default:
            addUserMessage(text);
    }

    updateInputState();
}

// ── Media Upload Step ─────────────────────────────────────────────────────
function showMediaUpload() {
    const uploadZone = document.createElement('div');
    uploadZone.className = 'upload-zone';
    uploadZone.id = 'uploadZone';
    uploadZone.innerHTML = `
        <div class="upload-icon">📁</div>
        <p>${t('chat.uploadHint')}</p>
        <p class="upload-hint">JPG, PNG, GIF, MP4, WebM (Max 50MB)</p>
    `;

    // Media preview area
    const previewArea = document.createElement('div');
    previewArea.className = 'chat-media-preview';
    previewArea.id = 'mediaPreview';

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleDroppedFiles(e.dataTransfer.files);
    });

    messagesContainer.appendChild(uploadZone);
    messagesContainer.appendChild(previewArea);

    // Action buttons
    addQuickReplies([
        { icon: '', en: 'Continue ➜', ta: 'தொடர் ➜', action: () => finishMediaStep() },
        { icon: '', en: 'Skip', ta: 'தவிர்', action: () => skipMedia() }
    ]);

    scrollToBottom();
}

function handleFileSelect(e) {
    handleDroppedFiles(e.target.files);
}

function handleDroppedFiles(files) {
    const previewArea = document.getElementById('mediaPreview');
    if (!previewArea) return;

    Array.from(files).forEach(file => {
        if (file.size > 50 * 1024 * 1024) {
            showToast('File too large (max 50MB)', 'warning');
            return;
        }

        chatState.mediaFiles.push(file);

        const item = document.createElement('div');
        item.className = 'media-preview-item';

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            item.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const vid = document.createElement('video');
            vid.src = URL.createObjectURL(file);
            vid.muted = true;
            item.appendChild(vid);
        }

        const removeBtn = document.createElement('button');
        removeBtn.className = 'media-preview-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
            const idx = chatState.mediaFiles.indexOf(file);
            if (idx > -1) chatState.mediaFiles.splice(idx, 1);
            item.remove();
        });
        item.appendChild(removeBtn);

        previewArea.appendChild(item);
    });

    scrollToBottom();
}

async function finishMediaStep() {
    if (chatState.mediaFiles.length > 0) {
        addUserMessage(`📎 ${chatState.mediaFiles.length} ${t('chat.filesAttached')}`);
    }
    chatState.step = 'location';
    await addBotMessage(t('chat.askLocation'));
    showLocationPicker();
}

async function skipMedia() {
    addUserMessage(t('chat.skipMedia'));
    chatState.step = 'location';
    await addBotMessage(t('chat.askLocation'));
    showLocationPicker();
}

// ── Location Step ─────────────────────────────────────────────────────────
function showLocationPicker() {
    const picker = document.createElement('div');
    picker.className = 'location-picker';

    picker.innerHTML = `
        <div class="map-container" id="chatMap"></div>
        <div class="location-info" id="locationInfo">
            <span class="location-icon">📍</span>
            <span id="locationText">${currentLang === 'ta' ? 'இருப்பிடம் தேர்வு செய்யப்படவில்லை' : 'No location selected'}</span>
        </div>
        <div class="location-actions">
        </div>
    `;

    messagesContainer.appendChild(picker);

    // Init map
    setTimeout(() => initChatMap(), 200);

    // Action buttons
    addQuickReplies([
        { icon: '📍', en: 'Detect My Location', ta: 'என் இருப்பிடம் கண்டறி', action: () => detectGPSLocation() },
        { icon: '', en: 'Skip Location', ta: 'இருப்பிடம் தவிர்', action: () => skipLocation() }
    ]);

    scrollToBottom();
}

function initChatMap() {
    const mapDiv = document.getElementById('chatMap');
    if (!mapDiv || typeof L === 'undefined') return;

    const map = L.map('chatMap').setView([13.0827, 80.2707], 12); // Default: Chennai

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    window._chatMarker = null;

    map.on('click', (e) => {
        chatState.latitude = e.latlng.lat;
        chatState.longitude = e.latlng.lng;

        if (window._chatMarker) window._chatMarker.remove();
        window._chatMarker = L.marker(e.latlng).addTo(map);

        // Reverse geocode
        reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    window._chatMap = map;
}

async function detectGPSLocation() {
    if (!navigator.geolocation) {
        showToast('GPS not supported', 'warning');
        return;
    }

    addUserMessage(t('chat.detectLocation'));

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            chatState.latitude = pos.coords.latitude;
            chatState.longitude = pos.coords.longitude;

            // Update map
            if (window._chatMap) {
                window._chatMap.setView([chatState.latitude, chatState.longitude], 16);
                if (window._chatMarker) window._chatMarker.remove();
                window._chatMarker = L.marker([chatState.latitude, chatState.longitude]).addTo(window._chatMap);
            }

            await reverseGeocode(chatState.latitude, chatState.longitude);

            // Auto proceed to next step
            setTimeout(async () => {
                chatState.step = 'priority';
                await addBotMessage(t('chat.askPriority'));
                showPriorityOptions();
            }, 1000);
        },
        (err) => {
            showToast(currentLang === 'ta' ? 'இருப்பிடம் கண்டறிய முடியவில்லை' : 'Could not detect location', 'warning');
            chatState.step = 'location_manual';
            addBotMessage(currentLang === 'ta' ? 'முகவரியை தட்டச்சு செய்யுங்கள்:' : 'Please type the address manually:');
            updateInputState();
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

async function reverseGeocode(lat, lng) {
    try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await resp.json();
        chatState.address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        const locText = document.getElementById('locationText');
        if (locText) locText.textContent = chatState.address;
    } catch {
        chatState.address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

async function skipLocation() {
    addUserMessage(t('chat.skipLocation'));
    chatState.step = 'priority';
    await addBotMessage(t('chat.askPriority'));
    showPriorityOptions();
}

// ── Priority Step ─────────────────────────────────────────────────────────
function showPriorityOptions() {
    addQuickReplies(PRIORITIES.map(p => ({
        icon: p.icon,
        en: p.en,
        ta: p.ta,
        action: () => selectPriority(p)
    })));
    updateInputState();
}

async function selectPriority(p) {
    chatState.priority = p.key;
    addUserMessage(`${p.icon} ${currentLang === 'ta' ? p.ta : p.en}`);
    chatState.step = 'summary';
    await showSummary();
}

// ── Summary Step ──────────────────────────────────────────────────────────
async function showSummary() {
    await addBotMessage(t('chat.summary'));

    const summary = document.createElement('div');
    summary.className = 'complaint-summary';

    const priorityObj = PRIORITIES.find(p => p.key === chatState.priority);

    summary.innerHTML = `
        <div class="summary-card">
            <h4>📋 ${currentLang === 'ta' ? 'புகார் சுருக்கம்' : 'Complaint Summary'}</h4>
            <div class="summary-row">
                <span class="label">${t('detail.category')}</span>
                <span class="value">${chatState.category}</span>
            </div>
            <div class="summary-row">
                <span class="label">${currentLang === 'ta' ? 'தலைப்பு' : 'Title'}</span>
                <span class="value">${chatState.title}</span>
            </div>
            <div class="summary-row">
                <span class="label">${t('detail.description')}</span>
                <span class="value">${chatState.description.substring(0, 100)}${chatState.description.length > 100 ? '...' : ''}</span>
            </div>
            <div class="summary-row">
                <span class="label">${t('detail.department')}</span>
                <span class="value">${chatState.department}</span>
            </div>
            <div class="summary-row">
                <span class="label">${t('detail.priority')}</span>
                <span class="value">${priorityObj ? priorityObj.icon + ' ' + (currentLang === 'ta' ? priorityObj.ta : priorityObj.en) : chatState.priority}</span>
            </div>
            <div class="summary-row">
                <span class="label">${t('detail.location')}</span>
                <span class="value">${chatState.address || (currentLang === 'ta' ? 'குறிப்பிடப்படவில்லை' : 'Not specified')}</span>
            </div>
            <div class="summary-row">
                <span class="label">${currentLang === 'ta' ? 'இணைப்புகள்' : 'Attachments'}</span>
                <span class="value">${chatState.mediaFiles.length} ${currentLang === 'ta' ? 'கோப்புகள்' : 'files'}</span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(summary);
    scrollToBottom();

    // Confirm/Edit buttons
    addQuickReplies([
        { icon: '✅', en: 'Confirm & Submit', ta: 'உறுதி & சமர்ப்பி', action: () => submitComplaint() },
        { icon: '✏️', en: 'Start Over', ta: 'மீண்டும் தொடங்கு', action: () => resetChatbot() }
    ]);
}

// ── Submit Complaint ──────────────────────────────────────────────────────
async function submitComplaint() {
    addUserMessage(t('chat.confirmSubmit'));

    const typing = showTypingIndicator();

    try {
        // Create complaint
        const result = await apiCall('/api/complaints', {
            method: 'POST',
            body: {
                title: chatState.title,
                description: chatState.description,
                category: chatState.category,
                priority: chatState.priority,
                latitude: chatState.latitude,
                longitude: chatState.longitude,
                address: chatState.address,
            }
        });

        chatState.complaintId = result.complaint_id;

        // Upload media if any
        if (chatState.mediaFiles.length > 0) {
            const formData = new FormData();
            chatState.mediaFiles.forEach(file => formData.append('files', file));

            await apiCall(`/api/complaints/${chatState.complaintId}/upload`, {
                method: 'POST',
                body: formData,
            });
        }

        typing.remove();
        chatState.step = 'submitted';

        await addBotMessage(t('chat.success'));

        // Success card
        const successCard = document.createElement('div');
        successCard.className = 'success-card glass-card-static';
        successCard.innerHTML = `
            <div class="success-icon">✅</div>
            <h3>${currentLang === 'ta' ? 'புகார் பதிவு வெற்றி!' : 'Complaint Registered!'}</h3>
            <div class="complaint-id-display">${chatState.complaintId}</div>
            <p style="color: var(--text-secondary); font-size: var(--font-size-sm);">
                ${t('chat.trackInfo')}
            </p>
            <p style="color: var(--text-secondary); font-size: var(--font-size-sm); margin-top: 8px;">
                🏛️ ${currentLang === 'ta' ? 'அனுப்பப்பட்ட துறை' : 'Routed to'}: <strong>${result.department}</strong>
            </p>
        `;
        messagesContainer.appendChild(successCard);
        scrollToBottom();

        // Next actions
        addQuickReplies([
            { icon: '📝', en: 'New Complaint', ta: 'புதிய புகார்', action: () => resetChatbot() },
            { icon: '📊', en: 'View Dashboard', ta: 'டாஷ்போர்டு காண்', action: () => window.location.href = '/dashboard' },
        ]);

        updateInputState();

    } catch (error) {
        typing.remove();
        await addBotMessage(`❌ ${error.message}`);
        showToast(error.message, 'error');
    }
}

// ── Reset Chatbot ─────────────────────────────────────────────────────────
function resetChatbot() {
    chatState.step = 'welcome';
    chatState.category = '';
    chatState.description = '';
    chatState.title = '';
    chatState.department = '';
    chatState.priority = 'medium';
    chatState.latitude = null;
    chatState.longitude = null;
    chatState.address = '';
    chatState.mediaFiles = [];
    chatState.complaintId = null;

    window._chatMarker = null;
    window._chatMap = null;

    messagesContainer.innerHTML = '';
    setTimeout(() => showWelcomeMessage(), 300);
}

// ── Update Input State ────────────────────────────────────────────────────
function updateInputState() {
    if (!chatInput) return;

    const typingSteps = ['description', 'title', 'location_manual'];
    const isTypingStep = typingSteps.includes(chatState.step);

    chatInput.disabled = !isTypingStep;
    sendBtn.disabled = !isTypingStep;

    if (isTypingStep) {
        chatInput.placeholder = t('chat.placeholder');
        chatInput.focus();
    } else {
        chatInput.placeholder = currentLang === 'ta' ? 'மேலே உள்ள பொத்தான்களை பயன்படுத்தவும்...' : 'Use the buttons above...';
    }
}

// ── Init on DOM Load ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initChatbot);
