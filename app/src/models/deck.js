define(['relational', 'models/card'],
function(Backbone, Card) {

    var Deck = Backbone.RelationalModel.extend({

        initialize: function() {

            console.log('create deck of cards');
        },

        relations: [
            {
                type: 'HasMany',
                key: 'cards',
                relatedModel: Card,
                reverseRelation: {
                    key: 'deckCard'
                }
            }
        ]

    });

    return Deck;
});