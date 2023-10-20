#!/bin/bash

current_folder=`pwd`

echo ". (workspace)"
echo "-----"
git pull

while read line || [ -n "$line" ];
do
    read -r url module_dir <<< $line
    cd "$module_dir"
    echo
    basename "$module_dir"
    echo "-----"
    git pull
    cd $current_folder
done < packages/packages.txt
