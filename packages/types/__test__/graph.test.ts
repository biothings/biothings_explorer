import graph from '../src/graph';
import { Record } from '../src/index';

describe('Test graph class', () => {
  const qNode1 = {
    getID() {
      return 'qg1';
    },
  };
  const qNode2 = {
    getID() {
      return 'qg2';
    },
  };
  const record1 = new Record({
    api: 'API1',
    metaEdgeSource: 'source1',
    apiInforesCurie: 'infores:API1',
    predicate: 'predicate1',
    object: {
      qNodeID: 'qg2',
      curie: 'outputPrimaryCurie',
      original: 'outputPrimaryCurie',
    },
    subject: {
      qNodeID: 'qg1',
      curie: 'inputPrimaryCurie',
      original: 'inputPrimaryCurie',
    },
    publications: ['PMID:1', 'PMID:2'],
    mappedResponse: {
      relation: 'relation1',
    },
  });

  const record2 = new Record({
    api: 'API2',
    metaEdgeSource: 'source2',
    apiInforesCurie: 'infores:API2',
    predicate: 'predicate1',
    object: {
      qNodeID: 'qg2',
      curie: 'outputPrimaryCurie',
      original: 'outputPrimaryCurie',
    },
    subject: {
      qNodeID: 'qg1',
      curie: 'inputPrimaryCurie',
      original: 'inputPrimaryCurie',
    },
    publications: ['PMC:1', 'PMC:2'],
    mappedResponse: {
      relation: 'relation2',
    },
  });

  const record3 = new Record({
    api: 'API3',
    metaEdgeSource: 'source3',
    apiInforesCurie: 'infores:API3',
    predicate: 'predicate2',
    object: {
      qNodeID: 'qg2',
      curie: 'outputPrimaryCurie',
      original: 'outputPrimaryCurie',
    },
    subject: {
      qNodeID: 'qg1',
      curie: 'inputPrimaryCurie',
      original: 'inputPrimaryCurie',
    },
    publications: ['PMC:3', 'PMC:4'],
    mappedResponse: {
      relation: 'relation3',
    },
  });

  const record3a = new Record({
    api: 'API3',
    metaEdgeSource: 'source3',
    apiInforesCurie: 'infores:API3',
    predicate: 'predicate2',
    object: {
      qNodeID: 'qg2',
      curie: 'outputPrimaryCurie',
      original: 'outputPrimaryCurie',
    },
    subject: {
      qNodeID: 'qg1',
      curie: 'inputPrimaryCurie',
      original: 'inputPrimaryCurie',
    },
    publications: ['PMC:6', 'PMC:7'],
    mappedResponse: {
      relation: ['relation3a', 'relation3b'],
    },
  });

  test('A single query result is correctly updated.', () => {
    const g = new graph();
    g.update([record1]);
    expect(g.nodes).toHaveProperty('outputPrimaryCurie');
    expect(g.nodes).toHaveProperty('inputPrimaryCurie');
    expect(g.nodes['outputPrimaryCurie'].primaryCurie).toEqual('outputPrimaryCurie');
    expect(g.nodes['outputPrimaryCurie'].qNodeID).toEqual('qg2');
    expect(Array.from(g.nodes['outputPrimaryCurie'].sourceNodes)).toEqual(['inputPrimaryCurie']);
    expect(Array.from(g.nodes['outputPrimaryCurie'].sourceQNodeIDs)).toEqual(['qg1']);
    expect(g.nodes['inputPrimaryCurie'].primaryCurie).toEqual('inputPrimaryCurie');
    expect(g.nodes['inputPrimaryCurie'].qNodeID).toEqual('qg1');
    expect(Array.from(g.nodes['inputPrimaryCurie'].targetNodes)).toEqual(['outputPrimaryCurie']);
    expect(Array.from(g.nodes['inputPrimaryCurie'].targetQNodeIDs)).toEqual(['qg2']);
    expect(g.edges).toHaveProperty('2c826c3663b91f65a1cba70f06c7fc65');
    expect(Array.from(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].apis)).toEqual(['API1']);
    expect(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].sources).toHaveProperty('source1');
    expect(Array.from(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].publications)).toEqual(['PMID:1', 'PMID:2']);
    expect(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].attributes).toHaveProperty('relation', new Set(['relation1']));
  });

  test('Multiple query results are correctly updated for two edges having same input, predicate and output', () => {
    const g = new graph();
    g.update([record1, record2]);
    expect(g.nodes).toHaveProperty('outputPrimaryCurie');
    expect(g.nodes).toHaveProperty('inputPrimaryCurie');
    expect(g.nodes['outputPrimaryCurie'].primaryCurie).toEqual('outputPrimaryCurie');
    expect(g.nodes['outputPrimaryCurie'].qNodeID).toEqual('qg2');
    expect(Array.from(g.nodes['outputPrimaryCurie'].sourceNodes)).toEqual(['inputPrimaryCurie']);
    expect(Array.from(g.nodes['outputPrimaryCurie'].sourceQNodeIDs)).toEqual(['qg1']);
    expect(g.nodes['inputPrimaryCurie'].primaryCurie).toEqual('inputPrimaryCurie');
    expect(g.nodes['inputPrimaryCurie'].qNodeID).toEqual('qg1');
    expect(Array.from(g.nodes['inputPrimaryCurie'].targetNodes)).toEqual(['outputPrimaryCurie']);
    expect(Array.from(g.nodes['inputPrimaryCurie'].targetQNodeIDs)).toEqual(['qg2']);

    expect(g.edges).toHaveProperty('2c826c3663b91f65a1cba70f06c7fc65');
    expect(Array.from(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].apis)).toEqual(['API1']);
    expect(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].sources).toHaveProperty('source1');
    expect(Array.from(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].publications)).toEqual(['PMID:1', 'PMID:2']);
    expect(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].attributes).toHaveProperty('relation', new Set(['relation1']));

    expect(g.edges).toHaveProperty('827c366e2e3088b3f4a90dd88a524f15');
    expect(Array.from(g.edges['827c366e2e3088b3f4a90dd88a524f15'].apis)).toEqual(['API2']);
    expect(g.edges['827c366e2e3088b3f4a90dd88a524f15'].sources).toHaveProperty('source2');
    expect(Array.from(g.edges['827c366e2e3088b3f4a90dd88a524f15'].publications)).toEqual(['PMC:1', 'PMC:2']);
    expect(g.edges['827c366e2e3088b3f4a90dd88a524f15'].attributes).toHaveProperty('relation', new Set(['relation2']));
  });

  test('Multiple query results for different edges are correctly updated', () => {
    const g = new graph();
    g.update([record1, record2, record3]);
    expect(g.nodes).toHaveProperty('outputPrimaryCurie');
    expect(g.nodes).toHaveProperty('inputPrimaryCurie');
    expect(g.nodes['outputPrimaryCurie'].primaryCurie).toEqual('outputPrimaryCurie');
    expect(g.nodes['outputPrimaryCurie'].qNodeID).toEqual('qg2');
    expect(Array.from(g.nodes['outputPrimaryCurie'].sourceNodes)).toEqual(['inputPrimaryCurie']);
    expect(Array.from(g.nodes['outputPrimaryCurie'].sourceQNodeIDs)).toEqual(['qg1']);
    expect(g.nodes['inputPrimaryCurie'].primaryCurie).toEqual('inputPrimaryCurie');
    expect(g.nodes['inputPrimaryCurie'].qNodeID).toEqual('qg1');
    expect(Array.from(g.nodes['inputPrimaryCurie'].targetNodes)).toEqual(['outputPrimaryCurie']);
    expect(Array.from(g.nodes['inputPrimaryCurie'].targetQNodeIDs)).toEqual(['qg2']);

    expect(g.edges).toHaveProperty('2c826c3663b91f65a1cba70f06c7fc65');
    expect(Array.from(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].apis)).toEqual(['API1']);
    expect(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].sources).toHaveProperty('source1');
    expect(Array.from(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].publications)).toEqual(['PMID:1', 'PMID:2']);
    expect(g.edges['2c826c3663b91f65a1cba70f06c7fc65'].attributes).toHaveProperty('relation', new Set(['relation1']));

    expect(g.edges).toHaveProperty('827c366e2e3088b3f4a90dd88a524f15');
    expect(Array.from(g.edges['827c366e2e3088b3f4a90dd88a524f15'].apis)).toEqual(['API2']);
    expect(g.edges['827c366e2e3088b3f4a90dd88a524f15'].sources).toHaveProperty('source2');
    expect(Array.from(g.edges['827c366e2e3088b3f4a90dd88a524f15'].publications)).toEqual(['PMC:1', 'PMC:2']);
    expect(g.edges['827c366e2e3088b3f4a90dd88a524f15'].attributes).toHaveProperty('relation', new Set(['relation2']));

    expect(g.edges).toHaveProperty('3138ca0afca791770ed38c243dea2116');
    expect(Array.from(g.edges['3138ca0afca791770ed38c243dea2116'].apis)).toEqual(['API3']);
    expect(g.edges['3138ca0afca791770ed38c243dea2116'].sources).toHaveProperty('source3');
    expect(Array.from(g.edges['3138ca0afca791770ed38c243dea2116'].publications)).toEqual(['PMC:3', 'PMC:4']);
    expect(g.edges['3138ca0afca791770ed38c243dea2116'].attributes).toHaveProperty('relation', new Set(['relation3']));
  });

  test('Multiple attributes with the same name are merged', () => {
    const g = new graph();
    g.update([record3, record3a]);

    expect(g.edges).toHaveProperty('3138ca0afca791770ed38c243dea2116');
    expect(Array.from(g.edges['3138ca0afca791770ed38c243dea2116'].publications)).toEqual([
      'PMC:3',
      'PMC:4',
      'PMC:6',
      'PMC:7',
    ]);
    expect(g.edges['3138ca0afca791770ed38c243dea2116'].attributes).toHaveProperty(
      'relation',
      new Set(['relation3', 'relation3a', 'relation3b']),
    );
  });
});
