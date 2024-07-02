import QEdge from '../src/query_edge';
import QNode from '../src/query_node';

function basicQEdge({
  predicates,
  subjectIds,
  objectIds,
  reverse = false,
}: { predicates?: string[]; subjectIds?: string[]; objectIds?: string[]; reverse?: boolean } = {}): QEdge {
  return new QEdge({
    id: 'e01',
    predicates,
    subject: new QNode({
      id: 'n01',
      ids: subjectIds,
    }),
    object: new QNode({
      id: 'n02',
      ids: objectIds,
    }),
  });
}

describe('Test QEdge class', () => {
  describe('Test getPredicate function', () => {
    test('Non reversed edge should return predicates itself', () => {
      const edge = basicQEdge({
        predicates: ['biolink:treats'],
      });
      const res = edge.getPredicate();
      expect(res).toContain('treats');
    });

    test('Undefined predicate should return itself', () => {
      const edge = basicQEdge();
      const res = edge.getPredicate();
      expect(res).toBeUndefined;
    });

    test('An array of non-undefined predicates should return itself', () => {
      const edge = basicQEdge({
        predicates: ['biolink:treats', 'biolink:targets'],
      });
      const res = edge.getPredicate();
      expect(res).toContain('treats');
      expect(res).toContain('targets');
    });

    test('An array of non-undefined predicates with reverse edge should exclude return value if undefined', () => {
      const edge = basicQEdge({
        predicates: ['biolink:treats', 'biolink:targets'],
        objectIds: ['yes'],
      });
      const res = edge.getPredicate();
      expect(res).toContain('treated_by');
    });

    test('An array of non-undefined predicates with reverse edge should return reversed predicates if not undefined', () => {
      const edge = basicQEdge({
        predicates: ['biolink:treats', 'biolink:targets'],
        objectIds: ['yes'],
      });
      const res = edge.getPredicate();
      expect(res).toContain('treated_by');
    });
  });

  describe('Test getOutputNode function', () => {
    test('reversed edge should return the subject', () => {
      const edge = basicQEdge({
        predicates: ['biolink:treats', 'biolink:targets'],
        objectIds: ['yes'],
      });
      const res = edge.getOutputNode();
      expect(res.id).toEqual('n01');
    });

    test('non reversed edge should return the object', () => {
      const edge = basicQEdge({
        predicates: ['biolink:treats', 'biolink:targets'],
        subjectIds: ['yes'],
      });
      const res = edge.getOutputNode();
      expect(res.id).toEqual('n02');
    });
  });
});

