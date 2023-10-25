let nombre = "";
let curar = 0;
let victorias = 0;
let derrotas = 0;
let pocionesUsadas = 0;


/* function Personaje(vida, danio, nombre) {
  this.vida = vida;
  this.danio = danio;
  this.nombre = nombre;
}

const esqueleto = new Personaje(150, 0, "Esqueleto");
const mago = new Personaje(200, 0, "Mago");
const arquero = new Personaje(180, 0, "Arquero");
const zombie = new Personaje(150, 0, "Zombie");
const slime = new Personaje(220, 0, "Slime");
const jefe = new Personaje(1000, 0, "Jefe");
const heroe = new Personaje(500, 0, nombre);
*/
let dataEnemigos = [];
let dataJefes = [];
let dataHeroes = [];
const enemigos = [];
const jefes = [];
const heroes = [];




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




function ingresarJuego() {
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

const divBarbaro = document.querySelector("#barbaro");
const divGuerrero = document.querySelector("#guerrero");
const divMago = document.querySelector("#mago");
divBarbaro.addEventListener("click", () => {
  heroes = dataHeroes[0]
  console.log(heroes)
});

divGuerrero.addEventListener("click", () => {
  heroes = dataHeroes[1]
  console.log(heroes)
});

divMago.addEventListener("click", () => {
  heroes = dataHeroes[2]
  console.log(heroes)
});





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
  console.log(x);
  const jefe = dataJefes[x];
  jefes.push(jefe);
}


async function peleaDng() {
  cargarDng();
  divBtn.style.display = "flex";
  divReiniciar.style.display = "none";
  for (const enemigo of enemigos) {
    let vidaInicial = enemigo.vida;
    await peleaEnemigo(enemigo);
    enemigo.vida = vidaInicial;
  }
}

async function peleaEnemigo(enemigo) {
  cargarImgPelea(enemigo.nombre);
  const divDer = document.querySelector("#der");
  divDer.innerHTML = "";
  mostrarVidaHeroe(dataHeroes);
  mostrarVidaEnemigo(dataEnemigos);

  return new Promise((resolve, reject) => {
    let peleaContinua = true;

    function realizarAccion(accion) {
      switch (accion) {
        case "atacar":
          golpearEnemigo(dataEnemigos);
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

      mostrarVidaHeroe(heroe);
      mostrarVidaEnemigo(enemigo);

      if (dataEnemigos.vida <= 0 || dataHeroes.vida <= 0) {
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

function mostrarTextoPelea(dataEnemigos, dataHeroes) {
  const divDer = document.querySelector("#der");

  const pHeroe = document.createElement("p");
  pHeroe.textContent = `Atacas al ${dataEnemigos.nombre} y su vida es ${dataEnemigos.vida}`

  const pEnemigo = document.createElement("p");
  pEnemigo.textContent = `El ${dataEnemigos.nombre} te ataca y tu vida es ${dataHeroes.vida}`

  divDer.appendChild(pHeroe);
  divDer.appendChild(pEnemigo);
}

function chequearEnemigo (enemigo){
  if (enemigo.nombre === "Jefe") {
    if(heroe.vida > 0) {
      crearP(`¡Venciste al ${enemigo.nombre}! ¡Ganaste el juego!`);
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
    if(heroe.vida > 0) {
      crearP(`¡Venciste al ${enemigo.nombre}!`);
    }else{
      crearP(`Lo siento ${nombre}, el ${enemigo.nombre} te vencio... ¡Suerte la proxima!`);
      perdiste()
    }
  }
}

function usarPocion() {
    if (curar <= 3) {
      heroe.vida += 150;
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

function mostrarVidaHeroe(dataHeroes) {
  vidaHeroe.textContent = dataHeroes.vida;
  nombreHeroe = document.querySelector("#nombreHeroe")
  nombreHeroe.textContent = nombre;
}

function mostrarVidaEnemigo(dataEnemigos) {
  vidaEnemigo.textContent = dataEnemigos.vida;
  nombreEnemigo = document.querySelector("#nombreEnemigo")
  nombreEnemigo.textContent = dataEnemigos.nombre;
}

function mostrarVidaJefe(dataJefes) {
  vidaEnemigo.textContent = dataJefes.vida;
  nombreEnemigo = document.querySelector("#nombreEnemigo")
  nombreEnemigo.textContent = dataJefes.nombre;
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

function cargarImgPelea(nombre) {
  switch (nombre) {
    case "Hombre Lobo":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room1.jpg";
      break;
    case "Minotauro":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room2.jpg";
      break;
    case "Orco":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room3.jpg";
      break;
    case "Nigromante":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room4.jpg";
      break;
    case "Demonio":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room5.jpg";
      break;
    case "Dragon":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/BossRoom.jpg";
      break;
    case "Rey Esqueleto":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/BossRoom.jpg";
      break;
  }
}

function cargarImagen(src) {
  imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/" + src;
}
ingresarJuego();