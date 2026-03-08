document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS ---
    const elements = {
        list: document.getElementById('saved-verses-list'),
        search: document.getElementById('verse-search-input'),
        totalPoints: document.getElementById('total-points-stat'),
        streakStat: document.getElementById('streak-stat'),
        // Modales y Pantallas
        modal: document.getElementById('verse-modal-overlay'),
        practice: document.getElementById('practice-screen'),
        rsvp: document.getElementById('rsvp-screen'),
        // Botones
        openModal: document.getElementById('open-modal-btn'),
        saveBtn: document.getElementById('save-modal-btn'),
        searchApiBtn: document.getElementById('search-verse-btn'),
        checkBtn: document.getElementById('practice-check-btn'),
        hintBtn: document.getElementById('hint-peek-btn'),
        surrenderBtn: document.getElementById('surrender-btn'),
        // Practice points
        practicePoints: document.getElementById('practice-points')
    };

    // --- ESTADO ---
    let state = {
        verses: JSON.parse(localStorage.getItem('myVerses')) || [],
        points: parseInt(localStorage.getItem('userPoints')) || 0,
        streak: parseInt(localStorage.getItem('userStreak')) || 0,
        lastPracticeDate: localStorage.getItem('lastPracticeDate') || null,
        currentVerse: null,
        isExam: false,
        isChecked: false
    };

    const DOMINATION_PERIOD = 1000 * 60 * 60 * 24 * 60; // 60 días (2 meses)

    // --- UTILIDADES ---
    const save = () => {
        localStorage.setItem('myVerses', JSON.stringify(state.verses));
        localStorage.setItem('userPoints', state.points);
        localStorage.setItem('userStreak', state.streak);
        localStorage.setItem('lastPracticeDate', state.lastPracticeDate);
        renderPage();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    const parseRef = (i) => i.trim().match(/(.+?)\s*(\d+):(\d+)(?:-(\d+))?$/i);

    // --- FUNCIÓN PARA ACTUALIZAR RACHA ---
    const updateStreak = () => {
        const today = new Date().toDateString(); // formato 'Mon DD YYYY'
        if (!state.lastPracticeDate) {
            // Primera práctica
            state.streak = 1;
        } else {
            const last = new Date(state.lastPracticeDate);
            const lastDay = new Date(last).setHours(0,0,0,0);
            const todayDay = new Date().setHours(0,0,0,0);
            const diffDays = Math.round((todayDay - lastDay) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Día consecutivo
                state.streak += 1;
            } else if (diffDays > 1) {
                // Se rompió la racha
                state.streak = 1;
            }
            // Si diffDays === 0, misma día, no cambiar
        }
        state.lastPracticeDate = today;
    };

    // --- LÓGICA DE NEGOCIO ---
    async function fetchVerse(ref) {
        const m = parseRef(ref); if(!m) return {error: "Escribe bien la cita, King."};
        const u = `https://bible-api.deno.dev/api/read/rv1960/${m[1].toLowerCase().substring(0,2)}/${m[2]}/${m[3]}${m[4]?'-'+m[4]:''}`;
        try {
            const r = await fetch(u); if(!r.ok) throw new Error();
            const d = await r.json(); const da = Array.isArray(d) ? d : [d];
            return { text: da.map(v => v.verse.trim()).join(" "), reference: ref, originalInput: ref };
        } catch(e) { return {error: "No encontré ese verso."}; }
    }

    const renderPage = () => {
        elements.totalPoints.textContent = state.points;
        elements.streakStat.textContent = state.streak;
        const query = elements.search.value.toLowerCase();
        const filtered = state.verses.filter(v => v.reference.toLowerCase().includes(query) || v.text.toLowerCase().includes(query));
        
        document.getElementById('total-verses-stat').textContent = state.verses.length;
        document.getElementById('dominated-verses-stat').textContent = state.verses.filter(v => v.isDominated).length;

        elements.list.innerHTML = '';
        filtered.forEach(v => {
            const timeDiff = Date.now() - (v.dominationDate || 0);
            const needsReview = v.isDominated && timeDiff > DOMINATION_PERIOD;
            const level = v.currentLevel || 1;
            const progress = v.isDominated ? 100 : Math.round(((level - 1) / 4) * 100);

            const card = document.createElement('div');
            card.className = `verse-card p-6 bg-white transition-all ${needsReview ? 'border-orange-400' : ''}`;
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <h4 class="text-xl font-black">${v.reference}</h4>
                    <button class="delete-verse text-gray-300 hover:text-red-500"><span class="iconify text-xl" data-icon="material-symbols:delete-outline"></span></button>
                </div>
                <p class="text-gray-500 font-bold mb-4 line-clamp-2 italic">"${v.text}"</p>
                <div class="flex items-center gap-3">
                    <div class="flex-grow bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div class="bg-[var(--green)] h-full transition-all" style="width: ${progress}%"></div>
                    </div>
                    ${needsReview 
                        ? `<button class="exam-btn btn-duo bg-orange-500 text-white border-orange-700 px-4 py-2 rounded-xl text-xs">EXAMEN</button>`
                        : `<button class="practice-btn btn-duo ${v.isDominated ? 'btn-ghost text-xs' : 'btn-primary px-6 py-2'} rounded-xl text-xs">
                            ${v.isDominated ? 'REPASO' : 'NIVEL ' + level}
                           </button>`
                    }
                </div>
            `;
            
            card.querySelector('.practice-btn')?.addEventListener('click', () => startPractice(v, false));
            card.querySelector('.exam-btn')?.addEventListener('click', () => startPractice(v, true));
            card.querySelector('.delete-verse').onclick = () => { if(confirm('¿Borrar?')) { state.verses = state.verses.filter(x => x.id !== v.id); save(); }};
            elements.list.appendChild(card);
        });
    };

    // --- PRÁCTICA Y NIVELES ---
    const startPractice = (verse, isExam) => {
        toggleFullscreen();
        state.currentVerse = verse;
        state.isExam = isExam;
        state.isChecked = false;
        
        const level = isExam ? 4 : (verse.currentLevel || 1);
        document.getElementById('practice-mode-title').textContent = isExam ? "EXAMEN FINAL" : `NIVEL ${level}`;
        
        // Mostrar puntos actuales en el header de práctica
        elements.practicePoints.textContent = state.points;
        
        document.getElementById('practice-progress-fill').style.width = `${((level-1)/4)*100}%`;
        
        elements.surrenderBtn.classList.toggle('hidden', !isExam);
        resetUI();
        generateBlanks(level);
        elements.practice.classList.add('open');
    };

    const generateBlanks = (level) => {
        const text = state.currentVerse.text;
        const ratios = [0.2, 0.4, 0.6, 1.0];
        const ratio = ratios[level - 1];
        
        const words = text.split(/(\s+)/);
        let html = "";
        
        words.forEach(part => {
            const clean = part.replace(/[.,:;¡!¿?]/g, '');
            if(clean.length > 2 && Math.random() < ratio) {
                const w = Math.max(40, clean.length * 12);
                html += `<input type="text" class="blank-input" data-correct="${clean.toLowerCase()}" style="width:${w}px" autocomplete="off" spellcheck="false">`;
                const punctuation = part.substring(clean.length);
                if(punctuation) html += punctuation;
            } else {
                html += part;
            }
        });
        document.getElementById('practice-verse-container').innerHTML = html;
        document.querySelector('.blank-input')?.focus();
    };

    const animatePoints = () => {
        elements.practicePoints.classList.add('points-pop');
        setTimeout(() => elements.practicePoints.classList.remove('points-pop'), 300);
    };

    const check = () => {
        if(state.isChecked) {
            elements.practice.classList.remove('open');
            renderPage();
            return;
        }

        const inputs = Array.from(document.querySelectorAll('.blank-input'));
        const allCorrect = inputs.every(i => i.value.trim().toLowerCase() === i.dataset.correct);

        inputs.forEach(i => i.className = `blank-input ${i.value.trim().toLowerCase() === i.dataset.correct ? 'correct' : 'incorrect'}`);
        
        state.isChecked = true;
        const feedback = document.getElementById('feedback-message');
        feedback.classList.remove('hidden');
        elements.checkBtn.textContent = "CONTINUAR";

        if(allCorrect) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            const pointsWin = state.isExam ? 100 : (state.currentVerse.currentLevel * 10);
            state.points += pointsWin;
            // Actualizar y animar puntos en práctica
            elements.practicePoints.textContent = state.points;
            animatePoints();
            
            // Actualizar racha
            updateStreak();
            
            const idx = state.verses.findIndex(v => v.id === state.currentVerse.id);
            if(state.isExam || state.currentVerse.currentLevel >= 4) {
                state.verses[idx].isDominated = true;
                state.verses[idx].dominationDate = Date.now();
                state.verses[idx].currentLevel = 5;
            } else {
                state.verses[idx].currentLevel++;
            }
            document.getElementById('feedback-title').textContent = "¡Brillante!";
            document.getElementById('feedback-subtitle').textContent = `Ganaste +${pointsWin} puntos.`;
            document.getElementById('practice-footer').classList.add('correct-bg');
        } else {
            if(state.isExam) {
                const idx = state.verses.findIndex(v => v.id === state.currentVerse.id);
                state.verses[idx].isDominated = false;
                state.verses[idx].currentLevel = 1;
            }
            document.getElementById('feedback-title').textContent = "Casi, Kraut.";
            document.getElementById('feedback-subtitle').textContent = state.isExam ? "Fallaste el examen. Nivel reseteado." : "Inténtalo de nuevo.";
            document.getElementById('practice-footer').classList.add('incorrect-bg');
            elements.checkBtn.className = "flex-[2] btn-duo btn-error py-4 rounded-2xl text-lg";
        }
        save();
    };

    const resetUI = () => {
        document.getElementById('feedback-message').classList.add('hidden');
        document.getElementById('practice-footer').classList.remove('correct-bg', 'incorrect-bg');
        elements.checkBtn.textContent = "COMPROBAR";
        elements.checkBtn.className = "flex-[2] btn-duo btn-success py-4 rounded-2xl text-lg";
    };

    // --- RSVP ---
    let rsvpInterval;
    const startRSVP = (verse) => {
        toggleFullscreen();
        const words = verse.text.split(/\s+/);
        let idx = 0;
        const display = document.getElementById('rsvp-word-display');
        
        const showWord = () => {
            if(idx >= words.length) { clearInterval(rsvpInterval); return; }
            const word = words[idx];
            const pivotIdx = Math.floor(word.length / 2);
            const before = word.substring(0, pivotIdx);
            const pivot = word[pivotIdx];
            const after = word.substring(pivotIdx + 1);
            
            display.innerHTML = `<span>${before}</span><span class="rsvp-pivot">${pivot}</span><span>${after}</span>`;
            idx++;
        };

        clearInterval(rsvpInterval);
        rsvpInterval = setInterval(showWord, 200); // 300 WPM aprox
        elements.rsvp.classList.add('open');
    };

    // --- EVENTOS ---
    elements.openModal.onclick = () => { elements.modal.classList.add('open'); toggleFullscreen(); };
    document.getElementById('cancel-modal-btn').onclick = () => elements.modal.classList.remove('open');
    
    elements.searchApiBtn.onclick = async () => {
        const res = await fetchVerse(document.getElementById('modal-verse-input').value);
        if(res.error) {
            document.getElementById('modal-status-message').textContent = res.error;
        } else {
            state.tempVerse = res;
            document.getElementById('modal-verse-text').textContent = res.text;
            document.getElementById('modal-verse-info').classList.remove('hidden');
            elements.saveBtn.disabled = false;
        }
    };

    elements.saveBtn.onclick = () => {
        state.verses.push({...state.tempVerse, id: Date.now(), currentLevel: 1, isDominated: false});
        save();
        elements.modal.classList.remove('open');
    };

    elements.checkBtn.onclick = check;
    
    // Hint sin límite (ilimitado)
    elements.hintBtn.onclick = () => {
        const container = document.getElementById('practice-verse-container');
        const originalHTML = container.innerHTML;
        container.innerHTML = `<p class="text-blue-500 animate-pulse">${state.currentVerse.text}</p>`;
        setTimeout(() => container.innerHTML = originalHTML, 2000);
    };

    elements.surrenderBtn.onclick = () => {
        const idx = state.verses.findIndex(v => v.id === state.currentVerse.id);
        state.verses[idx].isDominated = false;
        state.verses[idx].currentLevel = 1;
        save();
        elements.practice.classList.remove('open');
    };

    document.getElementById('practice-close-btn').onclick = () => elements.practice.classList.remove('open');
    document.getElementById('rsvp-close-btn').onclick = () => { clearInterval(rsvpInterval); elements.rsvp.classList.remove('open'); };
    elements.search.oninput = renderPage;

    renderPage();
});