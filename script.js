// ==========================================================================
// TRACKER - STATE & LOCALSTORAGE CONSTANTS
// ==========================================================================
const LS_HABITS = 'tracker_habits_v1';
const LS_COMPLETIONS = 'tracker_completions_v1';
const LS_NOTES = 'tracker_notes_v1';
const LS_THEME = 'tracker_theme_v1';
const state = {
    // Current viewed date
    selectedDate: new Date(), 
    
    // Theme
    theme: 'dark',
    
    // Habits list
    habits: [],
    
    // Completions map: "YYYY-MM-DD" -> [habitId, habitId, ...]
    completions: {},
    
    // Notes list
    notes: [],
    
    // Current editing note ID
    activeNoteId: null
};
// ==========================================================================
// DEFAULT DATASET (FOR FIRST LOAD / TO MATCH USER SCREENSHOTS)
// ==========================================================================
const DEFAULT_HABITS = [
    { id: 'h1', name: 'tahjjud', icon: '🕌', color: 'teal' },
    { id: 'h2', name: 'Wake up at 5:00 AM', icon: '⏰', color: 'teal' },
    { id: 'h3', name: 'Workout', icon: '💪', color: 'teal' },
    { id: 'h4', name: 'Meditation / Breathing', icon: '🧘', color: 'purple' },
    { id: 'h5', name: 'Reading / Learning', icon: '📚', color: 'orange' },
    { id: 'h6', name: 'Drink 3L Water', icon: '💧', color: 'blue' },
    { id: 'h7', name: 'Healthy Diet', icon: '🥗', color: 'green' },
    { id: 'h8', name: 'No Social Media', icon: '📵', color: 'red' },
    { id: 'h9', name: 'Journaling', icon: '✍️', color: 'pink' }
];
// 62 completions distributed perfectly to match columns & chart on June 2026
const DEFAULT_COMPLETIONS = {
    "2026-06-01": ["h1", "h4", "h5", "h6", "h7", "h8", "h9"], // 7 checks
    "2026-06-02": ["h1", "h3", "h4", "h5", "h6", "h8", "h9"], // 7 checks
    "2026-06-03": ["h1", "h5", "h6", "h7", "h8", "h9"],       // 6 checks
    "2026-06-04": ["h1", "h3", "h4", "h5", "h6", "h7", "h9"], // 7 checks
    "2026-06-05": ["h1", "h3", "h4", "h5", "h6", "h7", "h8", "h9"], // 8 checks
    "2026-06-06": ["h1", "h3", "h4", "h5", "h6", "h7", "h8", "h9"], // 8 checks
    "2026-06-07": ["h1", "h3", "h6", "h7", "h8"],             // 5 checks
    "2026-06-08": ["h1", "h2", "h4", "h5", "h6", "h7", "h8", "h9"], // 8 checks
    "2026-06-09": ["h1", "h3", "h4", "h6", "h7"],             // 5 checks
    "2026-06-10": ["h1"]                                      // 1 check (Wednesday June 10 today)
};
const DEFAULT_NOTES = [
    {
        id: 'n1',
        date: '2026-06-10',
        habitId: 'h1',
        title: 'Morning Prayer Reflection',
        content: 'Felt extremely peaceful waking up early today. It helps ground me before the day begins.'
    },
    {
        id: 'n2',
        date: '2026-06-08',
        habitId: 'h3',
        title: 'High Energy Workout',
        content: 'Completed a intense 45-minute strength routine today. Felt strong and stayed hydrated.'
    }
];
// ==========================================================================
// DOM ELEMENTS CACHE
// ==========================================================================
const dom = {
    // Navigation
    menuItems: document.querySelectorAll('.menu-item'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    sunIcon: document.querySelector('.sun-icon'),
    moonIcon: document.querySelector('.moon-icon'),
    
    // Month Switcher
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    currentMonthLabel: document.getElementById('currentMonthLabel'),
    
    // Stats
    statGoal: document.getElementById('statGoal'),
    statCompleted: document.getElementById('statCompleted'),
    statLeft: document.getElementById('statLeft'),
    statProgress: document.getElementById('statProgress'),
    
    // Habit Grid
    habitGridWrapper: document.getElementById('habitGridWrapper'),
    addHabitBtn: document.getElementById('addHabitBtn'),
    
    // Analytics
    chartBarsContainer: document.getElementById('chartBarsContainer'),
    streaksList: document.getElementById('streaksList'),
    ratesList: document.getElementById('ratesList'),
    
    // Notes
    newNoteBtn: document.getElementById('newNoteBtn'),
    notesList: document.getElementById('notesList'),
    noteEditor: document.getElementById('noteEditor'),
    noteForm: document.getElementById('noteForm'),
    noteId: document.getElementById('noteId'),
    noteDate: document.getElementById('noteDate'),
    noteHabitLink: document.getElementById('noteHabitLink'),
    noteTitle: document.getElementById('noteTitle'),
    noteContent: document.getElementById('noteContent'),
    deleteNoteBtn: document.getElementById('deleteNoteBtn'),
    
    // Habit Modal
    habitModal: document.getElementById('habitModal'),
    habitForm: document.getElementById('habitForm'),
    modalTitle: document.getElementById('modalTitle'),
    habitIdInput: document.getElementById('habitIdInput'),
    habitName: document.getElementById('habitName'),
    iconOptions: document.querySelectorAll('.icon-option'),
    colorOptions: document.querySelectorAll('.color-option'),
    deleteHabitActionBtn: document.getElementById('deleteHabitActionBtn'),
    cancelHabitModalBtn: document.getElementById('cancelHabitModalBtn'),
    closeHabitModalBtn: document.getElementById('closeHabitModalBtn'),
    saveHabitBtn: document.getElementById('saveHabitBtn')
};
// ==========================================================================
// CORE HELPERS
// ==========================================================================
// Format date into YYYY-MM-DD
function formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
function formatDateString(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}
// Get days in a month
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
// Get day abbreviation (M, T, W, T, F, S, S)
function getWeekdayLetter(year, month, day) {
    const date = new Date(year, month, day);
    const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...
    // Map to custom letter matching standard English weekdays
    const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return letters[dayIndex];
}
// Save all state details to localStorage
function saveState() {
    localStorage.setItem(LS_HABITS, JSON.stringify(state.habits));
    localStorage.setItem(LS_COMPLETIONS, JSON.stringify(state.completions));
    localStorage.setItem(LS_NOTES, JSON.stringify(state.notes));
}
// Load state from localStorage or defaults
function loadState() {
    // Theme
    state.theme = localStorage.getItem(LS_THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcons();
    
    // Habits
    const habitsRaw = localStorage.getItem(LS_HABITS);
    state.habits = habitsRaw ? JSON.parse(habitsRaw) : [...DEFAULT_HABITS];
    
    // Completions
    const completionsRaw = localStorage.getItem(LS_COMPLETIONS);
    state.completions = completionsRaw ? JSON.parse(completionsRaw) : { ...DEFAULT_COMPLETIONS };
    
    // Notes
    const notesRaw = localStorage.getItem(LS_NOTES);
    state.notes = notesRaw ? JSON.parse(notesRaw) : [...DEFAULT_NOTES];
    
    if (!habitsRaw && !completionsRaw && !notesRaw) {
        saveState(); // Save defaults if empty
    }
}
// ==========================================================================
// STREAKS & STATISTICS ENGINE
// ==========================================================================
function getStreak(habitId) {
    const dates = [];
    
    // Gather all dates where this habit is checked
    Object.keys(state.completions).forEach(dateStr => {
        if (state.completions[dateStr] && state.completions[dateStr].includes(habitId)) {
            dates.push(new Date(dateStr + 'T00:00:00'));
        }
    });
    
    if (dates.length === 0) return { current: 0, longest: 0 };
    
    // Sort dates in ascending order
    dates.sort((a, b) => a - b);
    
    // Calculate Longest Streak
    let longest = 0;
    let currentTemp = 0;
    let prevTime = null;
    
    dates.forEach(d => {
        if (prevTime === null) {
            currentTemp = 1;
        } else {
            const diffDays = Math.round((d - prevTime) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                currentTemp++;
            } else if (diffDays > 1) {
                longest = Math.max(longest, currentTemp);
                currentTemp = 1;
            }
        }
        prevTime = d;
    });
    longest = Math.max(longest, currentTemp);
    
    // Calculate Current Streak (looking back from today)
    let current = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = formatDateKey(today);
    const yesterdayStr = formatDateKey(yesterday);
    
    const isTodayChecked = state.completions[todayStr] && state.completions[todayStr].includes(habitId);
    const isYesterdayChecked = state.completions[yesterdayStr] && state.completions[yesterdayStr].includes(habitId);
    
    if (isTodayChecked || isYesterdayChecked) {
        let checkDate = isTodayChecked ? today : yesterday;
        current = 0;
        
        while (true) {
            const checkStr = formatDateKey(checkDate);
            if (state.completions[checkStr] && state.completions[checkStr].includes(habitId)) {
                current++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    
    return { current, longest };
}
// Calculate the stats for the currently selected month
function calculateMonthlyStats() {
    const year = state.selectedDate.getFullYear();
    const month = state.selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const totalHabits = state.habits.length;
    const goal = totalHabits * daysInMonth;
    
    let completed = 0;
    
    // Iterate through all days of this month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateString(year, month, day);
        if (state.completions[dateStr]) {
            // Count completions that match our active habits list
            state.completions[dateStr].forEach(hId => {
                if (state.habits.some(h => h.id === hId)) {
                    completed++;
                }
            });
        }
    }
    
    const left = Math.max(0, goal - completed);
    const progressPercent = goal > 0 ? Math.round((completed / goal) * 100) : 0;
    
    // Update Stats Display
    dom.statGoal.textContent = goal;
    dom.statCompleted.textContent = completed;
    dom.statLeft.textContent = left;
    dom.statProgress.textContent = `${progressPercent}%`;
}
// ==========================================================================
// DYNAMIC UI RENDERING
// ==========================================================================
// Render Month Switcher Header
function renderMonthHeader() {
    const options = { month: 'long', year: 'numeric' };
    dom.currentMonthLabel.textContent = state.selectedDate.toLocaleDateString('en-US', options);
}
// Render Habit Grid Board
function renderHabitGrid() {
    const year = state.selectedDate.getFullYear();
    const month = state.selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    // Set grid CSS variable for columns count
    dom.habitGridWrapper.style.setProperty('--days-count', daysInMonth);
    
    let html = '<div class="habit-grid">';
    
    // 1. HEADER ROW
    html += `<div class="habit-col-title">HABIT</div>`;
    
    const today = new Date();
    const todayStr = formatDateKey(today);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateString(year, month, day);
        const isToday = dateStr === todayStr;
        const weekday = getWeekdayLetter(year, month, day);
        
        html += `
            <div class="grid-header-cell ${isToday ? 'today' : ''}">
                <span class="day-name">${weekday}</span>
                <span class="day-num">${day}</span>
            </div>
        `;
    }
    
    // 2. HABIT ROWS
    if (state.habits.length === 0) {
        html += `
            <div class="habit-row-header" style="grid-column: 1 / -1; height: 100px; justify-content: center; color: var(--text-muted);">
                No habits defined yet. Click "New Habit" to start!
            </div>
        `;
    } else {
        state.habits.forEach(habit => {
            // Habit Info Sticky Cell
            html += `
                <div class="habit-row-header">
                    <div class="habit-info-group">
                        <span class="habit-row-icon">${habit.icon || '📝'}</span>
                        <span class="habit-row-name" title="${habit.name}">${habit.name}</span>
                    </div>
                    <button class="habit-edit-trigger" data-id="${habit.id}" title="Edit Habit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            // Render 30/31 Checkboxes for this habit
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = formatDateString(year, month, day);
                const isToday = dateStr === todayStr;
                const isChecked = state.completions[dateStr] && state.completions[dateStr].includes(habit.id);
                
                html += `
                    <div class="grid-cell ${isToday ? 'today' : ''}">
                        <button class="check-circle color-${habit.color || 'teal'}-theme ${isChecked ? 'checked' : ''}" 
                                data-habit-id="${habit.id}" 
                                data-date="${dateStr}" 
                                title="${habit.name} - Day ${day}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </button>
                    </div>
                `;
            }
        });
    }
    
    html += '</div>';
    dom.habitGridWrapper.innerHTML = html;
    
    // Re-attach grid listeners
    attachGridListeners();
}
// Attach listeners for interactive grid cells & edit buttons
function attachGridListeners() {
    // Check/Uncheck toggle buttons
    const checkBtns = dom.habitGridWrapper.querySelectorAll('.check-circle');
    checkBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const habitId = btn.dataset.habitId;
            const dateStr = btn.dataset.date;
            
            toggleCompletion(habitId, dateStr);
        });
    });
    
    // Habit edit gear triggers
    const editBtns = dom.habitGridWrapper.querySelectorAll('.habit-edit-trigger');
    editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const habitId = btn.dataset.id;
            openHabitModal(habitId);
        });
    });
}
// Toggle habit completion on a specific date
function toggleCompletion(habitId, dateStr) {
    if (!state.completions[dateStr]) {
        state.completions[dateStr] = [];
    }
    
    const index = state.completions[dateStr].indexOf(habitId);
    if (index === -1) {
        state.completions[dateStr].push(habitId);
    } else {
        state.completions[dateStr].splice(index, 1);
    }
    
    // If date array is empty, clear it
    if (state.completions[dateStr].length === 0) {
        delete state.completions[dateStr];
    }
    
    saveState();
    calculateMonthlyStats();
    
    // Visual update without full grid rebuild for butter-smooth ticks
    const cells = dom.habitGridWrapper.querySelectorAll(`.check-circle[data-habit-id="${habitId}"][data-date="${dateStr}"]`);
    cells.forEach(cell => {
        cell.classList.toggle('checked');
    });
    
    // Update active tab components that rely on state details
    updateActiveTabContent();
}
// Re-render only parts that belong to the active tab to optimize performance
function updateActiveTabContent() {
    const activePanel = document.querySelector('.tab-panel.active');
    if (activePanel.id === 'analytics-tab') {
        renderAnalytics();
    }
}
// Render Analytics Panel
function renderAnalytics() {
    const year = state.selectedDate.getFullYear();
    const month = state.selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const totalHabitsCount = state.habits.length;
    
    // 1. Daily Progress Bar Chart
    let barsHtml = '';
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateString(year, month, day);
        let completedToday = 0;
        
        if (state.completions[dateStr]) {
            state.completions[dateStr].forEach(hId => {
                if (state.habits.some(h => h.id === hId)) {
                    completedToday++;
                }
            });
        }
        
        const percentage = totalHabitsCount > 0 ? Math.round((completedToday / totalHabitsCount) * 100) : 0;
        const tooltip = `Day ${day}: ${completedToday}/${totalHabitsCount} (${percentage}%)`;
        
        barsHtml += `
            <div class="chart-bar-wrapper">
                <div class="chart-bar" style="height: ${percentage}%;" data-tooltip="${tooltip}"></div>
                <span class="chart-bar-date">${day}</span>
            </div>
        `;
    }
    dom.chartBarsContainer.innerHTML = barsHtml;
    
    // 2. Streaks Panel
    let streaksHtml = '';
    // 3. Habit Breakdown Panel
    let ratesHtml = '';
    
    state.habits.forEach(habit => {
        // Calculate Streaks
        const streak = getStreak(habit.id);
        streaksHtml += `
            <div class="streak-item">
                <div class="streak-item-meta">
                    <span class="streak-title">${habit.icon || '📝'} ${habit.name}</span>
                    <div class="streak-item-badges">
                        <span class="streak-badge current">Current: ${streak.current}d</span>
                        <span class="streak-badge">Max: ${streak.longest}d</span>
                    </div>
                </div>
            </div>
        `;
        
        // Calculate Completion Rates for current viewed month
        let completedChecks = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDateString(year, month, day);
            if (state.completions[dateStr] && state.completions[dateStr].includes(habit.id)) {
                completedChecks++;
            }
        }
        
        const ratePercent = daysInMonth > 0 ? Math.round((completedChecks / daysInMonth) * 100) : 0;
        
        ratesHtml += `
            <div class="rate-item">
                <div class="rate-item-meta">
                    <span class="rate-title">${habit.icon || '📝'} ${habit.name}</span>
                    <span class="streak-values">${ratePercent}% (${completedChecks}/${daysInMonth}d)</span>
                </div>
                <div class="analytics-progress-bar color-${habit.color || 'teal'}-theme">
                    <div class="analytics-progress-fill" style="width: ${ratePercent}%; background-color: var(--habit-color-main);"></div>
                </div>
            </div>
        `;
    });
    
    if (state.habits.length === 0) {
        streaksHtml = '<div class="empty-notes-message">No habits to analyze.</div>';
        ratesHtml = '<div class="empty-notes-message">No habits to analyze.</div>';
    }
    
    dom.streaksList.innerHTML = streaksHtml;
    dom.ratesList.innerHTML = ratesHtml;
}
// ==========================================================================
// NOTES & JOURNAL LOGS MODULE
// ==========================================================================
function populateNotesHabitLinkDropdown() {
    let optionsHtml = '<option value="">None</option>';
    state.habits.forEach(habit => {
        optionsHtml += `<option value="${habit.id}">${habit.icon || '📝'} ${habit.name}</option>`;
    });
    dom.noteHabitLink.innerHTML = optionsHtml;
}
function renderNotesList() {
    dom.notesList.innerHTML = '';
    
    // Sort notes by date (descending)
    const sortedNotes = [...state.notes].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedNotes.length === 0) {
        dom.notesList.innerHTML = '<div class="empty-notes-message">No notes recorded yet</div>';
        return;
    }
    
    sortedNotes.forEach(note => {
        const isSelected = note.id === state.activeNoteId;
        const linkedHabit = state.habits.find(h => h.id === note.habitId);
        
        const div = document.createElement('div');
        div.className = `note-item ${isSelected ? 'active' : ''}`;
        div.setAttribute('data-id', note.id);
        
        let tagHtml = '';
        if (linkedHabit) {
            tagHtml = `<span class="note-item-habit-tag color-${linkedHabit.color}-theme">${linkedHabit.icon} ${linkedHabit.name}</span>`;
        }
        
        // Format Date nicely
        const dateObj = new Date(note.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        div.innerHTML = `
            <div class="note-item-header">
                <span class="note-item-date">${formattedDate}</span>
                ${tagHtml}
            </div>
            <div class="note-item-title">${note.title}</div>
            <div class="note-item-preview">${note.content}</div>
        `;
        
        div.addEventListener('click', () => {
            selectNote(note.id);
        });
        
        dom.notesList.appendChild(div);
    });
}
function selectNote(noteId) {
    state.activeNoteId = noteId;
    renderNotesList();
    
    const note = state.notes.find(n => n.id === noteId);
    if (note) {
        dom.noteId.value = note.id;
        dom.noteDate.value = note.date;
        dom.noteHabitLink.value = note.habitId || '';
        dom.noteTitle.value = note.title;
        dom.noteContent.value = note.content;
        dom.deleteNoteBtn.style.display = 'block';
    }
}
function initNewNote() {
    state.activeNoteId = null;
    renderNotesList();
    
    dom.noteId.value = '';
    // Default to currently viewed month date, or today
    const today = new Date();
    dom.noteDate.value = formatDateKey(today);
    dom.noteHabitLink.value = '';
    dom.noteTitle.value = '';
    dom.noteContent.value = '';
    dom.deleteNoteBtn.style.display = 'none';
    
    dom.noteTitle.focus();
}
dom.noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = dom.noteId.value;
    const date = dom.noteDate.value;
    const habitId = dom.noteHabitLink.value;
    const title = dom.noteTitle.value.trim();
    const content = dom.noteContent.value.trim();
    
    if (id) {
        // Update existing note
        const noteIndex = state.notes.findIndex(n => n.id === id);
        if (noteIndex !== -1) {
            state.notes[noteIndex] = { id, date, habitId, title, content };
        }
    } else {
        // Create new note
        const newNote = {
            id: 'n_' + Date.now(),
            date,
            habitId,
            title,
            content
        };
        state.notes.push(newNote);
        state.activeNoteId = newNote.id;
    }
    
    saveState();
    renderNotesList();
    if (state.activeNoteId) {
        selectNote(state.activeNoteId);
    }
});
dom.deleteNoteBtn.addEventListener('click', () => {
    const id = dom.noteId.value;
    if (id && confirm('Are you sure you want to delete this journal entry?')) {
        state.notes = state.notes.filter(n => n.id !== id);
        saveState();
        initNewNote();
    }
});
dom.newNoteBtn.addEventListener('click', initNewNote);
// ==========================================================================
// MODAL DIALOG MODULE (NEW / EDIT HABIT)
// ==========================================================================
let selectedModalIcon = '🕌';
let selectedModalColor = 'teal';
// Setup Modal Selections listeners
dom.iconOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        dom.iconOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedModalIcon = opt.dataset.icon;
    });
});
dom.colorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        dom.colorOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedModalColor = opt.dataset.color;
    });
});
function openHabitModal(habitId = null) {
    dom.habitModal.classList.add('active');
    
    if (habitId) {
        // EDIT MODE
        const habit = state.habits.find(h => h.id === habitId);
        if (habit) {
            dom.modalTitle.textContent = 'Edit Habit';
            dom.habitIdInput.value = habit.id;
            dom.habitName.value = habit.name;
            
            // Set active Icon
            selectedModalIcon = habit.icon || '🕌';
            dom.iconOptions.forEach(opt => {
                opt.classList.toggle('active', opt.dataset.icon === selectedModalIcon);
            });
            
            // Set active Color
            selectedModalColor = habit.color || 'teal';
            dom.colorOptions.forEach(opt => {
                opt.classList.toggle('active', opt.dataset.color === selectedModalColor);
            });
            
            dom.deleteHabitActionBtn.style.display = 'block';
            dom.saveHabitBtn.textContent = 'Save Changes';
        }
    } else {
        // CREATE MODE
        dom.modalTitle.textContent = 'Create New Habit';
        dom.habitIdInput.value = '';
        dom.habitName.value = '';
        
        // Reset defaults
        selectedModalIcon = '🕌';
        dom.iconOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.icon === selectedModalIcon);
        });
        
        selectedModalColor = 'teal';
        dom.colorOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.color === selectedModalColor);
        });
        
        dom.deleteHabitActionBtn.style.display = 'none';
        dom.saveHabitBtn.textContent = 'Create Habit';
    }
    
    dom.habitName.focus();
}
function closeHabitModal() {
    dom.habitModal.classList.remove('active');
}
// Modal closes triggers
dom.closeHabitModalBtn.addEventListener('click', closeHabitModal);
dom.cancelHabitModalBtn.addEventListener('click', closeHabitModal);
dom.addHabitBtn.addEventListener('click', () => openHabitModal(null));
// Save / Submit Habit Modal form
dom.habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = dom.habitIdInput.value;
    const name = dom.habitName.value.trim();
    const icon = selectedModalIcon;
    const color = selectedModalColor;
    
    if (id) {
        // Edit Habit
        const idx = state.habits.findIndex(h => h.id === id);
        if (idx !== -1) {
            state.habits[idx] = { id, name, icon, color };
        }
    } else {
        // Create Habit
        const newHabit = {
            id: 'h_' + Date.now(),
            name,
            icon,
            color
        };
        state.habits.push(newHabit);
    }
    
    saveState();
    closeHabitModal();
    
    // Refresh UI
    renderHabitGrid();
    calculateMonthlyStats();
    populateNotesHabitLinkDropdown();
    updateActiveTabContent();
});
// Delete Habit Action inside modal
dom.deleteHabitActionBtn.addEventListener('click', () => {
    const id = dom.habitIdInput.value;
    if (id && confirm('Are you sure you want to delete this habit? All completions data for this habit will be hidden.')) {
        state.habits = state.habits.filter(h => h.id !== id);
        // Clean completions of this deleted habit ID
        Object.keys(state.completions).forEach(dateStr => {
            state.completions[dateStr] = state.completions[dateStr].filter(hId => hId !== id);
            if (state.completions[dateStr].length === 0) {
                delete state.completions[dateStr];
            }
        });
        
        saveState();
        closeHabitModal();
        
        // Refresh UI
        renderHabitGrid();
        calculateMonthlyStats();
        populateNotesHabitLinkDropdown();
        updateActiveTabContent();
    }
});
// ==========================================================================
// MONTH SWITCHER NAVIGATION
// ==========================================================================
dom.prevMonthBtn.addEventListener('click', () => {
    state.selectedDate.setMonth(state.selectedDate.getMonth() - 1);
    
    renderMonthHeader();
    renderHabitGrid();
    calculateMonthlyStats();
    updateActiveTabContent();
});
dom.nextMonthBtn.addEventListener('click', () => {
    state.selectedDate.setMonth(state.selectedDate.getMonth() + 1);
    
    renderMonthHeader();
    renderHabitGrid();
    calculateMonthlyStats();
    updateActiveTabContent();
});
// ==========================================================================
// CORE NAVIGATION & TAB SYSTEM
// ==========================================================================
dom.menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabId = item.dataset.tab;
        
        // Deactivate all menu items & tab panels
        dom.menuItems.forEach(i => i.classList.remove('active'));
        dom.tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Activate current tab
        item.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        // Render tab contents if necessary
        if (tabId === 'analytics-tab') {
            renderAnalytics();
        } else if (tabId === 'notes-tab') {
            populateNotesHabitLinkDropdown();
            renderNotesList();
            initNewNote();
        }
    });
});
// ==========================================================================
// THEME MODULE
// ==========================================================================
function updateThemeIcons() {
    if (state.theme === 'dark') {
        dom.sunIcon.style.display = 'block';
        dom.moonIcon.style.display = 'none';
    } else {
        dom.sunIcon.style.display = 'none';
        dom.moonIcon.style.display = 'block';
    }
}
dom.themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem(LS_THEME, state.theme);
    updateThemeIcons();
});
// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // Set default month to June 2026 for compatibility with screenshots
    state.selectedDate = new Date(2026, 5, 10); // month is 0-indexed (5 = June)
    
    loadState();
    
    // Initial Render
    renderMonthHeader();
    calculateMonthlyStats();
    renderHabitGrid();
});
