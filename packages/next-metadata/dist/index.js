// src/nextjs/default-metadata.ts
var createDefaultMetadata = () => {
  return {
    viewport: "width=device-width, initial-scale=1",
    // Other values are all null
    metadataBase: null,
    title: null,
    description: null,
    applicationName: null,
    authors: null,
    generator: null,
    keywords: null,
    referrer: null,
    themeColor: null,
    colorScheme: null,
    creator: null,
    publisher: null,
    robots: null,
    manifest: null,
    alternates: {
      canonical: null,
      languages: null,
      media: null,
      types: null
    },
    icons: null,
    openGraph: null,
    twitter: null,
    verification: {},
    appleWebApp: null,
    formatDetection: null,
    itunes: null,
    abstract: null,
    appLinks: null,
    archives: null,
    assets: null,
    bookmarks: null,
    category: null,
    classification: null,
    other: {}
  };
};

// src/nextjs/generate/utils.ts
function resolveAsArrayOrUndefined(value) {
  if (typeof value === "undefined" || value === null) {
    return void 0;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

// src/nextjs/resolvers/resolve-url.ts
import path from "path";
function isStringOrURL(icon) {
  return typeof icon === "string" || icon instanceof URL;
}
function resolveUrl(url, metadataBase) {
  if (!url)
    return null;
  if (url instanceof URL)
    return url;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl;
  } catch (_) {
  }
  if (!metadataBase)
    throw new Error(
      `metadata.metadataBase needs to be provided for resolving absolute URLs: ${url}`
    );
  const basePath = metadataBase.pathname || "/";
  const joinedPath = path.join(basePath, url);
  return new URL(joinedPath, metadataBase);
}
function resolveUrlValuesOfObject(obj, metadataBase) {
  if (!obj)
    return null;
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = metadataBase ? resolveUrl(value, metadataBase) : value;
  }
  return result;
}

// src/nextjs/resolvers/resolve-opengraph.ts
var OgTypeFields = {
  article: ["authors", "tags"],
  song: ["albums", "musicians"],
  playlist: ["albums", "musicians"],
  radio: ["creators"],
  video: ["actors", "directors", "writers", "tags"],
  basic: [
    "emails",
    "phoneNumbers",
    "faxNumbers",
    "alternateLocale",
    "audio",
    "videos"
  ]
};
function resolveImages(images, metadataBase) {
  const resolvedImages = resolveAsArrayOrUndefined(images);
  resolvedImages?.forEach((item, index, array) => {
    if (isStringOrURL(item)) {
      array[index] = {
        url: metadataBase ? resolveUrl(item, metadataBase) : item
      };
    } else {
      item.url = metadataBase ? resolveUrl(item.url, metadataBase) : item.url;
    }
  });
  return resolvedImages;
}
function getFieldsByOgType(ogType) {
  switch (ogType) {
    case "article":
    case "book":
      return OgTypeFields.article;
    case "music.song":
    case "music.album":
      return OgTypeFields.song;
    case "music.playlist":
      return OgTypeFields.playlist;
    case "music.radio_station":
      return OgTypeFields.radio;
    case "video.movie":
    case "video.episode":
      return OgTypeFields.video;
    default:
      return OgTypeFields.basic;
  }
}
function resolveOpenGraph(openGraph, metadataBase) {
  if (!openGraph)
    return null;
  const url = resolveUrl(openGraph.url, metadataBase);
  const resolved = { ...openGraph };
  function assignProps(og) {
    const ogType = og && "type" in og ? og.type : void 0;
    const keys = getFieldsByOgType(ogType);
    for (const k of keys) {
      const key = k;
      if (key in og && key !== "url") {
        const value = og[key];
        if (value) {
          const arrayValue = resolveAsArrayOrUndefined(value);
          resolved[key] = arrayValue;
        }
      }
    }
    resolved.images = resolveImages(og.images, metadataBase);
  }
  assignProps(openGraph);
  resolved.url = url;
  return resolved;
}
var TwitterBasicInfoKeys = [
  "site",
  "siteId",
  "creator",
  "creatorId",
  "description"
];
var resolveTwitter = (twitter, metadataBase) => {
  if (!twitter)
    return null;
  const resolved = {
    title: twitter.title
  };
  for (const infoKey of TwitterBasicInfoKeys) {
    resolved[infoKey] = twitter[infoKey] || null;
  }
  resolved.images = resolveImages(twitter.images, metadataBase);
  if ("card" in twitter) {
    resolved.card = twitter.card;
    switch (twitter.card) {
      case "player": {
        resolved.players = resolveAsArrayOrUndefined(twitter.players) || [];
        break;
      }
      case "app": {
        resolved.app = twitter.app || {};
        break;
      }
      default:
        break;
    }
  } else {
    resolved.card = "summary";
  }
  return resolved;
};

