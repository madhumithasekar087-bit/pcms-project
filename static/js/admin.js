/**
 * PCMS — Admin Panel Logic
 * Handles admin dashboard: all complaints, filtering, status updates, escalation
 */

let allComplaints = [];
let filtersInitialized = false;

async function initAdmin() {
    const adminTable = document.getElementById('adminComplaintsList');
    if (!adminTable) return;

    try {
        const [stats, complaints] = await Promise.all([
            apiCall('/api/stats'),
            apiCall('/api/complaints')
        ]);

        allComplaints = complaints;
        renderAdminStats(stats);
        renderAdminComplaints(complaints);
        renderAdminCharts(stats);
        setupAdminFilters();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function renderAdminStats(stats) {
    document.getElementById('adminTotal').textContent = stats.total || 0;
    document.getElementById('adminPending').textContent = stats.pending || 0;
    document.getElementById('adminProgress').textContent = stats.in_progress || 0;
    document.getElementById('adminResolved').textContent = stats.resolved || 0;
    document.getElementById('adminEscalated').textContent = stats.escalated || 0;
}

function renderAdminComplaints(complaints) {
    const tbody = document.getElementById('adminComplaintsList');
    if (!tbody) return;

    if (complaints.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 40px; color: var(--text-muted);">
            ${currentLang === 'ta' ? 'புகார்கள் இல்லை' : 'No complaints found'}
        </td></tr>`;
        return;
    }

    tbody.innerHTML = complaints.map(c => `
        <tr onclick="viewComplaint('${c.complaint_id}')">
            <td><span style="color: var(--primary); font-family: monospace; font-weight: 700;">${c.complaint_id}</span></td>
            <td>${c.user_name || '-'}</td>
            <td style="font-weight: 600;">${c.title}</td>
            <td style="font-size: var(--font-size-xs);">${c.department}</td>
            <td><span class="badge badge-priority-${c.priority}">${c.priority}</span></td>
            <td><span class="badge badge-${c.status}">${t('status.' + c.status)}</span></td>
            <td style="font-size: var(--font-size-xs);">${formatDate(c.created_at)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); openStatusModal('${c.complaint_id}', '${c.status}')">
                    <i class="fa-solid fa-pen-to-square"></i> ${t('admin.updateStatus')}
                </button>
            </td>
        </tr>
    `).join('');
}

function renderAdminCharts(stats) {
    // Department pie chart
    const deptData = (stats.department_stats || []).map(d => ({
        label: d.department ? d.department.split('/')[0].trim() : 'Other',
        fullDept: d.department,
        value: d.cnt
    }));
    const deptColors = ['#2563EB', '#10B981', '#F43F5E', '#F59E0B', '#0EA5E9', '#8B5CF6', '#EC4899', '#6366F1'];
    
    drawPieChart('deptChart', deptData, deptColors, (item) => {
        const deptFilter = document.getElementById('filterDept');
        if (deptFilter) {
            const options = Array.from(deptFilter.options);
            const match = options.find(o => o.value === item.fullDept || (item.fullDept && o.value.includes(item.fullDept)) || o.value.includes(item.label));
            if (match) {
                deptFilter.value = match.value;
            } else if (item.fullDept) {
                deptFilter.value = item.fullDept;
            }
            applyAdminFilters();
            showToast(`${currentLang === 'ta' ? 'துறை வடிகட்டப்பட்டது' : 'Filtered by Department'}: ${item.label}`, 'info');
            scrollToAdminTable();
        }
    });

    // Status pie chart
    const statusData = [
        { label: 'Pending', statusKey: 'pending', value: stats.pending },
        { label: 'In Progress', statusKey: 'in_progress', value: stats.in_progress },
        { label: 'Resolved', statusKey: 'resolved', value: stats.resolved },
        { label: 'Escalated', statusKey: 'escalated', value: stats.escalated },
    ];
    drawPieChart('adminStatusChart', statusData, ['#F59E0B', '#0EA5E9', '#10B981', '#F43F5E'], (item) => {
        const statusFilter = document.getElementById('filterStatus');
        if (statusFilter) {
            statusFilter.value = item.statusKey;
            applyAdminFilters();
            showToast(`${currentLang === 'ta' ? 'நிலை வடிகட்டப்பட்டது' : 'Filtered by Status'}: ${item.label}`, 'info');
            scrollToAdminTable();
        }
    });
}

function scrollToAdminTable() {
    const tableEl = document.querySelector('.table-responsive') || document.getElementById('filterSearch');
    if (tableEl) {
        tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function setupAdminFilters() {
    const statusFilter = document.getElementById('filterStatus');
    const deptFilter = document.getElementById('filterDept');
    const searchInput = document.getElementById('filterSearch');

    if (deptFilter) {
        const officialDepts = [
            'Sanitation & Solid Waste / குப்பை மற்றும் தூய்மை',
            'Water Supply & Drainage / குடிநீர் மற்றும் வடிகால்',
            'Roads & Pavements / சாலை மற்றும் நடைபாதை',
            'Street Lights & Electricity / தெருவிளக்கு மற்றும் மின்சாரம்',
            'Stray Animals Control / தெரு விலங்குகள் கட்டுப்பாடு',
            'Public Parks & Facilities / பூங்கா மற்றும் பொது இடங்கள்',
            'Local Traffic & Encroachment / போக்குவரத்து மற்றும் ஆக்கிரமிப்புகள்'
        ];
        const extraDepts = allComplaints.map(c => c.department).filter(d => d && !officialDepts.includes(d));
        const depts = [...new Set([...officialDepts, ...extraDepts])];
        deptFilter.innerHTML = `<option value="">All Departments / அனைத்து துறைகள்</option>` +
            depts.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    if (filtersInitialized) return;

    if (statusFilter) {
        statusFilter.addEventListener('change', applyAdminFilters);
    }
    if (deptFilter) {
        deptFilter.addEventListener('change', applyAdminFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyAdminFilters, 300));
    }

    filtersInitialized = true;
function filterByStatCard(status) {
    const statusFilter = document.getElementById('filterStatus');
    if (statusFilter) {
        statusFilter.value = status;
        applyAdminFilters();
        
        document.querySelectorAll('#adminStatsGrid .stat-card').forEach(card => card.classList.remove('active'));
        const activeCard = document.querySelector(`#adminStatsGrid .stat-card[onclick*="'${status}'"]`);
        if (activeCard) activeCard.classList.add('active');

        const labelMap = { '': 'All Complaints', 'pending': 'Pending', 'in_progress': 'In Progress', 'resolved': 'Resolved', 'escalated': 'Escalated' };
        showToast(`${currentLang === 'ta' ? 'வடிகட்டப்பட்டது' : 'Filtered by'}: ${labelMap[status] || status}`, 'info');
        scrollToAdminTable();
    }
}

function applyAdminFilters() {
    const status = document.getElementById('filterStatus')?.value || '';
    const dept = document.getElementById('filterDept')?.value || '';
    const search = document.getElementById('filterSearch')?.value?.toLowerCase() || '';

    let filtered = allComplaints;

    if (status) filtered = filtered.filter(c => c.status === status);
    if (dept) filtered = filtered.filter(c => c.department === dept);
    if (search) {
        filtered = filtered.filter(c =>
            c.complaint_id.toLowerCase().includes(search) ||
            c.title.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search) ||
            (c.user_name || '').toLowerCase().includes(search)
        );
    }

    renderAdminComplaints(filtered);
}

// ── Status Update Modal ───────────────────────────────────────────────────
function openStatusModal(complaintId, currentStatus) {
    const modal = document.getElementById('statusModal');
    if (!modal) return;

    document.getElementById('modalComplaintId').textContent = complaintId;
    document.getElementById('modalStatusSelect').value = currentStatus;
    document.getElementById('modalComment').value = '';

    modal.classList.add('active');
}

function closeStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) modal.classList.remove('active');
}

