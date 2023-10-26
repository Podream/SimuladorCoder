let nombre = "";
let curar = 0;
let victorias = 0;
let derrotas = 0;
let pocionesUsadas = 0;

let dataEnemigos = [];
let dataJefes = [];
let dataHeroes = [];
const enemigos = [];
let heroes = [];

const btnAtacar = document.querySelector("#btnAtacar");
const btnCurar = document.querySelector("#btnCurar");
const btnHuir = document.querySelector("#btnHuir");
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




fetch("https://raw.githubusercontent.com/Podream/SimuladorCoder/main/Utils/heroes.json")
  .then((res)=>res.json())
  .then((dataH)=>{
    dataHeroes = dataH;
  })
  .catch((error) => {
    console.error("Error al cargar los datos de héroes:", error);
  });

  fetch("https://raw.githubusercontent.com/Podream/SimuladorCoder/main/Utils/enemigos.json")
  .then((res)=>res.json())
  .then((dataE)=>{
    dataEnemigos = dataE;
  })
  .catch((error) => {
    console.error("Error al cargar los datos de héroes:", error);
  });

  fetch("https://raw.githubusercontent.com/Podream/SimuladorCoder/main/Utils/jefes.json")
  .then((res)=>res.json())
  .then((dataJ)=>{
    dataJefes = dataJ;
  })
  .catch((error) => {
    console.error("Error al cargar los datos de héroes:", error);
  });

async function seleccionHeroe() {
  return new Promise((resolve, reject) => {
    const divBarbaro = document.querySelector("#barbaro");
    const divGuerrero = document.querySelector("#guerrero");
    const divMago = document.querySelector("#mago");
    divBarbaro.addEventListener("click", () => {
      heroes = dataHeroes[0]
        seleccion.style.display = "none";
        contenedorFlex.style.display = "flex"; 
        resolve();
    });
    
    divGuerrero.addEventListener("click", () => {
      heroes = dataHeroes[2]
      seleccion.style.display = "none";
      contenedorFlex.style.display = "flex"; 
      resolve();
    });
    
    divMago.addEventListener("click", () => {
      heroes = dataHeroes[1]
      seleccion.style.display = "none";
      contenedorFlex.style.display = "flex"; 
      resolve();
    });
  });
}

async function ingresarJuego() {
  btnInicio.addEventListener("click", () => {
    if (input.value.trim() !== "") {
    nombre = input.value;
      mostrarInicio.style.display = "none";
      mostrarJuego.style.display = "block"; 
      dataHeroes.vida = 500;
      peleaDng();
    }
  })
}

function validarInput (){
  input.addEventListener("input", () => {
    if (input.value.trim() === "") {
      btnInicio.disabled = true;
    } else {
      btnInicio.disabled = false;
    }
  });
}

function nroRandom (){
  const random = Math.floor(Math.random() * 5) + 1;
  return random;
}

function cargarDng() {
  const x = nroRandom();
  for (let i = 0; i < x; i += 1) {
    const enemigoRandom = nroRandom();
    const encuentro = dataEnemigos[enemigoRandom];
    enemigos.push(encuentro);
  }
  cargarJefe();
}

function cargarJefe (){
  const x = Math.floor(Math.random() * 2);
  enemigos.push(dataJefes[x]);
}


async function peleaDng() {
  await seleccionHeroe();
  cargarDng();
  divBtn.style.display = "flex";
  divReiniciar.style.display = "none";
  for (const enemigo of enemigos) {
    let vidaInicial = enemigos.vida;
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
    let peleaContinua = true;

    function realizarAccion(accion) {
      switch (accion) {
        case "atacar":
          golpearEnemigo(enemigo);
          break;
        case "curar":
          usarPocion();
          break;
        case "huir":
          perdiste();
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
      btnAtacar.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("atacar");
        }
      });

      btnCurar.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("curar");
        }
      });

      btnHuir.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("huir");
        }
      });
    }
    esperarAccion();

  });
}

function mostrarTextoPelea(enemigo, heroes) {
  const divDer = document.querySelector("#der");

  const pHeroe = document.createElement("p");
  pHeroe.textContent = `Atacas al ${enemigo.nombre} y su vida es ${enemigo.vida}`

  const pEnemigo = document.createElement("p");
  pEnemigo.textContent = `El ${enemigo.nombre} te ataca y tu vida es ${heroes.vida}`

  divDer.appendChild(pHeroe);
  divDer.appendChild(pEnemigo);
}

function chequearEnemigo (enemigo){
  if (enemigo.nombre === "Jefe") {
    if(heroes.vida > 0) {
      crearP(`¡Venciste al ${enemigos.nombre}! ¡Ganaste el juego!`);
      victorias += 1;
      localStorage.setItem("victorias", victorias);
      cargarImagen("win.jpg");
      mostrarStats();
    }else{
      crearP(`Lo siento ${nombre}, el ${enemigo.nombre} te vencio... ¡Suerte la proxima!`);
      derrotas += 1;
      localStorage.setItem("derrotas", derrotas);
      perdiste()
      mostrarStats();
    }
  } else {
    if(heroes.vida > 0) {
      crearP(`¡Venciste al ${enemigo.nombre}!`);
    }else{
      crearP(`Lo siento ${nombre}, el ${enemigos.nombre} te vencio... ¡Suerte la proxima!`);
      perdiste()
    }
  }
}

