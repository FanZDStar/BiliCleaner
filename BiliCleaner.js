// ==UserScript==
// @name         B站界面清理大师
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  屏蔽哔哩哔哩网站上的各种干扰元素：导航栏、反馈按钮、客服按钮、三点按钮和播放按钮
// @author       You
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式到页面，提前执行以防闪烁
    function addCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* 隐藏整个浮动按钮容器 */
            .storage-box {
                display: none !important;
            }
            
            /* 隐藏新版反馈按钮 */
            a.primary-btn.feedback,
            a[href*="activity-xKR6yNjuJ6.html"] {
                display: none !important;
            }
            
            /* 隐藏客服按钮 */
            a.primary-btn svg + .primary-btn-text,
            span.primary-btn-text:contains("客服"),
            a[href*="customer-service"] {
                display: none !important;
            }
            
            /* 隐藏三点按钮 */
            .primary-btn.three-dots,
            div.three-dots {
                display: none !important;
            }
            
            /* 隐藏播放按钮图标 */
            svg.btn-icon-inner.svg-icon,
            [data-v-3841f18d] {
                display: none !important;
            }
            
            /* 隐藏顶部导航栏 */
            .header-channel-fixed,
            .header-channel-fixed-left,
            .header-channel-fixed-center,
            .header-channel-fixed-right,
            .header-channel-fixed-arrow {
                display: none !important;
            }
            
            /* 隐藏可能存在的导航栏占位空间 */
            .bili-header__channel {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 页面加载完成后执行移除按钮的函数
    function removeElements() {
        // 移除浮动按钮容器
        const elementsToRemove = [
            '.storage-box',
            'a.primary-btn.feedback',
            'a[href*="activity-xKR6yNjuJ6.html"]',
            'a[href*="customer-service"]',
            '.primary-btn.three-dots',
            'div.three-dots',
            'svg.btn-icon-inner.svg-icon',
            '[data-v-3841f18d]',
            '.header-channel-fixed',
            '.bili-header__channel'
        ];
        
        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
        
        // 特别处理客服文本的元素
        const textElements = document.querySelectorAll('span.primary-btn-text');
        textElements.forEach(el => {
            if (el.textContent.trim() === '客服') {
                const parent = el.closest('a, button, div');
                if (parent) {
                    parent.remove();
                } else {
                    el.remove();
                }
            }
        });
    }

    // 立即添加CSS以防闪烁
    if (document.head) {
        addCSS();
    } else {
        // 如果document.head还不存在，等待它创建
        const observer = new MutationObserver(function() {
            if (document.head) {
                addCSS();
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeElements();
            setupObserver();
        });
    } else {
        removeElements();
        setupObserver();
    }
    
    // 设置持续监听
    function setupObserver() {
        const observer = new MutationObserver(function() {
            removeElements();
        });
        
        // 开始监听DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();