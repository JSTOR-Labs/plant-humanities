<script setup lang="ts">

import { computed, onMounted, nextTick, ref, toRaw, watch } from 'vue'

// @ts-ignore
import { HSDropdown } from '../lib/preline/components/hs-dropdown'
// @ts-ignore
import netlifyIdentity from 'netlify-identity-widget'
import jwt_decode from 'jwt-decode'

const root = ref<HTMLElement | null>(null)
const host = computed(() => (root.value?.getRootNode() as any)?.host)
const shadowRoot = computed(() => root?.value?.parentNode as HTMLElement)
watch(shadowRoot, (shadowRoot) => new HSDropdown(shadowRoot).init() )

watch(host, () => { getMenuItems() })

const menuItems = ref<any[]>([])
watch(menuItems, () => console.log('menuItems', toRaw(menuItems.value)))

const props = defineProps({
  logo: { type: String },
  title: { type: String },
  auth: { type: String },
  contact: { type: String }
})

const user = ref<any>(null)

const isLoggedIn = computed(() => user.value?.token && (user.value?.provider === 'github' || tokenIsValid(user.value?.tokenExpiration)) || false)
// watch(isLoggedIn, () => console.log(`isLoggedIn=${isLoggedIn.value}`))

function tokenIsValid(expiration:number) {
  let isExpired = expiration <= Date.now()
  return !isExpired
}

