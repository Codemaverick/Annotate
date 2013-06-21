/*global define */
define(['yankaree', 'yankareeUI', 'sanitize','text!templates/content-types.html', 'contentdefinitions'], function (yankaree, yankareeUI, sanitize, templ, defs) {
    'use strict';

   	//Stage should in essence be a singleton
   	//custom code
    var stage;

 	var items = new ArrayCollection;
 	var stageEl = null;
 	var activeElement = null;
 	var messageBus = null;
 	var toolboxMQ;

    return {
        initialize: function(initOptions){
        	var selector = initOptions.selector || 'body';
        	stage = $(selector);
            
        	messageBus = initOptions.messageBus || null; //should be able to build an adaptor for JQuery
        	toolboxMQ = initOptions.toolboxMQ;
        	toolboxMQ.subscribe("data", this.parseMessage).withContext(this);
            //toolboxMQ.subscribe("data", this.switchBoard).withContext(this); //subscribe to all channels from the toolbox
            if(stage){
            	stage.on('focusin', '*', null, this.switchBoard);
            	stage.on('focusout', '*', null, this.switchBoard);
            }else{
            	throw "Some kinda exception - No stage element found";
            }
            

        },
        getStage: function(){
            return stageEl;
        },

        switchBoard: function(event){
        	var contentType = event.contentType || event.type;
            switch(contentType){
                case "add":
                    this.addContent(event);
                    break;
                case "update":
                    this.updateContent(event);
                    break;
                case "focusin":
                	activeElement = $(event.target);
                	messageBus.publish("focusin", event);
                	break;
                case "focusout":
                	activeElement = null;
                	messageBus.publish("focusout", event);
                	break;
                
				default:
                    //noop
            }

        },
        addContent: function(contentType, parent){
	        var editor = this.createContent(contentType);
	        //var editorClass = defs[contentType].typeDefinition; //don't remember why I added this
	        //alert(e.contenttype + " item pressed");
	        var container = parent || stage;
	        container.append(editor);
	        this.onBeginEdit(contentType, editor);  //@todo: should fire event for before edit and after edit.
        },

        parseMessage: function(msg){
        	//if section is active element, and something else is clicked, section is a container. Insert clicked element
        	var contentType = msg.contentType;

        	if(activeElement != null){
	        	var instance = defs[activeElement];

	        	if((instance.container === true) && (defs.allowedChildren.indexOf(child))){
	        		//insert element
	        		this.addContent(msg.contentType);
	        	}
	        }else{
	        	//just append it to the document
	        	this.addContent(contentType, stageEl);
	        }
        },

        onBeginEdit: function (contentType, coll){
	        //var el = document.getElementById("editable");
	        var elementDefinition = defs[contentType];
	        var initialPath = elementDefinition.initialPath || contentType;
	        var el;

	        if(elementDefinition.initialPath) {
	        	var matches = coll.find(initialPath);
	        	el = matches.get(0);
	        } else {
	        	el = coll.get(0);
	        }

	        $(el).attr('contenteditable',"true");
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
	    },

	    /*
	    * Source
	    * http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
	    */
	     continueEdit: function(coll){
	        var el = coll.get(0);
	        if (typeof window.getSelection != "undefined"
	                && typeof document.createRange != "undefined") {
	            var range = document.createRange();
	            range.selectNodeContents(el);
	            range.collapse(false);
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	        } else if (typeof document.body.createTextRange != "undefined") {
	            var textRange = document.body.createTextRange();
	            textRange.moveToElementText(el);
	            textRange.collapse(false);
	            textRange.select();
	        }
	        
	    },

	    sanitizeText: function(e){
	        var p = e.target;
	        var txt = new Sanitize();
	        var cleaned = txt.clean_node(p);
	        p.innerHTML = cleaned.textContent;
	    },

	    filterBR: function(e){

	        var sel, node, offset, text, textBefore, textAfter, range;
	 
	        sel = window.getSelection();
	     
	        // the node that contains the caret
	        node = sel.anchorNode;
	        var p = e.target;
	        var linebr = document.createElement("br");
	        var txt = document.createTextNode(" ");

	        // if ENTER was pressed while the caret was inside the input field
	        if ( node.parentNode === p && e.keyCode === 13 ) {
	     
	            // prevent the browsers from inserting <div>, <p>, or <br> on their own
	            e.preventDefault();
	     
	            // the caret position inside the node
	            offset = sel.anchorOffset; 
	            //p.blur();
	            p.appendChild(linebr);
	            p.appendChild(txt);       
	     
	            // insert a 'n' character at that position
	            // text = node.textContent;
	            // textBefore = text.slice( 0, offset );
	            // textAfter = text.slice( offset ) || ' ';
	            // node.textContent = textBefore + '' + textAfter;

	            // position the caret after that new-line character
	            range = document.createRange();
	            range.setStart( txt, 0);
	            range.collapse(true);

	            // update the selection
	            sel.removeAllRanges();
	            sel.addRange(range);
	            p.focus();

	        }
	    
	    },


    	createContent: function(contenttype){

	        var templates = $(templ);
	        var path = "LI *[data-type='" + contenttype + "']";
	        var component = templates.find(path);
	        var elementDefinition = defs[contenttype];
	      

	        if(component != null){
	            var el = component.find(contenttype);
	            var channels = elementDefinition.channels;
	            channels.forEach(function(item, index, array){
	            	el.on(item, elementDefinition.typeDefinition.events[item]);
	            });
	            //el.html(" ");

	            if(contenttype === 'p'){
	               // el.on('keydown',filterBR);
	               el.on('blur', this.sanitizeText);
	            }
	 
	            return el;
	        }
	    }

    }
});