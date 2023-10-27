<template>

  <div class="osd" id="osd" ref="root">
    <ve-media v-if="specimens.length > 0" 
      :grid="manifests.length > 1" 
      :caption="caption"
      :right="props.right"
      :left="props.left"
      :full="props.full"
      :width="props.width"
      :height="props.height"
    >
      <ul>
        <li v-for="manifest in manifests" :key="manifest.id || manifest['@id']" v-html="manifest.id || manifest['@id']"></li>
      </ul>
    </ve-media>
  </div>

</template>
  
<script setup lang="ts">

  import { computed, onMounted, ref, toRaw, watch } from 'vue'

  import * as jsonld from 'jsonld'

  const props = defineProps({
    eid: { type: String },
    qid: { type: String },
    jpid: { type: String },
    wdid: { type: String },
    taxonName: { type: String },
    caption: { type: String },
    max: { type: Number, default: 1 },

    // Positioning props
    full: { type: Boolean },
    left: { type: Boolean  },
    right: { type: Boolean },
    sticky: { type: Boolean  },
    width: { type: String },
    height: { type: String }
  })

  const root = ref<HTMLElement | null>(null)

  const specimens = ref<any[]>([])
  const manifests = ref<any[]>([])

  watch(specimens, async () => {
    // console.log('specimens', toRaw(specimens.value))
    manifests.value = await Promise.all(
      ((specimens.value?.length === 1 ? [specimens.value[0]] : specimens.value || [])).map((specimen:any) => {
        return fetch(`${iiifService}/manifest/`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(metadata(specimen))
          }).then(resp => resp.json())
        })
      )
  })
  // watch(manifests, () => console.log('manifests', toRaw(manifests.value)))

  const caption = computed(() => props.caption || (specimens.value?.length > 0 ? specimens.value[0].description : '') )
  // watch(caption, () => console.log('caption', toRaw(caption.value)))

  onMounted(() => findSpecimens())

  const sparqlEndpoint = 'https://cy9in0xsv5.execute-api.us-east-1.amazonaws.com/prod/sparql'
  const iiifService = 'https://iiif.juncture-digital.org'

  const sparql = `
    PREFIX jwd: <http://kg.jstor.org/entity/>
    PREFIX jwdt: <http://kg.jstor.org/prop/direct/>
    PREFIX jp: <http://kg.jstor.org/prop/>
    PREFIX jps: <http://kg.jstor.org/prop/statement/>
    PREFIX jpq: <http://kg.jstor.org/prop/qualifier/>
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX schema: <http://schema.org/>
    CONSTRUCT {
      ?specimen jwdt:P1660 ?specimenOf ;
                schema:description ?description ;
                rdf:type jwd:Q14316 ;
                jwdt:P1663 ?collectionDate ;
                jwdt:P1662 ?collector ;
                jwdt:P1665 ?locationCollected ;
                jwdt:P1106 ?jstorPlantsId ;
                jwdt:P1661 ?specimenType ;
                jwdt:P501 ?taxonName ;
                jwdt:P1666 ?availableAt ;
                jp:P1467 ?img .
      ?img jps:P1467 ?url ; jpq:P1669 ?imgSize .
      ?availableAt jps:P1666 ?wdID ; rdfs:label ?herbariumName .
      ?locationCollected jps:P1665 ?locId ; rdfs:label ?locationName ; wdt:P6766 ?wofId .
    } WHERE {
      ?specimen jwdt:P17 jwd:Q14316 ;
              <<SELECTOR>>
              schema:description ?description ;
              jwdt:P1106 ?jstorPlantsId ;
              jwdt:P501 ?taxonName ;
              jp:P1467 [ jps:P1467 ?img ;
                        jpq:P1669 ?imgSize ] .
      FILTER(?imgSize = 'best')
      OPTIONAL { ?specimen jwdt:P1661 ?specimenType . }
      OPTIONAL { ?specimen jwdt:P1660 ?specimenOf . }
      OPTIONAL { ?specimen jwdt:P1663 ?collectionDate . }
      OPTIONAL { ?specimen jwdt:P1662 ?collector . }
      OPTIONAL {
          ?specimen jwdt:P1665 ?locationCollected .
          SERVICE <https://query.wikidata.org/sparql> {
              ?locationCollected rdfs:label ?locationName .
              FILTER(LANG(?locationName) = 'en')
              OPTIONAL { ?locationCollected wdt:P6766 ?wofId . }
          }
      }        
      OPTIONAL {
          ?specimen jwdt:P1666 ?availableAt .
          SERVICE <https://query.wikidata.org/sparql> {
              ?availableAt rdfs:label ?herbariumName .
              FILTER(LANG(?herbariumName) = 'en')
          }
      }
    }
    LIMIT <<LIMIT>>`

  const context = {
    '@context': {
      'jwd': 'http://kg.jstor.org/entity/',
      'jwdt': 'http://kg.jstor.org/prop/direct/',
      'jp': 'http://kg.jstor.org/prop/',
      'jps': 'http://kg.jstor.org/prop/statement/',
      'jpq': 'http://kg.jstor.org/prop/qualifier/',
      'rdfs':  'http://www.w3.org/2000/01/rdf-schema#',
      'schema': 'http://schema.org/',
      'wd': 'http://www.wikidata.org/entity/',
      'wdt': 'http://www.wikidata.org/prop/direct/',
      'xsd': 'http://www.w3.org/2001/XMLSchema#',
      'Specimen': 'jwd:Q14316',
      'id': '@id',
      'collectionDate': {
          '@id': 'jwdt:P1663',
          '@type': 'xsd:dateTime'
      },
      'collector': {
          '@id': 'jwdt:P1662',
          '@container': '@set'
      },
      'description': {
          '@id': 'schema:description',
          '@language': 'en'
      },
      'herbarium': {
          '@id': 'jwdt:P1666',
          '@type': '@id'
      },
      'images': {
          '@id': 'jp:P1467',
          '@type': '@id',
          '@container': '@set'
      },
      'imgSize': {
          '@id': 'jpq:P1669'
      },
      'instance of': {
          '@id': 'jwdt:P17',
          '@type': '@id'
      },
      'jstorPlantsId': {
          '@id': 'jwdt:P1106'
      },
      'locationCollected': {
          '@id': 'jwdt:P1665'
      },
      'label': {
          '@id': 'rdfs:label',
          '@language': 'en'
      },
      'specimenOf': {
          '@id': 'jwdt:P1660',
          '@type': '@id'
      },
      'specimenType': {
          '@id': 'jwdt:P1661'
      },
      'taxonName': {
          '@id': 'jwdt:P501'
      },
      'wofId': {
          '@id': 'wdt:P6766'
      }
    }
  }

  async function findSpecimens() {
    let selector = props.jpid
      ? `jwdt:P1106 "${props.jpid}" ;`
      :  props.eid || props.qid || props.wdid
        ? `jwdt:P1660 <http://www.wikidata.org/entity/${props.eid || props.qid || props.wdid}> ;`
        : `jwdt:P501 "${props.taxonName}" ;`
    let query = sparql.replace(/<<SELECTOR>>/, selector).replace(/<<LIMIT>>/, `${props.max}`)
    // console.log(query)
    let resp:any = await doSparqlQuery(query)
    if (!resp['@graph']) {
      delete resp['@context']
      specimens.value = [resp]
    } else {
      specimens.value = (await doSparqlQuery(query))['@graph']
    }
  }

  async function doSparqlQuery(query:string) {
    let resp = await fetch(sparqlEndpoint, {
      method: 'POST', body: new URLSearchParams({query}),
      headers: { Accept: 'text/plain', 'Content-type': 'application/x-www-form-urlencoded' }
    })
    let rdf = await resp.text()
    let jld = await jsonld.fromRDF(rdf, { format: 'application/n-quads' })
    return jsonld.frame(jld, {'@context': context, '@type': 'Specimen'})
  }

  function metadata(specimen:any) {
    let bestImgUrl = specimen.images.find((img:any) => img.imgSize === 'best').id
    let rftId = bestImgUrl.match(/rft_id=([^&]*)/)[1]
    let data:any = {url: `${iiifService}/gp-proxy${rftId}`}
    if (specimen.taxonName) data['Taxon name'] = specimen.taxonName
    if (specimen.jstorPlantsId) data['Global Plants ID'] = specimen.jstorPlantsId
    if (specimen.description) data['Description'] = specimen.description
    if (specimen.description) data['Label'] = specimen.description
    if (specimen.specimenType) data['Specimen type'] = specimen.specimenType
    if (specimen.collector) data['Collector'] = specimen.collector.join('; ')
    if (specimen.locationCollected) data['Location collected'] = specimen.locationCollected.label
    if (specimen.collectionDate) data['Date collected'] = specimen.collectionDate
    if (specimen.herbarium) data['Herbarium'] = specimen.herbarium.label
    return data
  }

</script>

<style>
</style>