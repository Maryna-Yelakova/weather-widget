(function() {
    angular.module("weather")
        .directive('weatherWidget', function() {
            return {
                templateUrl: 'weather-widget.html'
            };
        });
})();