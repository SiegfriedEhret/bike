(function () {

    var map = undefined;
    var latLng = [48.85623, 2.35083];
    var zoom = 17;

    initContracts();
    initEvents();

    initMap(latLng, zoom);
    updateMapView(latLng, zoom);
    updateMarkers(mapData);

    function initEvents() {
        document.getElementById('my-position').addEventListener('pointerdown', getLocation);
    }

    function getLocation() {
        if (!navigator.geolocation) {
            return;
        }

        function success(position) {
            updateMapView([position.coords.latitude, position.coords.longitude], zoom);
        }

        function error() {
            console.log('Can\'t get user position !');
        }

        return navigator.geolocation.getCurrentPosition(success, error);
    }

    function initContracts() {
        if (contractsData) {
            var contractsContainer = document.getElementById('contracts');
            for (var contractName in contractsData) {
                if (contractsData.hasOwnProperty(contractName)) {
                    var contract = document.createElement('a');
                    contract.appendChild(document.createTextNode(contractName));
                    contract.setAttribute('href', contractName);
                    contractsContainer.appendChild(contract);
                }
            }
        }
    }

    function initMap() {
        map = L.map('map');
        L.tileLayer('http://{s}.tile.cloudmade.com/f132755677b94dd7b7d3629ea3ef44f8/997/256/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>[…]',
            maxZoom: 18
        }).addTo(map);
    }

    function updateMapView(latLng, zoom) {
        map.setView(latLng, zoom);
    }

    function updateMarkers(data) {
        if (data) {
            var markers = new L.MarkerClusterGroup();
            var markersList = [];

            function populate() {
                for (var i = 0; i < data.length; i++) {
                    var poi = data[i];
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
})();