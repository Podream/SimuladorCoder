let nombre = "";
let curar = 0;

function Personaje(vida, danio, nombre) {
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

const enemigos = [];

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


function ingresarJuego() {
  btnInicio.addEventListener("click", () => {
    
    if (input.value.trim() !== "") {
    nombre = input.value;
      mostrarInicio.style.display = "none";
      mostrarJuego.style.display = "block"; 
      heroe.vida = 500;
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
    let encuentro;
    switch (enemigoRandom) {
      case 1:
        encuentro = esqueleto;
        break;
      case 2:
        encuentro = mago;
        break;
      case 3:
        encuentro = arquero;
        break;
      case 4:
        encuentro = slime;
        break;
      case 5:
        encuentro = zombie;
        break;
    }
    enemigos.push(encuentro);
  }
  enemigos.push(jefe);
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
  mostrarVidaHeroe(heroe);
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

      mostrarVidaHeroe(heroe);
      mostrarVidaEnemigo(enemigo);

      if (enemigo.vida <= 0 || heroe.vida <= 0) {
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

function mostrarTextoPelea(enemigo, heroe) {
  const divDer = document.querySelector("#der");

  const pHeroe = document.createElement("p");
  pHeroe.textContent = `Atacas al ${enemigo.nombre} y su vida es ${enemigo.vida}`

  const pEnemigo = document.createElement("p");
  pEnemigo.textContent = `El ${enemigo.nombre} te ataca y tu vida es ${heroe.vida}`

  divDer.appendChild(pHeroe);
  divDer.appendChild(pEnemigo);
}

function chequearEnemigo (enemigo){
  if (enemigo.nombre === "Jefe") {
    if(heroe.vida > 0) {
      crearP(`¡Venciste al ${enemigo.nombre}! ¡Ganaste el juego!`);
      cargarImagen("win.jpg");
    }else{
      crearP(`Lo siento ${nombre}, el ${enemigo.nombre} te vencio... ¡Suerte la proxima!`);
      perdiste()
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

function golpearEnemigo(enemigo) {
    if(heroe.vida > 0){
      golpeHeroe(10);
      enemigo.vida -= heroe.danio;
    }
    if (enemigo.vida <= 0) {
      enemigo.vida = 0;
    } else {
      golpeEnemigo(enemigo, 15, 35);
      heroe.vida -= enemigo.danio;
    }
    if (heroe.vida <= 0) {
      heroe.vida = 0;
      perdiste();
    }
    crearP(`Atacas al ${enemigo.nombre} y su vida es ${enemigo.vida}`);
    crearP(`El ${enemigo.nombre} te ataca y tu vida es ${heroe.vida}`);
    crearP(`------------------------`);
}

function mostrarVidaHeroe(heroe) {
  vidaHeroe.textContent = heroe.vida;
  nombreHeroe = document.querySelector("#nombreHeroe")
  nombreHeroe.textContent = nombre;
}

function mostrarVidaEnemigo(enemigo) {
  vidaEnemigo.textContent = enemigo.vida;
  nombreEnemigo = document.querySelector("#nombreEnemigo")
  nombreEnemigo.textContent = enemigo.nombre;
}


function golpeHeroe(MIN) {
  heroe.danio = Math.ceil(Math.random() * 48 + MIN);
  return heroe.danio;
}

function golpeEnemigo(enemigo, MIN, POW) {
  enemigo.danio = Math.ceil(Math.random() * POW + MIN);
  return enemigo.danio;
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
    case "Esqueleto":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/room1.jpg";
      break;
    case "Mago":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room2.jpg";
      break;
    case "Arquero":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room3.jpg";
      break;
    case "Slime":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room4.jpg";
      break;
    case "Zombie":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room5.jpg";
      break;
    case "Jefe":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/BossRoom.jpg";
      break;
  }
}

function cargarImagen(src) {
  imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/" + src;
}
ingresarJuego();