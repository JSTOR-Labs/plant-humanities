#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Restructures the site to be more like a Jekyll site.
'''

import logging
logging.basicConfig(format='%(asctime)s : %(filename)s : %(levelname)s : %(message)s')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

import argparse, os, re
from pathlib import Path

BASEDIR = os.path.abspath(os.path.dirname(__file__))

done = False

def reformat_cards(path):
  global done
  md = open(path, 'r').read()
  if re.search(r'{\s*\.cards\s*}', md):
    md = re.sub(r'{\s*\s*\.cards\s*}', '\n<param class="cards">', md)
    md = re.sub(r'(?P<tag>#+)\s(?P<title>.*)\s+{\s*href=(?P<href>[^}\s]+)\s*}', r'\1 \2\n\n[\2](\3)', md)
    logger.info(path)
    with open(path, 'w') as f:
      f.write(md)
    # done = True

def main(root=BASEDIR, **kwargs):
  global done
  logger.info(f'Root: {root}')
  for root, dirs, files in os.walk(root):
    for filename in files:
      if '/.venv/' in root: continue
      if filename == 'README.md':
        reformat_cards(os.path.join(root, filename))
        if done: break
      elif filename.endswith('.md'):
        # print(os.path.join(root, filename))
        print(f'mkdir: {os.path.join(root, filename[:-3])}')
        os.mkdir(os.path.join(root, filename[:-3]))
        src = Path(os.path.join(root, filename))
        dest = Path(os.path.join(root, filename[:-3], 'README.md'))
        print(f'move: {src} to {dest}')
        src.rename(dest)
    if done: break
          
if __name__ == '__main__':
  logger.setLevel(logging.INFO)
  parser = argparse.ArgumentParser()  
  parser.add_argument('--root', type=str, help='Root directory')
  args = vars(parser.parse_args())
  if args['root'] is None:
    args['root'] = BASEDIR
  elif not os.path.isabs(args['root']):
    args['root'] = os.path.abspath(os.path.join(BASEDIR, args['root']))

  main(**args)