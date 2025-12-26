// Dashboard Logic for ZAMES
class ZAMESDashboard {
    constructor() {
        this.currentUser = null;
        this.isOnline = navigator.onLine;
        this.app = window.zamesApp;
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadDashboard();
        this.bindEvents();
        this.setupOfflineDetection();
    }

    checkAuthentication() {
        const session = zamesStorage.getSession();
        if (!session || !zamesStorage.isSessionValid()) {
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = session.user;
    }

    loadDashboard() {
        const container = document.getElementById('dashboardContainer');
        if (!container) return;
        
        const dashboardHTML = this.generateDashboardHTML();
        container.innerHTML = dashboardHTML;
        
        // Load dashboard data
        this.loadDashboardData();
    }

    generateDashboardHTML() {
        const user = this.currentUser;
        const role = user.role;
        const roleClass = `role-${role}`;
        const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
        
        return `
            <!-- Top Navigation -->
            <nav class="top-nav">
                <div class="nav-content">
                    <div class="nav-left">
                        <a href="dashboard.html" class="logo">
                            <div class="logo-icon">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <span class="logo-text">ZAMES</span>
                        </a>
                        
                        <div class="nav-menu">
                            <a href="#" class="nav-item active" data-page="dashboard">
                                <i class="fas fa-home"></i> Dashboard
                            </a>
                            <a href="#" class="nav-item" data-page="analytics">
                                <i class="fas fa-chart-bar"></i> Analytics
                            </a>
                            <a href="#" class="nav-item" data-page="students">
                                <i class="fas fa-users"></i> Students
                            </a>
                            <a href="#" class="nav-item" data-page="reports">
                                <i class="fas fa-file-alt"></i> Reports
                            </a>
                            <a href="#" class="nav-item" data-page="resources">
                                <i class="fas fa-book"></i> Resources
                            </a>
                            <a href="#" class="nav-item" data-page="announcements">
                                <i class="fas fa-bullhorn"></i> Announcements
                            </a>
                        </div>
                    </div>
                    
                    <div class="nav-right">
                        <div class="user-profile" id="userProfile">
                            <div class="avatar">
                                ${user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div class="user-info">
                                <span class="user-name">${user.name}</span>
                                <span class="user-role">
                                    <span class="badge ${roleClass}">${roleDisplay}</span>
                                    ${user.school ? ' • ' + user.school : ''}
                                </span>
                            </div>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- User Menu Dropdown -->
            <div class="user-menu" id="userMenu">
                <div class="user-menu-header">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${user.name}</div>
                    <div style="font-size: 0.85rem; color: var(--medium-gray);">${user.email}</div>
                </div>
                <div class="user-menu-body">
                    <a href="#" class="user-menu-item" data-action="profile">
                        <i class="fas fa-user-cog"></i>
                        <span>Profile Settings</span>
                    </a>
                    <a href="#" class="user-menu-item" data-action="notifications">
                        <i class="fas fa-bell"></i>
                        <span>Notifications</span>
                    </a>
                    <a href="#" class="user-menu-item" data-action="help">
                        <i class="fas fa-question-circle"></i>
                        <span>Help & Support</span>
                    </a>
                    <a href="#" class="user-menu-item" data-action="export">
                        <i class="fas fa-download"></i>
                        <span>Export Data</span>
                    </a>
                </div>
                <div class="user-menu-footer">
                    <button class="btn btn-danger btn-block" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <!-- Dashboard Content -->
            <div class="dashboard-content" id="dashboardContent">
                <!-- Content will be loaded dynamically -->
            </div>

            <!-- Footer -->
            <footer class="dashboard-footer">
                <div class="connection-status ${this.isOnline ? 'online' : 'offline'}" id="connectionStatus">
                    <i class="fas fa-${this.isOnline ? 'wifi' : 'wifi-slash'}"></i>
                    <span>${this.isOnline ? 'Online Mode' : 'Offline Mode'}</span>
                </div>
                <p>ZAMES - Zambia Advanced Management Education System v1.0</p>
                <p style="margin-top: 0.5rem; font-size: 0.8rem;">
                    © 2024 Ministry of Education, Zambia • 
                    Last sync: <span id="lastSyncTime">${new Date().toLocaleTimeString()}</span>
                </p>
            </footer>
        `;
    }

    loadDashboardData() {
        this.showLoading('Loading dashboard...');
        
        // Simulate data loading
        setTimeout(() => {
            this.loadHomePage();
            this.hideLoading();
        }, 500);
    }

    loadHomePage() {
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        const stats = zamesStorage.getSystemStats();
        const activities = zamesStorage.getActivities(5);
        const announcements = zamesStorage.getAnnouncements(this.currentUser.role);
        const resources = zamesStorage.getResources();
        
        content.innerHTML = `
            <!-- Welcome Banner -->
            <div class="welcome-banner">
                <h1>Welcome back, ${this.currentUser.name}!</h1>
                <p>Access the complete Zambia Education Management System. Last login: ${new Date(this.currentUser.lastLogin).toLocaleString()}</p>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid" id="statsGrid">
                ${this.generateStatsCards()}
            </div>

            <!-- Quick Actions -->
            <h2 style="margin-bottom: 1rem; color: var(--dark);">Quick Actions</h2>
            <div class="quick-actions" id="quickActions">
                ${this.generateQuickActions()}
            </div>

            <!-- Recent Activity & Announcements -->
            <div class="form-row">
                <div class="activity-card" style="flex: 2;">
                    <div class="card-header">
                        <h2 class="card-title">Recent Activity</h2>
                        <button class="btn btn-primary btn-sm" id="viewAllActivities">View All</button>
                    </div>
                    <div class="activity-list">
                        ${this.generateActivityList(activities)}
                    </div>
                </div>
                
                <div class="activity-card" style="flex: 1;">
                    <div class="card-header">
                        <h2 class="card-title">Announcements</h2>
                        <button class="btn btn-primary btn-sm" id="viewAllAnnouncements">View All</button>
                    </div>
                    <div class="activity-list">
                        ${this.generateAnnouncementList(announcements)}
                    </div>
                </div>
            </div>

            <!-- Resources -->
            <div class="activity-card">
                <div class="card-header">
                    <h2 class="card-title">Educational Resources</h2>
                    <button class="btn btn-primary" id="browseResources">Browse All</button>
                </div>
                <div class="resources-grid">
                    ${this.generateResourceCards(resources.slice(0, 4))}
                </div>
            </div>

            <!-- Competency Chart for Teachers -->
            ${this.currentUser.role === 'teacher' ? this.generateCompetencyChart() : ''}
        `;
        
        // Bind dynamic events
        this.bindDynamicEvents();
    }

    generateStatsCards() {
        const stats = zamesStorage.getSystemStats();
        const user = this.currentUser;
        
        let statsData = [];
        
        switch(user.role) {
            case 'teacher':
                statsData = [
                    { title: 'My Students', value: '42', icon: 'users', change: '+2', color: 'primary' },
                    { title: 'Avg Competency', value: '78%', icon: 'chart-line', change: '+2.5%', color: 'success' },
                    { title: 'Pending Assessments', value: '5', icon: 'clipboard-check', change: '-3', color: 'warning' },
                    { title: 'Resource Downloads', value: '24', icon: 'download', change: '+8', color: 'info' }
                ];
                break;
            case 'headteacher':
                statsData = [
                    { title: 'School Enrollment', value: stats.totalStudents, icon: 'users', change: '+3.2%', color: 'primary' },
                    { title: 'Teaching Staff', value: stats.totalTeachers, icon: 'chalkboard-teacher', change: '+1', color: 'success' },
                    { title: 'Performance Index', value: '82.5', icon: 'award', change: '+4.2', color: 'warning' },
                    { title: 'Budget Utilization', value: '67%', icon: 'chart-pie', change: '+12%', color: 'info' }
                ];
                break;
            case 'pupil':
                statsData = [
                    { title: 'My Competency', value: '85%', icon: 'star', change: '+7%', color: 'primary' },
                    { title: 'Assignments Due', value: '3', icon: 'tasks', change: '0', color: 'warning' },
                    { title: 'Attendance', value: '96%', icon: 'calendar-check', change: '+2%', color: 'success' },
                    { title: 'Learning Hours', value: '42', icon: 'clock', change: '+8', color: 'info' }
                ];
                break;
            case 'parent':
                const children = user.children || [];
                statsData = [
                    { title: 'Children', value: children.length, icon: 'child', change: '', color: 'primary' },
                    { title: 'Overall Performance', value: '88%', icon: 'chart-bar', change: '+5%', color: 'success' },
                    { title: 'School Updates', value: '7', icon: 'bell', change: '+2', color: 'warning' },
                    { title: 'Fee Balance', value: 'K 0', icon: 'wallet', change: '-100%', color: 'info' }
                ];
                break;
            default:
                statsData = [
                    { title: 'Total Students', value: stats.totalStudents, icon: 'users', change: '+5%', color: 'primary' },
                    { title: 'Total Schools', value: stats.totalSchools, icon: 'school', change: '+2', color: 'success' },
                    { title: 'Total Assessments', value: stats.totalAssessments, icon: 'clipboard-check', change: '+15%', color: 'warning' },
                    { title: 'System Users', value: Object.keys(zamesStorage.get('data')?.users || {}).length, icon: 'user-friends', change: '+8%', color: 'info' }
                ];
        }
        
        return statsData.map(stat => `
            <div class="stat-card" data-stat="${stat.title.toLowerCase().replace(' ', '-')}">
                <div class="stat-header">
                    <div class="stat-title">${stat.title}</div>
                    <div class="stat-icon">
                        <i class="fas fa-${stat.icon}"></i>
                    </div>
                </div>
                <div class="stat-value">${stat.value}</div>
                ${stat.change ? `
                    <div class="stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}">
                        <i class="fas fa-${stat.change.startsWith('+') ? 'arrow-up' : 'arrow-down'}"></i>
                        ${stat.change} from last month
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    generateQuickActions() {
        const user = this.currentUser;
        let actions = [];
        
        switch(user.role) {
            case 'teacher':
                actions = [
                    { icon: 'clipboard-check', title: 'Record Assessment', desc: 'Enter competency scores' },
                    { icon: 'file-export', title: 'Generate Report', desc: 'Create performance reports' },
                    { icon: 'book-open', title: 'Lesson Plans', desc: 'Access CBC lesson plans' },
                    { icon: 'comments', title: 'Parent Messages', desc: 'Communicate with parents' },
                    { icon: 'calendar-alt', title: 'Timetable', desc: 'View teaching schedule' },
                    { icon: 'chalkboard', title: 'Class Management', desc: 'Manage student classes' }
                ];
                break;
            case 'headteacher':
                actions = [
                    { icon: 'chart-bar', title: 'School Analytics', desc: 'View performance metrics' },
                    { icon: 'file-invoice', title: 'Financial Reports', desc: 'Monitor school finances' },
                    { icon: 'users-cog', title: 'Staff Management', desc: 'Manage teaching staff' },
                    { icon: 'building', title: 'Infrastructure', desc: 'Facility management' },
                    { icon: 'bullhorn', title: 'Announcements', desc: 'Post school updates' },
                    { icon: 'file-contract', title: 'Policy Documents', desc: 'Access school policies' }
                ];
                break;
            case 'pupil':
                actions = [
                    { icon: 'book', title: 'Study Materials', desc: 'Access learning resources' },
                    { icon: 'tasks', title: 'Assignments', desc: 'View pending work' },
                    { icon: 'chart-line', title: 'My Progress', desc: 'Track performance' },
                    { icon: 'calendar', title: 'Timetable', desc: 'View school schedule' },
                    { icon: 'comments', title: 'Messages', desc: 'Communicate with teachers' },
                    { icon: 'award', title: 'Achievements', desc: 'View certificates' }
                ];
                break;
            case 'parent':
                actions = [
                    { icon: 'child', title: 'Child Progress', desc: 'Monitor performance' },
                    { icon: 'file-invoice', title: 'Fee Statements', desc: 'View school fees' },
                    { icon: 'bell', title: 'Notifications', desc: 'School announcements' },
                    { icon: 'comments', title: 'Message Teacher', desc: 'Contact school staff' },
                    { icon: 'calendar-alt', title: 'Events', desc: 'School calendar' },
                    { icon: 'file-medical', title: 'Health Records', desc: 'Medical information' }
                ];
                break;
            default:
                actions = [
                    { icon: 'chart-bar', title: 'System Analytics', desc: 'View system metrics' },
                    { icon: 'users', title: 'User Management', desc: 'Manage system users' },
                    { icon: 'cog', title: 'System Settings', desc: 'Configure system' },
                    { icon: 'database', title: 'Data Management', desc: 'Import/export data' },
                    { icon: 'shield-alt', title: 'Security', desc: 'Security settings' },
                    { icon: 'history', title: 'Audit Log', desc: 'View system logs' }
                ];
        }
        
        return actions.map(action => `
            <button class="action-btn" data-action="${action.title.toLowerCase().replace(' ', '-')}">
                <div class="action-icon">
                    <i class="fas fa-${action.icon}"></i>
                </div>
                <div class="action-text">${action.title}</div>
                <div class="action-desc">${action.desc}</div>
            </button>
        `).join('');
    }

    generateActivityList(activities) {
        if (!activities || activities.length === 0) {
            return '<div class="activity-item"><p style="color: var(--medium-gray); text-align: center;">No recent activity</p></div>';
        }
        
        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.action}</div>
                    <div class="activity-desc">${activity.details}</div>
                    <div class="activity-time">${this.formatTime(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    generateAnnouncementList(announcements) {
        if (!announcements || announcements.length === 0) {
            return '<div class="activity-item"><p style="color: var(--medium-gray); text-align: center;">No announcements</p></div>';
        }
        
        return announcements.slice(0, 3).map(announcement => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${this.getPriorityColor(announcement.priority)};">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${announcement.title}</div>
                    <div class="activity-desc">${announcement.content.substring(0, 60)}...</div>
                    <div class="activity-time">${this.formatTime(announcement.date)}</div>
                </div>
            </div>
        `).join('');
    }

    generateResourceCards(resources) {
        if (!resources || resources.length === 0) {
            return '<p style="color: var(--medium-gray); text-align: center; grid-column: 1 / -1;">No resources available</p>';
        }
        
        return resources.map(resource => `
            <div class="resource-card">
                <div class="resource-header">
                    <div class="resource-icon">
                        <i class="fas fa-${resource.type === 'pdf' ? 'file-pdf' : resource.type === 'video' ? 'video' : 'file-alt'}"></i>
                    </div>
                    <div class="resource-title">${resource.title}</div>
                </div>
                <div class="resource-desc">${resource.description}</div>
                <div class="resource-footer">
                    <div class="resource-meta">
                        <i class="fas fa-hdd"></i> ${resource.size} • 
                        <i class="fas fa-download"></i> ${resource.downloads}
                    </div>
                    <button class="btn btn-primary btn-sm download-resource" data-resource-id="${resource.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `).join('');
    }

    generateCompetencyChart() {
        return `
            <div class="chart-container">
                <div class="card-header">
                    <h2 class="card-title">Competency Analysis</h2>
                    <select id="chartPeriod" class="btn btn-outline btn-sm">
                        <option>This Term</option>
                        <option>Last Term</option>
                        <option>This Year</option>
                    </select>
                </div>
                <div class="chart-placeholder">
                    <div style="text-align: center;">
                        <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                        <p>Competency Progress Chart</p>
                        <small>${this.isOnline ? 'Loading chart data...' : 'Chart available when online'}</small>
                    </div>
                </div>
                <div style="margin-top: 1rem; display: flex; justify-content: center; gap: 1rem;">
                    <button class="btn btn-outline btn-sm" id="exportChart">
                        <i class="fas fa-download"></i> Export Chart
                    </button>
                    <button class="btn btn-outline btn-sm" id="printChart">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            'login': 'sign-in-alt',
            'assessment': 'clipboard-check',
            'report': 'file-export',
            'resource': 'download',
            'message': 'comment',
            'announcement': 'bullhorn'
        };
        return icons[type] || 'info-circle';
    }

    getPriorityColor(priority) {
        const colors = {
            'high': '#dc3545',
            'medium': '#ffc107',
            'low': '#17a2b8'
        };
        return colors[priority] || '#6c757d';
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';
        
        return date.toLocaleDateString();
    }

    bindEvents() {
        // User profile menu
        const userProfile = document.getElementById('userProfile');
        const userMenu = document.getElementById('userMenu');
        
        if (userProfile && userMenu) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!userProfile.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.remove('show');
                }
            });
        }
        
        // Navigation menu
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item')) {
                e.preventDefault();
                const navItem = e.target.closest('.nav-item');
                const page = navItem.dataset.page;
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                navItem.classList.add('active');
                
                // Load page
                this.loadPage(page);
            }
        });
        
        // User menu actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.user-menu-item')) {
                e.preventDefault();
                const menuItem = e.target.closest('.user-menu-item');
                const action = menuItem.dataset.action;
                this.handleUserMenuAction(action);
            }
        });
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    bindDynamicEvents() {
        // Quick actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn')) {
                const actionBtn = e.target.closest('.action-btn');
                const action = actionBtn.dataset.action;
                this.handleQuickAction(action);
            }
        });
        
        // Stat cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.stat-card')) {
                const statCard = e.target.closest('.stat-card');
                const stat = statCard.dataset.stat;
                this.handleStatClick(stat);
            }
        });
        
        // Resource downloads
        document.addEventListener('click', (e) => {
            if (e.target.closest('.download-resource')) {
                const downloadBtn = e.target.closest('.download-resource');
                const resourceId = downloadBtn.dataset.resourceId;
                this.downloadResource(resourceId);
            }
        });
        
        // View all buttons
        const viewAllActivities = document.getElementById('viewAllActivities');
        if (viewAllActivities) {
            viewAllActivities.addEventListener('click', () => {
                this.loadPage('activities');
            });
        }
        
        const viewAllAnnouncements = document.getElementById('viewAllAnnouncements');
        if (viewAllAnnouncements) {
            viewAllAnnouncements.addEventListener('click', () => {
                this.loadPage('announcements');
            });
        }
        
        const browseResources = document.getElementById('browseResources');
        if (browseResources) {
            browseResources.addEventListener('click', () => {
                this.loadPage('resources');
            });
        }
        
        // Chart buttons
        const exportChart = document.getElementById('exportChart');
        if (exportChart) {
            exportChart.addEventListener('click', () => {
                this.exportChartData();
            });
        }
        
        const printChart = document.getElementById('printChart');
        if (printChart) {
            printChart.addEventListener('click', () => {
                window.print();
            });
        }
    }

    loadPage(page) {
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        this.showLoading(`Loading ${page}...`);
        
        setTimeout(() => {
            switch(page) {
                case 'analytics':
                    content.innerHTML = this.generateAnalyticsPage();
                    break;
                case 'students':
                    content.innerHTML = this.generateStudentsPage();
                    break;
                case 'reports':
                    content.innerHTML = this.generateReportsPage();
                    break;
                case 'resources':
                    content.innerHTML = this.generateResourcesPage();
                    break;
                case 'announcements':
                    content.innerHTML = this.generateAnnouncementsPage();
                    break;
                case 'activities':
                    content.innerHTML = this.generateActivitiesPage();
                    break;
                default:
                    this.loadHomePage();
            }
            this.hideLoading();
        }, 500);
    }

    handleQuickAction(action) {
        switch(action) {
            case 'record-assessment':
                this.openAssessmentModal();
                break;
            case 'generate-report':
                this.openReportModal();
                break;
            case 'lesson-plans':
                this.showToast('Opening lesson plans...', 'info');
                break;
            case 'parent-messages':
                this.showToast('Opening messages...', 'info');
                break;
            case 'school-analytics':
                this.loadPage('analytics');
                break;
            case 'financial-reports':
                this.openFinancialReportModal();
                break;
            case 'study-materials':
                this.loadPage('resources');
                break;
            case 'child-progress':
                this.openChildProgressModal();
                break;
            default:
                this.showToast(`Action: ${action}`, 'info');
        }
    }

    handleStatClick(stat) {
        switch(stat) {
            case 'my-students':
            case 'school-enrollment':
            case 'children':
                this.loadPage('students');
                break;
            case 'avg-competency':
            case 'performance-index':
            case 'overall-performance':
                this.loadPage('analytics');
                break;
            case 'pending-assessments':
                this.openAssessmentModal();
                break;
            case 'resource-downloads':
            case 'learning-hours':
                this.loadPage('resources');
                break;
            case 'teaching-staff':
                this.showToast('Staff management coming soon', 'info');
                break;
            case 'assignments-due':
                this.showToast('Opening assignments...', 'info');
                break;
            case 'school-updates':
                this.loadPage('announcements');
                break;
            default:
                this.showToast(`Viewing ${stat} details...`, 'info');
        }
    }

    handleUserMenuAction(action) {
        switch(action) {
            case 'profile':
                this.openProfileModal();
                break;
            case 'notifications':
                this.showToast('Notifications panel coming soon', 'info');
                break;
            case 'help':
                this.showToast('Help documentation coming soon', 'info');
                break;
            case 'export':
                this.exportUserData();
                break;
        }
        
        // Close menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) userMenu.classList.remove('show');
    }

    openAssessmentModal() {
        if (this.currentUser.role !== 'teacher') {
            this.showToast('This feature is only available for teachers', 'warning');
            return;
        }
        
        const modal = document.getElementById('assessmentModal');
        if (!modal) return;
        
        const students = zamesStorage.getStudents();
        
        modal.querySelector('.modal-body').innerHTML = `
            <div class="form-group">
                <label for="assessmentStudent">Select Student</label>
                <select id="assessmentStudent" class="form-control">
                    <option value="">Choose a student</option>
                    ${students.map(student => `
                        <option value="${student.id}">${student.name} - ${student.grade} ${student.class}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="assessmentSubject">Subject</label>
                <select id="assessmentSubject" class="form-control">
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Bemba">Bemba</option>
                </select>
            </div>
            <div class="form-group">
                <label for="assessmentCompetency">Competency Area</label>
                <select id="assessmentCompetency" class="form-control">
                    <option value="Problem Solving">Problem Solving</option>
                    <option value="Critical Thinking">Critical Thinking</option>
                    <option value="Communication">Communication</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Creativity">Creativity</option>
                </select>
            </div>
            <div class="form-group">
                <label>Assessment Score (1-4 Scale)</label>
                <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                    ${[1, 2, 3, 4].map(score => `
                        <label style="flex: 1; text-align: center; padding: 1rem; border: 2px solid var(--light-gray); border-radius: 8px; cursor: pointer;">
                            <input type="radio" name="score" value="${score}" style="display: none;">
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${score}</div>
                            <div style="font-size: 0.85rem; color: var(--medium-gray);">
                                ${score === 1 ? 'Beginning' : 
                                  score === 2 ? 'Developing' : 
                                  score === 3 ? 'Proficient' : 'Advanced'}
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label for="assessmentComments">Comments</label>
                <textarea id="assessmentComments" class="form-control" rows="3" placeholder="Enter assessment comments..."></textarea>
            </div>
            <div class="form-group">
                <label for="assessmentEvidence">Evidence</label>
                <input type="text" id="assessmentEvidence" class="form-control" placeholder="Classwork, project, test, etc.">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn btn-primary" id="saveAssessment">Save Assessment</button>
                <button class="btn btn-secondary modal-close">Cancel</button>
            </div>
        `;
        
        // Bind save assessment
        modal.querySelector('#saveAssessment').addEventListener('click', () => this.saveAssessment());
        
        // Show modal
        modal.classList.add('show');
    }

    saveAssessment() {
        const studentSelect = document.getElementById('assessmentStudent');
        const subject = document.getElementById('assessmentSubject').value;
        const competency = document.getElementById('assessmentCompetency').value;
        const score = document.querySelector('input[name="score"]:checked');
        const comments = document.getElementById('assessmentComments').value;
        const evidence = document.getElementById('assessmentEvidence').value;
        
        if (!studentSelect.value || !score) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        const student = zamesStorage.getStudents().find(s => s.id === studentSelect.value);
        
        const assessment = {
            studentId: student.id,
            studentName: student.name,
            grade: student.grade,
            subject: subject,
            competency: competency,
            score: parseInt(score.value),
            level: score.value === '1' ? 'Beginning' : 
                   score.value === '2' ? 'Developing' : 
                   score.value === '3' ? 'Proficient' : 'Advanced',
            date: new Date().toISOString().split('T')[0],
            term: 'Term 1',
            teacher: this.currentUser.name,
            teacherId: this.currentUser.id,
            comments: comments,
            evidence: evidence
        };
        
        zamesStorage.addAssessment(assessment);
        
        this.showToast('Assessment saved successfully!', 'success');
        this.closeModal(document.getElementById('assessmentModal'));
        
        // Update dashboard if on home page
        if (document.querySelector('.nav-item.active').dataset.page === 'dashboard') {
            this.loadHomePage();
        }
    }

    openReportModal() {
        const modal = document.getElementById('reportModal');
        if (!modal) return;
        
        modal.querySelector('.modal-body').innerHTML = `
            <div class="form-group">
                <label for="reportType">Report Type</label>
                <select id="reportType" class="form-control">
                    <option value="performance">Student Performance Report</option>
                    <option value="competency">Competency Analysis Report</option>
                    <option value="attendance">Attendance Report</option>
                    <option value="summary">Term Summary Report</option>
                    <option value="custom">Custom Report</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="reportPeriod">Period</label>
                    <select id="reportPeriod" class="form-control">
                        <option value="term1">Term 1</option>
                        <option value="term2">Term 2</option>
                        <option value="term3">Term 3</option>
                        <option value="year">Full Year</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="reportFormat">Format</label>
                    <select id="reportFormat" class="form-control">
                        <option value="pdf">PDF Document</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="word">Word Document</option>
                        <option value="html">Web Page</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="reportFilters">Filters (Optional)</label>
                <input type="text" id="reportFilters" class="form-control" placeholder="Grade, subject, class, etc.">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button class="btn btn-primary" id="generateReport">Generate Report</button>
                <button class="btn btn-secondary modal-close">Cancel</button>
            </div>
        `;
        
        // Bind generate report
        modal.querySelector('#generateReport').addEventListener('click', () => this.generateReport());
        
        // Show modal
        modal.classList.add('show');
    }

    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const period = document.getElementById('reportPeriod').value;
        const format = document.getElementById('reportFormat').value;
        
        this.showLoading('Generating report...');
        
        setTimeout(() => {
            this.hideLoading();
            this.closeModal(document.getElementById('reportModal'));
            
            // Create report content
            const reportContent = this.createReportContent(reportType, period);
            
            // Simulate download
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zames-report-${reportType}-${period}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast(`Report generated and downloaded as ${format.toUpperCase()}`, 'success');
        }, 2000);
    }

    createReportContent(type, period) {
        const date = new Date().toLocaleDateString();
        const user = this.currentUser;
        
        let content = `ZAMES EDUCATION SYSTEM REPORT\n`;
        content += `=================================\n\n`;
        content += `Report Type: ${type.toUpperCase()}\n`;
        content += `Period: ${period}\n`;
        content += `Generated: ${date}\n`;
        content += `Generated By: ${user.name} (${user.role})\n`;
        content += `School: ${user.school || 'N/A'}\n\n`;
        content += `=================================\n\n`;
        
        switch(type) {
            case 'performance':
                content += `STUDENT PERFORMANCE ANALYSIS\n`;
                content += `---------------------------\n\n`;
                const assessments = zamesStorage.getAssessments({ teacherId: user.id });
                assessments.forEach(assessment => {
                    content += `Student: ${assessment.studentName}\n`;
                    content += `Grade: ${assessment.grade}\n`;
                    content += `Subject: ${assessment.subject}\n`;
                    content += `Competency: ${assessment.competency}\n`;
                    content += `Score: ${assessment.score}/4 (${assessment.level})\n`;
                    content += `Date: ${assessment.date}\n`;
                    content += `Comments: ${assessment.comments}\n\n`;
                });
                break;
                
            case 'competency':
                content += `COMPETENCY ANALYSIS REPORT\n`;
                content += `-------------------------\n\n`;
                const stats = zamesStorage.getSystemStats();
                content += `Total Assessments: ${stats.totalAssessments}\n`;
                content += `Total Students: ${stats.totalStudents}\n`;
                content += `Average Score: 3.2/4\n`;
                content += `Performance Trend: Improving\n\n`;
                break;
                
            default:
                content += `Report content would be generated here based on selected parameters.\n`;
                content += `This is a simulated report for demonstration purposes.\n`;
        }
        
        content += `\n=================================\n`;
        content += `END OF REPORT\n`;
        content += `ZAMES - Zambia Advanced Management Education System\n`;
        
        return content;
    }

    downloadResource(resourceId) {
        const resource = zamesStorage.get('data')?.resources?.find(r => r.id === resourceId);
        if (!resource) {
            this.showToast('Resource not found', 'error');
            return;
        }
        
        this.showLoading(`Downloading ${resource.title}...`);
        
        // Simulate download
        setTimeout(() => {
            this.hideLoading();
            
            // Increment download count
            zamesStorage.incrementResourceDownloads(resourceId);
            
            // Add activity
            zamesStorage.addActivity({
                type: 'resource',
                user: this.currentUser.name,
                userId: this.currentUser.id,
                action: 'Downloaded resource',
                details: resource.title
            });
            
            // Show success message
            this.showToast(`"${resource.title}" downloaded successfully!`, 'success');
            
            // Update resource card if on page
            const downloadBtn = document.querySelector(`.download-resource[data-resource-id="${resourceId}"]`);
            if (downloadBtn) {
                const meta = downloadBtn.closest('.resource-footer').querySelector('.resource-meta');
                if (meta) {
                    const downloads = parseInt(meta.textContent.match(/\d+/)[0]) + 1;
                    meta.innerHTML = `<i class="fas fa-hdd"></i> ${resource.size} • <i class="fas fa-download"></i> ${downloads}`;
                }
            }
        }, 1500);
    }

    exportChartData() {
        this.showToast('Chart data exported successfully', 'success');
    }

    openFinancialReportModal() {
        this.showToast('Financial reports feature coming soon', 'info');
    }

    openChildProgressModal() {
        this.showToast('Child progress feature coming soon', 'info');
    }

    openProfileModal() {
        const modal = document.getElementById('assessmentModal'); // Reuse modal
        if (!modal) return;
        
        modal.querySelector('.modal-body').innerHTML = `
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="form-control" value="${this.currentUser.name}" readonly>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" value="${this.currentUser.email}" readonly>
            </div>
            <div class="form-group">
                <label>Role</label>
                <input type="text" class="form-control" value="${this.currentUser.role.toUpperCase()}" readonly>
            </div>
            <div class="form-group">
                <label>School</label>
                <input type="text" class="form-control" value="${this.currentUser.school || 'Not specified'}" readonly>
            </div>
            <div class="form-group">
                <label>Last Login</label>
                <input type="text" class="form-control" value="${new Date(this.currentUser.lastLogin).toLocaleString()}" readonly>
            </div>
            <div style="margin-top: 1.5rem;">
                <button class="btn btn-secondary modal-close">Close</button>
            </div>
        `;
        
        modal.classList.add('show');
    }

    exportUserData() {
        const data = zamesStorage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zames-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully', 'success');
    }

    logout() {
        this.showLoading('Logging out...');
        
        setTimeout(() => {
            zamesStorage.clearSession();
            this.hideLoading();
            this.showToast('Logged out successfully', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1000);
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
            this.showToast('Back online. Syncing data...', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
            this.showToast('Working in offline mode', 'warning');
        });
    }

    updateConnectionStatus() {
        const statusEl = document.getElementById('connectionStatus');
        if (statusEl) {
            statusEl.className = `connection-status ${this.isOnline ? 'online' : 'offline'}`;
            statusEl.innerHTML = `
                <i class="fas fa-${this.isOnline ? 'wifi' : 'wifi-slash'}"></i>
                <span>${this.isOnline ? 'Online Mode' : 'Offline Mode'}</span>
            `;
        }
        
        const lastSync = document.getElementById('lastSyncTime');
        if (lastSync) {
            lastSync.textContent = new Date().toLocaleTimeString();
        }
    }

    showLoading(message) {
        if (this.app?.showLoading) {
            this.app.showLoading(message);
        } else {
            console.log('Loading:', message);
        }
    }

    hideLoading() {
        if (this.app?.hideLoading) {
            this.app.hideLoading();
        }
    }

    showToast(message, type) {
        if (this.app?.showToast) {
            this.app.showToast(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    closeModal(modal) {
        if (this.app?.closeModal) {
            this.app.closeModal(modal);
        } else if (modal) {
            modal.classList.remove('show');
        }
    }

    // Generate other pages (simplified versions)
    generateAnalyticsPage() {
        return `
            <div class="welcome-banner">
                <h1>Analytics Dashboard</h1>
                <p>Performance metrics and insights for ${this.currentUser.school || 'your institution'}</p>
            </div>
            
            <div class="activity-card">
                <div class="card-header">
                    <h2 class="card-title">Performance Overview</h2>
                    <div>
                        <select class="btn btn-outline btn-sm">
                            <option>This Term</option>
                            <option>Last Term</option>
                            <option>This Year</option>
                        </select>
                    </div>
                </div>
                <div class="chart-placeholder" style="height: 400px;">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-chart-bar" style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                        <h3>Analytics Dashboard</h3>
                        <p>Performance charts and visualizations would appear here</p>
                        <small>${this.isOnline ? 'Loading analytics data...' : 'Analytics available when online'}</small>
                    </div>
                </div>
            </div>
        `;
    }

    generateStudentsPage() {
        const students = zamesStorage.getStudents();
        
        return `
            <div class="welcome-banner">
                <h1>Student Management</h1>
                <p>View and manage student information and performance</p>
            </div>
            
            <div class="table-container">
                <div class="card-header">
                    <h2 class="card-title">Student List</h2>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary btn-sm" id="addStudent">
                            <i class="fas fa-plus"></i> Add Student
                        </button>
                        <button class="btn btn-outline btn-sm" id="exportStudents">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>UPN</th>
                            <th>Grade</th>
                            <th>Class</th>
                            <th>Parent</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => `
                            <tr>
                                <td><strong>${student.name}</strong></td>
                                <td>${student.upn || 'N/A'}</td>
                                <td>${student.grade}</td>
                                <td>${student.class || 'N/A'}</td>
                                <td>${student.parent1 || 'N/A'}</td>
                                <td>${student.parent1Phone || 'N/A'}</td>
                                <td class="table-actions">
                                    <button class="btn btn-sm btn-outline" data-action="view" data-student="${student.id}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline" data-action="assess" data-student="${student.id}">
                                        <i class="fas fa-clipboard-check"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    generateReportsPage() {
        return `
            <div class="welcome-banner">
                <h1>Report Generator</h1>
                <p>Create and manage various educational reports</p>
            </div>
            
            <div class="quick-actions">
                <button class="action-btn" data-action="performance-report">
                    <div class="action-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="action-text">Performance Report</div>
                    <div class="action-desc">Student performance analysis</div>
                </button>
                
                <button class="action-btn" data-action="competency-report">
                    <div class="action-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="action-text">Competency Report</div>
                    <div class="action-desc">Competency assessment summary</div>
                </button>
                
                <button class="action-btn" data-action="attendance-report">
                    <div class="action-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="action-text">Attendance Report</div>
                    <div class="action-desc">Student attendance records</div>
                </button>
                
                <button class="action-btn" data-action="financial-report">
                    <div class="action-icon">
                        <i class="fas fa-file-invoice"></i>
                    </div>
                    <div class="action-text">Financial Report</div>
                    <div class="action-desc">School financial statements</div>
                </button>
            </div>
            
            <div class="activity-card">
                <div class="card-header">
                    <h2 class="card-title">Recent Reports</h2>
                    <button class="btn btn-primary" id="createNewReport">
                        <i class="fas fa-plus"></i> Create New Report
                    </button>
                </div>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-title">Term 1 Performance Summary</div>
                            <div class="activity-desc">Grade 7 student performance analysis for Term 1 2024</div>
                            <div class="activity-time">Generated: 2024-01-20</div>
                        </div>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-outline">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn btn-sm btn-outline">
                                <i class="fas fa-print"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateResourcesPage() {
        const resources = zamesStorage.getResources();
        
        return `
            <div class="welcome-banner">
                <h1>Educational Resources</h1>
                <p>Access teaching and learning materials</p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <input type="text" placeholder="Search resources..." class="form-control" style="flex: 1;">
                    <select class="form-control" style="width: 200px;">
                        <option>All Subjects</option>
                        <option>Mathematics</option>
                        <option>Science</option>
                        <option>English</option>
                    </select>
                    <select class="form-control" style="width: 200px;">
                        <option>All Grades</option>
                        <option>Grade 1-4</option>
                        <option>Grade 5-7</option>
                        <option>Grade 8-9</option>
                        <option>Grade 10-12</option>
                    </select>
                </div>
            </div>
            
            <div class="resources-grid">
                ${this.generateResourceCards(resources)}
            </div>
        `;
    }

    generateAnnouncementsPage() {
        const announcements = zamesStorage.getAnnouncements(this.currentUser.role);
        
        return `
            <div class="welcome-banner">
                <h1>Announcements</h1>
                <p>Important updates and notifications</p>
            </div>
            
            <div class="activity-card">
                <div class="card-header">
                    <h2 class="card-title">All Announcements</h2>
                    <button class="btn btn-primary" id="createAnnouncement">
                        <i class="fas fa-plus"></i> New Announcement
                    </button>
                </div>
                <div class="activity-list">
                    ${announcements.map(announcement => `
                        <div class="activity-item">
                            <div class="activity-icon" style="background: ${this.getPriorityColor(announcement.priority)};">
                                <i class="fas fa-bullhorn"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-title">${announcement.title}</div>
                                <div class="activity-desc">${announcement.content}</div>
                                <div class="activity-time">
                                    ${announcement.author} • ${this.formatTime(announcement.date)}
                                    ${announcement.expires ? ` • Expires: ${announcement.expires}` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateActivitiesPage() {
        const activities = zamesStorage.getActivities(20);
        
        return `
            <div class="welcome-banner">
                <h1>Activity Log</h1>
                <p>System activity and user actions</p>
            </div>
            
            <div class="activity-card">
                <div class="card-header">
                    <h2 class="card-title">All Activities</h2>
                    <button class="btn btn-outline" id="exportActivities">
                        <i class="fas fa-download"></i> Export Log
                    </button>
                </div>
                <div class="activity-list">
                    ${this.generateActivityList(activities)}
                </div>
            </div>
        `;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zamesDashboard = new ZAMESDashboard();
});