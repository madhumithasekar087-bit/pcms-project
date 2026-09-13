/**
 * PCMS — Core Application Logic
 * Theme toggle, navigation, toast notifications, utilities
 */

// ── Theme Management ──────────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('pcms_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pcms_theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ── Toast Notifications ───────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '<i class="fa-solid fa-circle-check"></i>', error: '<i class="fa-solid fa-circle-xmark"></i>', warning: '<i class="fa-solid fa-triangle-exclamation"></i>', info: '<i class="fa-solid fa-circle-info"></i>' };
    toast.innerHTML = `<span style="font-size: 18px;">${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ── API Helper ────────────────────────────────────────────────────────────
async function apiCall(url, options = {}) {
    try {
        const defaults = {
            headers: { 'Content-Type': 'application/json' },
        };
        const config = { ...defaults, ...options };
        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            config.body = JSON.stringify(options.body);
        }
        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
            config.body = options.body;
        }

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                showToast(data.error || 'Session expired, redirecting...', 'warning', 2000);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                throw new Error(data.error || 'Unauthorized');
            }
            throw new Error(data.error || 'Request failed');
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ── Auth Helpers ──────────────────────────────────────────────────────────
async function checkAuth() {
    try {
        const user = await apiCall('/api/user');
        return user;
    } catch {
        return null;
    }
}

async function logout() {
    try {
        const data = await apiCall('/api/logout', { method: 'POST' });
        window.location.href = data.redirect || '/';
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ── Navigation ────────────────────────────────────────────────────────────
function initNavigation() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Language toggle
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.addEventListener('click', () => {
        toggleLanguage();
        showToast(currentLang === 'en' ? 'Language: English' : 'மொழி: தமிழ்', 'info', 2000);
    });

    // Logout buttons
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
}

// ── Date Formatting ───────────────────────────────────────────────────────
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return currentLang === 'ta' ? 'இப்போது' : 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ── Simple Chart Drawing (Canvas) ─────────────────────────────────────────
function drawPieChart(canvasId, data, colors, onClick) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    const total = data.reduce((sum, d) => sum + d.value, 0);

    if (total === 0) {
        ctx.fillStyle = '#6B6B80';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(t('dash.noComplaints'), centerX, centerY);
        return;
    }

    let startAngle = -Math.PI / 2;
    const sliceRegions = [];

    data.forEach((item, i) => {
        const sliceAngle = (item.value / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        sliceRegions.push({
            item,
            startAngle,
            endAngle,
            color: colors[i % colors.length]
        });

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Draw label
        if (item.value > 0 && sliceAngle > 0.15) {
            const midAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + (radius * 0.65) * Math.cos(midAngle);
            const labelY = centerY + (radius * 0.65) * Math.sin(midAngle);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(item.value / total * 100)}%`, labelX, labelY);
        }

        startAngle = endAngle;
    });

    // Legend
    const legendRegions = [];
    let legendY = canvas.height - 10;
    ctx.font = '11px Inter';
    ctx.textAlign = 'left';
    let legendX = 10;
    data.forEach((item, i) => {
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(legendX, legendY - 8, 10, 10);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#A0A0B8';
        const labelText = `${item.label}: ${item.value}`;
        ctx.fillText(labelText, legendX + 14, legendY);

        const textW = ctx.measureText(labelText).width;
        legendRegions.push({
            item,
            x: legendX,
            y: legendY - 10,
            w: textW + 20,
            h: 14
        });

        legendX += textW + 30;
        if (legendX > canvas.width - 50) {
            legendX = 10;
            legendY += 18;
        }
    });

    // Add interactivity
    if (onClick) {
        canvas.style.cursor = 'pointer';
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            // Check pie slices click
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                let angle = Math.atan2(dy, dx);
                if (angle < -Math.PI / 2) angle += Math.PI * 2;

                const clickedSlice = sliceRegions.find(s => angle >= s.startAngle && angle <= s.endAngle);
                if (clickedSlice) {
                    onClick(clickedSlice.item);
                    return;
                }
            }

            // Check legend click
            const clickedLegend = legendRegions.find(l => 
                mouseX >= l.x && mouseX <= l.x + l.w &&
                mouseY >= l.y && mouseY <= l.y + l.h
            );
            if (clickedLegend) {
                onClick(clickedLegend.item);
            }
        };
    }
}

