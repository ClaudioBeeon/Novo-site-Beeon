/**
 * Âncoras como "#agencia" só existem no conteúdo da home. Fora dela, o link
 * precisa navegar pra "/" primeiro e só então pular pra âncora.
 */
export function hrefEmContexto(href: string, pathname: string): string {
  return href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
}
