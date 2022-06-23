<a href="https://juncture-digital.org"><img src="https://juncture-digital.org/images/ve-button.png"></a>

<param ve-config 
       title="Datura"
       author="Marlis"
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

## Video

Today, black-eyed peas are grown commercially in at least 33 countries, reflecting the widespread embrace of the bean among geographically disparate peoples, places, and cultures. As acclaimed food historian and chef <span eid="Q49562413">Michael W. Twitty</span> points out: “Very few people in the modern West eat one cuisine or live within one culinary construct,” but rather enjoy a multiplicity of culinary histories. <param ve-video id="JR6yODvixeQ" title="Datura History" author="Momento Malum">

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

## Timeline

We recommend using a [Knight Lab Timeline](https://timeline.knightlab.com/) visualization to provide in-depth information about a specific topic that would otherwise interrupt the flow of the narrative. Beginners can create a timeline using nothing more than a Google spreadsheet. The new version of Timeline supports the many [media types.](https://timeline.knightlab.com/docs/media-types.html)
<param ve-knightlab-timeline source="1-iYs92uJeME-fUtDqqC9yTn6eexwPop4mAYnPCWNCsE&">

## Map with Geospatial Data

Geospatial Conservation Assessment ([GeoCat](https://www.gbif.org/tool/81755/geocat-geospatial-conservation-assessment-tool)) maps and Red List descriptions of the conservation status of 185 species are being produced. For example, data from over 200 herbarium specimens found in 20 institutions suggest that _Heliconia bihai_ from the <span data-click-map-flyto="18.005438, -66.612474,5.8">Caribbean</span> and <span data-click-map-flyto="1.069952, -60.720456, 4.6">northern South America</span> is of “Least Concern” for conservation. Whereas the six available specimens of the very closely related species _[Heliconia aurea](http://www.plantsoftheworldonline.org/taxon/urn:lsid:ipni.org:names:119303-2)_ from <span data-click-map-flyto="9.036443, -69.729927, 7.3">Colombia and Venezuela</span> indicate that it is “Vulnerable” and at risk of extinction, most likely due to habitat alteration, degradation, and destruction.
<param ve-map center="0.040297, -71.224280" zoom="3.8" marker-type="circle" stroke-width="0" fill-opacity="1" label="Populations of Heliconia aurea (magenta) and Heliconia bihai (green) based on data from herbarium specimens.">
<param ve-map-layer geojson active title="Heliconia aurea (magenta)" url="/data/heliconia-aurea.tsv" fill="#D11141" radius="6">  
<param ve-map-layer geojson active title="Heliconia bihai (green)" url="/data/heliconia-bihai.tsv" radius="4.5" fill="#009900">

## Cassava section

Archaeological evidence suggests that cassava became an important food staple for several ancient cultures in present-day Peru, including the Chavin (1000–200 BCE), Nazca (200 BCE–600 CE), Moche (250–750 CE), and Chimú (1000–1470 CE).
<param title="Chavín culture" eid="Q13341477" aliases="Chavin">
<param title="Nazca culture" eid="Q210570" aliases="Nazca">
<param title="Moche culture" eid="Q208188" aliases="Moche">
<param title="Chimú culture" eid="Q901198" aliases="Chimú">
<param ve-map basemap="Esri_WorldPhysical" title="Locations of Pre-Columbian Andean civilizations: Nazca (magenta), Moche and Moche Influence (purple), and Chimú (yellow)." center="-10.398459529701169, -75.35486070351776" zoom="5" marker-type="none" stroke="none">
<param ve-map-layer geojson active url="cassava_leaves.json" title="Cassava leaves">
<param ve-map-layer geojson active url="Peru_Nazca_Moche_Chimor.json" title="Pre-Columbian Andean civilizations">

# References

[^1]: [Wikipedia: Girl with a Pearl Earring](https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring)

