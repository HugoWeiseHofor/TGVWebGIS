// ==========================
// Layer Creation Functions
// ==========================

import { hexToRgb, interpolateColor, rgbToString, resolveColor } from '../config/color-helpers.js';
import { registerLayer } from '../config/layer-switcher.js';

// ==========================
// addThematicLayer - Choropleth polygons
// ==========================
export function addThematicLayer(map, config, projection) {
    const numClasses = config.num_classes || 7;
    const fillAlpha = config.fill_alpha !== undefined ? config.fill_alpha : 0.85;
    const startRGB = hexToRgb(config.start_color);
    const endRGB = hexToRgb(config.end_color);
    
    const source = new ol.source.Vector({
        url: config.folder_destination,
        format: new ol.format.GeoJSON({ dataProjection: 'EPSG:25832', featureProjection: projection })
    });
    
    const layerOptions = {
        source,
        zIndex: config.z_index,
        declutter: false,
        visible: config.visible !== undefined ? config.visible : true,
        ...(config.max_resolution !== undefined && { maxResolution: config.max_resolution })
    };
    
    const layer = new ol.layer.Vector(layerOptions);
    
    function buildClassColors(breaks) {
        const n = breaks.length - 1;
        return Array.from({ length: n }, (_, i) =>
            rgbToString(interpolateColor(startRGB, endRGB, n <= 1 ? 0 : i / (n - 1)), fillAlpha)
        );
    }
    
    function buildStyle(breaks, classColors) {
        function getClassIndex(value) {
            for (let i = 0; i < breaks.length - 1; i++) {
                if (value <= breaks[i + 1]) return i;
            }
            return breaks.length - 2;
        }
        return function (feature) {
            let value = feature.get(config.field);
            if (typeof value === 'string') value = parseFloat(value.replace(',', '.'));
            if (value == null || isNaN(value)) return null;
            return new ol.style.Style({
                fill: new ol.style.Fill({ color: classColors[getClassIndex(value)] }),
                stroke: new ol.style.Stroke({ color: config.stroke_color, width: config.stroke_width })
            });
        };
    }
    
    function buildLegendItems(breaks, classColors) {
        return classColors.map((color, i) => ({
            color,
            strokeColor: config.stroke_color,
            label: `${Math.round(breaks[i]).toLocaleString('da-DK')} – ${Math.round(breaks[i + 1]).toLocaleString('da-DK')}`
        }));
    }
    
    if (config.gradient) {
        const fixedMin = (config.breaks && config.breaks.length >= 2) ? config.breaks[0] : null;
        const fixedMax = (config.breaks && config.breaks.length >= 2) ? config.breaks[config.breaks.length - 1] : null;
        const legendSteps = config.legend_steps || 5;
        
        function applyGradientStyle(minVal, maxVal) {
            layer.setStyle(function (feature) {
                let value = feature.get(config.field);
                if (typeof value === 'string') value = parseFloat(value.replace(',', '.'));
                if (value == null || isNaN(value)) return null;
                const factor = maxVal === minVal ? 0 : Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
                const color = rgbToString(interpolateColor(startRGB, endRGB, factor), fillAlpha);
                return new ol.style.Style({
                    fill: new ol.style.Fill({ color }),
                    stroke: new ol.style.Stroke({ color: config.stroke_color, width: config.stroke_width })
                });
            });
            
            const legendItems = Array.from({ length: legendSteps }, (_, i) => {
                const factor = i / (legendSteps - 1);
                const color = rgbToString(interpolateColor(startRGB, endRGB, factor), fillAlpha);
                const value = Math.round(minVal + factor * (maxVal - minVal));
                return { color, strokeColor: config.stroke_color, label: `${value.toLocaleString('da-DK')}`, gradient: true };
            });
            
            registerLayer(layer, config.title || 'Thematic Layer', 'overlay', legendItems, config.group_container || null, config.hidden || false);
        }
        
        if (fixedMin !== null && fixedMax !== null) {
            applyGradientStyle(fixedMin, fixedMax);
        } else {
            source.once('change', function () {
                if (source.getState() !== 'ready') return;
                const rawValues = source.getFeatures().map(f => {
                    let v = f.get(config.field);
                    if (typeof v === 'string') v = parseFloat(v.replace(',', '.'));
                    return v;
                }).filter(v => v != null && !isNaN(v));
                if (rawValues.length === 0) return;
                applyGradientStyle(Math.min(...rawValues), Math.max(...rawValues));
            });
        }
    } else if (config.breaks && config.breaks.length > 0) {
        const classColors = buildClassColors(config.breaks);
        layer.setStyle(buildStyle(config.breaks, classColors));
        registerLayer(layer, config.title || 'Thematic Layer', 'overlay',
            buildLegendItems(config.breaks, classColors), config.group_container || null, config.hidden || false);
    } else {
        source.once('change', function () {
            if (source.getState() !== 'ready') return;
            const rawValues = source.getFeatures().map(f => {
                let v = f.get(config.field);
                if (typeof v === 'string') v = parseFloat(v.replace(',', '.'));
                return v;
            }).filter(v => v != null && !isNaN(v));
            if (rawValues.length === 0) return;
            const minVal = Math.min(...rawValues);
            const maxVal = Math.max(...rawValues);
            const breaks = [];
            const step = (maxVal - minVal) / numClasses;
            for (let i = 0; i <= numClasses; i++) breaks.push(minVal + i * step);
            const classColors = buildClassColors(breaks);
            layer.setStyle(buildStyle(breaks, classColors));
            registerLayer(layer, config.title || 'Thematic Layer', 'overlay',
                buildLegendItems(breaks, classColors), config.group_container || null, config.hidden || false);
        });
    }
    
    map.addLayer(layer);
    
    // Store attribute config for popup
    if (config.attributes) layer.set('attributes', config.attributes);
    if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    if (!layerOptions.visible && !(config.breaks && config.breaks.length > 0)) {
        layer.setVisible(true);
        source.once('change', function () {
            if (source.getState() === 'ready') layer.setVisible(false);
        });
    }
    
    return { layer, source };
}

