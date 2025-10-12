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
    const noResultsState = document.getElementById('no-results-state'); // Nuevo
    const verseSearchInput = document.getElementById('verse-search-input'); // Nuevo
    const practiceScreen = document.getElementById('practice-screen');
    const practiceTitle = document.getElementById('practice-title');
    const practiceInstructions = document.getElementById('practice-instructions');
    const practiceVerseContainer = document.getElementById('practice-verse-container');
    const practiceWordBankContainer = document.getElementById('practice-word-bank-container');
    const practiceWordBank = document.getElementById('practice-word-bank');
    const practiceStatusMessage = document.getElementById('practice-status-message');
    const practiceCheckBtn = document.getElementById('practice-check-btn');
    const practiceCloseBtn = document.getElementById('practice-close-btn');

    // --- ESTADO DE LA APP ---
    let currentFetchedVerse = null;
    let isEditing = false;
    let currentVerseId = null;
    let practiceState = {};

    // --- API BÍBLICA Y UTILIDADES ---
    const books=[{name:"Génesis",abrev:"GN"},{name:"Éxodo",abrev:"EX"},{name:"Levítico",abrev:"LV"},{name:"Números",abrev:"NM"},{name:"Deuteronomio",abrev:"DT"},{name:"Josué",abrev:"JOS"},{name:"Jueces",abrev:"JUE"},{name:"Rut",abrev:"RT"},{name:"1 Samuel",abrev:"1S"},{name:"2 Samuel",abrev:"2S"},{name:"1 Reyes",abrev:"1R"},{name:"2 Reyes",abrev:"2R"},{name:"1 Crónicas",abrev:"1CR"},{name:"2 Crónicas",abrev:"2CR"},{name:"Esdras",abrev:"ESD"},{name:"Nehemías",abrev:"NEH"},{name:"Ester",abrev:"EST"},{name:"Job",abrev:"JOB"},{name:"Salmos",abrev:"SAL"},{name:"Proverbios",abrev:"PR"},{name:"Eclesiastés",abrev:"EC"},{name:"Cantares",abrev:"CNT"},{name:"Isaías",abrev:"IS"},{name:"Jeremías",abrev:"JER"},{name:"Lamentaciones",abrev:"LM"},{name:"Ezequiel",abrev:"EZ"},{name:"Daniel",abrev:"DN"},{name:"Oseas",abrev:"OS"},{name:"Joel",abrev:"JL"},{name:"Amós",abrev:"AM"},{name:"Abdías",abrev:"ABD"},{name:"Jonás",abrev:"JON"},{name:"Miqueas",abrev:"MI"},{name:"Nahúm",abrev:"NAH"},{name:"Habacuc",abrev:"HAB"},{name:"Sofonías",abrev:"SOF"},{name:"Hageo",abrev:"HAG"},{name:"Zacarías",abrev:"ZAC"},{name:"Malaquías",abrev:"MAL"},{name:"Mateo",abrev:"MT"},{name:"Marcos",abrev:"MR"},{name:"Lucas",abrev:"LC"},{name:"Juan",abrev:"JN"},{name:"Hechos",abrev:"HCH"},{name:"Romanos",abrev:"RO"},{name:"1 Corintios",abrev:"1CO"},{name:"2 Corintios",abrev:"2CO"},{name:"Gálatas",abrev:"GA"},{name:"Efesios",abrev:"EF"},{name:"Filipenses",abrev:"FIL"},{name:"Colosenses",abrev:"COL"},{name:"1 Tesalonicenses",abrev:"1TS"},{name:"2 Tesalonicenses",abrev:"2TS"},{name:"1 Timoteo",abrev:"1TI"},{name:"2 Timoteo",abrev:"2TI"},{name:"Tito",abrev:"TIT"},{name:"Filemón",abrev:"FLM"},{name:"Hebreos",abrev:"HE"},{name:"Santiago",abrev:"STG"},{name:"1 Pedro",abrev:"1P"},{name:"2 Pedro",abrev:"2P"},{name:"1 Juan",abrev:"1JN"},{name:"2 Juan",abrev:"2JN"},{name:"3 Juan",abrev:"3JN"},{name:"Judas",abrev:"JUD"},{name:"Apocalipsis",abrev:"AP"}];
    const findBookAbrev=(b)=>{const n=b.toLowerCase().replace(/[\s-]/g,"");return books.find(b=>b.name.toLowerCase().replace(/[\s-]/g,"").includes(n))?.abrev||null};
    const findBookName=(a)=>books.find(b=>b.abrev===a)?.name||a;
    const parseInput=(i)=>i.trim().match(/(.+?)\s*(\d+):(\d+)(?:-(\d+))?$/i);
    async function fetchVerseData(ref){const m=parseInput(ref);if(!m)return{error:"Formato de referencia inválido."};const[,b,c,vs,ve]=m;const ba=findBookAbrev(b);if(!ba)return{error:`Libro no encontrado: ${b}`};const vr=ve?`${vs}-${ve}`:vs;const u=`https://bible-api.deno.dev/api/read/rv1960/${ba}/${c}/${vr}`;try{const r=await fetch(u);if(!r.ok)throw new Error((await r.json()).message||"Error en la API");const d=await r.json();const da=Array.isArray(d)?d:[d];if(da.length===0)throw new Error("Versículo no encontrado.");const ft=da.map(v=>v.verse.trim()).join(" ");let fr=`${findBookName(ba)} ${c}:${da[0].number}`;if(da.length>1)fr+=`-${da[da.length-1].number}`;return{text:ft,reference:fr,originalInput:ref.trim()}}catch(e){return{error:e.message}}};

    // --- GESTIÓN DE DATOS (LocalStorage) ---
    const getSavedVerses = () => JSON.parse(localStorage.getItem('myVerses')) || [];
    const saveVersesToStorage = (v) => localStorage.setItem('myVerses', JSON.stringify(v));
    const addVerseToList = (verseData) => { let verses = getSavedVerses(); if (verses.some(v => v.reference === verseData.reference)) return false; verses.push({ ...verseData, id: Date.now(), currentLevel: 1, completionCount: 0, lastPracticed: null, isDominated: false }); saveVersesToStorage(verses); return true; };
    const saveVerse = (vd) => { if (isEditing) { let sv = getSavedVerses(); const i = sv.findIndex(v => v.id === currentVerseId); if (i !== -1) { sv[i] = { ...sv[i], text: vd.text, reference: vd.reference, originalInput: vd.originalInput }; saveVersesToStorage(sv); return { success: true } } } else { const added = addVerseToList(vd); return added ? { success: true } : { success: false, message: '¡Ese versículo ya está guardado, che!' }; } };
    const deleteVerse = (id) => { saveVersesToStorage(getSavedVerses().filter(v => v.id !== id)); renderSavedVerses(); };
    const updateVerseLevel = (id, newLevel) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].lastPracticed = Date.now(); if (newLevel > 2) { verses[index].isDominated = true; if (verses[index].currentLevel <= 2) { verses[index].completionCount = (verses[index].completionCount || 0) + 1; } } verses[index].currentLevel = newLevel; saveVersesToStorage(verses); } };
    const resetVerseProgress = (id) => { let verses = getSavedVerses(); const index = verses.findIndex(v => v.id === id); if (index !== -1) { verses[index].currentLevel = 1; verses[index].lastPracticed = Date.now(); saveVersesToStorage(verses); renderSavedVerses(); } };

    // --- RENDERIZADO Y MODALES PRINCIPALES ---
    const formatLastPracticed = (timestamp) => { if (!timestamp) return 'Nunca'; const now = new Date(); const lastDate = new Date(timestamp); if ((now - lastDate) < 60000) return 'Ahora mismo'; const diffDays = Math.floor((now - lastDate) / 86400000); if (diffDays === 0) return 'Hoy'; if (diffDays === 1) return 'Ayer'; return `Hace ${diffDays} días`; };
    const renderSavedVerses = () => { savedVersesList.innerHTML = ''; const verses = getSavedVerses(); emptyState.classList.toggle("hidden", verses.length > 0); noResultsState.classList.add('hidden'); verses.forEach(verse => { const level = verse.currentLevel || 1; const progress = level > 2 ? 100 : (level - 1) * 50; const actionButtonHTML = level > 2 ? `<button class="restart-btn bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center shadow-md"><span class="iconify mr-2" data-icon="material-symbols:restart-alt"></span>Reiniciar</button>` : `<button class="practice-btn bg-[var(--blue)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--dark-blue)] flex items-center shadow-md"><span class="iconify mr-2" data-icon="material-symbols:exercise-outline"></span>Nivel ${level}</button>`; const badgeHTML = verse.isDominated ? `<span class="status-tag dominado">Dominado</span>` : ''; const card = document.createElement("div"); card.className = "saved-verse-card space-y-4"; card.dataset.id = verse.id; card.innerHTML = `<div class="flex items-start justify-between"><div class="flex items-center gap-3"><span class="iconify text-2xl text-gray-300" data-icon="bi:quote"></span><h4 class="text-xl font-bold text-gray-800">${verse.reference}</h4></div><div class="flex items-center gap-2">${badgeHTML}<div class="relative options-menu"><button class="options-menu-btn text-gray-500 hover:text-gray-800 p-1 rounded-full"><span class="iconify text-2xl" data-icon="mdi:dots-vertical"></span></button><div class="options-menu-dropdown hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border origin-top-right"><a href="#" class="share-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:share-outline"></span>Compartir</a><a href="#" class="edit-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:edit-note-outline-rounded"></span>Editar</a><a href="#" class="delete-verse-btn flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><span class="iconify" data-icon="material-symbols:delete-forever-outline-rounded"></span>Eliminar</a></div></div></div></div><p class="verse-text">${verse.text}</p><div class="space-y-3"><div class="flex justify-between items-center text-sm font-medium text-gray-500"><span>Progreso de memorización</span><span>${progress}%</span></div><div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${progress}%;"></div></div><div class="flex justify-between items-center"><div class="flex gap-4 text-sm text-gray-500"><span class="flex items-center gap-1"><span class="iconify" data-icon="material-symbols:shield-outline"></span> ${verse.completionCount || 0} veces</span><span class="flex items-center gap-1"><span class="iconify" data-icon="material-symbols:timer-outline"></span> ${formatLastPracticed(verse.lastPracticed)}</span></div><div class="flex justify-end gap-3 items-center">${actionButtonHTML}</div></div></div>`; savedVersesList.appendChild(card); }); };
    const openAddEditModal = (v=null) => { isEditing=!!v; currentVerseId=v?v.id:null; modalTitleAdd.classList.toggle('hidden', isEditing); modalTitleEdit.classList.toggle('hidden', !isEditing); verseInput.value=v?v.originalInput:""; statusMessageEl.textContent=""; currentFetchedVerse=v||null; searchVerseBtn.disabled=!verseInput.value; saveModalBtn.textContent=isEditing?"Guardar Cambios":"Agregar Versículo"; saveModalBtn.disabled=!isEditing; verseInfoContainer.classList.toggle("hidden",!v); if(v)verseTextEl.textContent=v.text; verseModalOverlay.classList.add("open"); };
    const closeAddEditModal = () => verseModalOverlay.classList.remove("open");

    // --- LÓGICA DE NIVELES Y PRÁCTICA ---
    const adjustPracticeFontSize = (text) => {
        const len = text.length;
        const isMobile = window.innerWidth < 768;
        let baseSize = 1.75; // en rem
        if (isMobile) {
            baseSize = 1.2;
            if (len > 350) baseSize = 1.0;
            if (len > 500) baseSize = 0.9;
        } else {
            if (len > 350) baseSize = 1.5;
            if (len > 500) baseSize = 1.3;
        }
        practiceVerseContainer.style.fontSize = `${baseSize}rem`;
        practiceVerseContainer.querySelectorAll('.blank-input').forEach(input => {
            input.style.fontSize = `${baseSize * 0.9}rem`;
        });
    };

    const openPracticeScreen = (verseId) => { const verse = getSavedVerses().find(v => v.id === verseId); if (!verse) return; practiceState = { verse }; practiceTitle.textContent = verse.reference; practiceStatusMessage.textContent = ''; practiceCheckBtn.disabled = false; adjustPracticeFontSize(verse.text); practiceInstructions.textContent = verse.currentLevel === 1 ? 'Escribe las palabras correctas. ¡Las que aciertes desaparecerán de la lista de ayuda!' : 'Escribe las palabras que faltan en los espacios.'; document.addEventListener('keydown', handlePracticeKeystrokes); if (verse.currentLevel === 1) setupLevel1(); else setupLevel2(); practiceScreen.classList.add('open'); };
    const closePracticeScreen = () => { practiceScreen.classList.remove('open'); document.removeEventListener('keydown', handlePracticeKeystrokes); };
    const handlePracticeKeystrokes = (e) => {
        const activeEl = document.activeElement;
        if (activeEl && activeEl.classList.contains('blank-input')) {
            if (e.key === ' ') {
                e.preventDefault();
                const inputs = Array.from(practiceVerseContainer.querySelectorAll('.blank-input'));
                const currentIndex = inputs.indexOf(activeEl);
                if (currentIndex > -1) { const nextIndex = (currentIndex + 1) % inputs.length; inputs[nextIndex].focus(); }
            }
        }
        if (e.key === 'Enter') { e.preventDefault(); practiceCheckBtn.click(); }
        else if (e.key === 'Escape') { closePracticeScreen(); }
    };
    
    const setupLevel1=()=>{practiceWordBankContainer.classList.remove("hidden");const words=practiceState.verse.text.match(/\b[\wáéíóúüñ']+\b/g)||[];const blankCount=Math.max(1,Math.floor(words.length*0.2));practiceState.correctWords=[...words].sort(()=>0.5-Math.random()).slice(0,blankCount);let verseHTML=practiceState.verse.text;let wordOccurrences={};const blanksData=practiceState.correctWords.map(word=>{const key=word.toLowerCase();const occurrence=wordOccurrences[key]||0;wordOccurrences[key]=occurrence+1;const id=`${key}_${occurrence}`;const placeholder=`__BLANK_${id}__`;verseHTML=verseHTML.replace(new RegExp(`\\b${word}\\b`),placeholder);return{placeholder,word,id}});blanksData.forEach(({placeholder,word,id})=>{const inputWidth=Math.max(80,word.length*15);verseHTML=verseHTML.replace(placeholder,`<input type="text" class="blank-input" data-correct="${word.toLowerCase()}" data-word-id="${id}" style="width:${inputWidth}px" autocomplete="off">`)});practiceVerseContainer.innerHTML=verseHTML;practiceWordBank.innerHTML="";blanksData.sort(()=>0.5-Math.random()).forEach(({word,id})=>{const wordEl=document.createElement("span");wordEl.className="word-bank-item bg-blue-100 text-blue-800 font-bold py-2 px-4 rounded-lg";wordEl.textContent=word;wordEl.dataset.wordId=id;practiceWordBank.appendChild(wordEl)});practiceVerseContainer.querySelectorAll(".blank-input").forEach(input=>input.addEventListener("input",handleWordBankVisibility));practiceVerseContainer.querySelector("input")?.focus()};
    const handleWordBankVisibility=(e)=>{const typedValue=e.target.value.trim().toLowerCase();const correctValue=e.target.dataset.correct;const wordId=e.target.dataset.wordId;const wordBankItem=practiceWordBank.querySelector(`[data-word-id="${wordId}"]`);if(wordBankItem){const isCorrect=typedValue===correctValue;wordBankItem.style.opacity=isCorrect?"0.3":"1";wordBankItem.style.transform=isCorrect?"scale(0.9)":"scale(1)"}};
    const setupLevel2=()=>{practiceWordBankContainer.classList.add("hidden");const words=practiceState.verse.text.match(/\b[\wáéíóúüñ']+\b/g)||[];const blankCount=Math.max(1,Math.floor(words.length*0.35));practiceState.correctWords=[...words].sort(()=>0.5-Math.random()).slice(0,blankCount);let verseHTML=practiceState.verse.text;let wordOccurrences={};const blanksData=practiceState.correctWords.map(word=>{const key=word.toLowerCase();const occurrence=wordOccurrences[key]||0;wordOccurrences[key]=occurrence+1;const placeholder=`__BLANK_${key}_${occurrence}__`;verseHTML=verseHTML.replace(new RegExp(`\\b${word}\\b`),placeholder);return{placeholder,word}});blanksData.forEach(({placeholder,word})=>{const inputWidth=Math.max(80,word.length*15);verseHTML=verseHTML.replace(placeholder,`<input type="text" class="blank-input" data-correct="${word.toLowerCase()}" style="width:${inputWidth}px" autocomplete="off">`)});practiceVerseContainer.innerHTML=verseHTML;practiceVerseContainer.querySelector("input")?.focus()};
    const triggerCelebration=()=>{practiceScreen.classList.add("celebration-active");setTimeout(()=>practiceScreen.classList.remove("celebration-active"),1200);confetti({particleCount:150,spread:90,origin:{y:0.6},zIndex:9999})};
    const checkAnswers=()=>{const{verse}=practiceState;const inputs=Array.from(practiceVerseContainer.querySelectorAll(".blank-input"));let allCorrect=true;inputs.forEach(input=>{const isCorrect=input.value.trim().toLowerCase()===input.dataset.correct;input.classList.toggle("correct",isCorrect);input.classList.toggle("incorrect",!isCorrect);if(!isCorrect)allCorrect=false});if(allCorrect){practiceStatusMessage.textContent="¡Excelente! Nivel superado.";practiceStatusMessage.style.color="var(--green)";practiceCheckBtn.disabled=true;inputs.forEach(input=>input.disabled=true);triggerCelebration();updateVerseLevel(verse.id,verse.currentLevel+1);setTimeout(()=>{closePracticeScreen();renderSavedVerses()},2000)}else{practiceStatusMessage.textContent="¡Casi! Revisa las cajas en rojo.";practiceStatusMessage.style.color="var(--red)";setTimeout(()=>practiceStatusMessage.textContent="",2000)}};
    const handleSharedVerseFromUrl = async () => { const params = new URLSearchParams(window.location.search); const verseParam = params.get('v'); if (!verseParam) return; const match = verseParam.match(/^([A-Z0-9]+)\.(\d+):(\d+)(?:-(\d+))?$/i); if (!match) return; const [, bookAbrev, chapter, verseStart, verseEnd] = match; const bookName = findBookName(bookAbrev); if (!bookName) return; const fullRef = `${bookName} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`; const verseData = await fetchVerseData(fullRef); if (verseData && !verseData.error) { if (addVerseToList(verseData)) { renderSavedVerses(); } } window.history.replaceState({}, document.title, window.location.pathname); };
    
    // --- LÓGICA DEL BUSCADOR ---
    const filterVerses = () => {
        const searchTerm = verseSearchInput.value.toLowerCase().trim();
        const verseCards = savedVersesList.querySelectorAll('.saved-verse-card');
        let visibleCount = 0;
        verseCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const isVisible = cardText.includes(searchTerm);
            card.classList.toggle('hidden', !isVisible);
            if (isVisible) visibleCount++;
        });
        const hasSavedVerses = getSavedVerses().length > 0;
        emptyState.classList.toggle('hidden', hasSavedVerses);
        noResultsState.classList.toggle('hidden', visibleCount > 0 || !hasSavedVerses);
    };

    // --- EVENT LISTENERS ---
    openModalBtn.addEventListener('click', () => openAddEditModal());
    [cancelModalBtn, closeModalXBtn].forEach(el => el.addEventListener('click', closeAddEditModal));
    verseModalOverlay.addEventListener('click', e => { if (e.target === verseModalOverlay) closeAddEditModal(); });
    verseInput.addEventListener('input', () => { searchVerseBtn.disabled = !verseInput.value.trim(); verseInfoContainer.classList.add('hidden'); saveModalBtn.disabled = true; });
    searchVerseBtn.addEventListener('click', async () => { searchVerseBtn.disabled = true; statusMessageEl.textContent = 'Buscando...'; const data = await fetchVerseData(verseInput.value); if (!data.error) { currentFetchedVerse = data; verseTextEl.textContent = data.text; verseInfoContainer.classList.remove('hidden'); saveModalBtn.disabled = false; statusMessageEl.textContent = '¡Versículo encontrado!'; } else { statusMessageEl.textContent = data.error; } searchVerseBtn.disabled = false; });
    saveModalBtn.addEventListener('click', () => { if (currentFetchedVerse) { const result = saveVerse(currentFetchedVerse); if (result.success) { renderSavedVerses(); filterVerses(); closeAddEditModal(); } else { statusMessageEl.textContent = result.message; } } });
    practiceCloseBtn.addEventListener('click', closePracticeScreen);
    practiceCheckBtn.addEventListener('click', checkAnswers);
    verseSearchInput.addEventListener('input', filterVerses);

    savedVersesList.addEventListener('click', async (e) => {
        const verseCard = e.target.closest('[data-id]');
        if (!verseCard) return;
        const verseId = +verseCard.dataset.id;
        const optionsBtn = e.target.closest('.options-menu-btn');
        if (optionsBtn) { const dropdown = optionsBtn.nextElementSibling; const isHidden = dropdown.classList.contains('hidden'); document.querySelectorAll('.options-menu-dropdown').forEach(d => d.classList.add('hidden')); if (isHidden) dropdown.classList.remove('hidden'); return; }
        if (e.target.closest('.edit-verse-btn')) { e.preventDefault(); openAddEditModal(getSavedVerses().find(v => v.id === verseId)); }
        if (e.target.closest('.delete-verse-btn')) { e.preventDefault(); deleteVerse(verseId); }
        if (e.target.closest('.practice-btn')) { openPracticeScreen(verseId); }
        if (e.target.closest('.restart-btn')) { resetVerseProgress(verseId); }
        const shareBtn = e.target.closest('.share-verse-btn');
        if (shareBtn) {
            e.preventDefault();
            const verse = getSavedVerses().find(v => v.id === verseId);
            if (!verse) return;
            const match = parseInput(verse.originalInput);
            if (!match) return;
            const [, bookName, chapter, verseStart, verseEnd] = match;
            const bookAbrev = findBookAbrev(bookName);
            const verseParam = `${bookAbrev}.${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`;
            const shareUrl = `${window.location.origin}${window.location.pathname}?v=${verseParam}`;
            const shareData = { title: 'Versículo para memorizar', text: `¡Te comparto este versículo para que lo memorices!: ${verse.reference}`, url: shareUrl, };
            if (navigator.share) { try { await navigator.share(shareData); } catch (err) { console.error("Error al compartir:", err); } }
            else { navigator.clipboard.writeText(shareUrl).then(() => { const originalText = shareBtn.innerHTML; shareBtn.innerHTML = `<span class="iconify" data-icon="material-symbols:check"></span>¡Enlace copiado!`; setTimeout(() => { shareBtn.innerHTML = originalText; }, 2000); }).catch(err => console.error('Error al copiar:', err)); }
        }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.options-menu')) { document.querySelectorAll('.options-menu-dropdown').forEach(d => d.classList.add('hidden')); } });

    // --- INICIALIZACIÓN ---
    handleSharedVerseFromUrl();
    renderSavedVerses();
});