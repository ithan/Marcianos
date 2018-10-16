let main,enemys = [],player,shots = [], puntuacion = {bruno: 0, player: 0}, direccion = 15, start = false, cd = false, hits = 0, px = false, parpadeando = false,naveA = 0, help = true,paused = false,pausedT = 0,ended = false;

// Lista de imagenes
let nave = { normal: undefined, muertaA: undefined, muertaB: undefined},
 disparo = [],
 links = {normal: undefined, muertaA: undefined, muertaB: undefined},
 enemigo = {a: undefined, a1: undefined,b: undefined, b1: undefined,c: undefined, c1: undefined, muerteA: undefined, muerteB: undefined},
 imgNave = undefined,
 imgNaveMuertaA=undefined,
 imgNaveMuertaB=undefined,
 pressed = false,
 collisionB = false,
 redir = false,
 insta = {alive: true, death: 0,da:false};

function preload(){
  //Load all models
  loadModels();
}
function setup(){
    // Define mine canvas
	main = createCanvas(innerWidth, innerHeight);

    //Adjust text
	let font = loadFont('fonts/PressStart2P.ttf');
	textFont('PressStart2P');

    //Define player and enemyes
	player = new Player();
	let v = 0,offsetX = 0, offsetY = 140;

	for(let y = 0; y < 5; y++){
		for(let i = 0; i < 8; i++){
			if(y == 0){
                // Red spaceships
				if(i == 0)enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,0,0,'Porfolio','proyectos.php'));
				if(i == 2)enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,0,0,'About','about.php'));
				if(i == 4)enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,0,0,'Marcas','marcas.php'));
				if(i == 6)enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,0,0,'Contacto','contact.php'));
			}else {
                //Normal spaceships
				if( y == 1) enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,1,2));
				if( y == 2 || y == 3) enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,1,1));
				if( y == 4) enemys.push(new Enemy(((innerWidth-(8*74))/2)+offsetX,offsetY,1,0));
			}
			offsetX+= 80;
		}
		offsetY += innerHeight/11;
		offsetX = 0;
	}
}

function draw(){
    //Black background
    background(35,31,32);

    //Help only displays the first time.
    if(start){help = false};

    //Change px t
	if(frameCount%40 < 7){px = false} else {px = true};

    //Player show and move.
	player.show();
	if(keyIsDown(LEFT_ARROW) || keyIsDown(65) && !parpadeando){
		start = true;
		player.move(-5);

	}
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68) && !parpadeando){
		start = true;
		player.move(5);

	}
    if(mouseIsPressed && (collideRectRect(mouseX,mouseY,6,6, innerWidth-100,innerHeight-60,50, 50))){
        //rect(innerWidth-77,innerHeight-50,6, 20);
        //rect(innerWidth-64,innerHeight-50,6, 20);
        paused = !paused;
    }else if((keyIsDown(32) || mouseIsPressed) && !cd && !parpadeando){

     if(shots.filter((v)=>{return v.p == 0 }).length == 0){
        start = true;
        shots.push(new Shot(player.x, player.y-15));
        cd = true;
        setTimeout(()=>{ cd = false },400)
    }
	}

    if(puntuacion.player >= 32 && ended <= 0){
        paused = true;
        ended = 1;
        document.querySelector('#img'+random('ABCDE'.split(''))).style.display = 'block';
        setTimeout(()=>{
            document.querySelector('.win').style.display = 'none';
            paused = false;
            ended = 2;
        },7000)

        let positions= [
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0},
            {x:0,y:0}

        ]

    }

    if(mouseIsPressed && ended >0){
        document.querySelector('.win').style.display = 'none';

        paused = false;
        ended = 2;
    }

    if(mouseIsPressed && (collideRectRect(mouseX,mouseY,6,6, innerWidth-105,35, 60, 40))){
       setTimeout(()=>{ if(!redir) {location.href = 'https://www.instagram.com/b.r.u.n.o.p.a.r.d.o/'; redir = !redir}},600);
        insta.alive = false;
    };

	let t = innerWidth/8;

	if(enemys[0].x < t){ direccion = 15};

	if(enemys[enemys.length-1].x > innerWidth-t){ direccion = -15};

	if(frameCount%30 == 0 && hits < 32 && start){ let e = random(enemys); if(e.t == 1 && e.alive)shots.push(new Shot(e.x+(e.size/2), e.y-15, -5,1));};

	shots.map((v,i)=>{ if(start){v.move()}; v.show(); if(v.y < 0 || v.y > innerHeight) {shots.splice(i,1)} });

	enemys.map((v,i)=>{v.show(); if(start){v.move()}; v.checkCollision(); v.calculateSize(); if(mouseIsPressed) v.mouse()});

	player.checkCollision();

	fill(random(255),random(255),random(255));

    noStroke();

	rect(mouseX,mouseY,6,6);

    shots.map((v,i)=>{
        if(collideRectRect(v.x-7,v.y,v.size/3,v.size,innerWidth-105,35, 60, 40)){
            shots.splice(i,1);
            setTimeout(()=>{ if(!redir) {location.href = 'https://www.instagram.com/b.r.u.n.o.p.a.r.d.o/'; redir = !redir}},600);
            insta.alive = false;

        };
    });
    generateText();
	/* if(mouseX > player.x){
		 player.move(5);
	 }
	 if(mouseX < player.x){
		 player.move(-5);
	 }*/
    fill(255);
    if(collisionB) showCollisionBox(innerWidth-90,innerHeight-60,46, 40);
    if(collisionB) showCollisionBox(innerWidth-105,35, 60, 40);
}


