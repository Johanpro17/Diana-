const FECHA_INICIO = new Date("2026-02-14T00:00:00");

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (selector, contexto = document) => contexto.querySelector(selector);
const $$ = (selector, contexto = document) => Array.from(contexto.querySelectorAll(selector));

function actualizarContador() {
  const fecha = $("#fechaInicio");
  const diasEl = $("#dias");
  const horasEl = $("#horas");
  const minutosEl = $("#minutos");
  const segundosEl = $("#segundos");

  if (Number.isNaN(FECHA_INICIO.getTime())) {
    if (fecha) fecha.textContent = "un día muy especial";
    return;
  }

  if (fecha && !fecha.textContent) {
    fecha.textContent = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(FECHA_INICIO);
  }

  const diferencia = Math.max(0, Date.now() - FECHA_INICIO.getTime());
  const dias = Math.floor(diferencia / 86400000);
  const horas = Math.floor(diferencia / 3600000) % 24;
  const minutos = Math.floor(diferencia / 60000) % 60;
  const segundos = Math.floor(diferencia / 1000) % 60;

  diasEl.textContent = String(dias).padStart(2, "0");
  horasEl.textContent = String(horas).padStart(2, "0");
  minutosEl.textContent = String(minutos).padStart(2, "0");
  segundosEl.textContent = String(segundos).padStart(2, "0");
}

function prepararRevelado() {
  const elementos = $$(".reveal");

  if (!("IntersectionObserver" in window) || reducirMovimiento) {
    elementos.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  elementos.forEach((el) => observador.observe(el));
}

function prepararGaleria() {
  $$(".polaroid img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.remove();
      },
      { once: true }
    );
  });
}

