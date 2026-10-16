/** Section anchors belong to the homepage, not to utility/detail routes. */
export function navigationHref(href: string, home: boolean): string {
  return href.startsWith("#") && !home ? `/${href}` : href;
}
