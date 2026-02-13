// ==UserScript==
// @name         Bolchile Auto-Sync to n8n
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extrae indicadores y los envía a n8n cada 2 minutos
// @author       Oscar
// @match        https://www.bolchile.com/dollar
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // CONFIGURACIÓN
    const WEBHOOK_URL = "https://n8n.oscarugarte.cl/webhook-test/bolchile-data";
    const MINUTOS_RECARGA = 2; // <--- Cambiado a 2 minutos

    function enviarDatos() {
        const ahora = new Date();
        const hora = ahora.getHours();

        if (hora >= 8 && hora < 16) {
            console.log("Dentro de horario de mercado. Extrayendo...");

            const payload = {
                sitio: "Bolchile",
                timestamp: ahora.toISOString(),
                precios: document.body.innerText.match(/\$\d+,\d+/g) || [],
                html_full: document.body.innerText.substring(0, 1500)
            };

            fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            }).then(() => {
                console.log("🚀 Datos enviados a n8n. Próxima recarga en " + MINUTOS_RECARGA + " min.");
            });
        } else {
            console.log("Fuera de horario de mercado.");
        }
    }

    setTimeout(enviarDatos, 5000);

    setTimeout(() => {
        location.reload();
    }, MINUTOS_RECARGA * 60 * 1000);

})();