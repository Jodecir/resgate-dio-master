function start() {
	$("#inicio").hide();
	
  $("#fundoGame").append("<div class='anima1' id='jogador'></div>");
	$("#fundoGame").append("<div class='anima3' id='amigo'></div>");
	$("#fundoGame").append("<div class='anima2' id='inimigo1'></div>");
  $("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
}

var jogo = {}
var velocidade=5;
var posicaoY = parseInt(Math.random() * 334);
var podeAtirar=true;
var fimdejogo=false;
var pontos=0;
var salvos=0;
var perdidos=0;

jogo.timer = setInterval(loop,15);

function loop() {
  movefundo();
  movejogador();
  moveamigo();
  moveinimigo1();
  moveinimigo2();
  colisao(); 
  placar();
}

function movefundo() {
  esquerda = parseInt($("#fundoGame").css("background-position"));
  $("#fundoGame").css("background-position",esquerda-1);
}
  
var TECLA = {
  W: 87,
  S: 83,
  D: 68
}

jogo.pressionou = [];

$(document).keydown(function(e){
	jogo.pressionou[e.which] = true;
});

$(document).keyup(function(e){
    jogo.pressionou[e.which] = false;
});

function movejogador() {
	if (jogo.pressionou[TECLA.W]) {
		var topo = parseInt($("#jogador").css("top"));
    $("#jogador").css("top",topo-10);	
    
    if (topo<=0) {
      $("#jogador").css("top",topo+10);
    }
	}
	
	if (jogo.pressionou[TECLA.S]) {
		var topo = parseInt($("#jogador").css("top"));
		$("#jogador").css("top",topo+10);	
  }
  
  if (topo>=400) {
    $("#jogador").css("top",topo-10);
  }
	
	if (jogo.pressionou[TECLA.D]) {
    disparo();
	}
}

function disparo() {
	if (podeAtirar==true) {	
    podeAtirar=false;
    
    topo = parseInt($("#jogador").css("top"))
    posicaoX= parseInt($("#jogador").css("left"))
    tiroX = posicaoX + 190;
    topoTiro=topo+37;
    $("#fundoGame").append("<div id='disparo'></div");
    $("#disparo").css("top",topoTiro);
    $("#disparo").css("left",tiroX);
	
	  var tempoDisparo=window.setInterval(executaDisparo, 30);
	} 
  function executaDisparo() {
    posicaoX = parseInt($("#disparo").css("left"));
    $("#disparo").css("left",posicaoX+15); 

    if (posicaoX>900) {   
      window.clearInterval(tempoDisparo);
      tempoDisparo=null;
      $("#disparo").remove();
      podeAtirar=true;
    }
  }
}

function colisao() {
  var colisao1 = ($("#jogador").collision($("#inimigo1")));
  var colisao2 = ($("#jogador").collision($("#inimigo2")));
  var colisao3 = ($("#disparo").collision($("#inimigo1")));
  var colisao4 = ($("#disparo").collision($("#inimigo2")));
  var colisao5 = ($("#jogador").collision($("#amigo")));
  var colisao6 = ($("#inimigo2").collision($("#amigo")));
    
  // jogador com o inimigo1
  if (colisao1.length>0) {
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));
    explosao1(inimigo1X,inimigo1Y);

    posicaoY = parseInt(Math.random() * 334);
    $("#inimigo1").css("left",694);
    $("#inimigo1").css("top",posicaoY);
  }

  if (colisao2.length>0) {
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    explosao2(inimigo2X,inimigo2Y);
        
    $("#inimigo2").remove();
      
    reposicionaInimigo2();  
  }

  // Disparo com o inimigo1
  if (colisao3.length>0) {
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));
      
    explosao1(inimigo1X,inimigo1Y);
    $("#disparo").css("left",950);
      
    posicaoY = parseInt(Math.random() * 334);
    $("#inimigo1").css("left",694);
    $("#inimigo1").css("top",posicaoY);
    
    pontos=pontos+100;
  }

  if (colisao4.length>0) {
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    $("#inimigo2").remove();
  
    explosao2(inimigo2X,inimigo2Y);
    $("#disparo").css("left",950);
    
    reposicionaInimigo2();
    
    pontos=pontos+50;
  }

  if (colisao5.length>0) {		
    reposicionaAmigo();
    $("#amigo").remove();
    
    salvos++;
  }

  if (colisao6.length>0) {
    amigoX = parseInt($("#amigo").css("left"));
    amigoY = parseInt($("#amigo").css("top"));
    explosao3(amigoX,amigoY);
    $("#amigo").remove();
        
    reposicionaAmigo();
    perdidos++;
  }
}

