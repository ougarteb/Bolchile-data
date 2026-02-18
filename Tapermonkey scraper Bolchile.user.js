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
    const WEBHOOK_URL = "https://n8n.oscarugarte.cl/webhook/bolchile-data";
    const MINUTOS_RECARGA = 2; // <--- Cambiado a 2 minutos

    function enviarDatos(force = false) {
        const ahora = new Date();
        const hora = ahora.getHours();

        if (hora >= 8 && hora < 16) {
            console.log("Dentro de horario de mercado. Extrayendo...");

            const precios = document.body.innerText.match(/\$\d+,\d+/g) || [];
            const preciosString = JSON.stringify(precios);
            const lastPrices = localStorage.getItem('last_bolchile_prices');

            if (force || preciosString !== lastPrices) {
                console.log(force ? "Forzando envío por recarga..." : "Cambios detectados. Enviando a n8n...");

                const payload = {
                    sitio: "Bolchile",
                    precios: precios,
                    html_full: document.body.innerText.substring(0, 10000)
                };

                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload)
                }).then(() => {
                    console.log("🚀 Datos enviados a n8n. Próxima recarga en " + MINUTOS_RECARGA + " min.");
                    localStorage.setItem('last_bolchile_prices', preciosString);
                });
            } else {
                console.log("Sin cambios en los precios. No se envía nada.");
            }
        } else {
            console.log("Fuera de horario de mercado.");
        }
    }

    // Iniciar monitoreo continuo después de 15 segundos de carga inicial
    setTimeout(() => {
        console.log("Iniciando monitoreo de cambios...");
        enviarDatos(true); // Primera ejecución FORZADA
        setInterval(() => enviarDatos(false), 15000); // Revisar cambios cada 5 segundos (no forzado)
    }, 15000);

    setTimeout(() => {
        location.reload();
    }, MINUTOS_RECARGA * 60 * 1000);

})();