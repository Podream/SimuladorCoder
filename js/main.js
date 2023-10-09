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

function ingresarJuego() {
  //document.body.innerHTML = "";
  confirm("Bienvenido a la Dungeon");
  ingresarNombre();
}

function ingresarNombre() {
  nombre = prompt("Ingresa el nombre de tu Heroe");
  heroe.vida = 500;
  peleaDng();
}

async function peleaDng() {
  cargarDng();
  for (let i = 0; i < enemigos.length; i++) {
    const enemigo = enemigos[i];
    if (i !== enemigos.length - 1) {
      await peleaEnemigo(enemigo);
    } else {
      await peleaJefe(enemigo);
    }
  }
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

async function peleaEnemigo(enemigo) {
  await cargarImgPelea(enemigo.nombre);
  console.log(nombre + ", un " + enemigo.nombre + " se cruza en tu camino");
  alert(nombre + ", un " + enemigo.nombre + " se cruza en tu camino");

  //Promise para que cargue la imagen
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  while (heroe.vida > 0 && enemigo.vida > 0) {
    alert("Atacar al " + enemigo.nombre);
    golpearEnemigo(enemigo);
  }
  enemigo.vida <= 0 ? console.log("Buen hecho " + nombre + ", venciste al " + enemigo.nombre) :perdiste();
}


async function peleaJefe(nombre) {
  await console.log("Encuentras la sala del " + jefe.nombre + " final");
  cargarImgPelea(jefe.nombre);

  //Promise para que cargue la imagen
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  while (jefe.vida > 0 && heroe.vida > 0) {
    accionesJefe();
    switch (accion) {
      case "1":
        golpearEnemigo(jefe);
        break;
      case "2":
        usarPocion();
        break;
      case "3":
        huirPelea();
        break;
      default:
        console.log("Accion incorrecta");
    }
  }
  if (jefe.vida <= 0) {
    console.log("Bieh hecho " + nombre + ", venciste al Jefe");
    console.log("Gracias por participar");
    cargarImagen("win.jpg");
  } else {
    perdiste();
  }
}

function accionesJefe() {
  console.log(" ---  ACCIONES  --- ");
  console.log("1: Golpear al Jefe");
  console.log("2: Curarte vida");
  console.log("3: Huir de la pelea");
  mostrarVidaHeroe();
  console.log("---- //// ----");
  let accion = prompt("Que accion quieres realizar?");
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
  } else {
    golpeHeroe(10);
    enemigo.vida -= heroe.danio;
  }
  if (enemigo.vida < 0) {
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
  alert("Gracias por jugar");
  ingresarJuego();
}

function perdiste() {
  cargarImagen("GameOver.jpg");alert
  alert("Perdiste");
  alert("Gracias por participar");
  document.body.innerHTML = "";
  ingresarJuego();
}

function cargarImgPelea(nombre) {
  document.body.innerHTML = "";
  let imagen = document.createElement("img");
  switch (nombre) {
    case "Esqueleto":
      imagen.src =
        "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room1.jpg";
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
  imagen.id = "imagen";
  document.body.appendChild(imagen);
}

function cargarImagen(src) {
  document.body.innerHTML = "";
  let imagen = document.createElement("img");
  imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/" + src;
  imagen.id = "imagen";
  document.body.appendChild(imagen);
}
ingresarJuego();