// ==========================
// addSingleColorLayer - Uniform style
// ==========================
export function addSingleColorLayer(map, config, projection) {
    const fillColor = resolveColor(config.fill_color, config.fill_alpha);
    const strokeColor = resolveColor(config.stroke_color);
    
    const encodedUrl = config.folder_destination
        .split('/')
        .map((seg, i) => i === 0 ? seg : encodeURIComponent(seg))
        .join('/');
    
    const source = new ol.source.Vector({
        url: encodedUrl,
        format: new ol.format.GeoJSON({ dataProjection: config.data_projection || 'EPSG:25832', featureProjection: projection })
    });
    
    source.on('error', function (e) {
        console.error(`[addSingleColorLayer] Failed to load "${config.folder_destination}":`, e);
    });
    
    const layer = new ol.layer.Vector({
        source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({ color: fillColor }),
            stroke: new ol.style.Stroke({ color: strokeColor, width: config.stroke_width })
        }),
        zIndex: config.z_index,
        visible: config.visible !== undefined ? config.visible : true,
        ...(config.max_resolution !== undefined && { maxResolution: config.max_resolution })
    });
    
    map.addLayer(layer);
    
    // Store attribute config for popup
    if (config.attributes) layer.set('attributes', config.attributes);
    if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    const legendItems = [{ color: fillColor, strokeColor: strokeColor, label: '' }];
    registerLayer(layer, config.title || 'Overlay Layer', 'overlay', legendItems, config.group_container || null, config.hidden || false);
    
    return { layer, source };
}

