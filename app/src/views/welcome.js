define(['jquery', 'underscore', 'backbone', 'marionette', 'handlebars', 'text!views/welcome.html'],
    function($, _, Backbone, Marionette, Handlebars, welcomeHTML) {

    var welcomeCompositeView = Backbone.Marionette.ItemView.extend({

        el: '#welcome-screen',
        itemViewContainer: '.',
        template: Handlebars.compile(welcomeHTML),
        events: {
            'click button.play-now-btn': 'initCallback'
        },

        callback: undefined,

        initialize: function(options) {

            var isMobile;

            isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
            if (isMobile) {
                this.model = new Backbone.Model({isMobile: true});
            }

            if (options && options.callback) {

                this.callback = options.callback;
            }

        },

        initCallback: function() {

            this.$el.find('.play-now-btn').blur();
            if (this.callback !== undefined) {

                this.callback();
            }

            this.$el.find('.welcome-container').hide();
            this.$el.find('.name-container').show();
        }
    });

    return welcomeCompositeView;
});