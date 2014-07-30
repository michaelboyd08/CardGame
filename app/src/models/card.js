define(['relational'],
function(Backbone) {

    var Card = Backbone.RelationalModel.extend({

        initialize: function() {

            console.log('create card');
        }

    });

    return Card;
});