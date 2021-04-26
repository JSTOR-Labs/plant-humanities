<param ve-config
	   title="How to Use the Plant Humanities Lab"
	   layout="vtl">

You can use Plant Humanities Lab to explore the cultural histories of plants and their influence on human societies in two ways: take a guided tour of a single plant’s influence through curated and interactive plant narratives, or use the plant search to discover resources and data associated with people, places, and plants.
<param ve-image fit="contain" url="home_page.jpg">

# Plant Narratives
Select a narrative from the home page. Each narrative is dedicated to a single plant. As you scroll through the narrative, you’ll notice each paragraph of text is presented alongside a related visualization panel. You can change which paragraph is active either by scrolling or by clicking anywhere within a new paragraph. The visualization panel includes a variety of components, including interactive maps, high-resolution images, data visualizations, and more. Icons to the right of the text indicate what components are available for each paragraph. Only one mode can display at a time, so you may have to click to see additional features. Components include:
<param ve-graphic url="Essays.gif">

## Images
Pan and zoom high-resolution images by clicking on the image or on the + and - icons. Click the Home icon to return to the original presentation. When multiple images are available, select the one you want by clicking on the thumbnail at the bottom of the pane.  
<param ve-image region="-130,635,2618,2319" manifest="https://iiif-v2.visual-essays.app/manifest/40346d8a1544f191ac8ccd648d5309bc1f62241fba9916756559e436eec72704">
<param ve-image fit="contain" manifest="https://iiif-v2.visual-essays.app/manifest/06d9b34e47e99a7440322bb7cd24b0b35519ca9eb9744c213819cc2bd3d664e5">
<param ve-image region="804,69,1529,1313" title="Rayed figure in a litter carried by anthropomorphic warriors. Drawing reproduces iconography on the body of a ceramic vessel held by the Ethnologisches Museum Berlin. To the left of the figure in the dais are anthropomorphic fox, feline, maize or corn plant known as the Botanical Frog." manifest="https://iiif.lib.harvard.edu/manifests/ids:457658938" attribution="Donna McClelland, December 4, 1989, Harvard University, Dumbarton Oaks Research Library.">

Some images have annotations calling attention to specific portions of the image. When these are available, additional controls appear over the image. Click Play Annotations to step through the sequence of image annotations.  
<param ve-image
	title="Ming herbal (painting): Chinese herbaceous peony"
	url="https://upload.wikimedia.org/wikipedia/commons/2/2e/Ming_herbal_%28painting%29%3B_Chinese_herbaceous_peony_Wellcome_L0039426.jpg">
	
## Maps 
Pan and zoom the maps by clicking on the map or on the + and - icons. You can show and hide layers on the map by selecting the layers icon. Hover over a shaded area for more information.
<param ve-map title="Origins of Banana" center="3.979260, 129.067833" basemap="Esri_WorldPhysical" zoom="4" stroke-width="0">
<param ve-map-layer geojson active url="/geojson/banana_distribution.json">

Some maps have time-encoded data, with a control panel at the bottom letting you select the dates for which to display map data, and the ability to animate the display of map features for specific time periods, showing change over time on the map.
<param ve-map
	title="Occurence of boxwood blight in America, 2010–2018."
	center="39.812733, -97.042653"
	zoom="4"
	time-dimension
	time-interval="2009/2018"
	duration="P10000Y"
	max-zoom="4"
	date-format="YYYY"
	fps="0.5"
	fill="red"
	auto-play="true">
<param ve-map-layer
	url="us-states.json">

## Plant specimens
Pan and zoom high-resolution plant specimens by clicking on the image or on the + and - icons.  Click the Home icon to return to the original presentation.  When multiple specimens are available, select the one you want by clicking on the thumbnail at the bottom of the pane.  Plant specimens are sourced from JSTOR Global Plants.
<param ve-image manifest="https://iiif-v2.visual-essays.app/manifest/7abe92680267a8d60322bf353cbc5b915f2a372fbe7feaa4ecb4e0d5ecfb1326">
<param ve-image manifest="https://iiif-v2.visual-essays.app/manifest/f93acafc668f8bd6d6e33e405ee35309adebd17f166b17c12b176602ce525d8d">
<param ve-image manifest="https://iiif-v2.visual-essays.app/manifest/87622b8792fafd1cdb17ab278dbfba4b8f8ae21017b4334c3b781315229196d3">
<param ve-image manifest="https://iiif-v2.visual-essays.app/manifest/34d415c157409b461ad72b50cdee1bfbe463e3340a9846cd1ece87f10edace52">
<param ve-image manifest="https://iiif-v2.visual-essays.app/manifest/bbf1d2e99ed1e8769fcd0f81f88fc3b8ae3c88594d46d25fa6e87dc583a3c490">

## Network visualizations
Hover over nodes and connectors in the network diagram for additional details; click on a node to re-center the network visualization.
<param ve-d3plus-ring-network 
       url="https://raw.githubusercontent.com/JSTOR-Labs/plant-humanities/develop/data/heliconia_network_relationship_v2.tsv" center="Heliconia imbricata">

