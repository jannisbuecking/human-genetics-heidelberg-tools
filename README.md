# Institute of Human Genetics Heidelberg Database & Tool Portal

Overview Webpage developed for the Institute of Human Genetics Heidelberg. 
View at https://institute-of-human-genetics-heidelberg.github.io

Developed by Tim Schubert & Jannis Buecking. 

## Website

The homepage opens in **Explore**, a horizontal RNA schematic navigated with normal page scrolling. The equally sized **Explore / List** buttons below “Arcanum vitae explorandum.” switch to the organized tool grid. List occupies a full viewport on fitting desktop screens and grows naturally when its content needs more room. The original header, animated terminal, tool descriptions, logos, destinations, and legal notice are retained.

This is a static website: `index.html` loads the shared `styles.css`, `overrides.css`, and `script.js`, with `horizontal.css` and `horizontal.js` providing the Explore / List interface. It requires no build step. The existing main-branch deployment workflow updates the institute website.

The enlarged nucleotide symbols and tool tiles are interface annotations, not molecular-scale structures or a literal coding sequence. The ribosome is a simplified 2D schematic with [RCSB PDB 9RU8](https://www.rcsb.org/structure/9RU8) as anatomical reference. Its standalone vector source is `assets/ribosome-schematic.svg`; the page embeds the same paths.
