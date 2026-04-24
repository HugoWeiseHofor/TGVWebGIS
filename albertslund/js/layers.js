// ==========================
// All Layer Additions & Groups  –  map1
// ==========================
// Each layer call contains exactly:
//   ...styles.key          — full config (title, colors, fields, attributes…)
//   folder_destination     — path to this map's GeoJSON file
//   visible                — this map's default visibility
//   group_container        — which group it belongs to
//   hidden                 — (optional) hide from layer switcher UI

import { styles } from '../../config/layer-styles.js';

export function addAllLayers(map, projection, fns) {
    const {
        addThematicLayer,
        addSingleColorLayer,
        addCategorizedLayer,
        addPieChartLayer,
        addGraduatedLineLayer,
        addClassedPointLayer,
        createGroup,
    } = fns;

    // ----------------------------------------------------------------
    // "IKKE" Kort
    // ----------------------------------------------------------------
    const grp_IKKEkort   = createGroup({ title: '"IKKE" kort', fold: 'close' });
    const grp_kloakering = createGroup({ title: 'Kloakering', fold: 'close', depth: 1, container: grp_IKKEkort });

    addSingleColorLayer(map, { ...styles.sewage_ingen,            folder_destination: 'GeoJSON-data/Ingen_kloakering.geojson',         visible: true,                 group_container: grp_kloakering }, projection);


    // ----------------------------------------------------------------
    // "MÅSKE IKKE" Kort
    // ----------------------------------------------------------------
    const grp_MaskeIKKEkort = createGroup({ title: '"MÅSKE IKKE" kort', fold: 'close' });

    const grp_fredede = createGroup({ title: 'Gamle, Fredede & Natur områder', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, { ...styles.protected_areas, folder_destination: 'GeoJSON-data/Fredede_omraader.geojson',                    visible: false,               group_container: grp_fredede }, projection);
    addSingleColorLayer(map, { ...styles.wetlands_1870,   folder_destination: 'GeoJSON-data/Enge_og_Moser_(1870-1899).geojson',           visible: false,               group_container: grp_fredede }, projection);
    addSingleColorLayer(map, { ...styles.wetlands_1700,   folder_destination: 'GeoJSON-data/Vaadbundsomraader_omkring_1700-tallet.geojson',visible: false,              group_container: grp_fredede }, projection);
    addCategorizedLayer(map, { ...styles.OSD, folder_destination: 'GeoJSON-data/Albertslund_omrder_med_srlige_drikkevandsinteresser_osd.geojson', visible: false, group_container: grp_fredede }, projection);
    addSingleColorLayer(map, { ...styles.BNBO,            folder_destination: 'GeoJSON-data/Albertslund_boringsnrt_beskyttelsesomrde_bnbo.geojson',              visible: false,               group_container: grp_fredede }, projection);
    addSingleColorLayer(map, { ...styles.bilagIVarter, folder_destination: 'GeoJSON-data/Albertslund_bilag4arter.geojson', visible: false, group_container: grp_fredede }, projection);
    addCategorizedLayer(map, { ...styles.beskyttedenaturtyper_p3, folder_destination: 'GeoJSON-data/Albertslund_bekyttedenaturtyperparagraf3.geojson', visible: false, group_container: grp_fredede }, projection);


    const grp_jordforurening = createGroup({ title: 'Jordforurening', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, { ...styles.soil_v1, folder_destination: 'GeoJSON-data/Jordforurening_videnniveau_1_(V1).geojson', visible: false, group_container: grp_jordforurening }, projection);
    addSingleColorLayer(map, { ...styles.soil_v2, folder_destination: 'GeoJSON-data/Jordforurening_videnniveau_2_(V2).geojson', visible: false, group_container: grp_jordforurening }, projection);

    const grp_soer = createGroup({ title: 'Søer', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, { ...styles.lakes,            folder_destination: 'GeoJSON-data/Soeer.geojson',            visible: false, group_container: grp_soer }, projection);
    addSingleColorLayer(map, { ...styles.lakes_buffer_2m,  folder_destination: 'GeoJSON-data/Soeer_2m_buffer.geojson',  visible: false, group_container: grp_soer }, projection);
    addSingleColorLayer(map, { ...styles.lakes_buffer_10m, folder_destination: 'GeoJSON-data/Soeer_10m_buffer.geojson', visible: false, group_container: grp_soer }, projection);
    addSingleColorLayer(map, { ...styles.lakes_buffer_20m, folder_destination: 'GeoJSON-data/Soeer_20m_buffer.geojson', visible: false, group_container: grp_soer }, projection);
    addSingleColorLayer(map, { ...styles.lakes_buffer_100m,folder_destination: 'GeoJSON-data/Soeer_100m_buffer.geojson',visible: false, group_container: grp_soer }, projection);

    const grp_vandloeb = createGroup({ title: 'Vandløb', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, { ...styles.streams,            folder_destination: 'GeoJSON-data/Vandloeb.geojson',            visible: false, group_container: grp_vandloeb }, projection);
    addSingleColorLayer(map, { ...styles.streams_buffer_2m,  folder_destination: 'GeoJSON-data/Vandloeb_2m_buffer.geojson',  visible: false, group_container: grp_vandloeb }, projection);
    addSingleColorLayer(map, { ...styles.streams_buffer_10m, folder_destination: 'GeoJSON-data/Vandloeb_10m_buffer.geojson', visible: false, group_container: grp_vandloeb }, projection);
    addSingleColorLayer(map, { ...styles.streams_buffer_20m, folder_destination: 'GeoJSON-data/Vandloeb_20m_buffer.geojson', visible: false, group_container: grp_vandloeb }, projection);
    addSingleColorLayer(map, { ...styles.streams_buffer_100m,folder_destination: 'GeoJSON-data/Vandloeb_100m_buffer.geojson',visible: false, group_container: grp_vandloeb }, projection);

    // ----------------------------------------------------------------
    // Borgerhenvendelse
    // ----------------------------------------------------------------
    const grp_borgerhenvendelser = createGroup({ title: 'Borgerhenvendelser', fold: 'close' });
    addSingleColorLayer(map, { ...styles.borgerhenvendelse_albertslund,folder_destination: 'GeoJSON-data/borgerhenvendelse.geojson',visible: true, group_container: grp_borgerhenvendelser }, projection);

    // ----------------------------------------------------------------
    // Skadesomkostninger
    // ----------------------------------------------------------------
const grp_skadesomkostninger = createGroup({ title: 'Skadesberegninger', fold: 'close' });

const { layer: lyr_bygninger_indledende, source: jsonSource_bygninger_indledende } =
    addThematicLayer(map, { ...styles.indledende_damage_cost, folder_destination: 'GeoJSON-data/Bygninger_Skadesberegninger_Albertslund.geojson', visible: false, group_container: grp_skadesomkostninger }, projection);

const { layer: lyr_bygninger_sandsynlig, source: jsonSource_bygninger_sandsynlig } =
    addThematicLayer(map, { ...styles.sandsynlig_damage_cost, folder_destination: 'GeoJSON-data/Bygninger_Skadesberegninger_Albertslund.geojson', visible: false, group_container: grp_skadesomkostninger }, projection);
    // ----------------------------------------------------------------
    // Analyser og andre data
    // ----------------------------------------------------------------
    const grp_analyserdata = createGroup({ title: 'Analyser og andre data', fold: 'close' });

    const grp_Bygningsattributter = createGroup({ title: 'Bygningsattributter', fold: 'close', depth: 1, container: grp_analyserdata });
    addSingleColorLayer(map,  { ...styles.buildings_basement, folder_destination: 'GeoJSON-data/Bygninger_med_kaelder.geojson',        visible: false, group_container: grp_Bygningsattributter }, projection);
    addSingleColorLayer(map,  { ...styles.buildings_post1973, folder_destination: 'GeoJSON-data/Bygninger_opfoert_efter_1973.geojson',  visible: false, group_container: grp_Bygningsattributter }, projection);
    addCategorizedLayer(map,  { ...styles.buildings_use,      folder_destination: 'GeoJSON-data/Bygningsanvendelse.geojson',            visible: false, group_container: grp_Bygningsattributter }, projection);

    const grp_lokalplaner = createGroup({ title: 'Lokalplaner (vedtaget)', fold: 'close', depth: 1, container: grp_analyserdata });
    addCategorizedLayer(map, { ...styles.lokalplaner, folder_destination: 'GeoJSON-data/Albertslund_lokalplaner.geojson', visible: false, group_container: grp_lokalplaner }, projection);


    const grp_risikoTGVGEO = createGroup({ title: 'Risiko for terrænnært grundvand (GEO)', fold: 'close', depth: 1, container: grp_analyserdata });
    addCategorizedLayer(map, { ...styles.groundwater_geo_1m, folder_destination: 'GeoJSON-data/Terraennaert_grundvand_1m_(GEO).geojson', visible: false, group_container: grp_risikoTGVGEO }, projection);
    addCategorizedLayer(map, { ...styles.groundwater_geo_2m, folder_destination: 'GeoJSON-data/Terraennaert_grundvand_2m_(GEO).geojson', visible: false, group_container: grp_risikoTGVGEO }, projection);

    const grp_HIP = createGroup({ title: 'Terrænnært grundvand sommer- og vintermiddel [m under terræn] (HIP)', fold: 'close', depth: 1, container: grp_analyserdata });

    const grp_HIPsommer = createGroup({ title: 'Terrænnært grundvand sommermiddel [m under terræn] (HIP)', fold: 'close', depth: 2, container: grp_HIP });
    addSingleColorLayer(map, { ...styles.groundwater_0_1m_s, folder_destination: 'GeoJSON-data/0-1_m.geojson',   visible: false, group_container: grp_HIPsommer }, projection);
    addSingleColorLayer(map, { ...styles.groundwater_1_2m_s, folder_destination: 'GeoJSON-data/1-2_m.geojson',   visible: false, group_container: grp_HIPsommer }, projection);
    addSingleColorLayer(map, { ...styles.groundwater_2_3m_s, folder_destination: 'GeoJSON-data/2-3_m.geojson',   visible: false, group_container: grp_HIPsommer }, projection);
    addSingleColorLayer(map, { ...styles.groundwater_3_7m_s, folder_destination: 'GeoJSON-data/3-7_m.geojson',   visible: false, group_container: grp_HIPsommer }, projection);

    const grp_HIPvinter = createGroup({ title: 'Terrænnært grundvand vintermiddel [m under terræn] (HIP)', fold: 'close', depth: 2, container: grp_HIP });
    addSingleColorLayer(map, { ...styles.groundwater_0_1m_w, folder_destination: 'GeoJSON-data/0-1_m_1.geojson', visible: false, group_container: grp_HIPvinter }, projection);
    addSingleColorLayer(map, { ...styles.groundwater_1_2m_w, folder_destination: 'GeoJSON-data/1-2_m_1.geojson', visible: false, group_container: grp_HIPvinter }, projection);
    addSingleColorLayer(map, { ...styles.groundwater_2_3m_w, folder_destination: 'GeoJSON-data/2-3_m_1.geojson', visible: false, group_container: grp_HIPvinter }, projection);
    addSingleColorLayer(map, { ...styles.groundwater_3_7m_w, folder_destination: 'GeoJSON-data/3-7_m_1.geojson', visible: false, group_container: grp_HIPvinter }, projection);

    const grp_middelvariationer = createGroup({ title: 'Middelvarigheder iflg. HIP', fold: 'close', depth: 1, container: grp_analyserdata });
    addThematicLayer(map, { ...styles.groundwater_duration_1m, folder_destination: 'GeoJSON-data/Middelvarigheder_1_m.u.t..geojson', visible: false, group_container: grp_middelvariationer }, projection);
    addThematicLayer(map, { ...styles.groundwater_duration_2m, folder_destination: 'GeoJSON-data/Middelvarigheder_2_m.u.t..geojson', visible: false, group_container: grp_middelvariationer }, projection);

    const grp_pumpedevandfraktioner = createGroup({ title: 'Pumpede vandfraktioner', fold: 'close', depth: 1, container: grp_analyserdata });
    addPieChartLayer(map, { ...styles.pumped_fractions, folder_destination: 'GeoJSON-data/Pumpede_vandfraktioner.geojson', visible: false, group_container: grp_pumpedevandfraktioner }, projection);

    const grp_vandoplande = createGroup({ title: 'Vandoplande', fold: 'close', depth: 1, container: grp_analyserdata });
    addCategorizedLayer(map,   { ...styles.catchments, folder_destination: 'GeoJSON-data/oplande.geojson',     visible: false, group_container: grp_vandoplande }, projection);

    const grp_boringer = createGroup({ title: 'Boringer (GEUS Jupiter Database)', fold: 'close', depth: 1, container: grp_analyserdata });
    addClassedPointLayer(map, { ...styles.borehole_deviation_summer, folder_destination: 'GeoJSON-data/deviations_kote_fix.geojson', visible: false, group_container: grp_boringer }, projection);
    addClassedPointLayer(map, { ...styles.borehole_deviation_vinter, folder_destination: 'GeoJSON-data/deviations_kote_fix.geojson', visible: false, group_container: grp_boringer }, projection);
    addClassedPointLayer(map, { ...styles.borehole_depth,            folder_destination: 'GeoJSON-data/Boringer_(dybde_i_m).geojson',visible: false, group_container: grp_boringer }, projection);

    const grp_Risikohavvandindsivning = createGroup({ title: 'Risiko for havvandsindsivning', fold: 'close', depth: 1, hidden: true, container: grp_analyserdata });
    addCategorizedLayer(map, { ...styles.seawater_intrusion, folder_destination: 'GeoJSON-data/Risiko_for_havvandsindsivning.geojson', visible: false, hidden: true, group_container: grp_Risikohavvandindsivning }, projection);

    const grp_Risikooversvom = createGroup({ title: 'Risiko for oversvømmelse (Kystdirektoratet)', fold: 'close', depth: 1, container: grp_analyserdata });
    addSingleColorLayer(map, { ...styles.flood_risk, folder_destination: 'GeoJSON-data/Risiko_for_oversvoemmelse_(Kystdirektoratet).geojson', visible: false, group_container: grp_Risikooversvom }, projection);

    const grp_geomorfologi = createGroup({ title: 'Geomorfologi (GEUS)', fold: 'close', depth: 1, container: grp_analyserdata });
    addSingleColorLayer(map, { ...styles.geo_bundmoræneflade,          folder_destination: 'GeoJSON-data/Bundmoraeneflade.geojson',          visible: false,               group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_erosionsdal,              folder_destination: 'GeoJSON-data/Erosionsdal.geojson',               visible: false,               group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_dødislandskab,            folder_destination: 'GeoJSON-data/Doedislandskab.geojson',            visible: false, hidden: true, group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_mose,                     folder_destination: 'GeoJSON-data/Mose.geojson',                      visible: false,               group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_soe,                      folder_destination: 'GeoJSON-data/Soe.geojson',                       visible: false, hidden: true, group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_tunneldal,                folder_destination: 'GeoJSON-data/Tunneldal.geojson',                 visible: false, hidden: true, group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_toerlagt_marint_forland,  folder_destination: 'GeoJSON-data/Toerlagt_marint_forland.geojson',   visible: false, hidden: true, group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_isoverskrevet_randmoraene,folder_destination: 'GeoJSON-data/Isoverskrevet_randmoraene.geojson', visible: false, hidden: true, group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_soebund,                  folder_destination: 'GeoJSON-data/Soebund.geojson',                   visible: false,               group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_marin_flade,              folder_destination: 'GeoJSON-data/Marin_flade.geojson',               visible: false,               group_container: grp_geomorfologi }, projection);
    addSingleColorLayer(map, { ...styles.geo_antropogent,              folder_destination: 'GeoJSON-data/Antropogent_landskab.geojson',      visible: false,               group_container: grp_geomorfologi }, projection);

    const grp_potentialekort = createGroup({ title: 'Potentialekort', fold: 'close', depth: 1, container: grp_analyserdata });
    addSingleColorLayer(map, { ...styles.vestegnpotentialekort,           folder_destination: 'GeoJSON-data/Potentialekort_Vestegnen_2025_v0_smooth_2-0_25.geojson', visible: false, group_container: grp_potentialekort }, projection);
    addSingleColorLayer(map, { ...styles.vestegn_pejlinger,               folder_destination: 'GeoJSON-data/Pejlinger_Vestegnen_2025_v0.geojson', visible: false, group_container: grp_potentialekort }, projection);


    // ----------------------------------------------------------------
    // Projekt- og Planflader
    // ----------------------------------------------------------------
    const grp_projektplanflader = createGroup({ title: 'Projekt- og Planflader', fold: 'close' });
    addSingleColorLayer(map,  { ...styles.project_varme,     folder_destination: 'GeoJSON-data/Projektflade_Varme.geojson',     visible: false, hidden: true, group_container: grp_projektplanflader }, projection);
    addSingleColorLayer(map,  { ...styles.project_vand,      folder_destination: 'GeoJSON-data/Projektflade_Vand.geojson',      visible: false,               group_container: grp_projektplanflader }, projection);
    addSingleColorLayer(map,  { ...styles.project_spildevand,folder_destination: 'GeoJSON-data/Projektflade_Spildevand.geojson',visible: false,               group_container: grp_projektplanflader }, projection);
    addSingleColorLayer(map,  { ...styles.plan_vand,         folder_destination: 'GeoJSON-data/Planflade_vand.geojson',         visible: false, hidden: true, group_container: grp_projektplanflader }, projection);
    addCategorizedLayer(map,  { ...styles.plan_spildevand,   folder_destination: 'GeoJSON-data/Planflade_Spildevand.geojson',   visible: false,               group_container: grp_projektplanflader }, projection);


    // ----------------------------------------------------------------
    // Omrids (hidden background outline)
    // ----------------------------------------------------------------
    const grp_baggrund = createGroup({ title: '', fold: 'close', hidden: true });
    addSingleColorLayer(map, { ...styles.municipality_outline, folder_destination: 'GeoJSON-data/Albertslund.geojson', hidden: true, group_container: grp_baggrund }, projection);


    // ----------------------------------------------------------------
    // Damage Summary Box
    // ----------------------------------------------------------------
    function setupDamageSummary({ layer, source, field, label }) {
    // Create the box and inject it into the bottom-left stack
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'damage-summary-box';
    summaryDiv.style.display = 'none';

    const stack = document.getElementById('bottom-left-stack');
    if (stack) {
        stack.appendChild(summaryDiv);
    } else {
        document.body.appendChild(summaryDiv);
    }

    function update() {
        if (!layer.getVisible()) { summaryDiv.style.display = 'none'; return; }
        summaryDiv.style.display = 'block';

        if (map.getView().getResolution() > 3) {
            summaryDiv.innerHTML = '🔍 Zoom ind for at se skadesberegninger';
            return;
        }

        const extent = map.getView().calculateExtent(map.getSize());
        let total = 0;
        source.forEachFeatureInExtent(extent, feature => {
            let value = feature.get(field);
            if (value !== null && value !== undefined) {
                if (typeof value === 'string') value = value.replace(',', '.');
                total += parseFloat(value) || 0;
            }
        });

        summaryDiv.innerHTML =
            `${label}<br/>` +
            '<i>Klik på individuel bygning for yderligere info</i><br/><strong>' +
            total.toLocaleString('da-DK', { maximumFractionDigits: 0 }) + ' DKK/år</strong>';
    }

    map.on('moveend', update);
    layer.on('change:visible', update);
    source.once('change', () => {
        if (source.getState() === 'ready') update();
    });
}

setupDamageSummary({
    layer:  lyr_bygninger_indledende,
    source: jsonSource_bygninger_indledende,
    field:  'Indledende_skadesberegninger_HIP',
    label:  'Indledende skadesberegninger, baseret på HIP. Gns. skadesomkostninger før tiltag [DKK/år] i nuværende udsnit:'
});

setupDamageSummary({
    layer:  lyr_bygninger_sandsynlig,
    source: jsonSource_bygninger_sandsynlig,
    field:  'HOFOR_mest_sandsynlige',
    label:  'HOFORs bud, mest sandsynlige skadesberegning. Gns. skadesomkostninger før tiltag [DKK/år] i nuværende udsnit:'
});
}