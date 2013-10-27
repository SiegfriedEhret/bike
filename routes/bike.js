var fs = require('fs');
var https = require('https');
var apiKey = 'b5352ee57d9461bdb7cae30baee77fa02e4a225b';

exports.getCity = function (req, res) {
    var city = req.params.city;
    var filePath = 'public/javascripts/city-' + city.toLowerCase() + '.js';
    var url = 'https://api.jcdecaux.com/vls/v1/stations?contract=' + city + '&apiKey=' + apiKey;

    fs.exists(filePath, function (exists) {
        if (exists) {
            render(res, {
                viewName: 'map',
                city: city
            });
        } else {
            getDataAndSaveFile(res, {
                viewName: 'map',
                url: url,
                city: city,
                filePath: filePath
            });
        }
    });
};

exports.initContracts = function (req, res) {
    var filePath = 'public/javascripts/contracts.js';
    var url = 'https://api.jcdecaux.com/vls/v1/contracts&apiKey=' + apiKey;

    fs.exists(filePath, function (exists) {
        if (exists) {
            console.log('Bike: contracts already initialized')
        } else {
            getDataAndSaveFile(undefined, {
                viewName: 'contracts',
                url: url,
                filePath: filePath
            });
        }
    });
}

function getDataAndSaveFile(res, settings) {
    console.log(settings.url);
    https.get(settings.url,function (response) {
        var data = '';
        response.on('data', function (chunk) {
            data += chunk;
        });

        response.on('end', function () {
            fs.writeFile(settings.filePath, 'var ' + settings.viewName + 'Data = ' + data, function (err) {
                if (err) {
                    throw err;
                }
                console.log('It\'s saved!');

                if (res) {
                    render(res, settings);
                }
            });
        });

    }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
}

function render(res, settings) {
    var options = { title: 'Bike' };
    if (settings.city) {
        options.city = settings.city;
    }
    res.render(settings.viewName, options);
}