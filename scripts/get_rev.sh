#!/bin/bash

current_folder=`pwd`

echo '# Generated from "pnpm run get_rev" on ' $(date)

while read line || [ -n "$line" ];
do
    read -r url module_dir <<< $line
    cd "./packages/$module_dir"
    echo `git ls-remote --get-url` `git rev-parse --short HEAD` `git rev-parse HEAD`
    cd $current_folder
done < packages/packages.txt
