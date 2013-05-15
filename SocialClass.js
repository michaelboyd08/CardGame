/**
 * @author Michael Boyd
 * 
 * Social Class Card Game Application
 * This is a single player prototype of the card game Social Class.
 * The name of this game has many aliases including Scum, Kings, 
 * Presidents.
 *
 * 3/12/13 - Player can only play singles. More rules/expanded 
 *           functionality will come soon.
 * 
 * 4/23/13 - Player can play single, pairs, and quads.
 *
 */

/**
 * Initialize CardGame Object
 */
var config = {
   debug: {
      mode: false,
      deal: false
   },
   stat: {
      pres: "P",
      vpres: "VP",
      vscum: "VS",
      scum: "S"
   },
   delay: 1500,
};

var initialize = function(){
   new CardGame();
   var isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
   if(isMobile){
      //alert("Mobile browser");
   }
}

/**
 * CardGame Object
 * 
 * Main object reference. Attachs event handlers for UI buttons:
 * Add Player, Start Game, and Next Trick.
 * Maintains references to player and trick objects throughout game
 */
var CardGame = function(){
   this.players = [];
   this.timeoutIds = [];
   this.resultsIdxs = [];
   this.deck = new Deck();
   this.cardTrick = new Trick(0,0);
   this.shuffleContainer = document.getElementById("displayDeck");
   //this.createContainer();
   this.isGameStarted = false;
   this.isFirstGame = true;
   this.isFirstSwap = true;

   this.startGameBtn = document.getElementById("startGameBtn");
   this.addPlayerBtn = document.getElementById("addPlayer");
   this.nextTrickBtn = document.getElementById("nextTrickBtn");
   //this.swapCardsBtn = document.getElementById("swapCards");

   //this.nextTrickBtn.disabled = true;
   //this.swapCardsBtn.disabled = true;

   $("#nextTrickBtn").prop("disabled",true);
   $("#swapCardsBtn").prop("disabled",true);

   this.nextTrick = document.getElementById("nextTrick");
   //$("#inputName").focus();

   // Start Game Button
   // Shuffles the deck 5 times, deals cards, and sorts players hands
   // Display Cards for Human and Computer Players
   $("#startGame").click({context: this}, function(e){
      var this_ptr = e.data.context;
      var players = this_ptr.players;

      // Verify players have been created
      if(players.length > 3 && players.length <= 7){
         this_ptr.startGameBtn.disabled = true;
         this_ptr.addPlayerBtn.disabled = true;
         this_ptr.results = 1;
         this_ptr.isGameStarted = true;

         // Hide initial dialog
         if(this_ptr.isFirstGame){
            $("#ConfigArea").removeClass("Show");
            var startGameDiv = $("#startGame")[0].parentNode.removeChild($("#startGame")[0]);
            $(startGameDiv).addClass("buttons");
            $("#gameButtons").append(startGameDiv);
         }

         // Clear trick container
         this_ptr.cardTrick.clearTrick();
         this_ptr.cardTrick.cleared.innerHTML = "";
         $("#UserButtons").removeClass("cleared");
         $("#GameContainer").removeClass("cleared");
         $("#startGame").removeClass("highLight");
         // Remove padding to fix shifting
         $(this_ptr.players[0].node).removeClass("firstHand");

         if(!config.debug.deal){
            // Shuffle deck 5 times
            for(var i = 0; i < 5; i++){
               this_ptr.shuffleCards();
            }
            // Deal out cards
            this_ptr.dealCards();
         }else{
            var cardValues1 = [7,7,7,9,14,15];
            var cardValues2 = [8,9,9,9,10,11];
            var cardValues3 = [10,10,10,10,11,12];
            var cardValues4 = [4,8,9,10,13,14];
            var values = [];
            values.push(cardValues1);
            values.push(cardValues2);
            values.push(cardValues3);
            values.push(cardValues4);
            var suits = ['clubs','diamonds','hearts','spades'];
         }
         for(var j = 0; j < players.length; j++){
            if(config.debug.deal){
               this_ptr.debugDeal(values[j],suits[j],players[j]);
            }
            players[j].sortHand();
            if(!players[j].isComp){
               if(this_ptr.isFirstGame){
                  // Add Human to DOM
                  $("#GameContainer").append(players[j].node);
                  players[j].displayCards();
               }else{
                  players[j].displayCards();
               }
            }else{
               if(this_ptr.isFirstGame){
                  // Add Comp to DOM
                  $("#PlayersContainer").append(players[j].node);

                  // 4 or 5 players layout
                  if(players.length >= 4 && players.length <= 5){
                     // NOTE: "2" is from CSS sheet
                     var factor = j - 1;
                     if(players.length === 4){
                        players[j].node.style.left = ((factor * 30) + 5) + "%";
                     }else{
                        players[j].node.style.left = ((factor * 25) + 2) + "%";
                     }
                  }
                  players[j].displayCompCards(true);
                  if(config.debug.mode){
                     players[j].displayCards();
                     // Move Hand to bottom of view
                     players[j].node.removeChild(players[j].handContainer);
                     $(players[j].handContainer).addClass("debugHand");
                     $("#GameContainer").append(players[j].handContainer);
                  }
               }else{
                  players[j].displayCompCards(false);
                  players[j].giveCards = players[j].getGiveCards(true,this_ptr.players.length);
                  if(config.debug.mode){
                     players[j].displayCards();
                  }
               }
            }

            // Assign Game Status Results
            if(!this_ptr.isFirstGame){
               this_ptr.assignStatus(players[j],j);
            }

            $(players[j].trickStatus).removeClass("Show");
            players[j].trickStatus.innerHTML = "OUT";
            /*
            players[j].playedCard = false;
            players[j].passHand = false;
            players[j].result = -1;
            */
         }

         //this_ptr.startGame();

         if(this_ptr.isFirstGame){
            this_ptr.startGame();
         }else{
            this_ptr.handleSwap();
         }
         
      }else{
         alert("Min Players is 4, Max is 7 - Add More Players/Click Refresh");
      }
   });

   // Attach add player to enter key
   $("#inputName").keypress({context: this}, function(e){
      var this_ptr = e.data.context;
      if(e.keyCode === 13){
         e.preventDefault();
         var name = $("#inputName").val();
         this_ptr.addPlayer(name);
      }
   });

   // Attach add player button handler
   $("#addPlayer").click({context: this}, function(e) {
      var this_ptr = e.data.context;
      var name = $("#inputName").val();
      this_ptr.addPlayer(name);
   });

   $(this.nextTrickBtn).click({context: this}, function(e){
      var this_ptr = e.data.context;
      this_ptr.startTrick();
   });

}

