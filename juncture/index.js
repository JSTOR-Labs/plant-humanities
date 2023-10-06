const isGHP = /\.github\.io$/.test(location.hostname)

const referrerUrl = document.referrer
if (referrerUrl) {
  console.log(`referrer=${referrerUrl}`)
  let referrer = new URL(referrerUrl)
  if (referrer.host === 'github.com' && referrer.pathname.indexOf('/jstor-labs/juncture/wiki') < 0) {
    let [acct, repo, _, branch, ...path] = referrer.pathname.slice(1).split('/').filter(pe => pe && pe !== 'README.md')
    const redirectUrl = `${window.location.origin}/${isGHP ? repo + '/' : ''}preview/?branch=${branch}#${acct}/${repo}/${path.join('/')}`
    console.log(`Redirecting for preview: ${redirectUrl}`)
    window.location = redirectUrl
  }
}

let _config = window.config
async function getConfig() {
  if (_config) return _config
  _config = {}
  let resp = await fetch('_config.yml')
  if (resp.ok) {
    let rawText = await resp.text()
    if (rawText.indexOf('<!DOCTYPE html>') < 0) {
      _config = rawText.split('\n').map(l => l.split(':')).reduce((acc, [k, v]) => {
        acc[k.trim()] = v.trim()
        return acc
      }, {})
    }
  }
  return _config
}

function ezComponentHtml(el) {
  let lines = el.textContent?.trim().split('\n') || []
  if (lines.length === 0) return ''
  let headLine = lines[0]
  let tag = headLine.match(/\.ve-[^\W]+/)?.[0].slice(1)
  let attrs = asAttrs(parseHeadline(headLine))
  let slot = lines.length > 1 ? marked.parse(lines.slice(1).map(l => l.replace(/^    /,'')).join('\n')) : ''
  let elemHtml = `<${tag} ${attrs}>\n${slot}</${tag}>`
  return elemHtml
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

async function convertToEzElements(el) {
  let config = await getConfig()
  el.querySelectorAll('a').forEach(anchorElem => {
    let link = new URL(anchorElem.href)
    let qargs = new URLSearchParams(link.search)
    if (qargs.get('zoom')) anchorElem.setAttribute('rel', 'nofollow')
    if (isGHP && link.origin === location.origin && link.pathname.indexOf(`/${config.repo}/`) !== 0) anchorElem.href = `/${config.repo}${link.pathname}`
  })

  Array.from(el.querySelectorAll('img'))
    .forEach(img => {
      if (img.parentElement?.classList.contains('card')) return
      let ezImage = document.createElement('ez-image')
      ezImage.setAttribute('src', img.src)
      ezImage.setAttribute('alt', img.alt)
      ezImage.setAttribute('left', '');
      img.parentNode.replaceWith(ezImage)
    })

  Array.from(el.querySelectorAll('p'))
    .filter(p => /^\s*\.ve-/.test(p.textContent || ''))
    .forEach(p => {
      let ezComponent = new DOMParser().parseFromString(ezComponentHtml(p), 'text/html').children[0].children[1].children[0]
      p.parentNode?.replaceChild(ezComponent, p)
    })
}

function structureContent() {
  let main = document.querySelector('main')
  let restructured = document.createElement('main')

  let currentSection = restructured;
  let sectionParam

  let children = []
  Array.from(main?.children || []).forEach(el => {
    if (/^\s*{#.*}\s*$/.test(el.textContent)) {      
      let i = children.length-1
      let prior = children[i]
      while (prior.tagName !== 'P' && i > 0) prior = children[--i]
      if (prior.tagName === 'P') prior.id = el.textContent.trim().slice(2,-1)
    } else {
      children.push(el)
    }
  })

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

  convertToEzElements(restructured)
  main?.replaceWith(restructured)
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

  while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
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
  const vue = new window.Vue({
    el: '#vue',
    components: {
      'juncture-v1': window.httpVueLoader(`${window.config.baseurl}/juncture/components/JunctureV1.vue`)
    },
    data: () => ({ html })
  })
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

  structureContent()

  let wcScriptEl = document.createElement('script')
  wcScriptEl.setAttribute('type', 'module')
  wcScriptEl.setAttribute('src',
    location.hostname === 'localhost'
      ? 'http://localhost:5173/src/main.ts' 
      : 'https://juncture-digital.github.io/web-components/js/index.js'
  )
  document.body.appendChild(wcScriptEl)

  if (isJunctureV1) createApp()
}

document.addEventListener('DOMContentLoaded', () =>  init() )
