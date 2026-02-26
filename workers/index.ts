addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    new Response('Hello from Cloudflare Worker!', {
      headers: { 'Content-Type': 'text/plain' },
    })
  );
});
