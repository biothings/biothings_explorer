#!/bin/bash

current_folder=`pwd`

echo ". (workspace)"
echo "-----"
git $*

while read line || [ -n "$line" ];
do
    read -r url module_dir <<< $line
    cd "./packages/$module_dir"
    echo
    basename "$module_dir"
    echo "-----"
    git $*
    cd $current_folder
done < packages/packages.txt
