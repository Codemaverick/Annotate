///<reference path="~/Scripts/jquery-1.5.1-vsdoc.js" />
///<reference path="~/Scripts/lib/yankaree.js" />
///<reference path="~/Scripts/Slick.Parser.js" />

///<summary>
/// A much quicker and convenient create element method, attributes extend using JQuery
///<summary>
///<param name="tagName" type="string">The string name of the tag ex: "DIV"</param>
///<param name="config" type="obj">Configuration object of the attributes</param>
var Element = this.Element = function (tagName, config) {
    var el = document.createElement(tagName);
    if (el && config) {
        $(el).attr(config);
    }
    return $(el);
}

var ListView = function (config) {
    var shell = $(config.container); //container for the list
    if (!shell)
        throw "ListView element not found!";

    var LS = new Class();
    var selector = config.selector;
    var id = config.id;
    var itemRenderer = config.itemRenderer != undefined ? config.itemRenderer : null;
    var listItems = shell.children(config.selector); //array of items
    var count = listItems.length;
    var base = {
        add: function (item) {
            //create element
            var attrib = { "data-id": item[id] };
            var el = this.createListItem(selector, attrib);
            var content;
            var content = (itemRenderer) ? itemRenderer(item) : item.toString();
            el.html(content);
            //shell.append(el);
            shell.prepend(el); //items inserted descending
            count++;
            listItems = shell.children(config.selector);
        },
        remove: function (data_id) {
            var exp = "[data-id=" + data_id + "]";
            listItems = shell.children(config.selector);  //update listItem 
            var item = listItems.filter(exp);
            if (item) {
                item.remove();
                count--;
            }
        },
        update: function (data) {
            var item, content;
            item = this.getItem(data[id]);
            var content = (itemRenderer) ? itemRenderer(data) : data.toString();
            if (item) {
                item.html(content);
                return true;
            } else { return false; }
        },
        getItem: function (key) {
            var exp = "[data-id=" + key + "]";
            listItems = shell.children(config.selector);
            var item = listItems.filter(exp);

            return item;
        },
        setItemRenderer: function (value) {
            itemRenderer = value;
        },
        count: function () {
            return count;
        },
        createListItem: function (selector, attr) {
            //assuming no children (empty list)
            //LI.list
            //step 1: See if any children
            var items = shell.children(selector);
            if (items.length <= 0) {
                //try to parse selector for tag name
                var parsed = Slick.parse(selector).expressions[0][0];
                var tag = parsed.tag;
                if (tag == "*") {
                    throw "Unable to create new list Item. Selector string does not contain enough information";
                } else {
                    if (parsed.classList && parsed.classList.length > 0)
                        attr["class"] = parsed.classList.join(' ');
                    return new Element(tag, attr);
                }
            } else {
                //children exist
                return $(items[0]).clone().attr(attr);
            }

        }
    }; //end base

    LSV = Object.implement(LS, base);
    return new LSV();

}

//String.Format
//http://www.geekdaily.net/2007/06/21/cs-stringformat-for-javascript/

function _StringFormatInline() {
    var txt = this;
    for (var i = 0; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
        txt = txt.replace(exp, arguments[i]);
    }
    return txt;
}

function _StringFormatStatic() {
    for (var i = 1; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        arguments[0] = arguments[0].replace(exp, arguments[i]);
    }
    return arguments[0];
}

if (!String.prototype.format) {
    String.prototype.format = _StringFormatInline;
}

if (!String.format) {
    String.format = _StringFormatStatic;
}
//End String.Format

///<summary>
/// Validate if a form field contains a valid URL - Requires JQuery
///<summary>
///<param name="selector" type="string">The selector for the input field</param>
///<returns>Boolean</returns>
function validateURL(sel) {
    
    var exp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    var fieldValue = null;

    field = $(sel);
    if (field.length == 0)
        return;

    fieldValue = field.val();    

    if (exp.test(fieldValue)) {
        return true;
    } else if (exp.test("http://" + fieldValue)) {
        field.val("http://" + fieldValue);
        return true;
    } else {
       return false; //invalid url
    }

}

