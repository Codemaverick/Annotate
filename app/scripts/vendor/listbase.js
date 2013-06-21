(function () {
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
            return Object["extend"](base, arguments[0])

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
            fn.apply(context, args);
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

    Object.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

    Object.isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    }

    Object.isString = function (obj) {
        return Object.prototype.toString.call(obj) === "[object String]";
    }

    Object.isObject = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Object]";
    }


    var Collections = this.Collections = Collections ? Collections : {};


    var ListBase = function () {
        var N = function () { };
        Object.extend(N, Array);
        return new N();
    }

    Collections.ListBase = ListBase;

})();

