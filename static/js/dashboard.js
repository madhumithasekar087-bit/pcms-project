/**
 * PCMS — Dashboard Logic
 * Handles citizen dashboard: stats, complaint listing, filtering
 */

let dashComplaints = [];

async function initDashboard() {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;

    try {
        // Load stats and complaints in parallel
        const [stats, complaints] = await Promise.all([
            apiCall('/api/stats'),
            apiCall('/api/complaints')
        ]);

        dashComplaints = complaints;
        renderStats(stats);
        renderComplaints(complaints);
        renderCharts(stats);

        // Update welcome name
        const user = await checkAuth();
        const welcomeEl = document.getElementById('welcomeName');
        if (welcomeEl && user) {
            welcomeEl.textContent = user.name;
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function renderStats(stats) {
    document.getElementById('statTotal').textContent = stats.total || 0;
    document.getElementById('statPending').textContent = stats.pending || 0;
    document.getElementById('statProgress').textContent = stats.in_progress || 0;
    document.getElementById('statResolved').textContent = stats.resolved || 0;
    document.getElementById('statEscalated').textContent = stats.escalated || 0;
}

function renderComplaints(complaints) {
    const list = document.getElementById('complaintsList');
    if (!list) return;

    if (complaints.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3 data-i18n="dash.noComplaints">${t('dash.noComplaints')}</h3>
                <p data-i18n="dash.fileFirst">${t('dash.fileFirst')}</p>
                <a href="/chatbot" class="btn btn-primary mt-lg">${t('dash.newComplaint')}</a>
            </div>
        `;
        return;
    }

    list.innerHTML = complaints.map(c => `
        <div class="glass-card complaint-item" onclick="window.location.href='/complaint/${c.complaint_id}'">
            <span class="complaint-id">${c.complaint_id}</span>
            <div style="flex: 1;">
                <div class="complaint-title">${c.title}</div>
                <div class="complaint-dept">${c.department}</div>
            </div>
            <span class="badge badge-${c.status}">${t('status.' + c.status)}</span>
            <span class="badge badge-priority-${c.priority}">${t('priority.' + c.priority)}</span>
            <span class="complaint-date">${timeAgo(c.created_at)}</span>
        </div>
    `).join('');
}

function renderCharts(stats) {
    // Status Pie Chart
    const statusData = [
        { label: t('status.pending'), statusKey: 'pending', value: stats.pending },
        { label: t('status.in_progress'), statusKey: 'in_progress', value: stats.in_progress },
        { label: t('status.resolved'), statusKey: 'resolved', value: stats.resolved },
        { label: t('status.escalated'), statusKey: 'escalated', value: stats.escalated },
    ];
    const statusColors = ['#F59E0B', '#0EA5E9', '#10B981', '#F43F5E'];
    drawPieChart('statusChart', statusData, statusColors, (item) => {
        const select = document.querySelector('select[onchange="filterDashComplaints(this.value)"]');
        if (select) {
            select.value = item.statusKey;
            filterDashComplaints(item.statusKey);
            showToast(`${currentLang === 'ta' ? 'நிலை வடிகட்டப்பட்டது' : 'Filtered by Status'}: ${item.label}`, 'info');
            document.getElementById('complaintsList')?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Daily Bar Chart
    const dailyData = (stats.daily_stats || []).map(d => ({
        label: new Date(d.day).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        value: d.cnt
    }));
    drawBarChart('dailyChart', dailyData, '#2563EB');
}

function filterDashComplaints(status) {
    if (status === '') {
        renderComplaints(dashComplaints);
    } else {
        renderComplaints(dashComplaints.filter(c => c.status === status));
    }
}

function filterByStatCard(status) {
    const select = document.querySelector('select[onchange="filterDashComplaints(this.value)"]');
    if (select) select.value = status;
    filterDashComplaints(status);
    
    document.querySelectorAll('#statsGrid .stat-card').forEach(card => card.classList.remove('active'));
    const activeCard = document.querySelector(`#statsGrid .stat-card[onclick*="'${status}'"]`);
    if (activeCard) activeCard.classList.add('active');

    const labelMap = { '': 'All Complaints', 'pending': 'Pending', 'in_progress': 'In Progress', 'resolved': 'Resolved', 'escalated': 'Escalated' };
    showToast(`${currentLang === 'ta' ? 'வடிகட்டப்பட்டது' : 'Filtered by'}: ${labelMap[status] || status}`, 'info');
    document.getElementById('complaintsList')?.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', initDashboard);
