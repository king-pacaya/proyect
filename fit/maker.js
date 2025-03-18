// Datos almacenados en localStorage
let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
let routines = JSON.parse(localStorage.getItem('routines')) || [];

// Elementos del DOM
const exerciseGrid = document.getElementById('exerciseGrid');
const exerciseModal = document.getElementById('exerciseModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubmitButton = document.getElementById('modalSubmitButton');
const exerciseForm = document.getElementById('exerciseForm');
const exerciseTitleInput = document.getElementById('exerciseTitle');
const exerciseTypeRadios = document.querySelectorAll('input[name="exerciseType"]');
const timeField = document.getElementById('timeField');
const repsField = document.getElementById('repsField');

const routineModal = document.getElementById('routineModal');
const routineModalTitle = document.getElementById('routineModalTitle');
const routineNameInput = document.getElementById('routineName');
const saveRoutineButton = document.getElementById('saveRoutineButton');
const routineExercisesContainer = document.getElementById('routineExercises');
const availableExercisesContainer = document.getElementById('availableExercises');
const searchExerciseInput = document.getElementById('searchExerciseInput');

// Nueva variable para almacenar las imágenes actuales en edición
let currentImagePaths = [];

// Variables temporales
let currentExerciseId = null; // Para editar ejercicios
let currentRoutineId = null;  // Para editar rutinas
let selectedExercises = [];   // Para crear o editar rutina

// Mostrar/ocultar campos según tipo de ejercicio
exerciseTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'time') {
      timeField.classList.remove('hidden');
      repsField.classList.add('hidden');
    } else {
      repsField.classList.remove('hidden');
      timeField.classList.add('hidden');
    }
  });
});

// -------------- Modal de Ejercicio --------------
function openModal(exerciseId = null) {
  currentExerciseId = exerciseId;
  document.getElementById('exerciseImages').value = "";
  document.getElementById('exerciseImagePreview').innerHTML = "";
  currentImagePaths = [];
  
  if (exerciseId) {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    exerciseTitleInput.value = exercise.title;
    document.querySelector(`input[name="exerciseType"][value="${exercise.type}"]`).checked = true;
    if (exercise.type === 'time') {
      document.getElementById('exerciseTime').value = exercise.time;
      timeField.classList.remove('hidden');
      repsField.classList.add('hidden');
    } else {
      document.getElementById('exerciseReps').value = exercise.reps;
      repsField.classList.remove('hidden');
      timeField.classList.add('hidden');
    }
    if (exercise.images && exercise.images.length > 0) {
      currentImagePaths = [...exercise.images];
      renderImagePreview();
    }
    modalTitle.textContent = 'Editar Ejercicio';
    modalSubmitButton.innerHTML = '<i class="fas fa-edit mr-2"></i> Guardar Cambios';
  } else {
    exerciseForm.reset();
    modalTitle.textContent = 'Crear Ejercicio';
    modalSubmitButton.innerHTML = '<i class="fas fa-plus mr-2"></i> Crear Ejercicio';
  }
  exerciseModal.classList.remove('hidden');
}

function renderImagePreview() {
  const imagePreview = document.getElementById('exerciseImagePreview');
  imagePreview.innerHTML = "";
  currentImagePaths.forEach((imgPath, index) => {
    const imgDiv = document.createElement('div');
    imgDiv.className = "inline-block relative mr-2";
    imgDiv.innerHTML = `<img src="${imgPath}" alt="Preview" class="w-16 h-16 object-cover" style="aspect-ratio: 4/3;">
                        <button onclick="removeImageFromPreview(${index})" class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">x</button>`;
    imagePreview.appendChild(imgDiv);
  });
}

function removeImageFromPreview(index) {
  currentImagePaths.splice(index, 1);
  renderImagePreview();
}

function closeModal() {
  exerciseModal.classList.add('hidden');
}

exerciseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = exerciseTitleInput.value.trim();
  const type = document.querySelector('input[name="exerciseType"]:checked').value;
  const time = type === 'time' ? Number(document.getElementById('exerciseTime').value) : null;
  const reps = type === 'reps' ? Number(document.getElementById('exerciseReps').value) : null;
  
  if (!currentExerciseId && exercises.some(ex => ex.title.toLowerCase() === title.toLowerCase())) {
    alert('Ya existe un ejercicio con ese nombre.');
    return;
  }
  
  let imagePaths = [];
  const imageInput = document.getElementById('exerciseImages');
  if (imageInput.files.length > 0) {
    if (imageInput.files.length > 4) {
      alert("Puedes subir máximo 4 imágenes.");
      return;
    }
    for (let file of imageInput.files) {
      imagePaths.push("multimedia/" + file.name);
    }
  } else if (currentExerciseId) {
    imagePaths = currentImagePaths;
  }
  
  const exercise = {
    id: currentExerciseId || Date.now(),
    title,
    type,
    time,
    reps,
    images: imagePaths
  };
  
  if (currentExerciseId) {
    const index = exercises.findIndex(ex => ex.id === currentExerciseId);
    exercises[index] = exercise;
    routines.forEach(routine => {
      routine.exercises = routine.exercises.map(ex => ex.id === currentExerciseId ? exercise : ex);
    });
  } else {
    exercises.push(exercise);
  }
  
  saveToLocalStorage();
  renderExerciseCards();
  renderAvailableExercisesForRoutine();
  closeModal();
});

