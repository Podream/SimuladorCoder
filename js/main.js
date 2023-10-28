let nombre = "";
let curar = 0;
let victorias = 0;
let derrotas = 0;
let pocionesUsadas = 0;
let peleaContinua = true;

let dataEnemigos = [];
let dataJefes = [];
let dataHeroes = [];
const enemigos = [];
let heroes = {};
let heroeOriginal = {};

const btnInicio = document.querySelector(".btnInicio");
const input = document.querySelector("input");
const mostrarInicio = document.querySelector("#mostrarInicio");
const mostrarJuego = document.querySelector("#mostrarJuego");
let vidaHeroe = document.querySelector("#vidaHeroe");
let vidaEnemigo = document.querySelector("#vidaEnemigo");
const imagen = document.querySelector("#imagen");
const divBtn = document.querySelector("#botones");
const divReiniciar = document.querySelector("#divReiniciar");
const btnReiniciar = document.querySelector("#btnReiniciar");
const seleccion = document.querySelector(".seleccion");
const contenedorFlex = document.querySelector(".contenedor-flex");

async function cargarDatos() {
  try {
    const resHeroes = await fetch(
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/Utils/heroes.json"
    );
    const dataH = await resHeroes.json();
    dataHeroes = dataH;

    const resEnemigos = await fetch(
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/Utils/enemigos.json"
    );
    const dataE = await resEnemigos.json();
    dataEnemigos = dataE;

    const resJefes = await fetch(
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/Utils/jefes.json"
    );
    const dataJ = await resJefes.json();
    dataJefes = dataJ;

    ingresarJuego();
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
}
cargarDatos();

async function ingresarJuego() {
  btnInicio.addEventListener("click", () => {
    if (input.value.trim() !== "") {
      clickInicio();
    } else {
      Toastify({
        text: "Ingresar nombre del Heroe",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background:
            "linear-gradient(to right, #AA076B 0%, #61045F  51%, #AA076B  100%)",
          borderRadius: "1rem",
        },
        onClick: function () {},
      }).showToast();
    }
  });
}

async function seleccionHeroe() {
  return new Promise((resolve, reject) => {
    const divBarbaro = document.querySelector("#barbaro");
    const divGuerrero = document.querySelector("#guerrero");
    const divMago = document.querySelector("#mago");
    divBarbaro.addEventListener("click", () => {
      heroes = { ...dataHeroes[0] };
      heroeOriginal = { ...heroes };
      seleccion.style.display = "none";
      contenedorFlex.style.display = "flex";
      resolve();
    });

    divGuerrero.addEventListener("click", () => {
      heroes = { ...dataHeroes[2] };
      heroeOriginal = { ...heroes };
      seleccion.style.display = "none";
      contenedorFlex.style.display = "flex";
      resolve();
    });

    divMago.addEventListener("click", () => {
      heroes = { ...dataHeroes[1] };
      heroeOriginal = { ...heroes };
      seleccion.style.display = "none";
      contenedorFlex.style.display = "flex";
      resolve();
    });
  });
}

function nroRandom() {
  const random = Math.ceil(Math.random() * 5);
  return random;
}

function cargarDng() {
  const x = nroRandom();
  for (let i = 0; i < x; i += 1) {
    const enemigoRandom = nroRandom();
    const encuentro = { ...dataEnemigos[enemigoRandom - 1] };
    enemigos.push(encuentro);
  }
  cargarJefe();
}

function cargarJefe() {
  const x = Math.floor(Math.random() * 2);
  const jefe = { ...dataJefes[x] };
  enemigos.push(dataJefes[x]);
}

async function peleaDng() {
  await seleccionHeroe();
  cargarDng();
  divBtn.style.display = "flex";
  divReiniciar.style.display = "none";
  for (const enemigo of enemigos) {
    peleaContinua = true;
    let vidaInicial = enemigo.vida;
    await peleaEnemigo(enemigo);
    enemigo.vida = vidaInicial;
  }
}

