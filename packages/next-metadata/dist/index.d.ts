export type LangCode = "aa" | "ab" | "ae" | "af" | "ak" | "am" | "an" | "ar" | "as" | "av" | "ay" | "az" | "ba" | "be" | "bg" | "bh" | "bi" | "bm" | "bn" | "bo" | "br" | "bs" | "ca" | "ce" | "ch" | "co" | "cr" | "cs" | "cu" | "cv" | "cy" | "da" | "de" | "dv" | "dz" | "ee" | "el" | "en" | "eo" | "es" | "et" | "eu" | "fa" | "ff" | "fi" | "fj" | "fo" | "fr" | "fy" | "ga" | "gd" | "gl" | "gn" | "gu" | "gv" | "ha" | "he" | "hi" | "ho" | "hr" | "ht" | "hu" | "hy" | "hz" | "ia" | "id" | "ie" | "ig" | "ii" | "ik" | "io" | "is" | "it" | "iu" | "ja" | "jv" | "ka" | "kg" | "ki" | "kj" | "kk" | "kl" | "km" | "kn" | "ko" | "kr" | "ks" | "ku" | "kv" | "kw" | "ky" | "la" | "lb" | "lg" | "li" | "ln" | "lo" | "lt" | "lu" | "lv" | "mg" | "mh" | "mi" | "mk" | "ml" | "mn" | "mr" | "ms" | "mt" | "my" | "na" | "nb" | "nd" | "ne" | "ng" | "nl" | "nn" | "no" | "nr" | "nv" | "ny" | "oc" | "oj" | "om" | "or" | "os" | "pa" | "pi" | "pl" | "ps" | "pt" | "qu" | "rm" | "rn" | "ro" | "ru" | "rw" | "sa" | "sc" | "sd" | "se" | "sg" | "si" | "sk" | "sl" | "sm" | "sn" | "so" | "sq" | "sr" | "ss" | "st" | "su" | "sv" | "sw" | "ta" | "te" | "tg" | "th" | "ti" | "tk" | "tl" | "tn" | "to" | "tr" | "ts" | "tt" | "tw" | "ty" | "ug" | "uk" | "ur" | "uz" | "ve" | "vi" | "vo" | "wa" | "wo" | "xh" | "yi" | "yo" | "za" | "zh" | "zu" | "af-ZA" | "am-ET" | "ar-AE" | "ar-BH" | "ar-DZ" | "ar-EG" | "ar-IQ" | "ar-JO" | "ar-KW" | "ar-LB" | "ar-LY" | "ar-MA" | "arn-CL" | "ar-OM" | "ar-QA" | "ar-SA" | "ar-SD" | "ar-SY" | "ar-TN" | "ar-YE" | "as-IN" | "az-az" | "az-Cyrl-AZ" | "az-Latn-AZ" | "ba-RU" | "be-BY" | "bg-BG" | "bn-BD" | "bn-IN" | "bo-CN" | "br-FR" | "bs-Cyrl-BA" | "bs-Latn-BA" | "ca-ES" | "co-FR" | "cs-CZ" | "cy-GB" | "da-DK" | "de-AT" | "de-CH" | "de-DE" | "de-LI" | "de-LU" | "dsb-DE" | "dv-MV" | "el-CY" | "el-GR" | "en-029" | "en-AU" | "en-BZ" | "en-CA" | "en-cb" | "en-GB" | "en-IE" | "en-IN" | "en-JM" | "en-MT" | "en-MY" | "en-NZ" | "en-PH" | "en-SG" | "en-TT" | "en-US" | "en-ZA" | "en-ZW" | "es-AR" | "es-BO" | "es-CL" | "es-CO" | "es-CR" | "es-DO" | "es-EC" | "es-ES" | "es-GT" | "es-HN" | "es-MX" | "es-NI" | "es-PA" | "es-PE" | "es-PR" | "es-PY" | "es-SV" | "es-US" | "es-UY" | "es-VE" | "et-EE" | "eu-ES" | "fa-IR" | "fi-FI" | "fil-PH" | "fo-FO" | "fr-BE" | "fr-CA" | "fr-CH" | "fr-FR" | "fr-LU" | "fr-MC" | "fy-NL" | "ga-IE" | "gd-GB" | "gd-ie" | "gl-ES" | "gsw-FR" | "gu-IN" | "ha-Latn-NG" | "he-IL" | "hi-IN" | "hr-BA" | "hr-HR" | "hsb-DE" | "hu-HU" | "hy-AM" | "id-ID" | "ig-NG" | "ii-CN" | "in-ID" | "is-IS" | "it-CH" | "it-IT" | "iu-Cans-CA" | "iu-Latn-CA" | "iw-IL" | "ja-JP" | "ka-GE" | "kk-KZ" | "kl-GL" | "km-KH" | "kn-IN" | "kok-IN" | "ko-KR" | "ky-KG" | "lb-LU" | "lo-LA" | "lt-LT" | "lv-LV" | "mi-NZ" | "mk-MK" | "ml-IN" | "mn-MN" | "mn-Mong-CN" | "moh-CA" | "mr-IN" | "ms-BN" | "ms-MY" | "mt-MT" | "nb-NO" | "ne-NP" | "nl-BE" | "nl-NL" | "nn-NO" | "no-no" | "nso-ZA" | "oc-FR" | "or-IN" | "pa-IN" | "pl-PL" | "prs-AF" | "ps-AF" | "pt-BR" | "pt-PT" | "qut-GT" | "quz-BO" | "quz-EC" | "quz-PE" | "rm-CH" | "ro-mo" | "ro-RO" | "ru-mo" | "ru-RU" | "rw-RW" | "sah-RU" | "sa-IN" | "se-FI" | "se-NO" | "se-SE" | "si-LK" | "sk-SK" | "sl-SI" | "sma-NO" | "sma-SE" | "smj-NO" | "smj-SE" | "smn-FI" | "sms-FI" | "sq-AL" | "sr-BA" | "sr-CS" | "sr-Cyrl-BA" | "sr-Cyrl-CS" | "sr-Cyrl-ME" | "sr-Cyrl-RS" | "sr-Latn-BA" | "sr-Latn-CS" | "sr-Latn-ME" | "sr-Latn-RS" | "sr-ME" | "sr-RS" | "sr-sp" | "sv-FI" | "sv-SE" | "sw-KE" | "syr-SY" | "ta-IN" | "te-IN" | "tg-Cyrl-TJ" | "th-TH" | "tk-TM" | "tlh-QS" | "tn-ZA" | "tr-TR" | "tt-RU" | "tzm-Latn-DZ" | "ug-CN" | "uk-UA" | "ur-PK" | "uz-Cyrl-UZ" | "uz-Latn-UZ" | "uz-uz" | "vi-VN" | "wo-SN" | "xh-ZA" | "yo-NG" | "zh-CN" | "zh-HK" | "zh-MO" | "zh-SG" | "zh-TW" | "zu-ZA";
export type UnmatchedLang = "x-default";
export type HrefLang = LangCode | UnmatchedLang;
export type Languages<T> = {
	[s in HrefLang]?: T;
};
export type AlternateURLs = {
	canonical?: null | string | URL;
	languages?: Languages<null | string | URL>;
	media?: {
		[media: string]: null | string | URL;
	};
	types?: {
		[types: string]: null | string | URL;
	};
};
export type ResolvedAlternateURLs = {
	canonical: null | string | URL;
	languages: null | Languages<null | string | URL>;
	media: null | {
		[media: string]: null | string | URL;
	};
	types: null | {
		[types: string]: null | string | URL;
	};
};
export type AppLinks = {
	ios?: AppLinksApple | Array<AppLinksApple>;
	iphone?: AppLinksApple | Array<AppLinksApple>;
	ipad?: AppLinksApple | Array<AppLinksApple>;
	android?: AppLinksAndroid | Array<AppLinksAndroid>;
	windows_phone?: AppLinksWindows | Array<AppLinksWindows>;
	windows?: AppLinksWindows | Array<AppLinksWindows>;
	windows_universal?: AppLinksWindows | Array<AppLinksWindows>;
	web?: AppLinksWeb | Array<AppLinksWeb>;
};
export type ResolvedAppLinks = {
	ios?: Array<AppLinksApple>;
	iphone?: Array<AppLinksApple>;
	ipad?: Array<AppLinksApple>;
	android?: Array<AppLinksAndroid>;
	windows_phone?: Array<AppLinksWindows>;
	windows?: Array<AppLinksWindows>;
	windows_universal?: Array<AppLinksWindows>;
	web?: Array<AppLinksWeb>;
};
export type AppLinksApple = {
	url: string | URL;
	app_store_id?: string | number;
	app_name?: string;
};
export type AppLinksAndroid = {
	package: string;
	url?: string | URL;
	class?: string;
	app_name?: string;
};
export type AppLinksWindows = {
	url: string | URL;
	app_id?: string;
	app_name?: string;
};
export type AppLinksWeb = {
	url: string | URL;
	should_fallback?: boolean;
};
export type ItunesApp = {
	appId: string;
	appArgument?: string;
};
export type Viewport = {
	width?: string | number;
	height?: string | number;
	initialScale?: number;
	minimumScale?: number;
	maximumScale?: number;
	viewportFit?: "auto" | "cover" | "contain";
	interactiveWidget?: "resizes-visual" | "resizes-content" | "overlays-content";
};
export type AppleWebApp = {
	capable?: boolean;
	title?: string;
	startupImage?: AppleImage | Array<AppleImage>;
	statusBarStyle?: "default" | "black" | "black-translucent";
};
export type AppleImage = string | AppleImageDescriptor;
export type AppleImageDescriptor = {
	url: string;
	media?: string;
};
export type ResolvedAppleWebApp = {
	capable: boolean;
	title?: string | null;
	startupImage?: AppleImageDescriptor[] | null;
	statusBarStyle?: "default" | "black" | "black-translucent";
};
export type FormatDetection = {
	telephone?: boolean;
	date?: boolean;
	address?: boolean;
	email?: boolean;
	url?: boolean;
};
/**
 *
 * Metadata types
 *
 */
