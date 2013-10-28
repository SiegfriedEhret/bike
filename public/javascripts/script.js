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
        /*
        L.tileLayer('http://{s}.tile.cloudmade.com/f132755677b94dd7b7d3629ea3ef44f8/997/256/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>[…]',
            maxZoom: 18
        }).addTo(map);
        */

        // a better tile provider
        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
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

            // icon for markers (maybe not here)
            var iconMarker = {
                icon: L.divIcon({
                    iconSize: [22,22],
                    popupAnchor: [0,-5],
                    className: 'leaflet-marker-station'
                })
            };
            
            function populate() {
                for (var i = 0; i < data.length; i++) {
                    var poi = data[i];
                    // set popup content (maybe not here too)
                    var txtAddress = '<p>' + poi.name + '</p>';
                    var iconAdd = '<div class="icon-bike icon-bike--add icon-bike-popup">' + poi.available_bikes + '</div>';
                    var iconRemove = '<div class="icon-bike icon-bike--remove icon-bike-popup">' + poi.available_bike_stands + '</div>';
                    var icons = '<div class="icons">' + iconAdd + iconRemove + '</div>';
                    var txtPopup = txtAddress + icons;


                    var m = new L.marker([poi.position.lat, poi.position.lng], iconMarker).bindPopup(txtPopup);
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