function renderExerciseCards() {
  exerciseGrid.innerHTML = '';
  exercises.forEach(exercise => {
    const card = document.createElement('div');
    card.className = 'bg-[#F2F2F2] p-4 rounded-md shadow-sm relative';
    
    let imageHTML = "";
    if (exercise.images && exercise.images.length > 0) {
      if (exercise.images.length === 1) {
        imageHTML = `<div class="w-full mb-2" style="aspect-ratio: 4/3; overflow:hidden;">
                       <img src="${exercise.images[0]}" alt="${exercise.title}" class="w-full h-full object-cover">
                     </div>`;
      } else if (exercise.images.length === 2) {
        imageHTML = `<div class="flex mb-2">
                       <div class="w-1/2" style="aspect-ratio: 4/3; overflow:hidden;">
                         <img src="${exercise.images[0]}" alt="${exercise.title}" class="w-full h-full object-cover">
                       </div>
                       <div class="w-1/2" style="aspect-ratio: 4/3; overflow:hidden;">
                         <img src="${exercise.images[1]}" alt="${exercise.title}" class="w-full h-full object-cover">
                       </div>
                     </div>`;
      } else if (exercise.images.length > 2) {
        imageHTML = `<div class="grid grid-cols-2 gap-1 mb-2" style="aspect-ratio: 4/3; overflow:hidden;">`;
        exercise.images.forEach(img => {
          imageHTML += `<div class="w-full h-full">
                          <img src="${img}" alt="${exercise.title}" class="w-full h-full object-cover">
                        </div>`;
        });
        imageHTML += `</div>`;
      }
    }
    
    card.innerHTML = `
      ${imageHTML}
      <div class="flex flex-col items-center text-center">
        <h3 class="text-lg font-bold uppercase">${exercise.title}</h3>
        <p class="text-sm">${exercise.type === 'time' ? exercise.time + " segundos" : exercise.reps + " repeticiones"}</p>
      </div>
      <div class="absolute top-2 right-2">
        <button onclick="openModal(${exercise.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D] mr-2">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteExercise(${exercise.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    exerciseGrid.appendChild(card);
  });
}

function deleteExercise(id) {
  exercises = exercises.filter(ex => ex.id !== id);
  saveToLocalStorage();
  renderExerciseCards();
  renderAvailableExercisesForRoutine();
}

function openRoutineModal() {
  if (!currentRoutineId) {
    routineNameInput.value = '';
    selectedExercises = [];
    renderRoutineExercises();
  }
  routineModalTitle.textContent = currentRoutineId ? 'Editar Rutina' : 'Crear Rutina';
  saveRoutineButton.innerHTML = currentRoutineId ? '<i class="fas fa-edit mr-2"></i> Actualizar Rutina' : '<i class="fas fa-save mr-2"></i> Guardar Rutina';
  renderAvailableExercisesForRoutine();
  routineModal.classList.remove('hidden');
}

function closeRoutineModal() {
  routineModal.classList.add('hidden');
  currentRoutineId = null;
  routineNameInput.value = '';
  selectedExercises = [];
  renderRoutineExercises();
}

function renderAvailableExercisesForRoutine() {
  const searchTerm = searchExerciseInput.value.toLowerCase();
  let sorted = exercises.slice().sort((a, b) => a.title.localeCompare(b.title));
  const filtered = sorted.filter(ex => ex.title.toLowerCase().includes(searchTerm));
  availableExercisesContainer.innerHTML = '';
  filtered.forEach(exercise => {
    const div = document.createElement('div');
    div.className = 'bg-[#F2F2F2] p-2 rounded-md shadow-sm cursor-pointer hover:bg-[#E5E5E5]';
    div.textContent = `${exercise.title} - ${exercise.type === 'time' ? exercise.time + " segundos" : exercise.reps + " repeticiones"}`;
    div.onclick = () => addExerciseToRoutine(exercise.id);
    availableExercisesContainer.appendChild(div);
  });
}

function addExerciseToRoutine(id) {
  const exercise = exercises.find(ex => ex.id === id);
  if (exercise) {
    selectedExercises.push(exercise);
    renderRoutineExercises();
  }
}

function removeExerciseFromRoutine(index) {
  selectedExercises.splice(index, 1);
  renderRoutineExercises();
}

function renderRoutineExercises() {
  routineExercisesContainer.innerHTML = '';
  selectedExercises.forEach((exercise, index) => {
    const div = document.createElement('div');
    div.className = 'bg-[#F2F2F2] p-2 rounded-md shadow-sm flex justify-between items-center';
    div.innerHTML = `
      <span>${exercise.title} - ${exercise.type === 'time' ? exercise.time + " segundos" : exercise.reps + " repeticiones"}</span>
      <button onclick="removeExerciseFromRoutine(${index})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
        <i class="fas fa-trash"></i>
      </button>
    `;
    routineExercisesContainer.appendChild(div);
  });
}

function saveRoutine() {
  const routineName = routineNameInput.value.trim();
  if (!routineName || selectedExercises.length === 0) {
    alert('Ingresa un nombre y selecciona al menos un ejercicio para la rutina.');
    return;
  }
  if (currentRoutineId) {
    const index = routines.findIndex(r => r.id === currentRoutineId);
    if (index !== -1) {
      routines[index].name = routineName;
      routines[index].exercises = selectedExercises;
    }
    currentRoutineId = null;
  } else {
    const routine = {
      id: Date.now(),
      name: routineName,
      exercises: selectedExercises
    };
    routines.push(routine);
  }
  saveToLocalStorage();
  renderRoutines();
  closeRoutineModal();
}

function renderRoutines() {
  const routineList = document.getElementById('routineList');
  routineList.innerHTML = '';
  routines.forEach(routine => {
    let exerciseTitles = routine.exercises.map(ex => ex.title);
    let summary = exerciseTitles.length > 2 
      ? exerciseTitles.slice(0, 2).join(", ") + " y " + (exerciseTitles.length - 2) + " más"
      : exerciseTitles.join(", ");
    
    const routineCard = document.createElement('div');
    routineCard.className = 'bg-[#F2F2F2] p-4 rounded-md shadow-sm relative';
    routineCard.innerHTML = `
      <div>
        <h3 class="text-lg font-bold text-[#0D0D0D] mb-2">${routine.name}</h3>
        <p class="text-sm text-[#0D0D0D]">${summary}</p>
      </div>
      <div class="absolute top-2 right-2 flex items-center gap-2">
        <label class="flex items-center cursor-pointer">
          <input type="checkbox" class="routine-select-checkbox hidden" data-routine-id="${routine.id}">
          <span class="w-4 h-4 inline-block border border-[#0D0D0D] rounded-sm mr-1 transition-colors duration-200"></span>
        </label>
        <button onclick="editRoutine(${routine.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="downloadRoutine(${routine.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
          <i class="fas fa-download"></i>
        </button>
        <button onclick="deleteRoutine(${routine.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
          <i class="fas fa-trash"></i>
        </button>
        <button onclick="moveRoutineUp(${routine.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button onclick="moveRoutineDown(${routine.id})" class="text-[#0D0D0D] hover:text-[#0D0D0D]">
          <i class="fas fa-arrow-down"></i>
        </button>
      </div>
    `;
    routineList.appendChild(routineCard);
  });

  document.querySelectorAll('.routine-select-checkbox').forEach(checkbox => {
    const customBox = checkbox.parentElement.querySelector('span');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        customBox.classList.add('bg-[#0D0D0D]', 'border-[#0D0D0D]');
      } else {
        customBox.classList.remove('bg-[#0D0D0D]', 'border-[#0D0D0D]');
      }
    });
  });
}

function moveRoutineUp(id) {
  const index = routines.findIndex(r => r.id === id);
  if (index > 0) {
    [routines[index - 1], routines[index]] = [routines[index], routines[index - 1]];
    saveToLocalStorage();
    renderRoutines();
  }
}

function moveRoutineDown(id) {
  const index = routines.findIndex(r => r.id === id);
  if (index < routines.length - 1) {
    [routines[index + 1], routines[index]] = [routines[index], routines[index + 1]];
    saveToLocalStorage();
    renderRoutines();
  }
}

function editRoutine(id) {
  const routine = routines.find(r => r.id === id);
  if (routine) {
    currentRoutineId = id;
    routineNameInput.value = routine.name;
    selectedExercises = routine.exercises.slice();
    renderRoutineExercises();
    saveRoutineButton.innerHTML = '<i class="fas fa-edit mr-2"></i> Actualizar Rutina';
    openRoutineModal();
  }
}

function deleteRoutine(id) {
  routines = routines.filter(r => r.id !== id);
  saveToLocalStorage();
  renderRoutines();
}

function downloadRoutine(id) {
  const routine = routines.find(r => r.id === id);
  const dataStr = JSON.stringify(routine, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${routine.name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAllRoutines() {
  const dataStr = JSON.stringify(routines, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `todas_las_rutinas.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadExercises() {
  const dataStr = JSON.stringify(exercises, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ejercicios.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function uploadExercises(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        exercises = data;
        saveToLocalStorage();
        renderExerciseCards();
        renderAvailableExercisesForRoutine();
      } else {
        alert("El archivo no contiene un array válido de ejercicios.");
      }
    } catch (err) {
      alert("Error al leer el archivo JSON.");
    }
  };
  reader.readAsText(file);
}

function saveToLocalStorage() {
  localStorage.setItem('exercises', JSON.stringify(exercises));
  localStorage.setItem('routines', JSON.stringify(routines));
}

exerciseModal.addEventListener('click', function(e) {
  if (e.target === exerciseModal) {
    closeModal();
  }
});

routineModal.addEventListener('click', function(e) {
  if (e.target === routineModal) {
    closeRoutineModal();
  }
});

function downloadSelectedRoutines() {
  const checkboxes = document.querySelectorAll('.routine-select-checkbox');
  const selectedIds = [];
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedIds.push(parseInt(checkbox.getAttribute('data-routine-id')));
    }
  });
  if (selectedIds.length === 0) {
    alert('Por favor, selecciona al menos una rutina para exportar.');
    return;
  }
  const selectedRoutines = routines.filter(routine => selectedIds.includes(routine.id));
  const dataStr = JSON.stringify(selectedRoutines, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rutinas_seleccionadas.json`;
  a.click();
  URL.revokeObjectURL(url);
}

searchExerciseInput.addEventListener('input', renderAvailableExercisesForRoutine);

renderExerciseCards();
renderRoutines();