// ==========================
// addCategorizedLayer - Discrete categories
// ==========================
export function addCategorizedLayer(map, config, projection) {
    const categoryMap = {};
    (config.categories || []).forEach(cat => {
        categoryMap[cat.value] = {
            fill: resolveColor(cat.fill_color, cat.fill_alpha),
            stroke: cat.stroke_color ? resolveColor(cat.stroke_color) : null
        };
    });
    
    const defaultFill = resolveColor(config.default_fill_color || '#cccccc', config.fill_alpha);
    const defaultStroke = resolveColor(config.stroke_color || '#000000');
    
    const encodedUrl = config.folder_destination
        .split('/')
        .map((seg, i) => i === 0 ? seg : encodeURIComponent(seg))
        .join('/');
    
    const source = new ol.source.Vector({
        url: encodedUrl,
        format: new ol.format.GeoJSON({
            dataProjection: config.data_projection || 'EPSG:25832',
            featureProjection: projection
        })
    });
    
    source.on('error', e =>
        console.error(`[addCategorizedLayer] Failed to load "${config.folder_destination}":`, e)
    );
    
    const layer = new ol.layer.Vector({
        source,
        zIndex: config.z_index,
        visible: config.visible !== undefined ? config.visible : true,
        ...(config.max_resolution !== undefined && { maxResolution: config.max_resolution }),
        style: function(feature) {
            const val = feature.get(config.field);
            const cat = categoryMap[val];
            const fillColor = cat?.fill ?? defaultFill;
            const strokeColor = cat?.stroke ?? defaultStroke;
            const geomType = feature.getGeometry()?.getType();
            
            if (geomType === 'Point' || geomType === 'MultiPoint') {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: config.point_radius || 5,
                        fill: new ol.style.Fill({ color: fillColor }),
                        stroke: new ol.style.Stroke({ color: strokeColor, width: config.stroke_width || 1 })
                    })
                });
            } else {
                return new ol.style.Style({
                    fill: new ol.style.Fill({ color: fillColor }),
                    stroke: new ol.style.Stroke({ color: strokeColor, width: config.stroke_width || 1 })
                });
            }
        }
    });
    
    map.addLayer(layer);
    
    // Store attribute config for popup
    if (config.attributes) layer.set('attributes', config.attributes);
    if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    const legendItems = (config.categories || []).map(cat => ({
        color: resolveColor(cat.fill_color, cat.fill_alpha),
        strokeColor: cat.stroke_color ? resolveColor(cat.stroke_color) : defaultStroke,
        label: cat.label || cat.value
    }));
    
    registerLayer(layer, config.title || 'Categorized Layer', 'overlay', legendItems, config.group_container || null, config.hidden || false);
    
    return { layer, source };
}

// ==========================
// addPieChartLayer - Pie charts on points
// ==========================
export function addPieChartLayer(map, config, projection) {
    const pieRadius = config.pie_radius || 20;
    const pointRadius = config.point_radius || 8;
    const pieOffset = config.pie_offset || [38, 0];
    const fields = config.fields || [];
    const sizePx = pieRadius * 2;
    
    const encodedUrl = config.folder_destination
        .split('/')
        .map((seg, i) => i === 0 ? seg : encodeURIComponent(seg))
        .join('/');
    
    const source = new ol.source.Vector({
        url: encodedUrl,
        format: new ol.format.GeoJSON({
            dataProjection: config.data_projection || 'EPSG:25832',
            featureProjection: projection
        })
    });
    
    source.on('error', e =>
        console.error(`[addPieChartLayer] Failed to load "${config.folder_destination}":`, e)
    );
    
    const canvasCache = new WeakMap();
    
    const layer = new ol.layer.Vector({
        source,
        zIndex: config.z_index,
        visible: config.visible !== undefined ? config.visible : true,
        ...(config.max_resolution !== undefined && { maxResolution: config.max_resolution }),
        style: function(feature) {
            const styles = [];
            
            styles.push(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: pointRadius,
                    fill: new ol.style.Fill({ color: resolveColor(config.point_color || '#487bb6') }),
                    stroke: new ol.style.Stroke({ color: resolveColor(config.point_stroke || '#325780'), width: 1.5 })
                })
            }));
            
            const values = fields.map(f => Math.max(0, Number(feature.get(f.field)) || 0));
            const total = values.reduce((a, b) => a + b, 0);
            if (total <= 0) return styles;
            
            if (!canvasCache.has(feature)) {
                const canvas = document.createElement('canvas');
                canvas.width = sizePx;
                canvas.height = sizePx;
                const ctx = canvas.getContext('2d');
                let startAngle = 0;
                
                fields.forEach((f, i) => {
                    if (values[i] <= 0) return;
                    const sliceAngle = 2 * Math.PI * (values[i] / total);
                    ctx.beginPath();
                    ctx.moveTo(pieRadius, pieRadius);
                    ctx.arc(pieRadius, pieRadius, pieRadius, startAngle, startAngle + sliceAngle);
                    ctx.closePath();
                    ctx.fillStyle = f.color;
                    ctx.fill();
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    startAngle += sliceAngle;
                });
                
                ctx.beginPath();
                ctx.arc(pieRadius, pieRadius, pieRadius - 0.75, 0, 2 * Math.PI);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                canvasCache.set(feature, canvas);
            }
            
            styles.push(new ol.style.Style({
                zIndex: 9999,
                image: new ol.style.Icon({
                    img: canvasCache.get(feature),
                    imgSize: [sizePx, sizePx],
                    displacement: pieOffset
                })
            }));
            
            return styles;
        }
    });
    
    map.addLayer(layer);
    
    // Store attribute config for popup
    if (config.attributes) layer.set('attributes', config.attributes);
    if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    const legendItems = fields.map(f => ({
        color: f.color,
        strokeColor: '#ffffff',
        label: f.label || f.field
    }));
    
    registerLayer(layer, config.title || 'Pie Chart Layer', 'overlay', legendItems, config.group_container || null, config.hidden || false);
    
    return { layer, source };
}

