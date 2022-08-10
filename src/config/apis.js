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
            id: 'd86a24f6027ffe778f84ba10a7a1861a',
            name: 'Multiomics EHR Risk KP API'
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
        // - Automat Chemical normalization: only has outdated ChemicalSubstance semantic type in meta_knowledge_graph response
        // - Automat Covidkop KG: seems to repeat a lot of data that is in the other APIs
        // - Automat Foodb: has outdated ChemicalSubstance and odd FDBN IDs in meta_knowledge_graph response
        // - Automat Robokop KG: seems to repeat a lot of data that is in the other APIs
        // - Automat molepro-fda: doesn't have edges / associations
        {
        // this API overlaps with our Biolink API registration, but we have bugs with our api-response-transform
        //   this may have been updated more recently / transformed data into TRAPI format
            id: 'b665ad608be6c4c4d44e959cc860499b',
            name: 'Automat Biolink (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            // this may overlap with info we have in MyDisease, MyChem, and other APIs...
            id: '80ed55fb76aa19becbf7543899f563a0',
            name: 'Automat CTD (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '149addf578a783e7576d56830634c525',
            name: 'Automat Cord19 (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '2f9ba15c6c87f9a0c304c928da634087',
            name: 'Automat Drug Central (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '51837440bf36391daa458cf7c05fdb17',
            name: 'Automat GTEx (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: 'd50f19a353125256a4ec407ce0574538',
            name: 'Automat GWAS Catalog (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: 'faa3a08c43db349faf4f7660c3e1b530',
            name: 'Automat Gtopdb (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: 'f37ae04604095498117337e76e91511c',
            name: 'Automat HGNC (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '429331df75859a383fbbf908088dce93',
            name: 'Automat hmdb (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '35cf034cfda796fb2a59d188e950024f',
            name: 'Automat Hetio (ITRB PROD) (trapi v-1.2.0)'
        },
        {
        // this API overlaps with our BioThings GO APIs, but
        //   may have been updated more recently / transformed data into TRAPI format
            id: '2b9bdbd2276d7fa144b1d0de518dafc8',
            name: 'Automat Human GOA (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: 'f511aee54b00545e26964de97d94bf1f',
            name: 'Automat IntAct (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '85381b7215493691c4f08b579878c365',
            name: 'Automat Ontological Hierarchy (ITRB PROD) (trapi v-1.2.0) '
        },
        {
            id: '8101932943fd82a4770974c138cce99e',
            name: 'Automat Panther (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '490b17e236027cd908f6cb6d4b97e7c8',
            name: 'Automat Pharos (ITRB PROD) (trapi v-1.2.0)'
        },
        {
        // not sure if this API overlaps with Text Mining Targeted Association API or
        //   Text Mining Co-occurrrence API...
            id: 'a9c74cfd9219d5191d02936edd32e64b',
            name: 'Automat Text Mining KP (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: '1d6e87f9945ccb062d8111494ef71498',
            name: 'Automat Uberongraph (ITRB PROD) (trapi v-1.2.0)'
        },
        {
            id: 'ca6ffc891fb7e34b01769964706c1413',
            name: 'Automat Viral Proteome (ITRB PROD) (trapi v-1.2.0)'
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
    ],
    exclude: [ // explicitely disabled for use even in by_api endpoint

    ]
};
