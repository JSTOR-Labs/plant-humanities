<template>

<div ref="root" :style="{width: '100%', height: '100%'}">
  <div class="content">
    <div id="lat-lng-zoom" v-html="latLngZoom" @click="copyTextToClipboard(`${latLngZoom}`)"></div>
    <div id="map"></div>
    <div v-if="caption" id="caption" v-html="caption"></div>
  </div>
</div>

</template>
  
<script setup lang="ts">

  import { computed, nextTick, onMounted, ref, toRaw, watch } from 'vue'
  import L, { LatLng } from 'leaflet'
  import { GestureHandling } from 'leaflet-gesture-handling'
  import '../lib/leaflet-opacity.js'

  import { isQID, getEntity, getManifest, kebabToCamel, metadataAsObj, isMobile, makeSticky } from '../utils'
  import { GithubClient } from '../gh-utils'
  import '@shoelace-style/shoelace/dist/components/range/range.js'
  import '../lib/turf.min.js'
  const turf:any = (window as any).turf

  const markerIconTemplate = {
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize:  [41, 41]
  }

  const props = defineProps({
    overlay: { type: String },
    zoom: { type: Number, default: 2 },
    center: { type: String, default: '55.4,6.7' },
    marker: { type: Boolean },
    basemaps: { type: String, default: 'OpenStreetMap' },
    caption: { type: String },
    width: { type: String },
    height: { type: String },
    sticky: { type: Boolean },
    full: { type: Boolean },
    left: { type: Boolean },
    right: { type: Boolean },
    entities: { type: String },
    preferGeojson: { type: Boolean },
    popupOnHover: { type: Boolean },
    zoomOnClick: { type: Boolean },
    scrollWheelZoom: { type: Boolean },
    cards: { type: String },
    essayBase: { type: String }
  })

  const baseMapsConfigs:any = {
    CartoDB_DarkMatter: ['https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    CartoDB_DarkMatterNoLabels: ['https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    CartoDB_DarkMatterOnlyLabels: ['https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    CartoDB_Positron: ['https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    CartoDB_PositronNoLabels: ['https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    CartoDB_PositronOnlyLabels: ['https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],    
    CartoDB_Voyager: ['https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20 }],
    CartoDB_VoyagerNoLabels: ['https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    CartoDB_VoyagerOnlyLabels: ['https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20}],
    CartoDB_VoyagerLabelsUnder: ['https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	        subdomains: 'abcd',
	        maxZoom: 20 }],
    Esri_DeLorme: ['https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Copyright: &copy;2012 DeLorme',
          minZoom: 1,
          maxZoom: 11 }],
    Esri_NatGeoWorldMap: ['https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
          maxZoom: 16 }],
    Esri_OceanBasemap: ['https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        maxZoom: 13 }],
    Esri_WorldGrayCanvas: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16 }],
    Esri_WorldImagery: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }],
    Esri_WorldPhysical: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 8,
          attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service' }],
    Esri_WorldShadedRelief: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
	        maxZoom: 13 }],
    Esri_WorldStreetMap: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012' }],
    Esri_WorldTerrain: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
	        maxZoom: 13 }],
    Esri_WorldTopoMap: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' }],
    MtbMap: ['http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS' }],
    OpenStreetMap: ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18, 
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }],
    OpenStreetMap_DE: ['https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
	        maxZoom: 18,
	        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }],
    OpenStreetMap_France: ['https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	        maxZoom: 20,
	        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }],
    OpenStreetMap_HOT: ['https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
          maxZoom: 19 }],
    OpenStreetMap_Mapnik: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19 }],
    OpenTopoMap: ['https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          maxZoom: 17,
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' }],
    OPNVKarte: ['https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
          attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18}],
    Stadia_AlidadeSmooth: ['https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 20 }],
    Stadia_AlidadeSmoothDark: ['https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 20 }],
    Stadia_OSMBright: ['https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	        maxZoom: 20 }],
    Stadia_Outdoors: ['https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
          maxZoom: 20,
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' }],
    Stamen_Terrain: ['https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 18,
          ext: 'png' }],
    Stamen_TerrainBackground: ['https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.{ext}', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 18,
          ext: 'png' }],
    Stamen_TerrainLabels: ['https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}{r}.{ext}', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 18,
          ext: 'png' }],
    Stamen_Toner: ['https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
	        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	        subdomains: 'abcd',
	        minZoom: 0,
	        maxZoom: 20,
	        ext: 'png' }],
    Stamen_TonerBackground : ['https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	        subdomains: 'abcd',
	        minZoom: 0,
	        maxZoom: 20,
	        ext: 'png' }],
    Stamen_TonerLite: ['https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 20,
          ext: 'png' }],
    Stamen_Watercolor: ['https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
          subdomains: 'abcd',
          minZoom: 1,
          maxZoom: 16,
          ext: 'jpg',
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }],
    USGS_USTopo : ['https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
	        maxZoom: 20,
	        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'}],
    USGS_USImagery: ['https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	        maxZoom: 20,
	        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'}],
    USGS_USImageryTopo: ['https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
	        maxZoom: 20,
	        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
      }],
  }

  const root = ref<HTMLElement | null>(null)
  // const host = computed(() => (root.value?.getRootNode() as any)?.host as HTMLElement)
  const host = computed(() => (root.value?.getRootNode() as any)?.host)

  const shadowRoot = computed(() => root?.value?.parentNode)
  const content = computed(() => shadowRoot.value?.querySelector('.content') as HTMLElement)

  const githubClient = ref<any>()

  const map = ref<L.Map>() 
  const entities = ref<any[]>([])
  const latLngZoom = ref<String>()
  const layerObjs = ref<any[]>([])
  const layerControl = ref<L.Control.Layers>()
  
  const tileLayers = ref<any[]>()
  const geoJSONs = ref<any>()

  // const geoJsonLayers = ref<L.LayerGroup[]>()

  const zoom = ref(10) 
  const priorLoc = ref<string>()

  const initialized = ref(false) 
  const zoomed = ref()

  const flyto = ref()

  watch(host, () => doLayout())

  onMounted(() => {
    let authToken = window.localStorage.getItem('gh-auth-token') || window.localStorage.getItem('gh-unscoped-token')
    if (authToken) githubClient.value = new GithubClient(authToken)
    evalProps()
    doLayout()
  })

  const position:string = isMobile() ? 'full' : (props.right ? 'right' : props.left ? 'left' : 'full')

  function doLayout() {
    host.value.classList.add('ve-component')
    host.value.classList.add(position)
    if (position === 'full') {
      host.value.style.width = '100%'
    } else {
      host.value.style.float = position
      host.value.style.width = 'calc(50% - 16px)'
    }
    host.value.style.width = window.getComputedStyle(host.value).width

    if (props.sticky) makeSticky(host.value)

    content.value.style.width = isMobile() ? '100%' : props.width || '100%'
    nextTick(() => {
      let width = parseInt(window.getComputedStyle(content.value).width.slice(0,-2))
      let height = width
      if (props.sticky && position === 'full') {
        let maxStickyHeight = Math.round(window.innerHeight * .4)
        height = Math.min(maxStickyHeight, width)
      } 
      content.value.style.width = `${width}px`
      content.value.style.height = `${height}px`
      host.value.style.height = `${props.caption ? height + 32 : height}px`
      init()
    })
  }

  watch(props, () => evalProps())

  function evalProps() {
    zoom.value = props.zoom 
    if (props.cards) parseCards()
  }

  function parseCards() {
    let cardLocations: any[] = []
    if (props.cards) {
      let cardsEl = document.getElementById(props.cards)
      if (cardsEl) {
        cardsEl.querySelectorAll('.card').forEach(async card => {
          let coords:string = Array.from(card.querySelectorAll('li'))
            .filter(li => li.innerHTML.trim().indexOf('coords:') === 0)
            .map(coordsEl => coordsEl.innerHTML.split(':')[1].trim())
            .pop() || ''
          if (coords) {
            let metadataUl = card.querySelector('ul.card-metadata')
            if (metadataUl) metadataUl.parentElement?.removeChild(metadataUl)
            cardLocations.push({coords: latLng(coords), caption: card.innerHTML})
          }
        })
      }
    }
    if (cardLocations.length > 0) layerObjs.value = [...layerObjs.value, ...cardLocations]
  }

  watch(layerObjs, async () => {
    let _layerObjs = await Promise.all(layerObjs.value)
    // console.log(toRaw(_layerObjs))

    let geojsonUrls = _layerObjs
      .filter(item => item.geojson && item.preferGeojson)
      .map (item => {
        if (item.geojson.indexOf('http') !== 0) {
          if (item.geojson[0] === '/') {
            let [acct, repo, ...rest] = item.geojson.split('/').filter((pe:string) => pe)
            let path = rest.join('/')
            // let ref = githubClient.value ? await githubClient.value.defaultBranch(acct, repo) : 'main'
            let ref = 'main'
            item.geojson = `https://raw.githubusercontent.com/${acct}/${repo}/${ref}/${path}`
          } else {
            item.geojson = `https://raw.githubusercontent.com/${props.essayBase}/${item.geojson}`
          }
        }
        return item
      })
      .map(item => ({url:item.geojson, item}))
    let responses = await Promise.all(geojsonUrls.map(item => fetch(item.url)))
    let _geoJSONs = await Promise.all(responses.map((resp:any) => resp.json()))

    let geojsonsByLayer: any = {}
    for (let i = 0; i < geojsonUrls.length; i++) {
      if (geojsonUrls[i].item.id && /^Q[0-9]+$/.test(geojsonUrls[i].item.id)) {
        geojsonUrls[i].item.qid = geojsonUrls[i].item.id
        delete geojsonUrls[i].item.id
      }
      if (_geoJSONs[i].type === 'FeatureCollection') {
        _geoJSONs[i].features.forEach((feature:any) => feature.properties = {...feature.properties, ...geojsonUrls[i].item})
      } else {
        _geoJSONs[i].properties = {..._geoJSONs[i].properties, ...geojsonUrls[i].item}
      }
      let layerName = geojsonUrls[i].item.layer || 'Locations'
      if (!geojsonsByLayer[layerName]) geojsonsByLayer[layerName] = []
      geojsonsByLayer[layerName].push(_geoJSONs[i])
    }

    let markersByLayer: any = {}
    _layerObjs
      .filter(item => !item.geojson || !item.preferGeojson )
      .filter(item => !item.allmaps )
      .forEach(item => {
        let layerName = item.layer || 'Locations'
        if (!markersByLayer[layerName]) markersByLayer[layerName] = []
        markersByLayer[layerName].push(item)
      })

    _layerObjs
      .filter(item => !item.allmaps )
      .forEach(item => {
        let layerName = item.layer || 'Locations'
        if (geojsonsByLayer[layerName]) {
          if (markersByLayer[layerName]) {
            geojsonsByLayer[layerName].push(toGeoJSON(markersByLayer[layerName]))
            delete markersByLayer[layerName]
          }
        } else {
          geojsonsByLayer[layerName] = [toGeoJSON(markersByLayer[layerName])]
          delete markersByLayer[layerName]
        }
      })

    // console.log(geojsonsByLayer)

    
    tileLayers.value = _layerObjs
      .filter(ls => ls.allmaps)
      .map(ls => ({
          name: ls.layer || 'Image layer',
          disabled: ls.disabled,
          layer:  L.tileLayer(`https://allmaps.xyz/maps/${ls.allmaps}/{z}/{x}/{y}.png`, {
            maxZoom: 19, 
            attribution: '<a href="https://allmaps.org">Allmaps</a>',
          })
        })
      )

      geoJSONs.value = geojsonsByLayer
  })

  watch(tileLayers, () => updateMap())
  watch(geoJSONs, () => updateMap())
  watch(map, () => updateMap())

  function init() {
    if (initialized.value) return
    initialized.value = true

    entities.value = props.entities ? props.entities.split(/\s+/).filter(qid => qid) : []
    if (props.cards) {
      let locations: any[] = []
      let cardsEl = document.getElementById(props.cards)
      if (cardsEl) {
        cardsEl.querySelectorAll('.card').forEach(async card => {
          let coords:string = Array.from(card.querySelectorAll('li'))
            .filter(li => li.innerHTML.trim().indexOf('coords:') === 0)
            .map(coordsEl => coordsEl.innerHTML.split(':')[1].trim())
            .pop() || ''
          if (coords) {
            let metadataUl = card.querySelector('ul.card-metadata')
            if (metadataUl) metadataUl.parentElement?.removeChild(metadataUl)
            locations.push({coords: latLng(coords), caption: card.innerHTML})
          }
        })
      }
      // layerObjs.value = locations
      layerObjs.value = [...layerObjs.value, ...locations]
    }
    getLayerStrings()
    listenForSlotChanges()

    const resizeObserver = new ResizeObserver(() => initMap())
    let mapEl = shadowRoot.value?.querySelector('#map')
    if (mapEl) resizeObserver.observe(mapEl)
    // initMap()
    addInteractionHandlers()
  }

  async function initMap() {
    let center: L.LatLng
    if (props.center) {
      if (isQID(props.center)) {
        let entity = await getEntity(props.center)
        center = latLng(entity.coords)
      } else {
        center = latLng(props.center)
      }
    } else if (props.entities) {
      let entity = await getEntity(entities.value[0])
      center = latLng(entity.coords)
      zoom.value = 9
    } else {
      center = new L.LatLng(0, 0)
      zoom.value = 6
    }

    if (map.value) {
      map.value.off()
      map.value.remove()
      let mapEl = shadowRoot.value?.querySelector('#map') as HTMLElement
      let newMapEl = document.createElement('div')
      newMapEl.id = 'map'
      mapEl?.replaceWith(newMapEl)
    }
    let mapEl = shadowRoot.value?.querySelector('#map') as HTMLElement
    if (mapEl) {
      if (isMobile()) L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
      mapEl.style.cursor = 'default'
      let _basemaps = props.basemaps.split(',').map(name => {
        let [url, options] = baseMapsConfigs[name]
        return [name.replace(/_/,' '), L.tileLayer(url, options)]
      })
      let mapOptions: any = {
        preferCanvas: false,
        zoomSnap: 0.1,
        center, 
        zoom: zoom.value,
        zoomAnimation: true,
        // scrollWheelZoom: props.scrollWheelZoom,
        gestureHandling: isMobile(),
        layers: [_basemaps[0][1] as L.Layer]
      }
      map.value = L.map(mapEl, mapOptions)

      if (_basemaps.length > 1 || Object.keys(geoJSONs.value || {}).length > 1)
      layerControl.value = L.control.layers(Object.fromEntries(_basemaps), {}).addTo(map.value)
      map.value.on('click', (e) => {
        getLatLngZoom(e)
        if (latLngZoom.value) copyTextToClipboard(latLngZoom.value?.split(' ')[0])
        if (props.zoomOnClick) gotoPriorLoc()
      })
      map.value.on('zoomend', (e) => {
        getLatLngZoom(e as L.LeafletMouseEvent)
        if (flyto.value) flyto.value.layer.openPopup()
      })
      map.value.on('movestart', () => mapEl.style.cursor = 'move')
      map.value.on('moveend', (e) => {
        mapEl.style.cursor = 'default'
        getLatLngZoom(e as L.LeafletMouseEvent)
      })
      map.value.on('layeradd', e => {
        if ((e.layer as any).feature) {
          let geoJSON = e.layer as L.GeoJSON
          if (geoJSON.feature?.type == 'Feature' && geoJSON.feature?.properties.qid) {
            geoJSON.feature
          }
        }
        // if (layer.feature?.properties.qid) {}
      })
      latLngZoom.value = `${Number((center.lat).toFixed(5))},${Number((center.lng).toFixed(5))} ${zoom.value}`
      priorLoc.value = `${Number((center.lat).toFixed(5))},${Number((center.lng).toFixed(5))},${zoom.value}`
    }
  }

  function getLatLngZoom(e:L.LeafletMouseEvent) {
    let point = e.type === 'click' ? e.latlng : e.target.getCenter()
    let zoom = e.target.getZoom()
    let resp = [point.lat, point.lng, zoom]
    latLngZoom.value = `${Number((point.lat).toFixed(5))},${Number((point.lng).toFixed(5))} ${zoom}`
    if (!zoomed.value) priorLoc.value = `${Number((point.lat).toFixed(5))},${Number((point.lng).toFixed(5))},${zoom}`
    return resp
  }

  function toGeoJSONLayer(data:any) {
    return L.geoJSON(data, {
      pointToLayer: (feature, _latlng) => {
        const _props = feature.properties
        let iconOptions:any = {...markerIconTemplate}
        if (feature.properties.icon) iconOptions.iconUrl = feature.properties.icon
        if (feature.properties.shadowUrl)  iconOptions.shadowUrl = feature.properties.shadowUrl
        if (feature.properties.iconRetinaUrl)  iconOptions.iconRetinaUrl = feature.properties.iconRetinaUrl

        if (_props['markerType'] === 'circle') {
          return L.circleMarker(_latlng, { radius: _props.radius || 4 })
        } else {
          // return makeMarker(latLng, _props)
          return L.marker(_latlng, { icon: new L.Icon(iconOptions) })
        }
      },
      onEachFeature: async (feature, layer) => {
        let fg: L.GeoJSON = layer as L.GeoJSON
        if (!feature.properties.coords) {
          if (fg.feature?.bbox) {
            let center = fg.getBounds().getCenter()
            feature.properties.coords = `${center.lat},${center.lng}`
          } else if (feature.geometry.type === 'Polygon') {
            let center = turf.centroid(feature)
            feature.properties.coords = `${center.geometry.coordinates[1]},${center.geometry.coordinates[0]}`
          }
        }

        // Bind popup
        if (feature.properties.qid) {
          let entityData = await getEntity(feature.properties.qid)
          feature.properties.entityData = entityData
          let serializedEntityData = JSON.stringify(entityData).replace(/"/g, '&quot;')
          let html = `<ve-info-card data="${serializedEntityData}" style="width:100%;"></ve-info-card>`
          layer.bindPopup(html)
        } else {
          let featureData = JSON.stringify(feature.properties).replace(/"/g, '&quot;')
          let html = `<ve-info-card data="${featureData}" style="width:100%;"></ve-info-card>`
          layer.bindPopup(html)
        }

        if (props.popupOnHover) {
          layer.on('mouseover', () => layer.openPopup())
          layer.on('mouseout', () => layer.closePopup())
        }
      
        layer.on('click', () => {
          if (zoomed.value) {
            layer.closePopup()
            zoomed.value = undefined
          } else {
            layer.openPopup()
            zoomed.value = {}
            if (props.zoomOnClick) flytoLocation(feature.properties.coords)
          }
        })
      },
      style: (feature) => {
        const featureProps = feature?.properties
        const _geometry = feature?.geometry.type
        for (let [prop, value] of Object.entries(featureProps)) {
          if (value === 'null') featureProps[prop] = null
        }
        const style = {
          color: featureProps.color || '#FB683F',
          weight: featureProps.weight || (_geometry === 'Polygon' || _geometry === 'MultiPolygon' ? 0 : 4),
          opacity: featureProps.opacity || 1,                  
          fillColor: featureProps.fillColor || '#32C125',
          fillOpacity: featureProps.fillOpacity || 0.5,
        }
        return style
      }
    })
  }

  function makeMarker(_latlng:any, _props:any) {
    // const faIcon = iconMap[props['marker-symbol']] || props['marker-symbol'] || 'circle'
    return L.marker(_latlng, {
      /*
      icon: L.icon.fontAwesome({
        iconClasses: `fa fa-${faIcon}`, // you _could_ add other icon classes, not tested.
        markerColor: _props['marker-color'] || _props['fill'] || '#2C84CB',
        markerFillOpacity: _props['opacity'] || 1,
        markerStrokeColor: _props['stroke'] || _props['marker-color']|| _props['fill'] || '#2C84CB',
        markerStrokeWidth: _props['stroke-width'] || 0,
        iconColor: _props['marker-symbol-color'] || '#FFF',
        iconXOffset: _props['marker-symbol-xoffset'] || 0,
        iconYOffset: _props['marker-symbol-yoffset'] || 0,
      }),
      */
      // id: _props.qid
    })
  }

  let mapUpdated = false
  function updateMap() {
    if (map.value && geoJSONs.value && tileLayers.value && !mapUpdated) {
      mapUpdated = true
      let geoJsonLayers = Object.keys(geoJSONs.value || {})
      let numTileLayers = tileLayers.value ? tileLayers.value.length : 0

      // console.log(`updateMap: geoJsonLayers=${geoJsonLayers.length} tileLayers=${numTileLayers}`)

      if (!layerControl.value && (
            (geoJsonLayers.length > 1 || geoJsonLayers.length === 1 && geoJsonLayers[0] !== 'Locations') ||
            numTileLayers > 0
        )) {
        layerControl.value = L.control.layers(Object.fromEntries([]), {}).addTo(map.value)
      }

      Object.keys(geoJSONs.value || {}).forEach(layerName => {
        let layerGroup: any = new L.LayerGroup()
        let isDisabled = false
        geoJSONs.value[layerName].forEach((data:any) => {
          let geoJSONLayer = toGeoJSONLayer(data)
          layerGroup.addLayer(geoJSONLayer)
          if (data.properties?.disabled) isDisabled = true
        })
        if (!isDisabled) {
          map.value?.addLayer(layerGroup)
        }
        if (layerControl.value) layerControl.value.addOverlay(layerGroup, layerName)
      })

      let opacityLayers: any = {}
      tileLayers.value?.forEach(item => {
        if (layerControl.value) layerControl.value.addOverlay(item.layer, item.name)
        if (!item.disabled) map.value?.addLayer(item.layer)
       opacityLayers[item.name] = item.layer
      })
       
      if (Object.keys(opacityLayers).length > 0) {
        (L.control as any).opacity(opacityLayers, {
          label: null,
          collapsed: true,
          position: 'topright' // topleft or topright or bottomleft or bottomright
        }).addTo(map.value)
      }
  
    }

  }

  function toGeoJSON(locations:any[]):any {
    // @ts-ignore
    const data: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] }
    locations.filter(location => location.coords)
      .forEach(location => {
        let [lat, lng] = location.coords.split(',').map((val:string) => parseFloat(val.trim()))
        data.features.push({
          type: 'Feature',
          properties: location,
          geometry: { type: 'Point', coordinates: [lng, lat] }
        })
      })
    return data
  }
  
  async function getLayerStrings() {
    let _layerObjs = Array.from(host.value.querySelectorAll('li')).map((item:any) => toObj(item.firstChild?.textContent))
    if (props.marker && props.center) {
      if (isQID(props.center)) {
        let entity = await getEntity(props.center)
        _layerObjs.push(Promise.resolve(entityToInfoObj(entity)))
      } else {
        _layerObjs.push(Promise.resolve({coords: props.center, zoom: props.zoom || 10}))
      }
    }
    // layerObjs.value = _layerObjs
    layerObjs.value = [...layerObjs.value, ..._layerObjs]
  }

  function listenForSlotChanges() {
    const callback = (mutationsList:any) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && Array.from(mutation.target.classList).indexOf('hydrated') >= 0) {
          getLayerStrings ()       
        }
      }
    }
    const observer = new MutationObserver(callback);
    observer.observe(host.value, { childList: true, subtree: true, characterData: true })
  }

  function isCoords(str:string) {
    return /^[+-]?\d+(.\d*|\d*),{1}[+-]?\d+(.\d*|\d*)$/.test(str)
  }

  function isZoom(str:string) {
    return /^\d{1,2}(\.\d{1})?$/.test(str)
  }

  function isInt(str:string) {
    return /^[0-9]+$/.test(str)
  }

  function tokenize(s:string) {
    s = s || ''
    let tokens:string[] = []
    s = s.replace(/“/,'"').replace(/”/,'"').replace(/’/,"'")
    let match = s.match(/[^\s"]+|"([^"]*)"/gmi)
    if (match) match.forEach(token => {
      if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
      else tokens.push(token)
    })
    return tokens
  }

  function manifestToInfoObj(manifest:any, id:string) {
    let obj:any = {id}
    let metadata = metadataAsObj(manifest)
    if (metadata.location) obj.coords = metadata.location[0]
    if (metadata.coordinates_of_the_point_of_view) obj.coords = metadata.coordinates_of_the_point_of_view[0]
    if (manifest.label) obj.label = manifest.label.en
    if (manifest.summary) obj.description = manifest.summary.en[0]
    if (manifest.thumbnail) obj.image = manifest.thumbnail[0].id
    return obj
  }

  function entityToInfoObj(entity:any, id:string='') {
    let obj:any = {id: id || entity.id}
    if (entity.coords) obj.coords = entity.coords
    if (entity.geojson) obj.geojson = entity.geojson
    if (entity.label) obj.label = entity.label
    if (entity.description) obj.description = entity.description
    if (entity.thumbnail) obj.image = entity.thumbnail
    return obj
  }

  async function toObj(s:string) {
    let tokens = tokenize(s)
    let geoJsonRegex = /\.(geo)?json$/i
    let iiifRegex = /^[a-z0-9\-]+:.+/
    let obj:any = {}
    let booleans = new Set(['disabled', 'prefer-geojson'])
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i]

      if (token.indexOf('=') > 0) {
        let [key, ...rest] = token.split('=')
        let value = rest.join('=')
        value = '"' && value[value.length-1] === '"' ? value.slice(1,-1) : value

        if (key === 'qid') {
          let entity = await getEntity(token)
          obj = {...entityToInfoObj(entity, token), ...obj}          
        } else if (key === 'iiif') {
          let manifest = await getManifest(token)
          obj = {...manifestToInfoObj(manifest, token), ...obj}
        } else {
          obj[key] = value
        }
      
      } else if (isZoom(token)) {
        obj.zoom = parseInt(token)
      
      } else if (isCoords(token)) {
        obj.coords = token
        obj.id = token
      
      } else if (isQID(token)) {
        let entity = await getEntity(token)
        obj = {...entityToInfoObj(entity, token), ...obj}
      
      } else if (geoJsonRegex.test(token)) {
        obj.geojson = token

      } else if (iiifRegex.test(token)) {
        let manifest = await getManifest(token)
        obj = {...manifestToInfoObj(manifest, token), ...obj}

      } else if (booleans.has(token)) {
        obj[kebabToCamel(token)] = true

      } else {
        let text = token[0] === '"' && token[token.length-1] === '"' ? token.slice(1,-1) : token
        if (obj.label) obj.description = text
        else obj.label = text
      }
    }
    obj.preferGeojson = (obj.preferGeojson || (props.preferGeojson) && obj.geojson ) || (obj.geojson && !obj.coords)
    return obj
  }

  function latLng(coordsStr:string) {
    let [lat, lng] = coordsStr.split(',').map(val => parseFloat(val.trim()))
    return new LatLng(lat, lng)
  }

  function copyTextToClipboard(text: string) {
    if (navigator.clipboard) navigator.clipboard.writeText(text)
  }

  const flytoRegex = RegExp(/^((?<lat>[-?\d.]+),(?<lng>[-?\d.]+)|(?<qid>Q[0-9]+)),?(?<zoom>[\d.]+)?$/)

  function findGeoJSON(id:string='', coords:string='') {
    let features = (Object.values(geoJSONs.value) as any[])
      .map(val => {
        let geoJSON = val[0]
        return geoJSON.type === 'FeatureCollection' ? geoJSON.features : [geoJSON]
      })
      .flat()
    return features.find(feature => feature.id === id || feature.properties?.id === id || feature.properties?.coords === coords
    )
  }

  function parseFlytoArg(arg:string='') {
    arg = arg.replace(/^flyto\|/i,'')
    let id = ''
    let zoom = 10
    let split = arg.split(',')
    if (split.length === 1) {
      id = split[0]
      let geoJSON = findGeoJSON(id)
      zoom = geoJSON?.properties?.zoom || zoom
    } else if (split.length === 2) {
      if (/^[+-]?\d+(.\d*|\d*)$/.test(split[0])) {
        id = split.join(',')
        let geoJSON = findGeoJSON('', id)
        zoom = geoJSON?.properties?.zoom || zoom
      } else {
        id = split[0]
        zoom = parseFloat(split[1])
      }
    } else {
      id = split.slice(0,2).join(',')
      zoom = parseFloat(split[2])
    }

    let layer:any
    map.value?.eachLayer((_layer:any) => {
      if (_layer?.feature?.properties?.id === id || _layer?.feature?.properties?.coords === id) layer = _layer
    })
    if (!layer) map.value?.eachLayer((_layer:any) => layer = _layer)
    return {id, zoom, layer}
  }

  function addInteractionHandlers() {
    let scope = host.value.parentElement
    let added = new Set()
    while (scope.parentElement && scope.tagName !== 'MAIN') {
      scope = scope.parentElement
      Array.from(scope.querySelectorAll('[enter],[exit]') as HTMLElement[]).forEach(el => {
        let veMap = findVeMap(el)
        if (veMap && !added.has(el)) {
          addMutationObserver(el)
          added.add(el)
        }
      })
    }
    
    let el = host.value.parentElement
    while (el?.parentElement && el.tagName !== 'BODY') el = el.parentElement;
  
    if (el) {
      (Array.from(el.querySelectorAll('mark')) as HTMLElement[]).forEach(mark => {
        let match = Array.from(mark.attributes).find(attr => attr.name === 'flyto')
        if (match) {
          let veMap = findVeMap(mark.parentElement)
          if (veMap) {
            let flytoArg = match?.value
            mark.classList.add(match.name)
            mark.addEventListener('click', () => flytoLocation(flytoArg))
            
            if (props.popupOnHover) {
              mark.addEventListener('mouseover', () => {
                let layer = parseFlytoArg(flytoArg).layer
                layer.openPopup()
                if (isMobile()) setTimeout(() => layer.closePopup(), 2000)
              })
              mark.addEventListener('mouseleave', () => {
                flyto.value = parseFlytoArg(flytoArg)
                if (flyto.value.id !== zoomed.value) flyto.value.layer?.closePopup()
              })
            }      
          }
        }
      })
    }
  }

  function addMutationObserver(el: HTMLElement) {
    let prevClassState = el.classList.contains('active')
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName == 'class') {
          let currentClassState = (mutation.target as HTMLElement).classList.contains('active')
          if (prevClassState !== currentClassState) {
            prevClassState = currentClassState
            let attr = el.attributes.getNamedItem(currentClassState ? 'enter' : 'exit')
            if (attr) {
              const [action, ...rest] = attr.value.split(':')
              let arg = rest.join(':')
              // console.log(`${action}=${arg}`)
              if (action === 'flyto') flytoLocation(arg, true)
              if (attr.name === 'exit') gotoPriorLoc()
            }
          }
        }
      })
    })
    // observer.observe(el, {attributes: true})
    observer.observe(el, { attributes: true, childList: true, subtree: true, characterData: true })

  }

  function findVeMap(el: any) {
    let sib = el.previousSibling
    while (sib) {
      if (sib.nodeName === 'VE-MAP') return sib === host.value ? sib : null
      sib = sib.previousSibling
    }
    while (el.parentElement && el.tagName !== 'MAIN') {
      el = el.parentElement
      let veMap = el.querySelector(':scope > ve-map, :scope > p > ve-map, :scope > section > ve-map')
      if (veMap) return veMap === host.value ? veMap : null
    }
  }

  async function flytoLocation(arg: string, force=false) {
    flyto.value = parseFlytoArg(arg)
    if (flyto.value.layer) {
      if (flyto.value.id === zoomed.value && !force) {
        flyto.value.layer.closePopup()
        gotoPriorLoc()
      } else {
        zoomed.value = flyto.value.id
        if (flyto.value.layer.feature?.properties) {
          let center = latLng(flyto.value.layer.feature.properties.coords)
          map.value?.flyTo(center, flyto.value.zoom)
        }
      }
    } else {
      gotoPriorLoc()
    }
  }

  function gotoPriorLoc() {
    flyto.value = null
    if (priorLoc.value) {
      let [lat, lng, zoom] = priorLoc.value.split(',').map(val => parseFloat(val))
      let center = new L.LatLng(lat, lng)
      map.value?.flyTo(center, zoom)
      map.value?.closePopup()
    }
    zoomed.value = undefined
  }

