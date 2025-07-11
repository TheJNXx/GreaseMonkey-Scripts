// ==UserScript==
// @name         Another Privacy Redirect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirecciona sitios populares a frontends privados
// @author       @Jennifer2005x
// @match        *://*.youtube.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.instagram.com/*
// @match        *://*.reddit.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.pinterest.com/*
// @grant        none
// @run-at       document-start
// @inject-into  page
// ==/UserScript==

(function() {
    'use strict';

    const redirects = new Map([
        ['www.youtube.com', 'inv.nadeko.net'],
        ['youtube.com', 'inv.nadeko.net'],
        ['m.youtube.com', 'inv.nadeko.net'],
        ['music.youtube.com', 'inv.nadeko.net'],
        ['twitter.com', 'xcancel.com'],
        ['x.com', 'xcancel.com'],
        ['www.reddit.com', 'redlib.tiekoetter.com'],
        ['reddit.com', 'redlib.tiekoetter.com'],
        ['www.instagram.com', 'ig.opnxng.com'],
        ['instagram.com', 'ig.opnxng.com'],
        ['www.tiktok.com', 'offtiktok.com'],
        ['www.pinterest.com', 'bn.bloat.cat'],
        ['pinterest.com', 'bn.bloat.cat'],
        ['co.pinterest.com', 'bn.bloat.cat']
    ]);

    const skipKey = "privacyredirect-skip-" + window.location.hostname + window.location.pathname;
    if (sessionStorage.getItem(skipKey)) return;

    try {
        const currentHost = window.location.hostname.toLowerCase();
        const newHost = redirects.get(currentHost);

        if (newHost) {
            if (window.confirm('¿Quieres redireccionar a la versión privada de este sitio?')) {
                const newUrl = 'https://' + newHost + window.location.pathname + window.location.search + window.location.hash;
                if (window.location.href !== newUrl) {
                    window.location.replace(newUrl);
                }
            } else {
                sessionStorage.setItem(skipKey, "1");
            }
        }
    } catch (e) {
    }
})();