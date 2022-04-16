/**
 * This file is licensed under Creative Commons Zero (CC0)
 * https://creativecommons.org/publicdomain/zero/1.0/
 *
 * Author: https://www.openstreetmap.org/user/Zartbitter
 */

var map;

/**
 * Add or replace a parameter (with value) in the given URL.
 * By Adil Malik, https://stackoverflow.com/questions/1090948/change-url-parameters/10997390#10997390
 * @param String url the URL
 * @param String param the parameter
 * @param String paramVal the value of the parameter
 * @return String the changed URL
 */
function updateURLParameter(url, param, paramVal) {
var theAnchor = null;
var newAdditionalURL = "";
var tempArray = url.split("?");
var baseURL = tempArray[0];
var additionalURL = tempArray[1];
var temp = "";

if (additionalURL) {
var tmpAnchor = additionalURL.split("#");
var theParams = tmpAnchor[0];
theAnchor = tmpAnchor[1];
if(theAnchor) {
additionalURL = theParams;
}

tempArray = additionalURL.split("&");

for (i=0; i<tempArray.length; i++) {
if(tempArray[i].split('=')[0] != param) {
newAdditionalURL += temp + tempArray[i];
temp = "&";
}
}        
} else {
var tmpAnchor = baseURL.split("#");
var theParams = tmpAnchor[0];
theAnchor  = tmpAnchor[1];

if(theParams) {
baseURL = theParams;
}
}

if(theAnchor) {
paramVal += "#" + theAnchor;
}

var rows_txt = temp + "" + param + "=" + paramVal;
return baseURL + "?" + newAdditionalURL + rows_txt;
}

/**
 * Add or replace the language parameter of the URL and reload the page.
 * @param String id of the language
 */
function changeLanguage(pLang) {
window.location.href = updateURLParameter(window.location.href, 'lang', pLang);
}

/**
 * Get all parameters out of the URL.
 * @return Array List of URL parameters key-value indexed
 */
function getUrlParameters() {
var vars = [], hash;
var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
for(var i=0; i<hashes.length; i++) {
hash = hashes[i].split('=');
vars.push(hash[0]);
vars[hash[0]] = hash[1];
}
return vars;
}

/**
 * Callback for successful geolocation.
 * @var position Geolocated position
 */
function foundLocation(position) {
if (typeof map != "undefined") {
var lat = position.coords.latitude;
var lon = position.coords.longitude;
map.setView(new L.LatLng(lat, lon), 11);
}
}

/**
 * Example function to replace leaflet-openweathermap's builtin marker by a wind rose symbol.
 * Some helper functions and an event listener are needed, too. See below.
 */
function myWindroseMarker(data) {
var content = '<canvas id="id_' + data.id + '" width="50" height="50"></canvas>';
var icon = L.divIcon({html: content, iconSize: [50,50], className: 'owm-div-windrose'});
return L.marker([data.coord.Lat, data.coord.Lon], {icon: icon, clickable: false});
}

/**
 * Helper function for replacing leaflet-openweathermap's builtin marker by a wind rose symbol.
 * This function draws the canvas of one marker symbol once it is available in the DOM.
 */
