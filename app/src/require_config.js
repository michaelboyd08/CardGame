var require = {
    enforceDefine: true,
    paths: {
        'text': '../libs/requirejs/text',
        'jquery': '../libs/jquery/jquery-1.11.1',
        'bootstrap': '../libs/bootstrap/bootstrap',
        /*'jqueryui': '../libs/jqueryui/jquery-ui-1.10.4.custom',*/
        'underscore': '../libs/lodash/underscore.amd',
        'backbone': '../libs/backbone/backbone',
        'relational': '../libs/backbone.relational/backbone.relational',
        'marionette': '../libs/backbone.marionette/backbone.marionette',
        'handlebars': '../libs/backbone.handlebars/handlebars'
    },
    shim: {
        handlebars: {
            exports: 'Handlebars'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: '$.fn.popover'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        relational: {
            deps: ['backbone', 'underscore', 'jquery'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['underscore', 'backbone'],
            exports: 'Backbone'
        }
    }
};