function iniciarCorazones() {
  const lienzo = $("#corazones");
  if (!lienzo || reducirMovimiento) return;

  const ctx = lienzo.getContext("2d");
  const colores = ["#ff8fb1", "#ffc2d3", "#e8b98a", "#ff6f9c"];
  let ancho = 0;
  let alto = 0;
  let corazones = [];
  let anterior = performance.now();
  let temporizador = null;

  function crearCorazon(inicial) {
    return {
      x0: Math.random() * ancho,
      y: inicial ? Math.random() * alto : alto + 30,
      tam: 7 + Math.random() * 19,
      velocidad: 11 + Math.random() * 26,
      balanceo: 12 + Math.random() * 26,
      fase: Math.random() * Math.PI * 2,
      alfa: 0.06 + Math.random() * 0.15,
      color: colores[Math.floor(Math.random() * colores.length)],
    };
  }

  function ajustarLienzo() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    lienzo.style.width = `${ancho}px`;
    lienzo.style.height = `${alto}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cantidad = ancho < 640 ? 12 : 22;
    corazones = Array.from({ length: cantidad }, () => crearCorazon(true));
  }

  function dibujarCorazon(x, y, tam, color, alfa, giro) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(giro);
    const escala = tam / 16;
    ctx.scale(escala, escala);
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(-1, -1, -8, -2, -8, 4);
    ctx.bezierCurveTo(-8, 9, -1, 13, 0, 16);
    ctx.bezierCurveTo(1, 13, 8, 9, 8, 4);
    ctx.bezierCurveTo(8, -2, 1, -1, 0, 4);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alfa;
    ctx.fill();
    ctx.restore();
  }

  function animar(ahora) {
    const delta = Math.min((ahora - anterior) / 1000, 0.05);
    anterior = ahora;
    ctx.clearRect(0, 0, ancho, alto);

    corazones.forEach((corazon) => {
      corazon.y -= corazon.velocidad * delta;

      if (corazon.y < -40) {
        Object.assign(corazon, crearCorazon(false));
      }

      const x = corazon.x0 + Math.sin(ahora * 0.0005 + corazon.fase) * corazon.balanceo;
      const giro = Math.sin(ahora * 0.0004 + corazon.fase) * 0.22;
      dibujarCorazon(x, corazon.y, corazon.tam, corazon.color, corazon.alfa, giro);
    });

    requestAnimationFrame(animar);
  }

  ajustarLienzo();
  window.addEventListener("resize", () => {
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(ajustarLienzo, 200);
  });

  requestAnimationFrame(animar);
}

function prepararMusica() {
  const audio = $("#musica");
  const boton = $("#botonMusica");
  const texto = $("#textoMusica");
  const aviso = $("#aviso");
  if (!audio || !boton) return;

  const pistas = ["Audio/Obscuridad GH y su escuadron.mp4", "Audio/Until I Found You.mp4"];
  let pistaActual = 0;
  let temporizadorAviso = null;

  function mostrarAviso(mensaje) {
    if (!aviso) return;
    aviso.textContent = mensaje;
    aviso.classList.add("visible");
    window.clearTimeout(temporizadorAviso);
    temporizadorAviso = window.setTimeout(() => {
      aviso.classList.remove("visible");
    }, 4500);
  }

  function cargarPista(indice) {
    pistaActual = (indice + pistas.length) % pistas.length;
    audio.src = encodeURI(pistas[pistaActual]);
    audio.load();
  }

  async function reproducir() {
    try {
      await audio.play();
    } catch (error) {
      mostrarAviso("Toca de nuevo el botón para escuchar la música.");
    }
  }

  boton.addEventListener("click", () => {
    if (audio.paused) {
      reproducir();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    boton.setAttribute("aria-pressed", "true");
    boton.setAttribute("aria-label", "Pausar música");
    if (texto) texto.textContent = "Pausar música";
  });

  audio.addEventListener("pause", () => {
    boton.setAttribute("aria-pressed", "false");
    boton.setAttribute("aria-label", "Reproducir música");
    if (texto) texto.textContent = "Presiona para escuchar la música";
  });

  audio.addEventListener("ended", () => {
    cargarPista(pistaActual + 1);
    reproducir();
  });

  audio.addEventListener("error", () => {
    mostrarAviso("No encontré los audios de la carpeta Audio.");
  });

  cargarPista(0);
}

function prepararModal() {
  const modal = $("#modal");
  const abrir = $("#abrirRegalo");
  const cerrar = $("#cerrarModal");
  if (!modal || !abrir || !cerrar) return;

  let ultimoFoco = null;

  const svgCorazon =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28S3 19.5 3 10.8C3 6.6 6.2 3.5 10.3 3.5c2.5 0 4.6 1.2 5.7 3 1.1-1.8 3.2-3 5.7-3C25.8 3.5 29 6.6 29 10.8 29 19.5 16 28 16 28z"/></svg>';

  function estallido() {
    if (reducirMovimiento) return;

    const capa = document.createElement("div");
    capa.className = "estallido";
    const colores = ["#ff8fb1", "#ffc2d3", "#e8b98a", "#ff6f9c", "#fff1e8"];
    const cantidad = window.innerWidth < 640 ? 18 : 28;

    for (let i = 0; i < cantidad; i += 1) {
      const corazon = document.createElement("span");
      const tamano = 12 + Math.random() * 22;
      const angulo = Math.random() * Math.PI * 2;
      const distancia = 90 + Math.random() * 320;
      const dx = Math.cos(angulo) * distancia;
      const dy = Math.sin(angulo) * distancia * 0.7 - 120;

      corazon.innerHTML = svgCorazon;
      corazon.style.width = `${tamano}px`;
      corazon.style.height = `${tamano}px`;
      corazon.style.setProperty("--dx", `${dx}px`);
      corazon.style.setProperty("--dy", `${dy}px`);
      corazon.style.setProperty("--giro", `${-90 + Math.random() * 180}deg`);
      corazon.style.setProperty("--escala", (0.7 + Math.random() * 0.7).toFixed(2));
      corazon.style.setProperty("--retraso", `${(Math.random() * 0.22).toFixed(2)}s`);
      corazon.style.setProperty("--color", colores[Math.floor(Math.random() * colores.length)]);
      capa.appendChild(corazon);
    }

    document.body.appendChild(capa);
    window.setTimeout(() => capa.remove(), 1900);
  }

  function abrirModal() {
    ultimoFoco = document.activeElement;
    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("sin-scroll");
    window.setTimeout(() => cerrar.focus(), 60);
    estallido();
  }

  function cerrarModal() {
    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco) ultimoFoco.focus();
  }

  abrir.addEventListener("click", abrirModal);
  cerrar.addEventListener("click", cerrarModal);

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) cerrarModal();
  });

  document.addEventListener("keydown", (evento) => {
    if (!modal.classList.contains("abierto")) return;

    if (evento.key === "Escape") {
      cerrarModal();
    }

    if (evento.key === "Tab") {
      evento.preventDefault();
      cerrar.focus();
    }
  });
}

function prepararAnio() {
  const anio = $("#anio");
  if (anio) anio.textContent = new Date().getFullYear();
}

actualizarContador();
window.setInterval(actualizarContador, 1000);

prepararRevelado();
prepararGaleria();
iniciarCorazones();
prepararMusica();
prepararModal();
prepararAnio();