function drawBarChart(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const padding = { top: 20, right: 20, bottom: 40, left: 45 };
    const chartW = canvas.width - padding.left - padding.right;
    const chartH = canvas.height - padding.top - padding.bottom;
    const maxVal = Math.max(...data.map(d => d.value), 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) {
        ctx.fillStyle = '#6B6B80';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No data', canvas.width / 2, canvas.height / 2);
        return;
    }

    const barWidth = Math.min(40, (chartW / data.length) * 0.6);
    const gap = (chartW - barWidth * data.length) / (data.length + 1);

    // Y-axis labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#6B6B80';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + chartH - (chartH / 4) * i;
        const val = Math.round((maxVal / 4) * i);
        ctx.fillText(val, padding.left - 8, y + 4);

        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(canvas.width - padding.right, y);
        ctx.stroke();
    }

    // Bars
    data.forEach((item, i) => {
        const x = padding.left + gap + (barWidth + gap) * i;
        const barH = (item.value / maxVal) * chartH;
        const y = padding.top + chartH - barH;

        // Bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '33');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
        ctx.fill();

        // Value on top
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#EAEAEA';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        if (item.value > 0) {
            ctx.fillText(item.value, x + barWidth / 2, y - 6);
        }

        // Label
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#6B6B80';
        ctx.font = '10px Inter';
        ctx.fillText(item.label, x + barWidth / 2, padding.top + chartH + 18);
    });
}

// ── SPA Tab Navigation Switcher ──────────────────────────────────────────
function switchTab(tabId, pushState = true) {
    const panels = document.querySelectorAll('.view-panel');
    if (!panels.length) return; // Not on SPA page

    let targetId = tabId;
    if (!document.getElementById(`view-${targetId}`)) {
        targetId = 'home';
    }

    // Deactivate all panels
    panels.forEach(p => p.classList.remove('active'));

    // Deactivate all nav links
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === targetId) {
            link.classList.add('active');
        }
    });

    // Activate target panel
    const targetPanel = document.getElementById(`view-${targetId}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.scrollTop = 0;
    }

    // Push hash to URL
    if (pushState && window.location.hash !== `#${targetId}`) {
        history.pushState(null, '', `#${targetId}`);
    }
}

