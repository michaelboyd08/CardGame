/**
 * @author Michael Boyd
 * 
 * 
 *
 * 
 *
 * 
 *
 * 
 */

var initialize = function(){
   game = new CardGame();
}

var CardGame = function(){
   this.players = [];
   var this_ptr = this;
   this.deck = new createDeck();   
   this.shuffleContainer = document.getElementById("displayDeck");
   //this.createContainer();

   this.startGameBtn = document.getElementById("startGame");
   this.addPlayerBtn = document.getElementById("addPlayer");
   this.nextTrick = document.getElementById("nextTrick");
   this.nextTrick.disabled = true;
   // Start Game Button
   // Shuffles the deck 3 times, deals cards, and sorts players hands
   // Display Cards for Human and Computer Players
   $("#startGame").click({context: this_ptr}, function(e){
      var this_ptr = e.data.context;
      var players = this_ptr.players;
      this_ptr.startGameBtn.disabled = true;
      this_ptr.addPlayerBtn.disabled = true;
      this_ptr.results = 1;

      // Shuffle deck 3 times
      for(var i = 0; i < 5; i++){
         this_ptr.shuffleCards();
      }
      // Deal out cards
      this_ptr.dealCards();
      for(var j = 0; j < players.length; j++){
         players[j].sortHand();
         if(!players[j].isComp){
            players[j].displayCards();
         }else{
            players[j].displayCompCards();
            //players[j].displayCards();
         }
      }
      this_ptr.startGame();
   });

   // Attach add player to enter key
   $("#inputName").keypress({this: this_ptr}, function(e){
      if(e.keyCode == 13){
         e.preventDefault();
         var name = $("#inputName").val();
         if(name != ""){
            // First Player entered is Human
            if(e.data.this.players.length == 0){
               e.data.this.players.push(new Player(name,false,true));
            }
            // Computer Players entered
            else{
               e.data.this.players.push(new Player(name,true,false));
            }
         }
         $("#inputName").val("");
      }
   });

   // Attach add player button handler
   $("#addPlayer").click({this: this_ptr}, function(e) {
      var name = $("#inputName").val();
      if(e.data.this.players.length == 0){
         e.data.this.players.push(new Player(name,true));
      }else{
         e.data.this.players.push(new Player(name,false));
      }
      $("#inputName").val("");
   });

   $("#nextTrick").click({context: this}, function(e){
      var this_ptr = e.data.context;
      this_ptr.startTrick();
   });

}

CardGame.prototype.startGame = function(){
   this.firstHand = true;
   var this_ptr = this;
   $("#TrickContainer").addClass("Show");
   for(var i = 0; i < this.players.length; i++){
      if(!this.players[i].isComp){
         $(this.players[i].play).addClass("Show");
         $(this.players[i].pass).addClass("Show");
         $(this.players[i].turn).addClass("Show");
         // Play card in trick
         $(this.players[i].play).click({context: this_ptr, player: this.players[i]}, function(e){
            var this_ptr = e.data.context;
            var player = e.data.player;
            if(!e.data.player.isComp){
               if(this_ptr.playCardsInTrick(player)){
                  this_ptr.autoPlayComp(1);
                  if(!this_ptr.isValidPlayers()){
                     this_ptr.clearTrick(true);
                  }else{
                     // Player still has cards left
                     player.play.disabled = false;
                     player.pass.disabled = false;
                  }
               }
            }
         });

         // Pass during trick
         $(this.players[i].pass).click({context: this_ptr, player: this.players[i]}, function(e){
            var this_ptr = e.data.context;
            var player = e.data.player;
            
            // clean up references
            player.passHand = true;
            player.play.disabled = true;
            player.pass.disabled = true;
            //$(player.node).addClass("passedHand");
            $(player.turn).removeClass("Show");
            while(this_ptr.isValidPlayers()){
               this_ptr.autoPlayComp(1);
            }
            this_ptr.clearTrick(false);
         });
      }
   }
}