export interface DeprecatedMetadataFields {
	/**
	 * Deprecated options that have a preferred method
	 * @deprecated Use appWebApp to configure apple-mobile-web-app-capable which provides
	 * @see https://www.appsloveworld.com/coding/iphone/11/difference-between-apple-mobile-web-app-capable-and-apple-touch-fullscreen-ipho
	 */
	"apple-touch-fullscreen"?: never;
	/**
	 * Obsolete since iOS 7.
	 * @see https://web.dev/apple-touch-icon/
	 * @deprecated use icons.apple or instead
	 */
	"apple-touch-icon-precomposed"?: never;
}
export type TemplateString = DefaultTemplateString | AbsoluteTemplateString | AbsoluteString;
export type DefaultTemplateString = {
	default: string;
	template: string;
};
export type AbsoluteTemplateString = {
	absolute: string;
	template: string | null;
};
export type AbsoluteString = {
	absolute: string;
};
export type Author = {
	url?: string | URL;
	name?: string;
};
export type ReferrerEnum = "no-referrer" | "origin" | "no-referrer-when-downgrade" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin";
export type ColorSchemeEnum = "normal" | "light" | "dark" | "light dark" | "dark light" | "only light";
export type RobotsInfo = {
	index?: boolean;
	follow?: boolean;
	/** @deprecated set index to false instead */
	noindex?: never;
	/** @deprecated set follow to false instead */
	nofollow?: never;
	noarchive?: boolean;
	nosnippet?: boolean;
	noimageindex?: boolean;
	nocache?: boolean;
	notranslate?: boolean;
	indexifembedded?: boolean;
	nositelinkssearchbox?: boolean;
	unavailable_after?: string;
	"max-video-preview"?: number | string;
	"max-image-preview"?: "none" | "standard" | "large";
	"max-snippet"?: number;
};
export type Robots = RobotsInfo & {
	googleBot?: string | RobotsInfo;
};
export type ResolvedRobots = {
	basic: string | null;
	googleBot: string | null;
};
export type IconURL = string | URL;
export type Icon = IconURL | IconDescriptor;
export type IconDescriptor = {
	url: string | URL;
	type?: string;
	sizes?: string;
	/** defaults to rel="icon" unless superseded by Icons map */
	rel?: string;
	media?: string;
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority
	 */
	fetchPriority?: "high" | "low" | "auto";
};
export type Icons = {
	/** rel="icon" */
	icon?: Icon | Icon[];
	/** rel="shortcut icon" */
	shortcut?: Icon | Icon[];
	/**
	 * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
	 * rel="apple-touch-icon"
	 */
	apple?: Icon | Icon[];
	/** rel inferred from descriptor, defaults to "icon" */
	other?: IconDescriptor | IconDescriptor[];
};
export type Verification = {
	google?: null | string | number | (string | number)[];
	yahoo?: null | string | number | (string | number)[];
	yandex?: null | string | number | (string | number)[];
	me?: null | string | number | (string | number)[];
	other?: {
		[name: string]: string | number | (string | number)[];
	};
};
export type ResolvedVerification = {
	google?: null | (string | number)[];
	yahoo?: null | (string | number)[];
	yandex?: null | (string | number)[];
	me?: null | (string | number)[];
	other?: {
		[name: string]: (string | number)[];
	};
};
export type ResolvedIcons = {
	icon: IconDescriptor[];
	apple: IconDescriptor[];
	shortcut?: IconDescriptor[];
	other?: IconDescriptor[];
};
export type ThemeColorDescriptor = {
	color: string;
	media?: string;
};
export type OpenGraphType = "article" | "book" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "profile" | "website" | "video.tv_show" | "video.other" | "video.movie" | "video.episode";
export type OpenGraph = OpenGraphWebsite | OpenGraphArticle | OpenGraphBook | OpenGraphProfile | OpenGraphMusicSong | OpenGraphMusicAlbum | OpenGraphMusicPlaylist | OpenGraphRadioStation | OpenGraphVideoMovie | OpenGraphVideoEpisode | OpenGraphVideoTVShow | OpenGraphVideoOther | OpenGraphMetadata;
export type Locale = string;
export type OpenGraphMetadata = {
	determiner?: "a" | "an" | "the" | "auto" | "";
	title?: string | TemplateString;
	description?: string;
	emails?: string | Array<string>;
	phoneNumbers?: string | Array<string>;
	faxNumbers?: string | Array<string>;
	siteName?: string;
	locale?: Locale;
	alternateLocale?: Locale | Array<Locale>;
	images?: OGImage | Array<OGImage>;
	audio?: OGAudio | Array<OGAudio>;
	videos?: OGVideo | Array<OGVideo>;
	url?: string | URL;
	countryName?: string;
	ttl?: number;
};
export type OpenGraphWebsite = OpenGraphMetadata & {
	type: "website";
};
export type OpenGraphArticle = OpenGraphMetadata & {
	type: "article";
	publishedTime?: string;
	modifiedTime?: string;
	expirationTime?: string;
	authors?: null | string | URL | Array<string | URL>;
	section?: null | string;
	tags?: null | string | Array<string>;
};
export type OpenGraphBook = OpenGraphMetadata & {
	type: "book";
	isbn?: null | string;
	releaseDate?: null | string;
	authors?: null | string | URL | Array<string | URL>;
	tags?: null | string | Array<string>;
};
export type OpenGraphProfile = OpenGraphMetadata & {
	type: "profile";
	firstName?: null | string;
	lastName?: null | string;
	username?: null | string;
	gender?: null | string;
};
export type OpenGraphMusicSong = OpenGraphMetadata & {
	type: "music.song";
	duration?: null | number;
	albums?: null | string | URL | OGAlbum | Array<string | URL | OGAlbum>;
	musicians?: null | string | URL | Array<string | URL>;
};
export type OpenGraphMusicAlbum = OpenGraphMetadata & {
	type: "music.album";
	songs?: null | string | URL | OGSong | Array<string | URL | OGSong>;
	musicians?: null | string | URL | Array<string | URL>;
	releaseDate?: null | string;
};
export type OpenGraphMusicPlaylist = OpenGraphMetadata & {
	type: "music.playlist";
	songs?: null | string | URL | OGSong | Array<string | URL | OGSong>;
	creators?: null | string | URL | Array<string | URL>;
};
export type OpenGraphRadioStation = OpenGraphMetadata & {
	type: "music.radio_station";
	creators?: null | string | URL | Array<string | URL>;
};
export type OpenGraphVideoMovie = OpenGraphMetadata & {
	type: "video.movie";
	actors?: null | string | URL | OGActor | Array<string | URL | OGActor>;
	directors?: null | string | URL | Array<string | URL>;
	writers?: null | string | URL | Array<string | URL>;
	duration?: null | number;
	releaseDate?: null | string;
	tags?: null | string | Array<string>;
};
export type OpenGraphVideoEpisode = OpenGraphMetadata & {
	type: "video.episode";
	actors?: null | string | URL | OGActor | Array<string | URL | OGActor>;
	directors?: null | string | URL | Array<string | URL>;
	writers?: null | string | URL | Array<string | URL>;
	duration?: null | number;
	releaseDate?: null | string;
	tags?: null | string | Array<string>;
	series?: null | string | URL;
};
export type OpenGraphVideoTVShow = OpenGraphMetadata & {
	type: "video.tv_show";
};
export type OpenGraphVideoOther = OpenGraphMetadata & {
	type: "video.other";
};
export type OGImage = string | OGImageDescriptor | URL;
export type OGImageDescriptor = {
	url: string | URL;
	secureUrl?: string | URL;
	alt?: string;
	type?: string;
	width?: string | number;
	height?: string | number;
};
export type OGAudio = string | OGAudioDescriptor | URL;
export type OGAudioDescriptor = {
	url: string | URL;
	secure_url?: string | URL;
	type?: string;
};
export type OGVideo = string | OGVideoDescriptor | URL;
export type OGVideoDescriptor = {
	url: string | URL;
	secureUrl?: string | URL;
	type?: string;
	width?: string | number;
	height?: string | number;
};
export type ResolvedOpenGraph = ResolvedOpenGraphWebsite | ResolvedOpenGraphArticle | ResolvedOpenGraphBook | ResolvedOpenGraphProfile | ResolvedOpenGraphMusicSong | ResolvedOpenGraphMusicAlbum | ResolvedOpenGraphMusicPlaylist | ResolvedOpenGraphRadioStation | ResolvedOpenGraphVideoMovie | ResolvedOpenGraphVideoEpisode | ResolvedOpenGraphVideoTVShow | ResolvedOpenGraphVideoOther | ResolvedOpenGraphMetadata;
export type ResolvedOpenGraphMetadata = {
	determiner?: "a" | "an" | "the" | "auto" | "";
	title?: AbsoluteTemplateString;
	description?: string;
	emails?: Array<string>;
	phoneNumbers?: Array<string>;
	faxNumbers?: Array<string>;
	siteName?: string;
	locale?: Locale;
	alternateLocale?: Array<Locale>;
	images?: Array<OGImage>;
	audio?: Array<OGAudio>;
	videos?: Array<OGVideo>;
	url: null | URL | string;
	countryName?: string;
	ttl?: number;
};
export type ResolvedOpenGraphWebsite = ResolvedOpenGraphMetadata & {
	type: "website";
};
export type ResolvedOpenGraphArticle = ResolvedOpenGraphMetadata & {
	type: "article";
	publishedTime?: string;
	modifiedTime?: string;
	expirationTime?: string;
	authors?: Array<string>;
	section?: string;
	tags?: Array<string>;
};
export type ResolvedOpenGraphBook = ResolvedOpenGraphMetadata & {
	type: "book";
	isbn?: string;
	releaseDate?: string;
	authors?: Array<string>;
	tags?: Array<string>;
};
export type ResolvedOpenGraphProfile = ResolvedOpenGraphMetadata & {
	type: "profile";
	firstName?: string;
	lastName?: string;
	username?: string;
	gender?: string;
};
export type ResolvedOpenGraphMusicSong = ResolvedOpenGraphMetadata & {
	type: "music.song";
	duration?: number;
	albums?: Array<OGAlbum>;
	musicians?: Array<string | URL>;
};
export type ResolvedOpenGraphMusicAlbum = ResolvedOpenGraphMetadata & {
	type: "music.album";
	songs?: Array<string | URL | OGSong>;
	musicians?: Array<string | URL>;
	releaseDate?: string;
};
export type ResolvedOpenGraphMusicPlaylist = ResolvedOpenGraphMetadata & {
	type: "music.playlist";
	songs?: Array<string | URL | OGSong>;
	creators?: Array<string | URL>;
};
export type ResolvedOpenGraphRadioStation = ResolvedOpenGraphMetadata & {
	type: "music.radio_station";
	creators?: Array<string | URL>;
};
export type ResolvedOpenGraphVideoMovie = ResolvedOpenGraphMetadata & {
	type: "video.movie";
	actors?: Array<string | URL | OGActor>;
	directors?: Array<string | URL>;
	writers?: Array<string | URL>;
	duration?: number;
	releaseDate?: string;
	tags?: Array<string>;
};
export type ResolvedOpenGraphVideoEpisode = ResolvedOpenGraphMetadata & {
	type: "video.episode";
	actors?: Array<string | URL | OGActor>;
	directors?: Array<string | URL>;
	writers?: Array<string | URL>;
	duration?: number;
	releaseDate?: string;
	tags?: Array<string>;
	series?: string | URL;
};
export type ResolvedOpenGraphVideoTVShow = ResolvedOpenGraphMetadata & {
	type: "video.tv_show";
};
export type ResolvedOpenGraphVideoOther = ResolvedOpenGraphMetadata & {
	type: "video.other";
};
export type OGSong = {
	url: string | URL;
	disc?: number;
	track?: number;
};
export type OGAlbum = {
	url: string | URL;
	disc?: number;
	track?: number;
};
export type OGActor = {
	url: string | URL;
	role?: string;
};
export type Twitter = TwitterSummary | TwitterSummaryLargeImage | TwitterPlayer | TwitterApp | TwitterMetadata;
export type TwitterMetadata = {
	site?: string;
	siteId?: string;
	creator?: string;
	creatorId?: string;
	description?: string;
	title?: string | TemplateString;
	images?: TwitterImage | Array<TwitterImage>;
};
export type TwitterSummary = TwitterMetadata & {
	card: "summary";
};
export type TwitterSummaryLargeImage = TwitterMetadata & {
	card: "summary_large_image";
};
export type TwitterPlayer = TwitterMetadata & {
	card: "player";
	players: TwitterPlayerDescriptor | Array<TwitterPlayerDescriptor>;
};
export type TwitterApp = TwitterMetadata & {
	card: "app";
	app: TwitterAppDescriptor;
};
export type TwitterAppDescriptor = {
	id: {
		iphone?: string | number;
		ipad?: string | number;
		googleplay?: string;
	};
	url?: {
		iphone?: string | URL;
		ipad?: string | URL;
		googleplay?: string | URL;
	};
	name?: string;
};
export type TwitterImage = string | TwitterImageDescriptor | URL;
export type TwitterImageDescriptor = {
	url: string | URL;
	alt?: string;
	secureUrl?: string | URL;
	type?: string;
	width?: string | number;
	height?: string | number;
};
export type TwitterPlayerDescriptor = {
	playerUrl: string | URL;
	streamUrl: string | URL;
	width: number;
	height: number;
};
export type ResolvedTwitterImage = {
	url: string | URL;
	alt?: string;
	secureUrl?: string | URL;
	type?: string;
	width?: string | number;
	height?: string | number;
};
export type ResolvedTwitterSummary = {
	site: string | null;
	siteId: string | null;
	creator: string | null;
	creatorId: string | null;
	description: string | null;
	title: AbsoluteTemplateString;
	images?: Array<ResolvedTwitterImage>;
};
export type ResolvedTwitterPlayer = ResolvedTwitterSummary & {
	players: Array<TwitterPlayerDescriptor>;
};
export type ResolvedTwitterApp = ResolvedTwitterSummary & {
	app: TwitterAppDescriptor;
};
export type ResolvedTwitterMetadata = ({
	card: "summary";
} & ResolvedTwitterSummary) | ({
	card: "summary_large_image";
} & ResolvedTwitterSummary) | ({
	card: "player";
} & ResolvedTwitterPlayer) | ({
	card: "app";
} & ResolvedTwitterApp);
/**
 * Metadata interface to describe all the metadata fields that can be set in a document.
 * @interface
 */