function initSpaRouter() {
    const panels = document.querySelectorAll('.view-panel');
    if (!panels.length) return;

    // Add spa-body class to body
    document.body.classList.add('spa-body');

    // Handle hash on page load
    const initialHash = window.location.hash.replace('#', '') || 'home';
    switchTab(initialHash, false);

    // Listen to hash change (back/forward)
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        switchTab(hash, false);
    });

    // Bind tab links
    document.querySelectorAll('[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

function switchStep(stepNum) {
    const btns = document.querySelectorAll('.step-nav-btn');
    const cards = document.querySelectorAll('.step-content-card');
    
    btns.forEach(b => b.classList.remove('active'));
    cards.forEach(c => c.classList.remove('active'));

    const activeBtn = document.querySelector(`.step-nav-btn[data-step="${stepNum}"]`);
    const activeCard = document.getElementById(`step-card-${stepNum}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeCard) activeCard.classList.add('active');
}

// ── Global Tracking & Category Helpers ─────────────────────────────────────
async function trackComplaint() {
    const input = document.getElementById('trackInput');
    if (!input) return;
    const id = input.value.trim();
    if (!id) {
        showToast(currentLang === 'ta' ? 'தயவுசெய்து புகா எண் உள்ளிடவும்' : 'Please enter a Complaint ID', 'warning');
        return;
    }

    const resultEl = document.getElementById('trackResult');
    const notFoundEl = document.getElementById('trackNotFound');
    if (resultEl) resultEl.style.display = 'none';
    if (notFoundEl) notFoundEl.style.display = 'none';

    try {
        const data = await apiCall(`/api/track/${id}`);

        if (document.getElementById('trackId')) document.getElementById('trackId').textContent = data.complaint_id;
        if (document.getElementById('trackTitle')) document.getElementById('trackTitle').textContent = data.title;
        if (document.getElementById('trackCategory')) document.getElementById('trackCategory').textContent = data.category;
        if (document.getElementById('trackDept')) document.getElementById('trackDept').textContent = data.department;
        if (document.getElementById('trackAddress')) document.getElementById('trackAddress').textContent = data.address || '-';
        if (document.getElementById('trackDate')) document.getElementById('trackDate').textContent = formatDate(data.created_at);
        if (document.getElementById('trackUpdated')) document.getElementById('trackUpdated').textContent = formatDate(data.updated_at);

        const statusEl = document.getElementById('trackStatus');
        if (statusEl) {
            statusEl.className = `badge badge-${data.status}`;
            statusEl.textContent = typeof t === 'function' ? t('status.' + data.status) : data.status;
        }

        const priorityEl = document.getElementById('trackPriority');
        if (priorityEl) {
            priorityEl.textContent = typeof t === 'function' ? t('priority.' + data.priority) : data.priority;
        }

        updateStepProgress(data.status);

        const timeline = document.getElementById('trackTimeline');
        const replyBox = document.getElementById('trackReplyBox');
        if (replyBox) replyBox.style.display = 'none';

        if (data.updates && data.updates.length > 0 && timeline) {
            timeline.innerHTML = data.updates.map(u => `
                <div class="timeline-item">
                    <div class="timeline-date">${formatDate(u.created_at)}</div>
                    <div class="timeline-status">
                        <span class="badge badge-${u.new_status}">${typeof t === 'function' ? t('status.' + u.new_status) : u.new_status}</span>
                    </div>
                    <div class="timeline-comment">${u.comment || ''}</div>
                </div>
            `).join('');

            const latestCommentUpdate = data.updates.filter(u => u.comment && u.comment.trim()).pop();
            if (latestCommentUpdate && replyBox) {
                if (document.getElementById('trackReplyContent')) document.getElementById('trackReplyContent').textContent = latestCommentUpdate.comment;
                if (document.getElementById('trackReplyTime')) document.getElementById('trackReplyTime').textContent = formatDate(latestCommentUpdate.created_at);
                replyBox.style.display = 'block';
            }
        }

        if (resultEl) resultEl.style.display = 'block';

    } catch (error) {
        if (notFoundEl) notFoundEl.style.display = 'block';
    }
}

function updateStepProgress(status) {
    const s1 = document.getElementById('stepSubmitted');
    const s2 = document.getElementById('stepAssigned');
    const s3 = document.getElementById('stepProgress');
    const s4 = document.getElementById('stepResolved');

    [s1, s2, s3, s4].forEach(s => { if(s) s.className = 'progress-step'; });

    if (status === 'pending') {
        if (s1) s1.classList.add('active');
    } else if (status === 'in_progress') {
        if (s1) s1.classList.add('completed');
        if (s2) s2.classList.add('completed');
        if (s3) s3.classList.add('active');
    } else if (status === 'resolved' || status === 'closed') {
        if (s1) s1.classList.add('completed');
        if (s2) s2.classList.add('completed');
        if (s3) s3.classList.add('completed');
        if (s4) s4.classList.add('completed');
    } else if (status === 'escalated') {
        if (s1) s1.classList.add('completed');
        if (s2) s2.classList.add('completed');
        if (s3) s3.classList.add('active');
    }
}

function selectQuickCategory(categoryName) {
    setTimeout(() => {
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = categoryName;
        }
    }, 400);
}

// ── Page Loader ───────────────────────────────────────────────────────────
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }
}

// ── Initialize ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSpaRouter();
    updatePageLanguage();
    setTimeout(hideLoader, 300);
});


