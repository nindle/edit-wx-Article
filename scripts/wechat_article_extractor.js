// ==UserScript==
// @name         微信公众号文章列表数据提取器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  提取微信公众号文章列表数据，包括标题、描述、封面图、发布时间、阅读次数、点赞次数
// @author       You
// @match        https://mp.weixin.qq.com/*
// @match        https://weixin.qq.com/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  // 存储提取的文章数据
  let extractedArticles = GM_getValue('extractedArticles', []);
  
  function showNotification(text, title, timeout = 3000) {
    // 检查是否已存在通知元素
    let notificationContainer = document.getElementById('custom-notification-container');
    
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'custom-notification-container';
      notificationContainer.style.position = 'fixed';
      notificationContainer.style.top = '20px';
      notificationContainer.style.right = '20px';
      notificationContainer.style.zIndex = '10000';
      document.body.appendChild(notificationContainer);
    }
    
    // 创建新的通知元素
    const notification = document.createElement('div');
    notification.style.backgroundColor = '#333';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.minWidth = '200px';
    notification.style.maxWidth = '300px';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    
    // 添加标题
    const titleElement = document.createElement('div');
    titleElement.textContent = title || '通知';
    titleElement.style.fontWeight = 'bold';
    titleElement.style.marginBottom = '5px';
    notification.appendChild(titleElement);
    
    // 添加内容
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.fontSize = '14px';
    notification.appendChild(textElement);
    
    // 添加到容器
    notificationContainer.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);
    
    // 设置自动消失
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, timeout);
    
    // 同时在控制台输出
    console.log(`[${title}] ${text}`);
  }

  // 添加按钮到页面
  function addExtractButton() {
    // 检查按钮是否已存在
    if (document.querySelector('#extract-button-container')) {
      return;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '100px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.id = 'extract-button-container';

    const extractButton = document.createElement('button');
    extractButton.textContent = '提取文章数据';
    extractButton.style.padding = '10px 15px';
    extractButton.style.backgroundColor = '#07C160';
    extractButton.style.color = 'white';
    extractButton.style.border = 'none';
    extractButton.style.borderRadius = '4px';
    extractButton.style.cursor = 'pointer';
    extractButton.style.fontWeight = 'bold';
    extractButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    extractButton.style.marginBottom = '10px';
    extractButton.id = 'extract-article-button';

    extractButton.addEventListener('click', extractArticleData);
    buttonContainer.appendChild(extractButton);

    // 添加复制按钮
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制已提取数据';
    copyButton.style.padding = '10px 15px';
    copyButton.style.backgroundColor = '#1E90FF';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '4px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.fontWeight = 'bold';
    copyButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    copyButton.style.display = 'block';
    copyButton.style.marginBottom = '10px';
    copyButton.id = 'copy-data-button';

    copyButton.addEventListener('click', copyExtractedData);
    buttonContainer.appendChild(copyButton);

    // 添加清除按钮
    const clearButton = document.createElement('button');
    clearButton.textContent = '清除已提取数据';
    clearButton.style.padding = '10px 15px';
    clearButton.style.backgroundColor = '#FF4500';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontWeight = 'bold';
    clearButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    clearButton.style.marginTop = '10px';
    clearButton.style.display = 'block';
    clearButton.id = 'clear-data-button';

    clearButton.addEventListener('click', clearExtractedData);
    buttonContainer.appendChild(clearButton);

    // 添加计数器显示
    const counterDiv = document.createElement('div');
    counterDiv.style.marginTop = '10px';
    counterDiv.style.padding = '5px';
    counterDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    counterDiv.style.color = 'white';
    counterDiv.style.borderRadius = '4px';
    counterDiv.style.fontSize = '12px';
    counterDiv.style.textAlign = 'center';
    counterDiv.id = 'extract-counter';
    counterDiv.textContent = `已提取: ${extractedArticles.length} 篇文章`;

    buttonContainer.appendChild(counterDiv);

    document.body.appendChild(buttonContainer);
  }

  // 提取文章数据
  function extractArticleData() {
    // 检查当前页面类型
    if (isArticleListPage()) {
      extractFromArticleList();
    } else if (isArticleDetailPage()) {
      extractFromArticleDetail();
    } else {
      showNotification('当前页面不是微信公众号文章列表或详情页面', '提取失败');
    }
  }

  // 从文章列表页提取数据
  function extractFromArticleList() {
    try {
      const articles = [];

      let articleItems = document.querySelectorAll('.weui-desktop-block');

      if (articleItems.length === 0) {
        throw new Error('未找到文章列表');
      }

      let newArticlesCount = 0;

      articleItems.forEach((item, index) => {
        try {
          // 提取标题 - 使用更精确的选择器
          let title = '';
          const titleElement = item.querySelector('.weui-desktop-mass-appmsg__title span');
          if (titleElement) {
            title = titleElement.textContent.trim();
          }

          // 提取封面图 - 从背景图片中提取
          let coverUrl = '';
          const thumbElement = item.querySelector('.weui-desktop-mass-appmsg__thumb');
          if (thumbElement && thumbElement.style.backgroundImage) {
            coverUrl = thumbElement.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
          }

          // 提取阅读次数
          let readCount = '0';
          const readCountElement = item.querySelector('.appmsg-view .weui-desktop-mass-media__data__inner');
          if (readCountElement) {
            readCount = readCountElement.textContent.trim();
          }

          // 提取点赞次数
          let likeCount = '0';
          const likeCountElement = item.querySelector('.appmsg-like .weui-desktop-mass-media__data__inner');
          if (likeCountElement) {
            likeCount = likeCountElement.textContent.trim();
          }

          // 提取分享次数
          let shareCount = '0';
          const shareCountElement = item.querySelector('.appmsg-share .weui-desktop-mass-media__data__inner');
          if (shareCountElement) {
            shareCount = shareCountElement.textContent.trim();
          }

          // 提取推荐次数
          let recommendCount = '0';
          const recommendCountElement = item.querySelector('.appmsg-haokan .weui-desktop-mass-media__data__inner');
          if (recommendCountElement) {
            recommendCount = recommendCountElement.textContent.trim();
          }

          // 提取文章链接
          let link = '';
          const linkElement = item.querySelector('.weui-desktop-mass-appmsg__title');
          if (linkElement && linkElement.href) {
            link = linkElement.href;
          }

          // 提取文章状态
          let status = '';
          const statusElement = item.querySelector('.weui-desktop-mass__status_text');
          if (statusElement) {
            status = statusElement.textContent.trim();
          }

          // 提取发布时间
          let publishTime = '';
          const timeElement = item.querySelector('.weui-desktop-mass__time');
          if (timeElement) {
            publishTime = timeElement.textContent.trim();
          }

          // 如果找到了链接，添加到提取列表
          if (link) {
            const articleData = {
              title,
              coverUrl,
              readCount,
              likeCount,
              shareCount,
              recommendCount,
              status,
              link,
              publishTime,
            };

            // 检查是否已存在相同链接的文章
            const existingIndex = extractedArticles.findIndex(a => a.link === link);
            if (existingIndex === -1) {
              extractedArticles.push(articleData);
              newArticlesCount++;
            } else {
              // 更新已存在的文章数据
              extractedArticles[existingIndex] = {
                ...extractedArticles[existingIndex],
                ...articleData
              };
            }
          }
        } catch (itemError) {
          console.error(`提取第 ${index + 1} 篇文章数据时出错:`, itemError);
        }
      });

      // 保存提取的数据
      GM_setValue('extractedArticles', extractedArticles);

      // 更新计数器
      updateCounter();

      showNotification(`成功提取 ${articleItems.length} 篇文章数据，其中 ${newArticlesCount} 篇为新文章`, '提取成功');

    } catch (error) {
      console.error('提取文章列表数据失败:', error);
      showNotification(`提取失败: ${error.message}`, '提取失败');
    }
  }

  // 从文章详情页提取数据
  function extractFromArticleDetail() {
    try {
      // 获取当前URL
      const currentUrl = window.location.href;

      // 提取标题
      const title = document.querySelector('#activity-name')?.textContent.trim() ||
        document.querySelector('.rich_media_title')?.textContent.trim() || '';

      // 提取描述/摘要
      const desc = document.querySelector('#js_content')?.textContent.substring(0, 100).trim() || '';

      // 提取封面图（可能需要从meta标签获取）
      let coverUrl = '';
      const metaImages = document.querySelectorAll('meta[property="og:image"]');
      if (metaImages.length > 0) {
        coverUrl = metaImages[0].getAttribute('content') || '';
      }

      // 提取发布时间
      const publishTime = document.querySelector('#publish_time')?.textContent.trim() ||
        document.querySelector('.rich_media_meta_text')?.textContent.trim() || '';

      // 提取阅读次数
      let readCount = '0';
      const readCountElement = document.querySelector('#js_read_area')?.textContent.trim() ||
        document.querySelector('.js_read_area')?.textContent.trim() || '';
      if (readCountElement) {
        const readMatch = readCountElement.match(/(\d+)/);
        if (readMatch) {
          readCount = readMatch[1];
        }
      }

      // 提取点赞次数
      let likeCount = '0';
      const likeCountElement = document.querySelector('.like_num')?.textContent.trim() ||
        document.querySelector('#like_num')?.textContent.trim() || '';
      if (likeCountElement) {
        const likeMatch = likeCountElement.match(/(\d+)/);
        if (likeMatch) {
          likeCount = likeMatch[1];
        }
      }

      // 提取分享次数 - 在详情页可能没有直接显示，设为默认值
      let shareCount = '0';

      // 提取推荐次数 - 在详情页可能没有直接显示，设为默认值
      let recommendCount = '0';

      // 提取文章状态 - 在详情页可能没有直接显示
      let status = '已发表';

      // 提取公众号信息
      const accountName = document.querySelector('.profile_nickname')?.textContent.trim() || '';

      // 更新或添加到提取的文章列表
      const articleData = {
        title,
        desc,
        coverUrl,
        publishTime,
        readCount,
        likeCount,
        shareCount,
        recommendCount,
        status,
        link: currentUrl,
        accountName,
      };

      // 检查是否已存在相同链接的文章
      const existingIndex = extractedArticles.findIndex(a => a.link === currentUrl);
      if (existingIndex !== -1) {
        // 更新现有条目
        extractedArticles[existingIndex] = {
          ...extractedArticles[existingIndex],
          ...articleData
        };
      } else {
        // 添加新条目
        extractedArticles.push(articleData);
      }

      // 保存提取的数据
      GM_setValue('extractedArticles', extractedArticles);

      // 更新计数器
      updateCounter();

      showNotification(`成功提取文章详情数据: ${title}`, '提取成功');

    } catch (error) {
      console.error('提取文章详情数据失败:', error);
      showNotification(`提取失败: ${error.message}`, '提取失败');
    }
  }

  // 复制已提取的数据到剪贴板
  function copyExtractedData() {
    if (extractedArticles.length === 0) {
      showNotification('没有已提取的文章数据', '复制失败');
      return;
    }

    const jsonData = JSON.stringify(extractedArticles, null, 2);
    GM_setClipboard(jsonData);

    showNotification(`成功复制 ${extractedArticles.length} 篇文章数据到剪贴板`, '复制成功');
  }

  // 清除已提取的数据
  function clearExtractedData() {
    if (confirm('确定要清除所有已提取的文章数据吗？')) {
      extractedArticles = [];
      GM_setValue('extractedArticles', []);

      // 更新计数器
      updateCounter();

      showNotification('已清除所有提取的文章数据', '清除成功');
    }
  }

  // 更新计数器显示
  function updateCounter() {
    const counterElement = document.getElementById('extract-counter');
    if (counterElement) {
      counterElement.textContent = `已提取: ${extractedArticles.length} 篇文章`;
    }
  }

  // 检查是否在文章列表页面
  function isArticleListPage() {
    return window.location.href.includes('mp.weixin.qq.com') &&
      document.querySelector('.weui-desktop-block');
  }

  // 检查是否在文章详情页面
  function isArticleDetailPage() {
    return (window.location.href.includes('mp.weixin.qq.com/s') ||
      window.location.href.includes('weixin.qq.com/s')) &&
      (document.querySelector('#activity-name') ||
        document.querySelector('.rich_media_title'));
  }

  // 监听DOM变化，确保在动态加载的页面上也能添加按钮
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      if (!document.querySelector('#extract-article-button')) {
        addExtractButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初始化
  function init() {
    // 加载已保存的文章数据
    extractedArticles = GM_getValue('extractedArticles', []);

    // 等待页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        addExtractButton();
        observeDOM();
      });
    } else {
      addExtractButton();
      observeDOM();
    }
  }

  init();
})(); 
