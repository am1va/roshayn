# ROSHAYN project notes

## Account rename — 2026-10-07

- The owner renamed the GitHub account from robertpelo23 to am1va. Current repository: https://github.com/am1va/roshayn . Website: https://am1va.github.io/roshayn/ . The local Git origin and website canonical link use this account.
- GitHub Pages deploys site/ through the included Actions workflow. Asset references are relative and support the /roshayn/ repository path.
- Verified the new public address in Microsoft Edge: 20 desktop and 22 mobile checks passed, including all 100 product photos, pagination, search, filtering, favorites, product details/zoom, cart quantities, voucher calculations, and simulated checkout. Desktop/mobile screenshots were visually inspected.
- Verified the updated release on the actual localhost server: 106 runtime responses matched the release manifest; 20 desktop and 22 mobile browser checks passed with zero failures. Private verification artifacts and backups stay in the owner's development workspace.
- This remains a front-end portfolio demo with illustrative products and simulated orders. Real payments, inventory, and shipping are not implemented. Photography attribution is in ASSET-SOURCES.md.
- Cart and favorites use browser localStorage and are separate for each website origin; the account rename does not automatically migrate old-origin browser data. Normal browser data and app-managed chat history are stored by their applications, outside the project files.
- Verification covers Edge on the owner's machine. These checks do not establish support for every browser.

## Homepage carousel and hover update - 2026-10-07

- User approved the revised banner and requested publishing. The product spotlight rotates through the 100 saved catalog items every second with a 460 ms pop transition and matching photo, name, price and product-details action.
- Side arrows and five compact navigation dots replace the earlier text controls. Dots select the current group of five consecutive products; both arrows wrap through the full catalog. Hover, focus, open dialogs, hidden tabs and an offscreen hero suspend rotation. Reduced-motion preferences disable autoplay/animation while preserving manual navigation.
- Category tiles and arrows show purple hover/focus feedback. Tiles lift 2 px and arrows scale to 1.06; movement is disabled under reduced-motion preferences.
- Release references: app.js?v=6, style.css?v=9, hero-showcase.js?v=2, brand SVGs?v=5. The separate spotlight script runs after the shared catalog/app script. Relative asset references support the /roshayn/ Pages path.
- Exact prepared release was verified on the actual localhost /roshayn/ path: all 107 runtime responses and connected repository files matched SHA-256 hashes; 36 desktop and 38 mobile checks passed with zero failures. This includes all 100 photos, full spotlight cycle, arrows/dots, cadence, matching product details, and shopping regression behavior. Additional source checks covered responsive widths and purple hover/focus interactions.
- Private backups, browser profiles, scripts, screenshots and verification reports remain in the development workspace. Only the website source and public documentation are uploaded. Photography/brand sources remain unchanged; see ASSET-SOURCES.md.
- Validation covers Edge on this machine with emulated phone/tablet layouts, not physical device testing. The shop remains a portfolio demo with illustrative products and simulated checkout.
