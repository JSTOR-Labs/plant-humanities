#!/usr/bin/env python
# -*- coding: utf-8 -*-

import logging
logging.basicConfig(format='%(asctime)s : %(filename)s : %(levelname)s : %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

import os
import sys

from bs4 import BeautifulSoup

if __name__ == '__main__':

    rootDir = sys.argv[1] if len(sys.argv) > 1 else '.'

    for dirName, subdirList, fileList in os.walk(rootDir):
        for fname in fileList:
            if fname.endswith('.md'):
                essay = fname[:0-3]
                html = open(f'{dirName}/{fname}', 'r').read()
                soup = BeautifulSoup(html, 'html5lib')
                for tag in soup.find_all('param'):
                    if 've-image' in tag.attrs:
                        rec = [essay]
                        for attr in ('attribution', 'description', 'iiif-url', 'license', 'manifest', 'title', 'url'):
                            rec.append(tag.attrs[attr] if attr in tag.attrs else '')
                        print('\t'.join(rec))
