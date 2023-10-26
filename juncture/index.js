const junctureDependencies = [
  {tag: 'link', rel: 'stylesheet', href: '/juncture/index.css'},
  {tag: 'link', rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/http-vue-loader@1.4.2/src/httpVueLoader.min.js'},
  {tag: 'script', src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.9.2/umd/popper.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy.umd.min.js'},
  {tag: 'script', src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js'},
]

const isJunctureV1 = Array.from(document.querySelectorAll('param'))
  .find(param =>
    Array.from(param.attributes).find(attr => attr.name.indexOf('ve-') === 0)
  ) !== undefined

function createJunctureV1App() {
  
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

  Array.from(document.body.children).forEach(child => {
    if (child.tagName !== 'VE-HEADER') document.body.removeChild(child)
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
      'juncture-v1': window.httpVueLoader(`${window.config.baseurl}/juncture/src/components/JunctureV1.sfc.vue`)
    },
    data: () => ({ html })
  })
}

export { junctureDependencies, isJunctureV1, createJunctureV1App }