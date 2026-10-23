(() => {
  const endpoint = 'https://hit.kmapshot.com/api/analytics/visit';
  const visitorKey = 'hit-shot-visitor-id';
  const visitorCreatedKey = 'hit-shot-visitor-created';
  const campaignKey = 'hit-shot-campaign';
  const optOutKey = 'hit-shot-opt-out';
  const campaignLifetimeMs = 30 * 60 * 1000;
  const visitorLifetimeMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const optOutButton = document.getElementById('hit-shot-opt-out');
  if (optOutButton) {
    try {
      const optedOut = localStorage.getItem(optOutKey) === 'true';
      optOutButton.textContent = optedOut ? '방문 기록 다시 허용' : '방문 기록 중단';
      optOutButton.addEventListener('click', () => {
        try {
          if (localStorage.getItem(optOutKey) === 'true') {
            localStorage.removeItem(optOutKey);
            optOutButton.textContent = '방문 기록 중단';
          } else {
            localStorage.setItem(optOutKey, 'true');
            localStorage.removeItem(visitorKey);
            localStorage.removeItem(visitorCreatedKey);
            sessionStorage.removeItem(campaignKey);
            optOutButton.textContent = '방문 기록 다시 허용';
          }
        } catch (_) { /* Browser storage is unavailable. */ }
      });
    } catch (_) {
      optOutButton.disabled = true;
    }
  }

  try {
    if (localStorage.getItem(optOutKey) === 'true') return;
  } catch (_) {
    return; // Storage denial also prevents stable identification.
  }

  let campaign = null;
  try {
    const supplied = new URLSearchParams(window.location.search).get('src');
    if (supplied && /^[a-zA-Z0-9_-]{1,64}$/.test(supplied)) {
      sessionStorage.setItem(campaignKey, JSON.stringify({ value: supplied, created: now }));
    }
    const stored = JSON.parse(sessionStorage.getItem(campaignKey) || 'null');
    if (stored && typeof stored.value === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(stored.value) &&
      Number.isFinite(stored.created) && stored.created <= now && now - stored.created < campaignLifetimeMs) {
      campaign = stored.value;
    } else {
      sessionStorage.removeItem(campaignKey);
    }
  } catch (_) {
    // Tracking a direct post visit does not depend on session storage.
  }

  const path = window.location.pathname;
  if (!/^\/posts\/[^/]+\/$/.test(path) || !window.crypto?.randomUUID) return;

  // Keep identifiers and campaign codes out of the request URL and Referrer header.
  let visitorId;
  try {
    visitorId = localStorage.getItem(visitorKey);
    const created = Number(localStorage.getItem(visitorCreatedKey));
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitorId || '') ||
      !Number.isFinite(created) || created <= 0 || created > now || now - created >= visitorLifetimeMs) {
      visitorId = crypto.randomUUID();
      localStorage.setItem(visitorKey, visitorId);
      localStorage.setItem(visitorCreatedKey, String(now));
    }
  } catch (_) {
    return; // Private browsing can block storage; avoid sending unstable visitor IDs.
  }

  let referrerOrigin = null;
  try {
    if (document.referrer) {
      const origin = new URL(document.referrer).origin;
      if (origin !== window.location.origin && /^https?:\/\//.test(origin)) referrerOrigin = origin;
    }
  } catch (_) {
    // An opaque or malformed referrer is simply unknown.
  }

  fetch(endpoint, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, path, campaign, referrerOrigin })
  }).catch(() => {}); // Analytics must not interrupt reading.
})();
