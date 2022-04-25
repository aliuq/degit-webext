<!-- markdownlint-disable no-inline-html -->
<h1 align="left">
 Degit Webext
 <img src="src/assets/icon-blue-512.png" height="28px" align="bottom">
</h1>

<p align="left">
  <a href="https://addons.mozilla.org/zh-CN/firefox/addon/degit/">
   <img src="https://img.shields.io/amo/users/{9408450c-b12f-4a07-bb2e-62ff5b320374}?label=Firefox" alt="firefox" />
  </a>
  <a href="https://addons.mozilla.org/zh-CN/firefox/addon/degit/">
   <img src="https://img.shields.io/amo/v/{9408450c-b12f-4a07-bb2e-62ff5b320374}" alt="firefox" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/degit-webext/pdhncoaddkgkhkpjnidgfacgkpejapbc">
   <img src="https://img.shields.io/chrome-web-store/users/pdhncoaddkgkhkpjnidgfacgkpejapbc?label=Chrome&color=blue" alt="chrome" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/degit-webext/pdhncoaddkgkhkpjnidgfacgkpejapbc">
   <img src="https://img.shields.io/chrome-web-store/v/pdhncoaddkgkhkpjnidgfacgkpejapbc" alt="chrome" />
  </a>
  <br />
</p>

A web extension for [Degit](https://github.com/Rich-Harris/degit), it generates a button and add a shortcut key to fast copy a Degit command path in github repository page, support chrome and firefox now.

![xuanfa](/Photos/1.png)

## About

Forked from [vitesse-webext](https://github.com/antfu/vitesse-webext), and modified to fit my needs. chrome manifest v3 is different from v2. the most important thing is that v2 is disabled loading script from remote server, so HMR in development is not supported. another thing is that firefox doesn't support manifest v3 yet.

## Development

Because of the manifest version different between chrome(mv3) and firefox(mv2), You have to use different way to develope and build the extension. it has some default configuration, auto open devtools, start maximize window and start urls.

For chrome: ensure `chromium` is installed, and then run the following command:

```bash
pnpm dev:chromium
pnpm start:chromium

# Build
pnpm build:chromium
pnpm run pack
```

For firefox: ensure `firefox` is installed, and added to the environment variable `PATH`. if not, you have to point to the firefox executable file.
another thing is that firefox has a `firefoxProfile` field in `package.json`, you can delete this line or provide a [profile name](about:profiles) to start firefox with a profile. type `about:profiles` in the firefox address bar, you can find your all profiles.
then run the following command:

```bash
pnpm dev:firefox
pnpm start:firefox

# Build
pnpm build:firefox
pnpm run pack
```

For other browsers based on Google kernel, you can through setting `--chromium-binary` value to develope and debug the extension. e.g.

```bash
web-ext run -t chromium --chromium-binary C:/software/XXX/XXX.exe
```

## License

[MIT](./License)
