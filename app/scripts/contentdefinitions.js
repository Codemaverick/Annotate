/*global define */
define(['jquery'], function ($) {
    'use strict';

    //definition file for the content tags
    var Definitions;

    return  Definitions = {
    	h1: {
    		container: false,
    		tagName: "h1",
    		typeDefinition: null,
    		channels: []
    	},

    	h2: {
    		container: false,
    		tagName: "h2",
    		typeDefinition: null,
    		channels: []
    	},

    	h3: {
    		container: false,
    		tagName: "h3",
    		typeDefinition: null,
    		channels: []
    	},

    	a:{
    		container: true,
    		tagName: "a",
    		allowedChildren: ['img'],
    		typeDefinition: null,
    		channels: []
    	},

    	table:{
    		container: true,
    		tagName: "table",
    		allowedChildren: ['thead', 'tbody', 'tfooter'],
    		initialPath: 'tr:first-of-type td',
    		typeDefinition: null,
    		channels: []
    	},

    	thead:{
    		container: true,
    		tagName: "thead",
    		allowedChildren: ['tr'],
    		typeDefinition: null,
    		channels: []
    	},

    	tr: {
    		container: true,
    		tagName: "tr",
    		allowedChildren: ['th','td'],
    		typeDefinition: null,
    		channels: []

    	},

    	td: {
    		container: true,
    		tagName: "td",
    		allowedChildren: ['a','p','div'],
    		typeDefinition: null,
    		channels: []
    	},

    	p: {
    		container:true,
    		tagName : "p",
    		allowedChildren: ['a','img', 'cite','span','br'],
    		channels: ['click','keypress','focus','blur'],
    		typeDefinition: {
    			events: {
    				'click': function(){

    				},
    				'keypress': function(){

    				},
    				'focus': function(){

    				}
    			}

    		}

    	},

    	section: {
    		container: true,
    		tagName: "section",
    		allowedChildren: ['div','h1','h2','h3','h4','p','ul','ol', 'table'],
    		channels: ['click','focus', 'blur'],
    		typeDefinition: {
    			events:{
    				click: function(e){

                    },

                    focus: function(e){

                    },

                    blur: function(e){
                        
                    }
    			}
    		}
    	},

    	ul: {
    		container: true,
    		tagName: "ul",
    		allowedChildren: ['li'],
    		channels: ['keypress'],
    		initialPath: 'li',  //path from sleeve element
    		typeDefinition: {
    			events: {
    				'keypress' : function(e){
    					if(e.keyCode === 13){
    						self = this;
    						//var container = $(e.target).parent();
    						e.preventDefault();
    						var newItem = $('<li></li>');
    						$(this).append(newItem);
    						Definitions.beginEdit(newItem);

    					}
    				}
    			}
    		}
    	},

    	ol: {
    		container: true,
    		tagName: "ol",
    		allowedChildren: ['li'],
    		channels: ['keypress'],
    		initialPath: 'li',  //path from sleeve element
    		typeDefinition: {
    			events: {
    				'keypress' : function(e){
    					if(e.keyCode === 13){
    						self = this;
    						//var container = $(e.target).parent();
    						e.preventDefault();
    						var newItem = $('<li></li>');
    						$(this).append(newItem);
    						Definitions.beginEdit(newItem);

    					}
    				}
    			}
    		}
    	},

    	li: {
    		container: true,
    		tagName: "li",
    		allowedChildren: ['a'],
    		typeDefinition: null,
    		channels: []
    	},

    	beginEdit:function(obj){
    		obj.attr('contenteditable',"true");
    		var el = obj.get(0);

    		var sel = window.getSelection();
	        var range = document.createRange();
	        range.selectNodeContents(el);
	        // //range.setStart(el.childNodes[0], 0);
	        // if(el.childNodes.length > 0){
	        //     var last = el.lastChild;
	        //     //if(last.nodeType != Node.TEXT_NODE)
	        // }

	        range.collapse(false);
	        sel.removeAllRanges();
	        sel.addRange(range);
	        el.focus();
    	}

    }

});