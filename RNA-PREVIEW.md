# Explore / List test website

Current test website: https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/

The default Explore view uses the horizontal RNA approach. The compact Explore / List selector sits directly below “Arcanum vitae explorandum.” within the tools scene. It stays with the heading while the Explore scene is pinned, rather than floating over the hero or footer.

List uses the original tool grid, with a full-viewport minimum-height frame. On desktop, its card spacing adapts to viewport height so the two-row grid fits ordinary laptop screens. If the complete grid fits, the scene pins for a short native-scroll interval, keeping surrounding sections outside the frame. Long lists and smaller viewports grow naturally so every description and link remains reachable. Both modes use the same four articles, IDs, logos, descriptions, and destinations.

Switching to List aligns the tools heading to the top of the viewport. Returning to Explore restores the previous RNA progress. Mobile toolbar-only viewport changes do not rebuild either layout. Width changes, font or image loading, and genuine stable-viewport size changes recalculate the geometry. Animation is suspended in List mode.

Open `horizontal.html` locally. It uses `horizontal.css`, `horizontal.js`, and the original shared styles and terminal animation. The RNA keeps its enlarged bases, translucent ribosome, centered tool information, and short sequence AUG → aRgus → G C → MfAP → A U → MAMMOTH → C G → SYS → UAA. Tool tiles and the abbreviated strand are interface symbols, not a literal biological coding sequence.

The original top remains unchanged apart from the previously requested title line spacing. The footer links to the main GitHub repository and the legal notice. The production main branch and its Pages configuration are unchanged.

The vertical comparison remains at https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/vertical/ with the same Explore / List names. Publishing uses only the preview branch of the separate preview repository.
