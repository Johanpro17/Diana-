(function () {
  const contenedor = document.getElementById("dragon");
  const burbuja = document.getElementById("burbujaDragon");

  if (!contenedor || !burbuja) return;

  const mensajes = [
    { id: "inicio", textos: ["¡Hola, Diana! Soy Furia Luminosa 🤍✨", "Bienvenida a tu rinconcito de amor 💜"] },
    { id: "tiempo", textos: ["Cada segundo con Johan vale oro ✨", "¡Wow, mira cuánto tiempo juntos!"] },
    { id: "razones", textos: ["¿Ves? Johan te ama muchísimo 🥰", "Eres una chica muy afortunada 💗"] },
    { id: "momentos", textos: ["Como Chimuelo y Furia Luminosa: hechos el uno para el otro 💫", "Se ven lindos juntos, ¿verdad?"] },
    { id: "carta", textos: ["Lee despacito, es de corazón 💌", "Johan escribió esto pensando en ti ✍️"] },
    { id: "sorpresa", textos: ["¡Toca el corazón! Hay un secreto 🎁", "Casi terminamos... falta lo mejor 💖"] },
  ];

  const globos = mensajes
    .map((m) => ({
      id: m.id,
      el: document.getElementById(m.id),
      textos: m.textos,
      indice: 0,
    }))
    .filter((g) => g.el);

  let temporizador = null;

  function mostrarBurbuja(globo) {
    if (!globo) return;
    const texto = globo.textos[globo.indice % globo.textos.length];
    globo.indice += 1;
    burbuja.textContent = texto;
    burbuja.classList.add("visible");
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => {
      burbuja.classList.remove("visible");
    }, 6500);
  }

  function globoVisible() {
    let mejor = null;
    let mejorDist = Infinity;

    globos.forEach((globo) => {
      const caja = globo.el.getBoundingClientRect();
      if (caja.bottom < 100 || caja.top > window.innerHeight - 100) return;
      const dist = Math.abs(caja.top + caja.height / 2 - window.innerHeight / 2);
      if (dist < mejorDist) {
        mejorDist = dist;
        mejor = globo;
      }
    });

    if (mejor) return mejor;

    return (
      globos
        .map((globo) => ({ globo, dist: Math.abs(globo.el.getBoundingClientRect().top - window.innerHeight / 2) }))
        .sort((a, b) => a.dist - b.dist)[0]?.globo || null
    );
  }

  let anteriorGlobo = null;

  function alScroll() {
    const globo = globoVisible();
    if (globo !== anteriorGlobo) {
      anteriorGlobo = globo;
      mostrarBurbuja(globo);
    }
  }

  window.addEventListener("scroll", alScroll, { passive: true });

  contenedor.addEventListener("click", () => {
    mostrarBurbuja(globoVisible() || globos[0]);
  });

  contenedor.classList.add("listo");
  mostrarBurbuja(globos.find((g) => g.id === "inicio") || globos[0]);
})();
