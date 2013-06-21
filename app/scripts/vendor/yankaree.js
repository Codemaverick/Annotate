/// <reference path="../snack-min.js" />
(function () {
    //borrowed from Snack.js
    if (typeof Object.create != 'function') {
        // ES5 Obeject.create
        Object.create = function (o) {
            function F() { }
            F.prototype = o
            return new F
        }
    }


    Object.extend = function (subc, superc, overrides) {
        if (!superc || !subc) {
            throw "Extend failed, please check that all dependencies are included.";
        }

        var F = function () { };
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.prototype.parent = superc.prototype;

        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i] = overrides[i];
            }
        }
        //return subc;
    };




    Object.clone = function () {
        var base = {};

        if (arguments.length == 1)
            return Object.extend(base, arguments[0])

        var target = arguments[0]

        for (var key, i = 1, l = arguments.length; i < l; i++)
            for (key in arguments[i])
                target[key] = arguments[i][key]

            return target;
        }

        ///<summary>
        /// Extends Object with several functions
        ///</summary>
        Object.bind = function (fn, context, args) {
            args = args || [];
            return function () {
                push.apply(args, arguments);
                return fn.apply(context, args)
            }
        }

        Object.punch = function (obj, method, fn, auto) {
            var old = obj[method]
            obj[method] = auto ? function () {
                old.apply(obj, arguments)
                return fn.apply(obj, arguments)
            } : function () {
                var args = [].slice.call(arguments, 0)
                args.unshift(Object.bind(old, obj))
                return fn.apply(obj, args)
            }
        }

        Object.implement = function (base, interface) {
            if (!interface)
                return base;

            for (var i in interface) {
                base.prototype[i] = interface[i];
            }

            return base;
        }



        Object.each = function (obj, fn, context) {
            if (obj.length === void +0) { // loose check for object, we want array-like objects to be treated as arrays
                for (var key in obj)
                    if (obj.hasOwnProperty(key))
                        fn.call(context, obj[key], key, obj);
                return obj
            }

            for (var i = 0, l = obj.length; i < l; i++)
                fn.call(context, obj[i], i, obj)
            return obj
        }


        Object.merge = function (a, b) {
            var obj = {};
            for (var property in a)
                obj[property] = a[property];

            for (var property in b)
                obj[property] = b[property];

            return obj;
        }

        Object.isArray = function(obj){
            return Object.prototype.toString.call( obj ) === "[object Array]";
        }

        Object.isFunction = function(obj){
            return Object.prototype.toString.call( obj ) === "[object Function]";
        }

        Object.isString = function(obj){
            return Object.prototype.toString.call(obj) === "[object String]";
        }

        Object.isObject = function(obj){
            return Object.prototype.toString.call(obj) === "[object Object]";
        }


        var Class = this.Class = function () {
            return function () { };
        }

        ///<summary>
        /// IList Interface. Needs to be impelemented by an object
        ///<summary>
        var IList = {
            add: function (item) { },
            addItemAt: function (item, index) { },
            clear: function () { },
            contains: function (obj) { },
            indexOf: function (obj, startIndex) { },
            remove: function (item) { },
            removeAt: function () { },
            toArray: function () { },
            count: function () { },
            forEach: function (fn, bind) { }
        }


        ///<summary>
        /// Abstract base class implementation of a list
        ///</summary>
        this.ListBase = function () {
            var N = new Class();
            Object.implement(N, IList);
            return new N();
        }


        ///<summary>
        /// ArrayList implementation of the IList Interface. Needs to be impelemented by an object
        ///<summary>
        this.ArrayListBase = {
            add: function (item) {
                this.addItemAt(item, this.length);
            },
            addItemAt: function (item, index) {
                if (index < 0 || index > this.length)
                    throw "Range Error !: Index out of Bounds";

                return this.splice(index, 0, item);
            },
            clear: function () {
                if (this.length > 0) {
                    this.splice(0, this.length);
                }
            },
            contains: function (obj) {
                return this.indexOf(object, 0);
            },
            indexOf: function (obj, startIndex) {
                var icount = this.length;
                var start = startIndex || 0;
                var returnValue = -1;

                if (start > -1 && start < icount) {
                    var i = start;

                    while (i < icount) {
                        if (this[i] == object) {
                            returnValue = i;
                            break;
                        }
                        i++;
                    }
                }
                else
                    throw "Index out of bounds!";
                return returnValue;
            },
            remove: function (item) {
                var index = this.indexOf(item);
                var result = (index >= 0);

                if (result) {
                    this.removeItemAt(index);
                }
                return result;
            },
            removeAt: function () {
                if (index < 0 || index >= this.items.length)
                    throw "Error! Index of of bounds.";

                var removed = this.items.splice(index, 1);
                return removed;
            },
            toArray: function () {
                return this.slice(this, 0); //borrowed from JQuery code
            },
            count: function () {
                return this.length;
            },
            forEach: function (fn, bind) {
                for (var i = 0, l = this.length; i < l; i++) {
                    if (i in this) fn.call(bind, this[i], i, this);
                }
            }
        };

        this.ArrayList = function () {
            var N = new Class();
            Object.extend(N, Array, ArrayListBase);
            return new N();
        }


        ///<summary>
        /// Event Class - Defines a new Event
        ///</summary>
        ///<param name="evtType" type="string">The type of event</param>
        ///<param name="bubbles" type="boolean">Boolean variable to specify whether the event bubbles</param>
        ///<param name="cancelable" type="boolean"> Determines whether the event can be cancelled</param>

        var Event = this.Event = function (evtType, bubbles, cancelable) {
            return base = {
                bubbles: bubbles || false,
                cancelable: cancelable || false,
                currentTarget: {},
                eventPhase: 0,
                target: {},
                type: evtType || ""
            };
        }



        ///<summary>
        /// IEventManager interface
        ///</summary>
        this.IEventManager = {
            handlers: {},
            type: {},
            contexts: {}
        };

        ///<summary>
        ///Constructor function/Class definition for new Event Manager
        ///</summary>
        this.EventManager = function (type, handlers, contexts) {
            var base = Object.create(IEventManager);

            //constructor
            base.init = function () {
                this.type = type || "";  //Should be of EventType enumeration
                this.handlers = handlers || new ArrayList();
                this.contexts = contexts || new ArrayList();
                return this;
            }
            return base.init();
        }

        ///<summary>
        /// IEventDispatcher interface - Functions can be overridden as necessary
        this.IEventDispatcher = {
            init: function () {
                this.events = new ArrayList();
                return this;
            },
            findManager: function (type) {
                var count = this.events.count();
                var loc = -1; //if item found, location will be greater than 0;

                for (x = 0; x < count; x++) {
                    var item = this.events[x];
                    if (item.type == type)
                        loc = x;
                }

                return loc;
            },
            addEventListener: function (type, handler, context) {
                var ind = this.findManager(type);

                if (ind >= 0) {
                    var mgr = this.events[ind];
                    var ctxt = context ? context : null;
                    mgr.contexts.add(ctxt);
                    mgr.handlers.add(handler);
                    //console.log("Event " + type + " successfully subscribed to.");
                }
            },
            removeEventListener: function (type, handler, context) {
                var ind = this.findManager(type);
                if (ind >= 0) {
                    var mgr = this.events[ind];
                    mgr.handlers.remove(handler);
                }
            },

            registerEvent: function (type) {
                //console.log("registerEvent function called!");
                if (this.findManager(type) == -1) {
                    var mgr = new IEventManager(type);
                    this.events.add(mgr);
                }
            },
            dispatchEvent: function (evt) {
                //console.log("dispatchEvent called!");
                var ind = this.findManager(evt.type);
                if (ind >= 0) {
                    var mgr = this.events[ind];
                    var count = mgr.handlers.count();
                    //var currObj;		
                    mgr.handlers.forEach(function (item) {
                        try {
                            if (itemContext) {
                                itemContext[itemHandler](evt);
                            }
                            else {
                                itemHandler(evt);
                            }
                        }
                        catch (e) {
                            //throw "EventHandler exception: Please implement " + ("on"+evt.type).toString();
                            //console.log("Unable to fire event handler.");
                            alert(e);
                            if ((console != null) && (console.log)) {
                                console.log("Exception for event '" + evt.type.toString() + "'");
                            }
                        }
                    });

                } //end if
            } //end dispatchEvent
        }//end IEventDispatcher Interface

        ///<summary>
        /// Concrete Implementation of the EventDispatcher interface
        ///</summary>
        this.EventDispatcher = function () {
            return base = Object.create(IEventDispatcher).init();
        }



        ///<summary>
        /// ArrayCollection Class - Event enhanced Data Collection. Exposes events for Databinding
        ///</summary>
        this.ArrayCollection = function () {
            var F = new Class();
            var I = Object.merge(ArrayListBase, IEventDispatcher);
            Object.extend(F, Array, I);
            return new F();
        }



        ///<summary>
        /// ICollection interface - Construction function must initialize items collection using object of choice
        /// Ex: Array, or Object;
        ///</summary>
        this.ICollection = {
            init: function (initObj) {
                this.items = initObj || {};

                return this;
            },
            subset: function (keys) {
                var results = {};
                for (var i = 0, l = keys.length; i < l; i++) {
                    var k = keys[i];
                    results[k] = this.items[k];
                }
                return results;
            },
            map: function (fn, bind) {
                var results = {};
                var objects = this.items;
                for (var key in this.items) {
                    if (object.hasOwnProperty(key)) results[key] = fn.call(bind, object[key], key, object);
                }
                return results;
            },
            filter: function (fn, bind) {
                var results = {};
                Object.each(this.items, function (value, key) {
                    if (fn.call(bind, value, key, this.items)) results[key] = value;
                });
                return results;
            },
            every: function (fn, bind) {
                for (var key in this.items) {
                    if (object.hasOwnProperty(key) && !fn.call(bind, this.items[key], key)) return false;
                }
                return true;
            },
            some: function (fn, bind) {
                var object = this.items;
                for (var key in object) {
                    if (object.hasOwnProperty(key) && fn.call(bind, object[key], key)) return true;
                }
                return false;
            },
            keys: function () {
                var keys = [];
                for (var key in this.items) {
                    if (this.items.hasOwnProperty(key)) keys.push(key);
                }
                return keys;
            },
            values: function () {
                var values = [];
                for (var key in this.items) {
                    if (this.items.hasOwnProperty(key)) values.push(this.items[key]);
                }
                return values;
            },
            getLength: function () {
                return Object.keys(this.items).length;
            },
            keyOf: function (value) {
                for (var key in this.items) {
                    if (this.items.hasOwnProperty(key) && this.items[key] === value) return key;
                }
                return null;
            },
            contains: function (value) {
                return this.keyOf(value) != null;
            },

            toQueryString: function (base) {
                var queryString = [];
                var object = this.items;

                Object.each(object, function (value, key) {
                    if (base) key = base + '[' + key + ']';
                    var result;
                    switch (typeOf(value)) {
                        case 'object': result = Object.toQueryString(value, key); break;
                        case 'array':
                            var qs = {};
                            value.each(function (val, i) {
                                qs[i] = val;
                            });
                            result = Object.toQueryString(qs, key);
                            break;
                        default: result = key + '=' + encodeURIComponent(value);
                    }
                    if (value != null) queryString.push(result);
                });

                return queryString.join('&');
            },
            add: function (key, value) {
                this.items[key] = value;
            },
            remove: function (key) {
                if (this.items.hasOwnProperty(key)) this.items[key] = undefined;
            },
            clear: function () {
                this.items = {};
            },
            toArray: function () {
                return this.keys(); //borrowed from JQuery code
            },
            count: function () {
                return this.keys().length;
            },
            forEach: function (fn, bind) {
                Object.each(this.items, fn, bind);
            },
            item: function (key) {
                return this.items[key];
            }

        }//end ICollection Interface



        ///<summary>
        /// Dictionary Object - Concrete implementation of ICollection interface
        ///</summary>
        var Dictionary = this.Dictionary = function (initObj) {
            var F = new Class();
            return Object.merge(F, Object.create(ICollection).init(initObj || {}));

        }

        ///<summary>
        ///Concrete implementation of ICollection Interface
        ///<summary>
        this.FormCollection = function () {
            var F = new Class();
            return Object.merge(F, Object.create(ICollection).init());

        }

        var IValidator = this.IValidator = {
            validate: function (collection, model) { }
        }

        var MValidator = this.MValidator = function () {
            var F = new Class();
            vFunctions = new Dictionary();

            /*
               sample validation model
               {
                  "firstname":['required','unique'],
                  "dateOfBirth":['date']
                }
            */

            base = {
                validators:vFunctions,
                validate: function (coll, model) {
                    var validationErrors = new Dictionary();
                    for (key in model) {
                        if (coll.item(key) != null) {
                            model[key].forEach(function (v) {
                                //call individual validators
                                var res = this.validators.get(v).validate(coll.item(key));
                            });
                        }
                    }
                }
            }
            F = Object.implement(F, base);
            return F;
        }

    ///<summary>
    ///Form Class
    ///</summary>
        var Form = this.Form = function (id) {
            var F = new Class();
            var items = new Dictionary();
            var form;
            var validator = null;
            var validationModel = null;
            var formAction = "";
            var submitHandlers = new ArrayList();
            var responseHandlers = new ArrayList();

            var base = {
                requestErrors:[],
                init: function () {
                    form = id ? $(id) : null;
                    if (form && form.length) {
                        this.parse();
                        form.submit(this.handleSubmit)
                    }
                    return this;
                },
                setAction: function (val) {
                    if (val) {
                        formAction = val;
                    }
                },
                getAction: function () {
                    return formAction;
                },
                parse: function () {
                    var coll = new ArrayList();
                    var inputs = form.find('input:not(:checkbox)').filter('input:not(:radio)').filter('input:not(:submit)');
                    var checkboxes = form.find('input:checkbox').filter('input:checked');
                    var radios = form.find('input:radio').filter('input:checked');
                    var selects = form.find('select');
                    var texts = form.find('textarea');

                    coll.add(inputs);
                    coll.add(checkboxes);
                    coll.add(radios);
                    coll.add(selects);
                    coll.add(texts);
                    var name;

                    coll.forEach(function (item) {
                        item.each(function (index) {
                            var c = $(this);
                            name = c.attr("name");

                            if (name) {
                                var leftBr = name.indexOf("["), rightBr = name.indexOf("]");
                                if(leftBr && rightBr){
                                    var arrayName = name.substring(0, leftBr);
                                    var propName = name.substring((leftBr + 1), (rightBr));

                                    //php - if array notation is similar to "categories[fruits]"
                                    if(propName.length > 0){
                                        if(!items.item(arrayName)){
                                            items.add(arrayName, new Object());
                                        }
                                        formItem = items.item(arrayName);
                                        formItem[propName] = c;
                                    }else{
                                    //php - array notation is similar to "categories[]"
                                        if(!items.item(arrayName)){
                                            items.add(arrayName, []);
                                        }
                                        items.item(arrayName).push(c);
                                    }
                                }else{
                                    items.add(name, c);
                                }//end if
                                
                            } else {
                                console.log("Unable to add form type: " + c.attr("type") + ". Element has no name attribute defined.");
                            }
                        });
                    });
                    
                    formAction = form.attr("action");

                },

                setValidator:function(v){
                    validator = v;

                },

                getItems:function(){
                    return items;
                },

                item:function(key){

                    return items.item(key);
                },

                submit: function (async) {
                    if (form && form.length && formAction!= "") {
                        if (async) {
                            var coll = this.createCollection();
                            var destination = formAction;
                            var valid = true;

                            if ((validator != null) && (validationModel != null))
                                valid = validator.validate(this.createCollection, validationModel);

                            if (valid) {
                                $.ajax({
                                    type: "POST",
                                    processData: false,
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    url: destination,
                                    data: JSON.stringify(coll.items),
                                    success: this.handleResponse,
                                    error: onRequestError
                                });
                            }

                        } else {
                            form.submit();
                        }
                    }
                },

                handleSubmit: function (evtObj) {
                    if ((validator != null) && (validationModel != null)) validator.validate(this.createCollection, validationModel);

                    //form valid. Call submit handlers
                    var success = true;
                    submitHandlers.forEach(function (h) {
                        success = success && h(evtObj); //if all handlers return true, submission continues, otherwise, process stopped
                    });
                    return success;
                },

                handleResponse: function (resp, status, xhr) {
                    if (responseHandlers.count() > 0) {
                        responseHandlers.forEach(function (h) {
                            h.call(this, resp);
                        });
                    }
                },

                addSubmitHandler:function(obj){
                    if(obj && typeof(obj) == "function") submitHandlers.add(obj);
                },

                addResponseHandler:function(obj){
                    if (obj && typeof (obj) == "function") responseHandlers.add(obj);
                },

                removeResponseHandler:function(obj){
                    responseHandlers.remove(obj)
                },

                removeSubmitHandler:function(obj){
                    submitHandlers.remove(obj);
                },

                createCollection: function () {
                    var coll = new Dictionary();
                    items.forEach(function (item, ind) {
                        if(Object.isArray(item)){
                            var formItems = [];
                            for(var i = 0; i < item.length; i++){
                                var ele = item[i];
                                formItems.push(ele[0].value);
                            }
                            coll.add(ind, formItems);
                        }else if(Object.isObject(item)){
                            var formItems = new Object();

                            Object.each(item,function(ele, key){
                                formItems[key] = ele[0].value;
                            });
                            coll.add(ind, formItems);

                        }else{
                            coll.add(item.attr("name"), item[0].value);
                        }
                        
                    });

                    return coll;
                },

                setValidationModel: function (model) {
                    validationModel = model;
                }
            }


            var onRequestError = function (err) {
                base.requestErrors = err;
            };

            return Object.merge(F, Object.create(base).init());
            
        }

        var Application = this.Application = function (initObj) {
            var app = new Class();
            var viewList = new ArrayCollection();


        }


})();

