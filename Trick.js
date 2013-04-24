/**
 * @author Michael Boyd
 *
 */

/**
 * Trick Object used in CardGame
 */
var Trick = function(cards,player){
   this.node = document.getElementById("TrickContainer");
   this.header = document.getElementById("trickHeader");
   this.cleared = document.getElementById("trickClear");
   this.trickLabel = document.getElementById("trickLabel");
   this.container = document.getElementById("trickCards");
}

/**
 * Initializes trick properties at the beginning
 * of each new trick
 */
Trick.prototype.setValues = function(cards,player){
   this.rule = "";
   this.hand = [];
   this.isValidCards = false;
   for(var i = 0; i < cards.length; i++){
      this.hand.push(cards[i]);
   }
   if(this.hand.length == 1){
      this.rule = "Singles";
   }else if(this.hand.length == 2 || this.hand.length == 4){
      if(this.hand[0].val == this.hand[1].val){
         if(this.hand.length == 2){
            this.rule = "Pairs";
         }else{
            if(this.hand[1].val == this.hand[2].val && 
            this.hand[2].val == this.hand[3].val){
               this.rule = "Quads";
            }
         }
      }
   }

   if(this.rule != ""){
      console.log("Trick.js - last played: "+player.name.innerHTML);
      this.isValidCards = true;
      this.lastPlayed = player;
      this.trickLabel.innerHTML = "Trick Rule - "+this.rule;
   }else{
      this.unselectCards(cards,player);
   }
}

/**
 * Checks to see if cards attempting to be played are valid
 * Valid is defined as following the rule and greater than
 * the last card(s) played in trick
 */
Trick.prototype.isValid = function(cards,player){
   //console.log("trick isValid");
   var multiValid = true;
   if(this.rule == "Singles" || this.rule == "Pairs" || this.rule == "Quads"){
      //console.log("rule: "+this.rule);
      //console.log("cards: "+cards.length);
      //console.log("trick hand: "+this.hand.length);
      if(cards.length == this.hand.length){
         if(this.hand[0].val < cards[0].val){
            // Single Card 
            if(cards.length == 1){
               this.hand[0] = cards[0];
               this.lastPlayed = player;
               return true;
            }
            // Pairs or Quads
            else{
               if(cards[0].val == cards[1].val){
                  if(cards.length == 4){
                     multiValid = false;
                     if(cards[2].val == cards[3].val){
                        multiValid = true;
                     }
                  }
                  if(multiValid){
                     for(var i = 0; i < cards.length; i++){
                        this.hand[i] = cards[i];
                     }
                     this.lastPlayed = player;
                     return true;
                  }
               }
            }
         }
      }
   }
   // Invalid Card - unselect and put back in hand
   this.unselectCards(cards,player);
   return false;
}

Trick.prototype.unselectCards = function(cards,player){
   if(cards.length > 0){
      if(!player.isComp){
         for(var i = 0; i < cards.length; i++){
            $(cards[i].node).removeClass("selectedCard");
         }
      }
   }
}