function usarPocion() {
    if (curar <= 3) {
      heroes.vida += 150;
      curar += 1;
      pocionesUsadas +=1;
      localStorage.setItem("pocionesUsadas", pocionesUsadas);
      vidaHeroe.textContent = heroe.vida;
      crearP("Tomas una pocion y restauras 150 de vida");
      crearP(`------------------------`);
    } else {
      crearP("Ya no tienes mas pociones");
      crearP(`------------------------`);
    }
}

function crearP (texto){
  const divDer = document.querySelector("#der");
  const p = document.createElement("p");
  p.textContent=texto
  divDer.appendChild(p);
}

function mostrarStats (){
  const divDer = document.querySelector("#der");
  divDer.innerHTML = "";
  victorias = parseInt(localStorage.getItem("victorias")) || 0;
  derrotas = parseInt(localStorage.getItem("derrotas")) || 0;
  pocionesUsadas = parseInt(localStorage.getItem("pocionesUsadas")) || 0;
  crearP(` -----   STATS   ----- `)
  crearP(`Victorias: ${victorias}`);
  crearP(`Derrotas: ${derrotas}`);
  crearP(`Pocciones utilizadas: ${pocionesUsadas}`);
}

function golpearEnemigo(enemigo) {
    if(dataHeroes.vida > 0){
      golpeHeroe(10);
      enemigo.vida -= dataHeroes.damage;
    }
    if (enemigo.vida <= 0) {
      enemigo.vida = 0;
    } else {
      golpeEnemigo(enemigo, 15, 35);
      dataHeroes.vida -= enemigo.danio;
    }
    if (dataHeroes.vida <= 0) {
      dataHeroes.vida = 0;
      perdiste();
    }
    crearP(`Atacas al ${enemigo.nombre} y su vida es ${enemigo.vida}`);
    crearP(`El ${enemigo.nombre} te ataca y tu vida es ${heroe.vida}`);
    crearP(`------------------------`);
}

function mostrarVidaHeroe(heroes) {
  vidaHeroe.textContent = heroes.vida;
  nombreHeroe = document.querySelector("#nombreHeroe")
  nombreHeroe.textContent = nombre;
}

function mostrarVidaEnemigo(enemigos) {
  vidaEnemigo.textContent = enemigos.vida;
  nombreEnemigo = document.querySelector("#nombreEnemigo")
  nombreEnemigo.textContent = enemigos.nombre;
}

function mostrarVidaJefe(jefes) {
  vidaEnemigo.textContent = jefes.vida;
  nombreEnemigo = document.querySelector("#nombreEnemigo")
  nombreEnemigo.textContent = jefes.nombre;
}


function golpeHeroe(MIN) {
  dataHeroes.damage = Math.ceil(Math.random() * 55 + MIN);
  return dataHeroes.damage;
}

function golpeEnemigo(dataEnemigos, MIN, POW) {
  dataEnemigos.damage = Math.ceil(Math.random() * POW + MIN);
  return dataEnemigos.damage;
}

function golpeJefe(dataJefes, MIN, POW) {
  dataJefes.damage = Math.ceil(Math.random() * POW + MIN);
  return dataJefes.damage;
}


function reiniciar(){
  esqueleto.vida = 150;
  mago.vida = 200;
  arquero.vida = 180;
  zombie.vida = 150;
  slime.vida = 220;
  jefe.vida = 1000;
  heroe.vida = 500;
  curar = 0;
  enemigos.length = 0;
  divBtn.style.display = "none";
  divReiniciar.style.display = "flex";
}

btnReiniciar.addEventListener("click", () => {
  reiniciar()
  peleaDng()
  });

function perdiste() {
  cargarImagen("GameOver.jpg");
  divBtn.style.display = "none";
  divReiniciar.style.display = "flex";
}

function cargarImgPelea(heroe, enemigo) {
  const encuentroKey = `${heroe}_${enemigo}`;
  const imagenesEncuentro = {
    "Barbaro_Hombre Lobo": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BHL.jpg",
    "Barbaro_Minotauro": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BM.jpg",
    "Barbaro_Orco": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BO.jpg",
    "Barbaro_Demonio": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BD.jpg",
    "Barbaro_Nigromante": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BN.jpg",
    "Barbaro_Dragon": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BDR.jpg",
    "Barbaro_Rey Esqueleto": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/BRE.jpg",

    "Guerrero_Hombre Lobo": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GHL.jpg",
    "Guerrero_Minotauro": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GM.jpg",
    "Guerrero_Orco": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GO.jpg",
    "Guerrero_Demonio": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GD.jpg",
    "Guerrero_Nigromante": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GN.jpg",
    "Guerrero_Dragon": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GDR.jpg",
    "Guerrero_Rey Esqueleto": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/GRE.jpg",
    
    "Mago_Hombre Lobo": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MHL.jpg",
    "Mago_Minotauro": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MM.jpg",
    "Mago_Orco": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MO.jpg",
    "Mago_Demonio": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MD.jpg",
    "Mago_Nigromante": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MN.jpg",
    "Mago_Dragon": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MDR.jpg",
    "Mago_Rey Esqueleto": "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/MRE.jpg",

  };
  if (encuentroKey in imagenesEncuentro) {
    imagen.src = imagenesEncuentro[encuentroKey];
  }
}

function cargarImagen(src) {
  imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/images/" + src;
}
ingresarJuego();