CardGame.prototype.addPlayer = function(name){
   if(name !== "" && !this.isGameStarted){
      // First Player entered is Human
      if(this.players.length === 0){
         this.players.push(new Player(name,(this.players.length+1),false,true));
         $("#inputName").prop("placeholder","Enter Computer Players");
      }
      // Computer Players entered
      else{
         this.players.push(new Player(name,(this.players.length+1),true,false));
      }
   }
   $("#inputName").val("");
}

// NOTE: Need to think of clever way to swap cards
// Problem: two references to cards
// 1) javascript array
// 2) DOM (display cards)
// 
// Solution: Need to sort both references.
// DOM sort is expensive. Plan to sort array hand
// then displayCards like normal but remove preivous DOM
//
// Reason: Want to have visibility on cards received 
// and cards given away


CardGame.prototype.handleSwap = function(){
   $("#UserButtons").addClass("cleared");
   $("#GameContainer").addClass("cleared");
   $("#swapCards").addClass("highLight");
   $("#startGame").addClass("endTrick");
   $("#swapCardsBtn").prop("disabled",false);

   if(this.isFirstSwap){
      $("#swapCardsBtn").click({context: this}, function(e){
         var this_ptr = e.data.context;
         var cards = [];
         var cardIdxs = [];
         var tempCards = [];
         var invalid = false;
         for(var i = 0; i < this_ptr.players[0].hand.length; i++){
            if($(this_ptr.players[0].hand[i].node).hasClass("selectedCard")){
               $(this_ptr.players[0].hand[i].node).removeClass("selectedCard");
               cards.push(this_ptr.players[0].hand[i]);
               cardIdxs.push(i);
            }
         }
         if(cards.length === 1 || cards.length === 2){
            // P and VP
            if(this_ptr.players[0].result <= 2){
               if((this_ptr.players[0].result === 1 && cards.length === 2) ||
                  (this_ptr.players[0].result === 2 && cards.length === 1)){
                  this_ptr.players[0].giveCards = cards;
                  this_ptr.players[0].giveCardsIdxs = cardIdxs;
                  this_ptr.initiateSwap();
                  return;
               }
            }
            // S and VS
            else if(this_ptr.players[0].result >= this_ptr.players.length-1){
               tempCards = this_ptr.players[0].getGiveCards(false,this_ptr.players.length);
               if(cards.length === tempCards.length){
                  for(var j = 0; j < tempCards.length; j++){
                     if(cards[j] !== tempCards[j]){
                        invalid = true;
                        break;
                     }
                  }
                  if(!invalid){
                     this_ptr.players[0].giveCards = cards;
                     this_ptr.players[0].giveCardsIdxs = cardIdxs;
                     this_ptr.initiateSwap();
                     return;
                  }
               }
            }
         }

         // Display Error alert for non middle men
         if((this_ptr.players[0].result <= 2) || (this_ptr.players[0].result >= this_ptr.players.length-1)){
            if(this_ptr.players[0].result <= 2){
               alert("Invalid Cards - Select Valid Card(s)");
            }else if(this_ptr.players[0].result === this_ptr.players.length-1){
               alert("Invalid Cards - Select Highest Card in Hand");
            }else{
               alert("Invalid Cards - Select 2 Highest Cards in Hand");
            }
         }
         // Middle men functionality
         else{
            this_ptr.initiateSwap();
         }
      });
      this.isFirstSwap = false;
   }
}