function myWindroseDrawCanvas(data, owm) {

var canvas = document.getElementById('id_' + data.id);
canvas.title = data.name;
var angle = 0;
var speed = 0;
var gust = 0;
if (typeof data.wind != 'undefined') {
if (typeof data.wind.speed != 'undefined') {
canvas.title += ', ' + data.wind.speed + ' m/s';
canvas.title += ', ' + owm._windMsToBft(data.wind.speed) + ' BFT';
speed = data.wind.speed;
}
if (typeof data.wind.deg != 'undefined') {
//canvas.title += ', ' + data.wind.deg + '°';
canvas.title += ', ' + owm._directions[(data.wind.deg/22.5).toFixed(0)];
angle = data.wind.deg;
}
if (typeof data.wind.gust != 'undefined') {
gust = data.wind.gust;
}
}
if (canvas.getContext && speed > 0) {
var red = 0;
var green = 0;
if (speed <= 10) {
green = 10*speed+155;
red = 255*speed/10.0;
} else {
red = 255;
green = 255-(255*(Math.min(speed, 21)-10)/11.0);
}
var ctx = canvas.getContext('2d');
ctx.translate(25, 25);
ctx.rotate(angle*Math.PI/180);
ctx.fillStyle = 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + 0 + ')';
ctx.beginPath();
ctx.moveTo(-15, -25);
ctx.lineTo(0, -10);
ctx.lineTo(15, -25);
ctx.lineTo(0, 25);
ctx.fill();

// draw inner arrow for gust
if (gust > 0 && gust != speed) {
if (gust <= 10) {
green = 10*gust+155;
red = 255*gust/10.0;
} else {
red = 255;
green = 255-(255*(Math.min(gust, 21)-10)/11.0);
}
canvas.title += ', gust ' + data.wind.gust + ' m/s';
canvas.title += ', ' + owm._windMsToBft(data.wind.gust) + ' BFT';
ctx.fillStyle = 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + 0 + ')';
ctx.beginPath();
ctx.moveTo(-15, -25);
ctx.lineTo(0, -10);
//ctx.lineTo(15, -25);
ctx.lineTo(0, 25);
ctx.fill();
}
} else {
canvas.innerHTML = '<div>'
+ (typeof data.wind != 'undefined' && typeof data.wind.deg != 'undefined' ? data.wind.deg + '°' : '')
+ '</div>';
}
}

/**
 * Helper function for replacing leaflet-openweathermap's builtin marker by a wind rose symbol.
 * This function is called event-driven when the layer and its markers are added. Now we can draw all marker symbols.
 * The this-context has to be the windrose layer.
 */
function windroseAdded(e) {
for (var i in this._markers) {
var m = this._markers[i];
var cv = document.getElementById('id_' + m.options.owmId);
for (var j in this._cache._cachedData.list) {
var station = this._cache._cachedData.list[j];
if (station.id == m.options.owmId) {
myWindroseDrawCanvas(station, this);
}
}
}
}

/**
 * Example function to replace leaflet-openweathermap's builtin marker.
 */
function myOwmMarker(data) {
// just a Leaflet default marker
return L.marker([data.coord.Lat, data.coord.Lon]);
}

/**
 * Example function to replace leaflet-openweathermap's builtin popup.
 */
function myOwmPopup(data) {
// just a Leaflet default popup
return L.popup().setContent(typeof data.name != 'undefined' ? data.name : data.id);
}

/**
 * Toggle scroll wheel behaviour.
 */
