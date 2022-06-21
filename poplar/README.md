<a href="https://juncture-digital.org"><img src="https://juncture-digital.org/images/ve-button.png"></a>

<param ve-config 
       title="Poplar"
       author="May Wang"                                banner="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Trembling_aspen_%28Populus_tremuloides%29_-_panoramio.jpg/1024px-Trembling_aspen_%28Populus_tremuloides%29_-_panoramio.jpg"
       layout="vertical">

<!-- Entities discussed throughout the essay are typically defined before the essay text and
     are thus available in all text.  Entity identifiers (QIDs) can be found in either
     Wikipedia or Wikidata (https://www.wikidata.org)> -->
<param ve-entity eid="Q185372"> <!-- Girl with a Pearl Earring painting -->
<param ve-entity eid="Q41264"> <!-- Johannes Vermeer -->
<param ve-entity eid="Q221092"> <!-- Mauritshuis -->
<param ve-entity eid="Q36600"> <!-- The Hague -->
<param ve-entity eid="Q60"> <!-- New York City -->

# Sample visual essay

This is a sample visual essay demonstrating a few key features of a Visual Essay. Additional [Documentation](https://github.com/JSTOR-Labs/juncture/wiki) and [examples](https://jstor-labs.github.io/juncture-examples) are available for reference.
<param ve-image 
       manifest="https://iiif.juncture-digital.org/manifest/6dd738aed85597cac540ad31dd5818e86ef7f2918c7b43a9eb3123d5538e6e4c">

# Basic usage

## Image

_Hyacinthus orientalis_ is a garden ornamental distinguish by its columnar spike of waxy flowers. Much of the hyacinth’s story, however, actually revolves around its bulb. Reconstructing this narrative reveals how the hyacinth bulb contributed to the plant’s survival in its native range over millennia, enabled its mobility in trade networks under the Ottoman Empire, and culminated in its use for forcing indoors at the French court from the mid-1740s. Today, this story can also raise awareness of the environmental impact of the Dutch flower bulb trade and the need for sustainable solutions in modern flower gardening.[^1]
<param ve-image 
       label="Girl with a Pearl Earring" 
       description="painting by Johannes Vermeer" 
       license="public domain" 
       url="https://upload.wikimedia.org/wikipedia/commons/0/0f/1665_Girl_with_a_Pearl_Earring.jpg">
       <param ve-entity eid="Q157428"> <!-- Hyacinthus orientalis -->

If possible, please use digital images and other resources that are free and open access. A list of open access image collections for artworks that are out of copyright can be found [here.](https://www.apollo-magazine.com/open-access-image-libraries-a-handy-list/) Photographs of plants with a Creative Commons license can be accessed on [Openverse](https://wordpress.org/openverse/) and [iNaturalist.](https://www.inaturalist.org/) When uploading a personal image to GitHub, use a [Creative Commons](https://creativecommons.org/licenses/) license.
<param ve-image url="https://github.com/kristanmhanson/Juncture_training_2/blob/main/Flickr_CC_BY_NC_SA_2.0.jpg?raw=true" fit="cover">

Visit the [Visual Essay Image Tag](https://github.com/jstor-labs/juncture/wiki/Visual-Essay-Image-Tag) to learn about customizing image display. The region attribute (region="0,421,3192,2590") is used to show a cropped region of an image in the image viewer. And the fit attribute defines how an image will be scaled or cropped in the image viewer window.
<param ve-compare curtain manifest="https://iiif.lib.harvard.edu/manifests/drs:493720026" seq="118">
<param ve-compare manifest="https://iiif.juncture-digital.org/manifest/c5e3bb5b8f05a40314bba386bdc2df7bc32818a04dae348d0450feb3b63c5520" fit="contain">

Full digital facsimiles of select titles in the Dumbarton Oaks Rare Book Collection can be accessed [here.](https://www.doaks.org/resources/rare-books#c6-operator=or&c7-operator=or&b_start=0) You are welcome to work with our [Rare Book team](https://www.doaks.org/research/library-archives/rare-book-collection) to find something to feature.
<param ve-compare sync fit="contain" manifest="https://iiif.lib.harvard.edu/manifests/drs:436574052" seq="291">
<param ve-compare manifest="https://iiif.juncture-digital.org/manifest/c5e3bb5b8f05a40314bba386bdc2df7bc32818a04dae348d0450feb3b63c5520" fit="contain">

## Plant Specimen

Linnaeus further implored English nurseryman James Gordon for live specimens in 1772, to no avail. He was nonetheless susceptible to the awe *Dionaea* inspired, and his incredulity regarding the deadly trapping mechanism might simply be attributed to the lack of necessary empirical evidence. The flattened, dried, and inert specimens he received from correspondents failed to show the speed and precision of the lethal snap-trap in action and understandably inspired the impression of a sleeping eyelid, as Linnaeus described in his letter to Burman.
<param ve-plant-specimen jpid="10.5555/al.ap.specimen.cord00022454" label="Datura stramonium L. from Cordoba, Argentina.">

## YouTube Video

Today, black-eyed peas are grown commercially in at least 33 countries, reflecting the widespread embrace of the bean among geographically disparate peoples, places, and cultures. As acclaimed food historian and chef <span eid="Q49562413">Michael W. Twitty</span> points out: “Very few people in the modern West eat one cuisine or live within one culinary construct,” but rather enjoy a multiplicity of culinary histories.
<param ve-video id="_B6yRDDxOzw" title="What is botanical art?" author="Royal Botanic Gardens, Kew">

## Map

The work has been in the collection of the Mauritshuis in The Hague since 1902 and has been the subject of various 
literary treatments. In 2006, the Dutch public selected it as the most beautiful painting in the Netherlands.
<param ve-map center="Q36600" zoom="11" prefer-geojson>

The Frick Collection in New York City has four paintings by Vermeer. Unlike  _Girl with a Pearl Earring_, the Frick Vermeers are genre scenes. In addition to these paintings by Vermeer, the Frick Collection has works by Frans Hals, Rembrandt, and Meyndert Hobbema.
<param ve-map center="Q60" zoom="8" prefer-geojson>

## Multiple viewers

Multiple viewers may be defined for a single paragraph of text.  The first viewer defined is displayed as the default viewer.  
Others are selectable using icons displayed in the top right margin of the paragraph. Information about <span data-click-image-zoomto="489,1158,4245,3759">image interactions</span> can be found [here](https://github.com/JSTOR-Labs/juncture/wiki/Visual-Essay-Image-Tag). <!-- copy coordinates from visual essay upper left corner -->
<param ve-image 
       manifest="https://ids.si.edu/ids/manifest/ark:/65665/m38902df56eeba4856a1036eb5f7212d1d"
       title="_Populus tremuloides_ herbarium specimen with cotton">
<param ve-map center="Q36600" zoom="11">

# References

[^1]: [Wikipedia: Girl with a Pearl Earring](https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring)

