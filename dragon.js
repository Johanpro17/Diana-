import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const contenedor = document.getElementById("dragon");
const lienzo = document.getElementById("dragonLienzo");
const burbuja = document.getElementById("burbujaDragon");
const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (contenedor && lienzo && burbuja) {
  iniciar(contenedor, lienzo, burbuja);
}

function iniciar(contenedor, lienzo, burbuja) {
  const BLANCO = 0xf6f2fb;
  const LUMINOSA = 0xdcd2f5;
  const DORADO = 0xffd98a;

  const renderizador = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight, false);
  lienzo.appendChild(renderizador.domElement);

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camara.position.set(0, 0.6, 6.2);
  camara.lookAt(0, 0.1, 0);

  escena.add(new THREE.AmbientLight(0xffe6f2, 1.15));

  const luzRosa = new THREE.DirectionalLight(0xff9ec4, 1.7);
  luzRosa.position.set(3, 5, 4);
  escena.add(luzRosa);

  const luzFria = new THREE.DirectionalLight(0x9c7bff, 1);
  luzFria.position.set(-4, 2, -3);
  escena.add(luzFria);

  const relleno = new THREE.PointLight(0xffd9e8, 0.8, 12);
  relleno.position.set(0, -2, 3);
  escena.add(relleno);

  const dragon = new THREE.Group();
  escena.add(dragon);

  const cuerpo = new THREE.Group();
  dragon.add(cuerpo);

  const material = (color, rugosidad = 0.55, brillo = 0.25, emision, fuerza = 0.3) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: rugosidad,
      metalness: brillo,
      emissive: emision !== undefined ? emision : 0x000000,
      emissiveIntensity: emision !== undefined ? fuerza : 0,
    });

  const escamas = material(BLANCO, 0.4, 0.3, 0xdfeaff, 0.22);
  const panza = material(LUMINOSA, 0.5, 0.3, 0xc7b6f5, 0.25);
  const cresta = material(DORADO, 0.36, 0.45, 0xffcf7a, 0.4);

  const cuerpoMalla = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), escamas);
  cuerpoMalla.scale.set(1.35, 0.95, 0.95);
  cuerpo.add(cuerpoMalla);

  const vientre = new THREE.Mesh(new THREE.SphereGeometry(0.82, 28, 20), panza);
  vientre.position.set(0.02, -0.32, 0.05);
  vientre.scale.set(1.28, 0.6, 0.92);
  cuerpo.add(vientre);

  const cabeza = new THREE.Group();
  cabeza.position.set(1.35, 0.28, 0);
  cuerpo.add(cabeza);

  const craneo = new THREE.Mesh(new THREE.SphereGeometry(0.66, 28, 22), escamas);
  craneo.scale.set(1.1, 0.92, 0.9);
  cabeza.add(craneo);

  const hocico = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), escamas);
  hocico.position.set(0.55, -0.12, 0);
  hocico.scale.set(1.15, 0.68, 0.72);
  cabeza.add(hocico);

  const narizD = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), cresta);
  narizD.position.set(0.95, -0.05, 0.13);
  cabeza.add(narizD);

  const narizI = narizD.clone();
  narizI.position.z = -0.13;
  cabeza.add(narizI);

  function crearOjo(x, z) {
    const ojo = new THREE.Group();
    ojo.position.set(x, 0.16, z);

    const esfera = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 16), material(0xfff6fb, 0.3, 0.1));
    ojo.add(esfera);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 14), material(0x8fc9ff, 0.22, 0.45));
    iris.position.set(0.1, 0.01, 0);
    ojo.add(iris);

    const pupila = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), material(0x120c16, 0.4, 0.1));
    pupila.position.set(0.15, 0.01, 0);
    ojo.add(pupila);

    const brillo = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 10), material(0xffffff, 0.2, 0));
    brillo.position.set(0.18, 0.07, 0.05);
    ojo.add(brillo);

    return ojo;
  }

  cabeza.add(crearOjo(0.3, 0.36));
  cabeza.add(crearOjo(0.3, -0.36));

  const cuernoA = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.5, 12), cresta);
  cuernoA.position.set(-0.25, 0.55, 0.22);
  cuernoA.rotation.set(-0.2, 0, 0.35);
  cabeza.add(cuernoA);

  const cuernoB = cuernoA.clone();
  cuernoB.position.z = -0.22;
  cuernoB.rotation.set(0.2, 0, 0.35);
  cabeza.add(cuernoB);

  const crestaCabeza = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 10), cresta);
  crestaCabeza.position.set(-0.18, 0.5, 0);
  crestaCabeza.rotation.z = 0.5;
  cabeza.add(crestaCabeza);

  const orejaA = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 8), panza);
  orejaA.position.set(-0.3, 0.18, 0.5);
  orejaA.rotation.set(0.1, 0, -0.9);
  cabeza.add(orejaA);

  const orejaB = orejaA.clone();
  orejaB.position.z = -0.5;
  orejaB.rotation.set(-0.1, 0, -0.9);
  cabeza.add(orejaB);

  const cola = new THREE.Group();
  cola.position.set(-1.4, 0.05, 0);
  cuerpo.add(cola);

  const segmentosCola = [
    { x: 0, r: 0.34 },
    { x: 0.5, r: 0.27 },
    { x: 0.95, r: 0.2 },
    { x: 1.32, r: 0.13 },
  ];
  segmentosCola.forEach((seg) => {
    const pieza = new THREE.Mesh(new THREE.SphereGeometry(seg.r, 20, 16), escamas);
    pieza.position.x = -seg.x;
    pieza.scale.set(1.3, 0.9, 0.9);
    cola.add(pieza);
  });

  const puntaCola = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 10), cresta);
  puntaCola.position.set(-1.62, 0, 0);
  puntaCola.rotation.z = Math.PI / 2;
  cola.add(puntaCola);

  function crearAla(lado) {
    const ala = new THREE.Group();
    ala.position.set(-0.15, 0.55, lado * 0.5);

    const forma = new THREE.Shape();
    forma.moveTo(0, 0);
    forma.quadraticCurveTo(-0.9, 0.55, -1.5, -0.1);
    forma.quadraticCurveTo(-1.4, -0.6, -0.75, -0.75);
    forma.quadraticCurveTo(-0.3, -0.95, 0.05, -0.35);
    forma.quadraticCurveTo(0.15, -0.15, 0, 0);

    const geometria = new THREE.ExtrudeGeometry(forma, { depth: 0.05, bevelEnabled: false });
    const membrana = new THREE.Mesh(geometria, new THREE.MeshStandardMaterial({
      color: 0xe9defc,
      roughness: 0.5,
      metalness: 0.18,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      emissive: 0xb9a3f0,
      emissiveIntensity: 0.35,
    }));
    ala.add(membrana);

    const hueso = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 1.05, 8), escamas);
    hueso.rotation.z = Math.PI / 2.35;
    hueso.position.set(-0.42, 0.24, 0.03);
    ala.add(hueso);

    ala.rotation.y = lado * 0.55;
    ala.scale.z = lado;
    ala.userData.lado = lado;
    return ala;
  }

  const alaA = crearAla(1);
  const alaB = crearAla(-1);
  cuerpo.add(alaA);
  cuerpo.add(alaB);

  const patas = [];
  [
    { x: 0.55, z: 0.42, lado: 1 },
    { x: 0.55, z: -0.42, lado: -1 },
    { x: -0.6, z: 0.42, lado: 1 },
    { x: -0.6, z: -0.42, lado: -1 },
  ].forEach((p) => {
    const pata = new THREE.Group();
    pata.position.set(p.x, -0.62, p.z);

    const muslo = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 14), panza);
    muslo.scale.set(1, 1.2, 1);
    pata.add(muslo);

    const cana = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.34, 10), escamas);
    cana.position.y = -0.26;
    pata.add(cana);

    const garra = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.2, 10), cresta);
    garra.position.y = -0.45;
    garra.rotation.x = Math.PI;
    pata.add(garra);

    pata.userData.fase = Math.random() * Math.PI * 2;
    cuerpo.add(pata);
    patas.push(pata);
  });

  const escamasCuerpo = [];
  for (let i = 0; i < 14; i += 1) {
    const espina = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.26, 8), cresta);
    const t = i / 13;
    espina.position.set(1.05 - t * 2.3, 0.72 - Math.sin(t * Math.PI) * 0.16, 0);
    espina.rotation.z = 0.15;
    cuerpo.add(espina);
    escamasCuerpo.push(espina);
  }

  const aliento = new THREE.PointLight(0xfff0c8, 0, 6);
  aliento.position.set(1.1, -0.05, 0);
  cabeza.add(aliento);

  const grupo = new THREE.Group();
  grupo.add(dragon);
  dragon.scale.setScalar(0.92);

  let ancho = contenedor.clientWidth;
  let alto = contenedor.clientHeight;

  function ajustar() {
    ancho = contenedor.clientWidth;
    alto = contenedor.clientHeight;
    if (!ancho || !alto) return;
    renderizador.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }

  function animar(ahora) {
    const t = ahora * 0.001;

    dragon.position.y = Math.sin(t * 1.6) * 0.12;
    dragon.rotation.z = Math.sin(t * 1.2) * 0.05;
    dragon.rotation.x = Math.sin(t * 0.9) * 0.04;

    const volar = Math.sin(t * 3.2);
    alaA.rotation.z = 0.25 + volar * 0.75;
    alaB.rotation.z = 0.25 + volar * 0.75;
    alaA.rotation.y = 0.55 - volar * 0.25;
    alaB.rotation.y = -0.55 + volar * 0.25;

    cola.rotation.y = Math.sin(t * 1.5) * 0.28;
    cola.rotation.z = Math.sin(t * 1.9) * 0.12;

    cabeza.rotation.y = Math.sin(t * 0.7) * 0.24;
    cabeza.rotation.z = Math.sin(t * 1.3) * 0.08;

    patas.forEach((pata) => {
      pata.rotation.x = Math.sin(t * 3.2 + pata.userData.fase) * 0.28;
    });

    escamasCuerpo.forEach((espina, i) => {
      espina.rotation.z = 0.15 + Math.sin(t * 2 + i * 0.4) * 0.08;
    });

    const pulso = (Math.sin(t * 2.4) + 1) / 2;
    aliento.intensity = 0.35 + pulso * 0.5;

    renderizador.render(escena, camara);
  }

  ajustar();
  window.addEventListener("resize", ajustar);
  if ("ResizeObserver" in window) {
    new ResizeObserver(ajustar).observe(contenedor);
  }

  if (reducirMovimiento) {
    luzRosa.intensity = 1.4;
    renderizador.render(escena, camara);
  } else {
    renderizador.setAnimationLoop(animar);
  }

  contenedor.classList.add("listo");
  guiar(contenedor, burbuja, reducirMovimiento);
}

