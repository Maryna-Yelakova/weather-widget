(function() {
    angular.module("weather").controller("weather.weatherCtrl", ["$scope","weatherService", weatherCtrl]);
    
    function weatherCtrl($scope,weatherService){
        $scope.weather = {};
        weatherService.getLocation().then(function(city){
            weatherService.getWeather(city).then(function(data){
                $scope.weather = data;
            })
        });
    }
})();