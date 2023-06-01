// APIs in this list are accessible by the main endpoints v1/query and v1/asyncquery
exports.API_LIST = {
    include: [ // enabled for use in general and by_team endpoints
        // external (not Su / Wu Lab), non-TRAPI APIs
        // annotated with SmartAPI x-bte
        // also accessible by v1/team/Service Provider/ endpoints and by api-specific endpoints
        {
            id: 'd22b657426375a5295e7da8a303b9893',
            name: 'BioLink API'
            // also known as Monarch: https://monarchinitiative.org/
            // NOT the same as the Biolink-model
        },
        {
            id: '0212611d1c670f9107baf00b77f0889a',
            name: 'CTD API',
            primarySource: true
        },
        {
            id: '43af91b3d7cae43591083bff9d75c6dd',
            name: 'EBI Proteins API'
        },
        {
            id: 'dca415f2d792976af9d642b7e73f7a41',
            name: 'LitVar API'
        },
        {
            id: '1f277e1563fcfd124bfae2cc3c4bcdec',
            name: 'QuickGO API'
        },
        {
            id: '1c056ffc7ed0dd1229e71c4752239465',
            name: 'Ontology Lookup Service API'
        },
        // internal (Su / Wu Lab), non-TRAPI: "pending" BioThings APIs
        // annotated with SmartAPI x-bte
        // also accessible by v1/team/Service Provider/ endpoints and by api-specific endpoints
        {
            id: '38e9e5169a72aee3659c9ddba956790d',
            name: 'BioThings BindingDB API'
        },
        {
            id: '55a223c6c6e0291dbd05f2faf27d16f4',
            name: 'BioThings BioPlanet Pathway-Disease API'
        },
        {
            id: 'b99c6dd64abcefe87dcd0a51c249ee6d',
            name: 'BioThings BioPlanet Pathway-Gene API'
        },
        {
            id: '00fb85fc776279163199e6c50f6ddfc6',
            name: 'BioThings DDInter API'
        },
        {
            id: 'e3edd325c76f2992a111b43a907a4870',
            name: 'BioThings DGIdb API'
        },
        {
            id: 'a7f784626a426d054885a5f33f17d3f8',
            name: 'BioThings DISEASES API'
        },
        {
            id: '1f47552dabd67351d4c625adb0a10d00',
            name: 'BioThings EBIgene2phenotype API'
        },
        {
            id: 'cc857d5b7c8b7609b5bbb38ff990bfff',
            name: 'BioThings GO Biological Process API'
        },
        {
            id: 'f339b28426e7bf72028f60feefcd7465',
            name: 'BioThings GO Cellular Component API'
        },
        {
            id: '34bad236d77bea0a0ee6c6cba5be54a6',
            name: 'BioThings GO Molecular Function API'
        },
        {
            id: '316eab811fd9ef1097df98bcaa9f7361',
            name: 'BioThings GTRx API'
        },
        {
            id: 'a5b0ec6bfde5008984d4b6cde402d61f',
            name: 'BioThings HPO API'
        },
        {
            id: '32f36164fabed5d3abe6c2fd899c9418',
            name: 'BioThings IDISK API'
        },
        {
            id: '77ed27f111262d0289ed4f4071faa619',
            name: 'BioThings MGIgene2phenotype API'
        },
        {
            id: 'edeb26858bd27d0322af93e7a9e08761',
            name: 'BioThings PFOCR API'
        },
        {
            id: 'b772ebfbfa536bba37764d7fddb11d6f',
            name: 'BioThings RARe-SOURCE API'
        },
        {
            id: '03283cc2b21c077be6794e1704b1d230',
            name: 'BioThings Rhea API'
        },
        {
            id: '1d288b3a3caf75d541ffaae3aab386c8',
            name: 'BioThings SEMMEDDB API'
        },
        {
            id: 'ec6d76016ef40f284359d17fbf78df20',
            name: 'BioThings UBERON API'
        },
        // internal (Su / Wu Lab), non-TRAPI: Core BioThings APIs
        // annotated with SmartAPI x-bte
        // also accessible by v1/team/Service Provider/ endpoints and by api-specific endpoints
        {
            id: '8f08d1446e0bb9c2b323713ce83e2bd3',
            name: 'MyChem.info API'
        },
        {
            id: '671b45c0301c8624abbd26ae78449ca2',
            name: 'MyDisease.info API'
        },
        {
            id: '59dce17363dce279d389100834e43648',
            name: 'MyGene.info API'
        },
        {
            id: '09c8782d9f4027712e65b95424adba79',
            name: 'MyVariant.info API'
        },
        // non-TRAPI: pending BioThings APIs made in collab with Multiomics Provider
        // annotated with SmartAPI x-bte
        // also accessible by v1/team/Service Provider/ and v1/team/Multiomics Provider endpoints, and by api-specific endpoints
        {
            id: 'adf20dd6ff23dfe18e8e012bde686e31',
            name: 'Multiomics BigGIM-DrugResponse KP API'
        },
        {
            id: '08a5ddcde71b4bf838327ef469076acd',
            name: 'Multiomics ClinicalTrials KP'
        },
        {
            id: 'd86a24f6027ffe778f84ba10a7a1861a',
            name: 'Multiomics EHR Risk KP API'
        },
        {
            id: '02af7d098ab304e80d6f4806c3527027',
            name: 'Multiomics Wellness KP API'
        },
        // non-TRAPI: pending BioThings APIs made in collab with Text Mining Provider
        // annotated with SmartAPI x-bte
        // also accessible by v1/team/Service Provider/ and v1/team/Text Mining Provider endpoints, and by api-specific endpoints
        {
            id: '978fe380a147a8641caf72320862697b',
            name: 'Text Mining Targeted Association API'
        },
        // TRAPI (Translator standard) APIs: Automat
        // not accessible by team or api-specific endpoints
        // Notes: We don't ingest the following:
        // - Automat-robokop: seems to repeat a lot of data that is in the other APIs
        {
        // this API overlaps with our Biolink API registration, but we have bugs with our api-response-transform
        //   this may have been updated more recently / transformed data into TRAPI format
            id: 'ef0656900ff73f861611bcad87a94bce',
            name: 'Automat-biolink(Trapi v1.4.0)'
        },
        {
            // this may overlap with info we have in MyDisease, MyChem, and other APIs...
            id: '97da45e75266b021fae885735befad07',
            name: 'Automat-ctd(Trapi v1.4.0)'
        },
        {
            id: 'a80b9c70e756453d1ce8971b59fe1778',
            name: 'Automat-drug-central(Trapi v1.4.0)'
        },
        {
            id: '2575e053d0a631433b447995e1bc9602',
            name: 'Automat-gtex(Trapi v1.4.0)'
        },
        {
            id: '387f7a2c21656ddfcce5ccf9ea459049',
            name: 'Automat-gtopdb(Trapi v1.4.0)'
        },
        {
            id: 'cd9fc0ca8cc6d9f56bd56a34766de791',
            name: 'Automat-gwas-catalog(Trapi v1.4.0)'
        },
        {
            id: '8a1e2c2eade9fe3a932ba1dbb7f85688',
            name: 'Automat-hetio(Trapi v1.4.0)'
        },
        {
            id: '067d3a847117c6f42896cc8cd140a704',
            name: 'Automat-hgnc(Trapi v1.4.0)'
        },
        {
            id: '0658e8749b9601a5faba5157ba12eb06',
            name: 'Automat-hmdb(Trapi v1.4.0)'
        },
        {
        // this API overlaps with our BioThings GO APIs, but
        //   may have been updated more recently / transformed data into TRAPI format
            id: '43cf256c660cc5bdeac23fdd3063d474',
            name: 'Automat-human-goa(Trapi v1.4.0)'
        },
        {
            id: '76a164ff43e7ab39a5b98a782f6361bf',
            name: 'Automat-icees-kg(Trapi v1.4.0)'
        },
        {
            id: '0b0a4d48ccd9ad2fd34ee53c34f87e94',
            name: 'Automat-intact(Trapi v1.4.0)'
        },
        {
            id: '26ca4939d437c411bcb65b85a9dc2b99',
            name: 'Automat-panther(Trapi v1.4.0)'
        },
        {
            id: '1c71f68839a44b1b857e79ae7f7e3381',
            name: 'Automat-pharos(Trapi v1.4.0)'
        },
        {
            id: '465ff6de7ddf35ca8b2df6c0b01e6554',
            name: 'Automat-viral-proteome(Trapi v1.4.0)'
        },
        // TRAPI (Translator standard) APIs: COHD
        // not accessible by team or api-specific endpoints
        // notes on COHD:
        // - DON'T INGEST 'Columbia Open Health Data (COHD)'/70117385218edc9bc01633829011dfcf
        //   IT IS NOT TRAPI (and may be outdated?)
        // - COHD for COVID-19 should work but BTE gets a 500 when retrieving meta_knowledge_graph...
        //   smartapi ID fc8245e92c970298449294fc04211869
        {
            id: 'af364143267ad5235bf78c1511223875',
            name: 'COHD TRAPI'
        },
        // TRAPI (Translator standard) APIs: CHP
        // not accessible by team or api-specific endpoints
        {
            id: '23f770568b92b7a82063989b3ddd9706',
            name: 'Connections Hypothesis Provider API'
        },
    ],
    exclude: [ // explicitly disabled for use even in by_api endpoint. for TRAPI and APIs annotated with SmartAPI x-bte

    ]
};
