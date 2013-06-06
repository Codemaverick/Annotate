require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        templates: '../templates',
        sanitize: 'vendor/sanitize'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        sanitize: {
            exports: 'sanitize'
        }
    }
});

require(['app', 'jquery', 'bootstrap','text!templates/content-types.html', 'sanitize'], function (app, $, bootstrap, templ) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);

    //custom code
    var stage = $('#appStage');
    var toolBox = $('#controlsList');
    toolBox.on('click', 'LI.btn', function(event){
        var target = event.target;
        var item = $(target).data('type');
        //alert(item + " button pressed");

        var evt = jQuery.Event("data");
        evt.contenttype = item;
        toolBox.trigger(evt);

    });

    toolBox.on("data", function(e){
        e.stopPropagation();
        var editor = createContent(e.contenttype);
        //alert(e.contenttype + " item pressed");
        stage.append(editor);
        onBeginEdit(editor);

        
    });

    function onBeginEdit(coll){
        //var el = document.getElementById("editable");
        var el = coll.get(0);
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

    /*
    * Source
    * http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
    */
    function continueEdit(coll){
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
        
    }


    function filterBR(e){

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
    
    }


    function createContent(contenttype){
        var templates = $(templ);
        var path = "LI *[data-type='" + contenttype + "']";
        var cmp = templates.find(path);

        if(cmp != null){
            var el = cmp.find(contenttype);
            //el.html(" ");
            el.attr('contenteditable',"true");

            if(contenttype === 'p'){
               // el.on('keydown',filterBR);
               el.on('blur', sanitizeText);
            }
 
            return el;
        }
    }

    function sanitizeText(e){
        var p = e.target;
        var txt = new Sanitize();
        p.innerHtml = txt.clean_node(p);
    }

});