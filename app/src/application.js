/**
 * @class Application
 * @description The main function that starts Social Class Card Game
 * @return Application object
 */
define(['marionette', 'controllers/welcome', 'controllers/social_class'],
    function(Backbone, welcomeController, socialClassController) {

        var app;

        app = new Backbone.Application();

        function handleAsyncCallback() {

            socialClassController.init();
        }

        function initControllers() {

            console.log('init controllers, start app');
            welcomeController.init(handleAsyncCallback);
        }

        initControllers();

        return app;
    }
);
