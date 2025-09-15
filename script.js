/*
  MediCare - Funcionalidad de reservas
  Licencia: Software libre, se puede usar y modificar
*/

// Referencias del DOM
const form = document.getElementById('citaForm');
const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');

// Simulación de integración con Google Calendar
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Combinar fecha y hora
    const startDateTime = new Date(`${fecha}T${hora}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30*60000); // 30 min

    // Mensaje de confirmación
    mensajeConfirmacion.innerHTML = `✅ ¡Gracias <b>${nombre}</b>! Tu cita ha sido registrada para el <b>${fecha}</b> a las <b>${hora}</b>.`;

    // 🔹 Aquí se mostraría la lógica de Google Calendar:
    console.log(`Evento: ${nombre}, ${email}, ${startDateTime.toISOString()} - ${endDateTime.toISOString()}`);

    // Reset form
    form.reset();
});

