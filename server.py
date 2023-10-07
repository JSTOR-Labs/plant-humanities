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

config = yaml.load(open(f'{BASEDIR}/_config.yml', 'r'), Loader=yaml.FullLoader)
logger.debug(json.dumps(config, indent=2))

jsonld_seo = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'description': config['description'],
  'headline': config['title'],
  'name': config['title'],
  'url': config['url']
}

seo = f'''
  <title>{config["title"]}</title>
  <meta name="generator" content="Jekyll v3.9.3" />
  <meta property="og:title" content="{config["title"]}" />
  <meta property="og:locale" content="en_US" />
  <meta name="description" content="{config["description"]}" />
  <meta property="og:description" content="{config["description"]}" />
  <link rel="canonical" href="{config["url"]}" />
  <meta property="og:url" content="{config["url"]}" />
  <meta property="og:site_name" content="{config["title"]}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">
  {json.dumps(jsonld_seo, indent=2)}
  </script>
'''

not_found_page = open(f'{BASEDIR}/404.html', 'r').read()
header = open(f'{BASEDIR}/_includes/header.html', 'r').read()
footer = open(f'{BASEDIR}/_includes/footer.html', 'r').read()
favicon = open(f'{BASEDIR}/favicon.ico', 'rb').read() if os.path.exists(f'{BASEDIR}/favicon.ico') else None

html_template = open(f'{BASEDIR}/_layouts/default.html', 'r').read()

include_header = config['layout']['header'] == 'true'
include_footer = config['layout']['footer'] == 'true'
html_template = re.sub(r'^\s*{%- if site.layout.header == "true" -%}\s*{%- include header.html -%}\s*{%- endif -%}', header if include_header else '', html_template, flags=re.MULTILINE)
html_template = re.sub('^\s*{%- if site.layout.footer == "true" -%}\s*{%- include footer.html -%}\s*{%- endif -%}', footer if include_footer else '', html_template, flags=re.MULTILINE)

# html_template = html_template.replace('https://rsnyder.github.io/ezpage-wc/js/index.js', 'http://localhost:5173/src/main.ts')
html_template = html_template.replace('https://juncture-digital.github.io/web-components/js/index.js', 'http://localhost:5173/src/main.ts')
html_template = html_template.replace('{%- seo -%}', seo)
html_template = html_template.replace('{{ site.github.owner }}', config['github']['owner'])
html_template = html_template.replace('{{ site.github.repo }}', config['github']['repo'])
html_template = html_template.replace('{{ site.github.branch }}', config['github']['branch'])
html_template = html_template.replace('{{ site.baseurl }}', '')
html_template = html_template.replace('{%- if site.mode == "juncture" -%}', '')
# html_template = re.sub(r'^\s*{%-\s+else\s+-%}\s*.*\s*{%-\s+endif\s+-%}', '', html_template, flags=re.MULTILINE)
html_template = re.sub(r'^\s*{%-\s+endif\s+-%}', '', html_template, flags=re.MULTILINE)
html_template = re.sub(r'^\s*{%- .*$', '', html_template)
  
def html_from_markdown(md, baseurl):
  html = html_template.replace('{{ content }}', markdown.markdown(md, extensions=['extra', 'toc']))
  soup = BeautifulSoup(html, 'html5lib')
  for tag in soup.find_all(re.compile('^ve-')):
    parent = tag.parent
    if parent.next_sibling and parent.next_sibling.name == 'ul':
      options_list = parent.next_sibling
      tag.append(options_list)
      if parent.name == 'p':
        parent.replace_with(tag)
  for el in soup.find_all('a'):
    if el.get('href') and el.get('href').startswith('#'):
      el['href'] = f'{baseurl}{el["href"]}'
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
  args = vars(parser.parse_args())
  
  uvicorn.run('server:app', port=args['port'], log_level='info', reload=args['reload'])