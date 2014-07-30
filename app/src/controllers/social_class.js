define(['jquery', 'models/deck'],
function($, Deck) {

    var cardValues = [3,4,5,6,7,8,9,10,11,12,13,14,15];
    var cardSuits = ['clubs','diamonds','hearts','spades'];
    var deck;

    function createCardObj(value, suit) {

        var card;

        card = {};
        card.value = value;
        card.suit = suit;
        card.cardId = value+'_'+suit;

        return card;
    }

    var socialClassController = {

        init: function() {

            var i;
            var len = 5;

            this.createDeck();

            // shuffle five times
            for (i = 0; i < len; i++) {

                this.shuffleCards();
            }
        },

        createDeck: function() {

            var i;
            var j;
            var len;
            var len2;
            var cards;
            var cardDeckObj;

            cardDeckObj = {};
            cardDeckObj.cards = [];
            cards = [];

            for (i = 0, len = cardValues.length; i < len; i++){
                for (j = 0, len2 = cardSuits.length; j < len2; j++){
                    card = createCardObj(cardValues[i], cardSuits[j]);
                    cards.push(card);
                }
            }

            cardDeckObj.cards = cards;

            deck = new Deck(cardDeckObj).get('cards');

            console.log('deck here');
        },

        shuffleCards: function() {

            // console.log('before');
            // console.log(JSON.stringify(deck.pluck('cardId')));

            deck.reset(deck.shuffle(), {silent:true});

            // console.log('after');
            // console.log(JSON.stringify(deck.pluck('cardId')));
        },

        getDeck: function() {

            return deck;
        }
    };

    return socialClassController;

});