function explosao1(inimigo1X,inimigo1Y) {
	$("#fundoGame").append("<div id='explosao1'></div");
	$("#explosao1").css("background-image", "url(img/explosao.png)");
	var div=$("#explosao1");
	div.css("top", inimigo1Y);
	div.css("left", inimigo1X);
	div.animate({width:200, opacity:0}, "slow");
	
	var tempoExplosao=window.setInterval(removeExplosao, 1000);
	
  function removeExplosao() {
    div.remove();
    window.clearInterval(tempoExplosao);
    tempoExplosao=null;
  }
}

function explosao2(inimigo1X,inimigo1Y) {
	$("#fundoGame").append("<div id='explosao1'></div");
	$("#explosao1").css("background-image", "url(img/explosao.png)");
	var div=$("#explosao1");
	div.css("top", inimigo2Y);
	div.css("left", inimigo2X);
	div.animate({width:200, opacity:0}, "slow");
	
	var tempoExplosao=window.setInterval(removeExplosao, 1000);
	
  function removeExplosao() {
    div.remove();
    window.clearInterval(tempoExplosao);
    tempoExplosao=null;
  }
}

function explosao3(amigoX,amigoY) {
  $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
  $("#explosao3").css("top",amigoY);
  $("#explosao3").css("left",amigoX);
  var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
  function resetaExplosao3() {
  $("#explosao3").remove();
  window.clearInterval(tempoExplosao3);
  tempoExplosao3=null;
  }
}

function reposicionaAmigo() {
	var tempoAmigo=window.setInterval(reposiciona6, 6000);
	
  function reposiciona6() {
  window.clearInterval(tempoAmigo);
  tempoAmigo=null;
		
		if (fimdejogo==false) {
		$("#fundoGame").append("<div id='amigo' class='anima3'></div>");		
		}
  }
}

function reposicionaInimigo2() {
	var tempoColisao4=window.setInterval(reposiciona4, 5000);
		
		function reposiciona4() {
      window.clearInterval(tempoColisao4);
      tempoColisao4=null;
			
			if (fimdejogo==false) {
			
			$("#fundoGame").append("<div id=inimigo2></div");	
		}
	}	
}

function moveamigo() {
	posicaoX = parseInt($("#amigo").css("left"));
	$("#amigo").css("left",posicaoX+1);
				
  if (posicaoX>906) {
  $("#amigo").css("left",0);			
  }
}

function moveinimigo1() {
	posicaoX = parseInt($("#inimigo1").css("left"));
	$("#inimigo1").css("left",posicaoX-velocidade);
	$("#inimigo1").css("top",posicaoY);
		
  if (posicaoX<=0) {
  posicaoY = parseInt(Math.random() * 335);
  $("#inimigo1").css("left",700);
  $("#inimigo1").css("top",posicaoY);			
  }
}

function moveinimigo2() {
  posicaoX = parseInt($("#inimigo2").css("left"));
  $("#inimigo2").css("left",posicaoX-3);
    
  if (posicaoX<=0) {
    $("#inimigo2").css("left",775);
  }
}

function placar() {	
	$("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
}