// Firebase Configuration - REPLACE WITH YOUR CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Main Application Logic for ZAMES with Firebase
class ZAMESApp {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAuthListener();
        this.setupOfflineDetection();
        this.setupServiceWorker();
    }

    bindEvents() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Sign Up Form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // Show Sign Up Modal
        const showSignUp = document.getElementById('showSignUp');
        if (showSignUp) {
            showSignUp.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('signupModal');
            });
        }
        
        // Password Toggles
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePassword('password'));
        }
        
        const toggleSignupPassword = document.getElementById('toggleSignupPassword');
        if (toggleSignupPassword) {
            toggleSignupPassword.addEventListener('click', () => this.togglePassword('signupPassword'));
        }
        
        // Demo Logins
        const demoTeacher = document.getElementById('demoTeacher');
        if (demoTeacher) {
            demoTeacher.addEventListener('click', () => this.demoLogin('teacher'));
        }
        
        const demoStudent = document.getElementById('demoStudent');
        if (demoStudent) {
            demoStudent.addEventListener('click', () => this.demoLogin('pupil'));
        }
        
        // Forgot Password
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }
        
        // Contact Support
        const contactSupport = document.getElementById('contactSupport');
        if (contactSupport) {
            contactSupport.addEventListener('click', (e) => {
                e.preventDefault();
                this.showToast('Support contact information will be available soon.', 'info');
            });
        }
        
        // Toast Close
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
        
        // Modal Close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
                this.closeModal(e.target.closest('.modal'));
            }
        });
        
        // Send Reset Link
        const sendResetLink = document.getElementById('sendResetLink');
        if (sendResetLink) {
            sendResetLink.addEventListener('click', () => this.sendResetLink());
        }
    }

    setupAuthListener() {
        // Listen for authentication state changes
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                this.currentUser = user;
                this.loadUserProfile(user.uid);
                
                // If on login page, redirect to dashboard
                if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                }
            } else {
                // User is signed out
                this.currentUser = null;
                this.userProfile = null;
                
                // If on dashboard, redirect to login
                if (window.location.pathname.includes('dashboard.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        // Validation
        if (!email || !password || !role) {
            this.showToast('Please fill all fields', 'error');
            return;
        }

        this.showLoading('Authenticating...');

        try {
            // Sign in with Firebase
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get user profile from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                this.userProfile = userDoc.data();
                
                // Check if selected role matches user's role
                if (this.userProfile.role !== role) {
                    await auth.signOut();
                    this.showToast('Selected role does not match your account role', 'error');
                    this.showLoading(false);
                    return;
                }
                
                // Update last login
                await db.collection('users').doc(user.uid).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Add activity log
                await db.collection('activities').add({
                    type: 'login',
                    userId: user.uid,
                    email: user.email,
                    role: this.userProfile.role,
                    action: 'Logged in',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    ipAddress: await this.getClientIP()
                });
                
                this.showToast(`Welcome back, ${this.userProfile.name || user.email}!`, 'success');
                
                // Store session in local storage for dashboard
                zamesStorage.setSession({
                    userId: user.uid,
                    email: user.email,
                    role: this.userProfile.role,
                    name: this.userProfile.name,
                    school: this.userProfile.school
                });
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // User document doesn't exist (shouldn't happen)
                this.showToast('User profile not found. Please contact support.', 'error');
                await auth.signOut();
                this.showLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. ';
            
            switch(error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage += 'Invalid email or password';
                    break;
                case 'auth/user-disabled':
                    errorMessage += 'Account has been disabled';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += 'Too many attempts. Try again later';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            this.showToast(errorMessage, 'error');
            this.showLoading(false);
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const role = document.getElementById('signupRole').value;
        const school = document.getElementById('schoolName').value.trim();
        const termsAgreed = document.getElementById('termsAgreement').checked;

        // Validation
        if (!name || !email || !password || !confirmPassword || !role || !school) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (!termsAgreed) {
            this.showToast('You must agree to the terms and conditions', 'error');
            return;
        }

        this.showLoading('Creating your account...');

        try {
            // Create user with Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Create user profile in Firestore
            const userProfile = {
                uid: user.uid,
                email: user.email,
                name: name,
                role: role,
                school: school,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                profileComplete: true,
                emailVerified: false,
                status: 'active'
            };
            
            await db.collection('users').doc(user.uid).set(userProfile);
            
            // Send email verification
            await user.sendEmailVerification();
            
            // Add activity log
            await db.collection('activities').add({
                type: 'signup',
                userId: user.uid,
                email: user.email,
                role: role,
                action: 'Account created',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Store session
            zamesStorage.setSession({
                userId: user.uid,
                email: user.email,
                role: role,
                name: name,
                school: school
            });
            
            this.showToast('Account created successfully! Please check your email for verification.', 'success');
            
            // Close modal and clear form
            this.closeModal(document.getElementById('signupModal'));
            document.getElementById('signupForm').reset();
            
            // Auto login after signup
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed. ';
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'Email already registered';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage += 'Email/password accounts are not enabled';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Password is too weak';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            this.showToast(errorMessage, 'error');
            this.showLoading(false);
        }
    }

    async loadUserProfile(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                this.userProfile = userDoc.data();
                return this.userProfile;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
        return null;
    }

    demoLogin(role) {
        let demoEmail, demoPassword;
        
        switch(role) {
            case 'teacher':
                demoEmail = 'teacher@zames.zm';
                demoPassword = 'password123';
                break;
            case 'pupil':
                demoEmail = 'pupil@zames.zm';
                demoPassword = 'password123';
                break;
            case 'headteacher':
                demoEmail = 'headteacher@zames.zm';
                demoPassword = 'password123';
                break;
            case 'parent':
                demoEmail = 'parent@zames.zm';
                demoPassword = 'password123';
                break;
            default:
                demoEmail = 'teacher@zames.zm';
                demoPassword = 'password123';
        }
        
        document.getElementById('email').value = demoEmail;
        document.getElementById('password').value = demoPassword;
        document.getElementById('role').value = role;
        
        // Auto submit after delay
        setTimeout(() => {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }, 300);
    }

    togglePassword(fieldId) {
        const passwordInput = document.getElementById(fieldId);
        let toggleIcon;
        
        if (fieldId === 'password') {
            toggleIcon = document.getElementById('togglePassword').querySelector('i');
        } else if (fieldId === 'signupPassword') {
            toggleIcon = document.getElementById('toggleSignupPassword').querySelector('i');
        } else {
            return;
        }
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            toggleIcon.className = 'fas fa-eye';
        }
    }

    async showForgotPasswordModal() {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    async sendResetLink() {
        const email = document.getElementById('resetEmail').value.trim();
        
        if (!email) {
            this.showToast('Please enter your email address', 'error');
            return;
        }
        
        this.showLoading('Sending reset link...');
        
        try {
            await auth.sendPasswordResetEmail(email);
            this.showLoading(false);
            this.closeModal(document.getElementById('forgotPasswordModal'));
            this.showToast(`Password reset link sent to ${email}. Check your email.`, 'success');
            document.getElementById('resetEmail').value = '';
        } catch (error) {
            console.error('Reset password error:', error);
            this.showLoading(false);
            this.showToast('Error sending reset link. Please try again.', 'error');
        }
    }

    async logout() {
        try {
            await auth.signOut();
            zamesStorage.clearSession();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
            this.showToast('Error logging out', 'error');
        }
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'Unknown';
        }
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showToast('Back online. Syncing data...', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('Working in offline mode', 'warning');
        });
    }

    async syncOfflineData() {
        // Sync offline data with Firestore
        const offlineData = zamesStorage.get('offlineQueue') || [];
        
        if (offlineData.length > 0) {
            this.showLoading('Syncing offline data...');
            
            try {
                for (const item of offlineData) {
                    // Process each offline item
                    await db.collection('offline_sync').add({
                        ...item,
                        syncedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                
                // Clear offline queue
                zamesStorage.remove('offlineQueue');
                this.showToast('Offline data synced successfully', 'success');
            } catch (error) {
                console.error('Sync error:', error);
                this.showToast('Error syncing offline data', 'error');
            } finally {
                this.showLoading(false);
            }
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('ServiceWorker registration successful');
                    },
                    (err) => {
                        console.log('ServiceWorker registration failed: ', err);
                    }
                );
            });
        }
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const messageEl = document.getElementById('loadingMessage');
        
        if (overlay) {
            if (messageEl) messageEl.textContent = message;
            overlay.classList.add('show');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastIcon = toast?.querySelector('.toast-icon i');
        
        if (!toast) return;
        
        // Set content
        toastTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        toastMessage.textContent = message;
        
        // Set icon based on type
        let iconClass = 'fas fa-check';
        switch(type) {
            case 'error': iconClass = 'fas fa-exclamation-circle'; break;
            case 'warning': iconClass = 'fas fa-exclamation-triangle'; break;
            case 'info': iconClass = 'fas fa-info-circle'; break;
        }
        
        if (toastIcon) toastIcon.className = iconClass;
        
        // Show toast
        toast.className = `toast ${type} show`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    hideToast() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('show');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Export for use in other files
    exportMethods() {
        return {
            showToast: this.showToast.bind(this),
            showLoading: this.showLoading.bind(this),
            hideLoading: this.hideLoading.bind(this),
            openModal: this.openModal.bind(this),
            closeModal: this.closeModal.bind(this),
            logout: this.logout.bind(this),
            getCurrentUser: () => this.currentUser,
            getUserProfile: () => this.userProfile
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.zamesApp = new ZAMESApp();
});