/**
 * @class Application
 * @description The main function that starts Social Class Card Game
 * @return Application object
 */
define(['marionette', 'controllers/social_class'],
    function(Backbone, socialClassController) {

        var app;

        app = new Backbone.Application();

        function initControllers() {

            console.log('init controllers, start app');
            socialClassController.init();
        }

        initControllers();

        return app;
    }
);
