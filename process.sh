#!/bin/bash
set -e

SRC="/Volumes/Shared/Web Futures Group/Projects/2013/VU website -- Browse By Course design (Q4 2013)/Documents/02  Content creation/Course Content/"
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
        -c 'silent %s/\v^\s+\</</ge' \
        -c 'silent %s/\v(.*\/courses\/.*)/\r\1/ge' \
        -c 'silent %s/\v(.*\([0-9]+ courses?\).*)/\r\1/ge' \
        -c 'silent g!/\v^\s*(Residents|\<h2>|\<h3>|Courses|Colleges|Event|"|.?International|Email us|Make an online enquiry|Ring us|\+61 3|Create a course e-brochure|https?:\/\/www\.youtube\.com|Tuition fees|When I started at VU English|You have the opportunity|VU is focused on the delivery|The Victoria Graduate School|Victoria University \(VU\) postgraduate programs|Find out about how|VU offers courses|Demand for aged care|Our students provide treatments|Some students are eligible|We offer a wide|Gain skills and knowledge.*http|Our \$68 million|Victoria Universitys institute|Strong industry .*trades-college\/make-up|Gain an in.*http|Our courses can.*medical|VU has cutting.*music|Clinical learning|Clinical placement|Our courses have.*nutrition|.*photo-1931405|Develop the technical.*http|The Victoria University Psychology|VU champions Problem|As a Victoria.*social work|Develop specialist skills.*surveyor|VU students get work experience|VU offers.*youth work|\s*$)/>>' \
        -c 'silent g/Academy Sofitel and Le Cordon Bleu/<<' \
        -c 'silent %s/^ International/International/e' \
        -c 'wq' \
        "$1"
}

function _parse {
    echo "Parsing $1"
    AREA_NAME=`basename "$1" .txt`
    node parse.js "$1" > "$BUILD/$AREA_NAME.json"
}

# get files
echo "Getting latest content from the Y drive"
rm -rf $CONTENT $BUILD
cp -r "$SRC" $CONTENT
mkdir -p $BUILD

# convert to text
find $CONTENT -name *.docx -not -name "Study areas_full list of blurbs.docx" | while read file; do _convert "$file"; done

# preprocess
find $CONTENT -name *.txt | while read file; do _preprocess "$file"; done

# parse
# set +e # don't care anymore
find $CONTENT -name *.txt | while read file; do _parse "$file"; done
