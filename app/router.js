(function () {

    'use strict';

    const ROUTES = [
        {
            state: 'main-menu',
            url: 'app/main-menu/main-menu.html',
            html: ''
        },
        {
            state: 'game',
            url: 'app/game/game.html',
            html: '',
            handler: function () {
                let game = new global.Game();
                game.start();
            }
        },
        {
            state: 'controls',
            url: 'app/controls/controls.html',
            html: ''
        },
        {
            state: 'about',
            url: 'app/about/about.html',
            html: ''
        }
    ]

    class Router {

        constructor () {
            this.hashChangeHandlerBind = this.hashChangeHandler.bind(this);
            window.location.hash = '#main-menu';
            this.updateRoute('main-menu');
            window.addEventListener('hashchange', this.hashChangeHandlerBind);
        }

        hashChangeHandler (event) {
            let splitUrl = event.newURL.split('#');
            let newState = splitUrl[1];

            this.updateRoute(newState);
        }


        updateRoute (state) {
            let route = ROUTES.find(function (route) {
                if (route.state === state) {
                    return true;
                }
            });

            this.loadTemplateHtml(route.url, function (templateHtml) {
                let mainElement = document.body.querySelector('.main');
                mainElement.innerHTML = templateHtml;

                if (route.handler) {
                    route.handler();
                }
            });
        }

        loadTemplateHtml (url, callback) {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.send();

            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            })
        }

    }

    global.Router = Router;

})();
