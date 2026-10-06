# ROSHAYN project notes

## Account rename — 2026-10-07

- The owner renamed the GitHub account from robertpelo23 to am1va. Current repository: https://github.com/am1va/roshayn . Website: https://am1va.github.io/roshayn/ . The local Git origin and website canonical link use this account.
- GitHub Pages deploys site/ through the included Actions workflow. Asset references are relative and support the /roshayn/ repository path.
- Verified the new public address in Microsoft Edge: 20 desktop and 22 mobile checks passed, including all 100 product photos, pagination, search, filtering, favorites, product details/zoom, cart quantities, voucher calculations, and simulated checkout. Desktop/mobile screenshots were visually inspected.
- Verified the updated release on the actual localhost server: 106 runtime responses matched the release manifest; 20 desktop and 22 mobile browser checks passed with zero failures. Private verification artifacts and backups stay in the owner's development workspace.
- This remains a front-end portfolio demo with illustrative products and simulated orders. Real payments, inventory, and shipping are not implemented. Photography attribution is in ASSET-SOURCES.md.
- Cart and favorites use browser localStorage and are separate for each website origin; the account rename does not automatically migrate old-origin browser data. Normal browser data and app-managed chat history are stored by their applications, outside the project files.
- Verification covers Edge on the owner's machine. These checks do not establish support for every browser.
