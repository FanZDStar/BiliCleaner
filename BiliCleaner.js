/*
 * @Author: ourEDA MaMing
 * @Date: 2025-05-02 00:11:38
 * @LastEditors: ourEDA MaMing
 * @LastEditTime: 2025-05-12 15:33:46
 * @FilePath: \BiliCleaner\BiliCleaner.js
 * @Description: 李猴啊
 * 
 * Copyright (c) 2025 by FanZDStar , All Rights Reserved. 
 */

// ==UserScript==
// @name         B站界面清理助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽B站界面中的"新版反馈"、"客服"按钮和播放控制按钮
// @author       ourEDA
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建CSS样式来隐藏目标元素
    const createHideStyle = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* 隐藏新版反馈按钮 */
            .primary-btn.feedback,
            a[href*="blackboard/activity-xKR6yNjuJ6.html"] {
                display: none !important;
            }
            
            /* 隐藏客服按钮 */
            .primary-btn[href*="v/customer-service"],
            a[href*="v/customer-service"] {
                display: none !important;
            }
            
            /* 如果按钮在容器中，可能需要隐藏整个容器 */
            .storage-box .storable-items {
                visibility: hidden !important;
            }
            
            /* 三点按钮如果不需要也可以隐藏 */
            .storage-box .primary-btn.three-dots {
                display: none !important;
            }
            
            /* 隐藏带视频播放图标的按钮 */
            svg[viewBox="0 0 24 24"] path[d="M15.1659 11.0861C15.8694 11.4922 15.8694 12.5077 15.1659 12.9138L11.207 15.1995C10.5035 15.6056 9.62413 15.0979 9.62413 14.2856L9.62413 9.71432C9.62413 8.90197 10.5035 8.39425 11.207 8.80042L15.1659 11.0861z"],
            .btn-icon-inner.svg-icon,
            .video-play-button,
            .video-state-play-icon {
                display: none !important;
            }
            
            /* 隐藏包含该SVG的父元素，如果需要的话 */
            [class*="play-button"],
            [class*="play-icon"],
            .btn-icon:has(svg.btn-icon-inner),
            .svg-icon-container:has(svg[viewBox="0 0 24 24"] path[d="M15.1659 11.0861C15.8694 11.4922 15.8694 12.5077 15.1659 12.9138L11.207 15.1995C10.5035 15.6056 9.62413 15.0979 9.62413 14.2856L9.62413 9.71432C9.62413 8.90197 10.5035 8.39425 11.207 8.80042L15.1659 11.0861z"]) {
                display: none !important;
            }
        `;
        return style;
    };

    // 在DOM加载时插入样式
    const injectStyles = () => {
        document.head.appendChild(createHideStyle());
    };

    // 定期检查并移除元素的函数
    const removeElements = () => {
        // 查找并移除新版反馈按钮
        document.querySelectorAll('a[href*="blackboard/activity-xKR6yNjuJ6.html"], .primary-btn.feedback').forEach(el => {
            el.style.display = 'none';
        });

        // 查找并移除客服按钮
        document.querySelectorAll('a[href*="v/customer-service"]').forEach(el => {
            el.style.display = 'none';
        });

        // 如果需要隐藏整个容器
        document.querySelectorAll('.storage-box .storable-items').forEach(el => {
            el.style.visibility = 'hidden';
        });

        // 隐藏三点按钮
        document.querySelectorAll('.storage-box .primary-btn.three-dots').forEach(el => {
            el.style.display = 'none';
        });
        
        // 隐藏视频播放按钮
        document.querySelectorAll('.btn-icon-inner.svg-icon, [data-v-3841f18d]').forEach(el => {
            const parentElement = el.closest('.btn-icon, [class*="play-button"], [class*="video-play"]');
            if (parentElement) {
                parentElement.style.display = 'none';
            }
            el.style.display = 'none';
        });
        
        // 通过SVG路径寻找并隐藏播放按钮
        document.querySelectorAll('svg').forEach(svg => {
            if (svg.innerHTML.includes('M15.1659 11.0861C15.8694 11.4922 15.8694 12.5077')) {
                const parentElement = svg.closest('button, div, a');
                if (parentElement) {
                    parentElement.style.display = 'none';
                }
                svg.style.display = 'none';
            }
        });
    };

    // 网页加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            removeElements();
            // 持续监控DOM变化
            setInterval(removeElements, 2000);
        });
    } else {
        injectStyles();
        removeElements();
        // 持续监控DOM变化
        setInterval(removeElements, 2000);
    }

    // 使用MutationObserver实时监控DOM变化
    const observer = new MutationObserver((mutations) => {
        removeElements();
    });
    
    // 页面加载完成后开始观察
    window.addEventListener('load', () => {
        observer.observe(document.body, { 
            childList: true,
            subtree: true
        });
    });
})();