// Study App - iPad Optimized Version
// Handles flashcard studying for a specific subject with touch event support

class StudyApp {
    constructor() {
        this.currentSubjectName = localStorage.getItem('currentSubject');
        if (!this.currentSubjectName) {
            window.location.href = 'index.html';
            return;
        }
        
        this.subjects = this.loadSubjects();
        this.currentSubject = this.subjects[this.currentSubjectName];
        
        if (!this.currentSubject) {
            alert('Subject not found');
            window.location.href = 'index.html';
            return;
        }
        
        this.flashcards = this.currentSubject.cards;
        this.currentIndex = 0;
        this.isFlipped = false;
        
        // Touch handling state
        this.touchStartY = 0;
        this.touchStartX = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateCardDisplay();
    }

    initializeElements() {
        // Header elements
        this.subjectTitle = document.getElementById('subjectTitle');
        this.cardCountElement = document.getElementById('card-count');
        this.progressElement = document.getElementById('progress');
        
        // Flashcard elements
        this.flashcardElement = document.getElementById('flashcard');
        this.questionElement = document.getElementById('question');
        this.answerElement = document.getElementById('answer');
        this.cardPositionElement = document.getElementById('card-position');
        this.cardsContainer = document.getElementById('cards-container');
        
        // Button elements
        this.flipButton = document.getElementById('flip-btn');
        this.prevButton = document.getElementById('prev-btn');
        this.nextButton = document.getElementById('next-btn');
        this.shuffleButton = document.getElementById('shuffle-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.addCardBtn = document.getElementById('add-card-btn');
        
        // Modal elements
        this.addCardModal = document.getElementById('addCardModal');
        this.questionInput = document.getElementById('questionInput');
        this.answerInput = document.getElementById('answerInput');
        this.questionChar = document.getElementById('questionChar');
        this.answerChar = document.getElementById('answerChar');
        this.closeAddCardModal = document.getElementById('closeAddCardModal');
        this.cancelAddCardBtn = document.getElementById('cancelAddCardBtn');
        this.confirmAddCardBtn = document.getElementById('confirmAddCardBtn');
        
        // Difficulty buttons
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        
        // Set subject title
        this.subjectTitle.innerHTML = `<i class="fas fa-book"></i> ${this.currentSubjectName}`;
    }

    setupEventListeners() {
        // Flashcard interaction - IMPROVED for iPad
        this.setupTouchHandler(this.flashcardElement, () => this.flipCard());
        this.setupTouchHandler(this.flipButton, () => this.flipCard());
        
        // Navigation - IMPROVED for iPad
        this.setupTouchHandler(this.prevButton, () => this.prevCard());
        this.setupTouchHandler(this.nextButton, () => this.nextCard());
        
        // Controls - IMPROVED for iPad
        this.setupTouchHandler(this.shuffleButton, () => this.shuffleCards());
        this.setupTouchHandler(this.resetButton, () => this.resetProgress());
        this.setupTouchHandler(this.addCardBtn, () => this.showAddCardModal());
        
        // Difficulty buttons - IMPROVED for iPad
        this.difficultyButtons.forEach(button => {
            this.setupTouchHandler(button, (e) => {
                e.stopPropagation();
                const difficulty = button.dataset.difficulty;
                this.setDifficulty(difficulty);
            });
        });
        
        // Modal controls - IMPROVED for iPad
        this.setupTouchHandler(this.closeAddCardModal, () => this.hideAddCardModal());
        this.setupTouchHandler(this.cancelAddCardBtn, () => this.hideAddCardModal());
        this.setupTouchHandler(this.confirmAddCardBtn, () => this.addCard());
        
        // Character counters
        this.questionInput.addEventListener('input', () => {
            this.questionChar.textContent = `${this.questionInput.value.length}/200`;
        });
        this.answerInput.addEventListener('input', () => {
            this.answerChar.textContent = `${this.answerInput.value.length}/1000`;
        });
        
        // Click outside modal to close - IMPROVED for iPad
        this.addCardModal.addEventListener('touchstart', (e) => {
            if (e.target === this.addCardModal) this.hideAddCardModal();
        });
        this.addCardModal.addEventListener('click', (e) => {
            if (e.target === this.addCardModal) this.hideAddCardModal();
        });
        
        // Keyboard shortcuts (still useful when using external keyboard)
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.prevCard();
                    break;
                case 'ArrowRight':
                    this.nextCard();
                    break;
                case ' ':
                    e.preventDefault();
                    this.flipCard();
                    break;
            }
        });

        // Note: Scrolling within card content is now allowed
        // The setupTouchHandler distinguishes between taps and scrolls
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

    updateDisplay() {
        const totalCards = this.flashcards.length;
        
        // Update card count
        this.cardCountElement.textContent = `${totalCards} cards`;
        
        // Update progress
        const masteredCards = this.currentSubject.progress.easy || 0;
        const progressPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
        this.progressElement.textContent = `${progressPercent}% mastered`;
        
        // Update position
        this.cardPositionElement.textContent = totalCards > 0 
            ? `${this.currentIndex + 1}/${totalCards}` 
            : '0/0';
        
        // Update navigation buttons
        this.prevButton.disabled = this.currentIndex === 0 || totalCards === 0;
        this.nextButton.disabled = this.currentIndex === totalCards - 1 || totalCards === 0;
        
        // Update card list
        this.updateCardList();
    }

    updateCardDisplay() {
        if (this.flashcards.length === 0) {
            this.questionElement.textContent = 'No cards yet';
            this.answerElement.textContent = 'Add your first card to start studying';
            this.cardPositionElement.textContent = '0/0';
            return;
        }
        
        const card = this.flashcards[this.currentIndex];
        this.questionElement.textContent = card.question;
        this.answerElement.textContent = card.answer;
        
        // Reset card to front view
        this.flashcardElement.classList.remove('flipped');
        this.isFlipped = false;
    }

    flipCard() {
        if (this.flashcards.length === 0) return;
        
        this.flashcardElement.classList.toggle('flipped');
        this.isFlipped = !this.isFlipped;
    }

    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCardDisplay();
            this.updateDisplay();
        }
    }

    nextCard() {
        if (this.currentIndex < this.flashcards.length - 1) {
            this.currentIndex++;
            this.updateCardDisplay();
            this.updateDisplay();
        }
    }

    shuffleCards() {
        if (this.flashcards.length < 2) return;
        
        // Fisher-Yates shuffle
        for (let i = this.flashcards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
        }
        
        this.currentIndex = 0;
        this.currentSubject.cards = this.flashcards;
        this.saveSubjects();
        this.updateCardDisplay();
        this.updateDisplay();
    }

    setDifficulty(difficulty) {
        if (this.flashcards.length === 0) return;
        
        const card = this.flashcards[this.currentIndex];
        const oldDifficulty = card.difficulty;
        
        // Update card difficulty
        card.difficulty = difficulty;
        
        // Update progress counts
        if (oldDifficulty && this.currentSubject.progress[oldDifficulty] > 0) {
            this.currentSubject.progress[oldDifficulty]--;
        }
        this.currentSubject.progress[difficulty] = (this.currentSubject.progress[difficulty] || 0) + 1;
        
        // Update last studied
        this.currentSubject.lastStudied = new Date().toISOString();
        
        this.saveSubjects();
        this.updateDisplay();
        
        // Auto-advance to next card
        setTimeout(() => {
            if (this.currentIndex < this.flashcards.length - 1) {
                this.nextCard();
            }
        }, 300);
    }

    resetProgress() {
        if (!confirm('Reset all progress for this subject? This will mark all cards as unrated.')) return;
        
        this.flashcards.forEach(card => {
            card.difficulty = 'unrated';
        });
        
        this.currentSubject.progress = {
            easy: 0,
            medium: 0,
            hard: 0,
            unrated: this.flashcards.length
        };
        
        this.saveSubjects();
        this.currentIndex = 0;
        this.updateCardDisplay();
        this.updateDisplay();
    }

    showAddCardModal() {
        this.addCardModal.style.display = 'flex';
        this.questionInput.value = '';
        this.answerInput.value = '';
        this.questionChar.textContent = '0/200';
        this.answerChar.textContent = '0/1000';
        setTimeout(() => this.questionInput.focus(), 300); // Increased delay for iOS
    }

    hideAddCardModal() {
        this.addCardModal.style.display = 'none';
    }

    addCard() {
        const question = this.questionInput.value.trim();
        const answer = this.answerInput.value.trim();
        
        if (!question || !answer) {
            alert('Please enter both question and answer');
            return;
        }
        
        const newCard = {
            id: Date.now() + Math.random(),
            question: question,
            answer: answer,
            difficulty: 'unrated',
            createdAt: new Date().toISOString()
        };
        
        this.flashcards.push(newCard);
        this.currentSubject.cards = this.flashcards;
        this.currentSubject.progress.unrated = (this.currentSubject.progress.unrated || 0) + 1;
        
        this.saveSubjects();
        this.currentIndex = this.flashcards.length - 1;
        
        this.hideAddCardModal();
        this.updateCardDisplay();
        this.updateDisplay();
        
        // Show success message
        this.showToast('Card added successfully!');
    }

    updateCardList() {
        this.cardsContainer.innerHTML = '';
        
        if (this.flashcards.length === 0) {
            this.cardsContainer.innerHTML = '<p class="empty-message">No flashcards yet. Add your first one!</p>';
            return;
        }
        
        this.flashcards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-item';
            if (index === this.currentIndex) {
                cardElement.style.borderLeft = '5px solid #FF9800';
            }
            
            const difficultyClass = card.difficulty || 'unrated';
            const difficultyLabel = card.difficulty ? 
                card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1) : 
                'Unrated';
            
            cardElement.innerHTML = `
                <div class="card-content">
                    <div class="card-question">${card.question}</div>
                </div>
                <div class="card-difficulty difficulty-${difficultyClass}">
                    ${difficultyLabel}
                </div>
                <div class="card-actions">
                    <button class="edit-btn" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add touch handlers to edit and delete buttons
            const editBtn = cardElement.querySelector('.edit-btn');
            const deleteBtn = cardElement.querySelector('.delete-btn');
            
            this.setupTouchHandler(editBtn, () => this.editCard(index));
            this.setupTouchHandler(deleteBtn, () => this.deleteCard(index));
            
            this.cardsContainer.appendChild(cardElement);
        });
    }

    editCard(index) {
        const card = this.flashcards[index];
        
        this.questionInput.value = card.question;
        this.answerInput.value = card.answer;
        this.questionChar.textContent = `${card.question.length}/200`;
        this.answerChar.textContent = `${card.answer.length}/1000`;
        
        // Remove the card temporarily
        this.flashcards.splice(index, 1);
        
        // Adjust current index
        if (this.currentIndex >= this.flashcards.length && this.flashcards.length > 0) {
            this.currentIndex = this.flashcards.length - 1;
        } else if (this.flashcards.length === 0) {
            this.currentIndex = 0;
        }
        
        this.saveSubjects();
        this.updateCardDisplay();
        this.updateDisplay();
        
        this.showAddCardModal();
    }

    deleteCard(index) {
        if (!confirm('Are you sure you want to delete this card?')) return;
        
        const card = this.flashcards[index];
        
        // Update progress counts
        if (card.difficulty && this.currentSubject.progress[card.difficulty] > 0) {
            this.currentSubject.progress[card.difficulty]--;
        }
        
        this.flashcards.splice(index, 1);
        
        // Adjust current index
        if (this.currentIndex >= this.flashcards.length && this.flashcards.length > 0) {
            this.currentIndex = this.flashcards.length - 1;
        } else if (this.flashcards.length === 0) {
            this.currentIndex = 0;
        }
        
        this.currentSubject.cards = this.flashcards;
        this.saveSubjects();
        this.updateCardDisplay();
        this.updateDisplay();
        
        this.showToast('Card deleted');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize when page loads
let studyApp;
document.addEventListener('DOMContentLoaded', () => {
    studyApp = new StudyApp();
});
