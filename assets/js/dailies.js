/* ==========================================================================
   YOUR VIDEOS — the list behind jackyhli.com/videos/
   --------------------------------------------------------------------------
   To add something: copy a block, paste it at the TOP of the list (newest
   first), fill it in, save, and push. That's it.

   Where to put a video
   - Long videos (trailers, vlogs, recaps): upload to YouTube (public or
     unlisted) and use `url`. YouTube streams the right quality for each
     phone and connection, and the views count on your channel.
   - Short clips (reels, ads, loops under a minute): put a compressed .mp4 in
     assets/video/ and use `video`. It plays silently on loop in the grid,
     like a feed, and opens with sound when tapped. Keep each file small
     (about 2–6 MB; see NOTES.md for the export settings).
   - Stills (flyers, posters, photos): put the image in assets/img/dailies/
     and use `image`.

   Fields
   url    A YouTube, YouTube Shorts, Vimeo, Instagram or TikTok link.
          YouTube and Vimeo play on your site; Instagram and TikTok open the
          original post in a new tab.
   video  A video file on this site, e.g. "/assets/video/merch-drop.mp4".
   image  An image on this site, e.g. "/assets/img/dailies/an25-flyer.jpg".
   title  (required) What shows under the thumbnail.
   date   (optional) "YYYY-MM-DD", or just "YYYY". Shows as "Nov 2026" / "2025".
   tag    (optional) A short label like "Reel", "Vlog", "Trailer".
   credit (optional) Who it was made for, e.g. "@calvsa".
   aspect (optional) The shape: "16:9", "9:16", "1:1", "4:5". Anything
          taller than it is wide goes in the short-form strip.
   poster (optional) Cover image for a `video`, shown until it starts.
   preview (optional) A lighter, silent copy of a `video` for the looping
          preview in the grid. The full `video` (with sound) loads on tap.
   thumb  (optional) Cover image for an Instagram or TikTok link.
   source (optional) Overrides the small label in the thumbnail's corner.
   ========================================================================== */

const DAILIES = [

  // Example for a @calvsa Instagram reel:
  // {
  //   title: "VSA intern photoshoot — behind the scenes",
  //   url: "https://www.instagram.com/reel/XXXXXXXXXXX/",
  //   date: "2026-11-20",
  //   tag: "Reel",
  //   credit: "@calvsa",
  //   aspect: "9:16",
  //   thumb: "/assets/img/dailies/vsa-intern-bts.jpg",
  // },

  {
    title: "Tour de Asia — culture show trailer",
    url: "https://www.youtube.com/watch?v=TFJGvldf1Sk",
    date: "2025",
    tag: "Trailer",
    aspect: "16:9",
  },

  {
    title: "Asian Night blooper reel",
    url: "https://www.youtube.com/watch?v=cXcfFsXVFaA",
    tag: "Blooper reel",
    aspect: "16:9",
  },

  {
    title: "Valentine's Day sale — Recycling Committee",
    video: "/assets/video/valentines-sale.mp4",
    preview: "/assets/video/valentines-sale-loop.mp4",
    poster: "/assets/video/valentines-sale.jpg",
    tag: "Reel ad",
    aspect: "9:16",
  },

  {
    title: "Merch drop",
    video: "/assets/video/merch-drop.mp4",
    preview: "/assets/video/merch-drop-loop.mp4",
    poster: "/assets/video/merch-drop.jpg",
    tag: "Instagram ad",
    aspect: "1:1",
  },

  {
    title: "Asian Night 2025 flyer",
    image: "/assets/img/dailies/an25-flyer.jpg",
    date: "2025",
    tag: "Design",
    aspect: "4:5",
    source: "Still",
  },

];
