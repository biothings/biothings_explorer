#!/bin/bash

current_folder=`pwd`
remote_url=`git config --get remote.origin.url`
echo $remote_url | grep -Eq ^https && remote_protocol="https"  || remote_protocol="git"
if [ -n "$GIT_REMOTE_PROTOCOL" ]; then
    # use value from ENV variable if provided
    remote_protocol="$GIT_REMOTE_PROTOCOL";
fi
if [ "$remote_protocol" = "https" ]; then
   echo "Clone repos using https..."
   base_url="https://github.com/"
else
   echo "Clone repos using git..."
   base_url="git@github.com:"
fi
# example git URLs, https v.s. git
# https://github.com/biothings/biothings_explorer.git
# git@github.com:biothings/biothings_explorer.git

set -x
while read line || [ -n "$line" ];
do
    read -r url module_dir <<< $line
    git clone $base_url"$url" "$module_dir"
done < scripts/packages.txt

cd "./packages/@biothings-explorer/call-apis"
ln -s ../../../scripts/tsconfig.json_call-apis ./tsconfig.json
cd $current_folder

cd "./packages/@biothings-explorer/node-expansion"
ln -s ../../../scripts/tsconfig.json_node-expansion ./tsconfig.json
# # no need to do this after we commit the package name change to the repo
# if [ "$(uname)" = "Darwin" ]; then
#     # sed on mac has a workaround to make it work
#     sed -i '' 's/single-hop-app/bte-trapi/g' package.json
# else
#     sed -i 's/single-hop-app/bte-trapi/g' package.json
# fi
cd $current_folder

set +x
