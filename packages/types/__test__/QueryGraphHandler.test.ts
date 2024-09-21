jest.mock('axios');
import axios from 'axios';

import QueryGraphHandler from '../src/query_graph';
import QNode2 from '../src/query_node';
import QEdge from '../src/query_edge';
import { InvalidQueryGraphError } from '../src/exceptions';

describe('Testing QueryGraphHandler Module', () => {
  const disease_entity_node = {
    categories: ['biolink:Disease'],
    ids: ['MONDO:0005737'],
  };
  const gene_entity_node = {
    categories: ['biolink:Gene'],
    ids: ['NCBIGene:1017'],
  };
  const gene_class_node = {
    categories: ['biolink:Gene'],
  };
  const chemical_class_node = {
    categories: ['biolink:SmallMolecule'],
  };
  const pathway_class_node = {
    categories: ['biolink:Pathways'],
  };
  const phenotype_class_node = {
    categories: ['biolink:Phenotype'],
  };
  const OneHopQuery = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
    },
  };

  const ThreeHopExplainQuery = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
      n2: chemical_class_node,
      n3: gene_entity_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
      e02: {
        subject: 'n1',
        object: 'n2',
      },
      e03: {
        subject: 'n2',
        object: 'n3',
      },
    },
  };

  const FourHopQuery = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
      n2: chemical_class_node,
      n3: phenotype_class_node,
      n4: pathway_class_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
      e02: {
        subject: 'n1',
        object: 'n2',
      },
      e03: {
        subject: 'n2',
        object: 'n3',
      },
      e04: {
        subject: 'n3',
        object: 'n4',
      },
    },
  };

  const QueryWithCycle1 = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
      n2: chemical_class_node,
      n3: phenotype_class_node,
      n4: pathway_class_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
      e02: {
        subject: 'n1',
        object: 'n2',
      },
      e03: {
        subject: 'n2',
        object: 'n3',
      },
      e04: {
        subject: 'n3',
        object: 'n4',
      },
      e05: {
        subject: 'n4',
        object: 'n1',
      },
    },
  };

  const QueryWithCycle2 = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
      n2: chemical_class_node,
      n3: phenotype_class_node,
      n4: pathway_class_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
      e02: {
        subject: 'n1',
        object: 'n2',
      },
      e03: {
        subject: 'n2',
        object: 'n3',
      },
      e04: {
        subject: 'n3',
        object: 'n4',
      },
      e05: {
        subject: 'n4',
        object: 'n1',
      },
    },
  };

  const QueryWithDuplicateEdge1 = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
      e02: {
        subject: 'n1',
        object: 'n0',
      },
    },
  };

  const QueryWithNullValues = {
    nodes: {
      n0: {
        ...disease_entity_node,
        categories: null,
      },
      n1: {
        ...gene_class_node,
        ids: null,
      },
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
    },
  };

  const QueryWithNullPredicate = {
    nodes: {
      n0: disease_entity_node,
      n1: gene_class_node,
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
        predicate: null,
      },
    },
  };

  const QueryWithNullIds = {
    nodes: {
      n0: {
        ...disease_entity_node,
        ids: [],
      },
      n1: {
        ...gene_class_node,
        ids: null,
      },
    },
    edges: {
      e01: {
        subject: 'n0',
        object: 'n1',
      },
    },
  };

  describe('test _storeNodes function', () => {
    test('test if storeNodes with one hop query', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          'MONDO:0005737': {
            id: { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
            equivalent_identifiers: [
              { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
              { identifier: 'DOID:4325', label: 'Ebola hemorrhagic fever' },
              { identifier: 'ORPHANET:319218' },
              { identifier: 'UMLS:C0282687', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MESH:D019142', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MEDDRA:10014071' },
              { identifier: 'MEDDRA:10014072' },
              { identifier: 'MEDDRA:10014074' },
              { identifier: 'MEDDRA:10055245' },
              { identifier: 'NCIT:C36171', label: 'Ebola Hemorrhagic Fever' },
              { identifier: 'SNOMEDCT:37109004' },
              { identifier: 'ICD10:A98.4' },
            ],
            type: [
              'biolink:Disease',
              'biolink:DiseaseOrPhenotypicFeature',
              'biolink:ThingWithTaxon',
              'biolink:BiologicalEntity',
              'biolink:NamedThing',
              'biolink:Entity',
            ],
            information_content: 100,
          },
        },
      });
      const handler = new QueryGraphHandler(OneHopQuery, undefined);
      //@ts-expect-error: explicitly testing private method
      const nodes = await handler._storeNodes();
      expect(nodes).toHaveProperty('n0');
      expect(nodes).not.toHaveProperty('n2');
      expect(nodes.n0).toBeInstanceOf(QNode2);
    });

    test('test if storeNodes with multi hop query', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          'MONDO:0005737': {
            id: { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
            equivalent_identifiers: [
              { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
              { identifier: 'DOID:4325', label: 'Ebola hemorrhagic fever' },
              { identifier: 'ORPHANET:319218' },
              { identifier: 'UMLS:C0282687', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MESH:D019142', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MEDDRA:10014071' },
              { identifier: 'MEDDRA:10014072' },
              { identifier: 'MEDDRA:10014074' },
              { identifier: 'MEDDRA:10055245' },
              { identifier: 'NCIT:C36171', label: 'Ebola Hemorrhagic Fever' },
              { identifier: 'SNOMEDCT:37109004' },
              { identifier: 'ICD10:A98.4' },
            ],
            type: [
              'biolink:Disease',
              'biolink:DiseaseOrPhenotypicFeature',
              'biolink:ThingWithTaxon',
              'biolink:BiologicalEntity',
              'biolink:NamedThing',
              'biolink:Entity',
            ],
            information_content: 100,
          },
        },
      });
      const handler = new QueryGraphHandler(FourHopQuery, undefined);
      //@ts-expect-error: explicitly testing private method
      const nodes = await handler._storeNodes();
      expect(nodes).toHaveProperty('n0');
      expect(nodes).toHaveProperty('n3');
      expect(nodes.n0).toBeInstanceOf(QNode2);
      expect(nodes.n3).toBeInstanceOf(QNode2);
    });
  });

  describe('test calculateEdges function', () => {
    test('test storeEdges with one hop query', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          'MONDO:0005737': {
            id: { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
            equivalent_identifiers: [
              { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
              { identifier: 'DOID:4325', label: 'Ebola hemorrhagic fever' },
              { identifier: 'ORPHANET:319218' },
              { identifier: 'UMLS:C0282687', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MESH:D019142', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MEDDRA:10014071' },
              { identifier: 'MEDDRA:10014072' },
              { identifier: 'MEDDRA:10014074' },
              { identifier: 'MEDDRA:10055245' },
              { identifier: 'NCIT:C36171', label: 'Ebola Hemorrhagic Fever' },
              { identifier: 'SNOMEDCT:37109004' },
              { identifier: 'ICD10:A98.4' },
            ],
            type: [
              'biolink:Disease',
              'biolink:DiseaseOrPhenotypicFeature',
              'biolink:ThingWithTaxon',
              'biolink:BiologicalEntity',
              'biolink:NamedThing',
              'biolink:Entity',
            ],
            information_content: 100,
          },
        },
      });
      const handler = new QueryGraphHandler(OneHopQuery, undefined);
      await handler.calculateEdges();
      expect(handler.edges).toHaveProperty('e01');
      expect(handler.edges).not.toHaveProperty('e02');
      expect(handler.edges.e01).toBeInstanceOf(QEdge);
      expect(handler.edges.e01.getInputNode()).toBeInstanceOf(QNode2);
    });
  });

  describe('test _createQueryPaths function', () => {
    test('test createQueryPaths with three hop explain query', async () => {
      (axios.post as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            'MONDO:0005737': {
              id: { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
              equivalent_identifiers: [
                { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
                { identifier: 'DOID:4325', label: 'Ebola hemorrhagic fever' },
                { identifier: 'ORPHANET:319218' },
                { identifier: 'UMLS:C0282687', label: 'Hemorrhagic Fever, Ebola' },
                { identifier: 'MESH:D019142', label: 'Hemorrhagic Fever, Ebola' },
                { identifier: 'MEDDRA:10014071' },
                { identifier: 'MEDDRA:10014072' },
                { identifier: 'MEDDRA:10014074' },
                { identifier: 'MEDDRA:10055245' },
                { identifier: 'NCIT:C36171', label: 'Ebola Hemorrhagic Fever' },
                { identifier: 'SNOMEDCT:37109004' },
                { identifier: 'ICD10:A98.4' },
              ],
              type: [
                'biolink:Disease',
                'biolink:DiseaseOrPhenotypicFeature',
                'biolink:ThingWithTaxon',
                'biolink:BiologicalEntity',
                'biolink:NamedThing',
                'biolink:Entity',
              ],
              information_content: 100,
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            'NCBIGene:1017': {
              id: { identifier: 'NCBIGene:1017', label: 'CDK2' },
              equivalent_identifiers: [
                { identifier: 'NCBIGene:1017', label: 'CDK2' },
                { identifier: 'ENSEMBL:ENSG00000123374' },
                { identifier: 'HGNC:1771', label: 'CDK2' },
                { identifier: 'OMIM:116953' },
                { identifier: 'UMLS:C1332733', label: 'CDK2 gene' },
                {
                  identifier: 'UniProtKB:A0A024RB10',
                  label: 'A0A024RB10_HUMAN Cyclin-dependent kinase 2, isoform CRA_a (trembl)',
                },
                {
                  identifier: 'UniProtKB:A0A024RB77',
                  label: 'A0A024RB77_HUMAN Cyclin-dependent kinase 2, isoform CRA_b (trembl)',
                },
                {
                  identifier: 'UniProtKB:B4DDL9',
                  label:
                    'B4DDL9_HUMAN cDNA FLJ54979, highly similar to Homo sapiens cyclin-dependent kinase 2 (CDK2), transcript variant 2, mRNA (trembl)',
                },
                { identifier: 'UniProtKB:E7ESI2', label: 'E7ESI2_HUMAN Cyclin-dependent kinase 2 (trembl)' },
                { identifier: 'ENSEMBL:ENSP00000393605' },
                { identifier: 'UniProtKB:G3V5T9', label: 'G3V5T9_HUMAN Cyclin-dependent kinase 2 (trembl)' },
                { identifier: 'ENSEMBL:ENSP00000452514' },
                { identifier: 'UniProtKB:P24941', label: 'CDK2_HUMAN Cyclin-dependent kinase 2 (sprot)' },
                { identifier: 'PR:P24941', label: 'cyclin-dependent kinase 2 (human)' },
                { identifier: 'UMLS:C0108855', label: 'CDK2 protein, human' },
              ],
              type: [
                'biolink:Gene',
                'biolink:GeneOrGeneProduct',
                'biolink:GenomicEntity',
                'biolink:ChemicalEntityOrGeneOrGeneProduct',
                'biolink:PhysicalEssence',
                'biolink:OntologyClass',
                'biolink:BiologicalEntity',
                'biolink:NamedThing',
                'biolink:Entity',
                'biolink:PhysicalEssenceOrOccurrent',
                'biolink:ThingWithTaxon',
                'biolink:MacromolecularMachineMixin',
                'biolink:Protein',
                'biolink:GeneProductMixin',
                'biolink:Polypeptide',
                'biolink:ChemicalEntityOrProteinOrPolypeptide',
              ],
              information_content: 100,
            },
          },
        });
      const handler = new QueryGraphHandler(ThreeHopExplainQuery, undefined);
      const edges = await handler.calculateEdges();
      expect(Object.keys(edges)).toHaveLength(3);
    });
  });
  describe('test cycle/duplicate edge detection for query graphs', () => {
    test('Duplicate Edge Graph #1', async () => {
      const handler = new QueryGraphHandler(QueryWithDuplicateEdge1, undefined);
      await expect(handler.calculateEdges()).rejects.toThrow(InvalidQueryGraphError);
    });
    test('Query Graph Cycle #1', async () => {
      const handler = new QueryGraphHandler(QueryWithCycle1, undefined);
      await expect(handler.calculateEdges()).rejects.toThrow(InvalidQueryGraphError);
    });
    test('Query Graph Cycle #2', async () => {
      const handler = new QueryGraphHandler(QueryWithCycle2, undefined);
      await expect(handler.calculateEdges()).rejects.toThrow(InvalidQueryGraphError);
    });
  });

  describe('test chandling of null ids / categories / predicates', () => {
    test('Null id/categories graph', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          'MONDO:0005737': {
            id: { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
            equivalent_identifiers: [
              { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
              { identifier: 'DOID:4325', label: 'Ebola hemorrhagic fever' },
              { identifier: 'ORPHANET:319218' },
              { identifier: 'UMLS:C0282687', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MESH:D019142', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MEDDRA:10014071' },
              { identifier: 'MEDDRA:10014072' },
              { identifier: 'MEDDRA:10014074' },
              { identifier: 'MEDDRA:10055245' },
              { identifier: 'NCIT:C36171', label: 'Ebola Hemorrhagic Fever' },
              { identifier: 'SNOMEDCT:37109004' },
              { identifier: 'ICD10:A98.4' },
            ],
            type: [
              'biolink:Disease',
              'biolink:DiseaseOrPhenotypicFeature',
              'biolink:ThingWithTaxon',
              'biolink:BiologicalEntity',
              'biolink:NamedThing',
              'biolink:Entity',
            ],
            information_content: 100,
          },
        },
      });
      const handler = new QueryGraphHandler(QueryWithNullValues, undefined);
      await expect(handler.calculateEdges()).resolves.not.toThrow();
    });
    test('Null predicate graph', async () => {
      (axios.post as jest.Mock).mockResolvedValueOnce({
        data: {
          'MONDO:0005737': {
            id: { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
            equivalent_identifiers: [
              { identifier: 'MONDO:0005737', label: 'Ebola hemorrhagic fever' },
              { identifier: 'DOID:4325', label: 'Ebola hemorrhagic fever' },
              { identifier: 'ORPHANET:319218' },
              { identifier: 'UMLS:C0282687', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MESH:D019142', label: 'Hemorrhagic Fever, Ebola' },
              { identifier: 'MEDDRA:10014071' },
              { identifier: 'MEDDRA:10014072' },
              { identifier: 'MEDDRA:10014074' },
              { identifier: 'MEDDRA:10055245' },
              { identifier: 'NCIT:C36171', label: 'Ebola Hemorrhagic Fever' },
              { identifier: 'SNOMEDCT:37109004' },
              { identifier: 'ICD10:A98.4' },
            ],
            type: [
              'biolink:Disease',
              'biolink:DiseaseOrPhenotypicFeature',
              'biolink:ThingWithTaxon',
              'biolink:BiologicalEntity',
              'biolink:NamedThing',
              'biolink:Entity',
            ],
            information_content: 100,
          },
        },
      });
      const handler = new QueryGraphHandler(QueryWithNullPredicate, undefined);
      const edges = await handler.calculateEdges();
      // if this is undefined (not null) then smartapi-kg treats as if the field doesn't exist (desired behavior)
      expect(edges[0].getPredicate()).toBe(undefined);
    });
    test('Graph without any ids', async () => {
      const handler = new QueryGraphHandler(QueryWithNullIds, undefined);
      expect(handler.calculateEdges()).rejects.toThrow(InvalidQueryGraphError);
    });
  });
});
