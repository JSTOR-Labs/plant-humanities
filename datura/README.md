<a href="https://juncture-digital.org"><img src="https://juncture-digital.org/images/ve-button.png"></a>

<param ve-config 
       title="Datura"
       author="JSTOR Labs team"
       banner="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Datura_quercifolia_flower.jpg/800px-Datura_quercifolia_flower.jpg" 
       layout="vertical">

<!-- Entities discussed throughout the essay are typically defined before the essay text and
     are thus available in all text.  Entity identifiers (QIDs) can be found in either
     Wikipedia or Wikidata (https://www.wikidata.org)> -->
<param ve-entity eid="Q192497"> <!-- Datura -->
<param ve-entity eid="Q41264"> <!-- Johannes Vermeer -->
<param ve-entity eid="Q221092"> <!-- Mauritshuis -->
<param ve-entity eid="Q36600"> <!-- The Hague -->

# Sample visual essay

This is a sample visual essay demonstrating a few key features of a Visual Essay. Additional [Documentation](https://github.com/JSTOR-Labs/juncture/wiki) and [examples](https://jstor-labs.github.io/juncture-examples) are available for reference.
<param ve-image 
       manifest="https://iiif.juncture-digital.org/manifest/6dd738aed85597cac540ad31dd5818e86ef7f2918c7b43a9eb3123d5538e6e4c">

# Basic usage

## Image

_Datura_ is a flowering plant most likely native to the Americas. It is used for lots of different things.[^1]
<param ve-image 
       label="Girl with a Pearl Earring" 
       description="painting by Johannes Vermeer" 
       license="public domain" 
       url="https://upload.wikimedia.org/wikipedia/commons/9/9a/Datura_stramonium_MHNT.BOT.2004.0.263a.jpg">
       
If possible, please use digital images and other resources that are free and open access. A list of open access image collections for artworks that are out of copyright can be found [here.](https://www.apollo-magazine.com/open-access-image-libraries-a-handy-list/) Photographs of plants with a Creative Commons license can be accessed on [Openverse](https://wordpress.org/openverse/) and [iNaturalist.](https://www.inaturalist.org/) When uploading a personal image to GitHub, use a [Creative Commons](https://creativecommons.org/licenses/) license.
<param ve-image url="https://github.com/JSTOR-Labs/plant-humanities/blob/staging-7/datura/Swallowtail_Datura_No%20Copyright.png?raw=true" fit="contain">

Visit the [Visual Essay Image Tag](https://github.com/jstor-labs/juncture/wiki/Visual-Essay-Image-Tag) to learn about customizing image display. The region attribute (region="0,421,3192,2590") is used to show a cropped region of an image in the image viewer. And the fit attribute defines how an image will be scaled or cropped in the image viewer window.
<param ve-compare curtain manifest="https://iiif.lib.harvard.edu/manifests/drs:485943395" seq="11">

Full digital facsimiles of select titles in the Dumbarton Oaks Rare Book Collection can be accessed [here.](https://www.doaks.org/resources/rare-books#c6-operator=or&c7-operator=or&b_start=0) You are welcome to work with our [Rare Book team](https://www.doaks.org/research/library-archives/rare-book-collection) to find something to feature.
<param ve-compare sync fit="contain" manifest="https://iiif.lib.harvard.edu/manifests/drs:436574052" seq="291">
<param ve-compare manifest="https://iiif.juncture-digital.org/manifest/c5e3bb5b8f05a40314bba386bdc2df7bc32818a04dae348d0450feb3b63c5520" fit="contain">

## Plant Specimen

Full digital facsimiles of select titles in the Dumbarton Oaks Rare Book Collection can be accessed [here.](https://www.doaks.org/resources/rare-books#c6-operator=or&c7-operator=or&b_start=0) You are welcome to work with our [Rare Book team](https://www.doaks.org/research/library-archives/rare-book-collection) to find something to feature.
<param ve-plant-specimen jpid="10.5555/al.ap.specimen.cord00022454" label="Datura stramonium L. from Cordoba, Argentina.">

     
## Map

The work has been in the collection of the Mauritshuis in The Hague since 1902 and has been the subject of various 
literary treatments. In 2006, the Dutch public selected it as the most beautiful painting in the Netherlands.
<param ve-map center="Q1489" zoom="11" prefer-geojson>

## Multiple viewers

Multiple viewers may be defined for a single paragraph of text.  The first viewer defined is displayed as the default viewer.  
Others are selectable using icons displayed in the top right margin of the paragraph.
<param ve-image 
       manifest="https://iiif.juncture-digital.org/manifest/6dd738aed85597cac540ad31dd5818e86ef7f2918c7b43a9eb3123d5538e6e4c">
<param ve-map center="Q36600" zoom="11">

# References

[^1]: [Wikipedia: Girl with a Pearl Earring](https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring)

