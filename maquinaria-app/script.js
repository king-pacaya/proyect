document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const trialButton = document.getElementById('trialButton');

    const logoutButton = document.getElementById('logoutButton');
    const machineryContainer = document.getElementById('machineryContainer');
    const userDisplayName = document.getElementById('userDisplayName');
    const membershipStatus = document.getElementById('membershipStatus');
    const trialDaysRemainingDisplay = document.getElementById('trialDaysRemaining');
    const upgradeButtonDashboard = document.getElementById('upgradeButtonDashboard'); // ID correcto del botón en el dashboard

    // --- Usuarios y Maquinarias (Datos Falsos) ---
    const users = [
        // Usuarios "Premium" o de pago
        { email: 'camila.torres21@gmail.com', password: 'camila123', isTrial: false },
        { email: 'luis.mendoza_89@hotmail.com', password: 'luis2025', isTrial: false },
        { email: 'daniela.rios@techgroup.pe', password: 'daniela25', isTrial: false },
        // Puedes añadir a Fernanda aquí como trial si quieres probar ese caso específicamente
        { email: 'fernanda.gomez@empresa.com', password: 'fernanda', isTrial: true, trialStartDate: new Date().toISOString(), trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    const machines = [
        {
            id: 'EXC001',
            type: 'Excavadora Cat 320',
            location: 'Santiago de Surco, Lima',
            data: {
                temperatura: 85,
                vibracion: 0.7, // mm/s
                horasUso: 1250,
                presionAceite: 45 // PSI
            },
            status: 'Operativa'
        },
        {
            id: 'CARG002',
            type: 'Cargador Frontal Volvo L90H',
            location: 'San Juan de Lurigancho, Lima',
            data: {
                temperatura: 92,
                vibracion: 1.2,
                horasUso: 2100,
                presionAceite: 38
            },
            status: 'Alerta' // Por ejemplo, vibración alta
        },
        {
            id: 'RETRO003',
            type: 'Retroexcavadora John Deere 310SL',
            location: 'Comas, Lima',
            data: {
                temperatura: 78,
                vibracion: 0.5,
                horasUso: 890,
                presionAceite: 50
            },
            status: 'Operativa'
        },
        {
            id: 'RODI004',
            type: 'Rodillo Compactador Bomag BW213DH-5',
            location: 'Ate, Lima',
            data: {
                temperatura: 88,
                vibracion: 0.9,
                horasUso: 1560,
                presionAceite: 42
            },
            status: 'Mantenimiento' // Por ejemplo, necesita revisión
        },
        {
            id: 'GRUA005',
            type: 'Grúa Móvil Grove GMK5150L',
            location: 'Callao, Lima',
            data: {
                temperatura: 95,
                vibracion: 1.5,
                horasUso: 3200,
                presionAceite: 35
            },
            status: 'Alerta'
        }
    ];

    // --- Funciones de Autenticación ---

    function getAuthenticatedUser() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    function setAuthenticatedUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    function clearAuthenticatedUser() {
        sessionStorage.removeItem('currentUser');
    }

    // Función para obtener el nombre de usuario y el saludo correcto
    function getUserNameAndGreeting(email) {
        if (!email) return 'Bienvenido';
        const parts = email.split('@')[0].split('.');
        const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const lastName = parts.length > 1 ? parts[1].replace(/[^a-zA-Z]/g, '').charAt(0).toUpperCase() + parts[1].replace(/[^a-zA-Z]/g, '').slice(1) : '';

        const name = `${firstName} ${lastName}`.trim();
        const lastCharOfName = firstName.slice(-1).toLowerCase();

        if (lastCharOfName === 'a') {
            return `Bienvenida, ${name}`;
        } else {
            return `Bienvenido, ${name}`;
        }
    }


    // Lógica para la página de inicio de sesión (index.html)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Almacena el usuario autenticado (incluyendo si es de prueba o no)
                setAuthenticatedUser(user);
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = 'Correo o contraseña incorrectos.';
                errorMessage.classList.remove('hidden');
            }
        });

        trialButton.addEventListener('click', () => {
            // Crea un usuario de prueba dinámicamente y lo setea como actual
            const trialUser = {
                email: 'usuario.prueba@demo.com', // Puedes generar un email único si quieres
                password: 'password_prueba', // Contraseña para el usuario de prueba
                isTrial: true,
                trialStartDate: new Date().toISOString(),
                trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            setAuthenticatedUser(trialUser);
            window.location.href = 'dashboard.html';
        });
    }

    // Lógica para la página del dashboard (dashboard.html)
    if (machineryContainer) {
        const currentUser = getAuthenticatedUser();

        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        userDisplayName.textContent = getUserNameAndGreeting(currentUser.email);

        // Mostrar estado de membresía/prueba y botón de membresía SOLO si el usuario es de prueba
        if (currentUser.isTrial) {
            membershipStatus.classList.remove('hidden');
            upgradeButtonDashboard.classList.remove('hidden');
            const trialEndDate = new Date(currentUser.trialEndDate);
            const now = new Date();
            const diffTime = trialEndDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            trialDaysRemainingDisplay.textContent = Math.max(0, diffDays);
        } else {
            // Si no es un usuario de prueba, asegúrate de que estén ocultos
            membershipStatus.classList.add('hidden');
            upgradeButtonDashboard.classList.add('hidden');
        }

        function updateMachineData() {
            machines.forEach(machine => {
                machine.data.temperatura = (Math.random() * (95 - 75) + 75).toFixed(1);
                machine.data.vibracion = (Math.random() * (1.8 - 0.3) + 0.3).toFixed(1);
                machine.data.presionAceite = (Math.random() * (55 - 30) + 30).toFixed(1);

                if (machine.data.vibracion > 1.2 || machine.data.temperatura > 90 || machine.data.presionAceite < 35) {
                    machine.status = 'Alerta';
                } else {
                    machine.status = 'Operativa';
                }

                if (Math.random() < 0.05) {
                    machine.status = 'Mantenimiento';
                }
            });
        }

        function renderMachineryCards() {
            machineryContainer.innerHTML = '';
            machines.forEach(machine => {
                let statusColor = '';
                let borderColor = '';
                let iconColor = '';
                let statusText = '';
                let statusIcon = '';

                switch (machine.status) {
                    case 'Operativa':
                        statusColor = 'bg-green-600';
                        borderColor = 'border-green-600';
                        iconColor = 'text-green-500';
                        statusText = 'Operativa';
                        statusIcon = 'fas fa-check-circle';
                        break;
                    case 'Alerta':
                        statusColor = 'bg-orange-500';
                        borderColor = 'border-orange-500';
                        iconColor = 'text-orange-500';
                        statusText = 'Alerta';
                        statusIcon = 'fas fa-exclamation-triangle';
                        break;
                    case 'Mantenimiento':
                        statusColor = 'bg-blue-600';
                        borderColor = 'border-blue-600';
                        iconColor = 'text-blue-500';
                        statusText = 'Mantenimiento';
                        statusIcon = 'fas fa-tools';
                        break;
                    default:
                        statusColor = 'bg-gray-500';
                        borderColor = 'border-gray-500';
                        iconColor = 'text-gray-400';
                        statusText = 'Desconocido';
                        statusIcon = 'fas fa-question-circle';
                }

                const cardHtml = `
                    <div class="bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 ${borderColor} hover:shadow-xl transform hover:scale-105 transition duration-300">
                        <h3 class="text-xl font-bold text-white mb-2">${machine.type}</h3>
                        <span class="${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center w-fit mb-4">
                            <i class="${statusIcon} mr-2"></i>${statusText}
                        </span>
                        <p class="text-gray-400 text-sm mb-4">ID: <span class="font-semibold text-gray-300">${machine.id}</span></p>

                        <div class="space-y-3 text-sm text-gray-300 mb-5">
                            <div class="flex items-center">
                                <i class="fas fa-thermometer-half ${iconColor} mr-3 w-5"></i>
                                <span>Temperatura: <span class="font-semibold">${machine.data.temperatura}°C</span></span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-vial ${iconColor} mr-3 w-5"></i>
                                <span>Vibración: <span class="font-semibold">${machine.data.vibracion} mm/s</span></span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-clock ${iconColor} mr-3 w-5"></i>
                                <span>Horas de Uso: <span class="font-semibold">${machine.data.horasUso} hrs</span></span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-oil-can ${iconColor} mr-3 w-5"></i>
                                <span>Presión de Aceite: <span class="font-semibold">${machine.data.presionAceite} PSI</span></span>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            <button onclick="window.open('http://maps.google.com/maps?q=${encodeURIComponent(machine.location + ', Lima, Peru')}', '_blank')"
                                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center justify-center transition duration-300 focus:outline-none">
                                <i class="fas fa-map-marker-alt mr-2"></i> Ubicación
                            </button>
                        </div>
                    </div>
                `;
                machineryContainer.innerHTML += cardHtml;
            });
        }

        // Renderizar las tarjetas al cargar la página
        renderMachineryCards();

        // Botón de cerrar sesión
        logoutButton.addEventListener('click', () => {
            clearAuthenticatedUser();
            window.location.href = 'index.html';
        });

        // Botón de "Actualizar a Membresía Premium"
        if (upgradeButtonDashboard) {
            upgradeButtonDashboard.addEventListener('click', () => {
                alert('¡Gracias por tu interés en la membresía Premium! Esto te llevaría a una página de pago real.');
            });
        }
    }
});