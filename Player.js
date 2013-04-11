/**
* PNG Card Images
* Vectorized Playing Cards 1.3- http://code.google.com/p/vectorized-playing-cards/
* Copyright 2011 - Chris Aguilar
* Licensed under LGPL 3 - www.gnu.org/copyleft/lesser.html
*/

var Player = function(name,isComp,isDealer){
   this.dealer = false;
   this.hand = [];

   var playerInfo = document.createElement("div");
   playerInfo.className = "playerInfo";
   
   var cardPlayer = document.createElement("div");
   cardPlayer.className = "cardPlayer";
   var playerName = document.createElement("div");
   playerName.className = "playerName";
   playerName.innerHTML = name;
   var playerStatus = document.createElement("div");
   playerStatus.className = "status";
   var playerDealer = document.createElement("div");
   playerDealer.className = "dealer";
   if(!isComp){
      var playerPlay = document.createElement("input");
      playerPlay.className = "playerTurn playerPlay";
      playerPlay.type = "button";
      playerPlay.value = "Play";
      playerPlay.disabled = false;
      var playerPass = document.createElement("input");
      playerPass.className = "playerTurn playerPass";
      playerPass.type = "button";
      playerPass.value = "Pass";
      playerPass.disabled = false;
      this.play = playerPlay;
      this.pass = playerPass;
   }
   if(isDealer){
      $(playerDealer).addClass("Show");
      playerDealer.innerHTML = "D";
      this.dealer = true;
   }

   var currentTurn = document.createElement("div");
   currentTurn.className = "currentTurn";
   currentTurn.innerHTML = "Turn";

   var handContainer = document.createElement("div");
   handContainer.className = "hand";
   var compContainer = document.createElement("div");
   compContainer.className = "compHand";

   this.node = cardPlayer;
   this.info = playerInfo;
   this.name = playerName;
   this.stat = playerStatus;
   this.deal = playerDealer;
   this.isComp = isComp;
   this.handContainer = handContainer;
   this.compContainer = compContainer;
   this.turn = currentTurn;

   this.passHand = false;
   this.result = -1;

   playerInfo.appendChild(playerName);
   playerInfo.appendChild(playerStatus);
   playerInfo.appendChild(playerDealer);
   playerInfo.appendChild(currentTurn);
   if(!isComp){
      playerInfo.appendChild(playerPlay);
      playerInfo.appendChild(playerPass);
   }
   cardPlayer.appendChild(playerInfo);
   if(isComp){
      cardPlayer.appendChild(compContainer);
   }
   cardPlayer.appendChild(handContainer);

   var playContainer = document.getElementById("PlayersContainer");
   playContainer.appendChild(cardPlayer);
}

Player.prototype.sortHand = function(){
   this.hand.sort(function(a,b){
      return (a.value - b.value)
   });
}


Player.prototype.displayCards = function(){
   for(var i = 0; i < this.hand.length; i++){
      this.handContainer.appendChild(this.hand[i].node);
      $(this.hand[i].node).click({context: this.hand[i]}, function(e){
         var this_ptr = e.data.context;
         this_ptr.selectCard(this);   
      });
   }
}

Player.prototype.displayCompCards = function(){
   var cardImg = document.createElement("img");
   cardImg.className = "CardImage";
   cardImg.src = "PNG_Cards/Red_Back.png";
   var cardCounter = document.createElement("div");
   cardCounter.className = "CardCounter";
   cardCounter.innerHTML = "x "+this.hand.length;
   this.counter = cardCounter;
   this.compContainer.appendChild(cardImg);
   this.compContainer.appendChild(cardCounter);
}

var createDeck = function(){
   var cardValues = [3,4,5,6,7,8,9,10,11,12,13,14,15];
   var cardSuits = ['clubs','diamonds','hearts','spades'];
   this.cards = [];
   for(var i = 0; i < cardValues.length; i++){
      for(var j = 0; j < cardSuits.length; j++){                             
         this.cards.push(new Card(cardValues[i], cardSuits[j]));             
      }
   }
}

var Card = function(val, suit){                                              
   this.value = val;                                                         
   this.suit = suit;                                                         
   this.image = ""+val+"_of_"+suit+".png";

   var cardImg = document.createElement("img");
   cardImg.className = "CardImage";
   cardImg.src = "PNG_Cards/"+this.image;
   this.node = cardImg;                                   
}

Card.prototype.selectCard = function(cardImg){
   if($(cardImg).hasClass("selectedCard")){
      $(cardImg).removeClass("selectedCard"); 
   }else{
      $(cardImg).addClass("selectedCard"); 
   }
}