// src/nextjs/resolvers/resolve-title.ts
function resolveTitleTemplate(template, title) {
  return template ? template.replace(/%s/g, title) : title;
}
function resolveTitle(title, stashedTemplate) {
  let resolved;
  const template = typeof title !== "string" && title && "template" in title ? title.template : null;
  if (typeof title === "string") {
    resolved = resolveTitleTemplate(stashedTemplate, title);
  } else if (title) {
    if ("default" in title) {
      resolved = resolveTitleTemplate(stashedTemplate, title.default);
    }
    if ("absolute" in title && title.absolute) {
      resolved = title.absolute;
    }
  }
  if (title && typeof title !== "string") {
    return {
      template,
      absolute: resolved || ""
    };
  } else {
    return { absolute: resolved || title || "", template };
  }
}

// src/nextjs/constants.ts
var ViewPortKeys = {
  width: "width",
  height: "height",
  initialScale: "initial-scale",
  minimumScale: "minimum-scale",
  maximumScale: "maximum-scale",
  viewportFit: "viewport-fit",
  interactiveWidget: "interactive-widget"
};
var IconKeys = ["icon", "shortcut", "apple", "other"];

// src/nextjs/resolvers/resolve-basics.ts
var resolveThemeColor = (themeColor) => {
  if (!themeColor)
    return null;
  const themeColorDescriptors = [];
  resolveAsArrayOrUndefined(themeColor)?.forEach((descriptor) => {
    if (typeof descriptor === "string")
      themeColorDescriptors.push({ color: descriptor });
    else if (typeof descriptor === "object")
      themeColorDescriptors.push({
        color: descriptor.color,
        media: descriptor.media
      });
  });
  return themeColorDescriptors;
};
var resolveViewport = (viewport) => {
  let resolved = null;
  if (typeof viewport === "string") {
    resolved = viewport;
  } else if (viewport) {
    resolved = "";
    for (const viewportKey_ in ViewPortKeys) {
      const viewportKey = viewportKey_;
      if (viewport[viewportKey]) {
        if (resolved)
          resolved += ", ";
        resolved += `${ViewPortKeys[viewportKey]}=${viewport[viewportKey]}`;
      }
    }
  }
  return resolved;
};
var resolveAlternates = (alternates, metadataBase) => {
  if (!alternates)
    return null;
  const result = {
    canonical: metadataBase ? resolveUrl(alternates.canonical, metadataBase) : alternates.canonical || null,
    languages: null,
    media: null,
    types: null
  };
  const { languages, media, types } = alternates;
  result.languages = resolveUrlValuesOfObject(languages, metadataBase);
  result.media = resolveUrlValuesOfObject(media, metadataBase);
  result.types = resolveUrlValuesOfObject(types, metadataBase);
  return result;
};
var robotsKeys = [
  "noarchive",
  "nosnippet",
  "noimageindex",
  "nocache",
  "notranslate",
  "indexifembedded",
  "nositelinkssearchbox",
  "unavailable_after",
  "max-video-preview",
  "max-image-preview",
  "max-snippet"
];
var resolveRobotsValue = (robots) => {
  if (!robots)
    return null;
  if (typeof robots === "string")
    return robots;
  const values = [];
  if (robots.index)
    values.push("index");
  else if (typeof robots.index === "boolean")
    values.push("noindex");
  if (robots.follow)
    values.push("follow");
  else if (typeof robots.follow === "boolean")
    values.push("nofollow");
  for (const key of robotsKeys) {
    const value = robots[key];
    if (typeof value !== "undefined" && value !== false) {
      values.push(typeof value === "boolean" ? key : `${key}:${value}`);
    }
  }
  return values.join(", ");
};
var resolveRobots = (robots) => {
  if (!robots)
    return null;
  return {
    basic: resolveRobotsValue(robots),
    googleBot: typeof robots !== "string" ? resolveRobotsValue(robots.googleBot) : null
  };
};
var VerificationKeys = ["google", "yahoo", "yandex", "me", "other"];
var resolveVerification = (verification) => {
  if (!verification)
    return null;
  const res = {};
  for (const key of VerificationKeys) {
    const value = verification[key];
    if (value) {
      if (key === "other") {
        res.other = {};
        for (const otherKey in verification.other) {
          const otherValue = resolveAsArrayOrUndefined(
            verification.other[otherKey]
          );
          if (otherValue)
            res.other[otherKey] = otherValue;
        }
      } else
        res[key] = resolveAsArrayOrUndefined(value);
    }
  }
  return res;
};
var resolveAppleWebApp = (appWebApp) => {
  if (!appWebApp)
    return null;
  if (appWebApp === true) {
    return {
      capable: true
    };
  }
  const startupImages = appWebApp.startupImage ? resolveAsArrayOrUndefined(appWebApp.startupImage)?.map(
    (item) => typeof item === "string" ? { url: item } : item
  ) : null;
  return {
    capable: "capable" in appWebApp ? !!appWebApp.capable : true,
    title: appWebApp.title || null,
    startupImage: startupImages,
    statusBarStyle: appWebApp.statusBarStyle || "default"
  };
};
var resolveAppLinks = (appLinks) => {
  if (!appLinks)
    return null;
  for (const key in appLinks) {
    appLinks[key] = resolveAsArrayOrUndefined(appLinks[key]);
  }
  return appLinks;
};

