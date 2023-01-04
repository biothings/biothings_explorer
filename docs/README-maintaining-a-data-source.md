After the [API of your data-source has been set up with BTE](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/docs/README-contributing-new-data-source.md), you may want to update your data-source, change the code used to generate your API, or adjust the x-bte annotation. 

<br>

These are some things to keep in mind:

1. If you have a BioThings API hosted by the Su / Wu lab, parser + data updates need to be deployed manually (some documentation [here](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/docs/README-contributing-new-data-source.md))
    * deployment is done by someone with access to the BioThings API instances (Yao / Chunlei right now).
    * Yao [posted](https://ncatstranslator.slack.com/archives/C022EL8D3AB/p1667412826922459) earlier on the preferred way of communicating that a deployment is needed (Translator Slack link)
    * Please troubleshoot your code / data first, and make sure all manifests / ES-mapping for fields / etc. are properly updated
2. In almost all cases: the yaml file connected to your SmartAPI registration must be updated (some documentation [here](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/docs/README-writing-x-bte.md#editing-an-existing-smartapi-yaml)). The x-bte annotation is essential for BTE to access your API and properly TRAPI-wrap it (explained in this [guide](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/docs/README-types-of-apis.md)).
    * x-bte annotations must be updated for:
        * new combos of subject-category/predicate/qualifiers/object-category 
        * edge-attribute changes (IF you are providing them in TRAPI-format under 1 field AND the response-mapping has been set up to ingest these whole, then you don't have to update x-bte)
    * The Su team can provide guidance / tips. If you're worried about breaking your API's connection to BTE, we suggest making updates in a branch/PR first, and then [testing](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/docs/README-writing-x-bte.md#testing-after-its-written) it.
3. The final step is to refresh the SmartAPI registration. This is done automatically at midnight everyday, or it can be done from your [dashboard](https://smart-api.info/dashboard) if you own this registration or you can ask someone with access to the SmartAPI service (Colleen or Chunlei) to refresh your registration. After 10 min or so, BTE will ingest the updated registry and your changes should be live.