function windowResized (){ resizeCanvas(innerWidth, innerHeight); location.reload();};


class Enemy{
	constructor(x,y ,t = 1, c, txt = 'Portfolio',location=''){
		this.x = x;
		this.y = y;
		this.size = innerWidth/35;
		this.alive = true;
		this.t = t;
    this.animation = 0;
    this.c = c;
    this.death = 0;
    this.danimation = 0;
		this.txt = txt;
    this.location = location;

	}

	show(){
		if(this.t){
			let m = 2.1;
			//this.alive && ellipse(this.x, this.y, this.size);
            //Need to refactor this code.
            if(this.c == 0){
                if(this.animation) this.alive && image(enemigo.a, this.x-10, this.y, this.size*m,this.size*m);
                if(!this.animation) this.alive && image(enemigo.a1, this.x-10, this.y, this.size*m,this.size*m);
                if(this.danimation) !this.alive && this.death < 35 && this.death++ && image(enemigo.muerteA, this.x-10, this.y, this.size*m,this.size*m);
                if(!this.danimation) !this.alive && this.death < 35 && this.death++ && image(enemigo.muerteB, this.x-10, this.y, this.size*m,this.size*m);

            }
            if(this.c == 1){
                if(this.animation)this.alive && image(enemigo.b, this.x-10, this.y, this.size*m,this.size*m);
                if(!this.animation)this.alive && image(enemigo.b1, this.x-10, this.y, this.size*m,this.size*m);
                if(this.danimation) !this.alive && this.death < 35 && this.death++ && image(enemigo.muerteA, this.x-10, this.y, this.size*m,this.size*m);
                if(!this.danimation) !this.alive && this.death < 35 && this.death++ && image(enemigo.muerteB, this.x-10, this.y, this.size*m,this.size*m);

            }
            if(this.c == 2){
                if(this.animation)this.alive && image(enemigo.c, this.x-10, this.y, this.size*m,this.size*m);
                if(!this.animation)this.alive && image(enemigo.c1, this.x-10, this.y, this.size*m,this.size*m);
                if(this.danimation) !this.alive && this.death < 35 && this.death++ && image(enemigo.muerteA, this.x-10, this.y, this.size*m,this.size*m);
                if(!this.danimation) !this.alive && this.death < 35 && this.death++ && image(enemigo.muerteB, this.x-10, this.y, this.size*m,this.size*m);
            }
            if(collisionB && this.alive) showCollisionBox(this.x-3, this.y+6, this.size*1.5,this.size*1.6);
		} else {
			//rect(this.x-(this.size/2),this.y-(this.size/2),(this.size)+80,40);
            let altura = 70;
            this.alive && image(links.normal, this.x-(this.size/8)+3,this.y-(this.size/2),(this.size)+85,altura);
            if(this.danimation) !this.alive && this.death < 35 &&  this.death++ &&image(links.muertaA, this.x-(this.size/8)+3,this.y-(this.size/2),(this.size)+85,altura);
            if(!this.danimation) !this.alive && this.death < 35 &&  this.death++ &&image(links.muertaB, this.x-(this.size/8)+3,this.y-(this.size/2),(this.size)+85,altura);
            textSize(13);
            fill(202,34,40);
            textAlign(CENTER);
            text(this.txt,this.x+((this.size+80)/2),this.y-(this.size-10));
			      textAlign(LEFT);
            if(collisionB && this.alive) showCollisionBox(this.x+2,this.y-20,(this.size)+70,50);
		}

	}
	move(){
		if(frameCount%30 == 0 && hits < 32){ if(!paused){this.x += direccion}; this.animation = !this.animation}
		if(frameCount%10 == 0 && hits < 32){this.danimation = !this.danimation};

	}
	calculateSize(){
		if(this.t != 0) this.size = innerWidth/50;
	}
	mouse(){
		if(this.t == 0){
			if(collideRectRect(mouseX,mouseY,6,6,this.x+2,this.y-20,(this.size)+70,50)){
				if(!pressed){
					pressed = true;
					console.log(this.txt);
                    this.alive = false;
                    this.death++;
					setTimeout(()=>{pressed = false},100);

          setTimeout(()=>{ location.href = this.location },300);


				}
			}
		}
	}
	checkCollision(){
		if(this.t != 0){
			shots.map((v,i)=>{
				if(collideRectRect(this.x-3, this.y+6, this.size*1.5,this.size*1.6, v.x-7,v.y,v.size/3,v.size) && v.p == 0 && this.alive){
					this.alive = false;
          this.death++;
					puntuacion.player++;
					hits++;
					shots.splice(i,1);
				}
			});
		} else {
				shots.map((v,i)=>{
                        if(collideRectRect(this.x+2,this.y-20,(this.size)+70,50, v.x-7,v.y,v.size/3,v.size) && v.p == 0 && this.alive){
                            this.alive = false;
                            this.death++;
                            shots.splice(i,1);
                            setTimeout(()=>{ location.href=this.location;}, 100);


				    }
				});
		}
	}
}

