var raster = new OpenLayers.Layer.XYZ('MapBox Light', [
    'http://a.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png',
    'http://b.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png',
    'http://c.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png',
    'http://d.tiles.mapbox.com/v3/mapbox.mapbox-light/${z}/${x}/${y}.png'
], {
    attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a> | " +
        "Data &copy; <a href='http://www.openstreetmap.org/'>OpenStreetMap</a> " +
        "and contributors, CC-BY-SA",
    sphericalMercator: true,
    wrapDateLine: true,
    transitionEffect: 'resize',
    buffer: 1,
    numZoomLevels: 17
});

function init() {
    var vector = new OpenLayers.Layer.Vector('vector');
    var map = new OpenLayers.Map('map', {
        projection: 'EPSG:3857',
        layers: [raster, vector]
    });
    map.zoomToMaxExtent();

    var dropbox = document.getElementById('map');
    dropbox.addEventListener('dragover', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }, false);
    
    dropbox.addEventListener('drop', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files;
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i], format;
            if (file.type == 'application/vnd.google-earth.kml+xml') {
                format = new OpenLayers.Format.KML({
                    internalProjection: vector.projection,
                    extractStyles: true
                });
            } else if (file.name.indexOf('.gpx') != -1) {
                format = new OpenLayers.Format.GPX({
                    internalProjection: vector.projection
                });
            }
            if (format) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    vector.addFeatures(format.read(this.result))
                    vector.map.zoomToExtent(vector.getDataExtent());
                };
                reader.readAsText(file);
            }
        }
    }, false);
}
