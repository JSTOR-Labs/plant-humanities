import { default as Annotorious } from '@recogito/annotorious-openseadragon'
import { sha256 } from '../utils'
import { GithubClient } from '../gh-utils'

export class Annotator {

  ghClient: any
  osd: any
  base: string
  acct: string
  repo: string
  ref:string = 'main'
  basePath: string
  imageId: string = ''
  sha: string = ''
  annotorious: any
  visible = false
  ghAuthToken = ''
  selected:any = null

  constructor(osd:any, base:string='', editable:boolean=true) {
    this.osd = osd
    this.base = base
    let [acct, repo, ...pathElems] = this.base.split('/')
    this.acct = acct
    this.repo = repo
    this.basePath = pathElems.join('/')
    this.annotorious = Annotorious(osd, {readOnly: !editable})
    this.annotorious.on('createAnnotation', async (anno:any) => this.createAnnotation(anno))
    this.annotorious.on('updateAnnotation', async (anno:any) => this.updateAnnotation(anno))
    this.annotorious.on('deleteAnnotation', async (anno:any) => this.deleteAnnotation(anno))
    this.annotorious.on('selectAnnotation', async (anno:any) => this.onSelect(anno))
    this.setVisible(true)
    this.ghAuthToken = localStorage.getItem('gh-auth-token') || ''
    if (this.ghAuthToken) {
      this.ghClient = new GithubClient(this.ghAuthToken)
    }
    // console.log(`Annotator: base=${base} readOnly=${this.annotorious.readOnly} authenticated=${this.ghAuthToken !== ''}`)
  }

  async loadAnnotations(imageId:string) {
    this.imageId = imageId
    this.setVisible(false)
    let annotations = []

    // console.log(`Annotator.loadAnnotations: acct=${this.acct} repo=${this.repo} ref=${this.ref} basePath=${this.basePath} imageId=${imageId}`)
    let ghFile = await this.ghClient.getFile(this.acct, this.repo, `${this.basePath}/${this.imageId}.json`, this.ref)
    if (ghFile.content) {
      annotations = JSON.parse(ghFile.content)
      this.sha = ghFile.sha
    }
  
    console.log(`Adding ${annotations.length} annotations`)
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
    //console.log(`annotator.select=${annoId}`, this.selected?.id)
    if (annoId !== this.selected?.id) {
      this.deselect() 
      this.selected = this.annotorious.selectAnnotation(annoId)
      if (this.selected) {
        let annoEl = this.annoEl(annoId)
        if (annoEl) annoEl.style.visibility = 'visible'
        let annoLayer = this.osd.element.querySelector('.a9s-annotation.selected') as HTMLElement
        if (annoLayer) annoLayer.style.visibility = 'visible'
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

  async saveAnnotations() {
    let content = JSON.stringify(this.annotorious.getAnnotations(), null, 2)
    // console.log(`saveAnnotations: acct=${this.acct} repo=${this.repo} ref=${this.ref} basePath=${this.basePath} imageId=${this.imageId}`, content)
    let resp = await this.ghClient.putFile(this.acct, this.repo, `${this.basePath}/${this.imageId}.json`, content, this.ref, false, this.sha)
  }

  async createAnnotation(anno:any) {
    anno.id = sha256(anno.id).slice(0,8)
    anno.target.id = this.imageId
    this.saveAnnotations()
    if (navigator.clipboard) navigator.clipboard.writeText(anno.id)
  }

  async updateAnnotation(anno:any) {
    anno.target.id = this.imageId
    this.saveAnnotations()
    if (navigator.clipboard) navigator.clipboard.writeText(anno.id)
  }

  async deleteAnnotation(anno:any) {
    this.saveAnnotations()
  }

}