function toggleWheel(localLang) {
if (map.scrollWheelZoom._enabled) {
map.scrollWheelZoom.disable();
document.getElementById('wheelimg').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAAACXBIWXMAABJ0AAASdAHeZh94AAADVklEQVQ4jXVUX2jbVRT+zj33l39NOh1Ku7WxUjBRiU1qdYyhtN2DYt9kfRiCPsoEBfHZN99FUHDkcQ/60jEZYVBf2jxsSLGmNSMuEYyrceta1y1t03T53XuPD7+sJqIHLtxzOee73zn33I9EBBAhAEqIrGncOYO10kfqj41p2t8dAgCJD95zyWeKyE1+qUdP3iARBuBAJCTOEYjE+iZql5a+0KUf31cHLUg0CokNAADooAVqt+FiAzCTr+R5dvZj9nQbIkQiAuubqF1YuBa6VZ5xTxw3duqUUCrFlEiQAMDenkitZnl1hdTDHd15/qUiz8+/xZ5ukxOBv/j916EbxQtm9NlDeftcyHvquIIIQAQAeLz3/9pxdOVyRzd+j3TOTF/03nzjA+psNF7jby8tixci98578IaeVmItiBnra2sAgGwuh8dn/r1tp765BPI7Ys+/O8Ofnj37mb7926Q5/brxMi9q6gaWy2WUb97E1vY2iAhDw8OAtVCJOJlHvtG/3tKWPU+pxsa0RKKgVEoRADCjWq2iUqkgHA4jHA6jUqmgWq0CzCAA9FxKSSQK1diY1rS/fxLRGNSxQRWUKxgfH0cymcTi4iIAYG5uDp7nQURAREFsNAba3zuhxFomrcCaux0LQEQE/+ezZiKtINaxQo8JACJCvV5HoVCAtRbWWhQKBdTrdRARBH1Gus/r3pZOp+H7PtbX14NXyGaRTqePSui1PoBekEwmA+ccACCTyQTJ/w4GRBOzEeNCzljhID+gKoKJiYmjHhBRMFAArLGijCNiZZXE43dxcADXbLo+Jl2Q/6Ltmk2H9gEknrijXHKsSI/akFrNCQA41wfSl+wcBIDUao4O23CjY0WFiWzexeKGS6tsNrccmAFrA7q9y1qAGWZz23FplV0sbpDN5pWXHLluclN5bu4oXP2u42/dD0ACCv98KGb4W/cdrl7pcHNHmexU3kuOXO9+ZxuxlxeuhX75edYde9KYl0+JSqeUGgym0+3uOletOf3TCqnmA915YWKJz83PsceHvYISscvFz3Vp5YJqtUgiUWAgEBS0WqDDNtzAgJjJVy/yzMwn7OnDI0Hpk7Q/757G2tqHqnF7hvb2hgFAEolNNzq2jFzuKz1y4odeSfsbbWvHEtffabUAAAAASUVORK5CYII=';
document.getElementById('wheeltxt').innerHTML = getI18n('scrollwheel', localLang) + ' ' + getI18n('off', localLang);
} else {
map.scrollWheelZoom.enable();
document.getElementById('wheelimg').src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAAACXBIWXMAABJ0AAASdAHeZh94AAADL0lEQVQ4jV1UQWtTWRT+7n0vpe1Lk6xLmxZBq/9A1EUnHf9FIVRclDROF4VoSEEXXXcjKq50hoK78R84I9PGVEuIGiruGggNTyHURfKSl3vuN4v0xdQDF8453znnnnvuvR9IwlqrjDEOSZTLhzdWV7OvZmfnTpVSopSS2dm509XV7Kty+fAGSRhjHGutIglESrcbTK2v559rrQmAABiPzzAenxnZWmuur+efd7vBVLQxhsm9qeXl3/8BwGQyNSgWt8NqtSa+/836/jdbrdZMsbgdJpOpAQAuL6/82+32pkgCJJHL3XsGgEtL14Lj469CktbaC4skj4+/ytLStQAAc7l7z0gC+/vvbimljefF5eOnupBkEAQkabe2CmZrq2BI2nMfP36qi+fFRSlt/tsv38La2t0/AfD+g1JIkr1ejyRZLG6b6OzF4raMY/cflEIAXFu7+xcWFy+dAGCl8t7wXHZ3HxsA4sZcuq5LALK7+3iEVyrvDQAuLF5qQGs39DyPrZZvSdIYw7OzH7bZbMnMTMLG4wnbbLbk7OyHNWZYo9Xyred51NoNtbXGicVcTEy4CudirVXWypgtirQje2LCVbFYDNYaRw9d6nwBjuPg5cs9SafnEARd1et1VTo9hxcv9sRxHPyM/6lIKpViu91mdASSLJUejYZYKj0y41i73WYqlSIA6w4LESSHJZWGiGBn56ETDkIBgJ2dh46IQKlhw1EsAEJrtz8+xOjRiAjtuYgIx7ELQ0wvpFudTgcnjYYdr661BklFUml9ceeTRsN2Oh2k0+lTnflt5S0AvP77tQUAY0zUHrTWiJLHsSg2k1l5i4ODyk2tncH0tCe12mchyX6/T2PM6B8YY9jv90mStdpnmZ72RGtnsH/w7iZIIp/ffAKAl69cDer1LxLNIJJIr9e/yOUrVwMA3MhvPhn9xiDoT2ZWbr8BwEQiOSgUiuHRUdX4/nfr+9/t0VHVFArFMJFIDgAwk7n9Jgh6kxcIJQh6kxsbm0+1dmx0/57n0fO8MUJxbG7jj6dR8ohQximtcvjhejZ7Z29+fqGptDZKazM/v9DMZu/sVSofrv9Kaf8DuKe/azHHOowAAAAASUVORK5CYII=';
document.getElementById('wheeltxt').innerHTML = getI18n('scrollwheel', localLang) + ' ' + getI18n('on', localLang);
}
}

