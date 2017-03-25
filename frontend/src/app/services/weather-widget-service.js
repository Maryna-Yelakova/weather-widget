(function() {
    angular.module("weather")
        .service("weatherService",["$http","$sce", weatherService]);

    function weatherService($http,$sce) {
        this.getLocation = function () {
            var locationUrl = 'http://ip-api.com/json';
            return $http.jsonp($sce.trustAsResourceUrl(locationUrl))
                .then(function (response) {
                    var coordinates = {};
                    coordinates.city = response.data.city;
                    return coordinates.city;
                });

        }
        
        this.getWeather = function(city){
            var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city +
                '&units=metric&APPID=2d94cbc152c565553fe01a7e7945465e';

            return $http.jsonp($sce.trustAsResourceUrl(url), {jsonpCallbackParam: 'callback'})
                .then(function(response){
                    var weather = {temp:{}, coord:{}};
                    if (response.data.main) {
                        weather.temp.current = response.data.main.temp;
                        weather.temp.min = response.data.main.temp_min;
                        weather.temp.max = response.data.main.temp_max;
                        weather.humidity = response.data.main.humidity;
                        weather.pressure = response.data.main.pressure;
                    }
                    weather.clouds = response.data.clouds ? response.data.clouds.all : undefined;
                    weather.wind = response.data.wind ? response.data.wind.speed : undefined;
                    weather.city = response.data.name;
                    weather.coord.lat = response.data.coord.lat;
                    weather.coord.lon = response.data.coord.lon;
                    weather.icon = response.data.weather[0].icon;
                    weather.date = new Date();
                    weather.description = response.data.weather[0] ? response.data.weather[0].description : undefined;

                    return weather;
                });
        }
    }
})();