class Player{
	constructor(){
		this.x = innerWidth/2;
		this.y = innerHeight - 100;
		this.size = 70;
	}

	show(){
		fill(255);
		if(parpadeando){
			if(frameCount%7) {
				if(naveA < 12) {
					image(nave.muertaA, this.x-(this.size/2),this.y-(this.size/2),this.size,this.size)
				}else {
					image(nave.muertaB, this.x-(this.size/2),this.y-(this.size/2),this.size,this.size)
                    if(naveA >23) naveA = 0;
				};
				naveA++;
			};
		} else {
			image(nave.normal, this.x-(this.size/2),this.y-(this.size/2),this.size,this.size);

		}
        if(collisionB) showCollisionBox(this.x-25,this.y-15,this.size/1.4,this.size/2);

	}
	move(e){
		this.x = this.x + e ;
		if(this.x < 140){ this.x = 140}
		if(this.x > innerWidth-70){ this.x = innerWidth-70};
	}
	checkCollision(){
		shots.map((v,i)=>{
			if(collideRectRect(this.x-25,this.y-15,this.size/1.4,this.size/2,v.x-7,v.y,v.size/3,v.size) && v.p == 1 && !parpadeando){
				puntuacion.bruno++
				shots.splice(i,1);

				parpadeando = true;
				setTimeout(()=>{ parpadeando = false; this.x = innerWidth/2;
				this.y = innerHeight - 100;},1000);
			}
		});
	}



}

class Link{

}

