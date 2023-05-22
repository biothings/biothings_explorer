#!/bin/bash

current_folder=`pwd`

while read line || [ -n "$line" ];
do
    read -r url module_dir <<< $line
    cd "$module_dir"
    echo
    basename "$module_dir"
    echo "-----"
    git $*
    cd $current_folder
done < scripts/packages.txt
