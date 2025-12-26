// Local Storage Management for ZAMES
class ZAMESStorage {
    constructor() {
        this.prefix = 'zames_';
        this.init();
    }

    init() {
        // Initialize mock data if not exists
        if (!this.get('initialized')) {
            this.initializeMockData();
        }
    }

    // Generic storage methods
    set(key, value) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }

    get(key) {
        const item = localStorage.getItem(this.prefix + key);
        return item ? JSON.parse(item) : null;
    }

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        // Clear only ZAMES data
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Application-specific methods
    initializeMockData() {
        const mockData = {
            users: {
                'teacher@zames.zm': {
                    id: 'T001',
                    email: 'teacher@zames.zm',
                    password: 'password123',
                    role: 'teacher',
                    name: 'John Banda',
                    school: 'Lusaka Central School',
                    schoolId: 'LC001',
                    province: 'Lusaka',
                    district: 'Lusaka District',
                    subjects: ['Mathematics', 'Science'],
                    grade: 'Grade 7',
                    phone: '+260 97 123 4567',
                    lastLogin: new Date().toISOString(),
                    avatar: 'JB'
                },
                'headteacher@zames.zm': {
                    id: 'HT001',
                    email: 'headteacher@zames.zm',
                    password: 'password123',
                    role: 'headteacher',
                    name: 'Sarah Mwila',
                    school: 'Lusaka Central School',
                    schoolId: 'LC001',
                    province: 'Lusaka',
                    phone: '+260 96 987 6543',
                    lastLogin: new Date().toISOString(),
                    avatar: 'SM'
                },
                'parent@zames.zm': {
                    id: 'P001',
                    email: 'parent@zames.zm',
                    password: 'password123',
                    role: 'parent',
                    name: 'David Phiri',
                    children: [
                        { name: 'Mary Phiri', grade: 'Grade 7', studentId: 'S001' },
                        { name: 'Joseph Phiri', grade: 'Grade 5', studentId: 'S002' }
                    ],
                    phone: '+260 95 555 1234',
                    lastLogin: new Date().toISOString(),
                    avatar: 'DP'
                },
                'pupil@zames.zm': {
                    id: 'S001',
                    email: 'pupil@zames.zm',
                    password: 'password123',
                    role: 'pupil',
                    name: 'Mary Phiri',
                    grade: 'Grade 7',
                    school: 'Lusaka Central School',
                    parentEmail: 'parent@zames.zm',
                    lastLogin: new Date().toISOString(),
                    avatar: 'MP'
                }
            },
            
            
            
        deputy@zames.zm': {
                    id: 'HT001',
                    email: 'deputy@zames.zm',
                    password: 'password123',
                    role: 'headteacher',
                    name: 'Sarah Mwila',
                    school: 'Lusaka Central School',
                    schoolId: 'LC001',
                    province: 'Lusaka',
                    phone: '+260 96 987 6543',
                    lastLogin: new Date().toISOString(),
                    avatar: 'SM'
                },    
            
            hod@zames.zm': {
                    id: 'HT001',
                    email: 'hod@zames.zm',
                    password: 'password123',
                    role: 'HOD',
                    name: 'Sarah Mwila',
                    school: 'Lusaka Central School',
                    schoolId: 'LC001',
                    province: 'Lusaka',
                    phone: '+260 96 987 6543',
                    lastLogin: new Date().toISOString(),
                    avatar: 'SM'
                },    
            
            
            debs@zames.zm': {
                    id: 'HT001',
                    email: 'd@zames.zm',
                    password: 'password123',
                    role: 'headteacher',
                    name: 'Sarah Mwila',
                    school: 'Lusaka Central School',
                    schoolId: 'LC001',
                    province: 'Lusaka',
                    phone: '+260 96 987 6543',
                    lastLogin: new Date().toISOString(),
                    avatar: 'SM'
                },    
            
            
            
            
            
            
            
            
            
           
           
            schools: [
                {
                    id: 'LC001',
                    name: 'Lusaka Central School',
                    emis: 'LC001',
                    type: 'Primary',
                    level: '1-7',
                    province: 'Lusaka',
                    district: 'Lusaka District',
                    address: 'Cairo Road, Lusaka',
                    headteacher: 'Sarah Mwila',
                    students: 850,
                    teachers: 32,
                    established: 1964
                },
                {
                    id: 'CB002',
                    name: 'Copperbelt Secondary',
                    emis: 'CB002',
                    type: 'Secondary',
                    level: '8-12',
                    province: 'Copperbelt',
                    district: 'Ndola District',
                    address: 'Kwacha Road, Ndola',
                    headteacher: 'Peter Musonda',
                    students: 1200,
                    teachers: 48,
                    established: 1972
                }
            ],
            students: [
                {
                    id: 'S001',
                    name: 'Mary Phiri',
                    upn: 'ZM20230001',
                    grade: 'Grade 7',
                    class: '7A',
                    school: 'Lusaka Central School',
                    dob: '2010-05-15',
                    gender: 'Female',
                    parent1: 'David Phiri',
                    parent1Phone: '+260 95 555 1234',
                    parent1Email: 'parent@zames.zm',
                    address: 'Plot 123, Lusaka'
                }
            ],
            assessments: [
                {
                    id: 'A001',
                    studentId: 'S001',
                    studentName: 'Mary Phiri',
                    grade: 'Grade 7',
                    subject: 'Mathematics',
                    competency: 'Problem Solving',
                    score: 4,
                    level: 'Advanced',
                    date: '2024-01-15',
                    term: 'Term 1',
                    teacher: 'John Banda',
                    teacherId: 'T001',
                    comments: 'Excellent problem-solving skills demonstrated in class activities.',
                    evidence: 'Classwork and group projects',
                    createdAt: '2024-01-15T10:30:00Z'
                },
                {
                    id: 'A002',
                    studentId: 'S001',
                    studentName: 'Mary Phiri',
                    grade: 'Grade 7',
                    subject: 'Science',
                    competency: 'Scientific Inquiry',
                    score: 3,
                    level: 'Proficient',
                    date: '2024-01-20',
                    term: 'Term 1',
                    teacher: 'John Banda',
                    teacherId: 'T001',
                    comments: 'Good understanding of scientific methods.',
                    evidence: 'Lab reports',
                    createdAt: '2024-01-20T14:15:00Z'
                }
            ],
            announcements: [
                {
                    id: 'ANN001',
                    title: 'New CBC Implementation Guidelines',
                    content: 'The Ministry of Education has released updated guidelines for Competence Based Curriculum implementation. All teachers are required to review the new framework.',
                    category: 'Policy Update',
                    priority: 'high',
                    author: 'Ministry of Education',
                    date: '2024-01-10',
                    expires: '2024-12-31',
                    audience: ['teacher', 'headteacher']
                },
                {
                    id: 'ANN002',
                    title: 'Parent-Teacher Conference Schedule',
                    content: 'The term 1 parent-teacher conferences will be held from February 5-9, 2024. Please schedule your appointments through the ZAMES portal.',
                    category: 'School Event',
                    priority: 'medium',
                    author: 'Sarah Mwila',
                    date: '2024-01-15',
                    expires: '2024-02-10',
                    audience: ['parent', 'teacher']
                }
            ],
            resources: [
                {
                    id: 'RES001',
                    title: 'CBC Implementation Guide 2024',
                    description: 'Complete guide for implementing Competence Based Curriculum in Zambian schools',
                    type: 'pdf',
                    subject: 'General',
                    gradeLevel: 'All',
                    language: 'English',
                    size: '2.4 MB',
                    downloads: 1245,
                    url: 'https://cdn.example.com/cbc-guide-2024.pdf',
                    tags: ['CBC', 'guidelines', 'implementation'],
                    uploadedBy: 'Ministry of Education',
                    uploadedDate: '2024-01-01'
                },
                {
                    id: 'RES002',
                    title: 'Mathematics Grade 7 Lesson Plans',
                    description: 'Complete set of lesson plans for Grade 7 Mathematics aligned with CBC',
                    type: 'pdf',
                    subject: 'Mathematics',
                    gradeLevel: 'Grade 7',
                    language: 'English',
                    size: '3.2 MB',
                    downloads: 892,
                    url: 'https://cdn.example.com/math-grade7-lessons.pdf',
                    tags: ['mathematics', 'lesson plans', 'grade 7'],
                    uploadedBy: 'John Banda',
                    uploadedDate: '2024-01-05'
                }
            ],
            activities: [
                {
                    id: 'ACT001',
                    type: 'assessment',
                    user: 'John Banda',
                    userId: 'T001',
                    action: 'Recorded assessment',
                    details: 'Mathematics assessment for Mary Phiri',
                    timestamp: '2024-01-15T10:30:00Z'
                },
                {
                    id: 'ACT002',
                    type: 'login',
                    user: 'Sarah Mwila',
                    userId: 'HT001',
                    action: 'Logged in',
                    details: 'Headteacher dashboard access',
                    timestamp: '2024-01-15T08:15:00Z'
                }
            ],
            system: {
                version: '1.0.0',
                lastSync: new Date().toISOString(),
                offlineMode: true,
                schoolYear: '2024',
                currentTerm: 'Term 1'
            }
        };

        this.set('data', mockData);
        this.set('initialized', true);
    }

    // User management
    getUser(email) {
        const data = this.get('data');
        return data?.users?.[email] || null;
    }

    saveUser(user) {
        const data = this.get('data');
        if (data?.users) {
            data.users[user.email] = user;
            this.set('data', data);
        }
    }

    // Session management
    setSession(user) {
        const session = {
            user: user,
            loginTime: new Date().toISOString(),
            token: this.generateToken(),
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };
        this.set('session', session);
        return session;
    }

    getSession() {
        return this.get('session');
    }

    clearSession() {
        this.remove('session');
    }

    isSessionValid() {
        const session = this.getSession();
        if (!session) return false;
        
        const expires = new Date(session.expires);
        return expires > new Date();
    }

    generateToken() {
        return 'zames_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    // Data retrieval methods
    getSchools() {
        const data = this.get('data');
        return data?.schools || [];
    }

    getAssessments(filters = {}) {
        const data = this.get('data');
        let assessments = data?.assessments || [];
        
        if (filters.studentId) {
            assessments = assessments.filter(a => a.studentId === filters.studentId);
        }
        if (filters.teacherId) {
            assessments = assessments.filter(a => a.teacherId === filters.teacherId);
        }
        if (filters.subject) {
            assessments = assessments.filter(a => a.subject === filters.subject);
        }
        if (filters.grade) {
            assessments = assessments.filter(a => a.grade === filters.grade);
        }
        
        return assessments;
    }

    addAssessment(assessment) {
        const data = this.get('data');
        if (data?.assessments) {
            assessment.id = 'A' + (data.assessments.length + 1).toString().padStart(3, '0');
            assessment.createdAt = new Date().toISOString();
            data.assessments.unshift(assessment);
            
            // Add activity log
            this.addActivity({
                type: 'assessment',
                user: assessment.teacher,
                userId: assessment.teacherId,
                action: 'Recorded assessment',
                details: `${assessment.subject} assessment for ${assessment.studentName}`
            });
            
            this.set('data', data);
            return assessment;
        }
        return null;
    }

    getAnnouncements(role = null) {
        const data = this.get('data');
        let announcements = data?.announcements || [];
        
        if (role) {
            announcements = announcements.filter(a => 
                !a.audience || a.audience.includes(role)
            );
        }
        
        return announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getResources(filters = {}) {
        const data = this.get('data');
        let resources = data?.resources || [];
        
        if (filters.subject) {
            resources = resources.filter(r => r.subject === filters.subject);
        }
        if (filters.gradeLevel) {
            resources = resources.filter(r => r.gradeLevel === filters.gradeLevel);
        }
        if (filters.type) {
            resources = resources.filter(r => r.type === filters.type);
        }
        
        return resources;
    }

    incrementResourceDownloads(resourceId) {
        const data = this.get('data');
        if (data?.resources) {
            const resource = data.resources.find(r => r.id === resourceId);
            if (resource) {
                resource.downloads = (resource.downloads || 0) + 1;
                this.set('data', data);
            }
        }
    }

    getActivities(limit = 10) {
        const data = this.get('data');
        const activities = data?.activities || [];
        return activities
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    addActivity(activity) {
        const data = this.get('data');
        if (data?.activities) {
            activity.id = 'ACT' + (data.activities.length + 1).toString().padStart(3, '0');
            activity.timestamp = new Date().toISOString();
            data.activities.unshift(activity);
            
            // Keep only last 100 activities
            if (data.activities.length > 100) {
                data.activities = data.activities.slice(0, 100);
            }
            
            this.set('data', data);
        }
    }

    getStudents(filters = {}) {
        const data = this.get('data');
        let students = data?.students || [];
        
        if (filters.grade) {
            students = students.filter(s => s.grade === filters.grade);
        }
        if (filters.school) {
            students = students.filter(s => s.school === filters.school);
        }
        
        return students;
    }

    getSystemStats() {
        const data = this.get('data');
        const stats = {
            totalStudents: data?.students?.length || 0,
            totalTeachers: Object.values(data?.users || {}).filter(u => u.role === 'teacher').length,
            totalSchools: data?.schools?.length || 0,
            totalAssessments: data?.assessments?.length || 0,
            totalResources: data?.resources?.length || 0,
            lastUpdated: data?.system?.lastSync || new Date().toISOString()
        };
        
        return stats;
    }

    // Export data for backup
    exportData() {
        const data = this.get('data');
        const session = this.getSession();
        
        return {
            data: data,
            session: session,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // Import data from backup
    importData(importData) {
        if (importData.version === '1.0.0') {
            this.set('data', importData.data);
            if (importData.session) {
                this.set('session', importData.session);
            }
            return true;
        }
        return false;
    }

    // Clear all data (for testing)
    resetData() {
        this.clear();
        this.initializeMockData();
    }
}

// Create global instance
const zamesStorage = new ZAMESStorage();