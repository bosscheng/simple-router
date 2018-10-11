!(function () {

    //
    function Router() {
        var _this = this;
        _this.routeMap = {};

        //
        _this._stateChangeHandler = function (state) {
            var listeners = _this.routeMap[state];

            listeners && listeners.forEach(function (listener) {
                listener(state);
            })
        };

        //
        _this._getUrl = function (state) {
            var matchParams = window.location.href.match(/\?.*$/, "");
            var params = matchParams ? matchParams[0] : "";
            var urlWithoutParams = window.location.href.replace(/\?.*/, "");
            var matcher = /^(.+)#!/.exec(urlWithoutParams);
            var url = matcher ? matcher[1] : urlWithoutParams;

            url = url + '#!' + state;
            if (params.length > 0) {
                url += params;
            }
            return url;
        };

        //
        window.addEventListener('popstate', function (ev) {
            var state = _this.getCurrentRoute();
            _this._stateChangeHandler(state);
        })
    }


    Router.prototype = {

        //
        constructor: Router,

        //
        getCurrentRoute: function () {
            var current = /^#!(.+)/.exec(window.location.hash.replace(/\?.*/, ""));
            return current ? current[1] : '';
        },

        //
        registerRoute: function (state, listener) {
            if (!this.routeMap[state]) {
                this.routeMap[state] = [];
            }
            this.routeMap[state].push(listener);
        },

        //
        forwardRoute: function (state) {
            var url = this._getUrl(state);
            window.history.pushState(null, state, url);
            this._stateChangeHandler(state);
        },

        //
        replaceRoute: function (state) {
            var url = this._getUrl(state);
            window.history.replaceState(null, state, url);
            this._stateChangeHandler(state);
        },

        //
        forwardUrl: function (url) {
            window.location.href = url;
        },

        //
        replaceUrl: function (url) {
            window.location.replace(url);
        }
    };


    // RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function () {
            return Router;
        });
        // NodeJS
    } else if (typeof exports !== 'undefined') {
        module.exports = Router;
    } else {
        // browser
        window.Router = Router;
    }
})();