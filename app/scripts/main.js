/** YEAH **/
'use strict';
var textGenerator = require('./models/texts');
var particleGenerator = require('./models/particles');
var particles = particleGenerator.particles;
var texts = textGenerator.texts;
var song, then, now, canvas,ctx, canvas2, ctx2,shown,  particlesGenerationStep, particlesDying, color;


function initBindings(){
  $('.start').on('click', start);
}

function start(){
  $('.container').addClass('fade');
  $('.container').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
   launchCanvas);

  textGenerator.suscribe(changeAnimation);
}

function launchCanvas(){
  $('#canvas').removeClass('hidden');
  $('#canvas2').removeClass('hidden');
  then = Date.now();
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth; //Or wathever
  canvas.height = window.innerHeight; //Or wathever
  ctx = canvas.getContext('2d');
  
  canvas2 = document.getElementById('canvas2');
  canvas2.width = window.innerWidth; //Or wathever
  canvas2.height = window.innerHeight; //Or wathever
  ctx2 = canvas2.getContext('2d');
  load();
}
function loadAudio(uri)
{
    var audio = new Audio();
    //audio.onload = isAppLoaded; // It doesn't works!
    audio.addEventListener('canplaythrough', function(){
      loop();
      song.play();
    }, false); // It works!!
    audio.src = uri;
    return audio;
}

function load(){
  showLoadingMessage();
loadAudio('sounds/song.mp3')
  song = new Howl({
    urls: ['sounds/song.mp3'],
    autoplay: false
  })
  /*var loader = new PxLoader(), 
  //backgroundImg = loader.addImage('images/headerbg.jpg'), 
  song = loader.addAudio('sounds/song.mp3');
 
  loader.addCompletionListener(function() {
    
    loop();
  }); 

  // begin downloading 
  loader.start(); */
}

function showLoadingMessage(){
  ctx.font="20px Georgia";
  ctx.fillText("Cargando, espera un poco ... :)",10,50);
}

var loop = function loop(){
  now = Date.now();
  var dt = now - then;
  then = now;

  update(dt);
  clear();
  render();

  requestAnimationFrame(loop);
}

function update(dt){
  updateBackgrounds(dt/1000);
  updateTexts(dt/1000);
}

function updateBackgrounds(dt){
  if(particlesGenerationStep != 'fire'){
     particles = _.compact(particles.map(function(particle){
        particle.update(dt);
        if(particle.dying && particle.remaining_life <= 0){
          return null;
        }

        if(particle.pos.x > -30  && particle.pos.x < window.innerWidth + 30 
          && particle.pos.y > -30 && particle.pos.y < window.innerHeight + 30){
          return particle;
        }else if(!particlesDying){
          //Play sound particle
          return particleGenerator.newParticle(color);
        }
      }));
   }else{
      particles = particles.map(function(particle){
        particle.update(dt);
        if(particle.remaining_life <= 0){
          return particleGenerator.newFireParticle();
        }
        return particle;
      });
      if(!shown){
        shown = true;
        regenerateParticles();
      }
   }
 

  if(particles.length == 0){
    regenerateParticles();
  }
}

function updateTexts(dt){
  texts = _.compact(texts.map(function(text){
    text.update(dt);
    if(text.pos.y + text.getTextHeight() > 0 ){
      return text;
    }else{
      textGenerator.prepareNewText();
    }
  }));
}

function clear(){
  // Store the current transformation matrix
  ctx.save();

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();

  ctx2.globalCompositeOperation = "source-over";
  ctx2.fillStyle = "black";
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
  ctx2.globalCompositeOperation = "lighter";

}

function render(){

  particles.forEach(function(particle){
    particle.render(ctx2);
  });

  texts.forEach(function(text){
    text.render(ctx);
  });
}

function changeAnimation(anim){
  particles = particles.map(function(p){
    p.dying = true;
    return p;
  });
  particlesDying = true;
  particlesGenerationStep = anim;
}

function regenerateParticles(){
  particlesDying = false;
  texts.push(textGenerator.newText());
  switch(particlesGenerationStep){
    case 'red':
      color = {r:255,g:0,b:0};
      particles = particleGenerator.getColorParticles(color, 20, 0);
    break;
    case 'green':
      color = {r:13,g:209,b:23};
      particles = particleGenerator.getColorParticles(color, 20,0);
    break;
    case 'brown':
      color = {r:138,g:65,b:71};
      particles = particleGenerator.getColorParticles(color, 20,0);
    break;
    case 'blue':
      color = {r:53,g:100,b:223};
      particles = particleGenerator.getColorParticles(color, 20,0);
    break;
    case 'yellow':
      color = {r:248,g:235,b:79};
      particles = particleGenerator.getColorParticles(color, 20,0);
    break;
    case 'white':
      color = {r:255,g:255,b:255};
      particles = particleGenerator.getColorParticles(color, 20,0);
    break;
    case 'default':
      color = null;
      particles = particleGenerator.getColorParticles(color, 20,0);
    break;
    case 'fire':
      color = null;
      particles = particleGenerator.getFireParticles();
    break;
  }
}

$(document).ready(function(){
  console.log('ee')
  initBindings();
});