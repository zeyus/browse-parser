Content for **browse courses by study area** has been prepared in loosely structured Word docs. This is a pipeline to parse those into JSON documents for import into Drupal.

## Requirements

This probably only works on OS X.

* Bash
* [Textutil](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/textutil.1.html)
* Vim
* NodeJS

If you're on OS X you already have bash and textutil and you can `brew install vim nodejs` for the rest.

## Setup

1. Git clone
2. From the working directory `npm install` to install dependencies

## Use

1. Make sure the Web Services shared drive is mounted at `/Volumes/Shared/Web Futures Group/`
2. From the working directory: `./process.sh`

This does the following:

* Deletes the `content` and `build` directories
* Copies the latest content from the shared drive to 
`content`
* Converts the content documents from `.docx` to `.txt`
* Preprocess the `.txt` documents with VIM (remove invisible characters, indent for easier parsing)
* Parse the `.txt` documents to JSON and save in `build/`

