const overrides = require('./smartapi_overrides.js').overrides;

// APIs in this list are accessible by the main endpoints v1/query and v1/asyncquery
let API_LIST = [
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
        id: 'd86a24f6027ffe778f84ba10a7a1861a',
        name: 'Clinical Risk KP API'
    },
    {
        id: 'adf20dd6ff23dfe18e8e012bde686e31',
        name: 'Multiomics BigGIM-DrugResponse KP API'
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
    // - Automat Chemical normalization (only has outdated ChemicalSubstance semantic type in meta_knowledge_graph endpoint)
    // - Automat Covidkop KG: seems to repeat a lot of data that is in the other APIs
    // - Automat Robokop KG: seems to repeat a lot of data that is in the other APIs
    // - Automat molepro-fda: doesn't have edges / associations
    {
    // this API overlaps with our Biolink API registration, but we have bugs with our api-response-transform
    //   this may have been updated more recently / transformed data into TRAPI format
        id: '6a3c22bbb4d533c15013a3f9000a8709',
        name: 'Automat Biolink (trapi v-1.2.0)'
    },
    {
        // this may overlap with info we have in MyDisease, MyChem, and other APIs...
            id: '8956303f273baaa76202ff3195bd6a64',
            name: 'Automat CTD (trapi v-1.2.0)'
    },
    {
        id: '2c3c45487f65330b058946cd46dbbfa1',
        name: 'Automat Cord19 (trapi v-1.2.0)'
    },
    {
        id: '03c1982f2e3ba3710da20aa9c01a00f6',
        name: 'Automat DrugCentral (trapi v-1.2.0)'
    },
    {
        id: '7ba4ef33f17ab1fd4f106f105b19a1bc',
        name: 'Automat Foodb (trapi v-1.2.0)'
    },
    {
        id: '0f4e5f1293de2074ccebe01b14567574',
        name: 'Automat GTEx (trapi v-1.2.0)'
    },
    {
        id: '8f358795cbbdc9b4fef53346b67033be',
        name: 'Automat GWAS Catalog (trapi v-1.2.0)'
    },
    {
        id: '694e7960fdab1827f2f6004c3db01e40',
        name: 'Automat Gtopdb (trapi v-1.2.0)'
    },
    {
        id: 'b4d881e4443ab6f94b4fb7bcbb49e983',
        name: 'Automat HGNC (trapi v-1.2.0)'
    },
    {
        id: '3a31d671dbaf211d8b7f502aec2d609d',
        name: 'Automat HMDB (trapi v-1.2.0)'
    },
    {
        id: '6c7642a4bf213769361c8f9ec1be88f2',
        name: 'Automat Hetio (trapi v-1.2.0)'
    },
    {
    // this API overlaps with our BioThings GO APIs, but
    //   may have been updated more recently / transformed data into TRAPI format
        id: '6118e4e713af49f48b37788593fd3fcb',
        name: 'Automat Human GOA (trapi v-1.2.0)'
    },
    {
        id: 'c7f31bbfb232c337ae29b80eea9cfa37',
        name: 'Automat IntAct (trapi v-1.2.0)'
    },
    {
        id: '9326397c93c0ab17b9907d307a76f7b7',
        name: 'Automat Ontological Hierarchy (trapi v-1.2.0)'
    },
    {
        id: 'd907e918a38e85c8e93ee3a0dcfc95d4',
        name: 'Automat Panther (trapi v-1.2.0)'
    },
    {
        id: '0de0fcb872ddd6daddb9eee27e95996f',
        name: 'Automat Pharos (trapi v-1.2.0)'
    },
    {
    // not sure if this API overlaps with Text Mining Targeted Association API or
    //   Text Mining Co-occurrrence API...
        id: 'd2eecc42b6ae9109b12bcd215c787479',
        name: 'Automat Textmining KP (trapi v-1.2.0)'
    },
    {
        id: 'af7ad4d2e2438ed9406af963d963cd33',
        name: 'Automat Uberongraph (trapi v-1.2.0)'
    },
    {
        id: 'fe351cf879d06616e655d46ee915c2e4',
        name: 'Automat Viral Proteome (trapi v-1.2.0)'
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
        name: 'COHD TRAPI 1.2'
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
];

if (overrides.config.override_API_LIST) {
    if (overrides.config.only_overrides) {
        API_LIST = [];
    }

    Object.entries(overrides.apis).forEach(([id, source]) => {
        API_LIST.push({ id, name: source });
    });
}


exports.API_LIST = API_LIST;
