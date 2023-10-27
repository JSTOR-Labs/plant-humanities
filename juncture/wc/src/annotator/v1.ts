import { default as Annotorious } from '@recogito/annotorious-openseadragon'
import { sha256 } from '../utils'

const ENV = location.hostname === 'localhost' ? 'DEV' : 'PROD'
// const annotationsEndpoint = ENV === 'DEV' ? 'http://localhost:8000' : 'https://api.juncture-digital.org'
const annotationsEndpoint = 'https://api.juncture-digital.org'

export class Annotator {

  osd: any
  base: string
  imageId:string = ''
  annotorious: any
  visible = false
  ghAuthToken = ''
  selected:any = null

  constructor(osd:any, base:string='', editable:boolean=true) {
    this.osd = osd
    this.base = base
    this.annotorious = Annotorious(osd, {readOnly: !editable})
    this.annotorious.on('createAnnotation', async (anno:any) => this.createAnnotation(anno))
    this.annotorious.on('updateAnnotation', async (anno:any) => this.updateAnnotation(anno))
    this.annotorious.on('deleteAnnotation', async (anno:any) => this.deleteAnnotation(anno))
    this.annotorious.on('selectAnnotation', async (anno:any) => this.onSelect(anno))
    this.setVisible(true)
    this.ghAuthToken = localStorage.getItem('gh-auth-token') || ''
    // console.log(`Annotator: base=${base} readOnly=${this.annotorious.readOnly} authenticated=${this.ghAuthToken !== ''}`)
  }

  async loadAnnotations(imageId:string) {
    this.imageId = imageId
    this.setVisible(false)
    let annotations = []
    let url = `${annotationsEndpoint}/annotations/${this.base}/${imageId}/`
    // console.log(`Annotator.loadAnnotations: ${url}`)
    let resp:any = await fetch(url)
    if (resp.ok) {
      resp = await resp.json()
      annotations = resp.annotations
      if (resp.annotations.length > 0) {
        annotations = resp.annotations.map((anno:any) => {
          anno.id = anno.id.split('/').filter((pe:string) => pe).pop()
          return anno
        })
        console.log(`Adding ${resp.annotations.length} annotations`)
      }
    }
    this.annotorious.setAnnotations(annotations)
    if (this.annotorious.readOnly) {
      annotations.forEach((anno: any) => {
        let annoEl = this.annoEl(anno.id)
        if (annoEl) {
          annoEl.addEventListener('mouseenter', () => this.select(anno.id))
          annoEl.addEventListener('mouseleave', () => this.deselect())
          annoEl.addEventListener('click', () => navigator.clipboard.writeText(anno.id) )
        }
      })
    }
    return annotations
  }

  setVisible(visible:boolean) {
    if (this.selected) {
      this.deselect()
    } else {
      this.visible = visible
      // console.log('setVisible', this.visible, this.annotorious.readOnly)
      let el = this.osd.element.querySelector('.a9s-annotationlayer') as HTMLElement
      if (el) el.style.visibility = this.visible ? 'visible' : 'hidden';
        (Array.from(this.osd.element.querySelectorAll(`.a9s-annotation`)) as HTMLElement[])
          .forEach(el => el.style.visibility = this.visible ? 'visible' : 'hidden')
    }
  }

  toggleVisibility(evt:MouseEvent) {
    console.log('toggleVisibility')
    if (evt) evt.stopPropagation()
    this.setVisible(!this.visible)
  }

  onSelect(anno:any) {
    // console.log(`annotator.onSelect=${anno.id}`)
    this.selected = anno.id
    if (navigator.clipboard) navigator.clipboard.writeText(this.selected)
  }

  annoEl(annoId:string) {
    return this.osd.element.querySelector(`[data-id="${annoId}"]`) as HTMLElement
  }

  select(annoId:string) {
    // console.log(`annotator.select=${annoId}`, this.selected?.id)
    if (annoId !== this.selected?.id) {
      this.deselect() 
      this.selected = this.annotorious.selectAnnotation(annoId)
      if (this.selected) {
        let annoEl = this.annoEl(annoId)
        if (annoEl) annoEl.style.visibility = 'visible'
      }
    } else {
      this.deselect() 
    }
  }

  deselect() {
    (Array.from(this.osd.element.querySelectorAll(`.a9s-annotation`)) as HTMLElement[])
    .forEach(el => el.style.visibility = this.visible ? 'visible' : 'hidden')
    this.annotorious.selectAnnotation()
    this.selected = undefined
  }

  async createAnnotation(anno:any) {
    anno.id = sha256(anno.id).slice(0,8)
    anno.target.id = this.imageId
    console.log('createAnnotation', anno)
    let resp = await fetch(`${annotationsEndpoint}/annotation/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json;profile="http://www.w3.org/ns/anno.jsonld',
        // Accept: 'application/ld+json;profile="http://www.w3.org/ns/anno.jsonld',
        Authorization: `Token: ${this.ghAuthToken}`
      },
      body: JSON.stringify({annotation: anno, path: `${this.base}/${this.imageId}`})
    })
    if (resp.ok && resp.status === 201) {
      let annotation = await resp.json()
      this.annotorious.addAnnotation(annotation)
    } else {
      console.log(`createAnnotation: unexpected resp_code=${resp.status}`)
    }
  }

  async updateAnnotation(anno:any) {
    anno.target.id = this.imageId
    let url = `${annotationsEndpoint}/annotation/${this.base}/${this.imageId}/${anno.id.split('/').pop()}/`
    console.log(`updateAnnotation: url=${url}`)
    let resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/ld+json;profile="http://www.w3.org/ns/anno.jsonld',
        // Accept: 'application/ld+json;profile="http://www.w3.org/ns/anno.jsonld',
        Authorization: `Bearer: ${this.ghAuthToken}`
      },
      body: JSON.stringify(anno)
    })
    if (resp.status !== 202) {
      console.log(`updateAnnotation: unexpected resp_code=${resp.status}`)
    }
  }

  async deleteAnnotation(anno:any) {
    let resp = await fetch(`${annotationsEndpoint}/annotation/${this.base}/${this.imageId}/${anno.id.split('/').pop()}/`, {
      method: 'DELETE',
      headers: {Authorization: `Bearer: ${this.ghAuthToken}`}
    })
    if (resp.status !== 204) {
      console.log(`deleteAnnotation: unexpected resp_code=${resp.status}`)
    }
  }

}