// ==========================
// addGraduatedLineLayer - Variable width lines
// ==========================
export function addGraduatedLineLayer(map, config, projection) {
    const minWidth = config.min_width || 0.5;
    const maxWidth = config.max_width || 8;
    const legendSteps = config.legend_steps || 4;
    const lineColor = resolveColor(config.color || '#000000', config.fill_alpha);
    
    const useGradientColor = config.start_color && config.end_color;
    const startRGB = useGradientColor ? hexToRgb(config.start_color) : null;
    const endRGB = useGradientColor ? hexToRgb(config.end_color) : null;
    const alpha = config.fill_alpha !== undefined ? config.fill_alpha : 1;
    
    const fixedMin = config.breaks?.[0] ?? null;
    const fixedMax = config.breaks?.[config.breaks.length - 1] ?? null;

    // Store attribute config for popup (add before map.addLayer(layer))
if (config.attributes) layer.set('attributes', config.attributes);
if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    const encodedUrl = config.folder_destination
        .split('/')
        .map((seg, i) => i === 0 ? seg : encodeURIComponent(seg))
        .join('/');
    
    const source = new ol.source.Vector({
        url: encodedUrl,
        format: new ol.format.GeoJSON({
            dataProjection: config.data_projection || 'EPSG:25832',
            featureProjection: projection
        })
    });
    
    source.on('error', e =>
        console.error(`[addGraduatedLineLayer] Failed to load "${config.folder_destination}":`, e)
    );
    
    function makeStyle(minVal, maxVal) {
        return function(feature) {
            let value = feature.get(config.field);
            if (typeof value === 'string') value = parseFloat(value.replace(',', '.'));
            if (value == null || isNaN(value)) return null;
            
            const factor = maxVal === minVal ? 0 : Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
            const width = minWidth + factor * (maxWidth - minWidth);
            const color = useGradientColor
                ? rgbToString(interpolateColor(startRGB, endRGB, factor), alpha)
                : lineColor;
            
            return new ol.style.Style({
                stroke: new ol.style.Stroke({ color, width })
            });
        };
    }
    
    function makeLegendItems(minVal, maxVal) {
        return Array.from({ length: legendSteps }, (_, i) => {
            const factor = i / (legendSteps - 1);
            const value = Math.round(minVal + factor * (maxVal - minVal));
            const width = Math.round(minWidth + factor * (maxWidth - minWidth));
            const color = useGradientColor
                ? rgbToString(interpolateColor(startRGB, endRGB, factor), alpha)
                : lineColor;
            return {
                color,
                strokeColor: color,
                label: `${value.toLocaleString('da-DK')}`,
                lineWidth: width,
                line: true
            };
        });
    }
    
    const layerOptions = {
        source,
        zIndex: config.z_index,
        visible: config.visible !== undefined ? config.visible : true,
        ...(config.max_resolution !== undefined && { maxResolution: config.max_resolution })
    };
    
    const layer = new ol.layer.Vector(layerOptions);
    
    if (fixedMin !== null && fixedMax !== null) {
        layer.setStyle(makeStyle(fixedMin, fixedMax));
        registerLayer(layer, config.title || 'Graduated Line Layer', 'overlay',
            makeLegendItems(fixedMin, fixedMax), config.group_container || null, config.hidden || false);
    } else {
        source.once('change', function() {
            if (source.getState() !== 'ready') return;
            const rawValues = source.getFeatures().map(f => {
                let v = f.get(config.field);
                if (typeof v === 'string') v = parseFloat(v.replace(',', '.'));
                return v;
            }).filter(v => v != null && !isNaN(v));
            if (rawValues.length === 0) return;
            const minVal = Math.min(...rawValues);
            const maxVal = Math.max(...rawValues);
            layer.setStyle(makeStyle(minVal, maxVal));
            registerLayer(layer, config.title || 'Graduated Line Layer', 'overlay',
                makeLegendItems(minVal, maxVal), config.group_container || null, config.hidden || false);
        });
    }
    
    map.addLayer(layer);
    
    // Store attribute config for popup
    if (config.attributes) layer.set('attributes', config.attributes);
    if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    return { layer, source };
}