describe('Testing QueryEdge Module', () => {
  const gene_node1 = new QNode({ id: 'n1', categories: ['Gene'], ids: ['NCBIGene:1017'] });
  const type_node = new QNode({ id: 'n2', categories: ['SmallMolecule'] });
  const disease1_node = new QNode({ id: 'n1', categories: ['Disease'], ids: ['MONDO:000123'] });
  const node1_equivalent_ids = {
    'NCBIGene:1017': {
      db_ids: {
        NCBIGene: ['1017'],
        SYMBOL: ['CDK2'],
      },
    },
  };

  const gene_node2 = new QNode({ id: 'n2', categories: ['Gene'], ids: ['NCBIGene:1017', 'NCBIGene:1018'] });
  const gene_node1_with_id_annotated = new QNode({ id: 'n1', categories: ['Gene'], ids: ['NCBIGene:1017'] });
  //@ts-expect-error: partial data for specific test scope
  gene_node1_with_id_annotated.setEquivalentIDs(node1_equivalent_ids);
  const chemical_node1 = new QNode({ id: 'n3', categories: ['SmallMolecule'] });
  const edge1 = new QEdge({ id: 'e01', subject: gene_node1, object: chemical_node1 });
  const edge2 = new QEdge({ id: 'e02', subject: gene_node1_with_id_annotated, object: chemical_node1 });
  const edge3 = new QEdge({ id: 'e04', subject: gene_node2, object: chemical_node1 });
  const edge4 = new QEdge({ id: 'e05', object: gene_node2, subject: chemical_node1 });
  const edge5 = new QEdge({ id: 'e06', object: gene_node1_with_id_annotated, subject: chemical_node1 });

  describe('Testing isReversed function', () => {
    test('test if only the object of the edge has curie defined, should return true', () => {
      const res = edge4.isReversed();
      expect(res).toBeTruthy();
    });

    test('test if the subject of the edge has curie defined, should return false', () => {
      const res = edge1.isReversed();
      expect(res).toBeFalsy();
    });

    test('test if both subject and object curie not defined, should return false', () => {
      const node1 = new QNode({ id: 'n1', categories: ['Gene'] });
      const node2 = new QNode({ id: 'n2', categories: ['SmallMolecule'] });
      const edge = new QEdge({ id: 'e01', subject: node1, object: node2 });
      expect(edge.isReversed()).toBeFalsy();
    });
  });

  describe('Testing getInputCurie function', () => {
    test('test return an array of one curie if subject has only one curie specified', () => {
      const res = edge1.getInputCurie();
      expect(res).toEqual(['NCBIGene:1017']);
    });

    test('test return an array of two curie if subject has only an array of two curies specified', () => {
      const res = edge3.getInputCurie();
      expect(res).toEqual(['NCBIGene:1017', 'NCBIGene:1018']);
    });

    test('test return an array of two curies if edge is reversed and object has two curies specified', () => {
      const res = edge4.getInputCurie();
      expect(res).toEqual(['NCBIGene:1017', 'NCBIGene:1018']);
    });
  });

  describe('Testing hasInput function', () => {
    test('test return true if subject has only one curie specified', () => {
      const res = edge1.hasInput();
      expect(res).toBeTruthy();
    });

    test('test return true if subject has only an array of two curies specified', () => {
      const res = edge3.hasInput();
      expect(res).toBeTruthy();
    });

    test('test return true if subject has no curies specified but object does', () => {
      const res = edge4.hasInput();
      expect(res).toBeTruthy();
    });

    test('test return false if both subject and object has no curies specified', () => {
      const node1 = new QNode({ id: 'n1', categories: ['Gene'] });
      const node2 = new QNode({ id: 'n2', categories: ['SmallMolecule'] });
      const edge = new QEdge({ id: 'e01', subject: node1, object: node2 });
      expect(edge.hasInput()).toBeFalsy();
    });
  });

  // Removed because new QEdge has different implementation for hasInputResolved
  // describe("Testing hasInputResolved function", () => {
  //     test("test return true if subject has input resolved", () => {
  //         const res = edge2.hasInputResolved();
  //         expect(res).toBeTruthy();
  //     });

  //     test("test return false if both subject and object do not have input resolved", () => {
  //         const res = edge1.hasInputResolved();
  //         expect(res).toBeFalsy();
  //     });

  //     test("test return true if subject doesn't have input resolved, but object does", () => {
  //         const res = edge5.hasInputResolved();
  //         expect(res).toBeTruthy();
  //     });

  // })

  describe('Testing getPredicate function', () => {
    test('test get reverse predicate if query is reversed', () => {
      const edge = new QEdge({ id: 'e01', subject: type_node, object: disease1_node, predicates: ['biolink:treats'] });
      const res = edge.getPredicate();
      expect(res).toContain('treated_by');
    });

    test('test get reverse predicate if query is reversed and expanded', () => {
      const edge = new QEdge({ id: 'e01', subject: type_node, object: disease1_node, predicates: ['biolink:affects'] });
      const res = edge.getPredicate();
      expect(res).toContain('affected_by');
      expect(res).toContain('disrupted_by');
    });
  });

  describe('Testing expandPredicates function', () => {
    test('All predicates are correctly expanded if in biolink model', () => {
      const edge = new QEdge({
        id: 'e01',
        subject: type_node,
        object: disease1_node,
        predicates: ['biolink:contributes_to'],
      });
      const res = edge.expandPredicates(['contributes_to']);
      expect(res).toContain('contributes_to');
      expect(res).toContain('causes');
    });

    test('Multiple predicates can be resolved', () => {
      const edge = new QEdge({
        id: 'e01',
        subject: type_node,
        object: disease1_node,
        predicates: ['biolink:contributes_to'],
      });
      const res = edge.expandPredicates(['contributes_to', 'ameliorates']);
      expect(res).toContain('contributes_to');
      expect(res).toContain('causes');
      expect(res).toContain('ameliorates');
    });

    test('Predicates not in biolink model should return itself', () => {
      const edge = new QEdge({
        id: 'e01',
        subject: type_node,
        object: disease1_node,
        predicates: ['biolink:contributes_to'],
      });
      const res = edge.expandPredicates(['contributes_to', 'amelio']);
      expect(res).toContain('contributes_to');
      expect(res).toContain('causes');
      expect(res).toContain('amelio');
    });
  });

  describe('chooseLowerEntityValue', () => {
    test('Should reverse if subject has more curies', () => {
      const qEdgeClone = new QEdge(edge1.freeze());
      qEdgeClone.subject.entity_count = 2;
      qEdgeClone.object.entity_count = 1;

      qEdgeClone.chooseLowerEntityValue();

      expect(qEdgeClone.isReversed()).toBeTruthy();
    });

    test("Shouldn't reverse if object has more curies", () => {
      const qEdgeClone = new QEdge(edge1.freeze());
      qEdgeClone.subject.entity_count = 1;
      qEdgeClone.object.entity_count = 2;

      qEdgeClone.chooseLowerEntityValue();

      expect(qEdgeClone.isReversed()).toBeFalsy();
    });

    test("Shouldn't reverse if both have same number", () => {
      const qEdgeClone = new QEdge(edge1.freeze());
      qEdgeClone.subject.entity_count = 2;
      qEdgeClone.object.entity_count = 2;

      qEdgeClone.chooseLowerEntityValue();

      expect(qEdgeClone.isReversed()).toBeFalsy();
    });
  });

  test('getHashedEdgeRepresentation', () => {
    const qEdge1 = new QEdge({ id: 'e01', subject: type_node, object: disease1_node, predicates: ['biolink:treats'] });
    const qEdge2 = new QEdge(qEdge1.freeze(), true);
    // NOTE: recently changed from not.toEqual, because an unfrozen edge *should* equal its original?
    expect(qEdge1.getHashedEdgeRepresentation()).toEqual(qEdge2.getHashedEdgeRepresentation());
  });
});
