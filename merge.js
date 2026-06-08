(function () {
  const frames = Array.from(document.querySelectorAll(".section-frame"));
  const gameSection = document.getElementById("game-section");
  const gameFrame = document.getElementById("frame-game");
  const part1Frame = document.getElementById("frame-part1");

  let gameState = "none"; // none | pinned | playing | ended | skipped | finished
  let neverLockAgain = false;
  let savedGameHeight = window.innerHeight;

  const FALLBACK_HEIGHTS = {
    "frame-intro": 1500,
    "frame-game": window.innerHeight,
    "frame-part1": 2600,
    "frame-part2": 5200,
    "frame-part3": 4200,
    "frame-part4": 2800,
  };

  function isGameLocked() {
    return !neverLockAgain && (gameState === "pinned" || gameState === "playing");
  }

  function isGameFullscreen() {
    return !neverLockAgain && (gameState === "pinned" || gameState === "playing");
  }

  function getFrameHeight(iframe) {
    if (iframe.id === "frame-game" && isGameFullscreen()) {
      return window.innerHeight;
    }

    try {
      const doc = iframe.contentDocument;
      if (!doc) return null;

      const page = doc.querySelector(".page");
      if (page) {
        const pageBottom = Math.ceil(
          page.getBoundingClientRect().top + page.offsetHeight
        );
        if (pageBottom > 0) return pageBottom;
      }

      const body = doc.body;
      const html = doc.documentElement;
      const height = Math.max(
        body ? body.scrollHeight : 0,
        body ? body.offsetHeight : 0,
        html ? html.scrollHeight : 0,
        html ? html.clientHeight : 0
      );

      return height > 0 ? height : null;
    } catch (_) {
      return null;
    }
  }

  function triggerInnerResize(iframe) {
    try {
      iframe.contentWindow.dispatchEvent(new Event("resize"));
    } catch (_) {}
  }

  function notifyGameReleased() {
    try {
      if (gameFrame.contentWindow.__gameRelease) {
        gameFrame.contentWindow.__gameRelease();
      } else {
        gameFrame.contentWindow.postMessage({ type: "game-released" }, "*");
      }
    } catch (_) {}
  }

  function applyGameHeight(height) {
    const h = Math.max(Number(height) || 0, window.innerHeight);
    savedGameHeight = h;
    gameFrame.style.height = h + "px";
    triggerInnerResize(gameFrame);
  }

  function resizeGameFrame() {
    if (neverLockAgain && savedGameHeight > window.innerHeight) {
      applyGameHeight(savedGameHeight);
      return;
    }

    const measured = getFrameHeight(gameFrame);
    const fallback = neverLockAgain
      ? Math.max(savedGameHeight, window.innerHeight)
      : FALLBACK_HEIGHTS["frame-game"];
    const height = measured || fallback;
    applyGameHeight(height);
  }

  function resizeFrame(iframe) {
    if (iframe.id === "frame-game") {
      resizeGameFrame();
      return;
    }

    const measured = getFrameHeight(iframe);
    const fallback = FALLBACK_HEIGHTS[iframe.id] || 800;
    iframe.style.height = (measured || fallback) + "px";
    triggerInnerResize(iframe);
  }

  function resizeAll() {
    frames.forEach(resizeFrame);
  }

  function observeFrame(iframe) {
    try {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;

      const observer = new MutationObserver(function () {
        if (iframe.id === "frame-game" && isGameFullscreen()) return;
        resizeFrame(iframe);
      });

      observer.observe(doc.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      if (doc.fonts && doc.fonts.ready) {
        doc.fonts.ready.then(function () {
          resizeFrame(iframe);
        });
      }

      Array.from(doc.images || []).forEach(function (img) {
        if (!img.complete) {
          img.addEventListener("load", function () {
            resizeFrame(iframe);
          });
        }
      });
    } catch (_) {}
  }

  function lockScroll() {
    document.documentElement.classList.add("game-locked");
    document.body.classList.add("game-locked");
  }

  function unlockScroll() {
    document.documentElement.classList.remove("game-locked");
    document.body.classList.remove("game-locked");
  }

  function unpinGame() {
    gameSection.classList.remove("is-pinned");
    unlockScroll();
    resizeGameFrame();
  }

  function releaseGamePermanently(nextState) {
    neverLockAgain = true;
    gameState = nextState;
    unpinGame();
    notifyGameReleased();
    setTimeout(resizeGameFrame, 80);
    setTimeout(resizeGameFrame, 400);
    setTimeout(resizeGameFrame, 1000);
  }

  function scrollToPart1() {
    unpinGame();

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        const html = document.documentElement;
        const prevBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, part1Frame.offsetTop);
        part1Frame.scrollIntoView({ block: "start", behavior: "auto" });
        html.style.scrollBehavior = prevBehavior;
      });
    });
  }

  function exitGame() {
    if (gameState === "skipped" || gameState === "finished") return;
    releaseGamePermanently("skipped");
    scrollToPart1();
  }

  function finishGame() {
    if (gameState === "finished") return;
    releaseGamePermanently("finished");
    scrollToPart1();
  }

  function onGameEnded() {
    if (neverLockAgain) return;
    releaseGamePermanently("ended");
  }

  function pinGame() {
    if (neverLockAgain || gameState !== "none") return;

    gameState = "pinned";
    gameSection.classList.add("is-pinned");
    lockScroll();
    window.scrollTo(0, gameSection.offsetTop);
    gameFrame.style.height = window.innerHeight + "px";
  }

  function enterGame() {
    if (neverLockAgain) return;

    if (gameState === "none") {
      pinGame();
    }
    gameState = "playing";
    lockScroll();
    window.scrollTo(0, gameSection.offsetTop);
    gameFrame.style.height = window.innerHeight + "px";
  }

  function restartGame() {
    if (neverLockAgain) {
      gameState = "ended";
      unpinGame();
      return;
    }

    gameState = "playing";
    gameSection.classList.add("is-pinned");
    lockScroll();
    window.scrollTo(0, gameSection.offsetTop);
    gameFrame.style.height = window.innerHeight + "px";
  }

  function handleScroll() {
    if (neverLockAgain) return;
    if (gameState === "skipped" || gameState === "finished" || gameState === "ended") return;

    if (gameState === "pinned" || gameState === "playing") {
      const top = gameSection.offsetTop;
      if (Math.abs(window.scrollY - top) > 1) {
        window.scrollTo(0, top);
      }
      return;
    }

    const rect = gameSection.getBoundingClientRect();
    if (rect.top <= 60 && rect.bottom > window.innerHeight * 0.35) {
      pinGame();
    }
  }

  frames.forEach(function (iframe) {
    iframe.addEventListener("load", function () {
      resizeFrame(iframe);
      observeFrame(iframe);

      setTimeout(function () {
        resizeFrame(iframe);
      }, 300);

      setTimeout(function () {
        resizeFrame(iframe);
      }, 1200);
    });
  });

  window.addEventListener("message", function (event) {
    const data = event.data;
    if (!data || !data.type) return;

    if (data.type === "section-resize") {
      const iframe = document.getElementById(data.section);
      if (!iframe) return;

      if (iframe.id === "frame-game") {
        if (isGameFullscreen()) {
          iframe.style.height = window.innerHeight + "px";
          return;
        }
        applyGameHeight(data.height);
        return;
      }

      const height = data.height || getFrameHeight(iframe) || FALLBACK_HEIGHTS[iframe.id] || 800;
      iframe.style.height = height + "px";
      triggerInnerResize(iframe);
      return;
    }

    if (data.type === "game-action") {
      if (data.action === "enter") enterGame();
      if (data.action === "exit") exitGame();
      if (data.action === "ended") onGameEnded();
      if (data.action === "continue") finishGame();
      if (data.action === "restart") restartGame();
    }
  });

  window.addEventListener("scroll", handleScroll, { passive: true });

  window.addEventListener("resize", function () {
    if (isGameFullscreen()) {
      gameFrame.style.height = window.innerHeight + "px";
      window.scrollTo(0, gameSection.offsetTop);
    } else {
      resizeGameFrame();
    }
    resizeAll();
  });

  window.addEventListener("wheel", function (event) {
    if (!isGameLocked()) return;
    event.preventDefault();
  }, { passive: false });

  window.addEventListener("touchmove", function (event) {
    if (!isGameLocked()) return;
    event.preventDefault();
  }, { passive: false });

  if ("IntersectionObserver" in window) {
    const gameObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && neverLockAgain) {
          notifyGameReleased();
          resizeGameFrame();
        }
      });
    }, { threshold: 0.1 });

    gameObserver.observe(gameSection);
  }

  window.addEventListener("hashchange", function () {
    if (location.hash === "#part1") finishGame();
  });

  if (location.hash === "#part1") {
    finishGame();
  }

  window.__gameBridge = {
    enter: enterGame,
    exit: exitGame,
    finish: finishGame,
    restart: restartGame,
    ended: onGameEnded,
  };
})();
