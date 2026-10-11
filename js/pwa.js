/* v27: installable app. Registers the service worker and runs the title-screen install button. */
(function () {
  "use strict";
  var btn = document.getElementById("installBtn");
  var hint = document.getElementById("installHint");

  function isStandalone() {
    return (window.matchMedia && (matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches)) ||
      window.navigator.standalone === true;
  }
  var ua = navigator.userAgent || "";
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var deferred = null;

  function hideAll() {
    if (btn) btn.hidden = true;
    if (hint) hint.hidden = true;
  }
  if (isStandalone()) {
    document.documentElement.classList.add("pwa");
    hideAll();
  } else if (isIOS && hint) {
    // iOS Safari never fires beforeinstallprompt; show the manual steps instead.
    hint.hidden = false;
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    if (btn && !isStandalone()) btn.hidden = false;
  });
  window.addEventListener("appinstalled", function () {
    deferred = null;
    hideAll();
  });
  if (btn) {
    btn.addEventListener("click", function () {
      if (!deferred) { btn.hidden = true; return; }
      var ev = deferred;
      deferred = null;
      ev.prompt();
      (ev.userChoice || Promise.resolve({})).then(function (choice) {
        if (choice && choice.outcome === "accepted") hideAll();
        else btn.hidden = true; // Chrome will offer the prompt again later via a fresh beforeinstallprompt
      }).catch(function () { btn.hidden = true; });
    });
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js", { scope: "./", updateViaCache: "none" }).catch(function (err) {
        console.warn("Service worker registration failed:", err);
      });
    });
  }
})();
