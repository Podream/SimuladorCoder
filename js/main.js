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

const btnAtacar = document.querySelector(".btnAtacar");
const btnCurar = document.querySelector(".btnCurar");
const btnHuir = document.querySelector(".btnHuir");
const btnInicio = document.querySelector(".btnInicio");
const input = document.querySelector("input");
const mostrarInicio = document.querySelector("#mostrarInicio");
const mostrarJuego = document.querySelector("#mostrarJuego");
const mensajeError = document.querySelector("#mensajeError");
const vidaHeroe = document.querySelector("#vidaHeroe");
const vidaEnemigo = document.querySelector("#vidaEnemigo");
const imagen = document.querySelector("#imagen");


function ingresarJuego() {
  btnInicio.addEventListener("click", () => {
    nombre = input.value;
      mostrarInicio.style.display = "none";
      mostrarJuego.style.display = "block"; 
      heroe.vida = 500;
      peleaDng();
  })
}


function peleaDng() {
  cargarDng();
  enemigos.forEach(async enemigo => {
    await peleaEnemigo(enemigo);
  })
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

/* function peleaEnemigo(enemigo) {
  console.log("Encuentras la sala del " + enemigo.nombre + " final");
  cargarImgPelea(enemigo.nombre);
    btnAtacar.addEventListener("click", () => {
      golpeEnemigo(enemigo);
    });
    btnCurar.addEventListener("click", () => {
        usarPocion();
      });
    btnHuir.addEventListener("click", () => {
        huirPelea();
      });
    }
 */
/* btnAtacar.addEventListener("click", () => {
    golpeEnemigo(enemigo);
  });
btnCurar.addEventListener("click", () => {
    usarPocion();
  });
btnHuir.addEventListener("click", () => {
    huirPelea();
  }); */

/* function peleaEnemigo(enemigo) {
  console.log("Encuentras la sala del " + enemigo.nombre + " final");
  cargarImgPelea(enemigo.nombre);
  while (enemigo.vida > 0 && heroe.vida > 0){
      return new Promise((resolve, reject) => {

      btnAtacar.addEventListener("click", () => {
        golpearEnemigo(enemigo);
        //resolve(); // Resuelve la promesa cuando se hace clic en "Atacar"
      });

      btnCurar.addEventListener("click", () => {
        usarPocion();
        //resolve(); // Resuelve la promesa cuando se hace clic en "Curar"
      });

      btnHuir.addEventListener("click", () => {
        huirPelea();
        //resolve(); // Resuelve la promesa cuando se hace clic en "Huir"
      });
    });
  }
} */


function peleaEnemigo(enemigo) {
  console.log("Encuentras la sala del " + enemigo.nombre + " final");
  cargarImgPelea(enemigo.nombre);

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
          huirPelea();
          break;
        default:
          console.error("Acción no reconocida: " + accion);
      }
    }

    function esperarAccion() {
      btnAtacar.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("atacar");
          // Puedes agregar lógica adicional aquí si es necesario
        }
      });

      btnCurar.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("curar");
          // Puedes agregar lógica adicional aquí si es necesario
        }
      });

      btnHuir.addEventListener("click", () => {
        if (peleaContinua) {
          realizarAccion("huir");
          // Puedes agregar lógica adicional aquí si es necesario
        }
      });
    }

    esperarAccion(); // Comienza a esperar la acción del jugador

    // Puedes agregar lógica adicional aquí si es necesario

    // Ejemplo de cómo puedes verificar si la pelea ha terminado
    // y resolver la promesa en consecuencia:
    if (enemigo.vida <= 0 || heroe.vida <= 0) {
      peleaContinua = false;
      resolve();
    }
  });
}








function restuladoEnemigo (enemigo){
  enemigo.vida <= 0 && enemigo.nombre != jefe.nombre ? console.log("Buen hecho " + nombre + ", venciste al " + enemigo.nombre) :perdiste();
}

function resultadoJefe (enemigo){
  if (enemigo.vida <= 0) {
    console.log("Bieh hecho " + nombre + ", venciste al Jefe");
    console.log("Gracias por participar");
    cargarImagen("win.jpg");
  } else {
    perdiste();
  }
}

function usarPocion() {
    if (curar <= 2) {
      heroe.vida += 150;
      curar += 1;
      console.log("Tomas una pocion y restauras 150 de vida");
    } else {
      console.log("Ya no tienes mas pociones");
    }
}

function golpearEnemigo(enemigo) {
    if (heroe.vida <= 0) {
      heroe.vida = 0;
      perdiste();
    } else {
      golpeHeroe(10);
      enemigo.vida -= heroe.danio;
    }
    if (enemigo.vida <= 0) {
      enemigo.vida = 0;

    } else {
      golpeEnemigo(enemigo, 15, 35);
      heroe.vida -= enemigo.danio;
    }
    mostrarVidaHeroe();
    mostrarVidaEnemigo(enemigo.nombre, enemigo.vida);
    console.log("---- //// ----");
}

function mostrarVidaHeroe() {
  console.log(nombre + " tienes un total de " + heroe.vida + " de vida");
}

function mostrarVidaEnemigo(enemigo, vidaEnemigo) {
  console.log("La vida del " + enemigo + " es de " + vidaEnemigo);
}

function golpeHeroe(MIN) {
  heroe.danio = Math.ceil(Math.random() * 45 + MIN);
  return heroe.danio;
}

function golpeEnemigo(enemigo, MIN, POW) {
  enemigo.danio = Math.ceil(Math.random() * POW + MIN);
  return enemigo.danio;
}

function huirPelea() {
  cargarImagen("GameOver.jpg");
  ingresarJuego();
}

function perdiste() {
  cargarImagen("GameOver.jpg");
  ingresarJuego();
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
  document.body.innerHTML = "";
  let imagen = document.createElement("img");
  imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/" + src;
  imagen.id = "imagen";
  document.body.appendChild(imagen);
}
ingresarJuego();