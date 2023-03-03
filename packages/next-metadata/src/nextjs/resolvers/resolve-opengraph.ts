import type { Metadata, ResolvedMetadata } from '../types/metadata-interface'
import type {
  OpenGraphType,
  OpenGraph,
  ResolvedOpenGraph,
} from '../types/opengraph-types'
import type { FieldResolverWithMetadataBase } from '../types/resolvers'
import type { ResolvedTwitterMetadata, Twitter } from '../types/twitter-types'
import { resolveAsArrayOrUndefined } from '../generate/utils'
import { isStringOrURL, resolveUrl } from './resolve-url'

const OgTypeFields = {
  article: ['authors', 'tags'],
  song: ['albums', 'musicians'],
  playlist: ['albums', 'musicians'],
  radio: ['creators'],
  video: ['actors', 'directors', 'writers', 'tags'],
  basic: [
    'emails',
    'phoneNumbers',
    'faxNumbers',
    'alternateLocale',
    'audio',
    'videos',
  ],
} as const

function resolveImages(
  images: Twitter['images'],
  metadataBase: ResolvedMetadata['metadataBase']
): NonNullable<ResolvedMetadata['twitter']>['images']
function resolveImages(
  images: OpenGraph['images'],
  metadataBase: ResolvedMetadata['metadataBase']
): NonNullable<ResolvedMetadata['openGraph']>['images']
function resolveImages(
  images: OpenGraph['images'] | Twitter['images'],
  metadataBase: ResolvedMetadata['metadataBase']
):
  | NonNullable<ResolvedMetadata['twitter']>['images']
  | NonNullable<ResolvedMetadata['openGraph']>['images'] {
  const resolvedImages = resolveAsArrayOrUndefined(images)
  resolvedImages?.forEach((item, index, array) => {
    if (isStringOrURL(item)) {
      array[index] = {
        url: metadataBase ? resolveUrl(item, metadataBase)! : item,
      }
    } else {
      // Update image descriptor url
      item.url = metadataBase ? resolveUrl(item.url, metadataBase)! : item.url
    }
  })
  return resolvedImages
}

function getFieldsByOgType(ogType: OpenGraphType | undefined) {
  switch (ogType) {
    case 'article':
    case 'book':
      return OgTypeFields.article
    case 'music.song':
    case 'music.album':
      return OgTypeFields.song
    case 'music.playlist':
      return OgTypeFields.playlist
    case 'music.radio_station':
      return OgTypeFields.radio
    case 'video.movie':
    case 'video.episode':
      return OgTypeFields.video
    default:
      return OgTypeFields.basic
  }
}

export function resolveOpenGraph(
  openGraph: Metadata['openGraph'],
  metadataBase: ResolvedMetadata['metadataBase']
): ResolvedMetadata['openGraph'] {
  if (!openGraph) return null

  const url = resolveUrl(openGraph.url, metadataBase)
  const resolved = { ...openGraph } as ResolvedOpenGraph

  function assignProps(og: OpenGraph) {
    const ogType = og && 'type' in og ? og.type : undefined
    const keys = getFieldsByOgType(ogType)
    for (const k of keys) {
      const key = k as keyof ResolvedOpenGraph
      if (key in og && key !== 'url') {
        const value = og[key]
        if (value) {
          const arrayValue = resolveAsArrayOrUndefined(value)
          /// TODO: improve typing inferring
          ;(resolved as any)[key] = arrayValue
        }
      }
    }

    resolved.images = resolveImages(og.images, metadataBase)
  }

  assignProps(openGraph)

  resolved.url = url

  return resolved
}

const TwitterBasicInfoKeys = [
  'site',
  'siteId',
  'creator',
  'creatorId',
  'description',
] as const

export const resolveTwitter: FieldResolverWithMetadataBase<'twitter'> = (
  twitter,
  metadataBase
) => {
  if (!twitter) return null
  const resolved = {
    title: twitter.title,
  } as ResolvedTwitterMetadata
  for (const infoKey of TwitterBasicInfoKeys) {
    resolved[infoKey] = twitter[infoKey] || null
  }
  resolved.images = resolveImages(twitter.images, metadataBase)

  if ('card' in twitter) {
    resolved.card = twitter.card
    switch (twitter.card) {
      case 'player': {
        // @ts-ignore
        resolved.players = resolveAsArrayOrUndefined(twitter.players) || []
        break
      }
      case 'app': {
        // @ts-ignore
        resolved.app = twitter.app || {}
        break
      }
      default:
        break
    }
  } else {
    resolved.card = 'summary'
  }

  return resolved
}
