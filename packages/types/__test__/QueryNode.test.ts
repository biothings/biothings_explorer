import { SRIBioEntity } from 'biomedical_id_resolver/built/common/types';
import QNode from '../src/query_node';

describe('Testing QueryNode Module', () => {
  const node1_equivalent_ids = {
    'NCBIGene:1017': {
      primaryID: 'NCBIGene:1017',
      equivalentIDs: ['NCBIGene:1017'],
      label: 'CDK2',
      labelAliases: ['CDK2'],
      primaryTypes: ['Gene'],
      semanticTypes: ['Gene'],
      db_ids: {
        NCBIGene: ['1017'],
        SYMBOL: ['CDK2'],
      },
    },
  };

  describe('Testing hasInput function', () => {
    test('test node without curies specified should return false', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      const res = gene_node.hasInput();
      expect(res).toBeFalsy();
    });

    test('test node with curies specified should return true', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'], ids: ['NCBIGene:1017'] });
      const res = gene_node.hasInput();
      expect(res).toBeTruthy();
    });
  });

  describe('Test hasEquivalentIDs function', () => {
    test('test node with equivalent identifiers set should return true', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      gene_node.setEquivalentIDs(node1_equivalent_ids);
      const res = gene_node.hasEquivalentIDs();
      expect(res).toBeTruthy();
    });

    test('test node with equivalent identifiers not set should return false', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      const res = gene_node.hasEquivalentIDs();
      expect(res).toBeFalsy();
    });
  });

  describe('Test getEntities', () => {
    test('If equivalent ids are empty, should return an empty array', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      gene_node.equivalentIDs = {};
      expect(gene_node.getEntities()).toEqual([]);
    });

    test('If equivalent ids are not empty, should return an array of bioentities', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      gene_node.equivalentIDs = {
        //@ts-expect-error: partial data for specific test
        A: {
          primaryID: 'a',
          equivalentIDs: ['b', 'c'],
        },
        //@ts-expect-error: partial data for specific test
        B: {
          primaryID: 'd',
          equivalentIDs: ['e'],
        },
      };
      expect(gene_node.getEntities()).toEqual([
        {
          primaryID: 'a',
          equivalentIDs: ['b', 'c'],
        },
        {
          primaryID: 'd',
          equivalentIDs: ['e'],
        },
      ]);
    });
  });

  describe('Test getPrimaryIDs', () => {
    test('If equivalent ids are empty, should return an empty array', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      gene_node.equivalentIDs = {};
      expect(gene_node.getPrimaryIDs()).toEqual([]);
    });

    test('If equivalent ids are not empty, should return an array of primaryIDs', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      gene_node.equivalentIDs = {
        //@ts-expect-error: partial data for specific test
        A: {
          primaryID: 'a',
          equivalentIDs: ['b', 'c'],
        },
        //@ts-expect-error: partial data for specific test
        B: {
          primaryID: 'd',
          equivalentIDs: ['e'],
        },
      };
      expect(gene_node.getPrimaryIDs()).toEqual(['a', 'd']);
    });
  });

  describe('Test updateEquivalentIDs', () => {
    test('If equivalent ids does not exist, should set it with the input', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      //@ts-expect-error: partial data for specific test
      gene_node.updateEquivalentIDs({ a: 'b' });
      expect(gene_node.equivalentIDs).toEqual({ a: 'b' });
    });

    test('If equivalent ids are not empty, should update the equivalent ids', () => {
      const gene_node = new QNode({ id: 'n1', categories: ['Gene'] });
      //@ts-expect-error: partial data for specific test
      gene_node.equivalentIDs = { a: 'b', c: 'd' };
      //@ts-expect-error: partial data for specific test
      gene_node.updateEquivalentIDs({ e: 'f' });
      expect(gene_node.getEquivalentIDs()).toEqual({ a: 'b', c: 'd', e: 'f' });
    });
  });

  describe('Test getCategories function', () => {
    test('If equivalent ids are empty, return itself and its descendants', () => {
      const node = new QNode({ id: 'n1', categories: ['DiseaseOrPhenotypicFeature'] });
      expect(node.getCategories()).toContain('Disease');
      expect(node.getCategories()).toContain('PhenotypicFeature');
      expect(node.getCategories()).toContain('DiseaseOrPhenotypicFeature');
    });

    test('If equivalent ids are empty, return itself and its descendants using NamedThing as example', () => {
      const node = new QNode({ id: 'n1', categories: ['NamedThing'] });
      expect(node.getCategories()).toContain('Disease');
      expect(node.getCategories()).toContain('PhenotypicFeature');
      expect(node.getCategories()).toContain('DiseaseOrPhenotypicFeature');
      expect(node.getCategories()).toContain('Gene');
      expect(node.getCategories()).toContain('NamedThing');
    });

    test('If equivalent ids are empty, return itself and its descendants using Gene as example', () => {
      const node = new QNode({ id: 'n1', categories: ['Gene'] });
      expect(node.getCategories()).toEqual(['Gene']);
    });

    test('If equivalent ids are not empty, return all primary semantic types defined in equivalent entities', () => {
      const node = new QNode({ id: 'n1', categories: ['Gene'] });
      node.setEquivalentIDs({
        //@ts-expect-error: partial data for specific test
        A: {
          primaryTypes: ['m', 'p'],
          semanticTypes: ['m', 'n', 'p', 'q'],
        },
        //@ts-expect-error: partial data for specific test
        B: {
          primaryTypes: ['x'],
          semanticTypes: ['x', 'y'],
        },
      });
      // console.log(node.getCategories());
      expect(node.getCategories()).toEqual(['Gene', 'm', 'p', 'x']);
    });
  });
});
