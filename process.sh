#!/bin/bash
set -e

SRC="/Volumes/Shared/Web Futures Group/Projects/2013/VU website -- Browse By Course design (Q4 2013)/Documents/02  Content creation/Browse by topic/"
CONTENT=./content
BUILD=./build

function _convert {
    echo "Converting $1"
    textutil -convert txt "$1"
}

function _preprocess {
    echo "Preprocessing $1"
    vim -es \
        -c 'silent %s/[^[:print:]]//ge' \
        -c 'silent g!/\v^\s*(Residents|\<h2>|\<h3>|Courses|Colleges|Event|"|.?International|Email us|Make an online enquiry|Ring us|\+61 3|Create a course e-brochure|http:\/\/www\.youtube\.com|Tuition fees|When I started at VU English|You have the opportunity|VU is focused on the delivery|The Victoria Graduate School|\s*$)/>>' \
        -c 'silent %s/^ International/International/e' \
        -c 'wq' \
        "$1"
}

function _parse {
    echo "Parsing $1"
    node parse.js "$1" > "$BUILD/$(basename $1 .txt).json"
}

# get files
echo "Getting latest content from the Y drive"
rm -rf $CONTENT $BUILD
cp -r "$SRC" $CONTENT
mkdir -p $BUILD

# convert to text
find $CONTENT -name *.docx | while read file; do _convert "$file"; done

# preprocess
find $CONTENT -name *.txt | while read file; do _preprocess "$file"; done

# parse
find $CONTENT -name *.txt | while read file; do _parse "$file"; done
