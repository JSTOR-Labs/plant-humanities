#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Python dev server for ezpage site.
Dependencies: bs4 fastapi html5lib Markdown pymdown-extensions PyYAML uvicorn
'''

import logging
logging.basicConfig(format='%(asctime)s : %(filename)s : %(levelname)s : %(message)s')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

import argparse, json, os, re

BASEDIR = os.path.abspath(os.path.dirname(__file__))
LOCAL_WC = os.environ.get('LOCAL_WC', 'false').lower() == 'true'

from bs4 import BeautifulSoup
import markdown
import yaml

from typing import Optional

import uvicorn

from fastapi import FastAPI
from fastapi.responses import Response
app = FastAPI(title='EZPage', root_path='/')

media_types = {
  'css': 'text/css',
  'html': 'text/html',
  'ico': 'image/vnd. microsoft. icon',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'md': 'text/markdown',
  'png': 'image/png',
  'txt': 'text/plain',
  'yaml': 'application/x-yaml'
}

config = yaml.load(open(f'{BASEDIR}/_config.yml', 'r'), Loader=yaml.FullLoader) if os.path.exists(f'{BASEDIR}/_config.yml') else {}
logger.debug(json.dumps(config, indent=2))

title = config.get('title', 'Juncture')
description = config.get('description', '')
url = config.get('url', '')
gh_owner = config.get('github', {}).get('owner', '')
gh_repo = config.get('github', {}).get('repo', '')
gh_branch = config.get('github', {}).get('branch', '')

jsonld_seo = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'description': description,
  'headline': title,
  'name': title,
  'url': url
}

seo = f'''
  <title>{title}</title>
  <meta name="generator" content="Jekyll v3.9.3" />
  <meta property="og:title" content="{title}" />
  <meta property="og:locale" content="en_US" />
  <meta name="description" content="{description}" />
  <meta property="og:description" content="{description}" />
  <link rel="canonical" href="{url}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:site_name" content="{title}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
  {json.dumps(jsonld_seo, indent=2)}
  </script>
'''

not_found_page = open(f'{BASEDIR}/404.html', 'r').read()
header = open(f'{BASEDIR}/_includes/header.html', 'r').read()
footer = open(f'{BASEDIR}/_includes/footer.html', 'r').read()
favicon = open(f'{BASEDIR}/favicon.ico', 'rb').read()

if LOCAL_WC:
  # config['components'] = config['components'].replace('https://juncture-digital.github.io/web-components/js/index.js', 'http://localhost:5173/src/main.ts')
  config['components'] = config['components'].replace('/web-components/dist/js/index.js', 'http://localhost:5173/src/main.ts')

html_template = open(f'{BASEDIR}/_layouts/default.html', 'r').read()
html_template = re.sub(r'^\s*{%- include header.html -%}', header, html_template, flags=re.MULTILINE)
html_template = re.sub(r'^\s*{%- include footer.html -%}', footer, html_template, flags=re.MULTILINE)

html_template = html_template.replace('{%- seo -%}', seo)
html_template = html_template.replace('{{ site.github.owner }}', config['github']['owner'])
html_template = html_template.replace('{{ site.github.repo }}', config['github']['repo'])
html_template = html_template.replace('{{ site.github.branch }}', config['github']['branch'])
html_template = html_template.replace('{{ site.baseurl }}', '')
html_template = html_template.replace('{{ site.components }}', config['components'])
  
def html_from_markdown(md, baseurl):
  html = html_template.replace('{{ content }}', markdown.markdown(md, extensions=['extra', 'toc']))
  soup = BeautifulSoup(html, 'html5lib')
  for tag in soup.find_all(re.compile('^ve-')):
    parent = tag.parent
    if parent.next_sibling and parent.next_sibling.name == 'ul':
      options_list = parent.next_sibling
      tag.append(options_list)
      parent.replace_with(tag)
      # tag.parent.next_sibling.decompose()
  for link in soup.find_all('a'):
    href = link.get('href')
    if href and not href.startswith('http') and not href.startswith('#') and not href.startswith('/'):
      link['href'] = f'{baseurl}{href}'
  for img in soup.find_all('img'):
    src = img.get('src')
    if not src.startswith('http') and not src.startswith('/'):
      img['src'] = f'{baseurl}{src}'
  for param in soup.find_all('param'):
    param.parent.insert_after(param)
  for para in soup.find_all('p'):
    if para.renderContents().decode('utf-8').strip() == '':
      para.decompose()
  for heading in soup.find_all('h1'):
    if heading.renderContents().decode('utf-8').strip() == '':
      heading.decompose()
  return soup.prettify()
  
@app.get('/{path:path}')
async def serve(path: Optional[str] = None):
  path = [pe for pe in path.split('/') if pe != ''] if path else []
  ext = path[-1].split('.')[-1].lower() if len(path) > 0 and '.' in path[-1] else None
  local_file_path = f'{BASEDIR}/{"/".join(path)}' if ext else f'{BASEDIR}/{"/".join(path)}/README.md'
  if '/'.join(path) == 'preview':
    return Response(status_code=200, content=html_template, media_type='text/html')
  if not os.path.exists(local_file_path):
    return Response(status_code=404, content=not_found_page, media_type='text/html')
  if ext == 'ico':
    content = favicon
  elif ext in ['jpg', 'jpeg', 'png', 'svg']:
    content = open(local_file_path, 'rb').read()
  else:
    content = open(local_file_path, 'r').read()
  if ext is None: # markdown file
    content = html_from_markdown(content, baseurl=f'/{"/".join(path)}/' if len(path) > 0 else '/')
  media_type = media_types[ext] if ext in media_types else 'text/html'
  return Response(status_code=200, content=content, media_type=media_type)

if __name__ == '__main__':
  logger.setLevel(logging.INFO)
  parser = argparse.ArgumentParser(description='EZpage dev server')  
  parser.add_argument('--reload', type=bool, default=True, help='Reload on change')
  parser.add_argument('--port', type=int, default=8080, help='HTTP port')
  parser.add_argument('--localwc', action=argparse.BooleanOptionalAction, help='Use local web components')
  args = vars(parser.parse_args())
  
  os.environ['LOCAL_WC'] = str(args['localwc'])

  uvicorn.run('serve:app', port=args['port'], log_level='info', reload=args['reload'])