# laritedeschi-site

Site da Lari Tedeschi: todas as páginas de cursos, produtos e do estúdio em um só lugar, publicado em laritedeschi.com.

## Como está organizado

```
/                       link na bio (página inicial)
/figlogo/               FigLogo — página oficial (institucional)
/figlogo/1, /2, /3, /4a, /4b   variantes de tráfego pago
/figbrand/              FigBrand — página oficial
/figbrand/a/            variante de tráfego
/figbrand/obrigado/     pós-compra
/figpost/               FigPost — página oficial
/figpost/upsell/        upsell
/kit-design-studio/     Kit Design Studio
/estudio/               Studio Tedeschi
/assets/css/escola.css  estilo comum a todas as páginas
/assets/js/escola.js    efeitos comuns (rolagem suave, animações, UTMs no checkout)
/assets/img/<curso>/    imagens de cada curso, em WebP
```

## Regras da casa

- Cada página carrega `escola.css` e só define as cores do próprio curso no `:root`.
- Links entre páginas e para as imagens são relativos (`../assets/...`), para funcionar em qualquer endereço de prévia.
- Toda página tem o Pixel do Meta (874750447646279) no `<head>`. O `escola.js` dispara `InitiateCheckout` ao clicar em qualquer link da Kiwify e repassa as UTMs da página para o checkout.
- Imagens novas entram como arquivo em `/assets/img/`, nunca embutidas no HTML.

## Pendente

- Algumas imagens e a fonte Euclid ainda vêm do Framer (framerusercontent.com). Precisam ser copiadas para `/assets` antes de cancelar o Framer.
