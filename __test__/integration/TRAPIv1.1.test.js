const app = require("../../src/app");
const request = require('supertest');
const fs = require("fs");
var path = require('path');

const axios = require('axios')
const og_axios = jest.requireActual('axios')
jest.mock('axios')

const arrEquals = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return arr1 === arr2
  if (arr1.length !== arr2.length) {
    return false
  }
  arr1.sort((a, b) => (a > b) ? -1 : 1)
  arr2.sort((a, b) => (a > b) ? -1 : 1)
  for (var i = 0; i<arr1.length; i++) {
    if (!arrEquals(arr1[i], arr2[i])) return false
  }
  return true
}


describe("Testing v1.1 endpoints", () => {
    const example_folder = path.resolve(__dirname, '../../examples/v1.1');
    const clinical_risk_kp_folder = path.resolve(__dirname, '../../examples/v1.1/multiomics/clinical_risk_kp');
    const old_spec_folder = path.resolve(__dirname, "../../examples/v0.9.2");
    const invalid_example_folder = path.resolve(__dirname, "../../examples/v1.1/invalid");
    const drug2disease_query = JSON.parse(fs.readFileSync(path.join(clinical_risk_kp_folder, 'query_drug_to_disease.json')));
    const gene2chemical_query = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_chemicals_physically_interacts_with_genes.json')));
    const disease2gene_query = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_genes_relate_to_disease.json')));
    const query_using_earlier_trapi_spec = JSON.parse(fs.readFileSync(path.join(old_spec_folder, 'query_genes_relate_to_disease.json')));
    const query_without_category = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_without_input_category.json')))
    const expand_node = JSON.parse(fs.readFileSync(path.join(example_folder, 'query_with_node_to_be_expanded.json')))

    test("GET /v1/meta_knowledge_graph", async () => {

      await request(app)
            .get("/v1/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes");
                expect(response.body).toHaveProperty("nodes.biolink:Gene");
                expect(response.body).toHaveProperty("nodes.biolink:Gene.id_prefixes");

                expect(response.body).toHaveProperty("edges");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SmallMolecule",
                        "predicate": "biolink:entity_positively_regulates_entity",
                        "object": "biolink:Gene"
                      })
                    ])
                );
            })
    })

    test("GET /v1/team/{team_name}/meta_knowledge_graph", async () => {

        await request(app)
            .get("/v1/team/Service Provider/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes");
                expect(response.body).toHaveProperty("nodes.biolink:Gene");
                expect(response.body).toHaveProperty("nodes.biolink:Gene.id_prefixes");

                expect(response.body).toHaveProperty("edges");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SequenceVariant",
                        "predicate": "biolink:is_sequence_variant_of",
                        "object": "biolink:Gene",
                      })
                    ])
                );
            })
    })

    test("Query to Text Mining team Should return 200 with valid response", async () => {

        await request(app)
            .get("/v1/team/Text Mining Provider/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes.biolink:Gene");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SmallMolecule",
                        "predicate": "biolink:treats",
                        "object": "biolink:Disease",
                      })
                    ])
                );
            })
    })

    test("Query to Invalid team Should return 200 with empty response", async () => {

        await request(app)
            .get("/v1/team/wrong team/meta_knowledge_graph")
            .expect(404)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toEqual({
                    "error": "Unable to load predicates",
                    "more_info": "Failed to Load MetaKG: PredicatesLoadingError: Not Found - 0 operations",
                });
            })
    })

    test("GET /v1/smartapi/{smartapi_id}/meta_knowledge_graph", async () => {

        await request(app)
            // testing with "Text Mining Targeted Association API"
            .get("/v1/smartapi/978fe380a147a8641caf72320862697b/meta_knowledge_graph")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("nodes.biolink:Disease");
                expect(response.body.edges).toEqual(
                    expect.arrayContaining([
                      expect.objectContaining({
                        "subject": "biolink:SmallMolecule",
                        "predicate": "biolink:treats",
                        "object": "biolink:Disease"
                      })
                    ])
                );
            })
    })

    test("Query to Invalid API Should return 404 with error message included", async () => {

        await request(app)
            .get("/v1/smartapi/78fe380a147a8641caf72320862697b/meta_knowledge_graph")
            .expect(404)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("error", "Unable to load predicates");
                expect(response.body).toHaveProperty("more_info", "Failed to Load MetaKG: PredicatesLoadingError: Not Found - 0 operations");
            })
    })

    test("POST /v1/query with gene2chemical query", async () => {

      const mychem_query_3_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_3_input.json")))
      const mychem_query_4_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_4_input.json")))
      const mychem_query_5_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_5_input.json")))
      const mychem_query_6_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_6_input.json")))
      const mychem_query_7_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_7_input.json")))
      const mychem_query_8_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_8_input.json")))
      const mychem_query_9_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/mychem_query_9_input.json")))
      const big_sri_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/big_sri_input.json")))
      const big_sri_input_2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/big_sri_input_2.json")))
      const ngd_input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/ngd_input.json")))

      axios.default.mockImplementation(async (qData) => {
        let res = undefined
        if (qData.url === 'https://mychem.info/v1/query' && qData.data === 'q=A0A024RB10,A0A024RB77,B4DDL9,E7ESI2,G3V5T9,P24941&scopes=drugcentral.bioactivity.uniprot.uniprot_id') {
          res = [{"query":"A0A024RB10","notfound":true},{"query":"A0A024RB77","notfound":true},{"query":"B4DDL9","notfound":true},{"query":"E7ESI2","notfound":true},{"query":"G3V5T9","notfound":true},{"query":"P24941","_id":"XZXHXSATPCNXJR-ZIADKAODSA-N","_score":9.885763,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL502835","CHEMBL3039504"]}}},{"query":"P24941","_id":"BCFGMOOMADDAQU-UHFFFAOYSA-N","_score":9.098851,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL1201179","CHEMBL554"]}}},{"query":"P24941","_id":"MLDQJTXFUGDVEO-UHFFFAOYSA-N","_score":9.098851,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL1336","CHEMBL1200485"]}}},{"query":"P24941","_id":"REFJWTPEDVJJIY-UHFFFAOYSA-N","_score":8.601126,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":"CHEMBL50"}}},{"query":"P24941","_id":"AHJRHEGDXFFMBM-UHFFFAOYSA-N","_score":8.601126,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL189963","CHEMBL2364621"]}}},{"query":"P24941","_id":"VERWOWGGCGHDQE-UHFFFAOYSA-N","_score":8.601126,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":"CHEMBL2403108"}}}];
        }
        if (qData.url === 'https://automat.transltr.io/ctd/1.3/query') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["NCBIGene:1017"],"categories":["biolink:Gene"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:SmallMolecule"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:decreases_molecular_interaction"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
        }
        if (qData.url === 'https://biothings.ncats.io/bindingdb/query' && qData.data === 'q=A0A024RB10,A0A024RB77,B4DDL9,E7ESI2,G3V5T9,P24941&scopes=subject.uniprot.accession') {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/bindingdb_query_0.json")))
        }
        if (qData.url === 'https://biothings.ncats.io/bindingdb/query' && qData.data === 'q=A0A024RB10,A0A024RB77,B4DDL9,E7ESI2,G3V5T9,P24941&scopes=subject.uniprot.accession' && qData.params?.from) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/api_results/bindingdb_query_${qData.params.from}.json`)))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, ["CHEMBL502835","CHEMBL3039504","CHEMBL1201179","CHEMBL554","CHEMBL1336","CHEMBL1200485","CHEMBL50","CHEMBL189963","CHEMBL2364621","CHEMBL2403108"])) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_2.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_3_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_3.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_4_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_4.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_5_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_5.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_6_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_6.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_7_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_7.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_8_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_8.json')))
        }
        if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, mychem_query_9_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mychem_query_9.json')))
        }
        return { data: res }
      })

      axios.default.post.mockImplementation(async (...q) => {
        const [url, qData] = q;
        let res = undefined
        if (arrEquals(qData?.curies, ["NCBIGene:1017"])) {
          res = {"NCBIGene:1017":{"id":{"identifier":"NCBIGene:1017","label":"CDK2"},"equivalent_identifiers":[{"identifier":"NCBIGene:1017","label":"CDK2"},{"identifier":"ENSEMBL:ENSG00000123374"},{"identifier":"HGNC:1771","label":"CDK2"},{"identifier":"OMIM:116953"},{"identifier":"UMLS:C1332733","label":"CDK2 gene"},{"identifier":"UniProtKB:A0A024RB10","label":"A0A024RB10_HUMAN Cyclin-dependent kinase 2, isoform CRA_a (trembl)"},{"identifier":"UniProtKB:A0A024RB77","label":"A0A024RB77_HUMAN Cyclin-dependent kinase 2, isoform CRA_b (trembl)"},{"identifier":"UniProtKB:B4DDL9","label":"B4DDL9_HUMAN cDNA FLJ54979, highly similar to Homo sapiens cyclin-dependent kinase 2 (CDK2), transcript variant 2, mRNA (trembl)"},{"identifier":"UniProtKB:E7ESI2","label":"E7ESI2_HUMAN Cyclin-dependent kinase 2 (trembl)"},{"identifier":"ENSEMBL:ENSP00000393605"},{"identifier":"UniProtKB:G3V5T9","label":"G3V5T9_HUMAN Cyclin-dependent kinase 2 (trembl)"},{"identifier":"ENSEMBL:ENSP00000452514"},{"identifier":"UniProtKB:P24941","label":"CDK2_HUMAN Cyclin-dependent kinase 2 (sprot)"},{"identifier":"PR:P24941","label":"cyclin-dependent kinase 2 (human)"},{"identifier":"UMLS:C0108855","label":"CDK2 protein, human"}],"type":["biolink:Gene","biolink:GeneOrGeneProduct","biolink:GenomicEntity","biolink:ChemicalEntityOrGeneOrGeneProduct","biolink:PhysicalEssence","biolink:OntologyClass","biolink:BiologicalEntity","biolink:NamedThing","biolink:Entity","biolink:PhysicalEssenceOrOccurrent","biolink:ThingWithTaxon","biolink:MacromolecularMachineMixin","biolink:Protein","biolink:GeneProductMixin","biolink:Polypeptide","biolink:ChemicalEntityOrProteinOrPolypeptide"],"information_content":100}}
        }
        if (arrEquals(qData?.curies, big_sri_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/big_sri_query.json")))
        }
        if (arrEquals(qData?.curies, big_sri_input_2)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/big_sri_query_2.json")))
        }
        if (arrEquals(qData?.umls, ngd_input)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/ngd_query.json")))
        }
        if (res === undefined) {
          res = (await og_axios.post(...q)).data
        }
        return { data: res }
      })

        await request(app)
            .post("/v1/query")
            .send(gene2chemical_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("NCBIGene:1017")
            })
    })

    //Skip this test for now, need to check the actual API data
    test.skip("POST /v1/query with clinical risk kp query", async () => {
        await request(app)
            .post("/v1/query")
            .send(drug2disease_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("MONDO:0001583")
            })
    })

    test("POST /v1/query with query graph defined in old trapi standard", async () => {

        await request(app)
            .post("/v1/query")
            .send(query_using_earlier_trapi_spec)
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("error", "Your input query graph is invalid");
            })
    })

    test("POST /v1/query with disease2gene query", async () => {

      const big_sri_input_3 = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/big_sri_input_3.json")))
      const ngd_input_2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/ngd_input_2.json")))

      axios.default.mockImplementation(qData => {
        let res = undefined

        if (qData.url === 'https://mygene.info/v3/query' && qData.data === 'q=MONDO:0005737&scopes=clingen.clinical_validity.mondo') {
          res = [{"query":"MONDO:0005737","notfound":true}]
        }
        if (qData.url === 'https://api.monarchinitiative.org/api/bioentity/disease/MONDO:0005737/genes') {
          res = {"associations":[],"compact_associations":null,"objects":null,"numFound":0,"docs":null,"facet_counts":{},"highlighting":null}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","CAUSES","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","CAUSES","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PART_OF","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","PART_OF","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","ASSOCIATED_WITH","gngm",1,1])) {
          res = {"max_total":8,"hits":[{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"118612906","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":11752702,"predicate":"ASSOCIATED_WITH","subject":{"name":"Genetic Structures","umls":"C1136352"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"142375549","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":26376249,"predicate":"ASSOCIATED_WITH","subject":{"name":"TIE1 gene","umls":"C1539965"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"185194271","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":32161708,"predicate":"ASSOCIATED_WITH","subject":{"name":"IMPACT gene","umls":"C1825598"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"149589561","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":20878400,"predicate":"ASSOCIATED_WITH","subject":{"name":"KIR2DS1"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"149589562","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":20878400,"predicate":"ASSOCIATED_WITH","subject":{"name":"KIR2DS3"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"144337438","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":17940958,"predicate":"ASSOCIATED_WITH","subject":{"name":"AXL gene","umls":"C0812237"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"187446981","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":32625555,"predicate":"ASSOCIATED_WITH","subject":{"name":"IMPACT gene","umls":"C1825598"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"194568803","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":34166464,"predicate":"ASSOCIATED_WITH","subject":{"name":"STAT3 gene","umls":"C1367307"}}]}
        }
        if (qData.url === 'https://biothings.ncats.io/pfocr/query' && qData.data === 'q=D019142&scopes=associatedWith.mentions.diseases.mesh') {
          res = {"max_total":1,"hits":[{"query":"D019142","_id":"PMC7725765__fpubh-08-596944-g0001.jpg","_score":10.558324,"associatedWith":{"figureUrl":"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7725765/bin/fpubh-08-596944-g0001.jpg","mentions":{"genes":{"ncbigene":["6301"]}},"pmc":"PMC7725765","title":"Pathway diagram for pathogen spill-over to humans from animals describes three distinct processes"}}]}
        }
        if (qData.url === 'https://myvariant.info/v1/query' && qData.data === 'q=DOID:4325&scopes=civic.evidence_items.disease.doid') {
          res = {"max_total":0,"hits":[{"query":["C0282687","PART_OF","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === 'https://myvariant.info/v1/query' && qData.data === 'q=DOID:4325&scopes=docm.doid') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"constraints":[]}},"edges":{"e01":{"predicates":["biolink:increases_expression_of"],"subject":"n0","object":"n1","constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"max_results":10,"trapi_version":"1.2","biolink_version":"2.2.3","logs":[{"timestamp":"2023-01-27T02:54:54.360512","level":"INFO","message":"Normalized curie: MONDO:0005737 to UMLS:C0282687","code":null},{"timestamp":"2023-01-27T02:54:54.490870","level":"INFO","message":"Converted category biolink:Disease to biolink:Disease using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:54.490891","level":"INFO","message":"Converted category biolink:Gene to biolink:Gene using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:54.499238","level":"INFO","message":"Converted predicate biolink:increases_expression_of to biolink:increases_expression_of using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:54.697830","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:54.698874","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:54.708116","level":"INFO","message":"No results found.","code":null}],"id":"5a9c6638-3a5c-44f6-b368-046caa28fa10","status":"Success","description":null,"workflow":[{"id":"lookup"}]}
        }
        if (qData.url === 'https://biothings.ncats.io/mgigene2phenotype/query' && qData.data === 'q=DOID:4325&scopes=mgi.associated_with_disease.doid') {
          res = {"max_total":0,"hits":[{"query":"DOID:4325","notfound":true}]}
        }
        if (qData.url === 'https://biothings.ncats.io/biggim_drugresponse_kp/query') {
          res = {"max_total":0,"hits":[{"query":["MONDO:0005737","biolink:has_biomarker"],"notfound":true}]}
        }
        if (qData.url === 'https://biothings.ncats.io/DISEASES/query' && qData.data === 'q=DOID:4325&scopes=DISEASES.doid') {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/biothings_disease_query.json")))
        } 
        if (qData.url === 'https://biothings.ncats.io/text_mining_targeted_association/query') {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data/api_results/textmining_query.json")))
        }
        if (qData.url === "https://mydisease.info/v1/query" && qData.data === "q=C0282687&scopes=disgenet.xrefs.umls") {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/api_results/mydisease_query.json')))
        }
        if (qData.url === 'https://automat.transltr.io/biolink/1.3/query') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:contribution_from"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
        }
        if (qData.url === 'https://chp-api.transltr.io/query') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"constraints":[]}},"edges":{"e01":{"predicates":["biolink:decreases_expression_of"],"subject":"n0","object":"n1","constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"max_results":10,"trapi_version":"1.2","biolink_version":"2.2.3","logs":[{"timestamp":"2023-01-27T02:54:54.923048","level":"INFO","message":"Normalized curie: MONDO:0005737 to UMLS:C0282687","code":null},{"timestamp":"2023-01-27T02:54:55.042431","level":"INFO","message":"Converted category biolink:Disease to biolink:Disease using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:55.042452","level":"INFO","message":"Converted category biolink:Gene to biolink:Gene using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:55.050923","level":"INFO","message":"Converted predicate biolink:decreases_expression_of to biolink:decreases_expression_of using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:55.254680","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:55.255578","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:55.264499","level":"INFO","message":"No results found.","code":null}],"id":"cfc39f7e-5398-422c-a200-e9561ca9dc45","status":"Success","description":null,"workflow":[{"id":"lookup"}]}
        }
        if (qData.url === 'https://automat.transltr.io/pharos/1.3/query') {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/pharos_query.json")))
        }
        if (qData.url === 'https://automat.transltr.io/uberongraph/1.3/query') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:related_to"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
        }
        if (qData.url === 'https://automat.transltr.io/hetio/1.3/query') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:entity_negatively_regulates_entity"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","DISRUPTS","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","DISRUPTS","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","AFFECTS","gngm",1,1])) {
          res = {"max_total":7,"hits":[{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"129653976","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":19683682,"predicate":"AFFECTS","subject":{"name":"PTPRC gene","umls":"C1335285"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"136992331","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":25722412,"predicate":"AFFECTS","subject":{"name":"CCDC6 gene","umls":"C1425774"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"135827604","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":26698106,"predicate":"AFFECTS","subject":{"name":"NPC1"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"144337294","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":17940958,"predicate":"AFFECTS","subject":{"name":"AXL gene","umls":"C0812237"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"147460221-1","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":29717011,"predicate":"AFFECTS","subject":{"name":"Genes","umls":"C0017337"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"147460221-2","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":29717011,"predicate":"AFFECTS","subject":{"name":"EEF1A2"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"194542488","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":34160256,"predicate":"AFFECTS","subject":{"name":"Viral Genome","umls":"C0042720"}}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PREDISPOSES","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","PREDISPOSES","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PRODUCES","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","PRODUCES","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","AUGMENTS","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","AUGMENTS","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PREVENTS","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","PREVENTS","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","TREATS","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","TREATS","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","ASSOCIATED_WITH","gngm",1,1])) {
          res = {"max_total":0,"hits":[{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0751434","CAUSES","gngm",1,1])) {
          res = {"max_total":3,"hits":[{"query":["C0751434","CAUSES","gngm",1,1],"_id":"108764506","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":10495930,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C0751434","CAUSES","gngm",1,1],"_id":"164232103","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":28706611,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C0751434","CAUSES","gngm",1,1],"_id":"164232106","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":28706611,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C4025094","CAUSES","gngm",1,1],"notfound":true}]}
        }
        return { data: res }
      })

      axios.default.post.mockImplementation(async (...q) => {
        const [url, qData] = q
        let res = undefined
        if (arrEquals(qData?.curies, ["MONDO:0005737"])) {
          res = {"MONDO:0005737":{"id":{"identifier":"MONDO:0005737","label":"Ebola hemorrhagic fever"},"equivalent_identifiers":[{"identifier":"MONDO:0005737","label":"Ebola hemorrhagic fever"},{"identifier":"DOID:4325","label":"Ebola hemorrhagic fever"},{"identifier":"ORPHANET:319218"},{"identifier":"UMLS:C0282687","label":"Hemorrhagic Fever, Ebola"},{"identifier":"MESH:D019142","label":"Hemorrhagic Fever, Ebola"},{"identifier":"MEDDRA:10014071"},{"identifier":"MEDDRA:10014072"},{"identifier":"MEDDRA:10014074"},{"identifier":"MEDDRA:10055245"},{"identifier":"NCIT:C36171","label":"Ebola Hemorrhagic Fever"},{"identifier":"SNOMEDCT:37109004"},{"identifier":"ICD10:A98.4"}],"type":["biolink:Disease","biolink:DiseaseOrPhenotypicFeature","biolink:ThingWithTaxon","biolink:BiologicalEntity","biolink:NamedThing","biolink:Entity"],"information_content":100}}
        }
        if (arrEquals(qData?.curies, big_sri_input_3)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/big_sri_query_3.json")))
        }
        if (arrEquals(qData?.umls, ngd_input_2)) {
          res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/api_results/ngd_query_2.json")))
        }
        if (res === undefined) {
          res = (await og_axios.post(...q)).data
        }
        return {data: res}
      })

        await request(app)
            .post("/v1/query")
            .send(disease2gene_query)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("MONDO:0005737");
            })
    })

    test("POST /v1/query with query that doesn't provide input category", async () => {
      axios.default.mockImplementation(async qData => {
        let res = undefined
        if (qData.url === 'https://api.monarchinitiative.org/api/bioentity/disease/MONDO:0019259/genes') {
          res = {"associations":[{"id":"29f0376e-6945-4252-8348-7be7e1562dc3","type":null,"subject":{"taxon":{"id":null,"label":null},"id":"MONDO:0019259","label":"classic phenylketonuria","iri":"http://purl.obolibrary.org/obo/MONDO_0019259","category":["disease"]},"subject_eq":null,"subject_extensions":null,"object":{"taxon":{"id":"NCBITaxon:9606","label":"Homo sapiens"},"id":"HGNC:8582","label":"PAH","iri":"https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:8582","category":["gene"]},"object_eq":null,"object_extensions":null,"relation":{"inverse":true,"id":"RO:0004012","label":"is causal loss of function germline mutation of in","iri":"http://purl.obolibrary.org/obo/RO_0004012","category":null},"slim":null,"negated":false,"qualifiers":null,"evidence_graph":{"nodes":null,"edges":null},"evidence_types":[{"id":"ECO:0000322","label":"imported manually asserted information used in automatic assertion"}],"provided_by":["https://archive.monarchinitiative.org/#orphanet"],"publications":[]}],"compact_associations":null,"objects":null,"numFound":1,"docs":null,"facet_counts":{},"highlighting":null}
        }
        if (qData.url === "https://biothings.ncats.io/semmeddb/query") {
          res = {"max_total":3,"hits":[{"query":["C0751434","CAUSES","gngm",1,1],"_id":"108764506","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":10495930,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C0751434","CAUSES","gngm",1,1],"_id":"164232103","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":28706611,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C0751434","CAUSES","gngm",1,1],"_id":"164232106","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":28706611,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C4025094","CAUSES","gngm",1,1],"notfound":true}]}
        }
        if (qData.url === 'https://automat.transltr.io/uberongraph/1.3/query') {
          res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:related_to"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
        }
        return { data: res }
      })

      axios.default.post.mockImplementation(async (...q) => {
        const [url, qData] = q;
        let res = undefined
        if (arrEquals(qData?.curies, ["UMLS:C0751434"])) {
          res = {"UMLS:C0751434":{"id":{"identifier":"MONDO:0019259","label":"classic phenylketonuria"},"equivalent_identifiers":[{"identifier":"MONDO:0019259","label":"classic phenylketonuria"},{"identifier":"ORPHANET:79254"},{"identifier":"UMLS:C0751434","label":"Classical phenylketonuria"},{"identifier":"UMLS:C4025094","label":"Reduced phenylalanine hydroxylase activity"},{"identifier":"MEDDRA:10034875"},{"identifier":"NCIT:C117117","label":"Classical Phenylketonuria"},{"identifier":"HP:0005982","label":"Reduced phenylalanine hydroxylase level"}],"type":["biolink:Disease","biolink:DiseaseOrPhenotypicFeature","biolink:ThingWithTaxon","biolink:BiologicalEntity","biolink:NamedThing","biolink:Entity"],"information_content":100}}
        }
        if (arrEquals(qData?.curies, ["UMLS:C0751434","HGNC:8582","UMLS:C1418251"])) {
          res = {"UMLS:C0751434":{"id":{"identifier":"MONDO:0019259","label":"classic phenylketonuria"},"equivalent_identifiers":[{"identifier":"MONDO:0019259","label":"classic phenylketonuria"},{"identifier":"ORPHANET:79254"},{"identifier":"UMLS:C0751434","label":"Classical phenylketonuria"},{"identifier":"UMLS:C4025094","label":"Reduced phenylalanine hydroxylase activity"},{"identifier":"MEDDRA:10034875"},{"identifier":"NCIT:C117117","label":"Classical Phenylketonuria"},{"identifier":"HP:0005982","label":"Reduced phenylalanine hydroxylase level"}],"type":["biolink:Disease","biolink:DiseaseOrPhenotypicFeature","biolink:ThingWithTaxon","biolink:BiologicalEntity","biolink:NamedThing","biolink:Entity"],"information_content":100},"HGNC:8582":{"id":{"identifier":"NCBIGene:5053","label":"PAH"},"equivalent_identifiers":[{"identifier":"NCBIGene:5053","label":"PAH"},{"identifier":"ENSEMBL:ENSG00000171759"},{"identifier":"HGNC:8582","label":"PAH"},{"identifier":"OMIM:612349"},{"identifier":"UMLS:C1418251","label":"PAH gene"},{"identifier":"UniProtKB:A0A024RBG4","label":"A0A024RBG4_HUMAN Phe-4-monooxygenase (trembl)"},{"identifier":"UniProtKB:P00439","label":"PH4H_HUMAN Phenylalanine-4-hydroxylase (sprot)"},{"identifier":"PR:P00439","label":"phenylalanine-4-hydroxylase (human)"},{"identifier":"ENSEMBL:ENSP00000448059"}],"type":["biolink:Gene","biolink:GeneOrGeneProduct","biolink:GenomicEntity","biolink:ChemicalEntityOrGeneOrGeneProduct","biolink:PhysicalEssence","biolink:OntologyClass","biolink:BiologicalEntity","biolink:NamedThing","biolink:Entity","biolink:PhysicalEssenceOrOccurrent","biolink:ThingWithTaxon","biolink:MacromolecularMachineMixin","biolink:Protein","biolink:GeneProductMixin","biolink:Polypeptide","biolink:ChemicalEntityOrProteinOrPolypeptide"],"information_content":100},"UMLS:C1418251":{"id":{"identifier":"NCBIGene:5053","label":"PAH"},"equivalent_identifiers":[{"identifier":"NCBIGene:5053","label":"PAH"},{"identifier":"ENSEMBL:ENSG00000171759"},{"identifier":"HGNC:8582","label":"PAH"},{"identifier":"OMIM:612349"},{"identifier":"UMLS:C1418251","label":"PAH gene"},{"identifier":"UniProtKB:A0A024RBG4","label":"A0A024RBG4_HUMAN Phe-4-monooxygenase (trembl)"},{"identifier":"UniProtKB:P00439","label":"PH4H_HUMAN Phenylalanine-4-hydroxylase (sprot)"},{"identifier":"PR:P00439","label":"phenylalanine-4-hydroxylase (human)"},{"identifier":"ENSEMBL:ENSP00000448059"}],"type":["biolink:Gene","biolink:GeneOrGeneProduct","biolink:GenomicEntity","biolink:ChemicalEntityOrGeneOrGeneProduct","biolink:PhysicalEssence","biolink:OntologyClass","biolink:BiologicalEntity","biolink:NamedThing","biolink:Entity","biolink:PhysicalEssenceOrOccurrent","biolink:ThingWithTaxon","biolink:MacromolecularMachineMixin","biolink:Protein","biolink:GeneProductMixin","biolink:Polypeptide","biolink:ChemicalEntityOrProteinOrPolypeptide"],"information_content":100}}
        }

        return {data: res}
      })

        await request(app)
            .post("/v1/query")
            .send(query_without_category)
            .set('Accept', 'application/json')
            // .expect(200)
            // .expect('Content-Type', /json/)
            .then(response => {
                console.log(response);
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toHaveProperty("query_graph");
                expect(response.body.message).toHaveProperty("knowledge_graph");
                expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
                expect(response.body.message.knowledge_graph).toHaveProperty("edges");
                expect(response.body.message.knowledge_graph.nodes).toHaveProperty("NCBIGene:5053");
                expect(response.body.message.knowledge_graph.nodes["NCBIGene:5053"]).toHaveProperty("categories", ["biolink:Gene"]);
            })
    })

    // test("POST /v1/query with query that needs to expand node", async () => {
    //     console.log("expanded node", expand_node);
    //     await request(app)
    //         .post("/v1/query")
    //         .send(expand_node)
    //         .set('Accept', 'application/json')
    //         .expect(200)
    //         .expect('Content-Type', /json/)
    //         .then(response => {
    //             console.log(response.body.message.knowledge_graph);
    //             expect(response.body).toHaveProperty("message");
    //             expect(response.body.message).toHaveProperty("query_graph");
    //             expect(response.body.message).toHaveProperty("knowledge_graph");
    //             expect(response.body.message.knowledge_graph).toHaveProperty("nodes");
    //             expect(response.body.message.knowledge_graph).toHaveProperty("edges");
    //             expect(response.body.message.knowledge_graph.nodes).toHaveProperty("REACT:R-HSA-109582");
    //             expect(response.body.message.knowledge_graph.nodes).toHaveProperty("GO:0000082");
    //         })
    // })

})
