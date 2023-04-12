After the [BioThings API of your data-source has been set up and integrated to BTE](https://github.com/biothings/biothings_explorer/blob/main/docs/README-contributing-new-data-source.md), you may want to update your data-source, change the code used to generate your API, or adjust the x-bte annotation.

<br>

These are some things to keep in mind:

1. If you have a BioThings API hosted by the Su / Wu lab, parser + data updates need to be deployed manually (some documentation [here](https://github.com/biothings/biothings_explorer/blob/main/docs/README-contributing-new-data-source.md))
    * deployment is done by someone with access to the BioThings API instances (Yao / Chunlei right now).
    * Yao has asked for issues to be opened in [this Github repo](https://github.com/biothings/pending.api/issues) when deployments are needed. The content of the issue can be like this:
    > Title: API my_kp update
    > - API URL: https://biothings.ncats.io/my_kp
    > - Github URL: https://github.com/MyLab/MyKP
    > - Git Branch/Commit: Master 12a3b45
    > - No. Documents: 123,456 (with explanation if there is a significant change)
    > - Structure of Documents: (describe the added/deleted fields, or paste the new mapping json below.)
    * Please troubleshoot your code and data first, and make sure all manifests, ES-mapping for fields, etc. are properly updated
2. In almost all cases: the yaml file connected to your SmartAPI registration must be updated (some documentation [here](https://github.com/biothings/biothings_explorer/blob/main/docs/README-writing-x-bte.md#editing-an-existing-smartapi-yaml)). The x-bte annotation is essential for BTE to access your API and properly process it into TRAPI format (explained in this [guide](https://github.com/biothings/biothings_explorer/blob/main/docs/README-types-of-apis.md)).
    * x-bte annotations must be updated for:
        * new combos of subject-category / subject-ID-prefix / predicate / qualifiers / object-category / object-ID-prefix
        * edge-attribute changes (exception: IF you are providing them in TRAPI-format under 1 field AND the response-mapping has been set up to ingest these whole, then you don't have to update x-bte)
    * The Su team can provide guidance / tips. If you're worried about breaking your API's connection to BTE, we suggest making updates in a branch/PR first, and then [testing](https://github.com/biothings/biothings_explorer/blob/main/docs/README-writing-x-bte.md#testing-after-its-written) it.
3. The final step is to refresh the SmartAPI registration. This is done automatically at midnight everyday; or it can be done from your [dashboard](https://smart-api.info/dashboard) if you own this registration; or you can ask someone with access to the SmartAPI service (Colleen or Chunlei) to refresh your registration. After 10 min or so, BTE will ingest the updated registry and your changes should be live.
