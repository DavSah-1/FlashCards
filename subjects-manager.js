// Subjects Manager - iPad Optimized Version
// Handles subject selection and creation with touch event support

class SubjectsManager {
    constructor() {
        this.subjects = this.loadSubjects();
        
        // Touch handling state
        this.touchStartY = 0;
        this.touchStartX = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.checkFirstLoad();
    }

    initializeElements() {
        this.subjectsGrid = document.getElementById('subjectsGrid');
        this.loadingMessage = document.getElementById('loadingMessage');
        this.emptyState = document.getElementById('emptyState');
        this.createSubjectBtn = document.getElementById('createSubjectBtn');
        this.createSubjectModal = document.getElementById('createSubjectModal');
        this.subjectNameInput = document.getElementById('subjectNameInput');
        this.subjectNameChar = document.getElementById('subjectNameChar');
        this.closeCreateModal = document.getElementById('closeCreateModal');
        this.cancelCreateBtn = document.getElementById('cancelCreateBtn');
        this.confirmCreateBtn = document.getElementById('confirmCreateBtn');
    }

    setupEventListeners() {
        // Create subject button - IMPROVED for iPad
        this.setupTouchHandler(this.createSubjectBtn, () => this.showCreateModal());
        
        // Modal controls - IMPROVED for iPad
        this.setupTouchHandler(this.closeCreateModal, () => this.hideCreateModal());
        this.setupTouchHandler(this.cancelCreateBtn, () => this.hideCreateModal());
        this.setupTouchHandler(this.confirmCreateBtn, () => this.createSubject());
        
        // Character counter
        this.subjectNameInput.addEventListener('input', () => {
            this.subjectNameChar.textContent = `${this.subjectNameInput.value.length}/50`;
        });
        
        // Enter key to create
        this.subjectNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createSubject();
        });
        
        // Click outside modal to close - IMPROVED for iPad
        this.createSubjectModal.addEventListener('touchstart', (e) => {
            if (e.target === this.createSubjectModal) this.hideCreateModal();
        });
        this.createSubjectModal.addEventListener('click', (e) => {
            if (e.target === this.createSubjectModal) this.hideCreateModal();
        });
    }

    // NEW METHOD: Unified touch/click handler for iPad compatibility
    setupTouchHandler(element, callback) {
        if (!element) return;
        
        let touchHandled = false;
        
        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            touchHandled = false;
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
            element.classList.add('active-touch');
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            element.classList.remove('active-touch');
            
            // Only trigger if touch didn't move much (not a scroll)
            const touch = e.changedTouches[0];
            const deltaY = Math.abs(touch.clientY - this.touchStartY);
            const deltaX = Math.abs(touch.clientX - this.touchStartX);
            
            if (deltaY < 10 && deltaX < 10 && !touchHandled) {
                e.preventDefault();
                touchHandled = true;
                callback(e);
            }
        });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('active-touch');
        });
        
        // Click events for mouse/desktop (fallback)
        element.addEventListener('click', (e) => {
            if (!touchHandled) {
                callback(e);
            }
            touchHandled = false;
        });
    }

    loadSubjects() {
        const stored = localStorage.getItem('flashcardSubjects');
        return stored ? JSON.parse(stored) : {};
    }

    saveSubjects() {
        localStorage.setItem('flashcardSubjects', JSON.stringify(this.subjects));
    }

    async checkFirstLoad() {
        // Check if this is the first time loading
        if (Object.keys(this.subjects).length === 0) {
            await this.loadDefaultSubjects();
        } else {
            this.renderSubjects();
        }
    }

    async loadDefaultSubjects() {
        this.loadingMessage.style.display = 'block';
        
        // Check if embedded data is available
        if (typeof EMBEDDED_SUBJECTS_DATA !== 'undefined') {
            console.log('Using embedded subjects data');
            this.loadFromEmbeddedData();
            this.loadingMessage.style.display = 'none';
            return;
        }

        // Try to fetch from files (works with http://)
        const subjectFiles = [
            'Approaches - Psych.json',
            'Biopsych.json',
            'CardioVascularSystem.json',
            'French - La Famille en voie de changement.json',
            'Respiratory system.json',
            'Skill Acquisition Feedback Guidance Transfer Memory Models Learning theories.json',
            'Social Influence.json'
        ];

        let loadedCount = 0;
        
        for (const filename of subjectFiles) {
            try {
                const response = await fetch(`subjects/${encodeURIComponent(filename)}`);
                if (response.ok) {
                    const data = await response.json();
                    const subjectName = filename.replace('.json', '');
                    const cards = this.parseSubjectFile(data);
                    
                    this.subjects[subjectName] = {
                        name: subjectName,
                        cards: cards,
                        progress: { easy: 0, medium: 0, hard: 0, unrated: cards.length },
                        lastStudied: null,
                        isCustom: false,
                        createdAt: new Date().toISOString()
                    };
                    loadedCount++;
                }
            } catch (error) {
                console.warn(`Could not load ${filename}:`, error);
            }
        }

        if (loadedCount === 0) {
            // No files loaded, show warning
            this.loadingMessage.style.display = 'none';
            this.showFileProtocolWarning();
            return;
        }

        this.saveSubjects();
        this.loadingMessage.style.display = 'none';
        this.renderSubjects();
    }

    loadFromEmbeddedData() {
        for (const [filename, data] of Object.entries(EMBEDDED_SUBJECTS_DATA)) {
            const subjectName = filename.replace('.json', '');
            const cards = this.parseSubjectFile(data);
            
            this.subjects[subjectName] = {
                name: subjectName,
                cards: cards,
                progress: { easy: 0, medium: 0, hard: 0, unrated: cards.length },
                lastStudied: null,
                isCustom: false,
                createdAt: new Date().toISOString()
            };
        }
        
        this.saveSubjects();
        this.renderSubjects();
    }

    showFileProtocolWarning() {
        const warning = document.createElement('div');
        warning.style.cssText = `
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 15px;
            padding: 30px;
            margin: 20px;
            text-align: center;
        `;
        warning.innerHTML = `
            <h2 style="color: #856404; margin-bottom: 15px;">
                <i class="fas fa-exclamation-triangle"></i> Cannot Load Subject Files
            </h2>
            <p style="color: #856404; font-size: 16px; margin-bottom: 20px;">
                The app cannot load flashcard subjects when opened directly from your file system (file:// protocol).
            </p>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <h3 style="color: #333; margin-bottom: 10px;">To fix this:</h3>
                <ol style="color: #555; line-height: 1.8;">
                    <li><strong>Transfer to iPad</strong> and open in Safari (recommended)</li>
                    <li><strong>Use a local web server</strong> for testing</li>
                    <li><strong>Host on a web server</strong></li>
                </ol>
            </div>
            <p style="color: #856404; font-size: 14px; margin-top: 20px;">
                You can still create custom subjects and add cards, but the 7 pre-loaded subjects (466 cards) won't be available.
            </p>
        `;
        
        this.subjectsGrid.innerHTML = '';
        this.subjectsGrid.appendChild(warning);
    }

    parseSubjectFile(data) {
        const cards = [];
        
        if (data.terms && Array.isArray(data.terms)) {
            data.terms.forEach(item => {
                if (item.term && item.definition) {
                    cards.push({
                        id: item.id || Date.now() + Math.random(),
                        question: item.term,
                        answer: item.definition,
                        difficulty: 'unrated',
                        createdAt: new Date().toISOString()
                    });
                }
            });
        }
        
        return cards;
    }

    renderSubjects() {
        this.subjectsGrid.innerHTML = '';
        
        const subjectKeys = Object.keys(this.subjects);
        
        if (subjectKeys.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        subjectKeys.forEach(key => {
            const subject = this.subjects[key];
            const card = this.createSubjectCard(subject);
            this.subjectsGrid.appendChild(card);
        });
    }

    createSubjectCard(subject) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        
        const totalCards = subject.cards.length;
        const masteredCards = subject.progress.easy || 0;
        const progressPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
        
        const lastStudiedText = subject.lastStudied 
            ? new Date(subject.lastStudied).toLocaleDateString() 
            : 'Never';
        
        card.innerHTML = `
            <div class="subject-card-header">
                <h3><i class="fas fa-book"></i> ${this.escapeHtml(subject.name)}</h3>
                ${subject.isCustom ? '<span class="custom-badge"><i class="fas fa-user"></i> Custom</span>' : ''}
            </div>
            <div class="subject-card-body">
                <div class="subject-stat">
                    <i class="fas fa-layer-group"></i>
                    <span>${totalCards} cards</span>
                </div>
                <div class="subject-stat">
                    <i class="fas fa-chart-line"></i>
                    <span>${progressPercent}% mastered</span>
                </div>
                <div class="subject-stat">
                    <i class="fas fa-clock"></i>
                    <span>Last: ${lastStudiedText}</span>
                </div>
            </div>
            <div class="subject-card-footer">
                <button class="study-btn" data-subject="${this.escapeHtml(subject.name)}">
                    <i class="fas fa-play"></i> Study
                </button>
                ${subject.isCustom ? `<button class="delete-subject-btn" data-subject="${this.escapeHtml(subject.name)}">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </div>
        `;
        
        // Add touch handlers to buttons
        const studyBtn = card.querySelector('.study-btn');
        this.setupTouchHandler(studyBtn, () => this.studySubject(subject.name));
        
        if (subject.isCustom) {
            const deleteBtn = card.querySelector('.delete-subject-btn');
            this.setupTouchHandler(deleteBtn, () => this.deleteSubject(subject.name));
        }
        
        return card;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeJs(text) {
        return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    }

    studySubject(subjectName) {
        localStorage.setItem('currentSubject', subjectName);
        window.location.href = 'study.html';
    }

    deleteSubject(subjectName) {
        if (confirm(`Are you sure you want to delete "${subjectName}" and all its cards?`)) {
            delete this.subjects[subjectName];
            this.saveSubjects();
            this.renderSubjects();
        }
    }

    showCreateModal() {
        this.createSubjectModal.style.display = 'flex';
        this.subjectNameInput.value = '';
        this.subjectNameChar.textContent = '0/50';
        setTimeout(() => this.subjectNameInput.focus(), 300); // Increased delay for iOS
    }

    hideCreateModal() {
        this.createSubjectModal.style.display = 'none';
    }

    createSubject() {
        const name = this.subjectNameInput.value.trim();
        
        if (!name) {
            alert('Please enter a subject name');
            return;
        }
        
        if (this.subjects[name]) {
            alert('A subject with this name already exists');
            return;
        }
        
        this.subjects[name] = {
            name: name,
            cards: [],
            progress: { easy: 0, medium: 0, hard: 0, unrated: 0 },
            lastStudied: null,
            isCustom: true,
            createdAt: new Date().toISOString()
        };
        
        this.saveSubjects();
        this.hideCreateModal();
        this.renderSubjects();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-toast';
        successMsg.innerHTML = `<i class="fas fa-check-circle"></i> Subject "${this.escapeHtml(name)}" created!`;
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            successMsg.classList.remove('show');
            setTimeout(() => document.body.removeChild(successMsg), 300);
        }, 3000);
    }
}

// Initialize when page loads
let subjectsManager;
document.addEventListener('DOMContentLoaded', () => {
    subjectsManager = new SubjectsManager();
});
