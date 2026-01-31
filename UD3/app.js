// =====================================================================================================================
// ===================================================== ROUTING =======================================================
// =====================================================================================================================

const render = (content) => {
  const main = document.getElementById("page-renderer");

  // Limpiamos el main
  main.innerHTML = "";

  if (main) {
    if (typeof content === "string") {
      main.innerHTML = content;
    } else {
      main.appendChild(content);
    }
  }
}

// Función para limpiar las clases de los links
const clearLinkClasses = () => {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  })
}

const navigateTo = (key) => {
  const contentGenerator = pages[key];
    // Limpiamos las clases de todos los links y dejamos activo el que se ha hecho click
    clearLinkClasses();
    document.getElementById(`nav-${key}`).classList.add("active")

    // Renderizamos si el generador existe
    if (contentGenerator) {
      render(contentGenerator());
    }
}

// Extraemos la funcion de la página a renderizar
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navigateTo(link.getAttribute("page-key"));
  })
});

// =====================================================================================================================
// ===================================================== HELPERS =======================================================
// =====================================================================================================================

// Función para crear elementos del DOM
const createDOMElement = ({tag, classes = [], text = '', ...attributes}) => {
  const element = document.createElement(tag);

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  if (text) {
    element.textContent = text;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === true) {
      element.setAttribute(key, '');
    } else if (value !== false && value !== null) {
      element.setAttribute(key, value);
    }
  });

  return element;
}

// Datos para el calendario
let currentCalendarDate = new Date();

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Datos para las habitaciones
const ROOMS = {
  standard: "Habitación Estándar",
  superior: "Habitación Superior",
  suite: "Suite Premium"
};

// Función para mostrar modales
const showModal = ({ title, message, type = "alert", onConfirm }) => {
  // Creamos el overlay
  const overlay = createDOMElement({ tag: 'div', classes: ['modal-overlay']});

  // Creamos la caja del modal
  const box = createDOMElement({ tag: "div", classes: ['modal-box']});

  // Título y mensaje
  box.appendChild(createDOMElement({tag: "h3", text: title}));
  box.appendChild(createDOMElement({tag: "p", text: message}));

  // Botonera
  const actions = createDOMElement({ tag: "div", classes: ["modal-actions"]});
  // Boton cancelar (solo si es caso "confirm")
  if (type === "confirm") {
    const btnCancel = createDOMElement({
      tag: "button",
      classes: ["btn-secondary"],
      text: "Cancelar"
    });

    btnCancel.addEventListener("click", () => { // Añadimos el evento
      closeModal(overlay);
    });

    actions.appendChild(btnCancel);
  }

  // Boton de Aceptar (siempre)
  const btnOk = createDOMElement({
    tag: "button",
    classes: ["btn-primary"],
    text: "Aceptar"
  });
  
  btnOk.addEventListener("click", () => { // Añadimos el evento
    // Si hay una función de confirmación => la ejecutamos
    if (onConfirm) onConfirm();
    closeModal(overlay);
  });

  // Anidamos nieto => padre => abuelo
  actions.appendChild(btnOk);
  box.appendChild(actions);
  overlay.appendChild(box);

  // Insertamos el modal en el body
  document.body.appendChild(overlay);
}

// Función para cerrar el modal
const closeModal = (modalElement) => {
  modalElement.remove();
}

// Gestión del almacenamiento
const Storage = {
  getBookings: () => JSON.parse(localStorage.getItem("bookings")) || [],
  saveBooking: () => (booking) => {
    const bookings = Storage.getBookings();
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }
}

