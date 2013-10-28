// TODO localstorage
// TODO manifest cache and stuff...

(function () {

    var map = undefined;
    var me = undefined;
    var latLng = [48.85623, 2.35083];
    var zoom = 17;

    initContracts();
    initEvents();

    initMap();
    updateMapView(latLng, 0, zoom); // accuracy set to 0
    updateMarkers(mapData);

    function initEvents() {
        document.getElementById('icon-bike-my-position').addEventListener('pointerdown', getLocation);
        document.getElementById('contracts-button').addEventListener('pointerdown', showContracts);
        document.getElementById('icon-bike-plus').addEventListener('pointerdown', zoomIn);
        document.getElementById('icon-bike-minus').addEventListener('pointerdown', zoomOut);
    }

    function getLocation() {
        if (!navigator.geolocation) {
            return;
        }

        function success(position) {
            console.log(position);
            updateMapView([position.coords.latitude, position.coords.longitude], position.coords.accuracy, zoom);
        }

        function error() {
            console.log('Can\'t get user position !');
        }

        return navigator.geolocation.getCurrentPosition(success, error);
    }

    function showContracts() {
        document.getElementById('contracts').classList.toggle('enabled');
    }

    function zoomIn() {
        zoom = map.zoomIn().getZoom();
    }

    function zoomOut() {
        zoom = map.zoomOut().getZoom();
    }

    function initContracts() {
        if (contractsData) {
            var contractsContainer = document.getElementById('contracts');
            for (var contractName in contractsData) {
                if (contractsData.hasOwnProperty(contractName)) {
                    var contract = document.createElement('a');
                    contract.appendChild(document.createTextNode(contractName));
                    contract.classList.add('country-' + contractsData[contractName].country);
                    contract.setAttribute('href', contractName);
                    contractsContainer.appendChild(contract);
                }
            }
        }
    }

    function initMap() {
        map = L.map('map', {
            zoomControl: false
        });

        L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri',
            maxZoom: 18
        }).addTo(map);
    }

    function updateMapView(latLng, accuracy, zoom) {

        var radius = accuracy / 2;

        // icons, Me and around (accuracy)
        var iconMe = {
            icon: L.divIcon({
                iconSize: [14, 14],
                popupAnchor: [0, -5],
                className: 'leaflet-marker-me'
            })
        };
        var iconMeAround = {
            stroke: false,
            fillColor: '#2BC6DD',
            weight: 1
        };

        if (!me) {
            me = L.marker(latLng, iconMe).addTo(map).bindPopup('Vous êtes là! (env. ' + radius + 'm)');
            L.circle(latLng, radius, iconMeAround).addTo(map);
            map.setView(latLng, zoom);
        } else {
            me.setLatLng(latLng).bindPopup('Vous êtes là! (env. ' + radius + 'm)');
            map.setView(latLng, zoom);
        }
    }

    function updateMarkers(data) {
        if (data) {
            var markers = new L.MarkerClusterGroup();
            var markersList = [];

            // icon for markers (maybe not here)
            var iconMarker = {
                icon: L.divIcon({
                    iconSize: [22, 22],
                    popupAnchor: [0, -5],
                    className: 'leaflet-marker-station'
                })
            };

            function populate() {
                for (var i = 0; i < data.length; i++) {
                    var poi = data[i];
                    // set popup content (maybe not here too)
                    var txtAddress = '<p>' + poi.name + '</p>';
                    var iconAdd = '<div class="icon-bike icon-bike-add icon-bike-popup">' + poi.available_bikes + '</div>';
                    var iconRemove = '<div class="icon-bike icon-bike-remove icon-bike-popup">' + poi.available_bike_stands + '</div>';
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