// ==UserScript==
// @name         BottomUp
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Agrega un botón para subir hasta arriba de la página
// @author       @Jennifer2005x
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    var button = document.createElement('button');
    button.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        background-color: #007BFF;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;

    var svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V6M5 12l7-7 7 7" />
        </svg>
    `;

    button.innerHTML = svgIcon;

    function getTranslateButton() {
        const possibleButton = document.querySelector(
            'button[style*="position: fixed"][style*="bottom"][style*="right"]:not(#scrollTopBtn)'
        );
        if (possibleButton?.querySelector('svg')) {
            return possibleButton;
        }
        return null;
    }

    function updateButtonPosition() {
        const translateButton = getTranslateButton();

        if (!translateButton) {
            button.style.right = '20px';
            button.style.bottom = '20px'; // Margen predeterminado
            return;
        }

        const translateRect = translateButton.getBoundingClientRect();

        button.style.right = `${window.innerWidth - translateRect.right + translateRect.width / 2 - button.offsetWidth / 2}px`;
        button.style.bottom = `${window.innerHeight - translateRect.bottom + translateRect.height + 10}px`; // +10 para margen
    }

    button.id = 'scrollTopBtn';

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(button);

    const observer = new MutationObserver(function () {
        if (window.scrollY > 100 && button.style.display === 'flex') {
            updateButtonPosition();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
    });

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            button.style.display = 'flex';
            updateButtonPosition();
        } else {
            button.style.display = 'none';
        }
    });

    window.addEventListener('resize', updateButtonPosition);
    window.addEventListener('load', updateButtonPosition);

    setInterval(updateButtonPosition, 1000);
})();