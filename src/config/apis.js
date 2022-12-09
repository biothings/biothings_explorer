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
            id: 'e3edd325c76f2992a111b43a907a4870',
            name: 'BioThings DGIdb API'
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
            id: '32f36164fabed5d3abe6c2fd899c9418',
            name: 'BioThings iDISK API'
        },
        {
            id: 'edeb26858bd27d0322af93e7a9e08761',
            name: 'BioThings pfocr API'
        },
        {
            id: 'a7f784626a426d054885a5f33f17d3f8',
            name: 'DISEASES API'
        },
        {
            id: '1f47552dabd67351d4c625adb0a10d00',
            name: 'EBIgene2phenotype API'
        },
        {
            id: 'cc857d5b7c8b7609b5bbb38ff990bfff',
            name: 'Gene Ontology Biological Process API'
        },
        {
            id: 'f339b28426e7bf72028f60feefcd7465',
            name: 'Gene Ontology Cellular Component API'
        },
        {
            id: '34bad236d77bea0a0ee6c6cba5be54a6',
            name: 'Gene Ontology Molecular Activity API'
        },
        {
            id: 'a5b0ec6bfde5008984d4b6cde402d61f',
            name: 'Human Phenotype Ontology API'
        },
        {
            id: '77ed27f111262d0289ed4f4071faa619',
            name: 'MGIgene2phenotype API'
        },
        {
            id: 'ec6d76016ef40f284359d17fbf78df20',
            name: 'UBERON Ontology API'
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
        // - Automat-covidkop: seems to repeat a lot of data that is in the other APIs
        // - Automat-mole-pro-fda: doesn't have edges / associations
        // - Automat-mychem-info: since we ingest MyChem directly through x-bte annotations
        // - Automat-robokop: seems to repeat a lot of data that is in the other APIs
        {
        // this API overlaps with our Biolink API registration, but we have bugs with our api-response-transform
        //   this may have been updated more recently / transformed data into TRAPI format
            id: '25085b05fd1afcebb497724d147cfb44',
            name: 'Automat-biolink(Trapi v1.3.0)'
        },
        {
            // this may overlap with info we have in MyDisease, MyChem, and other APIs...
            id: '89aa98098ba4329aa49b43ff8d21ffbb',
            name: 'Automat-ctd(Trapi v1.3.0)'
        },
        {
            id: '463525b319d7e1ef8f705bce953d01bd',
            name: 'Automat-cord19(Trapi v1.3.0)'
        },
        {
            id: '539873b1f2f2eb913efaee411e09eaa7',
            name: 'Automat-drug-central(Trapi v1.3.0)'
        },
        {
            id: '272c2357763e4faf737f1cba94beaa1d',
            name: 'Automat-gtex(Trapi v1.3.0)'
        },
        {
            id: 'fb1f3780ad67b030cb0617363afa8f61',
            name: 'Automat-gwas-catalog(Trapi v1.3.0)'
        },
        {
            id: 'aacdd9e863bb659574d302f084084976',
            name: 'Automat-gtopdb(Trapi v1.3.0)'
        },
        {
            id: '7382f0fabffce3cc7f7b8b6358c69259',
            name: 'Automat-hgnc(Trapi v1.3.0)'
        },
        {
            id: 'ee2d2eae42ca30fe82946d3f42febaa0',
            name: 'Automat-hmdb(Trapi v1.3.0)'
        },
        {
            id: '830600da121a5accc955cbf62e60f802',
            name: 'Automat-hetio(Trapi v1.3.0)'
        },
        {
        // this API overlaps with our BioThings GO APIs, but
        //   may have been updated more recently / transformed data into TRAPI format
            id: 'f30339a6894a146a19a34974712ca2e3',
            name: 'Automat-human-goa(Trapi v1.3.0)'
        },
        {
            id: '44e7a1147ca8657f50af6bb25982762d',
            name: 'Automat-icees-kg(Trapi v1.3.0)'
        },
        {
            id: 'e0687431a9ff88344d20e83e0c99ee7d',
            name: 'Automat-intact(Trapi v1.3.0)'
        },
        {
            id: '4c6f9117581531161849e60ea906f0be',
            name: 'Automat-ontology-hierarchy(Trapi v1.3.0)'
        },
        {
            id: '2a879882329b000c7e7f08c2d71ccffd',
            name: 'Automat-panther(Trapi v1.3.0)'
        },
        {
            id: '0295640b4d060133e4296dda4c31da47',
            name: 'Automat-pharos(Trapi v1.3.0)'
        },
        {
            id: 'ef9027a7d2246c6540cc7b3ce202d89f',
            name: 'Automat-uberongraph(Trapi v1.3.0)'
        },
        {
            id: '79310edd01cae96f3d8495250e625886',
            name: 'Automat-viral-proteome(Trapi v1.3.0)'
        },
        // TRAPI (Translator standard) APIs: COHD
        // not accessible by team or api-specific endpoints
        // notes on COHD:
        // - DON'T INGEST 'Columbia Open Health Data (COHD)'/70117385218edc9bc01633829011dfcf
        //   IT IS NOT TRAPI (and may be outdated?)
        // - COHD for COVID-19 should work but BTE gets a 500 when retrieving meta_knowledge_graph...
        //   smartapi ID fc8245e92c970298449294fc04211869
        {
            id: '51c178099fa2dc99b5d8fff8bf9f1a0d',
            name: 'COHD TRAPI 1.3'
        },
        // TRAPI (Translator standard) APIs: CHP
        // not accessible by team or api-specific endpoints
        {
            id: '855adaa128ce5aa58a091d99e520d396',
            name: 'Connections Hypothesis Provider API'
        },
        // TRAPI (Translator standard) APIs: ICEES
        // not accessible by team or api-specific endpoints
        // currently commented out because of issues
        // {
        //     id: '749c8f527fa07964de692e0969b71a4e',
        //     name: 'ICEES DILI Instance API - production'
        // },
        // {
        //     id: 'bb806f5c81e86fe12660fa307d4b0a97',
        //     name: 'ICEES Asthma Instance API - production'
        // },
        // {
        //     id: '4153c947a32e2e2a55a320d0bee22077',
        //     name: 'ICEES PCD Instance API - production'
        // },
    ],
    exclude: [ // explicitly disabled for use even in by_api endpoint. for TRAPI and APIs annotated with SmartAPI x-bte
        // Temporary exclusion due to incompatible x-bte annotation
        {
            id: 'e9f69b81e755e163fdf6c41a2b5e07c0',
            name: 'OpenPredict API',
        },
    ]
};
