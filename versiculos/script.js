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
    const practiceInstructions = document.getElementById('practice-instructions');
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

    // --- ESTADO DE LA APP ---
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
    const saveVerse = (vd, isEditing, currentVerseId) => { if (isEditing) { let sv = getSavedVerses(); const i = sv.findIndex(v => v.id === currentVerseId); if (i !== -1) { sv[i] = { ...sv[i], text: vd.text, reference: vd.reference, originalInput: vd.originalInput }; saveVersesToStorage(sv); return { success: true } } } else { const added = addVerseToList(vd); return added ? { success: true } : { success: false, message: '¡Ese versículo ya está guardado, che!' }; } };
    const deleteVerse = (id) => { saveVersesToStorage(getSavedVerses().filter(v => v.id !== id)); renderPage(); };
    const updateVerseLevel = (id, newLevel) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].lastPracticed = Date.now(); if (newLevel > TOTAL_LEVELS) { verses[index].isDominated = true; if (verses[index].currentLevel <= TOTAL_LEVELS) { verses[index].completionCount = (verses[index].completionCount || 0) + 1; } } verses[index].currentLevel = newLevel; saveVersesToStorage(verses); } };
    const resetVerseProgress = (id) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].currentLevel = 1; verses[index].lastPracticed = Date.now(); saveVersesToStorage(verses); renderPage(); } };
    const incrementPracticeCount = (id) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].practiceCount = (verses[index].practiceCount || 0) + 1; saveVersesToStorage(verses); } };

    // --- RENDERIZADO Y LÓGICA DE PÁGINA ---
    const formatLastPracticed = (timestamp) => { if (!timestamp) return 'Nunca'; const now = new Date(); const lastDate = new Date(timestamp); if ((now - lastDate) < 60000) return 'Ahora mismo'; const diffDays = Math.floor((now - lastDate) / 86400000); if (diffDays === 0) return 'Hoy'; if (diffDays === 1) return 'Ayer'; return `Hace ${diffDays} días`; };
    const renderStats = (verses) => { totalVersesStat.textContent = verses.length; dominatedVersesStat.textContent = verses.filter(v => v.isDominated).length; totalPracticesStat.textContent = verses.reduce((sum, v) => sum + (v.practiceCount || 0), 0); };
    const renderVerseList = (verses) => {
        savedVersesList.innerHTML = '';
        const sortedVerses = verses.sort((a, b) => (b.lastPracticed || 0) - (a.lastPracticed || 0));
        emptyState.classList.toggle("hidden", verses.length > 0);
        noResultsState.classList.add('hidden');
        if (verses.length === 0 && getSavedVerses().length > 0) {
            noResultsState.classList.remove('hidden');
        }
        sortedVerses.forEach(verse => {
            const level = verse.currentLevel || 1;
            const progress = level > TOTAL_LEVELS ? 100 : Math.round(((level - 1) / TOTAL_LEVELS) * 100);
            const actionButtonHTML = level > TOTAL_LEVELS ? `<button class="restart-btn bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center shadow-md"><span class="iconify mr-2" data-icon="material-symbols:restart-alt"></span>Reiniciar</button>` : `<button class="practice-btn bg-[var(--blue)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--dark-blue)] flex items-center shadow-md"><span class="iconify mr-2" data-icon="material-symbols:exercise-outline"></span>Nivel ${level}</button>`;
            const badgeHTML = verse.isDominated ? `<span class="status-tag dominado">Dominado</span>` : '';
            const card = document.createElement("div");
            card.className = "saved-verse-card space-y-4";
            card.dataset.id = verse.id;
            card.innerHTML = `<div class="flex items-start justify-between"><div class="flex items-center gap-3"><span class="iconify text-2xl text-gray-300" data-icon="bi:quote"></span><h4 class="text-xl font-bold text-gray-800">${verse.reference}</h4></div><div class="flex items-center gap-2">${badgeHTML}<div class="relative options-menu"><button class="options-menu-btn text-gray-500 hover:text-gray-800 p-1 rounded-full"><span class="iconify text-2xl" data-icon="mdi:dots-vertical"></span></button><div class="options-menu-dropdown hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border origin-top-right"><a href="#" class="share-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span class="iconify text-lg" data-icon="ic:twotone-whatsapp"></span>Compartir</a><a href="#" class="edit-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:edit-note-outline-rounded"></span>Editar</a><a href="#" class="delete-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:delete-forever-outline-rounded"></span>Eliminar</a></div></div></div></div><p class="verse-text">${verse.text}</p><div class="space-y-3"><div class="flex justify-between items-center text-sm font-medium text-gray-500"><span>Progreso de memorización</span><span>${progress}%</span></div><div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${progress}%;"></div></div><div class="flex justify-between items-center"><div class="flex gap-4 text-sm text-gray-500"><span class="flex items-center gap-1"><span class="iconify" data-icon="material-symbols:shield-outline"></span> ${verse.completionCount || 0} veces</span><span class="flex items-center gap-1"><span class="iconify" data-icon="material-symbols:timer-outline"></span> ${formatLastPracticed(verse.lastPracticed)}</span></div><div class="flex justify-end gap-3 items-center">${actionButtonHTML}</div></div></div>`;
            savedVersesList.appendChild(card);
        });
    };
    const renderPage = () => { const allVerses = getSavedVerses(); renderStats(allVerses); filterVerses(); };
    const filterVerses = () => { const searchTerm = verseSearchInput.value.toLowerCase().trim(); const allVerses = getSavedVerses(); const filteredVerses = allVerses.filter(verse => verse.reference.toLowerCase().includes(searchTerm) || verse.text.toLowerCase().includes(searchTerm)); renderVerseList(filteredVerses); };
    const openAddEditModal = (v=null) => {
        const isEditing = !!v; const currentVerseId = v ? v.id : null; let currentFetchedVerse = v || null;
        modalTitleAdd.classList.toggle('hidden', isEditing);
        modalTitleEdit.classList.toggle('hidden', !isEditing);
        verseInput.value=v?v.originalInput:""; statusMessageEl.textContent=""; 
        searchVerseBtn.disabled=!verseInput.value; saveModalBtn.textContent=isEditing?"Guardar Cambios":"Agregar Versículo"; saveModalBtn.disabled=!isEditing; 
        verseInfoContainer.classList.toggle("hidden",!v); if(v)verseTextEl.textContent=v.text; 
        verseModalOverlay.classList.add("open");
        saveModalBtn.onclick = () => { if (currentFetchedVerse) { const result = saveVerse(currentFetchedVerse, isEditing, currentVerseId); if (result.success) { renderPage(); closeAddEditModal(); } else { statusMessageEl.textContent = result.message; } } };
        searchVerseBtn.onclick = async () => { searchVerseBtn.disabled = true; statusMessageEl.textContent = 'Buscando...'; const data = await fetchVerseData(verseInput.value); if (!data.error) { currentFetchedVerse = data; verseTextEl.textContent = data.text; verseInfoContainer.classList.remove('hidden'); saveModalBtn.disabled = false; statusMessageEl.textContent = '¡Versículo encontrado!'; } else { statusMessageEl.textContent = data.error; } searchVerseBtn.disabled = false; };
    };
    const closeAddEditModal = () => verseModalOverlay.classList.remove("open");

    // --- LÓGICA DE NIVELES Y PRÁCTICA ---
    const openPracticeScreen = (verseId) => { const verse = getSavedVerses().find(v => v.id === verseId); if (!verse) return; practiceState = { verse }; practiceTitle.textContent = verse.reference; practiceStatusMessage.textContent = ''; practiceCheckBtn.disabled = false; let instructions = ''; const level = verse.currentLevel || 1; practiceWordBankContainer.classList.add('hidden'); switch(level) { case 1: instructions = 'Escribe las palabras correctas. Las que aciertes desaparecerán de la lista de ayuda.'; setupLevel1(); break; case 2: instructions = 'Completa los espacios con la palabra correcta. Tienes la primera letra como pista.'; setupLevelWithHints(0.4, true); break; case 3: instructions = 'Completa los espacios vacíos con la palabra correcta.'; setupLevelWithHints(0.6, false); break; case 4: instructions = '¡El reto final! Escribe el versículo completo de memoria.'; setupLevelWithHints(1.0, false); break; } practiceInstructions.textContent = instructions; incrementPracticeCount(verseId); document.addEventListener('keydown', handlePracticeKeystrokes); practiceScreen.classList.add('open'); };
    const closePracticeScreen = () => { practiceScreen.classList.remove('open', 'partial'); practiceToggleBtn.querySelector('.iconify').dataset.icon = 'material-symbols:keyboard-arrow-down-rounded'; document.removeEventListener('keydown', handlePracticeKeystrokes); };
    const togglePracticeScreen = () => { practiceScreen.classList.toggle('partial'); const icon = practiceToggleBtn.querySelector('.iconify'); icon.dataset.icon = practiceScreen.classList.contains('partial') ? 'material-symbols:keyboard-arrow-up-rounded' : 'material-symbols:keyboard-arrow-down-rounded'; };
    const handlePracticeKeystrokes = (e) => {
        const activeEl = document.activeElement;
        // CORRECCIÓN: Evitar que el espacio se escriba en el input en MÓVIL Y DESKTOP
        if (activeEl && activeEl.tagName === 'INPUT' && e.key === ' ') {
            e.preventDefault();
            const inputs = Array.from(practiceVerseContainer.querySelectorAll('.blank-input'));
            const currentIndex = inputs.indexOf(activeEl);
            if (currentIndex > -1) {
                const nextIndex = (currentIndex + 1) % inputs.length;
                inputs[nextIndex].focus();
            }
        }
        if (e.key === 'Enter') { e.preventDefault(); practiceCheckBtn.click(); }
        else if (e.key === 'Escape') { closePracticeScreen(); }
    };
    const createBlanks = (text, percentage, withHint) => {
        const words = text.match(/\b[\wáéíóúüñ']+\b/g) || [];
        const blankCount = percentage === 1.0 ? words.length : Math.max(1, Math.floor(words.length * percentage));
        const wordsToHide = percentage === 1.0 ? words : [...words].sort(() => 0.5 - Math.random()).slice(0, blankCount);
        let verseHTML = text;
        let wordOccurrences = {};
        const blanksData = wordsToHide.map(word => {
            const key = word.toLowerCase();
            const occurrence = wordOccurrences[key] || 0;
            wordOccurrences[key] = occurrence + 1;
            const id = `${key}_${occurrence}`;
            const placeholder = `__BLANK_${id}__`;
            const regex = new RegExp(`\\b${word}\\b`);
            verseHTML = verseHTML.replace(regex, placeholder);
            return { placeholder, word, id };
        });
        blanksData.forEach(({ placeholder, word, id }) => {
            const inputWidth = Math.max(70, word.length * 10); // Ancho reducido para mobile
            const hint = withHint ? `placeholder="${word.charAt(0)}"` : '';
            verseHTML = verseHTML.replace(placeholder, `<input type="text" class="blank-input" data-correct="${word.toLowerCase()}" data-word-id="${id}" style="width:${inputWidth}px" ${hint} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">`);
        });
        return { verseHTML, blanksData };
    };
    const setupLevel1 = () => { practiceWordBankContainer.classList.remove('hidden'); const { verseHTML, blanksData } = createBlanks(practiceState.verse.text, 0.2, false); practiceVerseContainer.innerHTML = verseHTML; practiceWordBank.innerHTML = ""; blanksData.sort(() => 0.5 - Math.random()).forEach(({ word, id }) => { const wordEl = document.createElement('span'); wordEl.className = 'word-bank-item bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg'; wordEl.textContent = word; wordEl.dataset.wordId = id; practiceWordBank.appendChild(wordEl); }); practiceVerseContainer.querySelectorAll('.blank-input').forEach(input => input.addEventListener('input', handleWordBankVisibility)); practiceVerseContainer.querySelector("input")?.focus(); };
    const setupLevelWithHints = (percentage, withHint) => { const { verseHTML } = createBlanks(practiceState.verse.text, percentage, withHint); practiceVerseContainer.innerHTML = verseHTML; practiceVerseContainer.querySelector("input")?.focus(); };
    const handleWordBankVisibility=(e)=>{const typedValue=e.target.value.trim().toLowerCase();const correctValue=e.target.dataset.correct;const wordId=e.target.dataset.wordId;const wordBankItem=practiceWordBank.querySelector(`[data-word-id="${wordId}"]`);if(wordBankItem){const isCorrect=typedValue===correctValue;wordBankItem.style.opacity=isCorrect?"0.3":"1";wordBankItem.style.transform=isCorrect?"scale(0.9)":"scale(1)"}};
    const triggerCelebration=()=>{practiceScreen.classList.add("celebration-active");setTimeout(()=>practiceScreen.classList.remove("celebration-active"),1200);confetti({particleCount:150,spread:90,origin:{y:0.6},zIndex:9999})};
    const checkAnswers=()=>{const{verse}=practiceState;const inputs=Array.from(practiceVerseContainer.querySelectorAll(".blank-input"));let allCorrect=true;inputs.forEach(input=>{const isCorrect=input.value.trim().toLowerCase()===input.dataset.correct;input.classList.toggle("correct",isCorrect);input.classList.toggle("incorrect",!isCorrect);if(!isCorrect)allCorrect=false});if(allCorrect){practiceStatusMessage.textContent="¡Excelente! Nivel superado.";practiceStatusMessage.style.color="var(--green)";practiceCheckBtn.disabled=true;inputs.forEach(input=>input.disabled=true);triggerCelebration();updateVerseLevel(verse.id,verse.currentLevel+1);setTimeout(()=>{closePracticeScreen();renderPage()},2000)}else{practiceStatusMessage.textContent="¡Casi! Revisa las cajas en rojo.";practiceStatusMessage.style.color="var(--red)";setTimeout(()=>practiceStatusMessage.textContent="",2000)}};
    const handleSharedVerseFromUrl=async()=>{const params=new URLSearchParams(window.location.search);const verseParam=params.get("v");if(!verseParam)return;const match=verseParam.match(/^([A-Z0-9]+)\.(\d+):(\d+)(?:-(\d+))?$/i);if(!match)return;const[,bookAbrev,chapter,verseStart,verseEnd]=match;const bookName=findBookName(bookAbrev);if(!bookName)return;const fullRef=`${bookName} ${chapter}:${verseStart}${verseEnd?`-${verseEnd}`:""}`;const verseData=await fetchVerseData(fullRef);if(verseData&&!verseData.error){if(addVerseToList(verseData)){renderPage()}}window.history.replaceState({},document.title,window.location.pathname)};
    
    // --- EVENT LISTENERS ---
    openModalBtn.addEventListener('click', () => openAddEditModal());
    [cancelModalBtn, closeModalXBtn].forEach(el => el.addEventListener('click', closeAddEditModal));
    verseModalOverlay.addEventListener('click', e => { if (e.target === verseModalOverlay) closeAddEditModal(); });
    practiceCloseBtn.addEventListener('click', closePracticeScreen);
    practiceToggleBtn.addEventListener('click', togglePracticeScreen);
    practiceCheckBtn.addEventListener('click', checkAnswers);
    verseSearchInput.addEventListener('input', filterVerses);

    savedVersesList.addEventListener('click', async (e) => {
        const verseCard = e.target.closest('[data-id]');
        if (!verseCard) return;
        const verseId = +verseCard.dataset.id;
        if (e.target.closest('.options-menu-btn')) { const dropdown = e.target.closest('.options-menu-btn').nextElementSibling; const isHidden = dropdown.classList.contains('hidden'); document.querySelectorAll('.options-menu-dropdown').forEach(d => d.classList.add('hidden')); if (isHidden) dropdown.classList.remove('hidden'); return; }
        if (e.target.closest('.edit-verse-btn')) { e.preventDefault(); openAddEditModal(getSavedVerses().find(v => v.id === verseId)); }
        if (e.target.closest('.delete-verse-btn')) { e.preventDefault(); deleteVerse(verseId); }
        if (e.target.closest('.practice-btn')) { openPracticeScreen(verseId); }
        if (e.target.closest('.restart-btn')) { resetVerseProgress(verseId); }
        if (e.target.closest('.share-verse-btn')) {
            e.preventDefault();
            const verse = getSavedVerses().find(v => v.id === verseId);
            if (!verse) return;
            const match = parseInput(verse.originalInput);
            if (!match) return;
            const [, bookName, chapter, verseStart, verseEnd] = match;
            const bookAbrev = findBookAbrev(bookName);
            const verseParam = `${bookAbrev}.${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`;
            const shareUrl = `${window.location.origin}${window.location.pathname}?v=${verseParam}`;
            const text = `¡Te comparto este versículo para que lo memorices!%0A%0A*${verse.reference.toUpperCase()}*%0A%0A_${shareUrl}_`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
            window.open(whatsappUrl, '_blank');
        }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.options-menu')) { document.querySelectorAll('.options-menu-dropdown').forEach(d => d.classList.add('hidden')); } });
    
    // --- INICIALIZACIÓN ---
    handleSharedVerseFromUrl();
    renderPage();
});