CardGame.prototype.isValidPlayers = function(){
   var validPlayers = 0;
   var lastPlayedIndex = 0;
   for(var i = 0; i < this.players.length; i++){
      if(!this.players[i].passHand && (this.players[i].result < 0)){
         validPlayers++;
         lastPlayedIndex = i;
      }
   }
   if(validPlayers > 1){
      return true;
   }else{
      $(this.players[lastPlayedIndex].turn).addClass("Show");
      return false;
   }
}

CardGame.prototype.clearTrick = function(isPlayerTurn){
   // Check for game over
   if(this.results == this.players.length){
      alert("Game Over");
      console.log("results");
   }else{
      //alert("clear trick");
      for(var i = 0; i < this.cardTrick.node.children.length; i++){
         this.cardTrick.node.removeChild(this.cardTrick.node.children[i]);
         i--;
      }
      this.firstHand = true;
      this.cardTrick.hand = [];

      // Program AI rule
      this.cardTrick.rule = "single";
      this.nextTrick.disabled = false;
      $("#nextTrickContainer").addClass("highLight");
      //this.startTrick();
   }
}

CardGame.prototype.startTrick = function(){
   this.nextTrick.disabled = true;
   $("#nextTrickContainer").removeClass("highLight");
   var index = 0;
   var cards = [];
   for(var i = 0; i < this.players.length; i++){
      if(this.players[i] == this.cardTrick.lastPlayed){
         index = i;
         $(this.players[i].turn).addClass("Show");
      }
      // Reset players infor
      this.players[i].passHand = false;
   }

   if(this.players[index].isComp){
      //alert("Computer Start Trick");
      // Program AI here
      cards.push(this.players[index].hand[0]);
      this.cardTrick.setValues(cards,this.players[index]);
      this.autoPlayComp(index);
      // check for player out automate rest tricks
      if(this.players[0].result > 0){
         while(this.isValidPlayers()){
               this.autoPlayComp(1);
            }
            this.clearTrick(false);
      }else{
         this.players[0].play.disabled = false;
         this.players[0].pass.disabled = false;
      }
   }else{
      //alert("Start Trick");

      // Check for player out
      if(this.players[index].result > 0){
         while(this.isValidPlayers()){
               this.autoPlayComp(1);
            }
            this.clearTrick(false);
      }else{
         this.players[index].play.disabled = false;
         this.players[index].pass.disabled = false;
      }
   }
}

CardGame.prototype.autoPlayComp = function(index){
   for(var i = index; i < this.players.length; i++){
      $(this.players[i].turn).addClass("Show");
      //alert("comp turn");
      if(this.players[i].isComp && !this.players[i].passHand){
         this.compPlayCardsInTrick(this.players[i]);
      }
      // Previously passed hand
      else{
         $(this.players[i].turn).removeClass("Show");
      }   
   }
   // Get rid of hard code
   if(!this.players[0].passHand){
      $(this.players[0].turn).addClass("Show");
   }
}

CardGame.prototype.compPlayCardsInTrick = function(player){
   var cards = [];
   var idxs = [];
   var isPass = true;
   for(var i = 0; i < player.hand.length; i++){
      if(this.cardTrick.rule == "single"){
         if(cards.length >= 1){
            cards[0] = player.hand[i];
         }else{
            cards.push(player.hand[i]);
         }
         if(this.firstHand){
            idxs.push(i);
            player.counter.innerHTML = "x "+(player.hand.length-1);
            this.playCompHand(player,cards,idxs);
            isPass = false;
            break;
         }
         else if(this.cardTrick.isValid(cards,player)){
            // Extract card to be played
            idxs.push(i);
            player.counter.innerHTML = "x "+(player.hand.length-1);
            this.playCompHand(player,cards,idxs);
            isPass = false;
            break;
         }
      }
   }

   // Passed Hand this turn
   if(isPass){
      if(this.cardTrick.lastPlayed != player){
         player.passHand = true;
         //$(player.node).addClass("passedHand");
      }
      $(player.turn).removeClass("Show");
   }
}

