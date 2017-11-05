
function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function fixWeatherPrefix(weather) {
	return weather.toLowerCase().replace("clouds", "cloudy");
}

$(document).ready(function() {
	window.setTimeout(function() {
		$(".weather-data div").css("visibility", "visible")
		//.css({'visibility': 'visible;'});
	}, 3900);
	
	navigator.geolocation.getCurrentPosition(function(pos) {
		var lat = parseFloat(pos.coords.latitude)
		var lon = parseFloat(pos.coords.longitude)
		var url = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + lon;
		var url2 = 'https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lon + '&date=today&formatted=0';

		$.ajax( {
			url: url2,
			success: function(data) {
				$(".sun-sunrise span").text(formatAMPM(new Date(data.results.sunrise)));
				$(".sun-sunset span").text(formatAMPM(new Date(data.results.sunset)));
			},
			cache: false
		});

		$.ajax({
			url: url,
			success: function(data) {
				$(".weather-city").text(data.name + ', ' + data.sys.country);
				$(".weather-temp").html(parseInt(data.main.temp) + ' &#176;C');
				$(".weather-cond").text(data.weather[0].description);
				$(".weather-logo .wi").addClass('wi-day-' + fixWeatherPrefix(data.weather[0].main));
			},
			cache: false
		});
	});
});


$(".weather-temp").click(function() {
	var unit, val;
	switch ($(".weather-temp").text().slice(-1)) {
		case "C":
			unit = "F";
			val = parseInt((parseFloat($(".weather-temp").text()) * (9/5) ) + 32);
			break;
		case "F":
			unit = "C";
			val = parseInt((parseFloat($(".weather-temp").text()) - 32) * (5/9));
	}
	
	$(".weather-temp").html(val + ' &#176;' + unit);
});