/* =====================================================================
   MOJO PHOTOGRAPHY — YOUR CONTENT FILE
   This is the only file you need to edit to update your website.
   Rules: keep the quotes "  ", keep the commas at the end of each line,
   and keep every photo inside its own { } curly brackets.
   ===================================================================== */

const SITE = {
  instagram: "shot_by_ashmit",
  email: "",                                   // e.g. "mojo.ashmit@gmail.com"
  tagline: "Ashmit Singh. Wildlife, cinematic, street and night photography, shot on Canon, DJI and GoPro.",
  bio: [
    "I'm Ashmit Singh, a 19-year-old photographer and filmmaker shooting under the name MOJO Photography. I chase wildlife at first light, wander cities for street moments, and stay out long after dark for night skies and neon.",
    "Most of my work is shot on Canon, with DJI for aerials and GoPro when the camera needs to go where I can't."
  ],
  portrait: ""                                 // e.g. "photos/portrait.jpg"
};

/* ---------------- PHOTOS ----------------
   genre must be one of: "wildlife", "cinematic", "street", "night"
   cam   must be one of: "Canon", "DJI", "GoPro"
   cover: true  = show it in the big slideshow at the top
   settings can be left "" and the site will try to read it from the photo
   Newest photos go at the TOP of the list.

   Copy this line, paste it inside the [ ] below, and change the details:
   { file: "photos/tiger.jpg", genre: "wildlife", title: "Stripes at dawn", place: "Jim Corbett", cam: "Canon", settings: "", cover: true },
*/
const PHOTOS = [
  { file: "photos/night-light-trails.jpg", genre: "night", title: "Blue hour, in motion", place: "", cam: "", settings: "", cover: true },
  { file: "photos/street-metro-symmetry.jpg", genre: "street", title: "Empty carriage", place: "", cam: "", settings: "", cover: false },
];

/* ---------------- FILMS ----------------
   Short clip under 25 MB:   { file: "videos/clip.mp4", genre: "cinematic", title: "...", place: "...", cam: "DJI" },
   Longer film on YouTube:   { youtube: "https://youtu.be/XXXXXXXXXXX", genre: "night", title: "...", place: "...", cam: "Canon" },
*/
const FILMS = [

];
