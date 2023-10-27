export class GithubClient {

    authToken: string
  
    constructor(authToken: string) {
      this.authToken = authToken
    }
  
    // Encoding UTF8 ⇢ base64

    b64EncodeUnicode(str:string) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(_, p1) {
          return String.fromCharCode(parseInt(p1, 16))
      }))
    }

    // Decoding base64 ⇢ UTF8

    b64DecodeUnicode(str:string) {
      return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    }

    user() {
      // console.log(`GithubClient.user`)
      return fetch('https://api.github.com/user' ,{
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${this.authToken}`
        }
      }).then(resp => resp.json())
    }

    async isCollaborator(owner: string, repo: string, username: string) {
      // console.log(`GithubClient.isCollaborator: owner=${owner} repo=${repo} username=${username}`)
      let url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`
      let resp = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${this.authToken}`
        }
      })
      return resp.ok && resp.status === 204
    }
  
    organizations() {
      // console.log(`GithubClient.organizations`)
      return fetch('https://api.github.com/user/orgs', {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${this.authToken}`
        }
      }).then(resp => resp.json())
    }
  
    repos(user:string = '', org:string = '') {
      // console.log(`GithubClient.repos: user=${user} org=${org}`)
      let pathPrefix = user
        ? `users/${user}`
        : org
          ? `orgs/${org}`
          : 'user'
      return fetch(`https://api.github.com/${pathPrefix}/repos?per_page=100`, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${this.authToken}`
        }
      }).then(resp => resp.json())
    }
      
    async createRepository({org=null, name='', description='', auto_init=true}): Promise<any> {
      let url = org ? `https://api.github.com/orgs/${org}/repos` : 'https://api.github.com/user/repos'
      console.log(`createUserRepository: org=${org} name=${name} description=${description} auto_init=${auto_init} url=${url}`)
      let resp = await fetch(url, {
        method: 'POST', 
        body: JSON.stringify({name, description, auto_init}), 
        headers: {Authorization: `Token ${this.authToken}`} 
      })
      return {status:resp.status, statusText:resp.statusText}
    }

    branches(acct:string, repo:string) {
      // console.log(`GithubClient.branches: acct=${acct} repo=${repo}`)
      return fetch(`https://api.github.com/repos/${acct}/${repo}/branches`, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${this.authToken}`
        }
      }).then(resp => resp.json())
    }
  
    async getFile(acct:string, repo:string, path:string, ref:string): Promise<any> {
      // console.log(`getFile: acct=${acct} repo=${repo} ref=${ref} path=${path}`)
      let content
      let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}`
      if (ref) url += `?ref=${ref}`
      let resp: any = await fetch(url, {cache: 'no-cache', headers: {Authorization:`Token ${this.authToken}`}})
      if (resp.ok) {
        resp = await resp.json()
        content = decodeURIComponent(escape(atob(resp.content)))
      }
      return Promise.resolve({content, sha: resp.sha})
    }
  
    async getSha(acct:string, repo:string, path:string, ref:string): Promise<any> {
      console.log(`getSha: acct=${acct} repo=${repo} path=${path} ref=${ref}`)
      let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}`
      if (ref) url += `?ref=${ref}`
      let resp:any = await fetch(url, { headers: {Authorization: `Token ${this.authToken}`} })
      if (resp.ok) resp = await resp.json()
      let sha = resp.sha
      return sha
    }

    _shas:any = {}
    async putFile(acct:string, repo:string, path:string, content:any, ref:string, isBinaryString=false, sha:string=''): Promise<any> {
      let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}`
      let shaKey = `${acct}/${repo}/${ref}/${path}`
      sha = sha || this._shas[shaKey] || await this.getSha(acct, repo, path, ref)
      console.log(`putFile: acct=${acct} repo=${repo} path=${path} ref=${ref} sha=${sha} isBinaryString=${isBinaryString}`)
      // let payload:any = { message: 'API commit', content: btoa(unescape(encodeURIComponent(content))) }
      let payload:any = { 
        message: 'API commit', 
        content: isBinaryString ? btoa(content) : this.b64EncodeUnicode(content) 
      }
      if (ref) payload.branch = ref
      if (sha) payload.sha = sha
      let resp:any = await fetch(url, { method: 'PUT', body: JSON.stringify(payload), headers: {Authorization: `Token ${this.authToken}`} })
      if (resp.ok) {
        let body = await resp.json()
        sha = body.content.sha
        this._shas[shaKey] = sha
      } else {
        console.log(resp)
      }
      return {status:resp.status, statusText:resp.statusText, sha}
    }
  
    async deleteFile(acct:string, repo:string, path:string, ref:string, sha:string=''): Promise<any> {
      console.log(`deleteFile: acct=${acct} repo=${repo} path=${path} sha=${sha}`)
      sha = sha || await this.getSha(acct, repo, path, ref)
      let url = `https://api.github.com/repos/${acct}/${repo}/contents/${path}`
      let payload = { message: 'API commit', sha }
      let resp = await fetch(url, { method: 'DELETE', body: JSON.stringify(payload), headers: {Authorization: `Token ${this.authToken}`} })
      resp = await resp.json()
    }
  
    async defaultBranch(acct:string, repo:string) {
      // console.log(`GithubClient.defaultBranch: acct=${acct} repo=${repo}`)
      let defaultBranch = null
      let url = `https://api.github.com/repos/${acct}/${repo}`
      let resp:any = await fetch(url, { headers: {Authorization: `Token ${this.authToken}`} })
      if (resp.ok) {
        resp = await resp.json()
        defaultBranch = resp.default_branch
      }
      return defaultBranch
    }

    async dirlist(acct:string, repo:string, path:string, ref:string | null): Promise<any[]> {
      // console.log(`GithubClient.dirList: acct=${acct} repo=${repo} path=${path} ref=${ref}`)
      path = path || ''
      ref = ref || await this.defaultBranch(acct, repo)
      let files: any[] = []
      let url = `https://api.github.com/repos/${acct}/${repo}/git/trees/${ref}`
      let headers = {
        Authorization: `Token ${this.authToken}`,
        Accept: 'application/vnd.github.v3+json',
        'If-None-Match': '' // Hack to inhibit response caching
      }
      let pathElems = path.split('/').filter(pe => pe)
      for (let i = 0; i < pathElems.length; i++) {
        let resp = await fetch(url, {headers})
        let _dirList: any = resp.ok ? await resp.json() : {}
        let found = _dirList ? _dirList.tree?.find((item:any) => item.path === pathElems[i]) : null
        url = found ? found.url : null
        if (!url) break
      }
      if (url) {
        let resp = await fetch(url, {headers})
        let _dirList: any = resp.ok ? await resp.json() : {}
        files = (_dirList.tree || []).map((item: any) => ({name: item.path, sha: item.sha, type: item.type === 'tree' ? 'dir' : 'file'}))
      }
      return files
    }
  
    async fullPath(acct:string, repo:string, path:string, ref:string, foldersOnly = false): Promise<string> {
      // console.log(`GithubClient.fullPath: acct=${acct} repo=${repo} path=${path} ref=${ref} foldersOnly=${foldersOnly}`)
      let pathElems = path.split('/').filter(pe => pe)
      let leafElem = pathElems[pathElems.length-1]
      let dirList = await this.dirlist(acct, repo, pathElems.join('/'), ref)
      if (dirList.length === 0) {
        pathElems.pop()
        dirList = await this.dirlist(acct, repo, pathElems.join('/'), ref)
      }
      if (!foldersOnly) {
        let toFind = [leafElem, `${leafElem}.md`, 'README.md']
        for (let i = 0; i < toFind.length; i++) {
          if (dirList.find(item => item.type === 'file' && (item.name === toFind[i]))) {
            pathElems.push(toFind[i])
            break
          }
        }
      }
      let fullPath = pathElems.join('/')
      // console.log(`fullPath=${fullPath}`)
      return fullPath
    }
  
  }