#!/bin/bash

# variables 
projectName="bte"
namespace="bte"
# replace place_holder with values from env var
# env var's key needs to be the same as the place_holder
toReplace=('BUILD_VERSION')

# replace variables in values.yaml with env vars
for item in "${toReplace[@]}";
do
  sed -i.bak \
      -e "s/${item}/${!item}/g" \
      values.yaml
  rm values.yaml.bak
done

# for CI, need to remove previous deployment since the taint and tolleration will only allow one deployment exists
#helm -n ${namespace} uninstall ${projectName} 
#sleep 30
# deploy helm chart
helm -n ${namespace} upgrade --install ${projectName} -f values-bte.yaml ./