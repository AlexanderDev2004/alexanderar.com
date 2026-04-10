#set page(margin: (top: 1.6cm, bottom: 1.6cm, left: 1.8cm, right: 1.8cm))
#set text(size: 10.8pt)
#set par(justify: false)

#let section-color = rgb("#7b1e3a")
#let name-color = rgb("#1f3b82")

#let section(title) = [
  #v(0.95em)
  #text(size: 12.5pt, weight: "bold", fill: section-color)[#title]
  #v(0.12em)
  #line(length: 100%, stroke: 0.8pt + rgb("#222222"))
  #v(0.35em)
]

#let two-col(left, right) = grid(
  columns: (1fr, auto),
  gutter: 0.7em,
  [#left],
  [#right],
)

#align(center)[
  #text(size: 25pt, weight: "bold", fill: name-color)[Alexander Agung Raya]
]

#v(0.28em)

#align(center)[
  Indonesia |
  #link("mailto:alexanderagungraya08@gmail.com")[alexanderagungraya08\@gmail.com] |
  #link("https://github.com/AlexanderDev2004")[github.com/AlexanderDev2004] |
  #link("https://linkedin.com/in/alexanderagungraya")[linkedin.com/in/alexanderagungraya] |
  #link("https://alexanderar.com")[alexanderar.com]
]

#section("WORK EXPERIENCE")

#two-col([
  #text(weight: "bold")[Fullstack Web Developer]
], [Jan 2026 --- Jun 2026])
#two-col([
  PT. Surabaya Autocomp Indonesia - Internship
], [#emph[Mojokerto, Indonesia]])

- Built scalable backend services with Django for internal web applications.
- Managed PostgreSQL queries and schema updates to improve data reliability.
- Implemented REST API endpoints and authentication flows for core features.

#text(weight: "bold")[Stack:] Django,PostgreSQL, REST API, JavaScript

#v(0.55em)

#two-col([
  #text(weight: "bold")[Game Developer]
], [Sep 2025 --- Present])
#two-col([
  Ariverse Studio - Contract (Remote)
], [#emph[Indonesia]])

- Developed gameplay systems and interactive mechanics using Unity and C\#.
- Collaborated with designers and artists to deliver immersive game experiences.
- Optimized performance for desktop and mobile targets.

#text(weight: "bold")[Stack:] Unity, C\#, Game Development

#section("PROJECTS")

#two-col([
  #text(weight: "bold")[Portofolio Alex]
  (#text(fill: section-color)[#link("https://alexanderar.com")[alexanderar.com]])
], [2026 --- Present])

- Rebuilt my personal portfolio using Astro, Svelte, Tailwind CSS, and Bun.
- Implemented content-driven pages for projects, blogs, and bookmarks using Markdown collections.
- Focused on responsive UX, fast page loads, and SEO-ready metadata structure.

#text(weight: "bold")[Stack:] Astro, Svelte, Tailwind CSS, Bun, TypeScript

#v(0.45em)

#two-col([
  #text(weight: "bold")[Lapor Sana]
  (#text(fill: section-color)[#link("https://github.com/AlexanderDev2004/LaporSana")[github.com/AlexanderDev2004/LaporSana]])
], [2025])

- Built a campus facility issue reporting and management platform.
- Developed recommendation workflow support with Python-based decision logic.
- Implemented backend and UI modules for report handling and status tracking.

#text(weight: "bold")[Stack:] Laravel, MySQL, Tailwind CSS, Python

#v(0.45em)

#two-col([
  #text(weight: "bold")[Ijen Driver]
  (#text(fill: section-color)[#link("https://github.com/AlexanderDev2004/ijen-driver")[github.com/AlexanderDev2004/ijen-driver]])
], [2025])

- Developed a booking platform for tour driver services.
- Built full-stack features for booking data, driver data, and responsive pages.
- Improved usability with a simple flow and mobile-friendly interface.

#text(weight: "bold")[Stack:] Laravel, MySQL, Tailwind CSS

#section("EDUCATION")

#two-col([
  #text(weight: "bold")[State Polytechnic of Malang]
], [Malang])
#two-col([
  #emph[Diploma 4 Informatics Engineering]
], [#emph[2023 --- Present]])

- Relevant focus: software engineering, web development, and databases.
