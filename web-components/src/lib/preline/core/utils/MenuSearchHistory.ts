/*
 * Util
 * @version: 1.3.0
 * @author: HtmlStream
 * @license: Licensed under MIT (https://preline.co/docs/license.html)
 * Copyright 2023 Htmlstream
 */

export default {
  historyIndex: -1,

  addHistory(index: number) {
    this.historyIndex = index;
  },

  existsInHistory(index: number) {
    return index > this.historyIndex;
  },

  clearHistory() {
    this.historyIndex = -1;
  },
};
