/* ==========================================================================
   YOUR VIDEOS — the list behind jackyhli.com/videos/
   --------------------------------------------------------------------------
   To add something: copy a block, paste it at the TOP of the list (newest
   first), fill it in, save, and push. That's it.

   url    (required) Link to the video or post. YouTube, YouTube Shorts,
                     Instagram, TikTok, Vimeo, Google Drive, or any other link.
                     Drive files must be shared as "Anyone with the link".
   title  (required) What shows under the thumbnail.
   date   (optional) "YYYY-MM-DD", or just "YYYY". Shows as "Nov 2026" / "2025".
   tag    (optional) A short label like "Reel", "Vlog", "Trailer".
   credit (optional) Who it was made for, e.g. "@calvsa".
   aspect (optional) The video's shape: "16:9", "9:16", "1:1", "4:5".
                     Anything taller than it is wide goes in the swipeable
                     film strip; wide videos go in the grid.
   thumb  (optional) A cover image, e.g. "/assets/img/dailies/vsa-bts.jpg".
                     YouTube and Drive find their own thumbnail. For Instagram
                     and TikTok, save a screenshot of the cover into
                     assets/img/dailies/ and point to it here.
   source (optional) Overrides the small label in the thumbnail's corner.

   YouTube, Vimeo and Google Drive videos play right on your site.
   Instagram, TikTok and other links open the original post in a new tab.
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
    url: "https://drive.google.com/file/d/1WtOgLGyUf5pHIOwZhr94mj18xOR0P6EN/view",
    date: "2025",
    tag: "Trailer",
    aspect: "16:9",
  },

  {
    title: "Asian Night blooper reel",
    url: "https://drive.google.com/file/d/1nt2VJFUUd73Zl2owkeDQqxcptvzRw3TM/view",
    tag: "Blooper reel",
    aspect: "16:9",
  },

  {
    title: "Valentine's Day sale — Recycling Committee",
    url: "https://drive.google.com/file/d/1kOeXkHsogme2_JLD1sFJoRLW-4Ee12ca/view",
    tag: "Reel ad",
    aspect: "9:16",
  },

  {
    title: "Merch drop",
    url: "https://drive.google.com/file/d/16OKhNeiSgkPVFmUgpMzpCJqTe2ur_SHJ/view",
    tag: "Instagram ad",
    aspect: "1:1",
  },

  {
    title: "Asian Night 2025 flyer",
    url: "https://drive.google.com/file/d/1288nwLKfGhL5pZmjC_w_t5FtHo82G2u5/view",
    date: "2025",
    tag: "Design",
    aspect: "4:5",
    source: "Still",
  },

];
