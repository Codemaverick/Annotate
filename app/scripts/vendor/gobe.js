var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Gobe;
(function (Gobe) {
        var ArrayList = (function (_super) {
        __extends(ArrayList, _super);
        function ArrayList() {
                _super.call(this);
        }
        ArrayList.prototype.add = function (item) {
            this.addItemAt(item, this.length);
        };
        ArrayList.prototype.addItemAt = function (item, index) {
            if(index < 0 || index > this.length) {
                throw "Range Error !: Index out of Bounds";
            }
            return this.splice(index, 0, item);
        };
        ArrayList.prototype.clear = function () {
            if(this.length > 0) {
                this.splice(0, this.length);
            }
        };
        ArrayList.prototype.contains = function (obj) {
            return this.indexOf(obj, 0) != null;
        };
        ArrayList.prototype.indexOf = function (obj, startIndex) {
            var icount = this.length;
            var start = startIndex || 0;
            var returnValue = -1;
            if(start > -1 && start < icount) {
                var i = start;
                while(i < icount) {
                    if(this[i] == obj) {
                        returnValue = i;
                        break;
                    }
                    i++;
                }
            } else {
                throw "Index out of bounds!";
            }
            return returnValue;
        };
        ArrayList.prototype.remove = function (item) {
            var index = this.indexOf(item);
            var result = (index >= 0);
            if(result) {
                this.removeAt(index);
            }
            return result;
        };
        ArrayList.prototype.removeAt = function (index) {
            if(index < 0 || index >= this.length) {
                throw "Error! Index of of bounds.";
            }
            var removed = this.splice(index, 1);
            return removed;
        };
        ArrayList.prototype.toArray = function () {
            var keys = [];
            for(var key in this) {
                if(this.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        ArrayList.prototype.count = function () {
            return this.length;
        };
        ArrayList.prototype.forEach = function (fn, bind) {
            if(this.length === void 0) {
                for(var key in this) {
                    if(this.hasOwnProperty(key)) {
                        fn.call(bind, this[key], key, this);
                    }
                }
                return this;
            }
            for(var i = 0, l = this.length; i < l; i++) {
                fn.call(bind, this[i], i, this);
            }
            return this;
        };
        return ArrayList;
    })(Collections.ListBase);
    Gobe.ArrayList = ArrayList;    
    var Event = (function () {
        function Event(type, target, bubbles, cancelable, currentTarget, eventPhase) {
            this.type = type;
            this.target = target;
            this.bubbles = bubbles;
            this.cancelable = cancelable;
            this.currentTarget = currentTarget;
            this.eventPhase = eventPhase;
        }
        return Event;
    })();
    Gobe.Event = Event;    
    var EventManager = (function () {
        function EventManager(type, handlers, contexts) {
            this.type = type || "";
            this.handlers = handlers || new ArrayList();
            this.contexts = contexts || new ArrayList();
        }
        return EventManager;
    })();
    Gobe.EventManager = EventManager;    
    var EventDispatcher = (function () {
        function EventDispatcher() {
            this.events = new ArrayList();
        }
        EventDispatcher.prototype.findManager = function (type) {
            var count = this.events.count();
            var loc = -1;
            for(var x = 0; x < count; x++) {
                var item = this.events[x];
                if(item.type == type) {
                    loc = x;
                }
            }
            return loc;
        };
        EventDispatcher.prototype.addEventListener = function (type, handler, context) {
            var ind = this.findManager(type);
            if(ind >= 0) {
                var mgr = this.events[ind];
                var ctxt = context ? context : null;
                mgr.contexts.add(ctxt);
                mgr.handlers.add(handler);
            }
        };
        EventDispatcher.prototype.removeEventListener = function (type, handler, context) {
            var ind = this.findManager(type);
            if(ind >= 0) {
                var mgr = this.events[ind];
                mgr.handlers.remove(handler);
            }
        };
        EventDispatcher.prototype.registerEvent = function (type) {
            if(this.findManager(type) == -1) {
                var mgr = new EventManager();
                this.events.add(mgr);
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (evt) {
            var ind = this.findManager(evt.type);
            if(ind >= 0) {
                var mgr = this.events[ind];
                var count = mgr.handlers.count();
                mgr.handlers.forEach(function (handler, indx) {
                    try  {
                        var itemContext = mgr.contexts[indx];
                        if(itemContext) {
                            itemContext[handler](evt);
                        } else {
                            handler(evt);
                        }
                    } catch (e) {
                        alert(e);
                        if((console != null) && (console.log)) {
                            console.log("Exception for event '" + evt.type.toString() + "'");
                        }
                    }
                });
            }
        };
        return EventDispatcher;
    })();
    Gobe.EventDispatcher = EventDispatcher;    
    var ArrayCollection = (function (_super) {
        __extends(ArrayCollection, _super);
        function ArrayCollection() {
                _super.call(this);
            this.events = new ArrayList();
        }
        ArrayCollection.prototype.findManager = function (type) {
            var count = this.events.count();
            var loc = -1;
            for(var x = 0; x < count; x++) {
                var item = this.events[x];
                if(item.type == type) {
                    loc = x;
                }
            }
            return loc;
        };
        ArrayCollection.prototype.addEventListener = function (type, handler, context) {
            var ind = this.findManager(type);
            if(ind >= 0) {
                var mgr = this.events[ind];
                var ctxt = context ? context : null;
                mgr.contexts.add(ctxt);
                mgr.handlers.add(handler);
            }
        };
        ArrayCollection.prototype.removeEventListener = function (type, handler, context) {
            var ind = this.findManager(type);
            if(ind >= 0) {
                var mgr = this.events[ind];
                mgr.handlers.remove(handler);
            }
        };
        ArrayCollection.prototype.registerEvent = function (type) {
            if(this.findManager(type) == -1) {
                var mgr = new EventManager();
                this.events.add(mgr);
            }
        };
        ArrayCollection.prototype.dispatchEvent = function (evt) {
            var ind = this.findManager(evt.type);
            if(ind >= 0) {
                var mgr = this.events[ind];
                var count = mgr.handlers.count();
                mgr.handlers.forEach(function (handler, indx) {
                    try  {
                        var itemContext = mgr.contexts[indx];
                        if(itemContext) {
                            itemContext[handler](evt);
                        } else {
                            handler(evt);
                        }
                    } catch (e) {
                        alert(e);
                        if((console != null) && (console.log)) {
                            console.log("Exception for event '" + evt.type.toString() + "'");
                        }
                    }
                });
            }
        };
        return ArrayCollection;
    })(ArrayList);
    Gobe.ArrayCollection = ArrayCollection;    
    var Collection = (function () {
        function Collection(initObj) {
            this.items = initObj || {
            };
            return this;
        }
        Collection.prototype.subset = function (keys) {
            var results = {
            };
            for(var i = 0, l = keys.length; i < l; i++) {
                var k = keys[i];
                results[k] = this.items[k];
            }
            return results;
        };
        Collection.prototype.map = function (fn, bind) {
            var results = {
            };
            var objects = this.items;
            for(var key in this.items) {
                if(Object.hasOwnProperty(key)) {
                    results[key] = fn.call(bind, objects[key], key, objects);
                }
            }
            return results;
        };
        Collection.prototype.filter = function (fn, bind) {
            var results = {
            };
            Object.each(this.items, function (value, key) {
                if(fn.call(bind, value, key, this.items)) {
                    results[key] = value;
                }
            });
            return results;
        };
        Collection.prototype.every = function (fn, bind) {
            for(var key in this.items) {
                if(Object.hasOwnProperty(key) && !fn.call(bind, this.items[key], key)) {
                    return false;
                }
            }
            return true;
        };
        Collection.prototype.som = function (fn, bind) {
            var object = this.items;
            for(var key in object) {
                if(object.hasOwnProperty(key) && fn.call(bind, object[key], key)) {
                    return true;
                }
            }
            return false;
        };
        Collection.prototype.keys = function () {
            var keys = [];
            for(var key in this.items) {
                if(this.items.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        Collection.prototype.values = function () {
            var values = [];
            for(var key in this.items) {
                if(this.items.hasOwnProperty(key)) {
                    values.push(this.items[key]);
                }
            }
            return values;
        };
        Collection.prototype.getLength = function () {
            return Object.keys(this.items).length;
        };
        Collection.prototype.keyOf = function (value) {
            for(var key in this.items) {
                if(this.items.hasOwnProperty(key) && this.items[key] === value) {
                    return key;
                }
            }
            return null;
        };
        Collection.prototype.contains = function (value) {
            return this.keyOf(value) != null;
        };
        Collection.prototype.toQueryString = function (base) {
            var queryString = [];
            var object = this.items;
            Object.each(object, function (value, key) {
                if(base) {
                    key = base + '[' + key + ']';
                }
                var result;
                switch(typeof (value)) {
                    case 'object': {
                        result = this.toQueryString(value, key);
                        break;

                    }
                    case 'array': {
                        var qs = {
                        };
                        value.each(function (val, i) {
                            qs[i] = val;
                        });
                        result = this.toQueryString(qs, key);
                        break;

                    }
                    default: {
                        result = key + '=' + encodeURIComponent(value);

                    }
                }
                if(value != null) {
                    queryString.push(result);
                }
            });
            return queryString.join('&');
        };
        Collection.prototype.add = function (key, value) {
            this.items[key] = value;
        };
        Collection.prototype.remove = function (key) {
            if(this.items.hasOwnProperty(key)) {
                this.items[key] = undefined;
            }
        };
        Collection.prototype.clear = function () {
            this.items = {
            };
        };
        Collection.prototype.toArray = function () {
            return this.keys();
        };
        Collection.prototype.count = function () {
            return this.keys().length;
        };
        Collection.prototype.forEach = function (fn, bind) {
            if(this.items.length === void 0) {
                for(var key in this.items) {
                    if(this.items.hasOwnProperty(key)) {
                        fn.call(bind, this.items[key], key, this.items);
                    }
                }
                return this.items;
            }
            for(var i = 0, l = this.items.length; i < l; i++) {
                fn.call(bind, this.items[i], i, this.items);
            }
            return this.items;
        };
        Collection.prototype.item = function (key) {
            return this.items[key];
        };
        return Collection;
    })();
    Gobe.Collection = Collection;    
    var Dictionary = (function (_super) {
        __extends(Dictionary, _super);
        function Dictionary(initObj) {
                _super.call(this, initObj || {
    });
        }
        return Dictionary;
    })(Collection);
    Gobe.Dictionary = Dictionary;    
    var FormCollection = (function (_super) {
        __extends(FormCollection, _super);
        function FormCollection(initObj) {
                _super.call(this, initObj || {
    });
        }
        return FormCollection;
    })(Collection);
    Gobe.FormCollection = FormCollection;    
    var Form = (function () {
        function Form(id) {
            this.items = new Dictionary({
            });
            this.validator = null;
            this.validationModel = null;
            this.formAction = "";
            this.submitHandlers = new ArrayList();
            this.responseHandlers = new ArrayList();
            this.form = id ? $(id) : null;
            if(this.form && this.form.length) {
                this.parse();
                this.form.submit(this.handleSubmit);
            }
            return this;
        }
        Form.prototype.setAction = function (val) {
            if(val) {
                this.formAction = val;
            }
        };
        Form.prototype.getAction = function () {
            return this.formAction;
        };
        Form.prototype.parse = function () {
            var coll = new ArrayList();
            var inputs = this.form.find('input:not(:checkbox)').filter('input:not(:radio)').filter('input:not(:submit)');
            var checkboxes = this.form.find('input:checkbox').filter('input:checked');
            var radios = this.form.find('input:radio').filter('input:checked');
            var selects = this.form.find('select');
            var texts = this.form.find('textarea');
            coll.add(inputs);
            coll.add(checkboxes);
            coll.add(radios);
            coll.add(selects);
            coll.add(texts);
            var name;
            coll.forEach(function (item, indx) {
                item.each(function (index) {
                    var c = $(this);
                    name = c.attr("name");
                    if(name) {
                        var leftBr = name.indexOf("["), rightBr = name.indexOf("]");
                        if(leftBr && rightBr) {
                            var arrayName = name.substring(0, leftBr);
                            var propName = name.substring((leftBr + 1), (rightBr));
                            if(propName.length > 0) {
                                if(!this.items.item(arrayName)) {
                                    this.items.add(arrayName, new Object());
                                }
                                var formItem = this.items.item(arrayName);
                                formItem[propName] = c;
                            } else {
                                if(!this.items.item(arrayName)) {
                                    this.items.add(arrayName, []);
                                }
                                this.items.item(arrayName).push(c);
                            }
                        } else {
                            this.items.add(name, c);
                        }
                    } else {
                        console.log("Unable to add form type: " + c.attr("type") + ". Element has no name attribute defined.");
                    }
                });
            });
            this.formAction = this.form.attr("action");
        };
        Form.prototype.setValidator = function (v) {
            this.validator = v;
        };
        Form.prototype.getItems = function () {
            return this.items;
        };
        Form.prototype.item = function (key) {
            return this.items.item(key);
        };
        Form.prototype.submit = function (async) {
            if(this.form && this.form.length && this.formAction != "") {
                if(async) {
                    var coll = this.createCollection();
                    var destination = this.formAction;
                    var valid = true;
                    if((this.validator != null) && (this.validationModel != null)) {
                        valid = this.validator.validate(this.createCollection, this.validationModel);
                    }
                    if(valid) {
                        $.ajax({
                            type: "POST",
                            processData: false,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: destination,
                            data: JSON.stringify(coll.items),
                            success: this.handleResponse,
                            error: this.onRequestError
                        });
                    }
                } else {
                    this.form.submit();
                }
            }
        };
        Form.prototype.handleSubmit = function (evtObj) {
            if((this.validator != null) && (this.validationModel != null)) {
                this.validator.validate(this.createCollection, this.validationModel);
            }
            var success = true;
            this.submitHandlers.forEach(function (h) {
                success = success && h(evtObj);
            });
            return success;
        };
        Form.prototype.handleResponse = function (resp, status, xhr) {
            if(this.responseHandlers.count() > 0) {
                this.responseHandlers.forEach(function (h) {
                    h.call(this, resp);
                });
            }
        };
        Form.prototype.addSubmitHandler = function (obj) {
            if(obj && typeof (obj) == "function") {
                this.submitHandlers.add(obj);
            }
        };
        Form.prototype.addResponseHandler = function (obj) {
            if(obj && typeof (obj) == "function") {
                this.responseHandlers.add(obj);
            }
        };
        Form.prototype.removeResponseHandler = function (obj) {
            this.responseHandlers.remove(obj);
        };
        Form.prototype.removeSubmitHandler = function (obj) {
            this.submitHandlers.remove(obj);
        };
        Form.prototype.createCollection = function () {
            var coll = new Dictionary({
            });
            this.items.forEach(function (item, ind) {
                if(Object.isArray(item)) {
                    var formItems = [];
                    for(var i = 0; i < item.length; i++) {
                        var ele = item[i];
                        formItems.push(ele[0].value);
                    }
                    coll.add(ind, formItems);
                } else {
                    if(Object.isObject(item)) {
                        var formItems;
                        Object.each(item, function (ele, key) {
                            formItems[key] = ele[0].value;
                        });
                        coll.add(ind, formItems);
                    } else {
                        coll.add(item.attr("name"), item[0].value);
                    }
                }
            });
            return coll;
        };
        Form.prototype.setValidationModel = function (model) {
            this.validationModel = model;
        };
        Form.prototype.onRequestError = function (err) {
            var requestErrors = err;
        };
        return Form;
    })();
    Gobe.Form = Form;    
    var Application = (function () {
        function Application() { }
        Application.prototype.construct = function (initObj) {
        };
        return Application;
    })();
    Gobe.Application = Application;    
})(Gobe || (Gobe = {}));
//@ sourceMappingURL=gobe.js.map
