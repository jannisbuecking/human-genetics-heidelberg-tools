# Vertical RNA preview — test website 2

Live website: https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/vertical/

Horizontal comparison: https://jannisbuecking.github.io/human-genetics-heidelberg-tools-rna-preview/

Source branch: `test/rna-vertical`. Open `vertical.html` locally. The second website uses ordinary vertical page scrolling, one single RNA backbone with all base attachments on the same side, and the same 16 interface positions as the horizontal version: AUG → aRgus → G C → MfAP → A U → MAMMOTH → C G → SYS → UAA. Each tool replaces a base tile; no duplicate letter is shown below a tool. The abbreviated interface layout is not a literal biological coding sequence.

The original header, hero, terminal animation, descriptions, logos, and tool destinations are retained. The large base tiles, centered tool content, original colors, translucent ribosome, and restrained strand movement follow the horizontal preview. Only the schematic ribosome is rotated; letters, logos, and text remain upright. The 2D ribosome artwork uses https://www.rcsb.org/structure/9RU8 as an anatomical reference, not as an exact atomic projection.

The background uses a sticky scene with stable `100svh` height. The sequence stays in natural document flow with no nested scroller, scroll interception, or height-dependent switch of layout. Mobile toolbar changes do not rebuild the sequence. Width changes and real element-size changes update the vector geometry. Reduced-motion settings produce a stationary straight strand.

Publishing adds only the `vertical/` directory to the separate preview repository. The horizontal website, original `main` branch, and production site remain unchanged.