CardGame.prototype.initiateSwap = function(){
   $("#UserButtons").removeClass("cleared");
   $("#GameContainer").removeClass("cleared");
   $("#swapCards").removeClass("highLight");
   $("#startGame").removeClass("endTrick");
   $("#swapCardsBtn").prop("disabled",true);

   this.swapCards();
   this.sortAndDisplay();
   this.startGame();
}

CardGame.prototype.sortAndDisplay = function(){
   for(var i = 0; i < this.players.length; i++){
      console.log("player index: "+i);
      this.players[i].removeDisplayedCards();
      this.players[i].sortHand();
      if(config.debug.mode){
         this.players[i].displayCards();
      }else{
         if(!this.players[i].isComp){
            this.players[i].displayCards();
         }
      }
   }
}

CardGame.prototype.giveCards = function(resIdx,card){
   // Add card to player hand reference
   // Remove card select 
   $(card.node).off("click");
   this.players[resIdx].hand.push(card);

   // Add card to player hand DOM
   if(config.debug.mode){
      $(card.node).addClass("swappedCard");
      this.players[resIdx].handContainer.appendChild(card.node);
   }else{
      if(!this.players[resIdx].isComp){
         $(card.node).addClass("swappedCard");
         this.players[resIdx].handContainer.appendChild(card.node);
      }
   }
   
}

