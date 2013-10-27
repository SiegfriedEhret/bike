var mapContainer = document.getElementById('map');

if (mapContainer) {
    var map = L.map('map').setView([48.85623, 2.35083], 17);

    L.tileLayer('http://{s}.tile.cloudmade.com/f132755677b94dd7b7d3629ea3ef44f8/997/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>[…]',
        maxZoom: 18
    }).addTo(map);

    if (mapData) {
        var markers = new L.MarkerClusterGroup();
        var markersList = [];

        function populate() {
            for (var i = 0; i < mapData.length; i++) {
                var poi = mapData[i];
                var m = new L.marker([poi.position.lat, poi.position.lng]).bindPopup(poi.address);
                markersList.push(m);
                markers.addLayer(m);
            }
            return false;
        }

        populate();
        map.addLayer(markers);
    }
}


if (contractsData) {
    for (var contractName in contractsData) {
        if (contractsData.hasOwnProperty(contractName)) {

        }
    }
}
