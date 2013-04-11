var Trick = function(cards,player){
   this.node = document.getElementById("TrickContainer");
   this.hand = [];
   this.rule = "";
   this.setValues(cards,player);
}

Trick.prototype.setValues = function(cards,player){
   for(var i = 0; i < cards.length; i++){
      this.hand.push(cards[i]);
   }
   if(this.hand.length == 1){
      this.rule = "single";
   }else if(this.hand.length == 2){
      this.rule = "pairs";
   }else if(this.hand.length == 4){
      this.rule = "quads";
   }
   this.isValidCard = this.validate();
   this.lastPlayed = player;
}

Trick.prototype.validate = function(){
   if(this.rule != "" && this.hand.length > 1){
      var val = this.hand[0].value;
      var isValid = true;
      for(var i = 0; i < this.hand.length; i++){
         if(val != this.hand[i].value){
            isValid = false;
            break;
         }
      }
      return isValid;
   }else if(this.rule != ""){
      return true;
   }
   return false;
}

Trick.prototype.isValid = function(cards,player){
   if(this.rule == "single"){
      if(cards.length == 1){
         if(this.hand[0].value < cards[0].value){
            this.hand[0] = cards[0];
            this.lastPlayed = player;
            return true;
         }
      }
   }else if(this.rule == "pairs"){

   }else if(this.rule == "quads"){

   }

   return false;
}
