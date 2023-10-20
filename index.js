const isGHP = /\.github\.io$/.test(location.hostname)

const referrerUrl = document.referrer
if (referrerUrl) {
  // console.log(`referrer=${referrerUrl}`)
  let referrer = new URL(referrerUrl)
  if (referrer.host === 'github.com') {
    let [acct, repo, _, branch, ...path] = referrer.pathname.slice(1).split('/').filter(pe => pe && pe !== 'README.md')
    if (acct && repo && branch) {
      const redirectUrl = `${window.location.origin}/${isGHP ? repo + '/' : ''}preview/?branch=${branch}#${acct}/${repo}/${path.join('/')}`
      console.log(`Redirecting for preview: ${redirectUrl}`)
      window.location = redirectUrl
    }
  }
}

let junctureConfig
async function getJunctureConfig() {
  if (!junctureConfig) {
    let resp = await fetch('/juncture/config.yml')
    if (resp.ok) window.config = {
      ...window.config,
      ...window.jsyaml.load(await resp.text())
    }
  }
  return window.config
}

function structureContent() {
  let main = document.querySelector('main')
  let restructured = document.createElement('main')

  let children = []
  Array.from(main?.children || []).forEach((el, idx) => {
    if (/^\s*{#.*}\s*$/.test(el.textContent)) {      
      let i = children.length-1
      let prior = children[i]
      while (prior.tagName !== 'P' && i > 0) prior = children[--i]
      if (prior.tagName === 'P') prior.id = el.textContent.trim().slice(2,-1)
    } else {
      children.push(el)
    }
  })

  let currentSection = restructured;
  let sectionParam
  for (let i = 0; i < children.length; i++) {
    let el = children[i]
    if (el.tagName[0] === 'H' && isNumeric(el.tagName.slice(1))) {
      let heading = el
      let sectionLevel = parseInt(heading.tagName.slice(1))
      if (currentSection) {
        (Array.from(currentSection.children))
          .filter(child => !/^H\d/.test(child.tagName))
          .filter(child => !/PARAM/.test(child.tagName))
          .forEach((child, idx) => { 
            let segId = `${currentSection.getAttribute('data-id') || 1}.${idx+1}`
            child.setAttribute('data-id', segId)
            if (!child.id) child.id = segId
            child.className = 'segment'
          })
      }

      currentSection = document.createElement('section')
      currentSection.classList.add(`section-${sectionLevel}`)
      Array.from(heading.classList).forEach(c => currentSection.classList.add(c))
      sectionParam = heading.nextElementSibling?.tagName === 'PARAM'
        ? heading.nextElementSibling
        : null
      if (sectionParam) {
        sectionParam.classList.forEach(c => currentSection.classList.add(c))
      }
      heading.className = ''
      if (heading.id) {
        currentSection.id = heading.id
        heading.removeAttribute('id')
      }

      currentSection.innerHTML += heading.outerHTML
      if (!heading.innerHTML.trim()) currentSection.firstChild?.remove()

      let headings = [...restructured.querySelectorAll(`H${sectionLevel-1}`)]
      let parent = sectionLevel === 1 || headings.length === 0 ? restructured : headings.pop()?.parentElement
      parent?.appendChild(currentSection)
      currentSection.setAttribute('data-id', computeDataId(currentSection))

    } else {
      if (el !== sectionParam) currentSection.innerHTML += el.outerHTML
    }
  }

  restructured.querySelectorAll('section').forEach((section) => {
  if (section.classList.contains('cards') && !section.classList.contains('wrapper')) {
    section.classList.remove('cards')
    let wrapper = document.createElement('section')
    wrapper.className = 'cards wrapper'
    Array.from(section.children).slice(1).forEach(card => {
      wrapper.appendChild(card)
      card.classList.add('card')
      let heading = card.querySelector('h1, h2, h3, h4, h5, h6')
      if (heading) heading.remove()
      let img = card.querySelector('p > img')
      if (img) img.parentElement?.replaceWith(img)
      let link = card.querySelector('p > a')
      if (link) link.parentElement?.replaceWith(link)
    })
    section.appendChild(wrapper)
    }
  })

  main?.replaceWith(restructured)
}

function isNumeric(arg) { return !isNaN(arg) }

function computeDataId(el) {
  let dataId = []
  // if (!el.parentElement) dataId.push(1)
  while (el.parentElement) {
    let siblings = Array.from(el.parentElement.children).filter(c => c.tagName === el.tagName)
    dataId.push(siblings.indexOf(el) + 1)
    el = el.parentElement
  }
  return dataId.reverse().join('.')
}

function createApp() {
  let main = document.querySelector('main')
  let tmp = new DOMParser().parseFromString(main.innerHTML, 'text/html').children[0].children[1]

  let img = tmp.querySelector('a img')
  if (img?.src.indexOf('ve-button') > -1) img.parentElement?.parentElement?.remove()

  // Array.from(tmp.querySelectorAll('p > param')).forEach(param => param.parentElement?.after(param))

  Array.from(tmp.querySelectorAll('[data-id]'))
    .forEach(seg => {
      if (seg.tagName === 'SECTION') return
      let id = seg.getAttribute('data-id') || ''
      let wrapper = document.createElement('div')
      wrapper.setAttribute('data-id', id)
      wrapper.id = id
      wrapper.className = seg.className
      seg.removeAttribute('id')
      seg.removeAttribute('data-id')
      seg.className = ''
      wrapper.appendChild(seg.cloneNode(true))
      while (seg.nextSibling) {
        let sib = seg.nextSibling
        if (sib.nodeName !== 'PARAM') break
        wrapper.appendChild(sib)
      }
      seg.replaceWith(wrapper)
    })

  Array.from(tmp.querySelectorAll('div'))
    .filter(div => {
      let content = div.textContent?.trim()
      return content === '' || content === '#'
    })
    .forEach(div => div.remove())

  let html = tmp.innerHTML

  /*
  while (document.body.firstChild) { document.body.removeChild(document.body.firstChild) }
*/
  Array.from(document.body.children).forEach(child => {
    if (child.tagName !== 'EZ-HEADER') document.body.removeChild(child)
  })

  main = document.createElement('div')
  main.id = 'vue'
  main.innerHTML = `<juncture-v1 :input-html="html"></juncture-v1>`
  document.body.appendChild(main)

  window.Vue.directive('highlightjs', {
    deep: true,
    bind: function(el, binding) {
      let targets = el.querySelectorAll('code')
      targets.forEach((target) => {
        if (binding.value) {
          target.textContent = binding.value
        }
        window.hljs.highlightBlock(target)
      })
    },
    componentUpdated: function(el, binding) {
      let targets = el.querySelectorAll('code')
      targets.forEach((target) => {
        if (binding.value) {
          target.textContent = binding.value
          window.hljs.highlightBlock(target)
        }
      })
    }
  })
  new window.Vue({
    el: '#vue',
    components: {
      'juncture-v1': window.httpVueLoader(`${window.config.baseurl}/juncture/src/components/JunctureV1.vue`)
    },
    data: () => ({ html })
  })
}

function convertWcTagsToElements(root) {
  // Converts Web Component tags to HTML elements
  root = root || document.querySelector('main')

  root.querySelectorAll('a').forEach(anchorElem => {
    let link = new URL(anchorElem.href)
    if (isGHP && link.origin === location.origin && link.pathname.indexOf(`/${config.repo}/`) !== 0) anchorElem.href = `/${config.repo}${link.pathname}`
  })

  /*
  Array.from(root.querySelectorAll('img'))
    .forEach(img => {
      if (img.parentElement?.classList.contains('card')) return
      let ezImage = document.createElement('ez-image')
      ezImage.setAttribute('src', img.src)
      ezImage.setAttribute('alt', img.alt)
      ezImage.setAttribute('left', '');
      img.parentNode.replaceWith(ezImage)
    })
  */

  let regex = new RegExp(`^\\s*\\.\\w+-\\w+\\s*`)
  Array.from(root.querySelectorAll('p'))
    .filter(p => regex.test(p.textContent || ''))
    .forEach(p => {
      let tag = p.textContent.trim().split(' ')[0].slice(1).trim()
      let html = componentHtml(p, tag)
      let el = new DOMParser().parseFromString(html, 'text/html').children[0].children[1].children[0]
      p.parentNode?.replaceChild(el, p)
    })
}

function componentHtml(el, tag) {
  let lines = el.innerHTML?.trim().split('\n').map(line => line.trim()) || []
  if (lines.length === 0) return ''
  let headLine = lines[0]
  let attrs = asAttrs(parseHeadline(headLine))

  let slot = ''
  if (lines.length > 1) {
    let listItems = []
    lines.slice(1)
      .map(l => l.replace(/^\s*/, ''))
      .forEach(line => {
        if (line === '-') listItems.push('- ')
        else if (/^-\s+.+/.test(line)) listItems.push(line)
        else listItems[listItems.length-1] += `${line}`
      })
    slot = marked.parse(listItems.join('\n'))
  }
  return `<${tag} ${attrs}>\n${slot}</${tag}>`
}

function parseHeadline(s) {
  let tokens = []
  s = s.replace(/”/g,'"').replace(/”/g,'"').replace(/’/g,"'")
  s?.match(/[^\s"]+|"([^"]*)"/gmi)?.forEach(token => {
    if (tokens.length > 0 && tokens[tokens.length-1].indexOf('=') === tokens[tokens.length-1].length-1) tokens[tokens.length-1] = `${tokens[tokens.length-1]}${token}`
    else tokens.push(token)
  })
  return Object.fromEntries(tokens.slice(1).map(token => {
    if (token.indexOf('=') > 0) {
      let [key, value] = token.split('=')
      return [key, value[0] === '"' && value[value.length-1] === '"' ? value.slice(1, -1) : value]
    } else return [token, "true"]
  }))
}

function asAttrs(obj) {
  return Object.entries(obj).map(([k, v]) => v === 'true' ? k : `${k}="${v}"`).join(' ')
}

async function getGhFile(acct, repo, branch, path) {
  let resp = await fetch(`https://api.github.com/repos/${acct}/${repo}/contents/${path}?ref=${branch}`)
  if (resp.ok) {
    resp = await resp.json()
    return decodeURIComponent(escape(atob(resp.content)))
  } else{
    console.log(`Github API failed: status=${resp.status}, retrying with raw.githubusercontent.com`)
    resp = await fetch(`https://raw.githubusercontent.com/${acct}/${repo}/${branch}/${path}`)
    if (resp.ok) return await resp.text()
  }
}

function loadDependencies(dependencies, callback, i) {
  i = i || 0
  // console.log(`loading ${dependencies[i].src || dependencies[i].href}`)
  loadDependency(dependencies[i], () => {
    if (i < dependencies.length-1) loadDependencies(dependencies, callback, i+1) 
    else callback()
  })
}

function loadDependency(dependency, callback) {
  let e = document.createElement(dependency.tag)
  Object.entries(dependency).forEach(([k, v]) => { if (k !== 'tag') e.setAttribute(k, v) })
  e.addEventListener('load', callback)
  if (dependency.tag === 'script') document.body.appendChild(e)
  else document.head.appendChild(e)
}

let junctureDependencies = [
  {tag: 'link', rel: 'stylesheet', href: '/juncture/index.css'},
  {tag: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/http-vue-loader@1.4.2/src/httpVueLoader.min.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js'},
]

async function init() {

  let isPreview = location.pathname === `${config.baseurl}/preview/`
  if (isPreview) {
    let [acct, repo, ...path] = location.hash.slice(1).split('/')
    const branch = new URLSearchParams(location.search).get('branch') || 'main'
    let md = await getGhFile(acct, repo, branch, `${path.join('/')}/README.md`)
    document.querySelector('main').innerHTML = marked.parse(md)
  }

  let isJunctureV1 = Array.from(document.querySelectorAll('param'))
  .find(param =>
    Array.from(param.attributes).find(attr => attr.name.indexOf('ve-') === 0)
  ) !== undefined

  console.log(`init isPreview=${isPreview} isJunctureV1=${isJunctureV1}`)

  await getJunctureConfig()
  config.components = config.components ? config.components.split(',').map(l => l.trim()) : []

  convertWcTagsToElements()
  structureContent()
  let dependencies = config.components.map(src => ({tag: 'script', type: 'module', src}) )
  if (isJunctureV1) dependencies = dependencies.concat(junctureDependencies)
  if (dependencies.length > 0) loadDependencies(dependencies, () => { 
    if (isJunctureV1) createApp()
    /*
    let header = document.querySelector('ez-header')
    if (header) {
      header.setAttribute('title', 'Title')
      header.innerHTML = `
        <ul>
         <li><a href="/">Menu Item 1</a></li>
        </ul>
      `
    }
    */
  })
}

document.addEventListener('DOMContentLoaded', () =>  init() )
