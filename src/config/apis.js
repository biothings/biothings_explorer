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
        // - Automat Chemical normalization: only has outdated ChemicalSubstance semantic type in meta_knowledge_graph response
        // - Automat Covidkop KG: seems to repeat a lot of data that is in the other APIs
        // - Automat Foodb: has outdated ChemicalSubstance and odd FDBN IDs in meta_knowledge_graph response
        // - Automat Robokop KG: seems to repeat a lot of data that is in the other APIs
        // - Automat molepro-fda: doesn't have edges / associations
        // - Automat Text Mining: Bill Baumgartner from Text Mining Provider advised us not to use this
        {
        // this API overlaps with our Biolink API registration, but we have bugs with our api-response-transform
        //   this may have been updated more recently / transformed data into TRAPI format
            id: '17cad7b291604a6a44579edaefe1dad2',
            name: 'Automat Biolink (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            // this may overlap with info we have in MyDisease, MyChem, and other APIs...
            id: '300bf98bb5c0affd39f4f34f9239ed99',
            name: 'Automat CTD (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: 'fe50d106ab92959e218086634309e223',
            name: 'Automat Cord19 (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '816dc6a181e85586beec5bd23eb48f66',
            name: 'Automat Drug Central (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '9f84bb8824f09592c72793289841fdd5',
            name: 'Automat GTEx (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: 'c6bed5afdff655acca07d5b789bf5ad2',
            name: 'Automat GWAS Catalog (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: 'b06f8f412dbed3f610f5ec0644d63d40',
            name: 'Automat Gtopdb (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '449f07aaed8e0acd7778c26956bd1778',
            name: 'Automat HGNC (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '4397d600003c189521cab414507d65dc',
            name: 'Automat hmdb (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '82edc917ebbb1a2cfb3a68ad11595968',
            name: 'Automat Hetio (ITRB PROD) (trapi v-1.3.0)'
        },
        {
        // this API overlaps with our BioThings GO APIs, but
        //   may have been updated more recently / transformed data into TRAPI format
            id: '92cf42a54feb94d58e80697dc1b5f5c6',
            name: 'Automat Human GOA (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '1dc085701dab80ec49d0237fe5e6ab47',
            name: 'Automat IntAct (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '12a39e0457c6cf1f6925ca8e8570dbca',
            name: 'Automat Ontological Hierarchy (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: 'd7cb3cacf399aa5d67996cd6dbd5ed50',
            name: 'Automat Panther (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: '151f98a2c6a20a13a375ecb03d8e500e',
            name: 'Automat Pharos (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: 'f9770b72fc56d039b2ae1d514d41914d',
            name: 'Automat Uberongraph (ITRB PROD) (trapi v-1.3.0)'
        },
        {
            id: 'c212d6dfd73de1bb169df771e6be8fd3',
            name: 'Automat Viral Proteome (ITRB PROD) (trapi v-1.3.0)'
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