function isURL(value) {
    var exp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    return exp.test(value);

}

function assignIDs(frm, prefix) {

    var inputs = frm.find('input:not(:checkbox)').filter('input:not(:radio)');
    var checkboxes = frm.find('input:checkbox');
    var radios = frm.find('input:radio');
    var selects = frm.find('select');
    var texts = frm.find('textarea');

    var prf = (prefix) ? prefix : "frm";
    frm.attr('id', prefix + (Math.floor(Math.random() * 11)));

    var ctr = 1;
    var prf = (prefix) ? prefix : "txt";
    inputs.each(function (index) {
        var name = $(this).attr('name');
        $(this).attr('id', prefix + name);
    });

    ctr = 1; //reset counter
    var prf = (prefix) ? prefix : "chk";
    checkboxes.each(function (ind) {
        var name = $(this).attr('name');
        $(this).attr('id', prefix + name);
    });

    var prf = (prefix) ? prefix : "rdio";
    radios.each(function (ind) {
        var name = $(this).attr('name');
        $(this).attr('id', prefix + name);
    });

    var prf = (prefix) ? prefix : "drp";
    selects.each(function (ind) {
        var name = $(this).attr('name');
        $(this).attr('id', prefix + name);
    });

    var prf = (prefix) ? prefix : "tArea";
    texts.each(function (ind) {
        var name = $(this).attr('name');
        $(this).attr('id', prefix + name);
    });

}

function createCollection(event) {
   
    var list = new FormCollection();
    var colls = new ArrayList();
    var form = $(event.target);

    var inputs = form.find('input:not(:checkbox)').filter('input:not(:radio)');
    var checkboxes = form.find('input:checkbox').filter('input:checked');
    var radios = form.find('input:radio').filter('input:checked');
    var selects = form.find('select');
    var texts = form.find('textarea');

    colls.add(inputs);
    colls.add(checkboxes);
    colls.add(radios);
    colls.add(selects);
    colls.add(texts);

    colls.forEach(function (items) {
        items.each(function (index) {
            var c = $(this);
            list.add(c.attr("name"), c.val());
        });
    });

    return list;
}

function composeForm(container, config) {
    var frm = $('<form>', {
        action: config["form-action"],
        "data-action": config["data-action"],
        "data-callback": config.success,
        submit: config.submit
    }).append(config.template.children().clone());

    //assign IDs to form items
    assignIDs(frm, config.fieldPrefix);
    container.css('display', 'block');
    frm.appendTo(container);

    var datefield = frm.find('input[data-type="date"]');
    datefield.datepicker({
        changeMonth: true,
        changeYear: true
    });

    //attach to URL fields
    var fields = frm.find('input[data-id$="URL"]');
    fields.blur(function (evt) {
        validateURL(this);
    });

    var hd = frm.find('h3');
    hd.html(config.header);

    return frm;

}

function formSubmitted(event) {
    var form = $(event.target);
    event.preventDefault();
    var doneBtn = form.find('input[data-id="Done"]');

    var fields = form.find('input[data-id$="URL"]');
    if (fields.length > 0) {
        for (x = 0; x < fields.length; x++) {
            var fVal = $(fields[x]).val();
            validateURL(fields[x]);
        }
    }

    //invoke validation
    form.validationEngine();

    doneBtn.click(function (event) {
        form.validationEngine('hideAll');
    });

    valid = form.validationEngine('validate');

    if (valid) {
        var destination = form.attr('data-action');
        var cb = form.attr('data-callback');
        var collection = createCollection(event);

        $.ajax({
            type: "POST",
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: destination,
            data: JSON.stringify(collection.items),
            dataType: "json",
            success: callbacks.item(cb),
            error: onRequestError
        });
    }

}









        