CardGame.prototype.swapCards = function(){
   // Start with Scum and Vice Scum
   for(var i = this.resultsIdxs.length-1; i >= 0; i--){
      var cards = [];
      var index = this.resultsIdxs[i];
      console.log("in swap");

      //cards = this.players[index].getGiveCards();
      cards = this.players[index].giveCards;
      for(var k = cards.length-1; k >= 0; k--){
         console.log("swapped card: "+cards[k].image);
         if(config.debug.mode){
            this.players[index].handContainer.removeChild(cards[k].node);
         }else{
            if(!this.players[index].isComp){
               this.players[index].handContainer.removeChild(cards[k].node);
            }
         }
         
         // Scum and Vice Scum give highest
         if(this.players[index].result >= this.players.length-1){
            //this.players[index].hand.splice(this.players[index].hand.length-1,1);
            // Scum give Pres
            if(this.players[index].result === this.players.length){
               this.giveCards(this.resultsIdxs[0],cards[k]);
            }
            // Vice Scum give Vice Pres
            else{
               this.giveCards(this.resultsIdxs[1],cards[k]);
            }
         }
         // Pres and Vice Pres give lowest
         else{
            //this.players[index].hand.splice(0,1);
            // Pres give Scum
            if(this.players[index].result === 1){
               this.giveCards(this.resultsIdxs[3],cards[k]);
            }
            // Vice Pres give Vice Scum
            else{
               this.giveCards(this.resultsIdxs[2],cards[k]);
            }
         }
      }

      // Remove cards from giver's hand
      for(var j = this.players[index].giveCardsIdxs.length-1; j >= 0; j--){
         this.players[index].hand.splice(this.players[index].giveCardsIdxs[j],1);
      }
      console.log("see results");
   }
}

CardGame.prototype.assignStatus = function(player,index){
   // Attempt to remove status class name
   $(player.status).removeClass("Pres");
   $(player.status).removeClass("vicePres");
   $(player.status).removeClass("viceScum");
   $(player.status).removeClass("Scum");
   $(player.status).addClass("ShowLine")

   // President
   if(player.result === 1){
      player.status.innerHTML = config.stat.pres;
      $(player.status).addClass("Pres");
      this.resultsIdxs[0] = index;
   }
   // Vice President
   else if(player.result === 2){
      player.status.innerHTML = config.stat.vpres;
      $(player.status).addClass("vicePres");
      this.resultsIdxs[1] = index;
   }
   // Vice Scum
   else if(player.result === this.players.length-1){
      player.status.innerHTML = config.stat.vscum;
      $(player.status).addClass("viceScum");
      this.resultsIdxs[2] = index;
   }
   // Scum
   else if(player.result === this.players.length){
      player.status.innerHTML = config.stat.scum;
      $(player.status).addClass("Scum");
      this.resultsIdxs[3] = index;
   }
   // Clear previous text if there for
   // middle men
   else{
      $(player.status).removeClass("ShowLine");
      player.status.innerHTML = "";
   }
}

/**
 * Begins the game after players have been added.
 * Reveals Players and Trick Container.
 * Attachs event handler for human player UI buttons: Play & Pass
 *
 */
CardGame.prototype.startGame = function(){
   this.firstHand = true;
   this.playersOut = 0;
   this.passedHands = 0;
   var this_ptr = this;
   $("#TrickContainer").addClass("Show");
   $("#nextTrick").addClass("Show");
   $("#swapCards").addClass("Show");
   for(var i = 0; i < this.players.length; i++){
      this.players[i].playedCard = false;
      this.players[i].passHand = false;
      this.players[i].result = -1;
      if(!this.players[i].isComp){
         $(this.players[i].play).addClass("Show");
         $(this.players[i].pass).addClass("Show");
         $(this.players[i].turn).addClass("Show");

         this.players[i].play.disabled = false;
         this.players[i].pass.disabled = true;
         // Play card in trick
         if(this.isFirstGame){
            console.log("Play and Pass Attached");
            $(this.players[i].play).click({context: this_ptr, player: this.players[i]}, function(e){
               var this_ptr = e.data.context;
               var player = e.data.player;
               if(!e.data.player.isComp){
                  this_ptr.playCardsInTrick(player);
                  if(player.playedCard){
                     player.playedCard = false;
                     // Clear trick on player going out
                     if(player.result > 0 || player.trumpPlayed){
                        this_ptr.clearTrick();
                     }else{
                        this_ptr.automatePlay(1,false);
                     }
                  }
               }
            });

            // Pass during trick
            $(this.players[i].pass).click({context: this_ptr, player: this.players[i]}, function(e){
               var this_ptr = e.data.context;
               var player = e.data.player;
               
               // clean up references
               this_ptr.passedHands++;
               player.playedCard = false;
               player.passHand = true;
               player.play.disabled = true;
               player.pass.disabled = true;
               $(player.handStatus).addClass("Show");
               $(player.turn).removeClass("Show");
               this_ptr.automatePlay(1,true);
            });
            this.isFirstGame = false;
         }
      }
   }
}

