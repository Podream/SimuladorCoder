let vidaEsqueleto = 150;
let vidaHeroe = 500;
let vidaMago = 200;
let vidaJefe = 1000;
let nombre= "";
let dañoHeroe = 0;
let dañoEnemigo = 0;
let curar = 0;

function ingresarJuego (){
    document.body.innerHTML = "";
    confirm("Bienvenido a la Dungeon");
    ingresarNombre();
}

function ingresarNombre (){
    nombre = prompt("Ingresa el nombre de tu Heroe");
    console.log(nombre +", un esqueleto se cruza en tu camino");
    console.log("---------------------------------------");
    vidaHeroe = 500;
    peleaEsqueleto();
}

function mostrarVidaHeroe (){
    console.log(nombre + " tienes un total de " + vidaHeroe + " de vida");
}

function mostrarVidaEnemigo (enemigo, vidaEnemigo){
    console.log("La vida del "+ enemigo +" es de "+ vidaEnemigo);
}




function golpeHeroe (MIN){
    dañoHeroe = Math.ceil((Math.random()*45) + MIN );
    return dañoHeroe;
}

function golpeEnemigo (MIN,POW){
    dañoEnemigo = Math.ceil((Math.random()*POW) + MIN );
    return dañoEnemigo;
}

function huirPelea(){
    cargarImagen("GameOver.jpg");
    console.log("Gracias por jugar");
    ingresarJuego();
}

function perdiste (){
    console.log("Perdiste");
    console.log("Gracias por participar");
    document.body.innerHTML = "";
    ingresarJuego();
}

function cargarImagen (src){
    document.body.innerHTML = "";
    let imagen = document.createElement("img");
    imagen.src = "https://raw.githubusercontent.com/Podream/SimuladorCoder/main/assets/" + src;
    imagen.id = "imagen";
    document.body.appendChild(imagen);
}


function peleaEsqueleto (){
        cargarImagen("room1.jpg");
    while ((vidaHeroe > 0)&& (vidaEsqueleto>0)){
        alert("Atacar al Esqueleto");
        if(vidaHeroe<=0){
            vidaHeroe=0;
        }else{
            golpeHeroe(10);
            vidaEsqueleto -= dañoHeroe;
        }
        if (vidaEsqueleto <0){
            vidaEsqueleto = 0;
        }else{
            golpeEnemigo(12,28);
            vidaHeroe-= dañoEnemigo;
        }
            mostrarVidaHeroe();
            mostrarVidaEnemigo("Esqueleto", vidaEsqueleto);
            console.log("---- //// ----");
            
        }   
        if (vidaEsqueleto <= 0){
            console.log("Bieh hecho " + nombre +", venciste al Esqueleto");
            console.log("Avanzas por las Dungeon y un Mago te ataca");
            peleaMago();
        }else{
            perdiste();
        }
} 

function peleaMago (){
        cargarImagen("Room2.jpg");
    while ((vidaHeroe > 0)&& (vidaMago>0)){
        alert("Atacar al Mago");
        if(vidaHeroe<=0){
            vidaHeroe=0;
        }else{
        golpeHeroe(15);
        vidaMago -= dañoHeroe;
        }
        if (vidaMago <0){
            vidaMago = 0;
        }else{
            golpeEnemigo(17,42);
            vidaHeroe-= dañoEnemigo;
        }
            mostrarVidaHeroe();
            mostrarVidaEnemigo("Mago", vidaMago);
            console.log("---- //// ----");
            
        } 

    if (vidaMago <=0){
        console.log("Bieh hecho " +nombre+", venciste al Mago");
        console.log("Encuentras la sala del Jefe final");
        peleaJefe ();
    }else{
        perdiste();
    }
}

function peleaJefe(){
        cargarImagen("BossRoom.jpg");
    while(vidaJefe>0 && vidaHeroe>0){
        console.log(" ---  ACCIONES  --- ");
        console.log("1: Golpear al Jefe");
        console.log("2: Curarte vida");
        console.log("3: Huir de la pelea");
        mostrarVidaHeroe();
        console.log("---- //// ----");
        let accion = prompt ("Que accion quieres realizar?");
        
    switch (accion){
        case "1": 
                if(vidaHeroe<=0){
                    vidaHeroe=0;
                }else{
                golpeHeroe(50);
                vidaJefe -= dañoHeroe;
                }
                if (vidaJefe <0){
                    vidaJefe = 0;
                }else{
                    golpeEnemigo(20,50);
                    vidaHeroe-= dañoEnemigo;
                }
                    mostrarVidaHeroe();
                    mostrarVidaEnemigo("Jefe", vidaJefe);
                    console.log("---- //// ----");
                    
                
            break;
        case "2": 
                if (curar <= 2){
                vidaHeroe += 150;
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

    if (vidaJefe <=0){
        console.log("Bieh hecho " + nombre +", venciste al Jefe");
        console.log("Gracias por participar");
        cargarImagen("win.jpg");
        }else{
        cargarImagen("GameOver.jpg");
        perdiste();
    }
}

ingresarJuego();







