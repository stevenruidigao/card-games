const version = "0.0.1";
const cacheName = `card-games-${version}`;
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				'/',
				'/index.html',
				'/favicon.ico',
				'/manifest.json',
				'/css/app.css',
				'/css/reset.css',
				'/js/client.js',
				'/images/AS-192.png',
				'/images/AS-512.png',
				'/fonts/Arial.woff'
			]).then(() => self.skipWaiting());
		})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.open(cacheName)
		.then(cache => cache.match(event.request, {ignoreSearch: true}))
		.then(response => {
			return response || fetch(event.request);
		})
	);
});
