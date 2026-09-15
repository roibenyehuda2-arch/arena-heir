# Dwarf artwork production

Generated with the built-in image generation tool from the user-approved dwarf proof. Runtime assets:
- `dist/assets/crownlands/dwarf-arm-joints.webp`: transparent atlas, upper arm / cuffed forearm / gripping hand.
- `dist/assets/crownlands/dwarf-moon-helmet.webp`: transparent silver-blue Moonsteel helmet overlay.

Arm prompt: Three isolated equal-column parts matching the approved warm skin and hand-painted contour: rounded shoulder-to-elbow upper arm, elbow-to-cuff forearm, curled gripping hand without a baked-in weapon; transparent background, no labels or body.

Helmet prompt: Extract the approved compact silver-blue crescent helmet only, transparent face/eye openings, fitted skullcap, broad eye apertures, short noseguard and cheekguards, slight three-quarter orientation; no head, eyes, beard or other equipment.

Production conversion: ImageMagick resize to1024px atlas /512px helmet and WebP quality88, retaining alpha. Runtime crops each cell by alpha bounds; joint transforms handle movement and layering.