async function updateComplaintStatus() {
    const complaintId = document.getElementById('modalComplaintId').textContent;
    const newStatus = document.getElementById('modalStatusSelect').value;
    const comment = document.getElementById('modalComment').value;

    try {
        await apiCall(`/api/complaints/${complaintId}/status`, {
            method: 'PUT',
            body: { status: newStatus, comment }
        });

        showToast(
            currentLang === 'ta' ? 'நிலை புதுப்பிக்கப்பட்டது!' : 'Status updated successfully!',
            'success'
        );
        closeStatusModal();

        // Refresh data
        initAdmin();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ── Quick Reply Modal Handlers ─────────────────────────────────────────────
function openReplyModal(complaintId, currentStatus) {
    const modal = document.getElementById('replyModal');
    if (!modal) return;

    document.getElementById('replyComplaintId').textContent = complaintId;
    document.getElementById('replyStatusSelect').value = currentStatus === 'pending' ? 'in_progress' : currentStatus;
    
    // Auto-fill initial template
    fillReplyTemplate(1);

    modal.classList.add('active');
}

function fillReplyTemplate(id) {
    const textEl = document.getElementById('replyText');
    const statusSelect = document.getElementById('replyStatusSelect');
    if (!textEl) return;

    if (id === 1) {
        textEl.value = currentLang === 'ta'
            ? 'நாங்கள் உங்கள் புகாரைப் பார்த்துள்ளோம். விரைவாக சரிசெய்கிறோம் / We have seen your complaint and will solve it as soon as possible.'
            : 'We have seen your complaint and will solve it as soon as possible. / நாங்கள் உங்கள் புகாரைப் பார்த்துள்ளோம். விரைவாக சரிசெய்கிறோம்.';
        if (statusSelect) statusSelect.value = 'in_progress';
    } else if (id === 2) {
        textEl.value = currentLang === 'ta'
            ? 'ஆய்வுக்குழு நியமிக்கப்பட்டு நடவடிக்கை எடுக்கப்பட்டு வருகிறது / Inspection team assigned. Work in progress.'
            : 'Inspection team assigned. Action is currently in progress. / ஆய்வுக்குழு நியமிக்கப்பட்டு நடவடிக்கை எடுக்கப்பட்டு வருகிறது.';
        if (statusSelect) statusSelect.value = 'in_progress';
    } else if (id === 3) {
        textEl.value = currentLang === 'ta'
            ? 'உங்கள் புகார் வெற்றிகரமாகத் தீர்க்கப்பட்டது. நன்றி! / Your complaint has been successfully resolved. Thank you.'
            : 'Your complaint has been successfully resolved. Thank you for notifying us. / உங்கள் புகார் வெற்றிகரமாகத் தீர்க்கப்பட்டது.';
        if (statusSelect) statusSelect.value = 'resolved';
    }
}

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    if (modal) modal.classList.remove('active');
}

async function sendOfficialReply() {
    const complaintId = document.getElementById('replyComplaintId').textContent;
    const newStatus = document.getElementById('replyStatusSelect').value;
    const replyText = document.getElementById('replyText').value.trim();

    if (!replyText) {
        showToast(currentLang === 'ta' ? 'பதில் உரையை உள்ளிடவும்' : 'Please enter a reply message', 'warning');
        return;
    }

    try {
        await apiCall(`/api/complaints/${complaintId}/status`, {
            method: 'PUT',
            body: { status: newStatus, comment: replyText }
        });

        showToast(
            currentLang === 'ta' ? 'பதில் அனுப்பப்பட்டது!' : 'Official reply sent to citizen successfully!',
            'success'
        );
        closeReplyModal();
        initAdmin();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ── Auto Escalation Check ─────────────────────────────────────────────────
async function checkEscalations() {
    try {
        const result = await apiCall('/api/escalate-check');
        if (result.escalated_count > 0) {
            showToast(
                `${result.escalated_count} ${currentLang === 'ta' ? 'புகார்கள் முன்னிலைப்படுத்தப்பட்டன' : 'complaints escalated'}`,
                'warning'
            );
            initAdmin();
        } else {
            showToast(
                currentLang === 'ta' ? 'முன்னிலைப்படுத்த புகார்கள் இல்லை' : 'No complaints to escalate',
                'info'
            );
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function resetAdminFilters() {
    const statusFilter = document.getElementById('filterStatus');
    const deptFilter = document.getElementById('filterDept');
    const searchInput = document.getElementById('filterSearch');

    if (statusFilter) statusFilter.value = '';
    if (deptFilter) deptFilter.value = '';
    if (searchInput) searchInput.value = '';

    applyAdminFilters();
    showToast(currentLang === 'ta' ? 'அனைத்து வடிகட்டிகளும் அகற்றப்பட்டன' : 'All filters reset', 'info');
}

function viewComplaint(id) {
    window.location.href = `/complaint/${id}`;
}

// ── Utility ───────────────────────────────────────────────────────────────
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

document.addEventListener('DOMContentLoaded', initAdmin);
