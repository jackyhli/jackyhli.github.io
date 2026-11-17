/* ==========================================================================
   ABOUT PAGE PHOTOS — the stack of stills beside your bio on jackyhli.com/about/
   --------------------------------------------------------------------------
   Your portrait (Still 01) is always shown. The photos listed here stack
   underneath it, in order, as many as fit beside the bio. Any that don't fit
   move to a "Contact sheet" grid below the bio, so every photo is on the page:
   a wide desktop puts more beside the bio, a phone puts them all in the sheet.

   To add one: save it in assets/img/stills/ (a JPG about 1000 px on the long
   side is plenty), copy a block below, and fill it in. Put your favorites
   first, since they're the first to show.

   src      (required) e.g. "/assets/img/stills/vsa-retreat.jpg"
   alt      (required) What's in the photo, for screen readers.
   caption  (required) Short label under the photo, e.g. "Cal VSA retreat · 2026".
   width, height  (required) The photo's pixel size, so its frame has the right shape.
   overlay  (optional) The camera overlay drawn on top:
              "af"        focus box on a face. Set focus: [x%, y%] for where the face is.
              "letterbox" cinema bars, REC dot and timecode. Good for wide event shots.
              "histogram" exposure histogram and readout. Good for landscapes and city shots.
              "grid"      rule-of-thirds lines and a level. Good for behind-the-scenes shots.
   settings (optional) The three readouts on the overlay, e.g. ["F2.8", "1/125", "ISO 800"].
   ========================================================================== */

const PHOTOS = [

  {
    src: "/assets/img/stills/vsa-retreat.jpg",
    alt: "Jacky with a lav mic and camera rig at the Cal VSA retreat",
    caption: "Cal VSA retreat",
    width: 800, height: 1200,
    overlay: "grid",
    settings: ["F2.8", "1/125", "ISO 1600"],
  },

  {
    src: "/assets/img/stills/rcg-retreat.jpg",
    alt: "Jacky throwing peace signs on a lakeside beach at the Regents' Consulting Group retreat",
    caption: "RCG retreat",
    width: 960, height: 1200,
    overlay: "af",
    focus: [52, 39],
    settings: ["F4.0", "1/1000", "ISO 100"],
  },

  {
    src: "/assets/img/stills/sing-off.jpg",
    alt: "Jacky hosting on stage at the BLS Asia holiday sing-off",
    caption: "BLS Asia sing-off",
    width: 1200, height: 800,
    overlay: "letterbox",
    settings: ["T1.8", "1/50", "ISO 3200"],
  },

  {
    src: "/assets/img/stills/asian-night.jpg",
    alt: "Jacky with two friends at BLS Asia's Asian Night",
    caption: "BLS Asia · Asian Night",
    width: 900, height: 1200,
    overlay: "af",
    focus: [34, 28],
    settings: ["F1.8", "1/60", "ISO 800"],
  },

  {
    src: "/assets/img/stills/graduation.jpg",
    alt: "Jacky smiling in a blue graduation cap and gown, holding flowers",
    caption: "Graduation day",
    width: 1200, height: 900,
    overlay: "af",
    focus: [55, 40],
    settings: ["F2.8", "1/250", "ISO 400"],
  },

  {
    src: "/assets/img/stills/prom.jpg",
    alt: "Jacky in a suit at prom, high above the Boston waterfront",
    caption: "Prom · Boston",
    width: 1200, height: 900,
    overlay: "histogram",
    settings: ["F5.6", "1/250", "ISO 200"],
  },

];
