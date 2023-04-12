Generally speaking, there are four steps to adding a new data resource as a BioThings API to the BioThings Explorer ecosystem.  The four steps are described below, and all four steps should be tracked in a single Github issue.
1. Write a BioThings API data plugin parser
    * instructions: https://docs.biothings.io/en/latest/tutorial/studio.html#parser
    * example: https://github.com/rjawesome/bioplanet_pathway_disease/
    * Add a comment to the Github issue with the parser repo's link ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1167890696))
    * Add a comment to the Github issue with an example record ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1167996704)); iterate as necessary with the rest of the team
2. Deploy the BioThings API
    * This step will generally be performed by a member of the BioThings team
    * Add a comment to the Github issue with the link to the BioThings API ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1170754249))
3. Annotate the BioThings API in the SmartAPI registry
    * instructions: https://github.com/biothings/biothings_explorer/blob/main/docs/README-writing-x-bte.md
    * example: https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml
4. Write an example TRAPI query that utilizes the new data source
    * Add a comment to the Github issue with an example TRAPI query and evidence that BTE's response contains data from the BioThings API, successfully incorporated ([example](https://github.com/biothings/pending.api/issues/60#issuecomment-1212232362)).
        * Ideally this query should be sent to a public instance of BTE (dev, CI, test, or prod)
        * The evidence can be a file storing BTE's response, pasted excerpts of the response, or screenshots (BTE's response in a json-viewer or UI like ARAX)