class Shot{
	constructor(x,y,s = 5, p= 0){
		this.x = x;
		this.y = y;
		this.size = 35;
		this.s = s;
		this.p = p;
	}
	show(){
        if(!this.p){
            if(frameCount % 2 == 0){
                image(disparo[0], this.x-(this.size/2),this.y,this.size,this.size);
            } else {
                image(disparo[1], this.x-(this.size/2),this.y,this.size,this.size);

            }
        } else {
            if(frameCount % 2 == 0){
                image(disparo[2], this.x-(this.size/2),this.y,this.size,this.size);
            } else {
                image(disparo[3], this.x-(this.size/2),this.y,this.size,this.size);

            }
        }
        if(collisionB) showCollisionBox(this.x-7,this.y,this.size/3,this.size);
		//ellipse(this.x,this.y,this.size);
	}
	move(){
		this.y-= this.s;
	}


}

function generateText(){
	fill(110,188,59);
	textSize(22);
	text('Bruno Pardo',70,70);
	text(puntuacion.bruno,70,110);
	fill(255);
	text(puntuacion.player,70,150);
	text('T\u00fa',70,190);
	if(insta.alive) text('IN',innerWidth-100,70);
    if(frameCount%25 == 0 ){insta.da = !insta.da};
    imageMode(CENTER)
	if(!insta.alive){
        if(insta.da){ insta.death < 75 && insta.death++ && image(enemigo.muerteA, innerWidth-80,56, innerWidth/35*1.3,innerWidth/35*1.3)} else {
            insta.death < 75 && insta.death++ && image(enemigo.muerteB, innerWidth-80,56, innerWidth/35*1.3,innerWidth/35*1.3);
        }
    }
    imageMode(CORNER)

    if(paused){
        if(pausedT++ > 40){
            rect(innerWidth-77,innerHeight-50,6, 20);
            rect(innerWidth-64,innerHeight-50,6, 20);
        }
        if(pausedT >80){
            pausedT = 0;
        }
        pausedT++;
    } else {
        rect(innerWidth-77,innerHeight-50,6, 20);
        rect(innerWidth-64,innerHeight-50,6, 20);
    }

	if(!start && px && help){
		textSize(15);
		text('Usa las flechas o\nA+D para moverte', innerWidth/2-330, innerHeight - 100);
		text('Para disparar\npulsa espacio', innerWidth/2+100 , innerHeight - 100);
	}
}

function loadModels(){
    nave.normal = loadImage('img/nave_verde/nave_verde_viva.svg');
	nave.muertaA = loadImage('img/nave_verde/nave_verde_muerte2.svg');
	nave.muertaB = loadImage('img/nave_verde/nave_verde_muerte1.svg');
    disparo.push(loadImage('img/nave_verde/disparo_nave_verde1.svg'));
    disparo.push(loadImage('img/nave_verde/disparo_nave_verde2.svg'));
    disparo.push(loadImage('img/enemigos/disparo_enemigo1.svg'));
    disparo.push(loadImage('img/enemigos/disparo_enemigo2.svg'));
    links.normal =  loadImage('img/enemigos/nave_roja.svg');
    links.muertaA =  loadImage('img/enemigos/muerte_nave_roja1.svg');
    links.muertaB =  loadImage('img/enemigos/muerte_nave_roja2.svg');
    enemigo.a =  loadImage('img/enemigos/enemigo1.svg');
    enemigo.a1 =  loadImage('img/enemigos/enemigo1_2.svg');
    enemigo.b =  loadImage('img/enemigos/enemigo2.svg');
    enemigo.b1 =  loadImage('img/enemigos/enemigo2_2.svg');
    enemigo.c =  loadImage('img/enemigos/enemigo3.svg');
    enemigo.c1 =  loadImage('img/enemigos/enemigo3_2.svg');
    enemigo.muerteA =  loadImage('img/enemigos/enemigo_muerte1.svg');
    enemigo.muerteB =  loadImage('img/enemigos/enemigo_muerte2.svg');
}

function showCollisionBox(x,y,sx,sy){
    stroke(255);
    line(x,y,x+sx,y);
    line(x,y+sy,x+sx,y+sy);
    line(x,y,x,y+sy);
    line(x+sx,y,x+sx,y+sy);
    noStroke();
}

function keyReleased(){
    if(keyCode == 113){
        collisionB = !collisionB;
    }
}

function calcularT(){
    let a = enemys[4].x;
    let b = enemys[11].x;
    return (b-a)+enemys[1].size;


}
