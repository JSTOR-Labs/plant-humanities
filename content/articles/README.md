This directory is used for markdown files that contain text to replace the default entity description 
retrieved from Wikidata/Wikipedia.  To use this replacement text the entity tag should include an `article`
attribute with the name of the file in this directory excluding the `.md` file extension.  For instance, to
replace the default text for Wikidata entity [Q871991](https://www.wikidata.org/wiki/Q871991) (cherry blossom),
create a file in the `articles` directory and use the following tag.

`<param ve-entity eid="Q871991" title="cherry blossom" article="cherry_blossom">`, where the file 
`articles/cherry_blossom.md` includes the replacement text to be used.
