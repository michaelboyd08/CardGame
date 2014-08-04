define(['jquery', 'underscore', 'marionette', 'handlebars', 'text!views/welcome.html'],
    function($, _, Backbone, Handlebars, welcomeHTML) {

    var welcomeCompositeView = Backbone.ItemView.extend({

        el: '#welcome-screen',
        itemViewContainer: '.',
        template: Handlebars.compile(welcomeHTML),
        events: {
            'click button.play-now-btn': 'initCallback'
        },

        callback: undefined,

        initialize: function(options) {

            if (options && options.callback) {

                this.callback = options.callback;
            }

        },

        initCallback: function() {

            this.$el.find('.play-now-btn').blur();
            if (this.callback !== undefined) {

                this.callback();
            }

            this.$el.hide();
        }
    });

    return welcomeCompositeView;
});