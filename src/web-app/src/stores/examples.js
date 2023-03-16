import moment from 'moment'
import { defineStore } from "pinia";
import axios from 'axios';
import { useMainStore } from './general'

export const useExamplesStore = defineStore({
  id: "examples",
  state: () => ({
    queries: [
      {
      'selected': false,
      'name' :'Disease (Kartagener syndrome) has phenotypic feature',
      'id': 423423,
      'elements': {
              'nodes': [
              { data: { id: 'dis', name: '⭐Disease\n(MONDO:0016575)', color: '#8d5bd4' } },
              { data: { id: 'ph', name: 'PhenotypicFeature', color: '#2abcbd' } },
              ],
              'edges': [
              { data: { source: 'dis', target: 'ph', name:'⭐biolink:has_phenotype' } }
              ]
      },
      'query': 
      {
          "message": {
              "query_graph": {
                  "nodes": {
                      "n0": {
                          "categories": ["biolink:Disease"],
                          "ids": ["MONDO:0016575"]
                      },
                      "n1": {
                          "categories": ["biolink:PhenotypicFeature"]
                      }
                  },
                  "edges": {
                      "e01": {
                          "subject": "n0",
                          "object": "n1",
                          "predicates": ["biolink:has_phenotype"]
                      }
                  }
              }
          }
      }
      },
      {
        'selected': false,
      'name' :'Disease (Kartagener syndrome) relation to genes',
      'id': 428423,
      'elements': {
              'nodes': [
                { data: { id: 'dis', name: '⭐Disease\n(MONDO:0016575)', color: '#8d5bd4' } },
                { data: { id: 'gene', name: 'Gene', color: '#369ac1' } },
              ],
              'edges': [
              { data: { source: 'dis', target: 'gene', name:'' } }
              ]
          },
        "query":{
            "message": {
                "query_graph": {
                    "nodes": {
                        "n0": {
                            "categories": ["biolink:Disease"],
                            "ids": ["MONDO:0005737"]
                        },
                        "n1": {
                            "categories": ["biolink:Gene"]
                        }
                    },
                    "edges": {
                        "e01": {
                            "subject": "n0",
                            "object": "n1"
                        }
                    }
                }
            }
        }
      },
      {
        'selected': false,
      'name' :'Disease (Ebola hemorrhagic fever) gene relation to small molecules',
      'id': 426654,
      'elements': {
              'nodes': [
              
              { data: { id: 'dis', name: '⭐Disease\n(MONDO:0005737)', color: '#8d5bd4' } },
              { data: { id: 'gene', name: 'Gene', color: '#369ac1' } },
              { data: { id: 'sm', name: 'SmallMolecule', color: 'hotpink' } },
              ],
              'edges': [
              { data: { source: 'dis', target: 'gene', name:'' } },
              { data: { source: 'gene', target: 'sm', name:'' } },
              ]
          },
          "query": {
            "message": {
                "query_graph": {
                    "nodes": {
                        "n0": {
                            "categories": ["biolink:Disease"],
                            "ids": ["MONDO:0005737"]
                        },
                        "n1": {
                            "categories": ["biolink:Gene"]
                        },
                        "n2": {
                            "categories": ["biolink:SmallMolecule"]
                        }
                    },
                    "edges": {
                        "e01": {
                            "subject": "n0",
                            "object": "n1"
                        },
                        "e02": {
                            "subject": "n1",
                            "object": "n2"
                        }
                    }
                }
            }
        }
      },
      {
        'selected': false,
      'name' :'Gene (NCBIGene:3778) relation to small molecules via other genes',
      'id': 453423,
      'elements': {
              'nodes': [
                { data: { id: 'gene', name: '⭐Gene\n(NCBIGene:3778)', color: '#369ac1' } },
                { data: { id: 'gene2', name: 'Gene', color: '#369ac1' } },
                { data: { id: 'sm', name: 'SmallMolecule', color: 'hotpink' } },
              ],
              'edges': [
              { data: { source: 'gene', target: 'gene2', name:'' } },
              { data: { source: 'gene2', target: 'sm', name:'' } },
              ]
          },
        "query": {
            "message": {
              "query_graph": {
                "nodes": {
                  "n0": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:3778"]
                  },
                  "n1": {
                    "categories": ["biolink:Gene"]
                  },
                  "n2": {
                    "categories": ["biolink:SmallMolecule"]
                  }
                },
                "edges": {
                  "e01": {
                    "subject": "n0",
                    "object": "n1"
                  },
                  "e02": {
                    "subject": "n1",
                    "object": "n2"
                  }
                }
              }
            }
          }
      },
    ],
    message: '',
    jobs: [],
    jobPicked: ''
  }),
  getters: {
    selectedQuery: (state) => state.queries.find((q) => q.selected),
  },
  actions: {
    select(id) {
      this.queries.forEach((q) => {
        if ( q.id == id) {
          q.selected = !q.selected
        }else{
          q.selected = false;
        }
      })
    },
    async sendRequest(query, description) {
      let self = this;
      let store = useMainStore();
      store.loading = true;
      axios.post('/v1/asyncquery', JSON.parse(query)).then(res=>{
        store.loading = false;
        console.log(res.data)
        self.jobs.unshift({
          'id': res.data.id,
          'date': this.getDateRightNow(),
          'url': res.data.url,
          'description': description
        });
        self.message = `A new job ID has been created: ${res.data.id} `
        self.updateJobs();
      }).catch(err=>{
        store.loading = false;
        console.log(err);
        self.message = `Oh no: ${err} `
        throw err;
      });
    },
    updateJobs(){
      localStorage.setItem('bte-jobs', JSON.stringify(this.jobs));
    },
    getJobs(){
      let j = JSON.parse(localStorage.getItem('bte-jobs'));
      if (j && j.length) {
        this.jobs = j;
      }
    },
    deleteJobs(){
      localStorage.removeItem('bte-jobs');
      this.jobs = [];
    },
    getDateRightNow(){
        return moment().format('MMMM Do YYYY, h:mm:ss');
    }
  },
});