export interface Metadata extends DeprecatedMetadataFields {
	/**
	 * The base path and origin for absolute urls for various metadata links such as OpenGraph images.
	 */
	metadataBase?: null | URL;
	/**
	 * The document title.
	 * @example
	 * ```tsx
	 * "My Blog"
	 * <title>My Blog</title>
	 *
	 * { default: "Dashboard", template: "%s | My Website" }
	 * <title>Dashboard | My Website</title>
	 *
	 * { absolute: "My Blog", template: "%s | My Website" }
	 * <title>My Blog</title>
	 * ```
	 */
	title?: null | string | TemplateString;
	/**
	 * The document description, and optionally the OpenGraph and twitter descriptions.
	 * @example
	 * ```tsx
	 * "My Blog Description"
	 * <meta name="description" content="My Blog Description" />
	 * ```
	 */
	description?: null | string;
	/**
	 * The application name.
	 * @example
	 * ```tsx
	 * "My Blog"
	 * <meta name="application-name" content="My Blog" />
	 * ```
	 */
	applicationName?: null | string;
	/**
	 * The authors of the document.
	 * @example
	 * ```tsx
	 * [{ name: "Next.js Team", url: "https://nextjs.org" }]
	 *
	 * <meta name="author" content="Next.js Team" />
	 * <link rel="author" href="https://nextjs.org" />
	 * ```
	 */
	authors?: null | Author | Array<Author>;
	/**
	 * The generator used for the document.
	 * @example
	 * ```tsx
	 * "Next.js"
	 *
	 * <meta name="generator" content="Next.js" />
	 * ```
	 */
	generator?: null | string;
	/**
	 * The keywords for the document. If an array is provided, it will be flattened into a single tag with comma separation.
	 * @example
	 * ```tsx
	 * "nextjs, react, blog"
	 * <meta name="keywords" content="nextjs, react, blog" />
	 *
	 * ["react", "server components"]
	 * <meta name="keywords" content="react, server components" />
	 * ```
	 */
	keywords?: null | string | Array<string>;
	/**
	 * The referrer setting for the document.
	 * @example
	 * ```tsx
	 * "origin"
	 * <meta name="referrer" content="origin" />
	 * ```
	 */
	referrer?: null | ReferrerEnum;
	/**
	 * The theme color for the document.
	 * @example
	 * ```tsx
	 * "#000000"
	 * <meta name="theme-color" content="#000000" />
	 *
	 * { media: "(prefers-color-scheme: dark)", color: "#000000" }
	 * <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
	 *
	 * [
	 *  { media: "(prefers-color-scheme: dark)", color: "#000000" },
	 *  { media: "(prefers-color-scheme: light)", color: "#ffffff" }
	 * ]
	 * <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
	 * <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
	 * ```
	 */
	themeColor?: null | string | ThemeColorDescriptor | ThemeColorDescriptor[];
	/**
	 * The color scheme for the document.
	 * @example
	 * ```tsx
	 * "dark"
	 * <meta name="color-scheme" content="dark" />
	 * ```
	 */
	colorScheme?: null | ColorSchemeEnum;
	/**
	 * The viewport setting for the document.
	 * @example
	 * ```tsx
	 * "width=device-width, initial-scale=1"
	 * <meta name="viewport" content="width=device-width, initial-scale=1" />
	 *
	 * { width: "device-width", initialScale: 1 }
	 * <meta name="viewport" content="width=device-width, initial-scale=1" />
	 * ```
	 */
	viewport?: null | string | Viewport;
	/**
	 * The creator of the document.
	 * @example
	 * ```tsx
	 * "Next.js Team"
	 * <meta name="creator" content="Next.js Team" />
	 * ```
	 */
	creator?: null | string;
	/**
	 * The publisher of the document.
	 * @example
	 *
	 * ```tsx
	 * "Vercel"
	 * <meta name="publisher" content="Vercel" />
	 * ```
	 */
	publisher?: null | string;
	/**
	 * The robots setting for the document.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Glossary/Robots.txt
	 * @example
	 * ```tsx
	 * "index, follow"
	 * <meta name="robots" content="index, follow" />
	 *
	 * { index: false, follow: false }
	 * <meta name="robots" content="noindex, nofollow" />
	 * ```
	 */
	robots?: null | string | Robots;
	/**
	 * The canonical and alternate URLs for the document.
	 * @example
	 * ```tsx
	 * { canonical: "https://example.com" }
	 * <link rel="canonical" href="https://example.com" />
	 *
	 * { canonical: "https://example.com", hreflang: { "en-US": "https://example.com/en-US" } }
	 * <link rel="canonical" href="https://example.com" />
	 * <link rel="alternate" href="https://example.com/en-US" hreflang="en-US" />
	 * ```
	 */
	alternates?: null | AlternateURLs;
	/**
	 * The icons for the document. Defaults to rel="icon".
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#attr-icon
	 * @example
	 * ```tsx
	 * "https://example.com/icon.png"
	 * <link rel="icon" href="https://example.com/icon.png" />
	 *
	 * { icon: "https://example.com/icon.png", apple: "https://example.com/apple-icon.png" }
	 * <link rel="icon" href="https://example.com/icon.png" />
	 * <link rel="apple-touch-icon" href="https://example.com/apple-icon.png" />
	 *
	 * [{ rel: "icon", url: "https://example.com/icon.png" }, { rel: "apple-touch-icon", url: "https://example.com/apple-icon.png" }]
	 * <link rel="icon" href="https://example.com/icon.png" />
	 * <link rel="apple-touch-icon" href="https://example.com/apple-icon.png" />
	 * ```
	 */
	icons?: null | IconURL | Array<Icon> | Icons;
	/**
	 * The manifest.json file is the only file that every extension using WebExtension APIs must contain
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/Manifest
	 * @example
	 * ```tsx
	 * "https://example.com/manifest.json"
	 * <link rel="manifest" href="https://example.com/manifest.json" />
	 * ```
	 *
	 */
	manifest?: null | string | URL;
	/**
	 * The Open Graph metadata for the document.
	 *
	 * @see https://ogp.me
	 * @example
	 * ```tsx
	 * {
	 *   type: "website",
	 *   url: "https://example.com",
	 *   title: "My Website",
	 *   description: "My Website Description",
	 *   siteName: "My Website",
	 *   images: [{
	 *     url: "https://example.com/og.png",
	 *   }],
	 * }
	 *
	 * <meta property="og:type" content="website" />
	 * <meta property="og:url" content="https://example.com" />
	 * <meta property="og:site_name" content="My Website" />
	 * <meta property="og:title" content="My Website" />
	 * <meta property="og:description" content="My Website Description" />
	 * <meta property="og:image" content="https://example.com/og.png" />
	 * ```
	 */
	openGraph?: null | OpenGraph;
	/**
	 * The Twitter metadata for the document.
	 * @example
	 * ```tsx
	 * { card: "summary_large_image", site: "@site", creator: "@creator", "images": "https://example.com/og.png" }
	 *
	 * <meta name="twitter:card" content="summary_large_image" />
	 * <meta name="twitter:site" content="@site" />
	 * <meta name="twitter:creator" content="@creator" />
	 * <meta name="twitter:title" content="My Website" />
	 * <meta name="twitter:description" content="My Website Description" />
	 * <meta name="twitter:image" content="https://example.com/og.png" />
	 * ```
	 *
	 */
	twitter?: null | Twitter;
	/**
	 * The common verification tokens for the document.
	 * @example
	 * ```tsx
	 * { verification: { google: "google-site-verification=1234567890", yandex: "1234567890", "me": "1234567890" } }
	 * <meta name="google-site-verification" content="1234567890" />
	 * <meta name="yandex-verification" content="1234567890" />
	 * <meta name="me" content="@me" />
	 * ```
	 */
	verification?: Verification;
	/**
	 * The Apple web app metadata for the document.
	 *
	 * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
	 * @example
	 * ```tsx
	 * { capable: true, title: "My Website", statusBarStyle: "black-translucent" }
	 * <meta name="apple-mobile-web-app-capable" content="yes" />
	 * <meta name="apple-mobile-web-app-title" content="My Website" />
	 * <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	 * ```
	 *
	 */
	appleWebApp?: null | boolean | AppleWebApp;
	/**
	 * Indicates if devices should try to interpret various formats and make actionable links out of them. For example it controles
	 * if telephone numbers on mobile that can be clicked to dial or not.
	 * @example
	 * ```tsx
	 * { telephone: false }
	 * <meta name="format-detection" content="telephone=no" />
	 * ```
	 *
	 */
	formatDetection?: null | FormatDetection;
	/**
	 * The metadata for the iTunes App.
	 * It adds the `name="apple-itunes-app"` meta tag.
	 *
	 * @example
	 * ```tsx
	 * { app: { id: "123456789", affiliateData: "123456789", appArguments: "123456789" } }
	 * <meta name="apple-itunes-app" content="app-id=123456789, affiliate-data=123456789, app-arguments=123456789" />
	 * ```
	 */
	itunes?: null | ItunesApp;
	/**
	 * A brief description of what this web-page is about. Not recommended, superseded by description.
	 * It adds the `name="abstract"` meta tag.
	 *
	 * @see https://www.metatags.org/all-meta-tags-overview/meta-name-abstract/
	 * @example
	 * ```tsx
	 * "My Website Description"
	 * <meta name="abstract" content="My Website Description" />
	 * ```
	 */
	abstract?: null | string;
	/**
	 * The Facebook AppLinks metadata for the document.
	 * @example
	 * ```tsx
	 * { ios: { appStoreId: "123456789", url: "https://example.com" }, android: { packageName: "com.example", url: "https://example.com" } }
	 *
	 * <meta property="al:ios:app_store_id" content="123456789" />
	 * <meta property="al:ios:url" content="https://example.com" />
	 * <meta property="al:android:package" content="com.example" />
	 * <meta property="al:android:url" content="https://example.com" />
	 * ```
	 */
	appLinks?: null | AppLinks;
	/**
	 * The archives link rel property.
	 * @example
	 * ```tsx
	 * { archives: "https://example.com/archives" }
	 * <link rel="archives" href="https://example.com/archives" />
	 * ```
	 */
	archives?: null | string | Array<string>;
	/**
	 * The assets link rel property.
	 * @example
	 * ```tsx
	 * "https://example.com/assets"
	 * <link rel="assets" href="https://example.com/assets" />
	 * ```
	 */
	assets?: null | string | Array<string>;
	/**
	 * The bookmarks link rel property.
	 * @example
	 * ```tsx
	 * "https://example.com/bookmarks"
	 * <link rel="bookmarks" href="https://example.com/bookmarks" />
	 * ```
	 */
	bookmarks?: null | string | Array<string>;
	/**
	 * The category meta name property.
	 * @example
	 * ```tsx
	 * "My Category"
	 * <meta name="category" content="My Category" />
	 * ```
	 */
	category?: null | string;
	/**
	 * The classification meta name property.
	 * @example
	 * ```tsx
	 * "My Classification"
	 * <meta name="classification" content="My Classification" />
	 * ```
	 */
	classification?: null | string;
	/**
	 * Arbitrary name/value pairs for the document.
	 */
	other?: {
		[name: string]: string | number | Array<string | number>;
	} & DeprecatedMetadataFields;
}
export interface ResolvedMetadata extends DeprecatedMetadataFields {
	metadataBase: null | URL;
	title: null | AbsoluteTemplateString;
	description: null | string;
	applicationName: null | string;
	authors: null | Array<Author>;
	generator: null | string;
	keywords: null | Array<string>;
	referrer: null | ReferrerEnum;
	themeColor: null | ThemeColorDescriptor[];
	colorScheme: null | ColorSchemeEnum;
	viewport: null | string;
	creator: null | string;
	publisher: null | string;
	robots: null | ResolvedRobots;
	alternates: null | ResolvedAlternateURLs;
	icons: null | ResolvedIcons;
	openGraph: null | ResolvedOpenGraph;
	manifest: null | string | URL;
	twitter: null | ResolvedTwitterMetadata;
	verification: null | ResolvedVerification;
	appleWebApp: null | ResolvedAppleWebApp;
	formatDetection: null | FormatDetection;
	itunes: null | ItunesApp;
	abstract: null | string;
	appLinks: null | ResolvedAppLinks;
	archives: null | Array<string>;
	assets: null | Array<string>;
	bookmarks: null | Array<string>;
	category: null | string;
	classification: null | string;
	other: null | ({
		[name: string]: string | number | Array<string | number>;
	} & DeprecatedMetadataFields);
}
export type ResolvingMetadata = Promise<ResolvedMetadata>;
export type FieldResolver<Key extends keyof Metadata> = (T: Metadata[Key]) => ResolvedMetadata[Key];
export type FieldResolverWithMetadataBase<Key extends keyof Metadata> = (T: Metadata[Key], metadataBase: ResolvedMetadata["metadataBase"]) => ResolvedMetadata[Key];
export declare function resolveMetadata(...metadata: [
	Metadata,
	...Metadata[]
]): ResolvedMetadata;
export declare function renderMetadata(meta: ResolvedMetadata): string;
export declare function resolveAndRenderMetadata(...metadata: [
	Metadata,
	...Metadata[]
]): string;

export {};