/**
 * Automates play for computer players
 */
CardGame.prototype.automatePlay = function(index,isPassed){
   var factor = 1;
   var timeDelay = config.delay;
   $(this.players[index].turn).addClass("Show");
   for(var i = index; i < this.players.length; i++){
      this.setAutoPlayTimer(i,factor++,timeDelay);
   }

   var delay = ((factor-1)*timeDelay)+500;
   //console.log("delay: "+delay);
   this.controlId = setTimeout(this.resumePlay,delay,this,isPassed);
}

/**
 * Checks and validates if a more than on player can play/pass
 */
CardGame.prototype.isValidPlayers = function(){
   var validPlayers = 0;
   var lastPlayedIndex = 0;
   for(var i = 0; i < this.players.length; i++){
      if(!this.players[i].passHand && (this.players[i].result < 0)){
         validPlayers++;
         lastPlayedIndex = i;
         console.log("valid player: "+this.players[i].name.innerHTML);
      }
   }
   if(validPlayers > 1){
      console.log("valid players true");
      return true;
   }else{
      $(this.players[lastPlayedIndex].turn).addClass("Show");
      console.log("valid players FALSE");
      return false;
   }
}

/**
 * Clears the trick. Removes cards from trick container
 * and resets players/trick properties
 */
CardGame.prototype.clearTrick = function(isPlayerTurn){
   this.firstHand = true;
   // Check for game over
   if(!(this.results >= this.players.length)){
      this.cardTrick.cleared.innerHTML = "Cleared!";

      $("#UserButtons").addClass("cleared");
      $("#GameContainer").addClass("cleared");
      //$(this.cardTrick.header).addClass("cleared");
      //$(this.cardTrick.container).addClass("cleared");

      // Program AI rule
      this.cardTrick.rule = "";
      this.cardTrick.trickLabel.innerHTML = "Trick Rule";
      this.nextTrickBtn.disabled = false;
      $(this.nextTrick).addClass("highLight");
      $("#swapCards").addClass("endTrick");
   }
   // Game Over
   else{
      for(var j = 0; j < this.players.length; j++){
         if(this.players[j].result < 0){
            this.players[j].result = this.results;
            this.players[j].trickStatus.innerHTML += " - "+this.players[j].result;
            $(this.players[j].trickStatus).addClass("Show");
            console.log("cards left");
            for(var k = 0; k < this.players[j].hand.length; k++){
               if(config.debug.mode){
                  $(this.players[j].hand[k].node).off("click");
                  $(this.players[j].hand[k].node).removeClass("playerCard");
                  this.players[j].handContainer.removeChild(this.players[j].hand[k].node);
               }else{
                  console.log("remove card select");
                  console.log(this.players[j].hand[k].image);
                  //console.log("card: "+this.players[j].hand[k].image);
                  $(this.players[j].hand[k].node).off("click");
                  if(!this.players[j].isComp){
                     $(this.players[j].hand[k].node).removeClass("playerCard");
                     this.players[j].handContainer.removeChild(this.players[j].hand[k].node);
                  }
               }
               this.players[j].hand.splice(k,1);
               k--;
            }
            if(this.players[j].isComp){
               this.players[j].counter.innerHTML = "x0";
            }
            break;
         }
      }
      // Show game over and next option
      this.cardTrick.trickLabel.innerHTML = "Trick Rule";
      this.cardTrick.cleared.innerHTML = "Game Over";
      $("#UserButtons").addClass("cleared");
      $("#GameContainer").addClass("cleared");
      $("#startGame").addClass("highLight");
      //alert("Game Over");
      console.log("results");
      this.startGameBtn.disabled = false;
   }
}

