<var data-essay title="Plant Humanities" data-layout="horizontal"></var>

## The Plant Humanities Initiative
Welcome to the ***Plant Humanities*** visual essays prototype site. This site provides tools for tagging and viewing textual narratives. The tagged narratives enable interactive visualizations that augment the textual content with maps, videos, and hi-resolution images. This site has been developed in support of the [*Plant Humanities Initiative*](https://labs.jstor.org/planthumanities/), a collaboration between [Dumbarton Oaks](https://www.doaks.org/) and [JSTOR Labs](https://labs.jstor.org), generously funded by [The Andrew W. Mellon Foundation](https://mellon.org/).

## Visual Essays
Visual essays are text-based narratives that have been enhanced with visual and interactive elements providing context and supplemental content for text paragraphs in the essay.  The essay text is annotated with tags that specify the type of visualization to generate for various sections of text.  The essay is written as plain text with optional formatting provided using [markdown](https://en.wikipedia.org/wiki/Markdown), a lightweight markup language.  A key element in the visual essay concept is the use of  Wikidata and other knowledge bases for data used in the visualizations.  Associated the essay text with entities in Wikidata (and other knowledge bases) enables the visualizations to be generated with minimal tagging by the user.  As an example, it is often desirable to provide a map with marker pins when describing locations.  In the visual essay tool this is easily done by simply adding a tag with the Wikidata entity ID associated with the location(s) to be included on a map visualization.

To add a map of Southeastern Michigan to an essay with pins showing the locations of Detroit, Ann Arbor, and Lansing the following tags would be appended to the applicable text section in the essay:
```html

<var data-map data-center="Q485172" data-zoom="10"></var>
<var id="Q12439"></var>
<var id="Q485172"></var>
<var id="Q28237"></var>

```


The first tag causes a map to be generated centered on the location associated with the Wikidata identifier `Q485172` (Ann Arbor) with a zoom level of `10`.  The other 3 tags declare that the Wikidata entities with the QIDs `Q12439` (Detroit), `Q485172` (Ann Arbor), and `Q28237` (Lansing) are associated with the text and should be placed on the map when displayed.  Using entities from the Wikidata knowledge base allows the visualization generator to automatically retrieve any needed information for the visualization (a map in this example).  Information retrieved includes the geo coordinates for the map pin, the entity label, and an image if available.

## Wikidata
[Wikidata](https://www.wikidata.org) is a free and open knowledge base that can be read and edited by both humans and machines.  Wikidata acts as central storage for the  **structured data**  of its Wikimedia sister projects including Wikipedia, Wikivoyage, Wiktionary, Wikisource, and others.  As of March 2020 Wikidata contained nearly 80 million entities and is growing at the rate of approximately 1 million new entities per month.



