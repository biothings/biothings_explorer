exports.API_LIST = [
    // external APIs annotated with SmartAPI x-bte
    {
        id: 'd22b657426375a5295e7da8a303b9893',
        name: 'BioLink API'
    },
    {
        id: '43af91b3d7cae43591083bff9d75c6dd',
        name: 'EBI Proteins API'
    },
    {
        id: '1ad2cba40cb25cd70d00aa8fba9cfaf3',
        name: 'LINCS Data Portal API'
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
    // "pending" BioThings APIs, annotated by x-bte
    {
        id: 'e3edd325c76f2992a111b43a907a4870',
        name: 'BioThings DGIdb API'
    },
    {
        id: '32f36164fabed5d3abe6c2fd899c9418',
        name: 'BioThings iDISK API'
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
    // Core BioThings APIs, annotated with x-bte
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
    // SEMMED BioThings APIs, annotated with x-bte
    {
        id: '0c9f1154a1986f1774057af4c1caa5b2',
        name: 'SEMMED Anatomy API'
    },
    {
        id: '5a7d625d50fc518d33db48cf39ce9b30',
        name: 'SEMMED Biological Process API'
    },
    {
        id: '7c07eca4ef5ceb532d06c0180e86aedd',
        name: 'SEMMED Chemical API'
    },
    {
        id: 'ed0ee52921c7cbce24033ffd1369922e',
        name: 'SEMMED Disease API'
    },
    {
        id: '81955d376a10505c1c69cd06dbda3047',
        name: 'SEMMED Gene API'
    },
    {
        id: '2dffb89df7f970b6a07e816e255d33ec',
        name: 'SEMMED Phenotype API'
    },
    // Multiomics Provider collab, annotated with x-bte
    {
        id: 'd86a24f6027ffe778f84ba10a7a1861a',
        name: 'Clinical Risk KP API'
    },
    {
        id: '02af7d098ab304e80d6f4806c3527027',
        name: 'Multiomics Wellness KP API'
    },
    // Text Mining Provider collab, annotated with x-bte
    // - removed Text Mining Co-occurrence API since there were issues using it with BTE (too many answers)
    {
        id: '978fe380a147a8641caf72320862697b',
        name: 'Text Mining Targeted Association API'
    },
    // Automat APIs, ingested through TRAPI
    {
    // this API overlaps with our Biolink API registration, but we have bugs with our ingest...
    //   this may have been updated more recently / transformed data into TRAPI format
        id: '05a5f5d18b4f2c532367561778571c9a',
        name: 'Automat Biolink (trapi v-1.1.2)'
    },
    // this API is outdated and only uses ChemicalSubstance right
    // {
    //     id: 'b0b36734630fdeb93252ebab7939535e',
    //     name: 'Automat Chemical normalization (trapi v-1.1.2)'
    // },
    {
        id: '0a93684206ec6a13812ff2867a445c4e',
        name: 'Automat Cord19 (trapi v-1.1.2)'
    },
    // seems to repeat a lot of data that is in the other APIs
    // {
    //     id: 'a192b537c4113cc585088511574dbe64',
    //     name: 'Automat Covidkop KG (trapi v-1.1.2)'
    // },
    {
    // this may overlap with info we have in MyDisease, MyChem, and other APIs...
        id: 'bd612e18f86d9097b02c0d83344b46b7',
        name: 'Automat CTD (trapi v-1.1.2)'
    },
    {
        id: '2214bd48772b8a9da0a399fd10c79f91',
        name: 'Automat DrugCentral (trapi v-1.1.2)'
    },
    {
        id: '1fd2f4cc6b3b6b1f7cda594b00607270',
        name: 'Automat Foodb (trapi v-1.1.2)'
    },
    {
        id: '62811dab25864feb191aad0b23503813',
        name: 'Automat GTEx (trapi v-1.1.2)'
    },
    {
        id: 'c8b1619535bd598406049f4dc51e1702',
        name: 'Automat Gtopdb (trapi v-1.1.2)'
    },
    {
        id: '3a8ad755bbd6f4fdfc0a18c8020d6d58',
        name: 'Automat Hetio (trapi v-1.1.2)'
    },
    {
        id: '255ea57924924b721919b9ee17a07894',
        name: 'Automat HGNC (trapi v-1.1.2)'
    },
    {
        id: 'c3e55e3a28cf14e147b55e6e09b32b9b',
        name: 'Automat HMDB (trapi v-1.1.2)'
    },
    {  
    // this API overlaps with our BioThings GO APIs, but
    //   may have been updated more recently / transformed data into TRAPI format
        id: '2c9fff2f09c71302659faeb515bbb2b8',
        name: 'Automat Human GOA (trapi v-1.1.2)'
    },
    {
        id: 'bee0cc86f86d88b83f613b674e2bd92e',
        name: 'Automat IntAct (trapi v-1.1.2)'
    },
    {
        id: '2bb65b7ea0cd1d40f4e9147836b750e2',
        name: 'Automat Ontological Hierarchy (trapi v-1.1.2)'
    },
    {
        id: 'c3e55e3a28cf14e147b55e6e09b32b9b',
        name: 'Automat Panther (trapi v-1.1.2)'
    },
    {
        id: 'e0031784afd7cb4e97e266d11df3a9e4',
        name: 'Automat Pharos (trapi v-1.1.2)'
    },
    // seems to repeat a lot of data that is in the other APIs
    // {
    //     id: '4f94c54ada189ecfe08491f662986fd6',
    //     name: 'Automat Robokop KG (trapi v-1.1.2)'
    // },
    {
    // not sure if this API overlaps with Text Mining Targeted Association API or
    //   Text Mining Co-occurrrence API...
        id: '7deb474184d551fdfa69c28a9bc46073',
        name: 'Automat Textmining KP (trapi v-1.1.2)'
    },
    {
        id: '994a667dafe2e2c1d42a5390a6fba9aa',
        name: 'Automat Uberongraph (trapi v-1.1.2)'
    },
    {
        id: '3437ede0d451c90f67097c56b230e022',
        name: 'Automat Viral Proteome (trapi v-1.1.2)'
    },
    // Clinical-data-based APIs from other Translator teams, ingested through TRAPI
    // {
    //     id: 'e164faae56a28c4cfa2d721978b04da4',
    //     name: 'Columbia Open Health Data (COHD) TRAPI 1.1'
    // },
    // notes on COHD:
    // - when BTE moves to TRAPI 1.2, we probably need to change registration to use
    //   COHD TRAPI 1.2 instance / 51c178099fa2dc99b5d8fff8bf9f1a0d
    // - DON'T INGEST 'Columbia Open Health Data (COHD)'/70117385218edc9bc01633829011dfcf
    //   IT IS NOT TRAPI (and may be outdated?)
    // - COHD for COVID-19 should work but BTE gets a 500 when retrieving meta_knowledge_graph...
    //   smartapi ID fc8245e92c970298449294fc04211869
    {
        id: '0864c0912390d0876c3c34a00acb5c3b',
        name: 'ICEES Asthma Instance API'
    },
    {
        id: '65292eac9a88e3a895be21f19b554767',
        name: 'ICEES COVID-19 Instance API'
    },
    {
        id: '9dd890397a7b8d98fbe247d56cac2b8f',
        name: 'ICEES DILI Instance API'
    },
];
