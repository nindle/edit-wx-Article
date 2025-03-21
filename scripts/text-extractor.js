// ==UserScript==
// @name         文本提取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提取页面中id为js_content的元素下的所有文本内容并复制到剪贴板
// @author       You
// @match        *://mp.weixin.qq.com/s*
// @grant        GM_setClipboard
// @run-at       context-menu
// ==/UserScript==

(function () {
  'use strict'

  // 主函数
  function extractAndCopyText() {
    // 查找id为js_content的元素
    const contentElement = document.getElementById('js_content')

    if (!contentElement) {
      alert('未找到id为js_content的元素！')
      return
    }

    // 获取元素中的所有文本内容（去除HTML标签）
    const textContent = contentElement.innerText || contentElement.textContent

    if (!textContent || textContent.trim() === '') {
      alert('提取的内容为空！')
      return
    }

    // 复制到剪贴板
    GM_setClipboard(textContent)

    // 提示用户
    alert('文本已成功复制到剪贴板！')
  }

  // 执行主函数
  extractAndCopyText()
})()