function getMenuItems() {
  function parseSlot() {
    menuItems.value = Array.from(host.value.querySelectorAll('li'))
      .map((li: any) => {
        const a = li.querySelector('a') as HTMLAnchorElement
        let label = a.innerText.trim()
        let icon = li.querySelector('svg') as SVGElement
        return { label, icon, href: a.href }
      })
    }
    
    parseSlot()
    new MutationObserver(
      (mutationsList:any) => {
        for (let mutation of mutationsList) { if (mutation.type === 'childList') parseSlot() }      
      }
    ).observe(host.value, { childList: true, subtree: true })
  }

  onMounted(async () => {
    if (props.auth === 'netlify') setupNetlifyAuth()
    else if (props.auth === 'github') setupGithubAuth()
  })

  watch(user, () => {
    if (user.value) localStorage.setItem('auth-user', JSON.stringify(user.value))
    else if (localStorage.getItem('auth-user')) localStorage.removeItem('auth-user')
  })

  function menuItemSelected(item: any, evt:Event) {
    evt.preventDefault()
    let action = item.href.split('/').filter((x:string) => x).pop().toLowerCase()
    action = location.host === action ? 'home' : action
    if (action === 'search') window.open(item.href, '_blank');
    else location.href = item.href
  }

  function titleCase(word:string) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  }

  function login(evt:Event) {
    evt.preventDefault()
    if (props.auth === 'netlify') netlifyIdentity.open('login')
    else if (props.auth === 'github') ghLogin()
  }

  function logout(evt:Event) {
    evt.preventDefault()
    user.value = null
    if (props.auth === 'netlify') netlifyIdentity.logout()
    else if (props.auth === 'github') ghLogout()
  }

  /***************** Netlify auth *****************/

  let netlifyIdentityEndpoint = 'https://juncture-search.netlify.app/.netlify/identity'

  function setupNetlifyAuth() {
    if (location.hostname === 'search.plant-humanities.org') netlifyIdentityEndpoint = 'https://search.plant-humanities.org/.netlify/identity'
    let _user: any = localStorage.getItem('auth-user') && JSON.parse(localStorage.getItem('auth-user') || '{}' )
    if (_user?.provider === 'netlify') user.value = _user
    else user.value = null
    netlifyIdentity.on('init', (_user: any) => {
      if (_user) user.value = {provider: 'netlify', name: _user.user_metadata.full_name, email: _user.email, token: _user.token}
    })
    netlifyIdentity.on('error', (err: any) => console.error('Error', err))
    netlifyIdentity.on('login', (_user: any) => {
      user.value = {provider: 'netlify', name: _user.user_metadata.full_name, email: _user.email, token: _user.token}
      netlifyIdentity.close()
    })
    netlifyIdentity.init({ APIUrl: netlifyIdentityEndpoint})
    validateNetlifyUser()
  }

  function validateNetlifyUser() {
    let _user: any = localStorage.getItem('auth-user') && JSON.parse(localStorage.getItem('auth-user') || '{}' )
    if (_user && !isLoggedIn.value) {
      // keep users logged in
      const formData = new FormData()
      formData.append('grant_type', 'refresh_token')
      formData.append('refresh_token', _user.token.refresh_token)
      fetch(`${netlifyIdentityEndpoint}/token`, {
        method : 'POST',
        body : formData
      }).then(x=>x.json()).then((newToken: any) => {
        console.log('validateNetlifyUser: newToken', newToken)
        _user.token.access_token = newToken.access_token
        _user.token.refresh_token = newToken.refresh_token
        _user.token.expires_at = (jwt_decode(newToken.access_token) as any).exp * 1000
        user.value = {provider: 'netlify', name: _user.user_metadata.full_name, email: _user.email, token: _user.token}
      })
      return null
    }
    return null
  }


  /***************** Github auth *****************/
  
  const clientIds:any = {
    'www.juncture-digital.org': 'f7247e1e4769ba7c61e4',
    'dev.juncture-digital.org': 'bb290b5a738cb6fe31c7',
    'search.juncture-digital.org': 'ce9f2d2fb0a3498569fd',
    'lab.plant-humanities.org': '2883735f052415de88ce',
    'beta.plant-humanities.org': '4304885bd2882ecd28cc',
    'search.plant-humanities.org': 'e75df39d883077c1013f',
  }

  async function setupGithubAuth() {
    let _user: any = localStorage.getItem('auth-user') && JSON.parse(localStorage.getItem('auth-user') || '{}' )
    if (_user?.provider === 'github') user.value = _user
    else user.value = null
    let code = (new URL(window.location.href)).searchParams.get('code')
    if (code) {
      let href = `${location.pathname}${location.hash}`
      window.history.replaceState({}, '', href)
      let url = `https://www.juncture-digital.org/gh-token?code=${code}&hostname=${window.location.hostname}`
      /*
      let url = window.location.hostname === 'localhost'
        ? `https://dev.juncture-digital.org/gh-token?code=${code}&hostname=${window.location.hostname}`
        : `/gh-token?code=${code}&hostname=${window.location.hostname}`
      */
      let resp = await fetch(url)
      if (resp.ok) {
        let token = await resp.text()
        let _user = await getGhUserInfo(token)
        user.value = _user
      }
    }
  }

  function ghLogin() {
    let hostname = (new URL(window.location.href)).hostname
    let isDev = hostname === 'localhost' || hostname.indexOf('192.168.') === 0
    let redirectTo = `${window.location.href}`
    let href = isDev
      ? `${window.location.pathname}?code=testing&redirect_uri=${location.pathname}${location.hash}`
      : clientIds[location.hostname] !== undefined
        ? `https://github.com/login/oauth/authorize?client_id=${clientIds[location.hostname]}&scope=repo&state=juncture&redirect_uri=${redirectTo}`
        : null
    if (href) window.location.href = href
  }

  function ghLogout() {
    Object.keys(localStorage).forEach(key => localStorage.removeItem(key))
    user.value = null
    // location.href = ''
  }

  async function getGhUserInfo(token:string) {
    let resp = await fetch('https://api.github.com/user' ,{
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`
      }
    })
    if (resp.ok) {
      let info = await resp.json()
      return { provider: 'github', username: info.login, name: info.name, email: info.email, token }
    }
  }

</script>

<template>

  <nav class="hs-dropdown relative inline-flex" ref="root" >
    
    <button 
      id="hs-dropdown-custom-icon-trigger" 
      type="button"
      aria-label="Site navigation menu"
      class="hs-dropdown-toggle p-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-lg align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-lg dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
      <svg class="w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
      </svg>
    </button>

    <div
      class="hs-dropdown-menu font-sans text-base transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-gray-800 dark:border dark:border-gray-700" 
      aria-labelledby="hs-dropdown-custom-icon-trigger">
      <a v-for="item in menuItems" :key="item.href" 
        class="flex items-center gap-x-2 py-2 rounded-md font-sans text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" 
        :href="item.href"
        @click="menuItemSelected(item, $event)"
      >
        <svg v-if="item.icon" v-html="item.icon.outerHTML" class="w-4 h-4 text-gray-500"></svg>
        <span v-else class="w-4"></span>
        <span v-html="item.label" class="font-medium"></span>
      </a>

      <!-- Auth -->
      <a v-if="props.auth && isLoggedIn"
        class="flex items-center gap-x-2 py-2 rounded-md text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" 
        href="javascript;;" 
        @click="logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
        <span class="font-medium">({{user?.name || user?.email}})</span> <span class="font-medium">Logout</span>
      </a>
      <a v-if="props.auth && !isLoggedIn"
        class="flex items-center gap-x-2 py-2 rounded-md text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" 
        href="javascript;;" 
        @click="login"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
        <span class="font-medium">Login with {{ titleCase(props.auth) }}</span>
      </a>
      <!-- End Auth -->

      <a v-if="props.contact"
        class="flex items-center gap-x-2 py-2 rounded-md font-sans text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        :href="`mailto:${$props.contact}`">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
        <span class="font-medium">Contact Us</span>
      </a>

    </div>

  </nav>

</template>

<style>
  @import '../tailwind.css';
</style>