// Validador de disponibilidad
const checkAvailability = (newStart, newEnd, roomType) => {
  const bookings = Storage.getBookings();

  // .some() devuelve true si encuentra al menos un confilcto
  return bookings.some(booking => {
    if (booking.room !== roomType) return false;

    const existingStart = new Date(booking.dateIn);
    existingStart.setHours(0, 0, 0, 0);
    const existingEnd = new Date(booking.dateOut);
    existingEnd.setHours(0, 0, 0, 0);
    
    const start = new Date(newStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(newEnd);
    end.setHours(0, 0, 0, 0);

    // Para que no haya colisiones de las fechas tiene que ocurrir:
    // Fecha nueva entrada < fecha vieja salida Y fecha nueva salida > fecha vieja entrada
    return start < existingEnd && end > existingStart;
  })
}

// =====================================================================================================================
// ===================================================== PAGES LOGIC ===================================================
// =====================================================================================================================

const pages = {
  // =================================================== HOME ==========================================================
  home: () => {
    // Contenedor principal
    const content = createDOMElement({
      tag: "section",
      classes: ["page-section"],
      id: "home"});

    const wrapper = createDOMElement({
      tag: "div",
      classes: ["hero-content"]
    });

    // Wrapper
    wrapper.appendChild(
      createDOMElement({
        tag: "h1", 
        text:"Bienvenido a tu descanso ideal"
      })
    );
    wrapper.appendChild(
      createDOMElement({
        tag: "p",
        text: "Descubre nuestras habitaciones exclusivas y desconecta de tu mundo."
      })
    )
    const bookingButton = createDOMElement({
        tag: "button",
        classes: ["btn-hero"],
        id: "btn-start-booking",
        text: "Hacer una reserva"
      });
    bookingButton.addEventListener("click", (e) => { // Añadimos el evento del click
      e.preventDefault();
      navigateTo("booking");  
    })
    wrapper.appendChild(bookingButton);
    
    // Añadimos todo al contenedor principal
    content.appendChild(wrapper);

    return content;
  },

  // =================================================== BOOKING =======================================================
  booking: () => {
    // Contenedor principal
    const content = createDOMElement({
      tag: "section",
      classes: ["page-section"],
      id: "booking"
    });

    // Título
    content.appendChild(
      createDOMElement({
        tag: "h2",
        text: "Nueva Reserva"
      })
    );

    // Formulario
    const formWrapper = createDOMElement({
      tag: "form",
      id: "booking-form"
    });

    // Campo nombre
    const groupName = createDOMElement({ tag: "div", classes: ["form-group"]});
    
    groupName.appendChild(createDOMElement({ tag: "label", text: "Nombre completo:", for: "name" }));
    
    const inputName = createDOMElement({ 
      tag: "input",
      id: "name",
      classes: ["form-input"],
      type: "text",
      placeholder: "Ej. Ana García",
      required: true
    });

    groupName.appendChild(inputName);
    formWrapper.appendChild(groupName);

    // Campo selección de habitación
    const groupRoom = createDOMElement({ tag: "div", classes: ["form-group"]});

    groupRoom.appendChild(createDOMElement({ tag: "label", text: "Tipo de habitación:", for: "room"}));

    const inputRoom = createDOMElement({ tag: "select", classes: ["form-input"], id: "room"});
    const inputRoomOptions = [
      createDOMElement({ tag: "option", value: "", text: "Selecciona una opción", selected: true, disabled: true}),
      createDOMElement({ tag: "option", text: "Suite Premium", value:"suite"}),
      createDOMElement({ tag: "option", text: "Habitación Superior", value:"superior"}),
      createDOMElement({ tag: "option", text: "Habitación Estándar", value:"standard"}),
    ];
    inputRoomOptions.forEach(room => { inputRoom.appendChild(room) }); // Añadimos las habitaciones al select

    groupRoom.appendChild(inputRoom);
    formWrapper.appendChild(groupRoom);

    // Campo fecha de entrada
    const groupDateIn = createDOMElement({ tag: "div", classes: ["form-group"] });
    
    groupDateIn.appendChild(createDOMElement({ tag: "label", text: "Fecha de llegada:", for: "check-in" }));
    
    const inputDateIn = createDOMElement({ 
      tag: "input",
      id: "check-in",
      classes: ["form-input"],
      type: "date",
      required: true
    });

    groupDateIn.appendChild(inputDateIn);
    formWrapper.appendChild(groupDateIn);

    // Campo fecha de salida
    const groupDateOut = createDOMElement({ tag: "div", classes: ["form-group"] });
    
    groupDateOut.appendChild(createDOMElement({ tag: "label", text: "Fecha de salida:", for: "check-out" }));
    
    const inputDateOut = createDOMElement({
      tag: "input",
      id: "check-out",
      classes: ["form-input"],
      type: "date",
      required: true
    });

    groupDateOut.appendChild(inputDateOut);
    formWrapper.appendChild(groupDateOut);

    // Botón de submit
    const submitBtn = createDOMElement({
      tag: "button",
      classes: ["btn-primary"],
      text: "Confirmar Reserva",
      type: "submit"
    });

    formWrapper.appendChild(submitBtn);

    // Handler del submit del formulario
    formWrapper.addEventListener("submit", (e) => {
      // Evitar que se recargue la página
      e.preventDefault();

      // Extraemos los valores de los input
      const name = inputName.value;
      const room = inputRoom.value;
      const dateCheckIn = inputDateIn.value;
      const dateCheckOut = inputDateOut.value;

      // Validación y transformación a objetos nativos
      const dateIn = new Date(dateCheckIn);
      const dateOut = new Date(dateCheckOut);

      // Normalizamos las fechas
      dateIn.setHours(0,0,0,0);
      dateOut.setHours(0,0,0,0);

      if (dateIn >= dateOut) {
        showModal({
          title: "Fechas Incorrectas",
          message: "La fecha de salida debe ser posterior a la entrada.",
          type: "alert"
        });
        return; // Salimos de la función
      }

      // Objeto para almacenar los datos
      const newBooking = {
        id: Date.now(),
        name,
        room,
        dateIn,
        dateOut
      }

      // Persistir en local storage
      // Obtenemos lo que ya teníamos en el localstorage o un array vacio
      const savedBooking = JSON.parse(localStorage.getItem("bookings")) || [];

      // Validación de que la habitación no esté ocupada
      const collision = savedBooking.some(booking => {

        if (booking.room !== newBooking.room) return false;

        // Extraemos las fechas
        const bookingDateIn = new Date(booking.dateIn);
        const bookingDateOut = new Date(booking.dateOut);
        // Normalizamos fechas
        bookingDateIn.setHours(0,0,0,0);
        bookingDateOut.setHours(0,0,0,0);

        // Para que no haya colisiones de las fechas tiene que ocurrir:
        // Fecha nueva entrada < fecha vieja salida Y fecha nueva salida > fecha vieja entrada
        return newBooking.dateIn < bookingDateOut && newBooking.dateOut > bookingDateIn;
      })

      // Si no hay colisión entre las fechas se puede reservar
      if (!collision) {
        // Pedimos confirmación con el modal
        showModal({
          title: "Confirmar reserva",
          message: `¿Estás segura/o/e reservar la habitación ${ROOMS[newBooking.room]} desde el día ${newBooking.dateIn.toLocaleDateString("es-ES")} hasta el día ${newBooking.dateOut.toLocaleDateString("es-ES")}?`,
          type: "confirm",
          onConfirm: () => {
            savedBooking.push(newBooking);
      
            localStorage.setItem('bookings', JSON.stringify(savedBooking));
      
            // Logs para la consola
            console.log("Reserva guardada:", newBooking);
            showModal({
              title: "Reserva confirmada",
              message: `Reserva para ${name} confirmada. Habitación ${ROOMS[newBooking.room]} desde el día ${newBooking.dateIn.toLocaleDateString("es-ES")} hasta el día ${newBooking.dateOut.toLocaleDateString("es-ES")}`,
              type: "alert"
            })
      
            // Limpiamos los campos del formulario
            formWrapper.reset();
          }
        })
      } else {
        // Limpiamos los campos de las fechas y el de la habitación
        inputDateIn.value = "";
        inputDateOut.value = "";
        inputRoom.value = "";

        // Informamos de la colisión
        showModal({
          title: "Reserva confirmada",
          message: "La habitación seleccionada no está disponible en las fechas seleccionadas.",
          type: "alert"
        })
      }

    })

    // Añadimos el formulario al contenedor principal
    content.appendChild(formWrapper);

    return content;
  },

  // =================================================== CALENDAR ======================================================
  calendar: () => {
    const content = createDOMElement({
      tag: "section",
      classes: ["page-section", "calendar-view"],
      id: "calendar"
    });

    // Titulo y botones (cabecera)
    const header = createDOMElement({ tag: "div", classes: ["calendar-header"] })

    const btnPrev = createDOMElement({ tag: "button", classes: ["btn-nav", "prev"], text: "⬅"});
    const title = createDOMElement({ tag: "h2", text: "Cargando..."}); // Cambiará dinámicamente
    const btnNext = createDOMElement({ tag: "button", classes: ["btn-nav", "next"], text: "⮕"});

    // Añado todo al header y el header al content
    header.appendChild(btnPrev);
    header.appendChild(title);
    header.appendChild(btnNext);
    content.appendChild(header);

    // Cuadrícula de días (LUN-DOM)
    const gridContainer = createDOMElement({ tag: "div", classes: ["calendar-grid"] });

    // Dibujamos las filas
    weekDays.forEach(day => {
      gridContainer.appendChild(createDOMElement({
        tag: "div",
        classes: ["day-name"],
        text: day
      }))
    });

    // Contenedor para los números de día
    const daysContainer = createDOMElement({ tag: "div", classes: ["days-container"] });
    gridContainer.appendChild(daysContainer);
    content.appendChild(gridContainer);

    // Función de renderizado
    const renderDays = (date) => {
      daysContainer.innerHTML = ""; // Limpiamos días anteriores

      const year = date.getFullYear();
      const month = date.getMonth(); // 0 = Enero, 1 = Febrero...

      // Leemos las reservas del localstorage
      const bookings = Storage.getBookings();

      // Actualizamos texto
      title.textContent = `${monthNames[month]} ${year}`;

      // Obtener el primer día de la semana del mes 
      // Ajustamos porque getDay() devuelve 0 para domingo y así
      let firstDayIndex = new Date(year, month, 1).getDay();
      firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
      // Obtenemos número de días en el mes
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // día 0 del siguiente mes = ultimo dia de este mes

      // Obtenemos el día actual para marcarlo
      const today = new Date();
      const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

      // Celdas vacías antes del día 1
      for (let i = 0; i < firstDayIndex; i++) {
        daysContainer.appendChild(createDOMElement({ tag: "div", classes: ["empty-day"]}))
      }

      // Todos los días del mes
      for (let i = 1; i <= daysInMonth; i++) {
        // Creamos la fecha exacta de esta celda
        const cellDate = new Date(year, month, i);
        cellDate.setHours(0, 0, 0, 0); // Normalizamos a media noche

        // Buscamos si hay alguna reserva activa para este día
        const foundBooking = bookings.filter(booking => {
          // Convertimos el JSON de localStorage a fechas reales
          const dateIn = new Date(booking.dateIn);
          dateIn.setHours(0, 0, 0, 0);
          
          const dateOut = new Date(booking.dateOut);
          dateOut.setHours(0, 0, 0, 0);

          // Lógica: la fecha actual debe estar entre la de entrada y la de salida
          // >= entrada y < salida
          return cellDate >= dateIn && cellDate < dateOut;
        })

        const dayClasses = ["day-cell"];

        // Si es hoy añadimos otra clase
        if (isCurrentMonth && i === today.getDate()) {
          dayClasses.push("today");
        }

        const dayElement = createDOMElement({ tag: "div", classes: dayClasses});
        // Anidamos un span para el número de días
        dayElement.appendChild(createDOMElement({ tag: "span", classes: ["day-number"], text: i.toString()}));
        // Anidamos el contenedor para los dots que indicaran si está reservado ese día
        const dotsContainer = createDOMElement({ tag: "div", classes: ["dots-container"] });

        // Si encontramos reserva para este día, añadimos marcado para la casilla
        if (foundBooking.length > 0) {
          foundBooking.forEach(booking => {
            // Creamos un punto por reserva que encontremos
            dotsContainer.appendChild(createDOMElement({
              tag: "span",
              classes: ["booking-dot", `dot-${booking.room}`],
              title: `${ROOMS[booking.room]} - ${booking.name}`
            }));
          })
        }
        dayElement.appendChild(dotsContainer);

        // Evento de click para cada día
        dayElement.addEventListener("click", (e) => {
          if (foundBooking.length > 0) {
            const listItems = foundBooking.map(b => 
              // creamos un mensaje para el modal de informacion
              `• <b>${ROOMS[b.room]}</b>: ${b.name} <br><small>(Hasta: ${new Date(b.dateOut).toLocaleDateString()})</small>`
            ).join("<br><br>");

            showModal({
              title: `Reservas del ${i} de ${monthNames[month]}`,
              message: "Detalles:",
              type: "alert"
            })

            // Como showModal() no acepta HTML directamente, lo inyectamos a posteriori
            const modalP = document.querySelector(".modal-box p");
            if(modalP) modalP.innerHTML = listItems;
          } else {
            // Permitir ir a reservas desde aqui
            showModal({
              title: "Día Libre",
              message: "¿Quieres hacer una reserva para este día?",
              type: "confirm",
              onConfirm: () => navigateTo("booking")
            })
          }
        });

        // Añadimos el día al contenedor de días
        daysContainer.appendChild(dayElement);
      }
    };

    // Eventos de los botones
    btnPrev.addEventListener("click", () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      // Volvemos a pintar el mes entero
      renderDays(currentCalendarDate);
    });

    btnNext.addEventListener("click", () => {
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      // Volvemos a pintar el mes entero
      renderDays(currentCalendarDate);
    });

    // Renderizado inicial
    renderDays(currentCalendarDate);

    // Devolvemos el contenido de la página
    return content;
  }
};

// Evento de click para el logo
document.getElementById("logo").addEventListener("click", (e) => {
  navigateTo("home");
});

// Año del footer
document.getElementById("year").textContent = new Date().getFullYear();

// Renderizado inicial de la página
navigateTo("home");