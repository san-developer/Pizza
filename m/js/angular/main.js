(function () {
    var app = angular.module("App");

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