// Deploy this on Cloudflare Workers (free)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')
  
  if (!targetUrl) {
    return new Response('Please provide a URL parameter', { status: 400 })
  }
  
  // Add CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'text/html'
  })
  
  try {
    // Fetch the target URL
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = await response.text()
    
    // Modify the HTML to fix relative URLs
    const modifiedHtml = html
      .replace(/src="\//g, `src="${new URL(targetUrl).origin}/`)
      .replace(/href="\//g, `href="${new URL(targetUrl).origin}/`)
    
    return new Response(modifiedHtml, {
      headers: headers,
      status: 200
    })
    
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      headers: headers,
      status: 500
    })
  }
}
