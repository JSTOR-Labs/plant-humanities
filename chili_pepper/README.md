<a href="https://juncture-digital.org"><img src="https://juncture-digital.org/images/ve-button.png"></a>

<param ve-config 
       title="Chili Pepper"
       author="Hallie Pugh-Sellers"
       banner="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Capsicum_annuum.JPG/1280px-Capsicum_annuum.JPG" 
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

This is a sample visual essay demonstrating a few key features of a Visual Essay. Additional [Documentation](https://github.com/JSTOR-Labs/juncture/wiki) and [examples](https://jstor-labs.github.io/juncture-examples) are available for reference.Information about <span data-click-image-zoomto="1128,1424,1494,1255">image interactions</span> can be found [here](https://github.com/JSTOR-Labs/juncture/wiki/Visual-Essay-Image-Tag).
<param ve-image 
       manifest="https://ids.si.edu/ids/manifest/ark:/65665/m306712a081ec0459b90083f05d35455ec">

# Basic usage

## Image

_Hyacinthus orientalis_ is a garden ornamental distinguish by its columnar spike of waxy flowers. Much of the hyacinth’s story, however, actually revolves around its bulb. Reconstructing this narrative reveals how the hyacinth bulb contributed to the plant’s survival in its native range over millennia, enabled its mobility in trade networks under the Ottoman Empire, and culminated in its use for forcing indoors at the French court from the mid-1740s. Today, this story can also raise awareness of the environmental impact of the Dutch flower bulb trade and the need for sustainable solutions in modern flower gardening.[^1]
<param ve-image 
       label="Girl with a Pearl Earring" 
       description="painting by Johannes Vermeer" 
       license="public domain" 
       url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Capsicum_annuum.JPG/1280px-Capsicum_annuum.JPG">
       <param ve-entity eid="Q157428"> <!-- Hyacinthus orientalis -->
       
If possible, please use digital images and other resources that are free and open access. A list of open access image collections for artworks that are out of copyright can be found [here.](https://www.apollo-magazine.com/open-access-image-libraries-a-handy-list/) Photographs of plants with a Creative Commons license can be accessed on [Openverse](https://wordpress.org/openverse/) and [iNaturalist.](https://www.inaturalist.org/). When uploading a personal image to GitHub, use a [Creative Commons](https://creativecommons.org/licenses/) license.
<param ve-image url="https://github.com/JSTOR-Labs/plant-humanities/blob/staging-7/chili_pepper/SurinamesePeppers_DavidEvers_UseWithAttribution.jpeg?raw=true" label="Surinamese Peppers by David Evers, Flickr, CC by 2.0" fit="cover">

Visit the [Visual Essay Image Tag](https://github.com/jstor-labs/juncture/wiki/Visual-Essay-Image-Tag) to learn about customizing image display. The region attribute (region="0,421,3192,2590") is used to show a cropped region of an image in the image viewer. And the fit attribute defines how an image will be scaled or cropped in the image viewer window.
<param ve-compare curtain manifest="https://iiif.lib.harvard.edu/manifests/drs:485943395" seq="149">
<param ve-compare manifest="https://iiif.juncture-digital.org/manifest/c5e3bb5b8f05a40314bba386bdc2df7bc32818a04dae348d0450feb3b63c5520" fit="contain">

## Map

The work has been in the collection of the Mauritshuis in The Hague since 1902 and has been the subject of various 
literary treatments. In 2006, the Dutch public selected it as the most beautiful painting in the Netherlands.
<param ve-map center="Q36600" zoom="11" prefer-geojson>

The Frick Collection in New York City has four paintings by Vermeer. Unlike  _Girl with a Pearl Earring_, the Frick Vermeers are genre scenes. In addition to these paintings by Vermeer, the Frick Collection has works by Frans Hals, Rembrandt, and Meyndert Hobbema.
<param ve-map center="Q60" zoom="8" prefer-geojson>


## Multiple viewers

Multiple viewers may be defined for a single paragraph of text.  The first viewer defined is displayed as the default viewer.  
Others are selectable using icons displayed in the top right margin of the paragraph.
<param ve-image 
       label="Capsicum annuum 'Habanero'"
       manifest="https://ids.si.edu/ids/manifest/ark:/65665/m306712a081ec0459b90083f05d35455ec">
<param ve-map center="Q36600" zoom="11">

# References

[^1]: [Wikipedia: Girl with a Pearl Earring](https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring)

