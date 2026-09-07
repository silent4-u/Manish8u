# Published materials

PDFs dropped in this folder ship with the app and appear on the Materials
screen for everyone who installs it. Files a candidate adds themselves are
never stored here — those stay in the browser's own storage on their device.

To publish one:

1. Stamp the PDF in the Content Desk so it carries your watermark. Anything
   distributed to students should be watermarked before it is filed.
2. Copy the stamped file into this folder. Keep the name lowercase, with
   hyphens rather than spaces, so the URL survives every device and server.
3. Add a matching entry to `CATALOGUE_ENTRIES` in `src/data/materials.ts`,
   naming the `paperId` — and, when the material covers one part of a paper,
   the `sectionId` — it belongs under. Paper and section ids are in
   `src/data/levels.ts`.
4. Run `npm run test:data`. It fails if the paper, the section or the file
   itself does not exist, so a broken entry cannot ship.

Only publish material you hold the rights to. The app carries a notice saying
it is not affiliated with or endorsed by the Public Service Commission, and
nothing filed here may imply otherwise.
