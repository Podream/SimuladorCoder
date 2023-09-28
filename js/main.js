let nombre= "";
let curar = 0;

function Personaje (vida,daño,nombre){
    this.vida = vida;
    this.daño = daño;
    this.nombre = nombre;
}

const esqueleto = new Personaje (150,0,"Esqueleto");
const mago = new Personaje (200,0,"Mago");
const arquero = new Personaje (180,0,"Arquero");
const zombie = new Personaje (150,0,"Zombie");
const slime = new Personaje (220,0,"Slime");
const jefe = new Personaje (1000,0,"Jefe");
const heroe = new Personaje(500,0,nombre);

const enemigos = []


function ingresarJuego (){
    document.body.innerHTML = "";
    confirm("Bienvenido a la Dungeon");
    ingresarNombre();
}

function ingresarNombre (){
    nombre = prompt("Ingresa el nombre de tu Heroe");
    heroe.vida = 500;
    peleaDng();
}

function mostrarVidaHeroe (){
    console.log(nombre + " tienes un total de " + heroe.vida + " de vida");
}

function mostrarVidaEnemigo (enemigo, vidaEnemigo){
    console.log("La vida del "+ enemigo +" es de "+ vidaEnemigo);
}

function golpeHeroe (MIN){
    heroe.daño = Math.ceil((Math.random()*45) + MIN );
    return heroe.daño;
}

function golpeEnemigo (enemigo,MIN,POW){
    enemigo.daño = Math.ceil((Math.random()*POW) + MIN );
    return enemigo.daño;
}

function huirPelea(){
    cargarImagen("GameOver.jpg");
    alert("Gracias por jugar");
    ingresarJuego();
}

function perdiste (){
    cargarImagen("GameOver.jpg");
    alert("Perdiste");
    alert("Gracias por participar");
    document.body.innerHTML = "";
    ingresarJuego();
}

function cargarImgPelea (nombre){
    document.body.innerHTML = "";
    let imagen = document.createElement("img");
    switch(nombre){
        case "Esqueleto": imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room1.jpg";
            break;
        case "Mago": imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room2.jpg";
            break;
        case "Arquero": imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room3.jpg";
            break;
        case "Slime": imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room4.jpg";
            break;
        case "Zombie": imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/Room5.jpg";
            break;
        case "Jefe": imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/BossRoom.jpg";
            break;
    }
    imagen.id = "imagen";
    document.body.appendChild(imagen);
}

function cargarImagen (src){
    document.body.innerHTML = "";
    let imagen = document.createElement("img");
    imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/"+ src;
    imagen.id = "imagen";
    document.body.appendChild(imagen);
}

function cargarDng (){
    for (let i = 0; i < 2; i+=1) {
        const enemigoRandom = Math.floor(Math.random()*5)+1;
        let encuentro;
        switch (enemigoRandom){
            case 0: encuentro = esqueleto;
                break;
            case 1: encuentro = mago;
                break;
            case 2: encuentro = arquero;
                break;
            case 3: encuentro = slime;
                break;
            case 4: encuentro = zombie;
                break;
        }
        enemigos.push(encuentro);
    }
    enemigos.push(jefe);
}

function peleaDng (){
    cargarDng();
        enemigos.forEach((e,i)=>{
            if(i!=enemigos.length-1){
                peleaEnemigo(e);
            }else{
                peleaJefe(e);
            }
        })}

function peleaEnemigo (enemigo){
        
        cargarImgPelea(enemigo.nombre);
        console.log(nombre +", un " + enemigo.nombre +" se cruza en tu camino");
        alert(nombre +", un " + enemigo.nombre +" se cruza en tu camino");

    // Espera 1 segundo antes de mostrar el alert para cargar la imagen
    //setTimeout( ()=>{
        while ((heroe.vida > 0)&& (enemigo.vida>0)){
            console.log("Atacar al "+ enemigo.nombre);
            if(heroe.vida<=0){
                heroe.vida=0;
            }else{
                golpeHeroe(10);
                enemigo.vida -= heroe.daño;
            }
            if (enemigo.vida <0){
                enemigo.vida = 0;
            }else{
                golpeEnemigo(enemigo,15,35);
                heroe.vida-= enemigo.daño;
            }
                mostrarVidaHeroe();
                mostrarVidaEnemigo(enemigo.nombre, enemigo.vida);
                console.log("---- //// ----");
                
            }   
            if (enemigo.vida <= 0){
                console.log("Bieh hecho " + nombre +", venciste al " + enemigo.nombre);
            }else{
                perdiste();
            }
        }//,1000);
//} 

function peleaJefe(nombre){
        console.log("Encuentras la sala del "+ jefe.nombre +" final");
        cargarImgPelea(jefe.nombre);
    // Espera 1 segundo antes de mostrar el alert para cargar la imagen
    setTimeout( ()=>{    
        while(jefe.vida > 0 && heroe.vida > 0){
            console.log(" ---  ACCIONES  --- ");
            console.log("1: Golpear al Jefe");
            console.log("2: Curarte vida");
            console.log("3: Huir de la pelea");
            mostrarVidaHeroe();
            console.log("---- //// ----");
            let accion = prompt ("Que accion quieres realizar?");
            
        switch (accion){
            case "1": 
                    if(heroe.vida<=0){
                        heroe.vida=0;
                    }else{
                    golpeHeroe(50);
                    jefe.vida -= heroe.daño;
                    }
                    if (jefe.vida <0){
                        jefe.vida = 0;
                    }else{
                        golpeEnemigo(jefe,20,50);
                        heroe.vida-= jefe.daño;
                    }
                        mostrarVidaHeroe();
                        mostrarVidaEnemigo("Jefe", jefe.vida);
                        console.log("---- //// ----");
                        
                    
                break;
            case "2": 
                    if (curar <= 2){
                        heroe.vida += 150;
                        curar+=1;
                        console.log("Tomas una pocion y restauras 150 de vida");
                    }else{
                        console.log("Ya no tienes mas pociones")
                    }
                    peleaJefe();
                break;
            case "3":
                    huirPelea();
                break;
            default:
                    console.log("Accion incorrecta")
                    peleaJefe();
        }
        }

        if (jefe.vida <=0){
            console.log("Bieh hecho " + nombre +", venciste al Jefe");
            console.log("Gracias por participar");
            cargarImagen("win.jpg");
            }else{
            
            perdiste();
        }
    },1000);
}

ingresarJuego();







