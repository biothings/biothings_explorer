Generally speaking, there are four steps to adding a new data resource to the BioThings Explorer ecosystem.  The four steps are described below, and all four steps should be tracked in a single Github issue.
1. Write a BioThings API data plugin parser
    * instructions: https://docs.biothings.io/en/latest/tutorial/studio.html#parser
    * example: https://github.com/rjawesome/bioplanet_pathway_disease/
    * Add a link to the repo for the data plugin parser to the Github issue ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1167890696))
    * Add a comment to the Github issue with an example record ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1167996704)); iterate as necessary with the rest of the team
2. Deploy the API
    * This step will generally be performed by a member of the BioThings team
    * Add a link to the API as a comment in the Github issue ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1170754249))
3. Annotate the API in the SmartAPI registry
    * instructions: https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/docs/README-writing-x-bte.md
    * example: https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml
4. Write an example TRAPI query that utilizes the new data source
    * Post the TRAPI query and link to result in the Github issue ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1212232362))