/**
 * Initialize the map.
 */
function initMapIss() {

var standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
});

var humanitarian = L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
maxZoom: 17,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a> <a href="https://www.hotosm.org/" target="_blank">Tiles courtesy of Humanitarian OpenStreetMap Team</a>'
});

var esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.jpg", {
maxZoom: 19, attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Get your own free OWM API key at https://www.openweathermap.org/appid - please do not re-use mine!
// You don't need an API key for this to work at the moment, but this will change eventually.
var OWM_API_KEY = '06aac0fd4ba239a20d824ef89602f311';

var clouds = L.OWM.clouds({opacity: 0.8, legendImagePath: 'files/NT2.png', appId: OWM_API_KEY});
var cloudscls = L.OWM.cloudsClassic({opacity: 0.5, appId: OWM_API_KEY});
var precipitation = L.OWM.precipitation( {opacity: 0.5, appId: OWM_API_KEY} );
var precipitationcls = L.OWM.precipitationClassic({opacity: 0.5, appId: OWM_API_KEY});
var rain = L.OWM.rain({opacity: 0.5, appId: OWM_API_KEY});
var raincls = L.OWM.rainClassic({opacity: 0.5, appId: OWM_API_KEY});
var snow = L.OWM.snow({opacity: 0.5, appId: OWM_API_KEY});
var pressure = L.OWM.pressure({opacity: 0.4, appId: OWM_API_KEY});
var pressurecntr = L.OWM.pressureContour({opacity: 0.5, appId: OWM_API_KEY});
var temp = L.OWM.temperature({opacity: 0.5, appId: OWM_API_KEY});
var wind = L.OWM.wind({opacity: 0.5, appId: OWM_API_KEY});

var localLang = getLocalLanguage();

