import type { ResolvedMetadata, Icon } from './types'

function esc(str: any) {
  return String(str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function Meta(name: string, content: any) {
  return `<meta name="${esc(name)}" content="${esc(content)}">`
}

function MetaProp(name: string, content: any) {
  return `<meta property="${esc(name)}" content="${esc(content)}">`
}

function MetaMedia(name: string, content: any, media: string) {
  return `<meta name="${esc(name)}" content="${esc(content)}" media="${esc(media)}">`
}

function Link(rel: string, href: any) {
  return `<link rel="${esc(rel)}" href="${esc(href)}" />`
}

function LinkMedia(rel: string, href: any, media: string) {
  return `<link rel="${esc(rel)}" href="${esc(href)}" media="${esc(media)}">`
}

const resolveUrl = (url: string | URL) =>
  typeof url === 'string' ? url : url.toString()

function IconLink(rel: string, icon: Icon) {
  if (typeof icon === 'object' && !(icon instanceof URL)) {
    const { url, rel, ...props } = icon;
    return `<link rel="${esc(rel)}" href="${esc(resolveUrl(url))}" ${Object.keys(props).map(key => `${key}="${esc(props[key])}"`).join(' ')} />`;
  } else {
    const href = resolveUrl(icon)
    return Link(rel, href);
  }
}

function ExtendMeta(prefix: string, content: any) {
  if (
    typeof content === 'string' ||
    typeof content === 'number' ||
    content instanceof URL
  ) {
    return MetaProp(prefix, content);
  } else {
    let str = '';
    for (const [prop, value] of content) {
      if (value) {
        str += MetaProp(
          prefix === 'og:image' && prop === 'url' ? 'og:image' : prefix + ':' + prop,
          value
        );
      }
    }
    return str;
  }
}

const formatDetectionKeys = [
  'telephone',
  'date',
  'address',
  'email',
  'url',
] as const;

export function renderMetadata(meta: ResolvedMetadata): string {
  let str = '';

  // <BasicMetadata/>
  if (meta.title?.absolute) str += `<title>${esc(meta.title.absolute)}</title>`;
  if (meta.description) str += Meta('description', meta.description);
  if (meta.applicationName) str += Meta('application-name', meta.applicationName);
  if (meta.authors) for (const author of meta.authors) {
    if (author.url) str += Link("author", author.url);
    if (author.name) str += Meta('author', author.name);
  }
  if (meta.manifest) str += Link("manifest", meta.manifest);
  if (meta.generator) str += Meta('generator', meta.generator);
  if (meta.referrer) str += Meta('referrer', meta.referrer);
  if (meta.themeColor) for (const themeColor of meta.themeColor) {
    str += !themeColor.media
      ? Meta('theme-color', themeColor.color)
      : MetaMedia('theme-color', themeColor.color, themeColor.media);
  }
  if (meta.colorScheme) str += Meta('color-scheme', meta.colorScheme);
  if (meta.viewport) str += Meta('viewport', meta.viewport);
  if (meta.creator) str += Meta('creator', meta.creator);
  if (meta.publisher) str += Meta('publisher', meta.publisher);
  if (meta.robots?.basic) str += Meta('robots', meta.robots.basic);
  if (meta.robots?.googleBot) str += Meta('googlebot', meta.robots.googleBot);
  if (meta.abstract) str += Meta('abstract', meta.abstract);
  if (meta.archives) for (const archive of meta.archives) {
    str += Link("archives", archive);
  }
  if (meta.assets) for (const asset of meta.assets) {
    str += Link("assets", asset);
  }
  if (meta.bookmarks) for (const bookmark of meta.bookmarks) {
    str += Link("bookmarks", bookmark);
  }
  if (meta.category) str += Meta('category', meta.category);
  if (meta.classification) str += Meta('classification', meta.classification);
  if (meta.other) for (const [name, content] of Object.entries(meta.other)) {
    if (content) {
      str += Meta(name, Array.isArray(content) ? content.join(',') : content);
    }
  }

  // <AlternatesMetadata />
  const alternates = meta.alternates;
  if (alternates) {
    if (alternates.canonical) str += Link('canonical', alternates.canonical);
    if (alternates.languages) for (const [locale, url] of Object.entries(alternates.languages)) {
      str += `<link rel="alternate" hreflang="${esc(locale)}" href="${esc(url)}">`
    }
    if (alternates.media) for (const [media, url] of Object.entries(alternates.media)) {
      str += `<link rel="alternate" media="${esc(media)}" href="${esc(url)}">`
    }
    if (alternates.types) for (const [type, url] of Object.entries(alternates.types)) {
      str += `<link rel="alternate" type="${esc(type)}" href="${esc(url)}">`
    }
  }

  // <ItunesMeta />
  if (meta.itunes) {
    str += Meta(
      'apple-itunes-app',
      `app-id=${meta.itunes.appId}${meta.itunes.appArgument ? `, app-argument=${meta.itunes.appArgument}` : ''}`
    )
  }

  // <FormatDetectionMeta />
  if (meta.formatDetection) {
    let content = ''
    for (const key of formatDetectionKeys) {
      if (key in meta.formatDetection) {
        if (content) content += ', '
        content += `${key}=no`
      }
    }
    str += Meta('format-detection', content)
  }

  // <VerificationMeta />
  if (meta.verification) {
    if (meta.verification.google) for (const key of meta.verification.google) {
      str += Meta('google-site-verification', key);
    }
    if (meta.verification.yahoo) for (const key of meta.verification.yahoo) {
      str += Meta('y_key', key);
    }
    if (meta.verification.yandex) for (const key of meta.verification.yandex) {
      str += Meta('yandex-verification', key);
    }
    if (meta.verification.me) for (const key of meta.verification.me) {
      str += Meta('me', key);
    }
    if (meta.verification.other) {
      for (const [key, values] of Object.entries(meta.verification.other)) {
        for (const value of values) {
          str += Meta(key, value);
        }
      }
    }
  }

  // <AppleWebAppMeta />
  if (meta.appleWebApp) {
    const { capable, title, startupImage, statusBarStyle } = meta.appleWebApp;
    if (capable) str += '<meta name="apple-mobile-web-app-capable" content="yes" />';
    if (title) str += Meta('apple-mobile-web-app-title', title)
    if (startupImage) for (const img of startupImage) {
      str += !img.media
        ? Link("apple-touch-startup-image", img.url)
        : LinkMedia("apple-touch-startup-image", img.url, img.media);
    }
    if (statusBarStyle) str += Meta('apple-mobile-web-app-status-bar-style', statusBarStyle)
  }

  // <OpenGraphMetadata />
  if (meta.openGraph) {
    const og = meta.openGraph;
    if (og.determiner) str += MetaProp('og:determiner', og.determiner);
    if (og.title?.absolute) str += MetaProp('og:title', og.title.absolute);
    if (og.description) str += MetaProp('og:description', og.description);
    if (og.url) str += MetaProp('og:url', og.url);
    if (og.siteName) str += MetaProp('og:site_name', og.siteName);
    if (og.locale) str += MetaProp('og:locale', og.locale);
    if (og.countryName) str += MetaProp('og:country_name', og.countryName);
    if (og.ttl) str += MetaProp('og:ttl', og.ttl);
    if (og.images) for (const item of og.images) {
      str += ExtendMeta('og:image', item);
    }
    if (og.videos) for (const item of og.videos) {
      str += ExtendMeta('og:video', item);
    }
    if (og.audio) for (const item of og.audio) {
      str += ExtendMeta('og:audio', item);
    }
    if (og.emails) for (const item of og.emails) {
      str += ExtendMeta('og:email', item);
    }
    if (og.phoneNumbers) for (const item of og.phoneNumbers) {
      str += MetaProp('og:phone_number', item);
    }
    if (og.faxNumbers) for (const item of og.faxNumbers) {
      str += MetaProp('og:fax_number', item);
    }
    if (og.alternateLocale) for (const item of og.alternateLocale) {
      str += MetaProp('og:locale:alternate', item);
    }

    if ('type' in og) {
      str += MetaProp('og:type', og.type);
      switch (og.type) {
        case 'website':
          break;
        case 'article':
          if (og.publishedTime) str += MetaProp('article:published_time', og.publishedTime);
          if (og.modifiedTime) str += MetaProp('article:modified_time', og.modifiedTime);
          if (og.expirationTime) str += MetaProp('article:expiration_time', og.expirationTime);
          if (og.authors) for (const item of og.authors) {
            str += MetaProp('article:author', item);
          }
          if (og.section) str += MetaProp('article:section', og.section);
          if (og.tags) for (const item of og.tags) {
            str += MetaProp('article:tag', item);
          }
          break;
        case 'book':
          if (og.isbn) str += MetaProp('book:isbn', og.isbn);
          if (og.releaseDate) str += MetaProp('book:release_date', og.releaseDate);
          if (og.authors) for (const item of og.authors) {
            str += MetaProp('article:author', item);
          }
          if (og.tags) for (const item of og.tags) {
            str += MetaProp('article:tag', item);
          }
          break;
        case 'profile':
          if (og.firstName) str += MetaProp('profile:first_name', og.firstName);
          if (og.lastName) str += MetaProp('profile:last_name', og.lastName);
          if (og.username) str += MetaProp('profile:first_name', og.username);
          if (og.gender) str += MetaProp('profile:first_name', og.gender);
          break;
        case 'music.song':
          if (og.duration) str += MetaProp('music:duration', og.duration);
          if (og.albums) for (const item of og.albums) {
            str += ExtendMeta('music:albums', item);
          }
          if (og.musicians) for (const item of og.musicians) {
            str += MetaProp('music:musician', item);
          }
          break;
        case 'music.album':
          if (og.songs) for (const item of og.songs) {
            str += ExtendMeta('music:song', item);
          }
          if (og.musicians) for (const item of og.musicians) {
            str += MetaProp('music:musician', item);
          }
          if (og.releaseDate) str += MetaProp('music:release_date', og.releaseDate);
          break;
        case 'music.playlist':
          if (og.songs) for (const item of og.songs) {
            str += ExtendMeta('music:song', item);
          }
          if (og.creators) for (const item of og.creators) {
            str += MetaProp('music:creator', item);
          }
          break;
        case 'music.radio_station':
          if (og.creators) for (const item of og.creators) {
            str += MetaProp('music:creator', item);
          }
          break;
        case 'video.movie':
          if (og.actors) for (const item of og.actors) {
            str += ExtendMeta('video:actor', item);
          }
          if (og.directors) for (const item of og.directors) {
            str += MetaProp('video:director', item);
          }
          if (og.writers) for (const item of og.writers) {
            str += MetaProp('video:writer', item);
          }
          if (og.duration) str += MetaProp('video:duration', og.duration);
          if (og.releaseDate) str += MetaProp('video:release_date', og.releaseDate);
          if (og.tags) for (const item of og.tags) {
            str += MetaProp('video:tag', item);
          }
          break;
        case 'video.episode':
          if (og.actors) for (const item of og.actors) {
            str += ExtendMeta('video:actor', item);
          }
          if (og.directors) for (const item of og.directors) {
            str += MetaProp('video:director', item);
          }
          if (og.writers) for (const item of og.writers) {
            str += MetaProp('video:writer', item);
          }
          if (og.duration) str += MetaProp('video:duration', og.duration);
          if (og.releaseDate) str += MetaProp('video:release_date', og.releaseDate);
          if (og.tags) for (const item of og.tags) {
            str += MetaProp('video:tag', item);
          }
          if (og.series) str += MetaProp('video:series', og.series);
          break;
        case 'video.other':
        case 'video.tv_show':
        default:
          throw new Error('Invalid OpenGraph type: ' + og.type)
      }
    }
  }

  // <TwitterMetadata />
  if (meta.twitter) {
    const twitter = meta.twitter;

    if (twitter.card) str += Meta('twitter:card', twitter.card);
    if (twitter.site) str += Meta('twitter:site', twitter.site);
    if (twitter.siteId) str += Meta('twitter:site:id', twitter.siteId);
    if (twitter.creator) str += Meta('twitter:creator', twitter.creator);
    if (twitter.creatorId) str += Meta('twitter:creator:id', twitter.creatorId);
    if (twitter.title?.absolute) str += Meta('twitter:title', twitter.title.absolute);
    if (twitter.description) str += Meta('twitter:description', twitter.description);
    if (twitter.images) for (const img of twitter.images) {
      str += Meta('twitter:image', img.url);
      if (img.alt) str += Meta('twitter:image:alt', img.alt);
    }
    if (twitter.card === 'player') for (const player of twitter.players) {
      if (player.playerUrl) str += Meta('twitter:player', player.playerUrl);
      if (player.streamUrl) str += Meta('twitter:player:stream', player.streamUrl);
      if (player.width) str += Meta('twitter:player:width', player.width);
      if (player.height) str += Meta('twitter:player:height', player.height);
    }
    if (twitter.card === 'app') {
      for (const type of ['iphone', 'ipad', 'googleplay']) {
        if (twitter.app.id[type]) {
          str += Meta(`twitter:app:name:${type}`, twitter.app.name);
          str += Meta(`twitter:app:id:${type}`, twitter.app.id[type]);
        }
        if (twitter.app.url?.[type]) {
          str += Meta(`twitter:app:url:${type}`, twitter.app.url[type]);
        }
      }
    }
  }

  // <AppLinksMeta />
  if (meta.appLinks) {
    if (meta.appLinks.ios) for (const item of meta.appLinks.ios) {
      str += ExtendMeta('al:ios', item);
    }
    if (meta.appLinks.iphone) for (const item of meta.appLinks.iphone) {
      str += ExtendMeta('al:iphone', item);
    }
    if (meta.appLinks.ipad) for (const item of meta.appLinks.ipad) {
      str += ExtendMeta('al:ipad', item);
    }
    if (meta.appLinks.android) for (const item of meta.appLinks.android) {
      str += ExtendMeta('al:android', item);
    }
    if (meta.appLinks.windows_phone) for (const item of meta.appLinks.windows_phone) {
      str += ExtendMeta('al:windows_phone', item);
    }
    if (meta.appLinks.windows) for (const item of meta.appLinks.windows) {
      str += ExtendMeta('al:windows', item);
    }
    if (meta.appLinks.windows_universal) for (const item of meta.appLinks.windows_universal) {
      str += ExtendMeta('al:windows_universal', item);
    }
    if (meta.appLinks.web) for (const item of meta.appLinks.web) {
      str += ExtendMeta('al:web', item);
    }
  }

  // <IconsMetadata />
  if (meta.icons) {
    if (meta.icons.shortcut) for (const icon of meta.icons.shortcut) {
      str += IconLink('shortcut icon', icon);
    }
    if (meta.icons.icon) for (const icon of meta.icons.icon) {
      str += IconLink('icon', icon);
    }
    if (meta.icons.apple) for (const icon of meta.icons.apple) {
      str += IconLink('apple-touch-icon', icon);
    }
    if (meta.icons.other) for (const icon of meta.icons.other) {
      str += IconLink(icon.rel ?? 'icon', icon);
    }
  }

  return str;
}
