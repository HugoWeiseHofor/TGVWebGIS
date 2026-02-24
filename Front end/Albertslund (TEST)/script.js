// ==========================
// Projektion setup EPSG:25832
// ==========================
proj4.defs(
    "EPSG:25832",
    "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs +type=crs"
);

ol.proj.proj4.register(proj4);

// ==========================
// Opret kort
// ==========================

const projection = ol.proj.get("EPSG:25832");

const map = new ol.Map({
    target: "map",
    view: new ol.View({
        projection: projection,
        center: [500000, 6200000],
        zoom: 7
    })
});

// Load WMTS fra Dataforsyningen
fetch("https://api.dataforsyningen.dk/topo_skaermkort_daempet_DAF?service=WMTS&request=GetCapabilities&token=b13445c09727289ea77913374cac72ce")
    .then(response => response.text())
    .then(text => {
        const parser = new ol.format.WMTSCapabilities();
        const result = parser.read(text);

        const options = ol.source.WMTS.optionsFromCapabilities(result, {
            layer: "topo_skaermkort_daempet",
            matrixSet: "View1",
            projection: projection
        });

        const wmtsLayer = new ol.layer.Tile({
            source: new ol.source.WMTS(options)
        });

        map.addLayer(wmtsLayer);
    });


function addThematicLayer(map, config) {

    function hexToRgb(hex) {
        const bigint = parseInt(hex.replace("#", ""), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function interpolateColor(color1, color2, factor) {
        return {
            r: Math.round(color1.r + factor * (color2.r - color1.r)),
            g: Math.round(color1.g + factor * (color2.g - color1.g)),
            b: Math.round(color1.b + factor * (color2.b - color1.b))
        };
    }

    function rgbToString(rgb) {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    }

    const startRGB = hexToRgb(config.start_color);
    const endRGB = hexToRgb(config.end_color);

    const source = new ol.source.Vector({
        url: config.folder_destination,
        format: new ol.format.GeoJSON({
            dataProjection: 'EPSG:25832',
            featureProjection: 'EPSG:3857'
        })
    });

    const layer = new ol.layer.Vector({
        source: source,
        zIndex: config.z_index
    });

    source.once('change', function () {
        if (source.getState() === 'ready') {

            const features = source.getFeatures();
            const values = features.map(f => f.get(config.field));

            const min = Math.min(...values);
            const max = Math.max(...values);

            layer.setStyle(function (feature) {

                const value = feature.get(config.field);

                const factor = (max === min) 
                    ? 0 
                    : (value - min) / (max - min);

                const interpolated = interpolateColor(startRGB, endRGB, factor);
                const fillColor = rgbToString(interpolated);

                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: fillColor
                    }),
                    stroke: new ol.style.Stroke({
                        color: config.stroke_color,
                        width: config.stroke_width
                    })
                });
            });
        }
    });

    map.addLayer(layer);
}

// ======================================================
// Funktion 2 – Enkel farve
// ======================================================
function addSingleColorLayer(config) {

    const source = new ol.source.Vector({
        url: config.folder_destination,
        format: new ol.format.GeoJSON()
    });

    const layer = new ol.layer.Vector({
        source: source,
        style: function (feature) {

            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: config.fill_color
                }),
                stroke: new ol.style.Stroke({
                    color: config.stroke_color,
                    width: config.stroke_width
                }),
                text: config.label_field ? new ol.style.Text({
                    text: feature.get(config.label_field)?.toString(),
                    fill: new ol.style.Fill({ color: "#000" })
                }) : undefined
            });
        }
    });

    map.addLayer(layer);

    if (config.zoom) {
        map.getView().setZoom(config.zoom);
    }

    if (config.z_index !== undefined) {
        layer.setZIndex(config.z_index);
    }
}

var config = ({
    folder_destination: "GeoJSON data/huse.geojson",
    start_color: "#ffffb2",
    end_color: "#bd0026",
    field: "Skade",
    stroke_color: "rgba(0,0,0,1)",
    stroke_width: 1,
    label_field: "Skade",
    zoom: 10,
    z_index: 3
});

addThematicLayer(map, config);


addSingleColorLayer({
    folder_destination: "GeoJSON data/omrids.geojson",
    fill_color: "rgba(0, 128, 255, 0.5)",
    stroke_color: "rgba(0,0,0,1)",
    stroke_width: 2,
    label_field: "id",
    z_index: 2
});

map.getLayers().getArray().forEach(layer => {
    if (layer instanceof ol.layer.Vector) {
        console.log(layer);
    }
});