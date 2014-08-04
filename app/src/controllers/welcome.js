define(['jquery', 'views/welcome'],
function($, WelcomeView) {

    var welcomeController = {

        welcomeView: undefined,

        init: function(callbackFunc) {

            this.welcomeView = new WelcomeView({callback: callbackFunc});
            this.welcomeView.render();
        }
    };

    return welcomeController;
});