// src/nextjs/resolvers/resolve-icons.ts
function resolveIcon(icon) {
  if (isStringOrURL(icon))
    return { url: icon };
  else if (Array.isArray(icon))
    return icon;
  return icon;
}
var resolveIcons = (icons) => {
  if (!icons) {
    return null;
  }
  const resolved = {
    icon: [],
    apple: []
  };
  if (Array.isArray(icons)) {
    resolved.icon = icons.map(resolveIcon).filter(Boolean);
  } else if (isStringOrURL(icons)) {
    resolved.icon = [resolveIcon(icons)];
  } else {
    for (const key of IconKeys) {
      const values = resolveAsArrayOrUndefined(icons[key]);
      if (values)
        resolved[key] = values.map(resolveIcon);
    }
  }
  return resolved;
};

// src/merge.ts
function merge(target, source, titleTemplates = {}) {
  const metadataBase = source?.metadataBase || target.metadataBase;
  for (const key_ in source) {
    const key = key_;
    switch (key) {
      case "title": {
        target.title = resolveTitle(source.title, titleTemplates.title);
        break;
      }
      case "alternates": {
        target.alternates = resolveAlternates(source.alternates, metadataBase);
        break;
      }
      case "openGraph": {
        target.openGraph = resolveOpenGraph(source.openGraph, metadataBase);
        if (target.openGraph) {
          target.openGraph.title = resolveTitle(
            target.openGraph.title,
            titleTemplates.openGraph
          );
        }
        break;
      }
      case "twitter": {
        target.twitter = resolveTwitter(source.twitter, metadataBase);
        if (target.twitter) {
          target.twitter.title = resolveTitle(
            target.twitter.title,
            titleTemplates.twitter
          );
        }
        break;
      }
      case "verification":
        target.verification = resolveVerification(source.verification);
        break;
      case "viewport": {
        target.viewport = resolveViewport(source.viewport);
        break;
      }
      case "icons": {
        target.icons = resolveIcons(source.icons);
        break;
      }
      case "appleWebApp":
        target.appleWebApp = resolveAppleWebApp(source.appleWebApp);
        break;
      case "appLinks":
        target.appLinks = resolveAppLinks(source.appLinks);
        break;
      case "robots": {
        target.robots = resolveRobots(source.robots);
        break;
      }
      case "themeColor": {
        target.themeColor = resolveThemeColor(source.themeColor);
        break;
      }
      case "archives":
      case "assets":
      case "bookmarks":
      case "keywords":
      case "authors": {
        target[key] = resolveAsArrayOrUndefined(source[key]) || null;
        break;
      }
      case "applicationName":
      case "description":
      case "generator":
      case "creator":
      case "publisher":
      case "category":
      case "classification":
      case "referrer":
      case "colorScheme":
      case "itunes":
      case "formatDetection":
      case "manifest":
        target[key] = source[key] || null;
        break;
      case "other":
        target.other = Object.assign({}, target.other, source.other);
        break;
      case "metadataBase":
        target.metadataBase = metadataBase;
        break;
      default:
        break;
    }
  }
  return target;
}
function resolveMetadata(...metadata) {
  const base = createDefaultMetadata();
  for (const item of metadata) {
    merge(base, item, {
      title: base.title?.template,
      twitter: base.twitter?.title?.template,
      openGraph: base.openGraph?.title?.template
    });
  }
  return base;
}