CardGame.prototype.playCardsInTrick = function(player){
   var cards = [];
   var cardIdxs = [];
   for(var i = 0; i < player.hand.length; i++){
      if($(player.hand[i].node).hasClass("selectedCard")){
         cards.push(player.hand[i]);
         cardIdxs.push(i);
      }
   }
   // Create trick from first hand played
   if(this.firstHand){
      this.cardTrick = new Trick(cards,player);
      this.playHand(player,cards,cardIdxs);
      return true;
   }
   // Validate and play next hand
   else{
      if(this.cardTrick.isValid(cards,player)){
         this.playHand(player,cards,cardIdxs);
         return true;
      }else{
         alert("invalid card");
         return false;
      }
   }
}

CardGame.prototype.playCompHand = function(player,cards,cardIdxs){
   for(var i = 0; i < cards.length; i++){
      if(this.firstHand){
         $(cards[i].node).addClass("firstCard");
         this.firstHand = false;
      }else{
         $(cards[i].node).addClass("playedCard");
      }
      this.cardTrick.node.appendChild(cards[i].node);
      player.hand.splice(cardIdxs[i],1);
      $(player.turn).removeClass("Show");

      // Comp finished playing cards in hand
      if(player.hand.length == 0){
         alert("comp out");
         player.result = this.results++;
      }
   }
}

CardGame.prototype.playHand = function(player,cards,cardIdxs){
   for(var i = 0; i < cards.length; i++){
      var card = cards[i].node.parentNode.removeChild(cards[i].node);
      $(card).removeClass("selectedCard");
      if(this.firstHand){
         $(card).addClass("firstCard");
         this.firstHand = false;
      }else{
         $(card).addClass("playedCard");
      }
      this.cardTrick.node.appendChild(card);
      player.hand.splice(cardIdxs[i],1);
   }
   player.play.disabled = true;
   player.pass.disabled = true;
   $(player.turn).removeClass("Show");
   
   // Finished playing all cards in hand
   if(player.hand.length == 0){
      alert("player out");
      player.result = this.results++;
   }
}

CardGame.prototype.createContainer = function(){
   var j = 0;
   for(var i = 0; i < this.deck.cards.length; i++){
      var card = document.createElement("img");
      card.className = "CardImage";
      card.src = "PNG_Cards/"+this.deck.cards[i].image;
      if(i % 13 == 0 && i != 0){
         j++;
      }
      console.log("i: "+i);
      console.log("j: "+j);
      this.shuffleContainer.children[j].appendChild(card);
   }
}

CardGame.prototype.displayShuffle = function(){
   var j = 0;
   var i = 0;
   var k = 0;
   while(j != 4){
      if(i % 13 == 0 && i != 0){
         j++;
         i = 0; 
      }
      if(j == 4)
         break;
      console.log("i: "+i);
      console.log("j: "+j);
      this.shuffleContainer.children[j].children[i].src = "PNG_Cards/"+this.deck.cards[k].image; 
      i++;
      k++;
   }
}


CardGame.prototype.shuffleCards = function(){
   var i = this.deck.cards.length, j, tempi, tempj;
   if(i == 0) return false;
   while(--i){
      j = Math.floor(Math.random() * (i+1));
      tempi = this.deck.cards[i];
      tempj = this.deck.cards[j];
      this.deck.cards[i] = tempj;
      this.deck.cards[j] = tempi;
   }
}

CardGame.prototype.dealCards = function(){
   var j = 0;
   for(var i = 0; i < this.deck.cards.length; i++){
      // loop back around and deal
      if(j == this.players.length){
         j = 0;
      }
      this.players[j].hand.push(this.deck.cards[i]);
      j++;
   }
}

$(document).ready(initialize);
