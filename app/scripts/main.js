require.config({
    paths: {
        jquery      : '../components/jquery/jquery',
        bootstrap   : 'vendor/bootstrap',
        templates   : '../templates',
        sanitize    : 'vendor/sanitize',
        yankaree    : 'vendor/yankaree',
        yankareeUI  : 'vendor/yankareeUI',
        postal      : 'vendor/postal',
        underscore  : 'vendor/underscore-min'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        underscore: {
            exports: '_'
        },
        sanitize: {
            exports: 'sanitize'
        },
        yankaree:{
            exports:'yankaree'
        },
        yankareeUI:{
            exports: 'yankareeUI'
        }
    }
});

require([
        'app', 
        'jquery', 
        'bootstrap', 
        'yankaree',
        'yankareeUI',
        'postal',
        'toolbox',
        'stage'
        ], function (app, $, bootstrap, yankaree, yankareeUI, postal, ToolBox, Stage) {

    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);

    
    var stageBus = postal.channel('Stage');
    var toolBus = postal.channel('ToolBox');
    var propSheetBus = postal.channel("PropSheet");

    ToolBox.initialize({selector:'#controlsList', messageBus: toolBus});
    Stage.initialize({selector: '#appStage', messageBus: stageBus, toolboxMQ: toolBus}); //toolBusMQ = toolbus message queue

    //var handle = toolBus.subscribe("data", Stage.switchBoard ).withContext(Stage);

    //toolBus.publish("data", {title: "hello world!"});
    /*
    var handle = postal.channel("Galactica");
    var adama = handle.subscribe('bridge.events', function(e){
        console.log("all hands report to battlestations. Cylons are coming");
    });

    handle.publish("bridge.events",{title: "hello world!"}); */



    

});