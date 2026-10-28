# RNA and Panels test website

Current test website: https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/

The former horizontal preview entry point now opens the vertical RNA layout by default. The RNA / Panels control above the tools switches between the vertical strand and the original main-branch tool grid. The existing /vertical/ address opens the same interface.

Open `horizontal.html` or `vertical.html` locally. Both use `vertical.css` and `vertical.js`, plus the original shared styles and terminal script. Each tool article occurs only once: the same DOM is rearranged into the panel grid, keeping IDs, descriptions, logos, links, keyboard focus, and terminal destinations consistent. Switching to Panels hides the molecular artwork and suspends its animation. RNA starts as the selected view on a fresh load.

Panels uses the original shared card styling and the original two-column / one-column-at-860px grid from the main repository. RNA keeps the enlarged bases, centered cards, single backbone, faint rotated ribosome, and short strand: AUG → aRgus → G C → MfAP → A U → MAMMOTH → C G → SYS → UAA. The abbreviated strand and tool tiles are interface symbols, not a literal biological coding sequence. The schematic uses https://www.rcsb.org/structure/9RU8 as anatomical reference.

The original header and hero remain unchanged. The production main branch and its Pages configuration are not part of this publication. Source changes are retained on the test/rna-vertical and test/rna-horizontal branches. The preview repository publishes its preview branch.
