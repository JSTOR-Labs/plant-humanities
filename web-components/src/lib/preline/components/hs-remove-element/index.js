/*
 * HSRemoveElement
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

import Component from '../../core/Component';

export class HSRemoveElement extends Component {
  root
  constructor(root) {
    this.root = root
    super('[data-hs-remove-element]');
  }

  init() {
    this.root.addEventListener('click', (e) => {
      const $removeElementTrigger = e.target.closest(this.selector);
      if (!$removeElementTrigger) return;

      const $removeEl = this.root.querySelector($removeElementTrigger.getAttribute('data-hs-remove-element'));
      if ($removeEl) {
        $removeEl.classList.add('hs-removing');
        this.afterTransition($removeEl, () => {
          $removeEl.remove();
        });
      }
    });
  }
}