## Videos
Play and pause videos using the video controls.
<param ve-video
	vid="cmpd58kMl2s"
	title="Mythbusters Cinnamon Challenge.">

## Tabular data
Scroll through the table using your cursor or arrow keys; sort the table by clicking on column headers.
<param ve-tabulator url="https://raw.githubusercontent.com/JSTOR-Labs/plant-humanities/develop/data/Emmenagogic_Herbs.tsv">

## Timelines
Navigate the timeline by clicking on the < and > icons or selecting from the control pane at the bottom of the screen.
<param ve-knightlab-timeline source="1mlXQQ3VKfeYznV2VktShOQd2-7aH5p52_n20LQ1U0uE" timenav-position="bottom" hash-bookmark="false" initial-zoom="1" height="800">

## Links
Links appear throughout the narrative text. Links to external sources will open in a new tab and be indicated with an [arrow] icon. Other links will either provide additional information regarding the highlighted term, or it will affect the component pane, for example zooming an image to the relevant site. When you encounter an endnote, click on it to see the note. You will be brought to the relevant note at the end of the text, with a link to a return to the relevant paragraph. 
<param ve-graphic url="Links.gif">

## Cite this essay
Clicking the “Cite this essay” button in the essay header will launch a pop-up window with the citation of the current essay in three formats: MLA, APA, and Chicago. Click “Copy” of the format you’re using to copy the citation to your clipboard and paste it wherever you are managing references.  
<param ve-image url="cite_this.jpg">

# Plant Search

## From a Narrative
Clicking the “More resources” button in the essay header will launch a new window with Plant Search results for the plant discussed in that essay.
<param ve-image fit="contain" url="more_resources.jpg">

## From the Homepage
Enter your search on the home page. Select your language (the default is set to English) and enter your term or topic. Plant Search looks specifically for entities such as plants, people, places, and subjects. As you type, topics and suggestions will appear. If no suggestions appear, there are no results for your search terms and you should try different terms.
<param ve-image fit="contain" url="search_from_home.jpg">

When you have selected a search term, the search results will appear. Search results combine data and results from multiple sources. At the top of the search results is the search term itself, its QID or unique WikiData identifier, alternate names or synonyms for the term, and the term’s category. Below this is a short description coupled with an image, followed by links to the source entry from Wikipedia, WikiData, and WikiMedia Commons. Below this general information is a set of expandable components. Components on the left present data from WikiData; those on the right collect primary and secondary resources from a variety of sites (including this one!). Not all components will appear on every results page-some components appear only on certain plant-associated results.
<param ve-image fit="contain" url="search_home.jpg">

**Taxon Properties:** WikiData properties are statements consisting of data about the topic. The data that appear are entirely contextual-for example, birth and death dates may appear in a person’s page, while geographic coordinates or population may appear on a city’s page. Properties are listed alphabetically.  
<param ve-image fit="contain" url="search_3.jpg">

**Taxonomy:** When the result is a plant, the plant’s taxonomic information will appear in the first three components.  Taxon Properties describes the current taxon. Taxonomy and Taxon Children show above and below the taxon in the taxonomic hierarchy. 
<param ve-image fit="contain" url="search_4.jpg">

**From Related Items:** Lists other WikiData entries that refer to this entry. For example, the sunflower results page identifies paintings and artwork that depict sunflowers.
<param ve-image fit="contain" url="search_6.jpg">

**External Sources:** Links to the term’s unique identifiers in other databases.
<param ve-image fit="contain" url="search_7.jpg">

**Global Plants:** Shows and links to type specimens for the related species from JSTOR Global Plants.
<param ve-image fit="contain" url="search_8.jpg">

**Journal Content:** Journal articles mentioning or about the relevant topic are listed and linked in this component. The JSTOR tab shows articles from, you guessed it, JSTOR-access to those articles are based on your access to JSTOR.The Wikidata tab shows articles from other sources with this term listed as a topic mentioned in Wikidata.
<param ve-image fit="contain" url="search_9.jpg">

**Images:** Images related to this topic from Artstor, Creative Commons, and WikiData are displayed and linked to.
<param ve-image fit="contain" url="search_10.jpg">

**Mentioned Entities:** Listed here are people, places, works, and other entities that this entity mentions or refers to in its Wikipedia entry.
<param ve-image fit="contain" url="search_11.jpg">

**Visual Essays:** When there is a Plant Humanities Lab plant narrative about this topic or plant, it is listed here.
<param ve-image fit="contain" url="sunflowerwiki.jpg">

If you are interested in creating your own plant narrative or other visual essay, please refer to the documentation for [Juncture,](http://labs.jstor.org/projects/juncture/) a new, open-source tool developed by JSTOR Labs that helps researchers and students make complex arguments and tell compelling stories.
<param ve-image fit="contain" url="juncture.jpg">

