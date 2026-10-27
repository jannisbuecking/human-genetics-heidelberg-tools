# Horizontal RNA preview

Open `horizontal.html` for the approved horizontal RNA version. It uses the original shared styles, assets, and terminal script. The tool content and destinations are preserved.

Test branch: `test/rna-horizontal`

Shareable website: https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/

The website is published separately from the `preview` branch of https://github.com/jannisbuecking/human-genetics-heidelberg-tools-rna-preview. The original repository’s `main` branch and GitHub Pages configuration remain unchanged.

The strand layout is AUG → aRgus → G C → MfAP → A U → MAMMOTH → C G → SYS → UAA. Full tool tiles replace base glyphs, so this abbreviated interface diagram is not a literal biological coding sequence. The ribosome is a simplified side-view schematic with https://www.rcsb.org/structure/9RU8 as anatomical reference.

## Mobile scrolling correction

The layout now measures the stable CSS small viewport (`100svh`) instead of using the toolbar-dependent `window.innerHeight` to choose between the horizontal scene and the stacked fallback. Toolbar-only resize events no longer rebuild the scene. Width changes, orientation changes, and real changes to the stable viewport still update the geometry. The fitting threshold reserves 200 pixels beyond the heading and measured card, allowing the horizontal scene to fit a normal phone with its toolbar expanded. Very short windows retain the accessible stacked layout. Genuine geometry updates preserve the position within or below the scene.

Viewport unit reference: https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/
