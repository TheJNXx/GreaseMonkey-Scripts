// ==UserScript==
// @name         LittleTranslate
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Traductor de paginas simple usando la API de Google Translate
// @author       @Jennifer2005x
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    const userLang = navigator.language.split('-')[0];
    const pageLang = document.documentElement.lang?.split('-')[0];
    
    if (pageLang && pageLang !== userLang) {
        const btn = document.createElement('button');
        
        const translateIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>`;

        btn.innerHTML = translateIcon;
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999999;
            background: #4285f4;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        `;

        btn.onclick = () => {
            window.location.href = `https://translate.google.com/translate?sl=auto&tl=${userLang}&u=${encodeURIComponent(window.location.href)}`;
        };

        btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';

        document.body.appendChild(btn);
    }
})();