/**
 * Initiate Trick. Player who won last trick leads
 */
CardGame.prototype.startTrick = function(){
   // Remove cards from trick container
   this.cardTrick.clearTrick();
   this.nextTrickBtn.disabled = true;
   this.cardTrick.cleared.innerHTML = "";
   $("#UserButtons").removeClass("cleared");
   $("#GameContainer").removeClass("cleared");
   //$(this.cardTrick.header).removeClass("cleared");
   //$(this.cardTrick.container).removeClass("cleared");
   $(this.nextTrick).removeClass("highLight");
   $("#swapCards").removeClass("endTrick");

   // Remove padding to fix shifting
   $(this.players[0].node).removeClass("firstHand");

   var index = 0;
   var cards = [];
   var isPlayerOut = false;
   // Looks to decide which player will begin next trick
   // Either last played or next player in turn if last
   // played went out on previous turn
   console.log("Last Played/Won Trick: "+this.cardTrick.lastPlayed.name.innerHTML);
   for(var i = 0; i < this.players.length; i++){
      if(isPlayerOut){
         if(this.players[i].result < 0){
            index = i;
            break;
         }
      }else{
         if(this.players[i] === this.cardTrick.lastPlayed){
            // Check if player is out
            if(this.players[i].result > 0){
               isPlayerOut = true;
               this.playersOut++;
               if(i === this.players.length-1){
                  i = -1;
               }
               continue;
            }else{
               index = i;
               break;
            }
         }
      }
   }

   // Re factor later
   for(var j = 0; j < this.players.length; j++){
      // Reset players info
      this.players[j].passHand = false;
      this.players[j].trumpPlayed = false;
      $(this.players[j].handStatus).removeClass("Show");
   }

   console.log("new trick");
   this.passedHands = this.playersOut;
   if(this.players[index].isComp){
      console.log("comp start");

      // NOTE: Add here the AI for comp starting with highest possible
      // IE: quads, pairs, singles
      this.cardTrick.rule = "Singles";
      cards.push(this.players[index].hand[0]);
      this.cardTrick.setValues(cards,this.players[index]);
      // If Human out, act like pass
      if(this.players[0].result > 0){
         this.automatePlay(index,true);
      }else{
         this.automatePlay(index,false);
      }
   }else{
      console.log("human start");
      console.log("human cards left: "+this.players[index].hand.length);
      console.log("human results: "+this.players[index].result);
      this.players[index].play.disabled = false;
      this.players[index].pass.disabled = true;
      $(this.players[index].turn).addClass("Show");
   }
}

CardGame.prototype.resumePlay = function(this_ptr,isPassed){
   this_ptr.timeoutIds = [];
   clearTimeout(this_ptr.controlId);
   this_ptr.controlId = null
   if(this_ptr.isValidPlayers()){
      if(isPassed){
         this_ptr.automatePlay(1,true);
      }else{
         console.log("human cards left: "+this_ptr.players[0].hand.length);
         console.log("human results: "+this_ptr.players[0].result);
         this_ptr.players[0].play.disabled = false;
         this_ptr.players[0].pass.disabled = false;
         $(this_ptr.players[0].turn).addClass("Show");
      }
   }else{
      this_ptr.clearTrick();
   }
}

CardGame.prototype.exitAutoPlay = function(){
   console.log("player out");
   clearTimeout(this.controlId);
   this.controlId = null
   for(var i = this.players.length-1; i >= 0; i--){
      clearTimeout(this.timeoutIds[i]);
   }
   this.timeoutIds = [];
   this.clearTrick();
}

CardGame.prototype.setAutoPlayTimer = function(index,factor,timeDelay){
   var this_ptr = this;
   this.timeoutIds.push(setTimeout(this.autoPlayComp,(factor * timeDelay),index,this_ptr));
}

/**
 * Automated card playing for computer player
 */