var city = L.OWM.current({intervall: 15, imageLoadingUrl: 'leaflet/owmloading.gif', lang: localLang, minZoom: 5,
appId: OWM_API_KEY});
var windrose = L.OWM.current({intervall: 15, imageLoadingUrl: 'leaflet/owmloading.gif', lang: localLang, minZoom: 4,
appId: OWM_API_KEY, markerFunction: myWindroseMarker, popup: false, clusterSize: 50,
    imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png' });
windrose.on('owmlayeradd', windroseAdded, windrose); // Add an event listener to get informed when windrose layer is ready

var useGeolocation = true;
var zoom = 6;
var lat = 51.58;
var lon = 10.1;
var urlParams = getUrlParameters();
if (typeof urlParams.zoom != "undefined" && typeof urlParams.lat != "undefined" && typeof urlParams.lon != "undefined") {
zoom = urlParams.zoom;
lat = urlParams.lat;
lon = urlParams.lon;
useGeolocation = false;
}

map = L.map('map', {
center: new L.LatLng(lat, lon), zoom: zoom,
layers: [standard]
});
map.attributionControl.setPrefix("");

map.addControl(L.languageSelector({
languages: new Array(
L.langObject('en', 'English', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAflJREFUeNpinDRzn5qN3uFDt16+YWBg+Pv339+KGN0rbVP+//2rW5tf0Hfy/2+mr99+yKpyOl3Ydt8njEWIn8f9zj639NC7j78eP//8739GVUUhNUNuhl8//ysKeZrJ/v7z10Zb2PTQTIY1XZO2Xmfad+f7XgkXxuUrVB6cjPVXef78JyMjA8PFuwyX7gAZj97+T2e9o3d4BWNp84K1NzubTjAB3fH0+fv6N3qP/ir9bW6ozNQCijB8/8zw/TuQ7r4/ndvN5mZgkpPXiis3Pv34+ZPh5t23//79Rwehof/9/NDEgMrOXHvJcrllgpoRN8PFOwy/fzP8+gUlgZI/f/5xcPj/69e/37//AUX+/mXRkN555gsOG2xt/5hZQMwF4r9///75++f3nz8nr75gSms82jfvQnT6zqvXPjC8e/srJQHo9P9fvwNtAHmG4f8zZ6dDc3bIyM2LTNlsbtfM9OPHH3FhtqUz3eXX9H+cOy9ZMB2o6t/Pn0DHMPz/b+2wXGTvPlPGFxdcD+mZyjP8+8MUE6sa7a/xo6Pykn1s4zdzIZ6///8zMGpKM2pKAB0jqy4UE7/msKat6Jw5mafrsxNtWZ6/fjvNLW29qv25pQd///n+5+/fxDDVbcc//P/zx/36m5Ub9zL8+7t66yEROcHK7q5bldMBAgwADcRBCuVLfoEAAAAASUVORK5CYII=')
, L.langObject('de', 'Deutsch', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGzSURBVHjaYvTxcWb4+53h3z8GZpZff/79+v3n/7/fDAz/GHAAgABi+f37e3FxOZD1Dwz+/v3z9y+E/AMFv3//+Qumfv9et241QACxMDExAVWfOHkJJAEW/gUEP0EQDn78+AHE/gFOQJUAAcQiy8Ag8O+fLFj1n1+/QDp+/gQioK7fP378+vkDqOH39x9A/RJ/gE5lAAhAYhzcAACCQBDkgRXRjP034R0IaDTZTFZn0DItot37S94KLOINerEcI7aKHAHE8v/3r/9//zIA1f36/R+o4tevf1ANYNVA9P07RD9IJQMDQACxADHD3z8Ig4GMHz+AqqHagKp//fwLVA0U//v7LwMDQACx/LZiYFD7/5/53/+///79BqK/EMZ/UPACSYa/v/8DyX9A0oTxx2EGgABi+a/H8F/m339BoCoQ+g8kgRaCQvgPJJiBYmAuw39hxn+uDAABxMLwi+E/0PusRkwMvxhBGoDkH4b/v/+D2EDyz///QB1/QLb8+sP0lQEggFh+vGXYM2/SP6A2Zoaf30Ex/J+PgekHwz9gQDAz/P0FYrAyMfz7wcDAzPDtFwNAgAEAd3SIyRitX1gAAAAASUVORK5CYII=')
, L.langObject('fr', 'Français', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGzSURBVHjaYiyeepkBBv79+Zfnx/f379+fP38CyT9//jAyMiq5GP77wvDnJ8MfoAIGBoAAYgGqC7STApL///3/9++/pCTv////Qdz/QO4/IMna0vf/z+9/v379//37bUUTQACBNDD8Z/j87fffvyAVX79+/Q8GQDbQeKA9fM+e/Pv18/+vnwzCIkBLAAKQOAY5AIAwCEv4/4PddNUm3ji0QJyxW3rgzE0iLfqDGr2oYuu0l54AYvnz5x9Q6d+/QPQfyAQqAin9B3EOyG1A1UDj//36zfjr1y8GBoAAFI9BDgAwCMIw+P8Ho3GDO6XQ0l4MN8b2kUwYaLszqgKM/KHcDXwBxAJUD3TJ779A8h9Q5D8SAHoARP36+Rfo41+/mcA2AAQQy49ff0Cu//MPpAeI/0FdA1QNYYNVA/3wmwEYVgwMAAHE8uPHH5BqoD1//gJJLADoJKDS378Z//wFhhJAALF8A3rizz8uTmYg788fJkj4QOKREQyYxSWBhjEC/fcXZANAALF8+/anbcHlHz9+ffvx58uPX9KckkCn/gby/wLd8uvHjx96k+cD1UGiGQgAAgwA7q17ZpsMdUQAAAAASUVORK5CYII=')
, L.langObject('it', 'Italiano', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE2SURBVHjaYmSYyMDwgwEE/jEw/GF4mvT0HyqQUlX9B5aEIIAAYmH4wlDtWg1SDwT//0lKSv7/D+T9/w+nYmL+//79/88fIPll0yaAAGJhYAGJP/n69O+/v0CAUAcHt2////ULqJpRVhZoA0AAsQCtAZoMVP0HiP7+RlcNBEDVYA0Mv38DNQAEEMj8vwx//wCt/AdC/zEBkgagYoAAYgF6FGj277+///wlpAEoz8AAEEAgDX/BZv/69wuoB48GRrCTAAKICajh9//fv/6CVP/++wu7BrDxQFf/YWAACCCwk0BKf0MQdg1/gBqAPv0L9ANAALEAY+33vz+S3JIgb/z5C45CBkZGRgY4UFICKQUjoJMAAoiRoZSB4RMojkHx/YPhbNVZoM3AOISQQPUK9vaQOIYAgAADAC5Wd4RRwnKfAAAAAElFTkSuQmCC')
, L.langObject('es', 'Español', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFnSURBVHjaYvzPgAD/UNlYEUAAmuTYAAAQhAEYqF/zFbe50RZ1cMmS9TLi0pJLRjZohAMTGFUN9HdnHgEE1sDw//+Tp0ClINW/f0NIKPoFJH/9//ULyGaUlQXaABBALAx/Gf4zAt31F4i+ffj3/cN/XrFfzOx//v///f//LzACM/79ZmD8/e8TA0AAMYHdDVT958vXP38nMDB0s3x94/Tj5y+YahhiAKLfQKUAAcQEdtJfoDHMF2L+vPzDmFXLelf551tGFOOhev4A/QgQQExgHwAd8IdFT/Wz6j+GhlpmXSOW/2z///8Eq/sJ18Dw/zdQA0AAMQExxJjjdy9x2/76EfLz4MXdP/i+wsyGkkA3Aw3984cBIIAYfzIwMKel/bt3jwEaLNAwgZIQxp/fDH/+MqqovL14ESCAWICeZvr9h0FSEhSgwBgAygFDEMT+wwAhgQgc4kAEVAwQQIxfUSMSTxxDAECAAQAJWke8v4u1tAAAAABJRU5ErkJggg==')
, L.langObject('ca', 'Català', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATBJREFUeNpUkU1LA0EMhpNViqWtVYrFj4OnulCoFNSbF3+Gtn9UvBSxoHgR9eRBD1Xbgyu0Ckt3MhMzMzvtGsLLSxieTBKkhxMIwczGmKJqrcUsVGJVqtQ5de8NsGbQwMTWKGaFTABqhb1X6uYVJ/295v5Z3kJIWgFZZXKpJDOmTAyUK/O7F0zvu3TYguW3BK883mUmaqxmCLXZYITj3m5j7QgKgTTP2Rac5U2kQ6U6e3zD39tO6aAB/4PNEs/G4qUC0fr7cIKfFzubpXbxdUSp6xDYwWOt/vM0wumwzd1mYbMWbMIAxjexY6gI6slVgh/n21vlOAzsYY7qNpNXSIHRXN1In8f4fR1Hx3FgEwek+72si4Rt78PaACWXU/watPyN/SH9dRfqT+69GHn5J8AAeJhkjAZrdt8AAAAASUVORK5CYII=')
, L.langObject('ru', 'Русский', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE2SURBVHjaYvz69T8DAvz79w9CQVj/0MCffwwAAcQClObiAin6/x+okxHMgPCAbOb//5n+I4EXL74ABBALxGSwagTjPzbAyMgItAQggBg9Pf9nZPx//x7kjL9////9C2QAyf9//qCQQCQkxFhY+BEggFi2b/+nq8v46BEDSPQ3w+8//3//BqFfv9BJeXmQEwACCOSkP38YgHy4Bog0RN0vIOMXVOTPH6Cv/gEEEEgDxFKgHEgDXCmGDUAE1AAQQCybGZg1f/d8//XsH0jTn3+///z79RtE/v4NZfz68xfI/vOX+4/0ZoZFAAHE4gYMvD+3/v2+h91wCANo9Z+/jH9VxBkYAAKIBRg9TL//MEhKAuWAogxgZzGC2CCfgUggAoYdGAEVAwQQ41egu5AQAyoXTQoIAAIMAD+JZR7YOGEWAAAAAElFTkSuQmCC')
, L.langObject('nl', 'Nederlands', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFXSURBVHjaYvzPgAD/UNlYEUAAkuTgCAAIBgJggq5VoAs1qM0vdzmMz362vezjokxPGimkEQ5WoAQEKuK71zwCCKyB4c//J8+BShn+/vv/+w/D399AEox+//8FJH/9/wUU+cUoKw20ASCAWBhEDf/LyDOw84BU//kDtgGI/oARmAHRDJQSFwVqAAggxo8fP/Ly8oKc9P8/AxjiAoyMjA8ePAAIIJZ///5BVIM0MOBWDpRlZPzz5w9AALH8gyvCbz7QBrCJAAHEyKDYX15r/+j1199//v35++/Xn7+///77DST/wMl/f4Dk378K4jx7O2cABBALw7NP77/+ev3xB0gOpOHfr99AdX9/gTVASKCGP//+8XCyMjC8AwggFoZfIHWSwpwQk4CW/AYjsKlA8u+ff////v33998/YPgBnQQQQIzAaGNg+AVGf5AYf5BE/oCjGEIyAQQYAGvKZ4C6+xXRAAAAAElFTkSuQmCC')
, L.langObject('pt_br', 'Português do Brasil', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHjSURBVHjaYmRIZkCAfwwMf2DkLzCCMyDoBwNAALEAlTVGN/5nYPj//x8Q/P3/9++/vzZa31gY/mw5z/Tn3x8g98+f37///fn99/eq2lUAAQTS8J/h/7NPz/9C5P79WRj89f9/zv//fztLvPVezPzrz+8/f3//+vtLhl8GaANAAIE1/P8PVA1U6qn7NVTqb1XVpAv/JH7/+a/848XmtpBlj39PO8gM1PP7z2+gqwACiAnoYpC9TF9nB34NVf5z4XpoZJbEjJKfWaEfL7KLlbaURKj8Opj08RfIVb+BNgAEEBPQW1L8P+b6/mb6//s/w+/+nc4F0/9P2cj65xdHc+p/QR39//9/AdHJ9A/60l8YvjIABBAT0JYH75jStv75zwCSMBY8BXTMxXv/21ezfHj9X5/3BESDy5JfBy7/ZuBnAAggkA1//vx594kpaCnLloe/smLaVT9/ff3y/+/P/w+u/+JuW7fhwS/tSayPXrOycrEyfGQACCAWoA1//oOCDIgm72fu4vy6b4LD/9/S/3///s9+S28yy+9/LEAf//kLChVgCAEEEEjD7z9/JHgkQeHwD8gUjV79O9r6CzPLv6lr1OUFwWH9Fxjcv//9BcYoA0AAMTI4ImIROUYRMf2XARkABBgA8kMvQf3q+24AAAAASUVORK5CYII=')
),
callback: changeLanguage,
initialLanguage: localLang,
hideSelected: false,
vertical: false
}));

var baseMaps = {
"OSM Standard": standard
, "OSM Humanitarian": humanitarian
// , "ESRI Aerial": esri
};

var overlayMaps = {};
overlayMaps[getI18n('clouds', localLang)] = clouds;
overlayMaps[getI18n('cloudscls', localLang)] = cloudscls;
overlayMaps[getI18n('precipitation', localLang)] = precipitation;
overlayMaps[getI18n('precipitationcls', localLang)] = precipitationcls;
overlayMaps[getI18n('rain', localLang)] = rain;
overlayMaps[getI18n('raincls', localLang)] = raincls;
overlayMaps[getI18n('snow', localLang)] = snow;
overlayMaps[getI18n('temp', localLang)] = temp;
overlayMaps[getI18n('windspeed', localLang)] = wind;
overlayMaps[getI18n('pressure', localLang)] = pressure;
overlayMaps[getI18n('presscont', localLang)] = pressurecntr;
overlayMaps[getI18n('city', localLang) + " (min Zoom 5)"] = city;
overlayMaps[getI18n('windrose', localLang)] = windrose;

var layerControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
map.addControl(new L.Control.Permalink({layers: layerControl, useAnchor: false, position: 'bottomright'}));

// patch layerControl to add some titles
var patch = L.DomUtil.create('div', 'owm-layercontrol-header');
patch.innerHTML = getI18n('layers', localLang); // 'TileLayers';
layerControl._form.children[2].parentNode.insertBefore(patch, layerControl._form.children[2]);
patch = L.DomUtil.create('div', 'leaflet-control-layers-separator');
layerControl._form.children[3].children[0].parentNode.insertBefore(patch, layerControl._form.children[3].children[layerControl._form.children[3].children.length-2]);
patch = L.DomUtil.create('div', 'owm-layercontrol-header');
patch.innerHTML = getI18n('current', localLang); // 'Current Weather';
layerControl._form.children[3].children[0].parentNode.insertBefore(patch, layerControl._form.children[3].children[layerControl._form.children[3].children.length-2]);
patch = L.DomUtil.create('div', 'owm-layercontrol-header');
patch.innerHTML = getI18n('maps', localLang); // 'Maps';
layerControl._form.children[0].parentNode.insertBefore(patch, layerControl._form.children[0]);

patch = L.DomUtil.create('div', 'leaflet-control-layers-separator');
layerControl._form.children[0].parentNode.insertBefore(patch, null);
patch = L.DomUtil.create('div', 'owm-layercontrol-header');
patch.innerHTML = getI18n('prefs', localLang); // 'Preferences';
layerControl._form.children[0].parentNode.insertBefore(patch, null);
patch = L.DomUtil.create('div', '');
patch.innerHTML = '<div id="wheeldiv" onClick="toggleWheel(\'' + localLang + '\')"><img id="wheelimg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAUCAYAAACEYr13AAAACXBIWXMAABJ0AAASdAHeZh94AAADL0lEQVQ4jV1UQWtTWRT+7n0vpe1Lk6xLmxZBq/9A1EUnHf9FIVRclDROF4VoSEEXXXcjKq50hoK78R84I9PGVEuIGiruGggNTyHURfKSl3vuN4v0xdQDF8453znnnnvuvR9IwlqrjDEOSZTLhzdWV7OvZmfnTpVSopSS2dm509XV7Kty+fAGSRhjHGutIglESrcbTK2v559rrQmAABiPzzAenxnZWmuur+efd7vBVLQxhsm9qeXl3/8BwGQyNSgWt8NqtSa+/836/jdbrdZMsbgdJpOpAQAuL6/82+32pkgCJJHL3XsGgEtL14Lj469CktbaC4skj4+/ytLStQAAc7l7z0gC+/vvbimljefF5eOnupBkEAQkabe2CmZrq2BI2nMfP36qi+fFRSlt/tsv38La2t0/AfD+g1JIkr1ejyRZLG6b6OzF4raMY/cflEIAXFu7+xcWFy+dAGCl8t7wXHZ3HxsA4sZcuq5LALK7+3iEVyrvDQAuLF5qQGs39DyPrZZvSdIYw7OzH7bZbMnMTMLG4wnbbLbk7OyHNWZYo9Xyred51NoNtbXGicVcTEy4CudirVXWypgtirQje2LCVbFYDNYaRw9d6nwBjuPg5cs9SafnEARd1et1VTo9hxcv9sRxHPyM/6lIKpViu91mdASSLJUejYZYKj0y41i73WYqlSIA6w4LESSHJZWGiGBn56ETDkIBgJ2dh46IQKlhw1EsAEJrtz8+xOjRiAjtuYgIx7ELQ0wvpFudTgcnjYYdr661BklFUml9ceeTRsN2Oh2k0+lTnflt5S0AvP77tQUAY0zUHrTWiJLHsSg2k1l5i4ODyk2tncH0tCe12mchyX6/T2PM6B8YY9jv90mStdpnmZ72RGtnsH/w7iZIIp/ffAKAl69cDer1LxLNIJJIr9e/yOUrVwMA3MhvPhn9xiDoT2ZWbr8BwEQiOSgUiuHRUdX4/nfr+9/t0VHVFArFMJFIDgAwk7n9Jgh6kxcIJQh6kxsbm0+1dmx0/57n0fO8MUJxbG7jj6dR8ohQximtcvjhejZ7Z29+fqGptDZKazM/v9DMZu/sVSofrv9Kaf8DuKe/azHHOowAAAAASUVORK5CYII=" align="middle" > <span id="wheeltxt">' + getI18n('scrollwheel', localLang) + ' ' + getI18n('on', localLang) + '</span></div>';
layerControl._form.children[0].parentNode.insertBefore(patch, null);

if (useGeolocation && typeof navigator.geolocation != "undefined") {
navigator.geolocation.getCurrentPosition(foundLocation);
}
}

