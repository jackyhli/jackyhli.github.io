# jackyhli.com

My personal site, styled like a camera monitor. It's plain HTML, CSS and JavaScript, so there's no build step and nothing to install.

## What's where

```
index.html            Scene 01: the landing page
about/index.html      Scene 02: About (jackyhli.com/about/)
work/index.html       Scene 03: Work
projects/index.html   Scene 04: Projects
videos/index.html     Scene 05: Videos
contact/index.html    Scene 06: Contact (message form + direct links)
404.html              "No signal" page for broken links
assets/css/style.css  All styling. Colors and fonts are at the top in :root
assets/js/main.js     Your links, the contact form, and the REC timecode
assets/js/photos.js   YOUR ABOUT-PAGE PHOTOS. Extra stills that stack beside your bio
assets/img/stills/    The photo files for photos.js
assets/js/dailies.js  YOUR VIDEO LIST. Add reels, vlogs, YouTube and Drive videos here
assets/img/dailies/   Cover images for Instagram and TikTok posts
assets/img/           Favicon, share image (og.jpg), laurels, project thumbnails
CNAME                 Tells GitHub Pages to serve the site at jackyhli.com
```

## Before going live

1. **Add your links.** Open `assets/js/main.js` and fill in the `SITE` object at the top. Any link left blank is hidden, so the site never shows a dead link.
2. **Resume.** Put your PDF at `assets/resume.pdf` and set `resume: "/assets/resume.pdf"` in `main.js`.
3. **Contact form.** Already connected to your Formspree form (`https://formspree.io/f/mkjrjjer`, set in `main.js`). Messages go to the email on your Formspree account. Once the site is live, send yourself one test message and confirm it arrives. The free plan covers 50 messages a month.
4. **Portrait.** Already in place at `assets/img/portrait.jpg`. To swap it, replace that file with another 4:5 photo (960 × 1200 is plenty). If the face moves, adjust the amber focus box's `left`/`top` in `about/index.html`.
5. **Your footage.** Each project card's thumbnail is an `<img>` in `projects/index.html`. Swap any `clip-*.svg` for one of your own stills (a 16:9 JPG works best).

## Adding photos to the About page

Your portrait is always shown. Extra photos go in `assets/img/stills/` and are listed in `assets/js/photos.js` (the file has a template to copy). They stack under the portrait, in order, as many as fit beside your bio. The rest go into a "Contact sheet" grid below the bio, so every photo is always on the page (on a phone, all of them go into the sheet). Each one gets a camera overlay of your choice (`af`, `letterbox`, `histogram` or `grid`).

## Adding videos, reels and vlogs

Open `assets/js/dailies.js` and add a block at the top of the list:

```js
{
  title: "VSA intern photoshoot — behind the scenes",
  url: "https://www.instagram.com/reel/XXXXXXXXXXX/",
  date: "2026-11-20",
  tag: "VSA",
  thumb: "/assets/img/dailies/vsa-intern-bts.jpg",
},
```

- **YouTube, Vimeo and Google Drive** videos play in a pop-up player on your site. YouTube and Drive find their own thumbnails. Drive files must be shared as "Anyone with the link".
- Set `aspect` ("16:9", "9:16", "1:1", "4:5") so each card matches the video's shape, and `credit: "@calvsa"` for work made for an account.
- **Instagram and TikTok** posts open in a new tab. They don't share thumbnails, so save a screenshot of the cover into `assets/img/dailies/` and point `thumb` at it. Without one, the card shows a plain striped frame.
- Vertical videos (Instagram, TikTok, YouTube Shorts) go in the "Short form" film strip. Everything else goes in "Long form".

## Preview on your laptop

From this folder, run:

```
python3 -m http.server 8000
```

then open http://localhost:8000. Opening the HTML files directly by double-clicking won't load the styles, because the site uses links that start from the domain root.

## Deploy to jackyhli.com with GitHub Pages

1. Make this folder a GitHub repository (GitHub Desktop: File → Add Local Repository) and push it.
2. On GitHub: repo **Settings → Pages**. Under "Build and deployment," choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Still under Pages, set **Custom domain** to `jackyhli.com`.
4. At your domain registrar, add these DNS records:

   | Type  | Name | Value |
   |-------|------|-------|
   | A     | @    | 185.199.108.153 |
   | A     | @    | 185.199.109.153 |
   | A     | @    | 185.199.110.153 |
   | A     | @    | 185.199.111.153 |
   | AAAA  | @    | 2606:50c0:8000::153 |
   | AAAA  | @    | 2606:50c0:8001::153 |
   | AAAA  | @    | 2606:50c0:8002::153 |
   | AAAA  | @    | 2606:50c0:8003::153 |
   | CNAME | www  | YOUR-GITHUB-USERNAME.github.io |

5. Once DNS has spread (minutes to a few hours), tick **Enforce HTTPS** in Settings → Pages.

After that, every push to `main` updates the live site.

## Fonts

Instrument Serif, Inter Tight and IBM Plex Mono are stored in `assets/fonts` (all under the SIL Open Font License), so the site loads no files from other websites.