CardGame.prototype.autoPlayComp = function(idx,this_ptr){
   //alert("comp turn");
   var isOver = false;
   console.log("Comp playing: "+this_ptr.players[idx].name.innerHTML);
   console.log("Comp passed hand: "+this_ptr.players[idx].passHand);
   console.log("Comp results: "+this_ptr.players[idx].result);
   console.log("Cards left: "+this_ptr.players[idx].hand.length);
   if(this_ptr.players[idx].isComp && !this_ptr.players[idx].passHand 
      && this_ptr.players[idx].result < 0){
      // Check to prevent player who already won trick from playing again
      if(this_ptr.players[idx] === this_ptr.cardTrick.lastPlayed 
         && this_ptr.passedHands === this_ptr.players.length-1){
         this_ptr.exitAutoPlay();
         isOver = true;
      }else{
         // Computer try to play hand
         this_ptr.compPlayCardsInTrick(this_ptr.players[idx]);
         if(this_ptr.players[idx].result > 0 || this_ptr.players[idx].trumpPlayed){
            this_ptr.exitAutoPlay();
            isOver = true;
         }
      }
   }
   // Previously passed hand
   else{
      console.log("comp prev passed");
      $(this_ptr.players[idx].turn).removeClass("Show");
   }

   if(!isOver){
      // Add turn label for next player if valid
      if((idx+1) < this_ptr.players.length){
         $(this_ptr.players[idx+1].turn).addClass("Show");
      }
   }
}

/**
 * Computer player tries to play a valid card
 */
CardGame.prototype.compPlayCardsInTrick = function(player){
   var cards = [];
   var idxs = [];
   var isPass = true;
   for(var i = 0; i < player.hand.length; i++){
      if(this.cardTrick.rule !== ""){
         if(this.cardTrick.rule !== "Singles" && ((i === (player.hand.length-(this.cardTrick.hand.length-1))) || 
         player.hand.length < this.cardTrick.hand.length)){
            console.log("prevent index out of bounds break");
            break;
         }else{
            // Push player hand onto cards array
            for(var j = 0; j < this.cardTrick.hand.length; j++){
               if(cards.length < this.cardTrick.hand.length){
                  cards.push(player.hand[i+j]);
                  idxs.push(i+j);
               }else{
                  cards[j] = player.hand[i+j];
                  idxs[j] = i+j;
               }
            }

            console.log("i: "+i);
            // Try to play hand
            if(this.firstHand || this.cardTrick.isValid(cards,player)){
               player.counter.innerHTML = "x"+(player.hand.length-cards.length);
               this.playHand(player,cards,idxs,true);
               isPass = false;
               break;
            }
         }
      }
   }

   // Passed Hand this turn
   if(isPass){
      if(this.cardTrick.lastPlayed !== player){
         player.passHand = true;
         $(player.handStatus).addClass("Show");
      }
      this.passedHands++;
      $(player.turn).removeClass("Show");
      console.log("COMP PASSED HAND");
   }
}

/**
 * Human players tries to play a valid card in trick
 */
CardGame.prototype.playCardsInTrick = function(player){
   var cards = [];
   var cardIdxs = [];
   for(var i = 0; i < player.hand.length; i++){
      if($(player.hand[i].node).hasClass("selectedCard")){
         cards.push(player.hand[i]);
         cardIdxs.push(i);
      }
      if($(player.hand[i].node).hasClass("swappedCard")){
         $(player.hand[i].node).removeClass("swappedCard");
      }
   }
   // Create trick from first hand played
   if(this.firstHand){
      this.cardTrick.setValues(cards,player);
      if(this.cardTrick.isValidCards){
         this.playHand(player,cards,cardIdxs,false);
      }
   }else{
      // Validate and play next hand
      if(this.cardTrick.isValid(cards,player)){
         this.playHand(player,cards,cardIdxs,false);
      }
   }
}

/**
 * Player has valid cards to play in trick. Plays valid cards
 */