async function peleaEnemigo(enemigo) {
  cargarImgPelea(heroes.nombre, enemigo.nombre);
  const divDer = document.querySelector("#der");
  divDer.innerHTML = "";
  mostrarVidaHeroe(heroes);
  mostrarVidaEnemigo(enemigo);
  return new Promise((resolve, reject) => {
    function realizarAccion(accion) {
      switch (accion) {
        case "atacar":
          golpearEnemigo(enemigo);
          break;
        case "curar":
          usarPocion();
          break;
        case "huir":
          finJuego(divBtn, divReiniciar);
          cargarImagen("GameOver.jpg");
          break;
        default:
          console.error("Acción no reconocida: " + accion);
      }
      mostrarVidaHeroe(heroes);
      mostrarVidaEnemigo(enemigo);
      if (enemigo.vida <= 0 || heroes.vida <= 0) {
        peleaContinua = false;
      }
      if (!peleaContinua) {
        chequearEnemigo(enemigo);
        resolve();
      }
    }
    function esperarAccion() {
      const botonesDiv = document.getElementById("botones");
      while (botonesDiv.firstChild) {
        botonesDiv.removeChild(botonesDiv.firstChild);
      }

      const curarButton = document.createElement("button");
      curarButton.id = "btnCurar";
      curarButton.textContent = "Curar";
      curarButton.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("curar");
        }
      });

      const atacarButton = document.createElement("button");
      atacarButton.id = "btnAtacar";
      atacarButton.textContent = "Atacar";
      atacarButton.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("atacar");
        }
      });

      const huirButton = document.createElement("button");
      huirButton.id = "btnHuir";
      huirButton.textContent = "Huir";
      huirButton.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("huir");
        }
      });

      botonesDiv.appendChild(curarButton);
      botonesDiv.appendChild(atacarButton);
      botonesDiv.appendChild(huirButton);
    }
    esperarAccion();
  });
}

btnReiniciar.addEventListener("click", () => {
  reiniciar();
  clickInicio();
});

function reiniciar() {
  heroes = { ...heroeOriginal };
  curar = 0;
  enemigos.length = 0;
}

function clickInicio() {
  nombre = input.value;
  mostrarInicio.style.display = "none";
  contenedorFlex.style.display = "none";
  seleccion.style.display = "flex";
  peleaDng();
}

function golpearEnemigo(enemigo) {
  if (heroes.vida > 0) {
    golpeHeroe(25);
    enemigo.vida -= heroes.damage;
  }
  if (enemigo.vida <= 0) {
    enemigo.vida = 0;
  } else {
    golpeEnemigo(enemigo, 20, 35);
    heroes.vida -= enemigo.damage;
  }
  if (heroes.vida <= 0) {
    heroes.vida = 0;
  }
  crearP(`Atacas al ${enemigo.nombre} y su vida es ${enemigo.vida}`);
  crearP(`El ${enemigo.nombre} te ataca y tu vida es ${heroes.vida}`);
  crearP(`------------------------`);
}

function golpeHeroe(MIN) {
  heroes.damage = Math.ceil(Math.random() * heroes.damage + MIN);
  return heroes.damage;
}

function golpeEnemigo(enemigo, MIN, POW) {
  enemigo.damage = Math.ceil(Math.random() * POW + MIN);
  return enemigo.damage;
}

function chequearEnemigo(enemigo) {
  if (
    enemigo.nombre.includes("Dragon") ||
    enemigo.nombre.includes("Rey Esqueleto")
  ) {
    if (heroes.vida > 0) {
      crearP(`¡Venciste al ${enemigo.nombre}! ¡Ganaste el juego!`);
      victorias += 1;
      localStorage.setItem("victorias", victorias);
      cargarImagen("win.jpg");
      mostrarStats();
      finJuego(divBtn, divReiniciar);
    } else {
      crearP(
        `Lo siento ${nombre}, el ${enemigo.nombre} te vencio... ¡Suerte la proxima!`
      );
      derrotas += 1;
      localStorage.setItem("derrotas", derrotas);
      cargarImagen("GameOver.jpg");
      finJuego(divBtn, divReiniciar);
      mostrarStats();
    }
  } else {
    if (heroes.vida > 0) {
      crearP(`¡Venciste al ${enemigo.nombre}!`);
    } else {
      crearP(
        `Lo siento ${nombre}, el ${enemigo.nombre} te vencio... ¡Suerte la proxima!`
      );
      cargarImagen("GameOver.jpg");
      finJuego(divBtn, divReiniciar);
    }
  }
}

