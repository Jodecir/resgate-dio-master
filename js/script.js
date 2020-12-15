function start() {
	$("#start-game").hide();
	
  $("#background-game").append("<div id='armor'></div>");
  $("#background-game").append("<div class='anima1' id='jogador'></div>");
	$("#background-game").append("<div class='anima3' id='amigo'></div>");
	$("#background-game").append("<div class='anima2' id='inimigo1'></div>");
  $("#background-game").append("<div id='inimigo2'></div>");
  $("#background-game").append("<div id='scoreboard'></div>");
  
  var game = {}
  var player = {}
  var armor=3;
  var armorZero=false;
  var speed=5;
  var yPosition = parseInt(Math.random() * 334);
  var shootUnlocked=true;
  var points=0;
  var peopleRescued=0;
  var peopleDead=0;

  game.timer = setInterval(loop,15);

  function loop() {
    armorRefresh();
    bgMovement();
    playerMovement();
    friendMovement();
    enemy1Movement();
    enemy2Movement();
    collision(); 
    scoreboardRefresh();
  }

  function armorRefresh() {
    if (armor==3) {  
      $("#armor").css("background-image", "url(img/armor3.png)");
    }

    if (armor==2) {
      $("#armor").css("background-image", "url(img/armor2.png)");
    }

    if (armor==1) {
      $("#armor").css("background-image", "url(img/armor1.png)");
    }

    if (armor==0) {
      $("#armor").css("background-image", "url(img/hud.png)"); 
      gameOver();
    }
  }

  function gameOver() {
    armorZero=true;
    musica.pause();
    somGameover.play();
    
    window.clearInterval(game.timer);
    game.timer=null;
    
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();
    
    $("#background-game").append("<div id='fim'></div>");
    
    $("#fim").html("<h1> Game Over </h1>" + "<div id='reinicia' onClick=reiniciagame()><h3>Jogar Novamente</h3></div>");
  }

  function bgMovement() {
    esquerda = parseInt($("#background-game").css("background-position"));
    $("#background-game").css("background-position",esquerda-1);
  }
    
  var KEY = {
    W: 87,
    S: 83,
    D: 68
  }

  var musica=document.getElementById("musica");
  var somDisparo=document.getElementById("somDisparo");
  var somExplosao=document.getElementById("somExplosao");
  var somGameover=document.getElementById("somGameover");
  var somPerdido=document.getElementById("somPerdido");
  var somResgate=document.getElementById("somResgate");

  musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
  musica.play();

  player.press = [];

  $(document).keydown(function(e){
    player.press[e.which] = true;
  });

  $(document).keyup(function(e){
      player.press[e.which] = false;
  });

  function playerMovement() {
    if (player.press[KEY.W]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo-10);	
      
      if (topo<=0) {
        $("#jogador").css("top",topo+10);
      }
    }
    
    if (player.press[KEY.S]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo+10);	
    }
    
    if (topo>=400) {
      $("#jogador").css("top",topo-10);
    }
    
    if (player.press[KEY.D]) {
      disparo();
    }
  }

  function disparo() {
    if (shootUnlocked==true) {	
      shootUnlocked=false;
      
      topo = parseInt($("#jogador").css("top"))
      xPosition= parseInt($("#jogador").css("left"))
      tiroX = xPosition + 190;
      topoTiro=topo+37;
      $("#background-game").append("<div id='disparo'></div");
      $("#disparo").css("top",topoTiro);
      $("#disparo").css("left",tiroX);
    
      var tempoDisparo=window.setInterval(executaDisparo, 30);
    } 
    function executaDisparo() {
      xPosition = parseInt($("#disparo").css("left"));
      $("#disparo").css("left",xPosition+15); 

      if (xPosition>900) {   
        window.clearInterval(tempoDisparo);
        tempoDisparo=null;
        $("#disparo").remove();
        shootUnlocked=true;
      }
      
      somDisparo.play();
    }
  }

  function collision() {
    var colisao1 = ($("#jogador").collision($("#inimigo1")));
    var colisao2 = ($("#jogador").collision($("#inimigo2")));
    var colisao3 = ($("#disparo").collision($("#inimigo1")));
    var colisao4 = ($("#disparo").collision($("#inimigo2")));
    var colisao5 = ($("#jogador").collision($("#amigo")));
    var colisao6 = ($("#inimigo2").collision($("#amigo")));
      
    if (colisao1.length>0) {
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X,inimigo1Y);

      yPosition = parseInt(Math.random() * 334);
      $("#inimigo1").css("left",694);
      $("#inimigo1").css("top",yPosition);

      armor--;
    }

    if (colisao2.length>0) {
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X,inimigo2Y);
          
      $("#inimigo2").remove();
        
      reposicionaInimigo2();  

      armor--;
    }

    if (colisao3.length>0) {
      
      speed=speed+0.1;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
        
      explosao1(inimigo1X,inimigo1Y);
      $("#disparo").css("left",950);
        
      yPosition = parseInt(Math.random() * 334);
      $("#inimigo1").css("left",694);
      $("#inimigo1").css("top",yPosition);
      
      points=points+100;
    }

    if (colisao4.length>0) {
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();
    
      explosao2(inimigo2X,inimigo2Y);
      $("#disparo").css("left",950);
      
      reposicionaInimigo2();
      
      points=points+50;
    }

    if (colisao5.length>0) {		
      reposicionaAmigo();
      $("#amigo").remove();
      
      peopleRescued++;
      somResgate.play();
    }

    if (colisao6.length>0) {
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX,amigoY);
      $("#amigo").remove();
          
      reposicionaAmigo();
      peopleDead++;
    }
  }

  function explosao1(inimigo1X,inimigo1Y) {
    $("#background-game").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(img/explosao.png)");
    var div=$("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao=window.setInterval(removeExplosao, 500);
    
    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao=null;
    }

    somExplosao.play();
  }

  function explosao2(inimigo2X,inimigo2Y) {
    $("#background-game").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(img/explosao.png)");
    var div=$("#explosao2");
    div.css("top", inimigo2Y);
    div.css("left", inimigo2X);
    div.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao=window.setInterval(removeExplosao, 500);
    
    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao=null;
    }
    
    somExplosao.play();
  }

  function explosao3(amigoX,amigoY) {
    $("#background-game").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    var tempoExplosao3=window.setInterval(resetaExplosao3, 500);
    function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3=null;
    }
    
    somPerdido.play();
  }

  function reposicionaAmigo() {
    var tempoAmigo=window.setInterval(reposiciona6, 6000);
    
    function reposiciona6() {
    window.clearInterval(tempoAmigo);
    tempoAmigo=null;
      
      if (armorZero==false) {
      $("#background-game").append("<div id='amigo' class='anima3'></div>");		
      }
    }
  }

  function reposicionaInimigo2() {
    var tempoColisao4=window.setInterval(reposiciona4, 5000);
      
      function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4=null;
        
        if (armorZero==false) {
        
        $("#background-game").append("<div id=inimigo2></div");	
      }
    }	
  }

  function friendMovement() {
    xPosition = parseInt($("#amigo").css("left"));
    $("#amigo").css("left",xPosition+1);
          
    if (xPosition>906) {
    $("#amigo").css("left",0);			
    }
  }

  function enemy1Movement() {
    xPosition = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left",xPosition-speed);
    $("#inimigo1").css("top",yPosition);
      
    if (xPosition<=0) {
    yPosition = parseInt(Math.random() * 335);
    $("#inimigo1").css("left",700);
    $("#inimigo1").css("top",yPosition);			
    }
  }

  function enemy2Movement() {
    xPosition = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left",xPosition-3);
      
    if (xPosition<=0) {
      $("#inimigo2").css("left",775);
    }
  }

  function scoreboardRefresh() {	
    $("#scoreboard").html("<h2> Pontos: " + points + " Salvos: " + peopleRescued + " Perdidos: " + peopleDead + "</h2>");
  }
}

function reiniciagame() {
	somGameover.pause();
	$("#fim").remove();
  start();
}