function guiar(contenedor, burbuja, reducirMovimiento) {
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
      visto: false,
    }))
    .filter((g) => g.el);

  const pie = document.querySelector(".pie");
  let temporizadorBurbuja = null;
  let oculto = false;

  let x = window.innerWidth * 0.7;
  let y = window.innerHeight * 0.24;
  let objetivoX = x;
  let objetivoY = y;
  let escalaActual = 1;

  const ancho = () => contenedor.offsetWidth || 220;
  const alto = () => contenedor.offsetHeight || 220;
  const limitar = (valor, min, max) => Math.min(Math.max(valor, min), Math.max(min, max));

  function limites() {
    const margen = 12;
    const w = ancho();
    const h = alto();
    return {
      minX: margen,
      maxX: window.innerWidth - w - margen,
      minY: margen,
      maxY: window.innerHeight - h - margen,
    };
  }

  function mostrarBurbuja(globo) {
    if (!globo) return;
    const texto = globo.textos[globo.indice % globo.textos.length];
    globo.indice += 1;
    burbuja.textContent = texto;
    burbuja.classList.add("visible");
    window.clearTimeout(temporizadorBurbuja);
    temporizadorBurbuja = window.setTimeout(() => {
      if (!reducirMovimiento) burbuja.classList.remove("visible");
    }, 6500);
  }

  function ocultarBurbuja() {
    burbuja.classList.remove("visible");
    window.clearTimeout(temporizadorBurbuja);
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

    return globos
      .map((globo) => ({ globo, dist: Math.abs(globo.el.getBoundingClientRect().top - window.innerHeight / 2) }))
      .sort((a, b) => a.dist - b.dist)[0]?.globo || null;
  }

  let quiereIzquierda = false;

  function calcularObjetivo() {
    const w = ancho();
    const h = alto();
    const globo = globoVisible();
    const { minX, maxX, minY, maxY } = limites();
    const margen = 20;

    if (globo) {
      const caja = globo.el.getBoundingClientRect();
      quiereIzquierda = globo.indice % 2 === 1;

      // Lado preferido, pero sin salirse de la pantalla.
      objetivoX = quiereIzquierda
        ? caja.left - w * 0.42
        : caja.right - w * 0.58;

      const encabezado = globo.el.querySelector(".titulo, .carta__titulo") || globo.el.firstElementChild || globo.el;
      const cajaTexto = encabezado.getBoundingClientRect();
      objetivoY = cajaTexto.top - h * 0.82;
    } else {
      objetivoX = window.innerWidth - w - margen;
      objetivoY = window.innerHeight * 0.3;
    }

    objetivoX = limitar(objetivoX, minX + margen, maxX - margen);
    objetivoY = limitar(objetivoY, minY + margen, maxY - margen);
  }

  let anteriorGlobo = null;

  function alScroll() {
    const globo = globoVisible();

    if (globo !== anteriorGlobo) {
      anteriorGlobo = globo;
      if (globo && !globo.visto) {
        globo.visto = true;
      }
      if (globo) mostrarBurbuja(globo);
    }

    if (pie) {
      const caja = pie.getBoundingClientRect();
      const alFinal = caja.top < window.innerHeight * 0.85;
      if (alFinal !== oculto) {
        oculto = alFinal;
        contenedor.classList.toggle("oculto", oculto);
        contenedor.style.opacity = oculto ? "0" : "";
        if (oculto) ocultarBurbuja();
      }
    }
  }

  window.addEventListener("scroll", alScroll, { passive: true });

  let contador = 0;

  function ajustarBurbuja() {
    if (!burbuja.classList.contains("visible")) {
      burbuja.style.left = "";
      burbuja.style.right = "";
      return;
    }

    const anchoBurbuja = burbuja.offsetWidth;
    if (!anchoBurbuja) return;

    const caja = contenedor.getBoundingClientRect();
    const escala = contenedor.offsetWidth ? caja.width / contenedor.offsetWidth : 1;
    const signo = escala < 0 ? -1 : 1;
    const mag = Math.abs(escala) || 1;
    const margen = 10;

    // Posición deseada del borde izquierdo de la burbuja, en pantalla.
    const centroDragon = caja.left + caja.width / 2;
    let deseado = centroDragon - anchoBurbuja / 2;
    deseado = Math.min(Math.max(deseado, margen), window.innerWidth - anchoBurbuja - margen);

    // Convierte a coordenadas locales del contenedor (que puede estar espejado).
    let local = (deseado - caja.left) / signo;
    burbuja.style.left = `${Math.round(local)}px`;
    burbuja.style.right = "auto";
    burbuja.style.marginInlineStart = "";
  }

  function bucle() {
    calcularObjetivo();
    x += (objetivoX - x) * 0.05;
    y += (objetivoY - y) * 0.05;

    const vaIzquierda = objetivoX < x - 4;
    const escalaDeseada = vaIzquierda ? -1 : 1;
    escalaActual += (escalaDeseada - escalaActual) * 0.18;

    // Evita el fotograma "plano" cuando scaleX cruza por 0.
    if (Math.abs(escalaActual) < 0.12) escalaActual = escalaDeseada < 0 ? -0.12 : 0.12;

    contenedor.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${escalaActual.toFixed(3)})`;
    contenedor.classList.toggle("dragon--espejo", escalaActual < 0);

    ajustarBurbuja();

    contador += 1;
    if (contador % 2400 === 0) {
      const globo = globos[Math.floor(Math.random() * globos.length)];
      mostrarBurbuja(globo);
    }

    requestAnimationFrame(bucle);
  }

  const inicio = globos.find((g) => g.id === "inicio");
  if (inicio) {
    inicio.visto = true;
    mostrarBurbuja(inicio);
  }

  requestAnimationFrame(bucle);
}