function usarPocion() {
  if (curar <= 3) {
    heroes.vida += 150;
    curar += 1;
    pocionesUsadas += 1;
    localStorage.setItem("pocionesUsadas", pocionesUsadas);
    vidaHeroe.textContent = heroes.vida;
    crearP("Tomas una pocion y restauras 150 de vida");
    crearP(`------------------------`);
  } else {
    crearP("Ya no tienes mas pociones");
    crearP(`------------------------`);
  }
}

function mostrarVidaHeroe(heroes) {
  vidaHeroe.textContent = heroes.vida;
  nombreHeroe = document.querySelector("#nombreHeroe");
  nombreHeroe.textContent = nombre;
}

function mostrarVidaEnemigo(enemigos) {
  vidaEnemigo.textContent = enemigos.vida;
  nombreEnemigo = document.querySelector("#nombreEnemigo");
  nombreEnemigo.textContent = enemigos.nombre;
}

function mostrarTextoPelea(enemigo, heroes) {
  const divDer = document.querySelector("#der");

  const pHeroe = document.createElement("p");
  pHeroe.textContent = `Atacas al ${enemigo.nombre} y su vida es ${enemigo.vida}`;

  const pEnemigo = document.createElement("p");
  pEnemigo.textContent = `El ${enemigo.nombre} te ataca y tu vida es ${heroes.vida}`;

  divDer.appendChild(pHeroe);
  divDer.appendChild(pEnemigo);
}

function finJuego(divBtn2, divBtnR) {
  divBtn2.style.display = "none";
  divBtnR.style.display = "flex";
}

function crearP(texto) {
  const divDer = document.querySelector("#der");
  const p = document.createElement("p");
  p.textContent = texto;
  divDer.appendChild(p);
}

function mostrarStats() {
  const divDer = document.querySelector("#der");
  divDer.innerHTML = "";
  victorias = parseInt(localStorage.getItem("victorias")) || 0;
  derrotas = parseInt(localStorage.getItem("derrotas")) || 0;
  pocionesUsadas = parseInt(localStorage.getItem("pocionesUsadas")) || 0;
  crearP(` -----   STATS   ----- `);
  crearP(`Victorias: ${victorias}`);
  crearP(`Derrotas: ${derrotas}`);
  crearP(`Pocciones utilizadas: ${pocionesUsadas}`);
}

function cargarImgPelea(heroe, enemigo) {
  const encuentroKey = `${heroe}_${enemigo}`;
  const imagenesEncuentro = {
    "Barbaro_Hombre Lobo":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BHL.jpg",
    "Barbaro_Minotauro":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BM.jpg",
    "Barbaro_Orco":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BO.jpg",
    "Barbaro_Demonio":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BD.jpg",
    "Barbaro_Nigromante":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BN.jpg",
    "Barbaro_Dragon":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BDR.jpg",
    "Barbaro_Rey Esqueleto":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BRE.jpg",

    "Guerrero_Hombre Lobo":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GHL.jpg",
    "Guerrero_Minotauro":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GM.jpg",
    "Guerrero_Orco":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GO.jpg",
    "Guerrero_Demonio":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GD.jpg",
    "Guerrero_Nigromante":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GN.jpg",
    "Guerrero_Dragon":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GDR.jpg",
    "Guerrero_Rey Esqueleto":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GRE.jpg",

    "Mago_Hombre Lobo":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MHL.jpg",
    "Mago_Minotauro":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MM.jpg",
    "Mago_Orco":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MO.jpg",
    "Mago_Demonio":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MD.jpg",
    "Mago_Nigromante":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MN.jpg",
    "Mago_Dragon":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MDR.jpg",
    "Mago_Rey Esqueleto":
      "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MRE.jpg",
  };
  if (encuentroKey in imagenesEncuentro) {
    imagen.src = imagenesEncuentro[encuentroKey];
  }
}

function cargarImagen(src) {
  imagen.src =
    "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/" +
    src;
}
