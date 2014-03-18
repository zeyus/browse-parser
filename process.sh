#!/bin/bash
set -e

SRC="/Volumes/Shared/Web Futures Group/Projects/2013/VU website -- Browse By Course design (Q4 2013)/Documents/02  Content creation/Browse by topic/"
CONTENT=./content
BUILD=./build

# get files
rm -rf $CONTENT $BUILD
cp -r "$SRC" $CONTENT
mkdir -p $BUILD

# convert to text
find $CONTENT -name *.docx -exec textutil -convert txt '{}' \;

for file in $CONTENT/*.txt; do
    echo "Cleaning $file"
    vim -es \
        -c 'silent %s/[^[:print:]]//ge' \
        -c 'silent g!/\v^(Residents|\<h2>|\<h3>|Courses|Event|"|.?International|Email us|Make an online enquiry|Ring us|\+61 3|Create a course e-brochure|http:\/\/www\.youtube\.com|\s*$)/>>' \
        -c 'silent %s/^ International/International/e' \
        -c wq "$file";
done

for file in $CONTENT/*.txt; do
    echo "Parsing $file"
    node parse.js "$file" > "$BUILD/$(basename $file .txt).json"
done
