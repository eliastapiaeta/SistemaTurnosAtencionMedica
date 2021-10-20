"use strict"

document.addEventListener('DOMContentLoaded', function () {

    const horarioDesde = (idMedico) => {
        const xhttp = new XMLHttpRequest();
        var horariodesde = "";
        try {
            xhttp.onload = function () {
                horariodesde = this.responseText;
            }
            xhttp.open("GET", "Medico/TraerHorarioAtencionDesde?idMedico=" + idMedico, false);
            xhttp.send();
        }
        catch (exception_var) {
            alert("Error al traer el horario de atención desde \n", exception_var);
        }
        return horariodesde;
    }
    const horarioHasta = (idMedico) => {
        const xhttp = new XMLHttpRequest();
        var horariohasta = "";
        try {
            xhttp.onload = function () {
                horariohasta = this.responseText;
            }
            xhttp.open("GET",
                "Medico/TraerHorarioAtencionHasta?idMedico=" + idMedico,
                false);
            xhttp.send();
        }
        catch (exception_var) {
            alert("Error al traer el horario de atención hasta \n", exception_var);
        }
        return horariohasta;
    }

    const AbrirPopup = (turnoSeleccionado) => {
        const txtFechaHoraInicio = document.getElementById('txtFechaHoraInicio');
        txtFechaHoraInicio.value = turnoSeleccionado.start.toLocaleString();
        // txtFechaHoraInicio.value = turnoSeleccionado.start.toLocaleString('en-GB');

        const txtFechaHoraFin = document.getElementById('txtFechaHoraFin');
        txtFechaHoraFin.value = turnoSeleccionado.end.toLocaleString();
        // txtFechaHoraFin.value = turnoSeleccionado.end.toLocaleString('en-GB');


        const props_idTurno = (turnoSeleccionado.extendedProps === undefined) ?
            turnoSeleccionado.idTurno :
            turnoSeleccionado.extendedProps.idTurno;

        const idTurno = document.getElementById('id_turno');
        idTurno.setAttribute("value_id", props_idTurno);

        if (turnoSeleccionado.idTurno === 0) {
            const btnGuardar = document.getElementById('btnGuardar');
            btnGuardar.style.display = 'inline-block';

            const btnEliminar = document.getElementById('btnEliminar');
            btnEliminar.style.display = 'none';

            // Aquí he de agregar el nombre del Paciente al modal
            const IdPaciente = document.getElementById("IdPaciente");
            const txtPaciente = document.getElementById('txtPaciente');
            txtPaciente.value = IdPaciente.options[IdPaciente.selectedIndex].text;

        } else {
            const btnGuardar = document.getElementById('btnGuardar');
            btnGuardar.style.display = 'none';

            const btnEliminar = document.getElementById('btnEliminar');
            btnEliminar.style.display = 'inline-block';

            // Aquí he de agregar el nombre del Paciente al modal
            const txtPaciente = document.getElementById('txtPaciente');
            txtPaciente.value = (turnoSeleccionado.extendedProps.paciente).replace(/,\s*$/, "");
        }

        document.getElementById('id_modalTurno').click();

        // console.log(temFecha.toLocaleString('en-GB', { timeZone: 'UTC' }));
        // console.log(turnoSeleccionado.start.start.format('DD/MM/YYYY HH:mm'));
    }

    const calcularPosicionTooltip = (tooltip, evento) => {
        // Calculamos las coordenadas del info.
        const anchoTooltip = tooltip.clientWidth;
        const altoTooltip = tooltip.clientHeight;
        const windowInnerWidth = window.innerWidth;

        const CalendarioTurnos = document.querySelector('#CalendarioTurnos');
        const calendarioX = CalendarioTurnos.getBoundingClientRect().x;
        const calendarioRight = CalendarioTurnos.getBoundingClientRect().right;
        const calendarioY = CalendarioTurnos.getBoundingClientRect().y;

        // const iz = (window.innerWidth - (window.innerWidth - evento.x) - CalendarioTurnos.getBoundingClientRect().x - 100 + anchoTooltip) > window.innerWidth ?
        //     'ANCHO' :
        //     evento.x - anchoTooltip < 0 ?
        //         'BIEN AL PRINCIPIO' : 'BIEN'
        // console.log(iz);

        const izquierda = (windowInnerWidth - (windowInnerWidth - evento.x) - calendarioX - 100 + anchoTooltip) > windowInnerWidth ?
            calendarioRight - calendarioX - anchoTooltip + 25 :   // ANCHO
            evento.x - anchoTooltip < 0 ? // BIEN
                10 :
                windowInnerWidth - (windowInnerWidth - evento.x) - calendarioX - (anchoTooltip / 2) - 40;

        const top = (evento.y - calendarioY - altoTooltip - 40);

        const positionTooltip = {
            izquierda: izquierda,
            top: top,
            anchoTooltip: anchoTooltip,
            altoTooltip: altoTooltip
        }

        return positionTooltip;
    }

    const tootip = (evento, action) => {

        // console.log(evento);

        const tooltip = document.querySelector('#tooltip');
        const positionTooltip = calcularPosicionTooltip(tooltip, evento);
        tooltip.style.left = `${positionTooltip.izquierda}px`;
        tooltip.style.top = `${positionTooltip.top}px`;


        if (action === 'mouseenter') {

            setTimeout(() => {
                // const miniTooltip = document.querySelector('#miniTooltip');
                // miniTooltip.style.left = `${positionTooltip.izquierda + (positionTooltip.anchoTooltip) - 60}px`;
                // miniTooltip.style.top = `${positionTooltip.top + (positionTooltip.altoTooltip / 2) + 300}px`;

                tooltip.classList.add('activo');
                // miniTooltip.classList.replace('miniTooltip_inactivo', 'miniTooltip_activo');
            }, 300);
            console.log('------mousenter');
        }

        if (action === 'mouseleave') {

            tooltip.classList.remove('activo');
            // setTimeout(() => {
            //     miniTooltip.classList.replace('miniTooltip_activo', 'miniTooltip_inactivo');
            // }, 5500);
            console.log('------mouseleave');
        }

    }

    const RenderizarCalendario = (horarioDesde, horarioHasta, idMedico, turnos) => {

        let calendarEl = document.getElementById('CalendarioTurnos');
        let calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            contentHeight: 'auto',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            slotDuration: '00:30',
            nowIndicator: true,
            allDaySlot: false,
            selectable: true,
            slotMinTime: horarioDesde(idMedico),
            slotMaxTime: horarioHasta(idMedico),
            events: turnos,
            eventColor: 'green',
            editable: true,
            dayMaxEvents: true,
            eventMouseLeave: function (info) {
                info.jsEvent.preventDefault(); // don't let the browser navigate

                tootip(info.jsEvent, 'mouseleave');
            },
            eventMouseEnter: function (info) {
                info.jsEvent.preventDefault(); // don't let the browser navigate
                console.log(info);
                tootip(info.jsEvent, 'mouseenter');
            },
            select: function (event) {
                const turnoSeleccionado = {
                    idTurno: 0,
                    start: event.start,
                    end: event.end
                };
                AbrirPopup(turnoSeleccionado);
            },
            eventClick: function (turnoClickeado) {
                turnoClickeado.jsEvent.preventDefault(); // don't let the browser navigate

                const turnoSeleccionado = turnoClickeado.event;
                AbrirPopup(turnoSeleccionado);
            }
        });
        calendar.render();
    }

    const GuardarTurno = () => {
        const [turno,] = CaptarTurnoFromModal();

        try {
            $.ajax({
                type: "POST",
                url: 'Turno/GrabarTurno',
                data: { 'turno': turno },
                headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"').val() },
                success: (e) => {
                    if (e.ok) {
                        ObtenerTurnosYActualizar(turno['IdMedico']);
                        GenerarCalendario(turno['IdMedico']);
                    }
                },
                error: () => {
                    alert("Error al grabar turno")
                }
            });

        } catch (error) {
            console.log(error);
            alert('Error al grabar turno');
        }
    }

    const CaptarTurnoFromModal = () => {
        const turno = {
            IdPaciente: parseInt(document.getElementById("IdPaciente").value, 10),
            IdMedico: parseInt(document.getElementById("IdMedico").value, 10),
            FechaHoraInicio: document.getElementById("txtFechaHoraInicio").value,
            FechaHoraFin: document.getElementById("txtFechaHoraFin").value,
        }
        const idTurno = parseInt(document.getElementById("id_turno").getAttribute("value_id"), 10);

        const turnoFromModal = [turno, idTurno];

        return turnoFromModal;
    }
    const btnGuardar = document.getElementById("btnGuardar"); // Encuentra el elemento "btnGuardar" en el sitio
    btnGuardar.onclick = GuardarTurno; // Agrega función onclick al elemento


    const eliminarTurno = () => {
        const [turno, idTurno] = CaptarTurnoFromModal();

        if (confirm('¿Está seguro de eliminar el turno?')) {
            $.ajax({
                type: "POST",
                url: 'Turno/EliminarTurno',
                data: { 'IdTurno': idTurno },
                headers: { 'RequestVerificationToken': $('input[name="__RequestVerificationToken"').val() },
                success: function (e) {
                    e.ok && ObtenerTurnosYActualizar(turno['IdMedico']);
                    GenerarCalendario(turno['IdMedico']);
                },
                error: function () {
                    alert('Error al eliminar el turno');
                }
            });
        }
    }
    const btnEliminar = document.getElementById("btnEliminar");
    btnEliminar.onclick = eliminarTurno; // Agrega función onclick al elemento


    const ObtenerTurnosYActualizar = (idMedico) => {
        let turnos = [];
        const xhttp = new XMLHttpRequest();
        try {
            xhttp.onload = function () {
                const jsonValue = JSON.parse(xhttp.response);
                jsonValue.forEach((datos) => {
                    //poner las iniciales en minúsculas.
                    // console.log(datos);
                    turnos.push({
                        idTurno: datos.idTurno,
                        idPaciente: datos.idPaciente,
                        idMedico: datos.idMedico,
                        start: datos.fechaHoraInicio, //moment(datos.fechaHoraInicio),
                        end: datos.fechaHoraFin, //datos.fechaHoraFin != null ? moment(datos.fechaHoraFin) : null,
                        title: datos.titulo,
                        paciente: datos.paciente,
                        // display: 'background',
                        color: 'purple',
                        borderColor: '#0000b6',
                        // backgroundColor: '#05416F',
                        // textColor: '#1D1F2F'
                    });
                });
            }
            xhttp.open("GET",
                "Turno/ObtenerTurnos?idMedico=" + idMedico,
                false);
            xhttp.send();
        }
        catch (exception_var) {
            alert("Error al traer al obtener turnos \n", exception_var);
        }

        return turnos;
    }

    const GenerarCalendario = (idMedico) => {
        const turnos = ObtenerTurnosYActualizar(idMedico);

        console.log(turnos);

        RenderizarCalendario(horarioDesde, horarioHasta, idMedico, turnos);
    }

    // triggers
    const idMedico_cmbx = document.getElementById('IdMedico');
    GenerarCalendario(idMedico_cmbx.firstChild.value);      // Al cargar la página, se obtiene el calendario

    idMedico_cmbx.addEventListener('change', (event) => {
        event.preventDefault();

        GenerarCalendario(event.target.value);
    });

    /////////obtener valor antiguo y el nuevo al cambiar el elemento /////////////
    // const idMedico_cmbx = document.getElementById('IdMedico');
    // idMedico_cmbx.setAttribute("oldvalue", idMedico_cmbx.firstChild.value);

    // idMedico_cmbx.addEventListener('change', (event) => {
    //     event.preventDefault();

    //     const oldValue = event.target.oldvalue !== undefined && event.target.oldvalue;
    //     const newValue = event.target.value;

    //     console.log(oldValue, newValue);

    //     event.target.oldvalue = event.target.value;

    //     GenerarCalendario(newValue);
    // });


    /*
        // const getHorario = (value) => {
        //     const xhttp = new XMLHttpRequest();
        //     var horario = "";
    
        //     try {
        //         xhttp.onload = function () {
        //             horario = this.responseText;
        //         }
        //         xhttp.open("GET",
        //             "Medico/TraerHorarioAtencion" + value + "?idMedico=" + idMedico,
        //             false);
        //         xhttp.send();
        //     }
        //     catch (exception_var) {
        //         alert("Error al traer el horario de atención " + value + " \n", exception_var);
        //     }
        //     return horario;
        // }
        */
});