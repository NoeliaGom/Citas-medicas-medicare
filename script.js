const form = document.getElementById('reservaForm');
const mensaje = document.getElementById('mensaje');
const linkPaciente = document.getElementById('linkPaciente');

// 🔑 Configura tus credenciales de Google Cloud
const CLIENT_ID = '299529568501-k8mqki0kjrusq3lhijjspkm0qvnbgfrc.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCEBJQOLpqHV3CsoeHzidM0suin8kZ3IsU';
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const CALENDAR_ID_DOCTOR = 'elenaescobardesamayoa@gmail.com'; // Calendario del doctor

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Combinar fecha y hora en formato ISO
    const startDateTime = new Date(`${fecha}T${hora}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30*60000); // 30 min

    // Mensaje de confirmación
    mensaje.innerHTML = `✅ ¡Gracias <b>${nombre}</b>! Tu cita ha sido registrada para el <b>${fecha}</b> a las <b>${hora}</b>.`;

    // 📌 Generar link para el paciente (Google Calendar manual)
    const gcalLink = `https://calendar.google.com/calendar/r/eventedit?text=Cita+con+dentista&dates=${formatGCalDate(startDateTime)}/${formatGCalDate(endDateTime)}&details=Reserva de cita (${email})&location=Clínica&ctz=America/El_Salvador`;
    linkPaciente.href = gcalLink;
    linkPaciente.style.display = "block";
    linkPaciente.textContent = "➕ Agregar al calendario del paciente";

    // 📌 Agregar evento al Google Calendar del doctor (automático)
    gapi.load('client:auth2', async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
        });

        await gapi.auth2.getAuthInstance().signIn();
        await gapi.client.load('calendar', 'v3');

        const event = {
    summary: `Cita con ${nombre}`,
    description: `Correo del paciente: ${email}`,
    start: { 
        dateTime: startDateTime.toISOString(), 
        timeZone: 'America/El_Salvador' 
    },
    end: { 
        dateTime: endDateTime.toISOString(), 
        timeZone: 'America/El_Salvador' 
    },
    attendees: [
        { email: email }, // paciente
        { email: CALENDAR_ID_DOCTOR } // doctor
    ],
    reminders: {
        useDefault: true
    }
};


        const request = gapi.client.calendar.events.insert({
            calendarId: CALENDAR_ID_DOCTOR,
            resource: event,
            sendUpdates: 'all' // 👈 envía correo a todos los asistentes
        });

        request.execute(event => {
            console.log('📅 Evento creado en calendario del doctor:', event);
        });
    });

    form.reset();
});

// 📌 Función para dar formato a fechas en Google Calendar
function formatGCalDate(date){
    return date.toISOString().replace(/-|:|\.\d\d\d/g,"");
}
