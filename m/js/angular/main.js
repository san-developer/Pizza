(function () {
    var app = angular.module("App", ['ui.router', 'firebase']);

    app.run(function ($rootScope, $firebase, $stateParams, AppSvc, Phrases, Languages, Language) {
        AppSvc.Phrases = new Phrases();
        AppSvc.Languages = new Languages();

        AppSvc.Languages.AvailableLanguages.push(new Language(1, 'ge'));
        AppSvc.Languages.AvailableLanguages.push(new Language(2, 'en'));

        var currentLang = AppSvc.Languages.GetLangByAbbr($stateParams.lang);

        $rootScope.fireBaseUrl = 'https://crackling-fire-4674.firebaseio.com/';

        var refPhrases = new Firebase($rootScope.fireBaseUrl + 'phrases');

        var syncPhrases = $firebase(refPhrases);
        AppSvc.Phrases.Sync = syncPhrases;

        var phrasesPromise = syncPhrases.$asArray();
        AppSvc.Loading = true;

        phrasesPromise.$loaded().then(function (list) {

            AppSvc.Phrases.List = list;
            AppSvc.Loading = false;
        });

    });

    app.config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('/', {
            url: '/',
            controllerProvider: function ($stateParams, AppSvc, Languages) {
                if (!AppSvc.Languages.CurrentLang) {
                    AppSvc.Languages.CurrentLang = AppSvc.Languages.GetLangByAbbr('ge')
                }

                return "MainCtrl";
            }
        }).state('lang', {
            url: '/:lang',
            controllerProvider: function ($stateParams, AppSvc, Languages) {
                if ($stateParams.lang && $stateParams.lang.length == 2) {
                    AppSvc.Languages.CurrentLang = AppSvc.Languages.GetLangByAbbr($stateParams.lang);
                }

                if (!AppSvc.Languages.CurrentLang) {
                    AppSvc.Languages.CurrentLang = AppSvc.Languages.GetLangByAbbr('ge')
                }

                return "MainCtrl";
            }
        })
            .state('home', {
                url: '/:lang/home',
                controllerProvider: function ($stateParams, AppSvc, Languages) {
                    debugger;
                    if ($stateParams.lang && $stateParams.lang.length == 2) {
                        AppSvc.Languages.CurrentLang = AppSvc.Languages.GetLangByAbbr($stateParams.lang);
                    }

                    if (!AppSvc.Languages.CurrentLang) {
                        AppSvc.Languages.CurrentLang = AppSvc.Languages.GetLangByAbbr('ge')
                    }

                    return "MainCtrl";
                }
            })

    });

    app.controller("MainCtrl", ['$scope', '$stateParams', 'AppSvc', '$firebase', '$rootScope',
        function ($scope, $stateParams, AppSvc, $firebase, $rootScope) {
            $scope.AppSvc = AppSvc;

            $scope.HasOrder = false;


            var ref = new Firebase($rootScope.fireBaseUrl);
            $scope.messages = $firebase(ref).$asArray();

            if ($stateParams && AppSvc) {
            }
            ;

            $scope.message = "home"
        }
    ]);
})();