// ==========================
// addClassedPointLayer - Classed circles by breaks
// ==========================
export function addClassedPointLayer(map, config, projection) {
    const breaks = config.breaks || [];
    if (breaks.length < 2) {
        console.error('[addClassedPointLayer] breaks array must have at least 2 values');
        return null;
    }

    // Store attribute config for popup (add before map.addLayer(layer))
if (config.attributes) layer.set('attributes', config.attributes);
if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    const numClasses = breaks.length - 1;
    const radius = config.radius || 6;
    const strokeColor = resolveColor(config.stroke_color || '#000000');
    const strokeWidth = config.stroke_width !== undefined ? config.stroke_width : 1;
    const alpha = config.fill_alpha !== undefined ? config.fill_alpha : 0.85;
    
    const startRGB = hexToRgb(config.start_color);
    const endRGB = hexToRgb(config.end_color);
    const classColors = Array.from({ length: numClasses }, (_, i) => {
        const factor = numClasses === 1 ? 0 : i / (numClasses - 1);
        return rgbToString(interpolateColor(startRGB, endRGB, factor), alpha);
    });
    
    const encodedUrl = config.folder_destination
        .split('/')
        .map((seg, i) => i === 0 ? seg : encodeURIComponent(seg))
        .join('/');
    
    const source = new ol.source.Vector({
        url: encodedUrl,
        format: new ol.format.GeoJSON({
            dataProjection: config.data_projection || 'EPSG:25832',
            featureProjection: projection
        })
    });
    
    source.on('error', e =>
        console.error(`[addClassedPointLayer] Failed to load "${config.folder_destination}":`, e)
    );
    
    function getClassIndex(value) {
        for (let i = 0; i < breaks.length - 1; i++) {
            if (value <= breaks[i + 1]) return i;
        }
        return numClasses - 1;
    }
    
    const styleFunction = function(feature) {
        let value = feature.get(config.field);
        if (typeof value === 'string') value = parseFloat(value.replace(',', '.'));
        if (value == null || isNaN(value)) return null;
        
        const classIdx = getClassIndex(value);
        const color = classColors[classIdx];
        
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth })
            })
        });
    };
    
    const legendItems = classColors.map((color, i) => ({
        color: color,
        strokeColor: strokeColor,
        label: `${Math.round(breaks[i]).toLocaleString('da-DK')} – ${Math.round(breaks[i + 1]).toLocaleString('da-DK')}`,
        point: true,
        pointRadius: radius
    }));
    
    const layerOptions = {
        source,
        style: styleFunction,
        zIndex: config.z_index,
        visible: config.visible !== undefined ? config.visible : true,
        ...(config.max_resolution !== undefined && { maxResolution: config.max_resolution })
    };
    
    const layer = new ol.layer.Vector(layerOptions);
    map.addLayer(layer);
    
    // Store attribute config for popup
    if (config.attributes) layer.set('attributes', config.attributes);
    if (config.attributeTitleField) layer.set('attributeTitleField', config.attributeTitleField);
    
    registerLayer(layer, config.title || 'Classed Point Layer', 'overlay', legendItems, config.group_container || null, config.hidden || false);
    
    return { layer, source };
}