/*global define */
define(['jquery'], function ($) {
    'use strict';
    
    var toolBox; 
    var messageBus;

    var ToolBox = {
    	initialize: function(initOptions){
    		toolBox = $(initOptions.selector);
    		toolBox.on('click', 'LI.btn', this.publishContent);
    		messageBus = initOptions.messageBus;

    	},
    	setMessageBus: function(bus){
    		this.messageBus = bus;
    	},
    	publishContent: function(event){
    		var target = event.target;
	        var item = $(target).data('type');
	        //alert(item + " button pressed");

	        var evt = $.Event("data");
	        evt.contentType = item;
	        messageBus.publish("data", evt);
    	}

    };

    return ToolBox;

    
});