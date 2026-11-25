(() => {
"use strict";
const $ = id => document.getElementById(id);
const status = msg => { $("bv-pwa-status").textContent = msg; };
let prompt, reg, updating = false;
const installed = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); prompt = e; });
window.addEventListener("appinstalled", () => { prompt = null; status("Aplicación instalada."); $("bv-install").hidden = true; });
$("bv-install").hidden = !!installed();
$("bv-install").onclick = async () => {
 if (!prompt) { alert("En el menú de tu navegador elige Instalar aplicación o Añadir a pantalla de inicio. En iPhone usa Compartir en Safari."); return; }
 try { await prompt.prompt(); await prompt.userChoice; } catch(e) { status("No se pudo iniciar la instalación."); } finally { prompt = null; }
};
$("bv-backup").onclick = () => BV.store.exportarRespaldo();
$("bv-restore").onclick = () => $("bv-backup-file").click();
$("bv-backup-file").onchange = async e => {
 const file = e.target.files[0]; e.target.value = "";
 if (!file || !confirm("¿Restaurar este respaldo? Reemplazará el progreso actual. Guarda primero una copia si la necesitas.")) return;
 try { await BV.store.importarRespaldo(file); location.reload(); } catch(err) { alert(err.message); }
};
if (!("serviceWorker" in navigator)) { status("Este navegador no admite el modo offline."); $("bv-update").disabled = true; return; }
const available = () => { status("Nueva versión disponible. Guarda tu partida antes de actualizar."); $("bv-update").textContent = "Actualizar ahora"; };
navigator.serviceWorker.addEventListener("controllerchange", () => { if (updating) location.reload(); });
navigator.serviceWorker.ready.then(r => { reg = r; status("Recursos básicos disponibles sin Internet."); if (r.waiting) available(); });
navigator.serviceWorker.register("./sw.js").then(r => {
 reg = r; if (r.waiting) available();
 r.addEventListener("updatefound", () => { const worker = r.installing; worker?.addEventListener("statechange", () => { if (worker.state === "installed" && navigator.serviceWorker.controller) available(); if (worker.state === "redundant") status("No se pudo descargar la actualización."); }); });
}).catch(() => status("No se pudo preparar el modo offline."));
$("bv-update").onclick = async () => {
 if (!navigator.onLine) { status("Conéctate a Internet para buscar actualizaciones."); return; }
 if (!reg) { status("La aplicación todavía se está preparando."); return; }
 try { if (!reg.waiting) { status("Buscando actualizaciones…"); await reg.update(); }
 if (reg.waiting) { if (!confirm("¿Actualizar ahora? Tus logros se conservarán, pero una partida abierta podría reiniciarse.")) return; BV.store.guardar(); updating = true; reg.waiting.postMessage({type:"SKIP_WAITING"}); }
 else status(reg.installing ? "Descargando actualización…" : "No hay una actualización pendiente.");
 } catch(e) { status("No se pudo comprobar la actualización. Intenta más tarde."); }
};
})();