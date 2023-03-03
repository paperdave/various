import type {
  Metadata,
  ResolvedMetadata,
  ResolvingMetadata,
} from './nextjs/types/metadata-interface'
import { createDefaultMetadata } from './nextjs/default-metadata'
import { resolveOpenGraph, resolveTwitter } from './nextjs/resolvers/resolve-opengraph'
import { resolveTitle } from './nextjs/resolvers/resolve-title'
import { resolveAsArrayOrUndefined } from './nextjs/generate/utils'
import {
  resolveAlternates,
  resolveAppleWebApp,
  resolveAppLinks,
  resolveRobots,
  resolveThemeColor,
  resolveVerification,
  resolveViewport,
} from './nextjs/resolvers/resolve-basics'
import { resolveIcons } from './nextjs/resolvers/resolve-icons'

// Merge the source metadata into the resolved target metadata.
function merge(
  target: ResolvedMetadata,
  source: Metadata | null,
  titleTemplates: {
    title?: string | null
    twitter?: string | null
    openGraph?: string | null
  } = {}
) {
  const metadataBase = source?.metadataBase || target.metadataBase
  for (const key_ in source) {
    const key = key_ as keyof Metadata

    switch (key) {
      case 'title': {
        target.title = resolveTitle(source.title, titleTemplates.title)
        break
      }
      case 'alternates': {
        target.alternates = resolveAlternates(source.alternates, metadataBase)
        break
      }
      case 'openGraph': {
        target.openGraph = resolveOpenGraph(source.openGraph, metadataBase)
        if (target.openGraph) {
          target.openGraph.title = resolveTitle(
            target.openGraph.title,
            titleTemplates.openGraph
          )
        }
        break
      }
      case 'twitter': {
        target.twitter = resolveTwitter(source.twitter, metadataBase)
        if (target.twitter) {
          target.twitter.title = resolveTitle(
            target.twitter.title,
            titleTemplates.twitter
          )
        }
        break
      }
      case 'verification':
        target.verification = resolveVerification(source.verification)
        break
      case 'viewport': {
        target.viewport = resolveViewport(source.viewport)
        break
      }
      case 'icons': {
        target.icons = resolveIcons(source.icons)
        break
      }
      case 'appleWebApp':
        target.appleWebApp = resolveAppleWebApp(source.appleWebApp)
        break
      case 'appLinks':
        target.appLinks = resolveAppLinks(source.appLinks)
        break
      case 'robots': {
        target.robots = resolveRobots(source.robots)
        break
      }
      case 'themeColor': {
        target.themeColor = resolveThemeColor(source.themeColor)
        break
      }
      case 'archives':
      case 'assets':
      case 'bookmarks':
      case 'keywords':
      case 'authors': {
        // FIXME: type inferring
        // @ts-ignore
        target[key] = resolveAsArrayOrUndefined(source[key]) || null
        break
      }
      // directly assign fields that fallback to null
      case 'applicationName':
      case 'description':
      case 'generator':
      case 'creator':
      case 'publisher':
      case 'category':
      case 'classification':
      case 'referrer':
      case 'colorScheme':
      case 'itunes':
      case 'formatDetection':
      case 'manifest':
        // @ts-ignore TODO: support inferring
        target[key] = source[key] || null
        break
      case 'other':
        target.other = Object.assign({}, target.other, source.other)
        break
      case 'metadataBase':
        target.metadataBase = metadataBase
        break
      default:
        break
    }
  }

  return target;
}

export function resolveMetadata(...metadata: [Metadata, ...Metadata[]]) {
  const base = createDefaultMetadata();
  for (const item of metadata) {
    merge(base, item, {
      title: base.title?.template,
      twitter: base.twitter?.title?.template,
      openGraph: base.openGraph?.title?.template
    })
  }
  return base;
}
