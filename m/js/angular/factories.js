var app = angular.module("App");

app.factory("AppSvc", ['$location', '$stateParams', '$firebase', '$rootScope', function ($location, $stateParams, $firebase, $rootScope) {
    return {
        Languages: [],
        Phrases: {},
        Loading: false
    }
}]);