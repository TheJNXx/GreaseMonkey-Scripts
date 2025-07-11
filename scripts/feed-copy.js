// ==UserScript==
// @name         FeedCopy
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Copia el feed RSS al portapapeles
// @author       @Jennifer2005x
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    function encontrarRSS() {
        const feeds = new Set();

        document.querySelectorAll(`
            link[type="application/rss+xml"],
            link[type="application/atom+xml"],
            link[type="application/feed+xml"],
            link[type="application/rdf+xml"],
            link[rel="alternate"][type*="xml"],
            link[rel="feed"],
            link[rel="alternate"][title*="RSS"],
            link[rel="alternate"][title*="Feed"],
            link[rel="alternate"][title*="Atom"]
        `).forEach(feed => feeds.add(feed.href));

        document.querySelectorAll('a').forEach(link => {
            const href = link.href.toLowerCase();
            const text = link.innerText.toLowerCase();
            const title = (link.getAttribute('title') || '').toLowerCase();

            if (href.match(/\/(feed|rss|atom|xml|syndication|index\.xml)($|\/|\?|\.xml)/) ||
                text.match(/(rss|feed|atom|syndication|subscribe)/i) ||
                title.match(/(rss|feed|atom|syndication|subscribe)/i) ||
                href.includes('/feeds/posts/default') ||
                href.match(/\/feed\/(rss|atom)/) ||
                href.includes('feedburner.com') ||
                href.includes('feeds.feedburner.com')) {
                feeds.add(link.href);
            }
        });

        document.querySelectorAll('meta[name*="rss"], meta[property*="rss"], meta[name*="feed"], meta[property*="feed"]')
            .forEach(meta => feeds.add(meta.content));

        const urlActual = window.location.origin;
        const urlsComunesRSS = [
            '/feed', '/rss', '/feed.xml', '/rss.xml', '/atom.xml', '/feeds/posts/default',
            '/index.xml', '/feed/rss', '/feed/atom', '/rss/feed', '/syndication', '/rdf'
        ];

        urlsComunesRSS.forEach(path => {
            const urlPotencial = urlActual + path;
            fetch(urlPotencial, { method: 'HEAD', timeout: 5000 })
                .then(response => {
                    if (response.ok) {
                        feeds.add(urlPotencial);
                        actualizarBoton();
                    }
                })
                .catch(() => {});
        });

        if (window.location.hostname.includes('xataka.com')) {
            feeds.add('https://www.xataka.com/feedburner.xml');
            feeds.add('https://feeds.weblogssl.com/xataka2');
        }

        return Array.from(feeds);
    }

    let botonGlobal = null;

    function actualizarBoton() {
        const feeds = encontrarRSS();
        if (feeds.length > 0 && !botonGlobal) {
            crearBoton(feeds);
        }
    }

    function crearBoton(feeds) {
        if (botonGlobal) return;

        const boton = document.createElement('div');
        botonGlobal = boton;
        boton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 14H8v-2h7v2zm2-4H8v-2h9v2z"/>
            </svg>`;
        
        boton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 40px; /* Tamaño reducido */
            height: 40px; /* Tamaño reducido */
            background: linear-gradient(135deg, #ff7600, #ff9800);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 9999;
            transition: background 0.3s, box-shadow 0.3s;
            opacity: 0;
            transform: scale(1);
        `;

        document.body.appendChild(boton);

        setTimeout(() => {
            boton.style.opacity = '1';
        }, 100);

        boton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(feeds[0]);
                boton.style.background = '#4CAF50';
                boton.innerHTML = '✓';
                setTimeout(() => resetBoton(boton), 2000);
            } catch (err) {
                boton.style.background = '#f44336';
                boton.innerHTML = '❌';
                setTimeout(() => resetBoton(boton), 2000);
            }
        });

        boton.addEventListener('mousedown', () => {
            boton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
            boton.style.background = 'rgba(255, 118, 0, 0.8)';
        });

        boton.addEventListener('mouseup', () => {
            boton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            boton.style.background = 'linear-gradient(135deg, #ff7600, #ff9800)';
        });
    }

    function resetBoton(boton) {
        boton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm3 14H8v-2h7v2zm2-4H8v-2h9v2z"/>
            </svg>`;
        boton.style.background = 'linear-gradient(135deg, #ff7600, #ff9800)';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', actualizarBoton);
    } else {
        actualizarBoton();
    }
})();
