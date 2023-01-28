const app = require("../../src/app");
const request = require('supertest');
const fs = require("fs");
var path = require('path');

const axios = require('axios')
const og_axios = jest.requireActual('axios')
jest.mock('axios')

const arrEquals = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
  if (arr1.length !== arr2.length) return false
  for (var i = 0; i<arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

axios.default.mockImplementation(async (qData) => {
  var res = undefined
  if (qData.url === 'https://mychem.info/v1/query' && qData.data === 'q=A0A024RB10,A0A024RB77,B4DDL9,E7ESI2,G3V5T9,P24941&scopes=drugcentral.bioactivity.uniprot.uniprot_id') {
    res = [{"query":"A0A024RB10","notfound":true},{"query":"A0A024RB77","notfound":true},{"query":"B4DDL9","notfound":true},{"query":"E7ESI2","notfound":true},{"query":"G3V5T9","notfound":true},{"query":"P24941","_id":"XZXHXSATPCNXJR-ZIADKAODSA-N","_score":9.885763,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL502835","CHEMBL3039504"]}}},{"query":"P24941","_id":"BCFGMOOMADDAQU-UHFFFAOYSA-N","_score":9.098851,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL1201179","CHEMBL554"]}}},{"query":"P24941","_id":"MLDQJTXFUGDVEO-UHFFFAOYSA-N","_score":9.098851,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL1336","CHEMBL1200485"]}}},{"query":"P24941","_id":"REFJWTPEDVJJIY-UHFFFAOYSA-N","_score":8.601126,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":"CHEMBL50"}}},{"query":"P24941","_id":"AHJRHEGDXFFMBM-UHFFFAOYSA-N","_score":8.601126,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":["CHEMBL189963","CHEMBL2364621"]}}},{"query":"P24941","_id":"VERWOWGGCGHDQE-UHFFFAOYSA-N","_score":8.601126,"drugcentral":{"_license":"http://bit.ly/2SeEhUy","xrefs":{"chembl_id":"CHEMBL2403108"}}}];
  }
  if (qData.url === 'https://automat.transltr.io/ctd/1.3/query') {
    res = {"message":{"query_graph":{"nodes":{"n0":{"ids":["NCBIGene:1017"],"categories":["biolink:Gene"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:SmallMolecule"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:decreases_molecular_interaction"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }
  if (qData.url === 'https://biothings.ncats.io/bindingdb/query' && qData.data === 'q=A0A024RB10,A0A024RB77,B4DDL9,E7ESI2,G3V5T9,P24941&scopes=subject.uniprot.accession') {
    res = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data/api_results/bindingdb_query_0.json")))
  }
  if (qData.url === 'https://biothings.ncats.io/bindingdb/query' && qData.data === 'q=A0A024RB10,A0A024RB77,B4DDL9,E7ESI2,G3V5T9,P24941&scopes=subject.uniprot.accession' && qData.params?.from) {
    res = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../data/api_results/bindingdb_query_${qData.params.from}.json`)))
  }
  if (qData.url === 'https://mygene.info/v3/query' && qData.data === 'q=MONDO:0005737&scopes=clingen.clinical_validity.mondo') {
    res = [{"query":"MONDO:0005737","notfound":true}]
  }
  if (qData.url === 'https://myvariant.info/v1/query' && qData.data === 'q=DOID:4325&scopes=civic.evidence_items.disease.doid') {
    res = {"max_total":0,"hits":[{"query":["C0282687","PART_OF","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === 'https://biothings.ncats.io/pfocr/query' && qData.data === 'q=D019142&scopes=associatedWith.mentions.diseases.mesh') {
    res = {"max_total":1,"hits":[{"query":"D019142","_id":"PMC7725765__fpubh-08-596944-g0001.jpg","_score":10.558324,"associatedWith":{"figureUrl":"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7725765/bin/fpubh-08-596944-g0001.jpg","mentions":{"genes":{"ncbigene":["6301"]}},"pmc":"PMC7725765","title":"Pathway diagram for pathogen spill-over to humans from animals describes three distinct processes"}}]}
  }
  if (qData.url === 'https://api.monarchinitiative.org/api/bioentity/disease/MONDO:0005737/genes') {
    res = {"associations":[],"compact_associations":null,"objects":null,"numFound":0,"docs":null,"facet_counts":{},"highlighting":null}
  }
  if (qData.url === 'https://biothings.ncats.io/DISEASES/query' && qData.data === 'q=DOID:4325&scopes=DISEASES.doid') {
    res = {"max_total":1,"hits":[{"query":"DOID:4325","DISEASES":{"_license":"https://creativecommons.org/licenses/by/3.0/","associatedWith":[{"category":"textmining","confidence":1.868,"ensembl":"ENSP00000011653","zscore":3.737},{"category":"textmining","confidence":1.661,"ensembl":"ENSP00000215743","zscore":3.322},{"category":"textmining","confidence":3.036,"ensembl":"ENSP00000216044","zscore":6.071},{"category":"textmining","confidence":1.702,"ensembl":"ENSP00000225831","zscore":3.404},{"category":"textmining","confidence":2.225,"ensembl":"ENSP00000233121","zscore":4.45},{"category":"textmining","confidence":1.776,"ensembl":"ENSP00000252593","zscore":3.553},{"category":"textmining","confidence":1.573,"ensembl":"ENSP00000263341","zscore":3.145},{"category":"textmining","confidence":1.613,"ensembl":"ENSP00000263642","zscore":3.226},{"category":"textmining","confidence":2.51,"ensembl":"ENSP00000269228","zscore":5.02},{"category":"textmining","confidence":1.977,"ensembl":"ENSP00000276927","zscore":3.955},{"category":"textmining","confidence":1.597,"ensembl":"ENSP00000295897","zscore":3.194},{"category":"textmining","confidence":1.946,"ensembl":"ENSP00000297977","zscore":3.891},{"category":"textmining","confidence":1.854,"ensembl":"ENSP00000305651","zscore":3.709},{"category":"textmining","confidence":1.61,"ensembl":"ENSP00000306512","zscore":3.221},{"category":"textmining","confidence":1.536,"ensembl":"ENSP00000316228","zscore":3.072},{"category":"textmining","confidence":1.984,"ensembl":"ENSP00000334145","zscore":3.967},{"category":"textmining","confidence":1.696,"ensembl":"ENSP00000343701","zscore":3.391},{"category":"textmining","confidence":1.685,"ensembl":"ENSP00000345344","zscore":3.37},{"category":"textmining","confidence":1.561,"ensembl":"ENSP00000345672","zscore":3.122},{"category":"textmining","confidence":1.918,"ensembl":"ENSP00000347298","zscore":3.837},{"category":"textmining","confidence":1.749,"ensembl":"ENSP00000354394","zscore":3.499},{"category":"textmining","confidence":1.839,"ensembl":"ENSP00000357552","zscore":3.678},{"category":"textmining","confidence":1.626,"ensembl":"ENSP00000360891","zscore":3.251},{"category":"textmining","confidence":1.669,"ensembl":"ENSP00000366307","zscore":3.337},{"category":"textmining","confidence":1.674,"ensembl":"ENSP00000368699","zscore":3.347},{"category":"textmining","confidence":1.807,"ensembl":"ENSP00000369213","zscore":3.614},{"category":"textmining","confidence":1.885,"ensembl":"ENSP00000369581","zscore":3.769},{"category":"textmining","confidence":2.861,"ensembl":"ENSP00000370767","zscore":5.721},{"category":"textmining","confidence":1.653,"ensembl":"ENSP00000378408","zscore":3.306},{"category":"textmining","confidence":1.669,"ensembl":"ENSP00000380697","zscore":3.339},{"category":"textmining","confidence":1.722,"ensembl":"ENSP00000385675","zscore":3.443},{"category":"textmining","confidence":2.029,"ensembl":"ENSP00000386559","zscore":4.058},{"category":"textmining","confidence":1.507,"ensembl":"ENSP00000389326","zscore":3.013},{"category":"textmining","confidence":1.645,"ensembl":"ENSP00000398698","zscore":3.289},{"category":"textmining","confidence":1.719,"ensembl":"ENSP00000412237","zscore":3.439},{"category":"textmining","confidence":2.111,"ensembl":"ENSP00000419945","zscore":4.223},{"category":"textmining","confidence":1.83,"ensembl":"ENSP00000471896","zscore":3.661},{"category":"textmining","confidence":1.564,"ensembl":"ENSP00000474412","zscore":3.128},{"category":"textmining","confidence":1.775,"ensembl":"ENSP00000477908","zscore":3.55},{"category":"textmining","confidence":1.929,"ensembl":"ENSP00000482259","zscore":3.859},{"category":"textmining","confidence":1.925,"ensembl":"ENSP00000483552","zscore":3.85},{"category":"textmining","confidence":1.987,"ensembl":"ENSP00000483609","zscore":3.974}]},"_id":"DOID:4325","_score":8.243457}]}
  } 
  if (qData.url === 'https://biothings.ncats.io/mgigene2phenotype/query' && qData.data === 'q=DOID:4325&scopes=mgi.associated_with_disease.doid') {
    res = {"max_total":0,"hits":[{"query":"DOID:4325","notfound":true}]}
  }
  if (qData.url === 'https://biothings.ncats.io/biggim_drugresponse_kp/query') {
    res={"max_total":0,"hits":[{"query":["MONDO:0005737","biolink:has_biomarker"],"notfound":true}]}
  }

  if (qData.url === 'https://automat.transltr.io/biolink/1.3/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:contribution_from"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }

  if (qData.url === 'https://automat.transltr.io/biolink/1.3/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:phenotype_of"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }

  if (qData.url === 'https://automat.transltr.io/biolink/1.3/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:has_biomarker"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }

  if (qData.url === 'https://automat.transltr.io/pharos/1.3/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:genetic_association"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{"NCBIGene:9567":{"categories":["biolink:Gene","biolink:GeneOrGeneProduct","biolink:NamedThing","biolink:Entity","biolink:BiologicalEntity","biolink:MacromolecularMachineMixin"],"name":"GTPBP1","attributes":[{"attribute_type_id":"biolink:same_as","value":["NCBIGene:9567","ENSEMBL:ENSG00000100226","HGNC:4669","OMIM:602245","UMLS:C1415351"],"value_type_id":"metatype:uriorcurie","original_attribute_name":"equivalent_identifiers","value_url":null,"attribute_source":null,"description":null,"attributes":null}]},"MONDO:0005737":{"categories":["biolink:DiseaseOrPhenotypicFeature","biolink:Disease","biolink:NamedThing","biolink:Entity","biolink:BiologicalEntity","biolink:ThingWithTaxon"],"name":"Ebola hemorrhagic fever","attributes":[{"attribute_type_id":"biolink:same_as","value":["MONDO:0005737","DOID:4325","ORPHANET:319218","EFO:0007243","UMLS:C0282687","MESH:D019142","MEDDRA:10014071","MEDDRA:10014072","MEDDRA:10014074","MEDDRA:10055245","NCIT:C36171","SNOMEDCT:123323003","SNOMEDCT:37109004","ICD10:A98.4"],"value_type_id":"metatype:uriorcurie","original_attribute_name":"equivalent_identifiers","value_url":null,"attribute_source":null,"description":null,"attributes":null}]}},"edges":{"660870":{"subject":"NCBIGene:9567","object":"MONDO:0005737","predicate":"biolink:genetic_association","qualifiers":null,"attributes":[{"attribute_type_id":"biolink:aggregator_knowledge_source","value":["infores:automat-pharos"],"value_type_id":"biolink:InformationResource","original_attribute_name":"biolink:aggregator_knowledge_source","value_url":null,"attribute_source":"infores:automat-pharos","description":null,"attributes":null},{"attribute_type_id":"biolink:relation","value":"WIKIDATA_PROPERTY:P2293","value_type_id":"EDAM:data_0006","original_attribute_name":"relation","value_url":null,"attribute_source":null,"description":null,"attributes":null},{"attribute_type_id":"biolink:aggregator_knowledge_source","value":["infores:pharos"],"value_type_id":"biolink:InformationResource","original_attribute_name":"biolink:aggregator_knowledge_source","value_url":null,"attribute_source":"infores:automat-pharos","description":null,"attributes":null},{"attribute_type_id":"biolink:publications","value":[],"value_type_id":"EDAM:data_0006","original_attribute_name":"publications","value_url":null,"attribute_source":null,"description":null,"attributes":null},{"attribute_type_id":"biolink:primary_knowledge_source","value":["JensenLab Text Mining"],"value_type_id":"biolink:InformationResource","original_attribute_name":"biolink:primary_knowledge_source","value_url":null,"attribute_source":"infores:automat-pharos","description":null,"attributes":null},{"attribute_type_id":"biolink:Attribute","value":0,"value_type_id":"EDAM:data_0006","original_attribute_name":"affinity","value_url":null,"attribute_source":null,"description":null,"attributes":null}]}}},"results":[{"node_bindings":{"n0":[{"id":"MONDO:0005737","query_id":null,"attributes":null,"qnode_id":"MONDO:0005737"}],"n1":[{"id":"NCBIGene:9567","query_id":null,"attributes":null}]},"edge_bindings":{"e01":[{"id":"660870","attributes":null}]},"score":null}]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }

  if (qData.url === 'https://automat.transltr.io/uberongraph/1.3/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:related_to"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }


  if (qData.url === 'https://automat.transltr.io/hetio/1.3/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"is_set":false,"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"is_set":false,"constraints":[]}},"edges":{"e01":{"subject":"n0","object":"n1","knowledge_type":null,"predicates":["biolink:entity_negatively_regulates_entity"],"attribute_constraints":[],"qualifier_constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"log_level":null,"workflow":[{"runner_parameters":null,"id":"lookup","parameters":null}],"submitter":"infores:bte"}
  }


  if (qData.url === 'https://api.monarchinitiative.org/api/bioentity/disease/MONDO:0005737/genes') {
    res={"associations":[],"compact_associations":null,"objects":null,"numFound":0,"docs":null,"facet_counts":{},"highlighting":null}
  }

  if (qData.url === 'https://biothings.ncats.io/text_mining_targeted_association/query') {
    res=JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../data/api_results/textmining_query.json")))
  }

  if (qData.url === 'https://myvariant.info/v1/query' && qData.data === 'q=DOID:4325&scopes=docm.doid') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"constraints":[]}},"edges":{"e01":{"predicates":["biolink:increases_expression_of"],"subject":"n0","object":"n1","constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"max_results":10,"trapi_version":"1.2","biolink_version":"2.2.3","logs":[{"timestamp":"2023-01-27T02:54:54.360512","level":"INFO","message":"Normalized curie: MONDO:0005737 to UMLS:C0282687","code":null},{"timestamp":"2023-01-27T02:54:54.490870","level":"INFO","message":"Converted category biolink:Disease to biolink:Disease using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:54.490891","level":"INFO","message":"Converted category biolink:Gene to biolink:Gene using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:54.499238","level":"INFO","message":"Converted predicate biolink:increases_expression_of to biolink:increases_expression_of using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:54.697830","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:54.698874","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:54.708116","level":"INFO","message":"No results found.","code":null}],"id":"5a9c6638-3a5c-44f6-b368-046caa28fa10","status":"Success","description":null,"workflow":[{"id":"lookup"}]}
  }

  if (qData.url === 'https://chp-api.transltr.io/query') {
    res={"message":{"query_graph":{"nodes":{"n0":{"ids":["MONDO:0005737"],"categories":["biolink:Disease"],"constraints":[]},"n1":{"ids":null,"categories":["biolink:Gene"],"constraints":[]}},"edges":{"e01":{"predicates":["biolink:decreases_expression_of"],"subject":"n0","object":"n1","constraints":[]}}},"knowledge_graph":{"nodes":{},"edges":{}},"results":[]},"max_results":10,"trapi_version":"1.2","biolink_version":"2.2.3","logs":[{"timestamp":"2023-01-27T02:54:54.923048","level":"INFO","message":"Normalized curie: MONDO:0005737 to UMLS:C0282687","code":null},{"timestamp":"2023-01-27T02:54:55.042431","level":"INFO","message":"Converted category biolink:Disease to biolink:Disease using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:55.042452","level":"INFO","message":"Converted category biolink:Gene to biolink:Gene using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:55.050923","level":"INFO","message":"Converted predicate biolink:decreases_expression_of to biolink:decreases_expression_of using Biolink semantic operations.","code":null},{"timestamp":"2023-01-27T02:54:55.254680","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:55.255578","level":"INFO","message":"Disease with curie UMLS:C0282687 does not exist in the database.","code":null},{"timestamp":"2023-01-27T02:54:55.264499","level":"INFO","message":"No results found.","code":null}],"id":"cfc39f7e-5398-422c-a200-e9561ca9dc45","status":"Success","description":null,"workflow":[{"id":"lookup"}]}
  }

  if (qData.url === 'https://api.monarchinitiative.org/api/bioentity/disease/MONDO:0019259/genes') {
    res={"associations":[{"id":"29f0376e-6945-4252-8348-7be7e1562dc3","type":null,"subject":{"taxon":{"id":null,"label":null},"id":"MONDO:0019259","label":"classic phenylketonuria","iri":"http://purl.obolibrary.org/obo/MONDO_0019259","category":["disease"]},"subject_eq":null,"subject_extensions":null,"object":{"taxon":{"id":"NCBITaxon:9606","label":"Homo sapiens"},"id":"HGNC:8582","label":"PAH","iri":"https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:8582","category":["gene"]},"object_eq":null,"object_extensions":null,"relation":{"inverse":true,"id":"RO:0004012","label":"is causal loss of function germline mutation of in","iri":"http://purl.obolibrary.org/obo/RO_0004012","category":null},"slim":null,"negated":false,"qualifiers":null,"evidence_graph":{"nodes":null,"edges":null},"evidence_types":[{"id":"ECO:0000322","label":"imported manually asserted information used in automatic assertion"}],"provided_by":["https://archive.monarchinitiative.org/#orphanet"],"publications":[]}],"compact_associations":null,"objects":null,"numFound":1,"docs":null,"facet_counts":{},"highlighting":null}
  }
  if (qData.url === "https://mychem.info/v1/query" && arrEquals(qData.data?.q, ["CHEMBL502835","CHEMBL3039504","CHEMBL1201179","CHEMBL554","CHEMBL1336","CHEMBL1200485","CHEMBL50","CHEMBL189963","CHEMBL2364621","CHEMBL2403108"])) {
    res=JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/api_results/mychem_query_2.json')))
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","CAUSES","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","CAUSES","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PART_OF","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","PART_OF","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","ASSOCIATED_WITH","gngm",1,1])) {
    res={"max_total":8,"hits":[{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"118612906","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":11752702,"predicate":"ASSOCIATED_WITH","subject":{"name":"Genetic Structures","umls":"C1136352"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"142375549","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":26376249,"predicate":"ASSOCIATED_WITH","subject":{"name":"TIE1 gene","umls":"C1539965"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"185194271","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":32161708,"predicate":"ASSOCIATED_WITH","subject":{"name":"IMPACT gene","umls":"C1825598"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"149589561","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":20878400,"predicate":"ASSOCIATED_WITH","subject":{"name":"KIR2DS1"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"149589562","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":20878400,"predicate":"ASSOCIATED_WITH","subject":{"name":"KIR2DS3"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"144337438","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":17940958,"predicate":"ASSOCIATED_WITH","subject":{"name":"AXL gene","umls":"C0812237"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"187446981","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":32625555,"predicate":"ASSOCIATED_WITH","subject":{"name":"IMPACT gene","umls":"C1825598"}},{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"_id":"194568803","_score":19.9111,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":34166464,"predicate":"ASSOCIATED_WITH","subject":{"name":"STAT3 gene","umls":"C1367307"}}]}
  }
  if (qData.url === "https://mydisease.info/v1/query" && qData.data === "q=C0282687&scopes=disgenet.xrefs.umls") {
    res=JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/api_results/mydisease_query.json')))
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","DISRUPTS","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","DISRUPTS","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","AFFECTS","gngm",1,1])) {
    res={"max_total":7,"hits":[{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"129653976","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":19683682,"predicate":"AFFECTS","subject":{"name":"PTPRC gene","umls":"C1335285"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"136992331","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":25722412,"predicate":"AFFECTS","subject":{"name":"CCDC6 gene","umls":"C1425774"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"135827604","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":26698106,"predicate":"AFFECTS","subject":{"name":"NPC1"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"144337294","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":17940958,"predicate":"AFFECTS","subject":{"name":"AXL gene","umls":"C0812237"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"147460221-1","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":29717011,"predicate":"AFFECTS","subject":{"name":"Genes","umls":"C0017337"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"147460221-2","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":29717011,"predicate":"AFFECTS","subject":{"name":"EEF1A2"}},{"query":["C0282687","AFFECTS","gngm",1,1],"_id":"194542488","_score":19.361662,"object":{"name":"Hemorrhagic Fever, Ebola","umls":"C0282687"},"pmid":34160256,"predicate":"AFFECTS","subject":{"name":"Viral Genome","umls":"C0042720"}}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PREDISPOSES","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","PREDISPOSES","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PRODUCES","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","PRODUCES","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","AUGMENTS","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","AUGMENTS","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","PREVENTS","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","PREVENTS","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","TREATS","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","TREATS","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0282687","ASSOCIATED_WITH","gngm",1,1])) {
    res={"max_total":0,"hits":[{"query":["C0282687","ASSOCIATED_WITH","gngm",1,1],"notfound":true}]}
  }
  if (qData.url === "https://biothings.ncats.io/semmeddb/query" && arrEquals(qData.data?.q?.[0], ["C0751434","CAUSES","gngm",1,1])) {
    res={"max_total":3,"hits":[{"query":["C0751434","CAUSES","gngm",1,1],"_id":"108764506","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":10495930,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C0751434","CAUSES","gngm",1,1],"_id":"164232103","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":28706611,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C0751434","CAUSES","gngm",1,1],"_id":"164232106","_score":20.859911,"object":{"name":"Classical phenylketonuria","umls":"C0751434"},"pmid":28706611,"predicate":"CAUSES","subject":{"name":"PAH gene","umls":"C1418251"}},{"query":["C4025094","CAUSES","gngm",1,1],"notfound":true}]}
  }

  if (res === undefined) {
    res = (await og_axios.default(qData)).data
    console.log("NEW RES", JSON.stringify(qData), "BRUH", JSON.stringify(res))
  }

  return {data: res}
})

axios.default.post.mockImplementation(async (...q) => {
  const res = await og_axios.default.post(...q)
  // console.log("OMG NEW POST SHEESH")
  // console.log(q[0])
  // console.log("OMG NEW POST #2")
  // console.log(JSON.stringify(res.data))
  return res
})


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
        await request(app)
            .post("/v1/query")
            .send(gene2chemical_query)
            .set('Accept', 'application/json')
            // .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                console.log(response.body)
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
                console.log(request.body)
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
        await request(app)
            .post("/v1/query")
            .send(query_without_category)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
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
