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
    const practiceScreen = document.getElementById('practice-screen');
    const practiceTitle = document.getElementById('practice-title');
    const practiceVerseContainer = document.getElementById('practice-verse-container');
    const practiceWordBankContainer = document.getElementById('practice-word-bank-container');
    const practiceWordBank = document.getElementById('practice-word-bank');
    const practiceStatusMessage = document.getElementById('practice-status-message');
    const practiceCheckBtn = document.getElementById('practice-check-btn');
    const practiceCloseBtn = document.getElementById('practice-close-btn');
    const practiceToggleBtn = document.getElementById('practice-toggle-btn');
    const totalVersesStat = document.getElementById('total-verses-stat');
    const dominatedVersesStat = document.getElementById('dominated-verses-stat');
    const totalPracticesStat = document.getElementById('total-practices-stat');

    // --- ELEMENTOS Y ESTADO DE RSVP ---
    const rsvpScreen = document.getElementById('rsvp-screen');
    const rsvpCloseBtn = document.getElementById('rsvp-close-btn');
    const rsvpTitle = document.getElementById('rsvp-title');
    const rsvpWordDisplay = document.getElementById('rsvp-word-display');
    const rsvpWpmDisplay = document.getElementById('rsvp-wpm-display');
    const rsvpMainBtn = document.getElementById('rsvp-main-btn');
    const rsvpPlayIcon = document.getElementById('rsvp-play-icon');
    const rsvpPauseIcon = document.getElementById('rsvp-pause-icon');
    const rsvpRestartIcon = document.getElementById('rsvp-restart-icon');
    const rsvpPrevBtn = document.getElementById('rsvp-prev-btn');
    const rsvpNextBtn = document.getElementById('rsvp-next-btn');
    let rsvpState = {
        words: [],
        currentIndex: 0,
        readingInterval: null,
        isPaused: true,
        isFinished: false,
        currentWpm: 300
    };

    // --- ESTADO DE LA APP ---
    let currentFetchedVerse = null;
    let isEditing = false;
    let currentVerseId = null;
    let practiceState = {};
    const TOTAL_LEVELS = 4;

    // --- API BÍBLICA Y UTILIDADES ---
    const books=[{name:"Génesis",abrev:"GN"},{name:"Éxodo",abrev:"EX"},{name:"Levítico",abrev:"LV"},{name:"Números",abrev:"NM"},{name:"Deuteronomio",abrev:"DT"},{name:"Josué",abrev:"JOS"},{name:"Jueces",abrev:"JUE"},{name:"Rut",abrev:"RT"},{name:"1 Samuel",abrev:"1S"},{name:"2 Samuel",abrev:"2S"},{name:"1 Reyes",abrev:"1R"},{name:"2 Reyes",abrev:"2R"},{name:"1 Crónicas",abrev:"1CR"},{name:"2 Crónicas",abrev:"2CR"},{name:"Esdras",abrev:"ESD"},{name:"Nehemías",abrev:"NEH"},{name:"Ester",abrev:"EST"},{name:"Job",abrev:"JOB"},{name:"Salmos",abrev:"SAL"},{name:"Proverbios",abrev:"PR"},{name:"Eclesiastés",abrev:"EC"},{name:"Cantares",abrev:"CNT"},{name:"Isaías",abrev:"IS"},{name:"Jeremías",abrev:"JER"},{name:"Lamentaciones",abrev:"LM"},{name:"Ezequiel",abrev:"EZ"},{name:"Daniel",abrev:"DN"},{name:"Oseas",abrev:"OS"},{name:"Joel",abrev:"JL"},{name:"Amós",abrev:"AM"},{name:"Abdías",abrev:"ABD"},{name:"Jonás",abrev:"JON"},{name:"Miqueas",abrev:"MI"},{name:"Nahúm",abrev:"NAH"},{name:"Habacuc",abrev:"HAB"},{name:"Sofonías",abrev:"SOF"},{name:"Hageo",abrev:"HAG"},{name:"Zacarías",abrev:"ZAC"},{name:"Malaquías",abrev:"MAL"},{name:"Mateo",abrev:"MT"},{name:"Marcos",abrev:"MR"},{name:"Lucas",abrev:"LC"},{name:"Juan",abrev:"JN"},{name:"Hechos",abrev:"HCH"},{name:"Romanos",abrev:"RO"},{name:"1 Corintios",abrev:"1CO"},{name:"2 Corintios",abrev:"2CO"},{name:"Gálatas",abrev:"GA"},{name:"Efesios",abrev:"EF"},{name:"Filipenses",abrev:"FIL"},{name:"Colosenses",abrev:"COL"},{name:"1 Tesalonicenses",abrev:"1TS"},{name:"2 Tesalonicenses",abrev:"2TS"},{name:"1 Timoteo",abrev:"1TI"},{name:"2 Timoteo",abrev:"2TI"},{name:"Tito",abrev:"TIT"},{name:"Filemón",abrev:"FLM"},{name:"Hebreos",abrev:"HE"},{name:"Santiago",abrev:"STG"},{name:"1 Pedro",abrev:"1P"},{name:"2 Pedro",abrev:"2P"},{name:"1 Juan",abrev:"1JN"},{name:"2 Juan",abrev:"2JN"},{name:"3 Juan",abrev:"3JN"},{name:"Judas",abrev:"JUD"},{name:"Apocalipsis",abrev:"AP"}];
    const findBookAbrev=(b)=>{const n=b.toLowerCase().replace(/[\s-]/g,"");return books.find(b=>b.name.toLowerCase().replace(/[\s-]/g,"").includes(n))?.abrev||null};
    const findBookName=(a)=>books.find(b=>b.abrev===a)?.name||a;
    const parseInput=(i)=>i.trim().match(/(.+?)\s*(\d+):(\d+)(?:-(\d+))?$/i);
    async function fetchVerseData(ref){const m=parseInput(ref);if(!m)return{error:"Formato de referencia inválido."};const[,b,c,vs,ve]=m;const ba=findBookAbrev(b);if(!ba)return{error:`Libro no encontrado: ${b}`};const vr=ve?`${vs}-${ve}`:vs;const u=`https://bible-api.deno.dev/api/read/rv1960/${ba}/${c}/${vr}`;try{const r=await fetch(u);if(!r.ok)throw new Error((await r.json()).message||"Error en la API");const d=await r.json();const da=Array.isArray(d)?d:[d];if(da.length===0)throw new Error("Versículo no encontrado.");const ft=da.map(v=>v.verse.trim()).join(" ");let fr=`${findBookName(ba)} ${c}:${da[0].number}`;if(da.length>1)fr+=`-${da[da.length-1].number}`;return{text:ft,reference:fr,originalInput:ref.trim()}}catch(e){return{error:e.message}}};

    // --- GESTIÓN DE DATOS (LocalStorage) ---
    const getSavedVerses = () => JSON.parse(localStorage.getItem('myVerses')) || [];
    const saveVersesToStorage = (v) => localStorage.setItem('myVerses', JSON.stringify(v));
    const addVerseToList = (verseData) => { let verses = getSavedVerses(); if (verses.some(v => v.reference === verseData.reference)) return false; verses.push({ ...verseData, id: Date.now(), currentLevel: 1, completionCount: 0, lastPracticed: null, isDominated: false, practiceCount: 0 }); saveVersesToStorage(verses); return true; };
    const saveVerse = () => { if (currentFetchedVerse) { const result = isEditing ? (() => { let sv = getSavedVerses(); const i = sv.findIndex(v => v.id === currentVerseId); if (i !== -1) { sv[i] = { ...sv[i], text: currentFetchedVerse.text, reference: currentFetchedVerse.reference, originalInput: currentFetchedVerse.originalInput }; saveVersesToStorage(sv); return { success: true } } })() : addVerseToList(currentFetchedVerse) ? { success: true } : { success: false, message: '¡Ese versículo ya está guardado, che!' }; if (result.success) { renderPage(); closeAddEditModal(); } else { statusMessageEl.textContent = result.message; } } };
    const deleteVerse = (id) => { saveVersesToStorage(getSavedVerses().filter(v => v.id !== id)); renderPage(); };
    const updateVerseLevel = (id, newLevel) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].lastPracticed = Date.now(); if (newLevel > TOTAL_LEVELS) { verses[index].isDominated = true; if (verses[index].currentLevel <= TOTAL_LEVELS) { verses[index].completionCount = (verses[index].completionCount || 0) + 1; } } verses[index].currentLevel = newLevel; saveVersesToStorage(verses); } };
    const resetVerseProgress = (id) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].currentLevel = 1; verses[index].isDominated = false; saveVersesToStorage(verses); renderPage(); } };
    const incrementPracticeCount = (id) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].practiceCount = (verses[index].practiceCount || 0) + 1; saveVersesToStorage(verses); } };

    // --- RENDERIZADO Y LÓGICA DE PÁGINA ---
    const formatLastPracticed = (timestamp) => {
        if (!timestamp) return 'Nunca';
        const now = new Date();
        const lastDate = new Date(timestamp);
        const seconds = Math.floor((now - lastDate) / 1000);
        
        if (seconds < 60) return 'Ahora mismo';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
        
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} ${days === 1 ? 'día' : 'días'} atrás`;
        
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} ${months === 1 ? 'mes' : 'meses'} atrás`;
        
        const years = Math.floor(days / 365);
        return `${years} ${years === 1 ? 'año' : 'años'} atrás`;
    };
    const renderStats = (verses) => { totalVersesStat.textContent = verses.length; dominatedVersesStat.textContent = verses.filter(v => v.isDominated).length; totalPracticesStat.textContent = verses.reduce((sum, v) => sum + (v.practiceCount || 0), 0); };
    const renderVerseList = (verses) => {
        savedVersesList.innerHTML = '';
        const sortedVerses = verses.sort((a, b) => (b.lastPracticed || 0) - (a.lastPracticed || 0));
        emptyState.classList.toggle("hidden", verses.length > 0);
        noResultsState.classList.add('hidden');
        if (verses.length === 0 && getSavedVerses().length > 0) noResultsState.classList.remove('hidden');
        
        sortedVerses.forEach(verse => {
            const level = verse.currentLevel || 1;
            const progress = level > TOTAL_LEVELS ? 100 : Math.round(((level - 1) / TOTAL_LEVELS) * 100);
            const actionButtonHTML = level > TOTAL_LEVELS
                ? `<button class="restart-btn bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center shadow-md"><span class="iconify mr-2" data-icon="material-symbols:restart-alt"></span>Reiniciar</button>`
                : `<button class="practice-btn bg-[var(--blue)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--dark-blue)] flex items-center shadow-md"><span class="iconify mr-2" data-icon="material-symbols:exercise-outline"></span>Nivel ${level}</button>`;
            const badgeHTML = verse.isDominated ? `<span class="status-tag dominado">Dominado</span>` : '';
            const card = document.createElement("div");
            card.className = "saved-verse-card space-y-4";
            card.dataset.id = verse.id;
            card.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="iconify text-2xl text-gray-300 flex-shrink-0" data-icon="bi:quote"></span>
                        <h4 class="text-xl font-bold text-gray-800 truncate">${verse.reference}</h4>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        ${badgeHTML}
                        <div class="relative options-menu">
                            <button class="options-menu-btn text-gray-500 hover:text-gray-800 p-1 rounded-full"><span class="iconify text-2xl" data-icon="mdi:dots-vertical"></span></button>
                            <div class="options-menu-dropdown hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border origin-top-right">
                                <a href="#" class="share-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span class="iconify text-lg" data-icon="ic:round-whatsapp"></span>Compartir</a>
                                <a href="#" class="edit-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:edit-note-outline-rounded"></span>Editar</a>
                                <a href="#" class="delete-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:delete-forever-outline-rounded"></span>Eliminar</a>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="verse-text">${verse.text}</p>
                <div class="space-y-3">
                    <div class="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Progreso de memorización</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${progress}%;"></div></div>
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div class="flex gap-4 text-sm text-gray-500">
                            <span class="flex items-center gap-1"><span class="iconify" data-icon="material-symbols:shield-outline"></span> ${verse.completionCount || 0} veces</span>
                            <span class="flex items-center gap-1"><span class="iconify" data-icon="material-symbols:timer-outline"></span> ${formatLastPracticed(verse.lastPracticed)}</span>
                        </div>
                        <div class="flex justify-end gap-3 items-center w-full sm:w-auto justify-between">
                            <button class="rsvp-btn bg-[var(--dark-blue)] p-2 rounded-lg hover:opacity-80 flex items-center justify-center shadow-md" title="Lector Rápido"><span class="iconify text-2xl text-white" data-icon="material-symbols:speed-outline"></span></button>
                            ${actionButtonHTML}
                        </div>
                    </div>
                </div>`;
            savedVersesList.appendChild(card);
        });
    };
    const renderPage = () => { const allVerses = getSavedVerses(); renderStats(allVerses); filterVerses(); };
    const filterVerses = () => { const searchTerm = verseSearchInput.value.toLowerCase().trim(); const allVerses = getSavedVerses(); const filteredVerses = allVerses.filter(verse => verse.reference.toLowerCase().includes(searchTerm) || verse.text.toLowerCase().includes(searchTerm)); renderVerseList(filteredVerses); };
    const openAddEditModal = (v=null) => { isEditing = !!v; currentVerseId = v ? v.id : null; currentFetchedVerse = v || null; modalTitleAdd.classList.toggle('hidden', isEditing); modalTitleEdit.classList.toggle('hidden', !isEditing); verseInput.value=v?v.originalInput:""; statusMessageEl.textContent=""; searchVerseBtn.disabled = false; saveModalBtn.textContent=isEditing?"Guardar Cambios":"Agregar Versículo"; saveModalBtn.disabled=!isEditing; verseInfoContainer.classList.toggle("hidden",!v); if(v)verseTextEl.textContent=v.text; verseModalOverlay.classList.add("open"); };
    const closeAddEditModal = () => verseModalOverlay.classList.remove("open");

    // --- LÓGICA DE NIVELES Y PRÁCTICA ---
    const createBlanks = (text, percentage, withHint) => {
        const cleanWord = (word) => word.replace(/[.,:;¡!¿?]/g, '');
        const parts = text.split(/(\s+|[.,:;¡!¿?]+)/);
        const wordData = parts.map((part, index) => ({ part, index, isWord: /[\p{L}\p{N}']+/gu.test(part) && cleanWord(part).length > 0 }))
                              .filter(d => d.isWord)
                              .map((d, wordIndex) => ({ ...d, score: (d.part.length % 5) * 10 + (wordIndex % 7) + (d.part.charCodeAt(0) % 11) }))
                              .sort((a, b) => b.score - a.score);

        const blankCount = percentage === 1.0 ? wordData.length : Math.max(1, Math.floor(wordData.length * percentage));
        const indicesToHide = new Set(wordData.slice(0, blankCount).map(d => d.index));
        const blanksData = [];
        let verseHTML = "";
        let wordOccurrences = {};
        
        parts.forEach((part, index) => {
            if (indicesToHide.has(index)) {
                const originalWord = part;
                const correctWord = cleanWord(originalWord);
                const key = correctWord.toLowerCase();
                const occurrence = wordOccurrences[key] || 0;
                wordOccurrences[key] = occurrence + 1;
                const id = `${key}_${occurrence}`;
                const inputWidth = Math.max(70, correctWord.length * 11);
                const hint = withHint ? `placeholder="${correctWord.charAt(0)}"` : '';
                verseHTML += `<input type="text" class="blank-input" data-correct="${key}" data-word-id="${id}" style="width:${inputWidth}px" ${hint} autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">`;
                blanksData.push({ word: correctWord, id });
            } else {
                verseHTML += part;
            }
        });
        return { verseHTML, blanksData };
    };
    const setupPracticeNavigation = () => { const inputs = Array.from(practiceVerseContainer.querySelectorAll('.blank-input')); inputs.forEach((input, index) => { input.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); if (index < inputs.length - 1) { inputs[index + 1].focus(); } } else if (e.key === 'Backspace' && input.value === '') { e.preventDefault(); if (index > 0) { inputs[index - 1].focus(); } } }); }); if (document.activeElement.tagName !== 'INPUT') { inputs[0]?.focus(); } };
    const openPracticeScreen = (verseId) => { const verse = getSavedVerses().find(v => v.id === verseId); if (!verse) return; practiceState = { verse }; practiceTitle.textContent = verse.reference; practiceStatusMessage.textContent = ''; practiceCheckBtn.disabled = false; const level = verse.currentLevel || 1; practiceWordBankContainer.classList.add('hidden'); switch(level) { case 1: setupLevel1(); break; case 2: setupLevelWithHints(0.4, true); break; case 3: setupLevelWithHints(0.6, false); break; case 4: setupLevelWithHints(1.0, false); break; } incrementPracticeCount(verseId); practiceScreen.classList.add('open'); };
    const closePracticeScreen = () => { practiceScreen.classList.remove('open', 'partial'); practiceToggleBtn.querySelector('.iconify').dataset.icon = 'material-symbols:keyboard-arrow-down-rounded'; };
    const togglePracticeScreen = () => { practiceScreen.classList.toggle('partial'); const icon = practiceToggleBtn.querySelector('.iconify'); icon.dataset.icon = practiceScreen.classList.contains('partial') ? 'material-symbols:keyboard-arrow-up-rounded' : 'material-symbols:keyboard-arrow-down-rounded'; };
    const setupLevel1 = () => { practiceWordBankContainer.classList.remove('hidden'); const { verseHTML, blanksData } = createBlanks(practiceState.verse.text, 0.2, false); practiceVerseContainer.innerHTML = verseHTML; practiceWordBank.innerHTML = ""; blanksData.sort(() => 0.5 - Math.random()).forEach(({ word, id }) => { const wordEl = document.createElement('span'); wordEl.className = 'word-bank-item bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg'; wordEl.textContent = word; wordEl.dataset.wordId = id; practiceWordBank.appendChild(wordEl); }); practiceVerseContainer.querySelectorAll('.blank-input').forEach(input => input.addEventListener('input', handleWordBankVisibility)); setupPracticeNavigation(); };
    const setupLevelWithHints = (percentage, withHint) => { const { verseHTML } = createBlanks(practiceState.verse.text, percentage, withHint); practiceVerseContainer.innerHTML = verseHTML; setupPracticeNavigation(); };
    const handleWordBankVisibility = (e) => { const typedValue = e.target.value.trim().toLowerCase(); const correctValue = e.target.dataset.correct; const wordId = e.target.dataset.wordId; const wordBankItem = practiceWordBank.querySelector(`[data-word-id="${wordId}"]`); if (wordBankItem) { const isCorrect = typedValue === correctValue; wordBankItem.style.opacity = isCorrect ? '0.3' : '1'; wordBankItem.style.transform = isCorrect ? 'scale(0.9)' : 'scale(1)'; } };
    const triggerCelebration=()=>{practiceScreen.classList.add("celebration-active");setTimeout(()=>practiceScreen.classList.remove("celebration-active"),1200);confetti({particleCount:150,spread:90,origin:{y:0.6},zIndex:9999})};
    const checkAnswers=()=>{const{verse}=practiceState;const inputs=Array.from(practiceVerseContainer.querySelectorAll(".blank-input"));let allCorrect=true;inputs.forEach(input=>{const isCorrect=input.value.trim().toLowerCase()===input.dataset.correct;input.classList.toggle("correct",isCorrect);input.classList.toggle("incorrect",!isCorrect);if(!isCorrect)allCorrect=false});if(allCorrect){practiceStatusMessage.textContent="¡Excelente! Nivel superado.";practiceStatusMessage.style.color="var(--green)";practiceCheckBtn.disabled=true;inputs.forEach(input=>input.disabled=true);triggerCelebration();updateVerseLevel(verse.id,verse.currentLevel+1);setTimeout(()=>{closePracticeScreen();renderPage()},2000)}else{practiceStatusMessage.textContent="¡Casi! Revisa las cajas en rojo.";practiceStatusMessage.style.color="var(--red)";setTimeout(()=>practiceStatusMessage.textContent="",2000)}};
    const handleSharedVerseFromUrl=async()=>{const params=new URLSearchParams(window.location.search);const verseParam=params.get("v");if(!verseParam)return;const match=verseParam.match(/^([A-Z0-9]+)\.(\d+):(\d+)(?:-(\d+))?$/i);if(!match)return;const[,bookAbrev,chapter,verseStart,verseEnd]=match;const bookName=findBookName(bookAbrev);if(!bookName)return;const fullRef=`${bookName} ${chapter}:${verseStart}${verseEnd?`-${verseEnd}`:""}`;const verseData=await fetchVerseData(fullRef);if(verseData&&!verseData.error){if(addVerseToList(verseData)){renderPage()}}window.history.replaceState({},document.title,window.location.pathname)};

    // --- LÓGICA DE LECTOR RSVP ---
    const loadRsvpSettings = () => { const savedWPM = localStorage.getItem('userWPM'); if (savedWPM) rsvpState.currentWpm = parseInt(savedWPM, 10); };
    const rsvpGetPivotIndex = (word) => { const length = word.replace(/[,.:;¡!¿?]/g, '').length; if (length <= 1) return 0; if (length <= 5) return 1; if (length <= 9) return 2; if (length <= 13) return 3; return 4; };
    const rsvpUpdateWpmDisplay = () => { rsvpWpmDisplay.textContent = `${rsvpState.currentWpm} WPM`; };
    const rsvpUpdateMainButtonIcon = () => {
        rsvpPlayIcon.classList.toggle('hidden', !rsvpState.isPaused || rsvpState.isFinished);
        rsvpPauseIcon.classList.toggle('hidden', rsvpState.isPaused || rsvpState.isFinished);
        rsvpRestartIcon.classList.toggle('hidden', !rsvpState.isFinished);
    };
    const rsvpShowNextWord = () => {
        if (rsvpState.currentIndex < rsvpState.words.length) {
            const word = rsvpState.words[rsvpState.currentIndex];
            const pivotIndex = rsvpGetPivotIndex(word);
            const before = word.substring(0, pivotIndex);
            const pivot = word.charAt(pivotIndex);
            const after = word.substring(pivotIndex + 1);
            const offset = pivotIndex + 0.5;
            rsvpWordDisplay.innerHTML = `<span style="padding-left: calc(50% - ${offset}ch)">${before}</span><span class="pivot">${pivot}</span><span>${after}</span>`;
            rsvpState.currentIndex++;
        } else {
            rsvpStop(true); // Se detiene al finalizar
        }
    };
    const rsvpRunInterval = () => { if (rsvpState.readingInterval) clearInterval(rsvpState.readingInterval); const delay = 60000 / rsvpState.currentWpm; rsvpState.readingInterval = setInterval(rsvpShowNextWord, delay); };
    const rsvpHandleMainButtonClick = () => {
        if (rsvpState.isFinished) { // Si terminó, reiniciar
            rsvpState.currentIndex = 0;
            rsvpState.isFinished = false;
        }
        rsvpState.isPaused = !rsvpState.isPaused;
        rsvpScreen.classList.toggle('paused', rsvpState.isPaused);
        if (rsvpState.isPaused) {
            clearInterval(rsvpState.readingInterval);
        } else {
            rsvpRunInterval();
        }
        rsvpUpdateMainButtonIcon();
    };
    const rsvpChangeSpeed = (amount) => { rsvpState.currentWpm = Math.max(50, rsvpState.currentWpm + amount); localStorage.setItem('userWPM', rsvpState.currentWpm); rsvpUpdateWpmDisplay(); if (!rsvpState.isPaused) rsvpRunInterval(); };
    const rsvpStop = (finished = false) => {
        if (rsvpState.readingInterval) clearInterval(rsvpState.readingInterval);
        rsvpState.isPaused = true;
        rsvpState.isFinished = finished;
        rsvpState.readingInterval = null;
        rsvpScreen.classList.remove('paused');
        if (finished) rsvpWordDisplay.innerHTML = ''; // Limpia la pantalla al terminar
        rsvpUpdateMainButtonIcon();
    };
    const openRsvpModal = (verse) => {
        rsvpState.words = verse.text.trim().split(/\s+/).filter(word => word.length > 0);
        rsvpStop(false); // Resetea al estado inicial
        rsvpState.currentIndex = 0;
        rsvpUpdateWpmDisplay();
        rsvpTitle.textContent = verse.reference;
        rsvpWordDisplay.innerHTML = ''; // Pantalla inicial vacía
        rsvpScreen.classList.add('open');
    };
    const closeRsvpModal = () => { rsvpStop(false); rsvpScreen.classList.remove('open'); };
    
    // --- EVENT LISTENERS ---
    openModalBtn.addEventListener('click', () => openAddEditModal());
    [cancelModalBtn, closeModalXBtn].forEach(el => el.addEventListener('click', closeAddEditModal));
    verseModalOverlay.addEventListener('click', e => { if (e.target === verseModalOverlay) closeAddEditModal(); });
    searchVerseBtn.addEventListener('click', async () => { searchVerseBtn.disabled = true; statusMessageEl.textContent = 'Buscando...'; currentFetchedVerse = await fetchVerseData(verseInput.value); if (!currentFetchedVerse.error) { verseTextEl.textContent = currentFetchedVerse.text; verseInfoContainer.classList.remove('hidden'); saveModalBtn.disabled = false; statusMessageEl.textContent = '¡Versículo encontrado!'; } else { statusMessageEl.textContent = currentFetchedVerse.error; saveModalBtn.disabled = true; } searchVerseBtn.disabled = false; });
    saveModalBtn.addEventListener('click', saveVerse);
    practiceCloseBtn.addEventListener('click', closePracticeScreen);
    practiceToggleBtn.addEventListener('click', togglePracticeScreen);
    practiceCheckBtn.addEventListener('click', checkAnswers);
    verseSearchInput.addEventListener('input', filterVerses);
    
    // Listeners para el lector RSVP
    rsvpCloseBtn.addEventListener('click', closeRsvpModal);
    rsvpMainBtn.addEventListener('click', rsvpHandleMainButtonClick);
    rsvpPrevBtn.addEventListener('click', () => rsvpChangeSpeed(-25));
    rsvpNextBtn.addEventListener('click', () => rsvpChangeSpeed(25));

    savedVersesList.addEventListener('click', async (e) => { const verseCard = e.target.closest('[data-id]'); if (!verseCard) return; const verseId = +verseCard.dataset.id; if (e.target.closest('.options-menu-btn')) { const dropdown = e.target.closest('.options-menu-btn').nextElementSibling; const isHidden = dropdown.classList.contains('hidden'); document.querySelectorAll('.options-menu-dropdown').forEach(d => d.classList.add('hidden')); if (isHidden) dropdown.classList.remove('hidden'); return; } if (e.target.closest('.edit-verse-btn')) { e.preventDefault(); openAddEditModal(getSavedVerses().find(v => v.id === verseId)); } if (e.target.closest('.delete-verse-btn')) { e.preventDefault(); deleteVerse(verseId); } if (e.target.closest('.practice-btn')) { openPracticeScreen(verseId); } if (e.target.closest('.restart-btn')) { resetVerseProgress(verseId); } if (e.target.closest('.share-verse-btn')) { e.preventDefault(); const verse = getSavedVerses().find(v => v.id === verseId); if (!verse) return; const match = parseInput(verse.originalInput); if (!match) return; const [, bookName, chapter, verseStart, verseEnd] = match; const bookAbrev = findBookAbrev(bookName); const verseParam = `${bookAbrev}.${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`; const shareUrl = `${window.location.origin}${window.location.pathname}?v=${verseParam}`; const text = `¡Te comparto este versículo para que lo memorices!%0A%0A*${verse.reference.toUpperCase()}*%0A%0A_${shareUrl}_`; const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`; window.open(whatsappUrl, '_blank'); } if (e.target.closest('.rsvp-btn')) { const verse = getSavedVerses().find(v => v.id === verseId); if(verse) openRsvpModal(verse); }});
    document.addEventListener('click', e => { if (!e.target.closest('.options-menu')) { document.querySelectorAll('.options-menu-dropdown').forEach(d => d.classList.add('hidden')); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !verseModalOverlay.classList.contains('open') && !practiceScreen.classList.contains('open') && !rsvpScreen.classList.contains('open')) { const activeEl = document.activeElement; if (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') { openModalBtn.click(); } } if (e.key === 'Escape') { if(practiceScreen.classList.contains('open')) closePracticeScreen(); if(verseModalOverlay.classList.contains('open')) closeAddEditModal(); if(rsvpScreen.classList.contains('open')) closeRsvpModal(); } if (practiceScreen.classList.contains('open') && e.key === 'Enter') { practiceCheckBtn.click(); } });

    // --- INICIALIZACIÓN ---
    loadRsvpSettings();
    handleSharedVerseFromUrl();
    renderPage();
});