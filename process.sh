#!/bin/bash
set -e

SRC="/Volumes/Shared/Web Futures Group/Projects/2013/VU website -- Browse By Course design (Q4 2013)/Documents/02  Content creation/Browse by topic/"
DST=./content

# get files
rm -rf $DST
cp -r "$SRC" $DST

# convert to text
find $DST -name *.docx -exec textutil -convert txt '{}' \;

# indent
for file in $DST/*.txt; do
    vim -es \
        -c '%s/[^[:print:]]//g' -c 'g!/\v^(Residents|\<h2>|\<h3>|Courses|Event|"|.?International|Email us|Make an online enquiry|Ring us|\+61 3|Create a course e-brochure|http:\/\/www\.youtube\.com|\s*$)/>>' \
        -c '%s/^ International/International' \
        -c wq "$file";
done
