# Horizontal RNA and Panels test website

Current test website: https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/

The default is the horizontal RNA approach. A small, discreet RNA / Panels control is fixed at the bottom right, with mobile safe-area spacing. It switches to the original main-branch two-column tool grid (one column at 860 pixels and below). All four tool cards are reused in place, preserving their IDs, logos, descriptions, destinations, keyboard access, and terminal jump targets.

When switching within the tools section, Panels opens at the grid heading. Returning to RNA restores the previous position along the strand. Choosing a view while still in the hero does not jump away from the hero. Animation is suspended in Panels mode. The footer leaves room for the fixed control so the legal-notice link remains accessible.

Open `horizontal.html` locally. It uses `horizontal.css`, `horizontal.js`, and the original shared styles and terminal animation. The horizontal RNA retains the stable small-viewport measurement for mobile toolbar changes, one native vertical page scroll, a large translucent ribosome, centered tool information, enlarged bases, and the short sequence AUG → aRgus → G C → MfAP → A U → MAMMOTH → C G → SYS → UAA. The tool tiles and abbreviated strand are interface symbols, not a literal biological coding sequence.

The title “Web applications and databases.” keeps its original wording and wrapping, with line-height increased from 0.99 to 1.12 for more space between lines. The remainder of the original top is unchanged.

The earlier vertical comparison remains at https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/vertical/ with its RNA / Panels selector. The root website uses the requested horizontal approach. The production main branch and its Pages configuration remain untouched. Publishing uses only the preview branch of the separate preview repository.