</script>

<style>

  @import 'leaflet/dist/leaflet.css';
  @import 'leaflet.control.opacity/dist/L.Control.Opacity.css';
  @import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

  * { box-sizing: border-box; }

  :host {
    display: flex;
    align-content: center;
    justify-content: center;
    position: relative;
    font-family: Roboto, sans-serif;
    background-color: white;
    margin-bottom: 1rem;
  }

  .content {
    margin: auto;
    /* box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px; */
  }

  #map {
    border: 1px solid #ccc;
    width: 100%;
    height: 100%;
  }
  
  #caption {
    /*
    display: flex;
    align-items: center;
    */
    font-family: sans-serif;
    width: 100%;
    /* background: rgba(0, 0, 0, 0.7); */
    white-space: nowrap;
    background-color: #555;
    color: white;
    padding: 4px 6px;
    bottom: 0;
    height: 32px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  #lat-lng-zoom {
    position: absolute;
    font-family: sans-serif;
    bottom: 24px;
    right: 0;
    width: 150px;
    height: 32px;
    padding: 3px 6px;
    font-size: 0.8rem;
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    z-index: 2;
    opacity: 0;
    text-align: right;
  }

  #lat-lng-zoom:hover {
  visibility: visible;
  opacity: 1;
  transition: all 0.3s ease-in;
  cursor: copy;
  z-index: 1000;
  }

  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr 0px;
    border-radius: 4px;
    padding: 0;
    }
    
  .card p {
    border: none;
    }
    
  .card-image {  /* image */
    grid-area: 1 / 1 / 2 / 2;
    width: 100%;
    height: 190px;
    }
    
  .card-title {  /* title */
    grid-area: 2 / 1 / 3 / 2;
    font-weight: bold;
    font-size: 1.5rem;
    line-height: 1;
    padding: 1.3rem .5rem .2rem .5rem;
    text-decoration: none;
    }
    
  .card-metadata {  /* metadata list */
    grid-area: 3 / 1 / 4 / 2;
    list-style: none;
    padding: .2rem .5rem;
    margin: 0;
    font-size: 0.9rem;
    font-weight: 400;
    }
    
  .card-abstract{  /* abstract */
    grid-area: 4 / 1 / 5 / 2;
    align-self: flex-end;
    height: 110px;
    line-height: 1.4;
    font-size: 1rem;
    padding: .5rem .5rem 0 .5rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    margin: 0 0 .5rem 0;
  }
  
  .leaflet-popup-content {
    width: 280px;
    margin: 0;
  }

  .leaflet-control-layers-toggle {
    background-image: url(https://unpkg.com/leaflet@1.9.3/dist/images/layers.png)
  }
  
  .leaflet-retina .leaflet-control-layers-toggle {
    background-image: url(https://unpkg.com/leaflet@1.9.3/dist/images/layers-2x.png)
  }

</style>