CardGame.prototype.playHand = function(player,cards,cardIdxs,isComp){
   for(var i = 0; i < cards.length; i++){
      // Check if trump card played (2 card)
      if(cards[i].val === 15){
         player.trumpPlayed = true;
      }

      // Turn off 'if statement' for debugging if comp cards displayed
      if(config.debug.mode){
         cards[i].node.parentNode.removeChild(cards[i].node);
         $(cards[i].node).removeClass("selectedCard");
         $(cards[i].node).off("click");
         $(cards[i].node).removeClass("playerCard");
      }else{
         if(!isComp){
            cards[i].node.parentNode.removeChild(cards[i].node);
            $(cards[i].node).removeClass("selectedCard");
            $(cards[i].node).removeClass("playerCard");
            $(cards[i].node).off("click");
            console.log("remove card select");
            console.log(cards[i].image);
         }   
      }
      if(this.firstHand){
         $(cards[i].node).addClass("firstCard");
         this.firstHand = false;
         // Add padding to fix shifting
         $(this.players[0].node).addClass("firstHand");
      }else{
         $(cards[i].node).addClass("playedCard");
      }

      // Log cards played
      console.log("cards played: "+cards[i].image);
      this.cardTrick.container.appendChild(cards[i].node);
      //player.hand.splice(cardIdxs[i],1);
   }

   // Remove cards from player array
   for(var j = cardIdxs.length-1; j >= 0; j--){
      player.hand.splice(cardIdxs[j],1);
   }

   if(!isComp){
      player.play.disabled = true;
      player.pass.disabled = true;
   }
   player.playedCard = true;
   if(!player.trumpPlayed){
      $(player.turn).removeClass("Show");
   }
   
   // Finished playing all cards in hand
   if(player.hand.length === 0){
      //alert("player out");
      console.log("player "+player.name.innerHTML+" out");
      player.result = this.results++;
      player.trickStatus.innerHTML += " - "+player.result;
      $(player.trickStatus).addClass("Show");
   }
}

/**
 * Shuffle cards in deck using the 
 * Fisher-Yates shuffling Algorithm
 */
CardGame.prototype.shuffleCards = function(){
   var i = this.deck.cards.length, j, tempi, tempj;
   if(i === 0) return false;
   while(--i){
      j = Math.floor(Math.random() * (i+1));
      tempi = this.deck.cards[i];
      tempj = this.deck.cards[j];
      this.deck.cards[i] = tempj;
      this.deck.cards[j] = tempi;
   }
}

/**
 * Deal out cards to each player.
 * Begins with dealer
 */
CardGame.prototype.dealCards = function(){
   var j = 0;
   for(var i = 0; i < this.deck.cards.length; i++){
      // loop back around and deal
      if(j === this.players.length){
         j = 0;
      }
      this.players[j].hand.push(this.deck.cards[i]);
      j++;
   }
}

/**
 * Debugging function used to deal specific cards to 
 * specific players to similulate particular behavior 
 */
CardGame.prototype.debugDeal = function(values,suit,player){
   for(var i = 0; i < values.length; i++){
      player.hand.push(new Card(values[i], suit));
   }
}

/**
 * Debugging functions to validate and show shuffle
 */
CardGame.prototype.createContainer = function(){
   var j = 0;
   for(var i = 0; i < this.deck.cards.length; i++){
      var card = document.createElement("img");
      card.className = "CardImage";
      card.src = "PNG_Cards/"+this.deck.cards[i].image;
      if(i % 13 === 0 && i !== 0){
         j++;
      }
      console.log("i: "+i);
      console.log("j: "+j);
      this.shuffleContainer.children[j].appendChild(card);
   }
}

/**
 * Debugging functions to validate and show shuffle
 */
CardGame.prototype.displayShuffle = function(){
   var j = 0;
   var i = 0;
   var k = 0;
   while(j !== 4){
      if(i % 13 === 0 && i !== 0){
         j++;
         i = 0; 
      }
      if(j === 4)
         break;
      console.log("i: "+i);
      console.log("j: "+j);
      this.shuffleContainer.children[j].children[i].src = "PNG_Cards/"+this.deck.cards[k].image; 
      i++;
      k++;
   }
}

$(document).ready(initialize);