// src/render.ts
function esc(str) {
  return String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Meta(name, content) {
  return `<meta name="${esc(name)}" content="${esc(content)}">`;
}
function MetaProp(name, content) {
  return `<meta property="${esc(name)}" content="${esc(content)}">`;
}
function MetaMedia(name, content, media) {
  return `<meta name="${esc(name)}" content="${esc(content)}" media="${esc(media)}">`;
}
function Link(rel, href) {
  return `<link rel="${esc(rel)}" href="${esc(href)}" />`;
}
function LinkMedia(rel, href, media) {
  return `<link rel="${esc(rel)}" href="${esc(href)}" media="${esc(media)}">`;
}
var resolveUrl2 = (url) => typeof url === "string" ? url : url.toString();
function IconLink(rel, icon) {
  if (typeof icon === "object" && !(icon instanceof URL)) {
    const { url, rel: rel2, ...props } = icon;
    return `<link rel="${esc(rel2)}" href="${esc(resolveUrl2(url))}" ${Object.keys(props).map((key) => `${key}="${esc(props[key])}"`).join(" ")} />`;
  } else {
    const href = resolveUrl2(icon);
    return Link(rel, href);
  }
}
function ExtendMeta(prefix, content) {
  if (typeof content === "string" || typeof content === "number" || content instanceof URL) {
    return MetaProp(prefix, content);
  } else {
    let str = "";
    for (const [prop, value] of content) {
      if (value) {
        str += MetaProp(
          prefix === "og:image" && prop === "url" ? "og:image" : prefix + ":" + prop,
          value
        );
      }
    }
    return str;
  }
}
var formatDetectionKeys = [
  "telephone",
  "date",
  "address",
  "email",
  "url"
];
function renderMetadata(meta) {
  let str = "";
  if (meta.title?.absolute)
    str += `<title>${esc(meta.title.absolute)}</title>`;
  if (meta.description)
    str += Meta("description", meta.description);
  if (meta.applicationName)
    str += Meta("application-name", meta.applicationName);
  if (meta.authors)
    for (const author of meta.authors) {
      if (author.url)
        str += Link("author", author.url);
      if (author.name)
        str += Meta("author", author.name);
    }
  if (meta.manifest)
    str += Link("manifest", meta.manifest);
  if (meta.generator)
    str += Meta("generator", meta.generator);
  if (meta.referrer)
    str += Meta("referrer", meta.referrer);
  if (meta.themeColor)
    for (const themeColor of meta.themeColor) {
      str += !themeColor.media ? Meta("theme-color", themeColor.color) : MetaMedia("theme-color", themeColor.color, themeColor.media);
    }
  if (meta.colorScheme)
    str += Meta("color-scheme", meta.colorScheme);
  if (meta.viewport)
    str += Meta("viewport", meta.viewport);
  if (meta.creator)
    str += Meta("creator", meta.creator);
  if (meta.publisher)
    str += Meta("publisher", meta.publisher);
  if (meta.robots?.basic)
    str += Meta("robots", meta.robots.basic);
  if (meta.robots?.googleBot)
    str += Meta("googlebot", meta.robots.googleBot);
  if (meta.abstract)
    str += Meta("abstract", meta.abstract);
  if (meta.archives)
    for (const archive of meta.archives) {
      str += Link("archives", archive);
    }
  if (meta.assets)
    for (const asset of meta.assets) {
      str += Link("assets", asset);
    }
  if (meta.bookmarks)
    for (const bookmark of meta.bookmarks) {
      str += Link("bookmarks", bookmark);
    }
  if (meta.category)
    str += Meta("category", meta.category);
  if (meta.classification)
    str += Meta("classification", meta.classification);
  if (meta.other)
    for (const [name, content] of Object.entries(meta.other)) {
      if (content) {
        str += Meta(name, Array.isArray(content) ? content.join(",") : content);
      }
    }
  const alternates = meta.alternates;
  if (alternates) {
    if (alternates.canonical)
      str += Link("canonical", alternates.canonical);
    if (alternates.languages)
      for (const [locale, url] of Object.entries(alternates.languages)) {
        str += `<link rel="alternate" hreflang="${esc(locale)}" href="${esc(url)}">`;
      }
    if (alternates.media)
      for (const [media, url] of Object.entries(alternates.media)) {
        str += `<link rel="alternate" media="${esc(media)}" href="${esc(url)}">`;
      }
    if (alternates.types)
      for (const [type, url] of Object.entries(alternates.types)) {
        str += `<link rel="alternate" type="${esc(type)}" href="${esc(url)}">`;
      }
  }
  if (meta.itunes) {
    str += Meta(
      "apple-itunes-app",
      `app-id=${meta.itunes.appId}${meta.itunes.appArgument ? `, app-argument=${meta.itunes.appArgument}` : ""}`
    );
  }
  if (meta.formatDetection) {
    let content = "";
    for (const key of formatDetectionKeys) {
      if (key in meta.formatDetection) {
        if (content)
          content += ", ";
        content += `${key}=no`;
      }
    }
    str += Meta("format-detection", content);
  }
  if (meta.verification) {
    if (meta.verification.google)
      for (const key of meta.verification.google) {
        str += Meta("google-site-verification", key);
      }
    if (meta.verification.yahoo)
      for (const key of meta.verification.yahoo) {
        str += Meta("y_key", key);
      }
    if (meta.verification.yandex)
      for (const key of meta.verification.yandex) {
        str += Meta("yandex-verification", key);
      }
    if (meta.verification.me)
      for (const key of meta.verification.me) {
        str += Meta("me", key);
      }
    if (meta.verification.other) {
      for (const [key, values] of Object.entries(meta.verification.other)) {
        for (const value of values) {
          str += Meta(key, value);
        }
      }
    }
  }
  if (meta.appleWebApp) {
    const { capable, title, startupImage, statusBarStyle } = meta.appleWebApp;
    if (capable)
      str += '<meta name="apple-mobile-web-app-capable" content="yes" />';
    if (title)
      str += Meta("apple-mobile-web-app-title", title);
    if (startupImage)
      for (const img of startupImage) {
        str += !img.media ? Link("apple-touch-startup-image", img.url) : LinkMedia("apple-touch-startup-image", img.url, img.media);
      }
    if (statusBarStyle)
      str += Meta("apple-mobile-web-app-status-bar-style", statusBarStyle);
  }
  if (meta.openGraph) {
    const og = meta.openGraph;
    if (og.determiner)
      str += MetaProp("og:determiner", og.determiner);
    if (og.title?.absolute)
      str += MetaProp("og:title", og.title.absolute);
    if (og.description)
      str += MetaProp("og:description", og.description);
    if (og.url)
      str += MetaProp("og:url", og.url);
    if (og.siteName)
      str += MetaProp("og:site_name", og.siteName);
    if (og.locale)
      str += MetaProp("og:locale", og.locale);
    if (og.countryName)
      str += MetaProp("og:country_name", og.countryName);
    if (og.ttl)
      str += MetaProp("og:ttl", og.ttl);
    if (og.images)
      for (const item of og.images) {
        str += ExtendMeta("og:image", item);
      }
    if (og.videos)
      for (const item of og.videos) {
        str += ExtendMeta("og:video", item);
      }
    if (og.audio)
      for (const item of og.audio) {
        str += ExtendMeta("og:audio", item);
      }
    if (og.emails)
      for (const item of og.emails) {
        str += ExtendMeta("og:email", item);
      }
    if (og.phoneNumbers)
      for (const item of og.phoneNumbers) {
        str += MetaProp("og:phone_number", item);
      }
    if (og.faxNumbers)
      for (const item of og.faxNumbers) {
        str += MetaProp("og:fax_number", item);
      }
    if (og.alternateLocale)
      for (const item of og.alternateLocale) {
        str += MetaProp("og:locale:alternate", item);
      }
    if ("type" in og) {
      str += MetaProp("og:type", og.type);
      switch (og.type) {
        case "website":
          break;
        case "article":
          if (og.publishedTime)
            str += MetaProp("article:published_time", og.publishedTime);
          if (og.modifiedTime)
            str += MetaProp("article:modified_time", og.modifiedTime);
          if (og.expirationTime)
            str += MetaProp("article:expiration_time", og.expirationTime);
          if (og.authors)
            for (const item of og.authors) {
              str += MetaProp("article:author", item);
            }
          if (og.section)
            str += MetaProp("article:section", og.section);
          if (og.tags)
            for (const item of og.tags) {
              str += MetaProp("article:tag", item);
            }
          break;
        case "book":
          if (og.isbn)
            str += MetaProp("book:isbn", og.isbn);
          if (og.releaseDate)
            str += MetaProp("book:release_date", og.releaseDate);
          if (og.authors)
            for (const item of og.authors) {
              str += MetaProp("article:author", item);
            }
          if (og.tags)
            for (const item of og.tags) {
              str += MetaProp("article:tag", item);
            }
          break;
        case "profile":
          if (og.firstName)
            str += MetaProp("profile:first_name", og.firstName);
          if (og.lastName)
            str += MetaProp("profile:last_name", og.lastName);
          if (og.username)
            str += MetaProp("profile:first_name", og.username);
          if (og.gender)
            str += MetaProp("profile:first_name", og.gender);
          break;
        case "music.song":
          if (og.duration)
            str += MetaProp("music:duration", og.duration);
          if (og.albums)
            for (const item of og.albums) {
              str += ExtendMeta("music:albums", item);
            }
          if (og.musicians)
            for (const item of og.musicians) {
              str += MetaProp("music:musician", item);
            }
          break;
        case "music.album":
          if (og.songs)
            for (const item of og.songs) {
              str += ExtendMeta("music:song", item);
            }
          if (og.musicians)
            for (const item of og.musicians) {
              str += MetaProp("music:musician", item);
            }
          if (og.releaseDate)
            str += MetaProp("music:release_date", og.releaseDate);
          break;
        case "music.playlist":
          if (og.songs)
            for (const item of og.songs) {
              str += ExtendMeta("music:song", item);
            }
          if (og.creators)
            for (const item of og.creators) {
              str += MetaProp("music:creator", item);
            }
          break;
        case "music.radio_station":
          if (og.creators)
            for (const item of og.creators) {
              str += MetaProp("music:creator", item);
            }
          break;
        case "video.movie":
          if (og.actors)
            for (const item of og.actors) {
              str += ExtendMeta("video:actor", item);
            }
          if (og.directors)
            for (const item of og.directors) {
              str += MetaProp("video:director", item);
            }
          if (og.writers)
            for (const item of og.writers) {
              str += MetaProp("video:writer", item);
            }
          if (og.duration)
            str += MetaProp("video:duration", og.duration);
          if (og.releaseDate)
            str += MetaProp("video:release_date", og.releaseDate);
          if (og.tags)
            for (const item of og.tags) {
              str += MetaProp("video:tag", item);
            }
          break;
        case "video.episode":
          if (og.actors)
            for (const item of og.actors) {
              str += ExtendMeta("video:actor", item);
            }
          if (og.directors)
            for (const item of og.directors) {
              str += MetaProp("video:director", item);
            }
          if (og.writers)
            for (const item of og.writers) {
              str += MetaProp("video:writer", item);
            }
          if (og.duration)
            str += MetaProp("video:duration", og.duration);
          if (og.releaseDate)
            str += MetaProp("video:release_date", og.releaseDate);
          if (og.tags)
            for (const item of og.tags) {
              str += MetaProp("video:tag", item);
            }
          if (og.series)
            str += MetaProp("video:series", og.series);
          break;
        case "video.other":
        case "video.tv_show":
        default:
          throw new Error("Invalid OpenGraph type: " + og.type);
      }
    }
  }
  if (meta.twitter) {
    const twitter = meta.twitter;
    if (twitter.card)
      str += Meta("twitter:card", twitter.card);
    if (twitter.site)
      str += Meta("twitter:site", twitter.site);
    if (twitter.siteId)
      str += Meta("twitter:site:id", twitter.siteId);
    if (twitter.creator)
      str += Meta("twitter:creator", twitter.creator);
    if (twitter.creatorId)
      str += Meta("twitter:creator:id", twitter.creatorId);
    if (twitter.title?.absolute)
      str += Meta("twitter:title", twitter.title.absolute);
    if (twitter.description)
      str += Meta("twitter:description", twitter.description);
    if (twitter.images)
      for (const img of twitter.images) {
        str += Meta("twitter:image", img.url);
        if (img.alt)
          str += Meta("twitter:image:alt", img.alt);
      }
    if (twitter.card === "player")
      for (const player of twitter.players) {
        if (player.playerUrl)
          str += Meta("twitter:player", player.playerUrl);
        if (player.streamUrl)
          str += Meta("twitter:player:stream", player.streamUrl);
        if (player.width)
          str += Meta("twitter:player:width", player.width);
        if (player.height)
          str += Meta("twitter:player:height", player.height);
      }
    if (twitter.card === "app") {
      for (const type of ["iphone", "ipad", "googleplay"]) {
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
  if (meta.appLinks) {
    if (meta.appLinks.ios)
      for (const item of meta.appLinks.ios) {
        str += ExtendMeta("al:ios", item);
      }
    if (meta.appLinks.iphone)
      for (const item of meta.appLinks.iphone) {
        str += ExtendMeta("al:iphone", item);
      }
    if (meta.appLinks.ipad)
      for (const item of meta.appLinks.ipad) {
        str += ExtendMeta("al:ipad", item);
      }
    if (meta.appLinks.android)
      for (const item of meta.appLinks.android) {
        str += ExtendMeta("al:android", item);
      }
    if (meta.appLinks.windows_phone)
      for (const item of meta.appLinks.windows_phone) {
        str += ExtendMeta("al:windows_phone", item);
      }
    if (meta.appLinks.windows)
      for (const item of meta.appLinks.windows) {
        str += ExtendMeta("al:windows", item);
      }
    if (meta.appLinks.windows_universal)
      for (const item of meta.appLinks.windows_universal) {
        str += ExtendMeta("al:windows_universal", item);
      }
    if (meta.appLinks.web)
      for (const item of meta.appLinks.web) {
        str += ExtendMeta("al:web", item);
      }
  }
  if (meta.icons) {
    if (meta.icons.shortcut)
      for (const icon of meta.icons.shortcut) {
        str += IconLink("shortcut icon", icon);
      }
    if (meta.icons.icon)
      for (const icon of meta.icons.icon) {
        str += IconLink("icon", icon);
      }
    if (meta.icons.apple)
      for (const icon of meta.icons.apple) {
        str += IconLink("apple-touch-icon", icon);
      }
    if (meta.icons.other)
      for (const icon of meta.icons.other) {
        str += IconLink(icon.rel ?? "icon", icon);
      }
  }
  return str;
}

// src/index.ts
function resolveAndRenderMetadata(...metadata) {
  return renderMetadata(resolveMetadata(...metadata));
}
export {
  renderMetadata,
  resolveAndRenderMetadata,
  resolveMetadata
};
