import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://sabritutuncu.com' // Replace with actual domain when known

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/', '/api/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
