document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const openModalBtn = document.getElementById('open-modal-btn');
    const verseModalOverlay = document.getElementById('verse-modal-overlay');
    const modalTitleAdd = document.getElementById('modal-title-add');
    const modalTitleEdit = document.getElementById('modal-title-edit');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const closeModalXBtn = document.getElementById('close-modal-x-btn');
    const searchVerseBtn = document.getElementById('search-verse-btn');
    const saveModalBtn = document.getElementById('save-modal-btn');
    const verseInput = document.getElementById('modal-verse-input');
    const verseInfoContainer = document.getElementById('modal-verse-info');
    const verseTextEl = document.getElementById('modal-verse-text');
    const statusMessageEl = document.getElementById('modal-status-message');
    const savedVersesList = document.getElementById('saved-verses-list');
    const emptyState = document.getElementById('empty-state');
    const noResultsState = document.getElementById('no-results-state');
    const verseSearchInput = document.getElementById('verse-search-input');
    
    // UI Práctica
    const practiceScreen = document.getElementById('practice-screen');
    const practiceProgressFill = document.getElementById('practice-progress-fill');
    const practiceVerseContainer = document.getElementById('practice-verse-container');
    const practiceCheckBtn = document.getElementById('practice-check-btn');
    const practiceFooter = document.getElementById('practice-footer');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackSubtitle = document.getElementById('feedback-subtitle');
    const feedbackIcon = document.getElementById('feedback-icon');

    // RSVP Reader
    const rsvpScreen = document.getElementById('rsvp-screen');
    const rsvpWordDisplay = document.getElementById('rsvp-word-display');
    const rsvpWpmDisplay = document.getElementById('rsvp-wpm-display');
    const rsvpMainBtn = document.getElementById('rsvp-main-btn');

    // --- ESTADO ---
    let currentFetchedVerse = null;
    let isEditing = false;
    let currentVerseId = null;
    let practiceState = { verse: null, isChecked: false };
    const TOTAL_LEVELS = 4;

    let rsvpState = {
        words: [], currentIndex: 0, readingInterval: null,
        isPaused: true, isFinished: false, currentWpm: 300
    };

    // --- API & UTILIDADES ---
    const books=[{name:"Génesis",abrev:"GN"},{name:"Éxodo",abrev:"EX"},{name:"Levítico",abrev:"LV"},{name:"Números",abrev:"NM"},{name:"Deuteronomio",abrev:"DT"},{name:"Josué",abrev:"JOS"},{name:"Jueces",abrev:"JUE"},{name:"Rut",abrev:"RT"},{name:"1 Samuel",abrev:"1S"},{name:"2 Samuel",abrev:"2S"},{name:"1 Reyes",abrev:"1R"},{name:"2 Reyes",abrev:"2R"},{name:"1 Crónicas",abrev:"1CR"},{name:"2 Crónicas",abrev:"2CR"},{name:"Esdras",abrev:"ESD"},{name:"Nehemías",abrev:"NEH"},{name:"Ester",abrev:"EST"},{name:"Job",abrev:"JOB"},{name:"Salmos",abrev:"SAL"},{name:"Proverbios",abrev:"PR"},{name:"Eclesiastés",abrev:"EC"},{name:"Cantares",abrev:"CNT"},{name:"Isaías",abrev:"IS"},{name:"Jeremías",abrev:"JER"},{name:"Lamentaciones",abrev:"LM"},{name:"Ezequiel",abrev:"EZ"},{name:"Daniel",abrev:"DN"},{name:"Oseas",abrev:"OS"},{name:"Joel",abrev:"JL"},{name:"Amós",abrev:"AM"},{name:"Abdías",abrev:"ABD"},{name:"Jonás",abrev:"JON"},{name:"Miqueas",abrev:"MI"},{name:"Nahúm",abrev:"NAH"},{name:"Habacuc",abrev:"HAB"},{name:"Sofonías",abrev:"SOF"},{name:"Hageo",abrev:"HAG"},{name:"Zacarías",abrev:"ZAC"},{name:"Malaquías",abrev:"MAL"},{name:"Mateo",abrev:"MT"},{name:"Marcos",abrev:"MR"},{name:"Lucas",abrev:"LC"},{name:"Juan",abrev:"JN"},{name:"Hechos",abrev:"HCH"},{name:"Romanos",abrev:"RO"},{name:"1 Corintios",abrev:"1CO"},{name:"2 Corintios",abrev:"2CO"},{name:"Gálatas",abrev:"GA"},{name:"Efesios",abrev:"EF"},{name:"Filipenses",abrev:"FIL"},{name:"Colosenses",abrev:"COL"},{name:"1 Tesalonicenses",abrev:"1TS"},{name:"2 Tesalonicenses",abrev:"2TS"},{name:"1 Timoteo",abrev:"1TI"},{name:"2 Timoteo",abrev:"2TI"},{name:"Tito",abrev:"TIT"},{name:"Filemón",abrev:"FLM"},{name:"Hebreos",abrev:"HE"},{name:"Santiago",abrev:"STG"},{name:"1 Pedro",abrev:"1P"},{name:"2 Pedro",abrev:"2P"},{name:"1 Juan",abrev:"1JN"},{name:"2 Juan",abrev:"2JN"},{name:"3 Juan",abrev:"3JN"},{name:"Judas",abrev:"JUD"},{name:"Apocalipsis",abrev:"AP"}];
    const findBookAbrev=(b)=>{const n=b.toLowerCase().replace(/[\s-]/g,"");return books.find(b=>b.name.toLowerCase().replace(/[\s-]/g,"").includes(n))?.abrev||null};
    const findBookName=(a)=>books.find(b=>b.abrev===a)?.name||a;
    const parseInput=(i)=>i.trim().match(/(.+?)\s*(\d+):(\d+)(?:-(\d+))?$/i);

    async function fetchVerseData(ref){
        const m=parseInput(ref); if(!m)return{error:"Formato inválido (Ej: Juan 3:16)"};
        const[,b,c,vs,ve]=m; const ba=findBookAbrev(b); if(!ba)return{error:`Libro no encontrado: ${b}`};
        const vr=ve?`${vs}-${ve}`:vs; const u=`https://bible-api.deno.dev/api/read/rv1960/${ba}/${c}/${vr}`;
        try{
            const r=await fetch(u); if(!r.ok)throw new Error("No se encontró el versículo.");
            const d=await r.json(); const da=Array.isArray(d)?d:[d];
            const ft=da.map(v=>v.verse.trim()).join(" ");
            let fr=`${findBookName(ba)} ${c}:${da[0].number}${da.length>1?`-${da[da.length-1].number}`:''}`;
            return {text:ft, reference:fr, originalInput:ref.trim()}
        }catch(e){return{error:e.message}}
    };

    // --- GESTIÓN DE DATOS ---
    const getSavedVerses = () => JSON.parse(localStorage.getItem('myVerses')) || [];
    const saveVersesToStorage = (v) => localStorage.setItem('myVerses', JSON.stringify(v));

    const renderPage = () => {
        const verses = getSavedVerses();
        const search = verseSearchInput.value.toLowerCase();
        const filtered = verses.filter(v => v.reference.toLowerCase().includes(search) || v.text.toLowerCase().includes(search));
        
        document.getElementById('total-verses-stat').textContent = verses.length;
        document.getElementById('dominated-verses-stat').textContent = verses.filter(v => v.isDominated).length;

        emptyState.classList.toggle('hidden', verses.length > 0);
        noResultsState.classList.toggle('hidden', filtered.length > 0 || verses.length === 0);
        
        savedVersesList.innerHTML = '';
        filtered.sort((a,b) => (b.lastPracticed || 0) - (a.lastPracticed || 0)).forEach(verse => {
            const level = verse.currentLevel || 1;
            const progress = level > TOTAL_LEVELS ? 100 : Math.round(((level - 1) / TOTAL_LEVELS) * 100);
            
            const card = document.createElement('div');
            card.className = 'verse-card p-6 relative group';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-xl font-black text-[var(--dark-blue)]">${verse.reference}</h4>
                        <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">${verse.isDominated ? '⭐ Dominado' : `Nivel ${level}`}</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="rsvp-btn p-2 text-gray-400 hover:text-[var(--blue)]"><span class="iconify text-2xl" data-icon="material-symbols:speed-outline"></span></button>
                        <button class="delete-btn p-2 text-gray-400 hover:text-red-500"><span class="iconify text-2xl" data-icon="material-symbols:delete-outline"></span></button>
                    </div>
                </div>
                <p class="text-gray-600 font-medium mb-6 line-clamp-2 italic">"${verse.text}"</p>
                <div class="flex items-center gap-4">
                    <div class="flex-grow bg-gray-100 h-3 rounded-full overflow-hidden">
                        <div class="bg-[var(--green)] h-full transition-all" style="width: ${progress}%"></div>
                    </div>
                    <button class="practice-btn btn-duo ${verse.isDominated ? 'bg-gray-100 text-gray-400 border-gray-200' : 'btn-primary'} px-4 py-2 rounded-xl text-xs">
                        ${verse.isDominated ? 'REPASAR' : 'PRACTICAR'}
                    </button>
                </div>
            `;
            
            card.querySelector('.practice-btn').onclick = () => openPractice(verse.id);
            card.querySelector('.delete-btn').onclick = () => { if(confirm('¿Borrar?')) { saveVersesToStorage(getSavedVerses().filter(v => v.id !== verse.id)); renderPage(); }};
            card.querySelector('.rsvp-btn').onclick = () => openRsvp(verse);
            savedVersesList.appendChild(card);
        });
    };

    // --- LÓGICA DE PRÁCTICA ---
    const openPractice = (id) => {
        const verse = getSavedVerses().find(v => v.id === id);
        if(!verse) return;
        practiceState = { verse, isChecked: false };
        
        // UI Reset
        practiceFooter.className = 'check-footer';
        feedbackMessage.classList.add('hidden');
        practiceCheckBtn.textContent = 'COMPROBAR';
        practiceCheckBtn.className = 'btn-duo btn-success w-full sm:w-48 py-4 rounded-2xl text-lg';
        
        const level = verse.currentLevel > TOTAL_LEVELS ? 4 : verse.currentLevel;
        setupLevel(level);
        
        const progress = ((level - 1) / TOTAL_LEVELS) * 100;
        practiceProgressFill.style.width = `${progress || 5}%`;
        
        practiceScreen.classList.add('open');
    };

    const setupLevel = (level) => {
        let percentage = 0.2;
        let hint = false;
        
        if(level === 2) { percentage = 0.4; hint = true; }
        if(level === 3) { percentage = 0.6; }
        if(level === 4) { percentage = 1.0; }

        const { html } = createBlanks(practiceState.verse.text, percentage, hint);
        practiceVerseContainer.innerHTML = html;
        
        const inputs = practiceVerseContainer.querySelectorAll('input');
        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => { if(input.value.length >= input.dataset.correct.length) inputs[idx+1]?.focus(); });
            if(idx === 0) input.focus();
        });
    };

    const createBlanks = (text, ratio, withHint) => {
        const words = text.split(/(\s+|[.,:;¡!¿?]+)/);
        let html = "";
        
        words.forEach(part => {
            const clean = part.replace(/[.,:;¡!¿?]/g, '').toLowerCase();
            if(clean.length > 0 && Math.random() < ratio) {
                const width = Math.max(60, clean.length * 15);
                const placeholder = withHint ? clean[0] : '';
                html += `<input type="text" class="blank-input" data-correct="${clean}" placeholder="${placeholder}" style="width: ${width}px" autocomplete="off">`;
            } else {
                html += part;
            }
        });
        return { html };
    };

    const checkAnswers = () => {
        if(practiceState.isChecked) { // Botón "Continuar"
            practiceScreen.classList.remove('open');
            renderPage();
            return;
        }

        const inputs = Array.from(practiceVerseContainer.querySelectorAll('input'));
        let allCorrect = true;
        
        inputs.forEach(input => {
            const isCorrect = input.value.trim().toLowerCase() === input.dataset.correct;
            input.className = `blank-input ${isCorrect ? 'correct' : 'incorrect'}`;
            if(!isCorrect) allCorrect = false;
        });

        practiceState.isChecked = true;
        feedbackMessage.classList.remove('hidden');
        practiceCheckBtn.textContent = 'CONTINUAR';

        if(allCorrect) {
            feedbackTitle.textContent = '¡Excelente trabajo!';
            feedbackSubtitle.textContent = 'Has avanzado en tu memorización.';
            feedbackIcon.dataset.icon = 'material-symbols:check-circle';
            feedbackIcon.className = 'iconify text-5xl text-[var(--green-dark)]';
            practiceFooter.classList.add('correct-bg');
            practiceCheckBtn.className = 'btn-duo btn-success w-full sm:w-48 py-4 rounded-2xl text-lg';
            
            // Actualizar Progreso
            let verses = getSavedVerses();
            const idx = verses.findIndex(v => v.id === practiceState.verse.id);
            verses[idx].currentLevel = (verses[idx].currentLevel || 1) + 1;
            verses[idx].lastPracticed = Date.now();
            verses[idx].practiceCount = (verses[idx].practiceCount || 0) + 1;
            if(verses[idx].currentLevel > TOTAL_LEVELS) verses[idx].isDominated = true;
            saveVersesToStorage(verses);
            
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
            feedbackTitle.textContent = '¡Casi lo logras!';
            feedbackSubtitle.textContent = 'Revisa las palabras marcadas en rojo.';
            feedbackIcon.dataset.icon = 'material-symbols:error-rounded';
            feedbackIcon.className = 'iconify text-5xl text-[var(--red-dark)]';
            practiceFooter.classList.add('incorrect-bg');
            practiceCheckBtn.className = 'btn-duo btn-error w-full sm:w-48 py-4 rounded-2xl text-lg';
        }
    };

    // --- RSVP READER ---
    const openRsvp = (verse) => {
        rsvpState.words = verse.text.split(/\s+/);
        rsvpState.currentIndex = 0;
        rsvpState.isPaused = true;
        rsvpState.isFinished = false;
        rsvpUpdateUI();
        rsvpScreen.classList.add('open');
    };

    const rsvpUpdateUI = () => {
        rsvpWpmDisplay.textContent = `${rsvpState.currentWpm} WPM`;
        document.getElementById('rsvp-play-icon').classList.toggle('hidden', !rsvpState.isPaused);
        document.getElementById('rsvp-pause-icon').classList.toggle('hidden', rsvpState.isPaused);
        if(rsvpState.isFinished) {
             document.getElementById('rsvp-play-icon').classList.add('hidden');
             document.getElementById('rsvp-restart-icon').classList.remove('hidden');
        } else {
             document.getElementById('rsvp-restart-icon').classList.add('hidden');
        }
    };

    const rsvpRun = () => {
        if(rsvpState.readingInterval) clearInterval(rsvpState.readingInterval);
        if(rsvpState.isPaused || rsvpState.isFinished) return;

        const delay = 60000 / rsvpState.currentWpm;
        rsvpState.readingInterval = setInterval(() => {
            if(rsvpState.currentIndex < rsvpState.words.length) {
                rsvpWordDisplay.textContent = rsvpState.words[rsvpState.currentIndex];
                rsvpState.currentIndex++;
            } else {
                clearInterval(rsvpState.readingInterval);
                rsvpState.isFinished = true;
                rsvpState.isPaused = true;
                rsvpUpdateUI();
            }
        }, delay);
    };

    // --- EVENT LISTENERS ---
    openModalBtn.onclick = () => {
        isEditing = false;
        verseInput.value = "";
        verseInfoContainer.classList.add('hidden');
        saveModalBtn.disabled = true;
        verseModalOverlay.classList.add('open');
    };

    closeModalXBtn.onclick = cancelModalBtn.onclick = () => verseModalOverlay.classList.remove('open');

    searchVerseBtn.onclick = async () => {
        statusMessageEl.textContent = "Buscando...";
        const data = await fetchVerseData(verseInput.value);
        if(data.error) {
            statusMessageEl.className = "text-sm font-bold text-red-500";
            statusMessageEl.textContent = data.error;
        } else {
            currentFetchedVerse = data;
            verseTextEl.textContent = data.text;
            verseInfoContainer.classList.remove('hidden');
            saveModalBtn.disabled = false;
            statusMessageEl.textContent = "";
        }
    };

    saveModalBtn.onclick = () => {
        let verses = getSavedVerses();
        verses.push({ ...currentFetchedVerse, id: Date.now(), currentLevel: 1, isDominated: false });
        saveVersesToStorage(verses);
        verseModalOverlay.classList.remove('open');
        renderPage();
    };

    practiceCheckBtn.onclick = checkAnswers;
    document.getElementById('practice-close-btn').onclick = () => practiceScreen.classList.remove('open');
    verseSearchInput.oninput = renderPage;

    rsvpMainBtn.onclick = () => {
        if(rsvpState.isFinished) { rsvpState.currentIndex = 0; rsvpState.isFinished = false; }
        rsvpState.isPaused = !rsvpState.isPaused;
        rsvpUpdateUI();
        rsvpRun();
    };
    document.getElementById('rsvp-close-btn').onclick = () => { clearInterval(rsvpState.readingInterval); rsvpScreen.classList.remove('open'); };
    document.getElementById('rsvp-next-btn').onclick = () => { rsvpState.currentWpm += 25; rsvpUpdateUI(); rsvpRun(); };
    document.getElementById('rsvp-prev-btn').onclick = () => { rsvpState.currentWpm = Math.max(50, rsvpState.currentWpm - 25); rsvpUpdateUI(); rsvpRun(); };

    // Init
    renderPage();
});