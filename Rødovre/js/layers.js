// ==========================
// All Layer Additions & Groups
// ==========================

export function addAllLayers(map, projection, fns) {
    const {
        addThematicLayer,
        addSingleColorLayer,
        addCategorizedLayer,
        addPieChartLayer,
        addGraduatedLineLayer,
        addClassedPointLayer,
        createGroup,
        registerLayer
    } = fns;

    // -- "IKKE" Kort
    const grp_IKKEkort = createGroup({ title: '"IKKE" kort', fold: 'close' });
    const grp_kloakering = createGroup({ title: 'Kloakering', fold: 'close', depth: 1, container: grp_IKKEkort });

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Spildevandskloakering.geojson",
        fill_color: "#375b9d", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Spildevands kloakeret", visible: true, z_index: 2,
        group_container: grp_kloakering
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Ingen-kloakering.geojson",
        fill_color: "#78a08c", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Ingen kloakering", visible: true, z_index: 2,
        group_container: grp_kloakering
    }, projection)

    // ---- Måske ikke kort ----
    const grp_MaskeIKKEkort = createGroup({ title: '"MÅSKE IKKE" kort', fold: 'close' });
    
    const grp_fredede = createGroup({ title: 'Gamle, Fredede & Natur områder', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/fredede områder.geojson",
        fill_color: "rgba(165,207,235,0.7)", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Fredede Områder", visible: false, z_index: 2,
        group_container: grp_fredede
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Habitat områder.geojson",
        fill_color: "#58826c", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Habitat områder", visible: false, z_index: 2, hidden: true,
        group_container: grp_fredede
    }, projection);    

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Enge og Moser (1870-1899).geojson",
        fill_color: "rgba(208,231,215,0.7)", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Enge & Moser 1870", visible: false, z_index: 2,
        group_container: grp_fredede
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GEOJSON data/Vådbundsområder omkring 1700-tallet.geojson",
        fill_color: "#c6ef75", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Vådbundsområder omkring 1700-tallet", visible: false, z_index: 2,
        group_container: grp_fredede
    }, projection);
    
    addGraduatedLineLayer(map, {
        folder_destination: "GeoJSON data/Gammel kystlinje (1870-1899).geojson",
        title: "Gammel kystlinje (1870-1899)", field: "fid", color: "#4e59a0",
        min_width: 3, max_width: 3, breaks: [1, 1], legend_steps: 1, hidden: true,
        fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_fredede
    }, projection);    

    addGraduatedLineLayer(map, {
        folder_destination: "GeoJSON data/Rørlagte vandløb.geojson",
        title: "Rørlagte vandløb", field: "fid", color: "#efb258",
        min_width: 3, max_width: 3, breaks: [1, 1], legend_steps: 1,
        fill_alpha: 0.85, z_index: 1, visible: false, hidden: true,
        group_container: grp_fredede
    }, projection);  
    


    const grp_jordforurening = createGroup({ title: 'Jordforurening', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Jordforurening videnniveau 1 (V1).geojson",
        fill_color: "#b58840", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Jordforurening videnniveau 1 (V1)", visible: false, z_index: 2,
        group_container: grp_jordforurening
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Jordforurening videnniveau 2 (V2).geojson",
        fill_color: "#f0ceae", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Jordforurening videnniveau 2 (V2)", visible: false, z_index: 2,
        group_container: grp_jordforurening
    }, projection);

    const grp_soer = createGroup({ title: 'Søer', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/søer.geojson",
        fill_color: "#383c6f", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Søer", visible: false, z_index: 5,
        group_container: grp_soer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Søer 2m buffer.geojson",
        fill_color: "#484c8e", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Søer 2m Buffer", visible: false, z_index: 4,
        group_container: grp_soer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Søer 10m buffer.geojson",
        fill_color: "#6e73af", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Søer 10m Buffer", visible: false, z_index: 3,
        group_container: grp_soer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Søer 20m buffer.geojson",
        fill_color: "#c5c6df", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Søer 20m Buffer", visible: false, z_index: 2,
        group_container: grp_soer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Søer 100m buffer.geojson",
        fill_color: "#ebecf4", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Søer 100m Buffer", visible: false, z_index: 1,
        group_container: grp_soer
    }, projection);

    const grp_vandloeb = createGroup({ title: 'Vandløb', fold: 'close', depth: 1, container: grp_MaskeIKKEkort });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/vandløb.geojson",
        fill_color: "#6294b7", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Vandløb", visible: false, z_index: 5,
        group_container: grp_vandloeb
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Vandløb 2m buffer.geojson",
        fill_color: "#76b0dc", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Vandløb 2m Buffer", visible: false, z_index: 4,
        group_container: grp_vandloeb
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Vandløb 10m buffer.geojson",
        fill_color: "#a5cfeb", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Vandløb 10m Buffer", visible: false, z_index: 3,
        group_container: grp_vandloeb
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Vandløb 20m buffer.geojson",
        fill_color: "#dbecf6", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Vandløb 20m Buffer", visible: false, z_index: 2,
        group_container: grp_vandloeb
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Vandløb 100m buffer.geojson",
        fill_color: "#edf6fb", stroke_color: "rgba(0,0,0,1)", stroke_width: 0,
        fill_alpha: 0.85, title: "Vandløb 100m Buffer", visible: false, z_index: 1,
        group_container: grp_vandloeb
    }, projection);

    // -- Indledende udpegning af undersøgelsesområder
    const grp_Indledendeudpegningomraader = createGroup({ title: 'Indledende udpegning af undersøgelsesområder', fold: 'close', hidden: true });


    // -- Borgerhenvendelser
    const grp_Borgerhenvendelser = createGroup({ title: 'Borgerhenvendelser', fold: 'close', hidden:true });


    // ---- Analyser og andre data ----
    const grp_analyserdata = createGroup({ title: 'Analyser og andre data', fold: 'close' });
    
    const grp_Bygningsattributter = createGroup({ title: 'Bygningsattributter (zoom, for at aktivere)', fold: 'close', depth: 1,  hidden: true, container: grp_analyserdata });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Bygninger med kælder.geojson",
        fill_color: "#d94b54", fill_alpha: 0.50, stroke_color: "rgb(255, 0, 0)", stroke_width: 1,
        title: "Bygninger med kælder", max_resolution: 3, visible: false, z_index: 2,
        group_container: grp_Bygningsattributter
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Bygninger opført efter 1973.geojson",
        fill_color: "#838fe4", fill_alpha: 0.50, stroke_color: "rgb(13, 0, 199)", stroke_width: 1,
        title: "Bygninger opført efter 1973", max_resolution: 3, visible: false, z_index: 2, 
        group_container: grp_Bygningsattributter
    }, projection);

    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Bygningsanvendelse.geojson",
        field: "BBR_nogle_rettet_overkatagori",
        categories: [
            { value: "Bygninger til helårsbeboelse", fill_color: "#e4838f", label: "Bygninger til helårsbeboelse" },
            { value: "Bygninger til erhvervsmæssig produktion vedrørende landbrug", fill_color: "#80cfba", label: "Bygninger til erhvervsmæssig produktion vedrørende landbrug" },
            { value: "Bygninger til erhvervsmæssig produktion", fill_color: "#76b0dc", label: "Bygninger til erhvervsmæssig produktion" },
            { value: "Bygninger til erhvervsmæssig energiproduktion og forsyning", fill_color: "#c6ef75", label: "Bygninger til erhvervsmæssig energiproduktion og forsyning" },
            { value: "Bygninger til transport og parkering", fill_color: "#98a4ae", label: "Bygninger til transport og parkering" },
            { value: "Bygninger til kontor, handel og lager", fill_color: "#00445e", label: "Bygninger til kontor, handel og lager" },
            { value: "Bygninger til hotel, restaurant og service", fill_color: "#e49f83", label: "Bygninger til hotel, restaurant og service" },
            { value: "Bygninger til kultur, forlystelse og trosudøvelse", fill_color: "#58826c", label: "Bygninger til kultur, forlystelse og trosudøvelse" },
            { value: "Bygninger til undervisning og forskning", fill_color: "#b58840", label: "Bygninger til undervisning og forskning" },
            { value: "Bygninger til sygehus og sundhed", fill_color: "#dbecf6", label: "Bygninger til sygehus og sundhed" },
            { value: "Bygninger til institutionsformål", fill_color: "#bbcfc5", label: "Bygninger til institutionsformål" },
            { value: "Bygninger til sports- og idrætsformål", fill_color: "#fff199", label: "Bygninger til sports- og idrætsformål" },
            { value: "Bygninger til fritidsformål", fill_color: "#d0e7d7", label: "Bygninger til fritidsformål" },
            { value: "Mindre bygninger til opbevaring og andre aktiviteter", fill_color: "#bebeb4", label: "Mindre bygninger til opbevaring og andre aktiviteter" },
            { value: "Mindre bygninger til parkering", fill_color: "#bdb4be", label: "Mindre bygninger til parkering" },
            { value: "Faldefærdige og ukendte bygninger", fill_color: "#f5f6f8", label: "Faldefærdige og ukendte bygninger" },
        ],
        default_fill_color: "#999999", stroke_color: "#ffffff", stroke_width: 0,
        title: "Bygningsanvendelse", max_resolution: 3, z_index: 6, visible: false,
        group_container: grp_Bygningsattributter
    }, projection);

    const grp_skadesomkostninger = createGroup({ title: 'Indledende skadesberegninger - Gennemsnitlig skadesomkostninger før tiltag', fold: 'close', depth: 1, container: grp_analyserdata });
    const { layer: lyr_bygninger, source: jsonSource_bygninger } = addThematicLayer(map, {
        folder_destination: "GeoJSON data/Indledende skadesberegninger - Gennemsnitlig skadesomkostninger før tiltag.geojson",
        title: "Gns. skadesomkostninger før tiltag [DKK/år]",
        start_color: "#ffffb2", end_color: "#bd0026", field: "_Mean_annual_damage_cost",
        stroke_color: "rgba(0,0,0,0.5)", stroke_width: 0.5, num_classes: 7,
        breaks: [0, 20000, 40000, 60000, 80000, 100000, 120000, 47624000],
        max_resolution: 3, fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_skadesomkostninger,
        attributeTitleField: "attributter",
            attributes: [
        { field: "adresse", label: "Adresse" },
        { field: "_Mean_annual_damage_cost", label: "Gns. skade (DKK/år)" },
        { field: "Kaelder_j/n", label: "Har bygningen kælder? 1/0 ja/nej" },
    ]
    }, projection);

    const grp_risikoTGVGEO = createGroup({ title: 'Risiko for terrænnært grundvand (GEO)', fold: 'close', depth: 1, container: grp_analyserdata });
    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Risiko for terrænnært grundvand 1m.u.t. (GEO).geojson",
        field: "DN",
        categories: [
            { value: "1", fill_color: "#00ccffad", label: "Vinter" },
            { value: "2", fill_color: "#00bb9f96", label: "Vinter og Sommer" },
            { value: "3", fill_color: "#eae1399c", label: "Sommer" },
        ],
        default_fill_color: "#999999", stroke_color: "#ffffff00", stroke_width: 0, fill_alpha: 0.85,
        title: "Risiko for terrænnært grundvand 1m.u.t. (GEO)", z_index: 1, visible: false,
        group_container: grp_risikoTGVGEO
    }, projection);

    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Risiko for terrænnært grundvand 2m.u.t. (GEO).geojson",
        field: "DN",
        categories: [
            { value: "1", fill_color: "#00ccffad", label: "Vinter" },
            { value: "2", fill_color: "#00bb9f96", label: "Vinter og Sommer" },
            { value: "3", fill_color: "#eae1399c", label: "Sommer" },
        ],
        default_fill_color: "#999999", stroke_color: "#ffffff00", stroke_width: 0, fill_alpha: 0.85,
        title: "Risiko for terrænnært grundvand 2m.u.t. (GEO)", z_index: 1, visible: false,
        group_container: grp_risikoTGVGEO
    }, projection);

    const grp_HIP = createGroup({ title: 'Terrænnært grundvand sommer- og vintermiddel [m under terræn] (HIP)', fold: 'close', depth: 1, container: grp_analyserdata });
    
    const grp_HIPsommer = createGroup({ title: 'Terrænnært grundvand sommermiddel [m under terræn] (HIP)', fold: 'close', depth: 2, container: grp_HIP });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/0-1 m.geojson",
        fill_color: "#526e97", stroke_color: "rgba(0,0,0,0)", fill_alpha: 0.85, stroke_width: 0,
        title: "0-1m", visible: false, z_index: 2, group_container: grp_HIPsommer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/1-2 m.geojson",
        fill_color: "#78b0d6", stroke_color: "rgba(0,0,0,0)", fill_alpha: 0.85, stroke_width: 0,
        title: "1-2m", visible: false, z_index: 2, group_container: grp_HIPsommer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/2-3 m.geojson",
        fill_color: "#c7dfee", stroke_color: "rgba(0,0,0,0)", fill_alpha: 0.85, stroke_width: 0,
        title: "2-3m", visible: false, z_index: 2, group_container: grp_HIPsommer
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/3-7 m.geojson",
        fill_color: "#f9fcff", fill_alpha: 0.85, stroke_color: "rgba(0,0,0,0)", stroke_width: 0,
        title: "3-7m", visible: false, z_index: 2, group_container: grp_HIPsommer
    }, projection);

    const grp_HIPvinter = createGroup({ title: 'Terrænnært grundvand vintermiddel [m under terræn] (HIP)', fold: 'close', depth: 2, container: grp_HIP });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/0-1 m_1.geojson",
        fill_color: "#526e97", stroke_color: "rgba(0,0,0,0)", fill_alpha: 0.85, stroke_width: 0,
        title: "0-1m", visible: false, z_index: 2, group_container: grp_HIPvinter
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/1-2 m_1.geojson",
        fill_color: "#78b0d6", stroke_color: "rgba(0,0,0,0)", fill_alpha: 0.85, stroke_width: 0,
        title: "1-2m", visible: false, z_index: 2, group_container: grp_HIPvinter
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/2-3 m_1.geojson",
        fill_color: "#c7dfee", stroke_color: "rgba(0,0,0,0)", fill_alpha: 0.85, stroke_width: 0,
        title: "2-3m", visible: false, z_index: 2, group_container: grp_HIPvinter
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/3-7 m_1.geojson",
        fill_color: "#f9fcff", fill_alpha: 0.85, stroke_color: "rgba(0,0,0,0)", stroke_width: 0,
        title: "3-7m", visible: false, z_index: 2, group_container: grp_HIPvinter
    }, projection);

    const grp_middelvariationer = createGroup({ title: 'Middelvarigheder iflg. HIP', fold: 'close', depth: 1, container: grp_analyserdata });
    addThematicLayer(map, {
        folder_destination: "GeoJSON data/Middelvarigheder 1 m.u.t..geojson",
        title: "Middelvarigheder 1 m.u.t.", start_color: "#f7fbff", end_color: "#08306b", field: "1m",
        stroke_color: "rgba(0,0,0,0)", stroke_width: 0, gradient: true, breaks: [0, 366],
        legend_steps: 6, fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_middelvariationer,
        attributeTitleField: "attributter",
            attributes: [
        { field: "1m", label: "varighed (dage)" },
    ]
    }, projection);

    addThematicLayer(map, {
        folder_destination: "GeoJSON data/Middelvarigheder 2 m.u.t..geojson",
        title: "Middelvarigheder 2 m.u.t.", start_color: "#f7fbff", end_color: "#08306b", field: "2m",
        stroke_color: "rgba(0,0,0,0)", stroke_width: 0, gradient: true, breaks: [0, 366],
        legend_steps: 6, fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_middelvariationer,
        attributeTitleField: "attributter",
            attributes: [
        { field: "2m", label: "varighed (dage)" },
    ]
    }, projection);

    const grp_pumpedevandfraktioner = createGroup({ title: 'Pumpede vandfraktioner', fold: 'close', depth: 1, container: grp_analyserdata });
    addPieChartLayer(map, {
        folder_destination: "GeoJSON data/Pumpede vandfraktioner.geojson",
        title: "Pumpede vandfraktioner",
        fields: [
            { field: 'gw', color: '#83d585', label: 'Indsivning' },
            { field: 'ww', color: '#f9b5b3', label: 'Tørvejr' },
            { field: 'rain', color: '#163b91', label: 'Regnvand' },
            { field: 'uz', color: '#84ccfa', label: 'Dræn' },
        ],
        point_color: '#487bb6', point_stroke: '#325780', point_radius: 8,
        pie_radius: 30, pie_offset: [38, 0], z_index: 6, visible: false,
        group_container: grp_pumpedevandfraktioner,
        attributeTitleField: "attributter",
            attributes: [
        { field: "gw",   label: "Indsivning" }, 
        { field: "ww",   label: "Tørvejr" },
        { field: 'rain', label: 'Regnvand' },
        { field: 'uz',   label: 'Dræn' },
    ]
    }, projection);

    const grp_vandoplande = createGroup({ title: 'Vandoplande', fold: 'close', depth: 1, hidden: true, container: grp_analyserdata });
    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Vandoplande.geojson",
        field: "fid",
        categories: [
            { value: "1", fill_color: "#00445e", label: "1" },
            { value: "2", fill_color: "#afa2a5", label: "2" },
        ],
        default_fill_color: "#999999", stroke_color: "#ffffff00", stroke_width: 0, fill_alpha: 0.85,
        title: "Vandoplande", z_index: 1, visible: false, hidden: true,
        group_container: grp_vandoplande
    }, projection);

    addGraduatedLineLayer(map, {
        folder_destination: "GeoJSON data/Strømningsveje.geojson",
        title: "Strømningsveje", field: "flow", color: "#00445e",
        min_width: 0.5, max_width: 20, breaks: [0, 1000000], legend_steps: 4,
        fill_alpha: 0.85, z_index: 1, visible: false, maxResolution: 3, hidden: true,
        group_container: grp_vandoplande
    }, projection);

    const grp_boringer = createGroup({ title: 'Boringer (GEUS Jupiter Database)', fold: 'close', depth: 1, container: grp_analyserdata });
    addClassedPointLayer(map, {
        folder_destination: "GeoJSON data/Pejledata - Afvigelse af HIP sommer.geojson",
        title: "Pejledata - Afvigelse af HIP sommer", start_color: "#ff0000", end_color: "#31d100",
        field: "deviation_sommer", stroke_color: "#ffffff", stroke_width: 1, radius: 4,
        breaks: [-27, -3, -2, -1, 0], fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_boringer
    }, projection);

    addClassedPointLayer(map, {
        folder_destination: "GeoJSON data/Pejledata - Afvigelse af HIP vinter.geojson",
        title: "Pejledata - Afvigelse af HIP vinter", start_color: "#ff0000", end_color: "#31d100",
        field: "deviation_vinter", stroke_color: "#ffffff", stroke_width: 1, radius: 4,
        breaks: [-27, -3, -2, -1, 0], fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_boringer
    }, projection);

    addClassedPointLayer(map, {
        folder_destination: "GeoJSON data/Boringer (dybde i m).geojson",
        title: "Boringer (dybde i m)", start_color: "#ffffff", end_color: "#58826c",
        field: "dybde_num", stroke_color: "#ffffff", stroke_width: 1, radius: 4,
        breaks: [0, 6, 12, 18, 30], fill_alpha: 0.85, z_index: 1, visible: false,
        group_container: grp_boringer
    }, projection);

    const grp_risikosskaderGEO = createGroup({ title: 'Risiko for sætningsskader (GEO)', fold: 'close', depth: 1, container: grp_analyserdata });
    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Risiko for sætningsskader (GEO).geojson",
        field: "DN",
        categories: [
            { value: "27", fill_color: "#66df1b", fill_alpha: 0.85, label: "0-0,01" },
            { value: "42", fill_color: "#d8ef2a", fill_alpha: 0.85, label: "0,01-0,02" },
            { value: "56", fill_color: "#ffff38", fill_alpha: 0.85, label: "0,02-0,05" },
            { value: "52", fill_color: "#fbb934", fill_alpha: 0.85, label: "0,05-0,1" },
            { value: "48", fill_color: "#f82230", fill_alpha: 0.85, label: ">0,1" },
        ],
        default_fill_color: "#999999", stroke_color: "#ffffff00", stroke_width: 0, fill_alpha: 0.85,
        title: "Risiko for sætningsskader (GEO)", z_index: 1, visible: false,
        group_container: grp_risikosskaderGEO
    }, projection);


    const grp_Risikohavvandindsivning = createGroup({ title: 'Risiko for havvandsindsivning', fold: 'close', depth: 1, hidden: true, container: grp_analyserdata });

    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Risiko for havvandsindsivning.geojson",
        field: "DN",
        categories: [
            { value: "0", fill_color: "#e47983", fill_alpha: 0.85, label: "Risiko for havvandsindsivning" },
        ],
        default_fill_color: "#ffffff00", stroke_color: "#ffffff00", stroke_width: 0, fill_alpha: 0.85,
        title: "Risiko for havvandsindsivning", z_index: 1, visible: false, hidden: true,
        group_container: grp_Risikohavvandindsivning
    }, projection);    

    const grp_Risikooversvom = createGroup({ title: 'Risiko for oversvømmelse (Kystdirektoratet)', fold: 'close', depth: 1, container: grp_analyserdata });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Risiko for oversvømmelse (Kystdirektoratet).geojson",
        fill_color: "#c43c39", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Risiko for oversvømmelse (Kystdirektoratet)", visible: false, z_index: 1,
        group_container: grp_Risikooversvom
    }, projection);

    const grp_geomorfologi = createGroup({ title: 'Geomorfologi (GEUS)', fold: 'close', depth: 1, container: grp_analyserdata });

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Bundmoræneflade.geojson",
        fill_color: "#b26400", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Bundmoræneflade", visible: false, z_index: 1,
        group_container: grp_geomorfologi
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Erosionsdal.geojson",
        fill_color: "#7ecc00", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Erosionsdal", visible: false, z_index: 1,
        group_container: grp_geomorfologi
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Dødislandskab.geojson",
        fill_color: "#dab800", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Dødislandskab", visible: false, z_index: 1, hidden: true,
        group_container: grp_geomorfologi 
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Mose.geojson",
        fill_color: "#408016", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Mose", visible: false, z_index: 1,
        group_container: grp_geomorfologi
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Sø.geojson",
        fill_color: "#fcfcfc", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Sø", visible: false, z_index: 1, hidden: true,
        group_container: grp_geomorfologi
    }, projection); 

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Tunneldal.geojson",
        fill_color: "#97ad7e", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Tunneldal", visible: false, z_index: 1, hidden: true,
        group_container: grp_geomorfologi
    }, projection); 

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Tørlagt marint forland.geojson",
        fill_color: "#beffe8", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Tørlagt marint forland", visible: false, z_index: 1, hidden: true,
        group_container: grp_geomorfologi
    }, projection); 

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Isoverskrevet randmoræne.geojson",
        fill_color: "#897044", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Isoverskrevet randmoræne", visible: false, z_index: 1, hidden: true,
        group_container: grp_geomorfologi
    }, projection); 

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Antropogent landskab.geojson",
        fill_color: "#cccccc", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Antropogent landskab", visible: false, z_index: 1, hidden: true,
        group_container: grp_geomorfologi
    }, projection);
    
    const grp_projektplanflader = createGroup({ title: 'Projekt- og Planflader', fold: 'close',});

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Projektflade Varme.geojson",
        fill_color: "#662ccd", stroke_color: "rgb(127, 0, 177)", stroke_width: 0, fill_alpha: 0.85,
        title: "Projektflade Varme", visible: false, z_index: 1, hidden: true,
        group_container: grp_projektplanflader
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Projektflade Vand.geojson",
        fill_color: "#66c4cd", stroke_color: "rgb(0, 120, 218)", stroke_width: 0, fill_alpha: 0.85,
        title: "Projektflade Vand", visible: false, z_index: 1,
        group_container: grp_projektplanflader
    }, projection);    
    
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Projektflade Spildevand.geojson",
        fill_color: "#397c33", stroke_color: "rgba(10, 61, 0, 0.43)", stroke_width: 0, fill_alpha: 0.85,
        title: "Projektflade Spildevand", visible: false, z_index: 1,
        group_container: grp_projektplanflader
    }, projection);

    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/Planflade vand.geojson",
        fill_color: "#00bebe", stroke_color: "rgb(255, 255, 255)", stroke_width: 0, fill_alpha: 0.85,
        title: "Planflade vand", visible: false, z_index: 1, hidden: true,
        group_container: grp_projektplanflader
    }, projection);    
    
    addCategorizedLayer(map, {
        folder_destination: "GeoJSON data/Planflade Spildevand.geojson",
        field: "STYLE_REGE",
        categories: [
            { value: "Anlægsprojekter", fill_color: "#34cb00", fill_alpha: 0.85, label: "Anlægsprojekt" },
        ],
        default_fill_color: "#999999", stroke_color: "#ffffff00", stroke_width: 0, fill_alpha: 0.85,
        title: "Planflade Spildevand", z_index: 1, visible: false,
        group_container: grp_projektplanflader
    }, projection);

    
    // ---- omrids ----
    const grp_baggrund = createGroup({ title: '', fold: 'close', hidden: true });
    addSingleColorLayer(map, {
        folder_destination: "GeoJSON data/rødovre.geojson",
        fill_color: "rgba(255, 255, 255, 0.6)", stroke_color: "rgba(0,0,0,1)", stroke_width: 2,
        title: "Omrids", z_index: 2, group_container: grp_baggrund, hidden: true
    }, projection);

    // ==========================
    // Damage Summary Box
    // ==========================
    const summaryDiv = document.getElementById("damageSummary");
    
    function updateDamageSummary() {
        const resolution = map.getView().getResolution();
        const layerVisible = lyr_bygninger.getVisible();
        if (!layerVisible) { summaryDiv.style.display = 'none'; return; }
        
        summaryDiv.style.display = 'block';
        
        if (resolution > 3) {
            summaryDiv.innerHTML = "🔍 Zoom ind for at se skadesberegninger";
            return;
        }
        
        const extent = map.getView().calculateExtent(map.getSize());
        let total = 0;
        
        jsonSource_bygninger.forEachFeatureInExtent(extent, function (feature) {
            let value = feature.get("_Mean_annual_damage_cost");
            if (value !== null && value !== undefined) {
                if (typeof value === "string") value = value.replace(",", ".");
                total += parseFloat(value) || 0;
            }
        });
        
        summaryDiv.innerHTML =
            "Samlede gns. skadesomkostninger før tiltag [DKK/år] i nuværende udsnit:<br/> <i>Klik på inividuel bygning for yderligere info</i><br/><strong>" +
            total.toLocaleString("da-DK", { maximumFractionDigits: 0 }) +
            " DKK/år</strong>";
    }
    
    map.on("moveend", updateDamageSummary);
    lyr_bygninger.on("change:visible", updateDamageSummary);
    jsonSource_bygninger.once('change', function () {
        if (jsonSource_bygninger.getState() === 'ready') updateDamageSummary();
    });
}