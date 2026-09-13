# Published materials

PDFs dropped in this folder ship with the app and appear on the Materials
screen for everyone who installs it. Files a candidate adds themselves are
never stored here — those stay in the browser's own storage on their device.

PDFs **and pictures** both work — a PDF, or a PNG, JPG or WebP photograph of a
page. A picture is drawn onto a canvas with the watermark already on it, so
what a reader sees is what a reader can save.

## Publishing, end to end

There is no server behind this app. A file a candidate adds from their own
device stays in that device's browser storage and reaches nobody else. For a
file of yours to reach every customer it has to be in the build, which means
these steps and a redeploy:

```bash
cp ~/my-notes.pdf public/materials/gk-18-my-notes.pdf   # 1. lowercase, hyphens
# 2. add a CATALOGUE_ENTRIES row in src/data/materials.ts
npm run stamp:materials                                  # 3. watermark it
npm run test:data                                        # 4. paper, section, file, size
npm run build                                             # 5. ship
```

Step 3 rewrites the file in place so the served bytes already carry the
CircularTriangle mark — there is then no unstamped original for anyone to
find. The untouched copy is kept in `materials-source/`, which is gitignored
and never shipped, so a re-stamp works from a clean file instead of stacking
marks. `npm run stamp:materials -- --check` fails if anything is unstamped,
which is what to run in CI.

The app stamps again when a reader saves a copy, for files that are not
already marked. Be clear-eyed about what that buys: it marks a copy as having
come from you. It does not stop anyone copying. A stamp can be cropped, and
an unstamped original can be fetched from its URL by anyone who knows it —
which is exactly why step 3 exists.

To publish one:

1. Stamp the PDF in the Content Desk so it carries your watermark. Anything
   distributed to students should be watermarked before it is filed.
2. Copy the stamped file into this folder. Keep the name lowercase, with
   hyphens rather than spaces, so the URL survives every device and server.
3. Add a matching entry to `CATALOGUE_ENTRIES` in `src/data/materials.ts`,
   naming the `paperId` — and, when the material covers one part of a paper,
   the `sectionId`, and when it answers one syllabus line, the `topicId` —
   it belongs under. A topic id is its section id, a `#`, and the topic's
   position in that section counting from 1: `kharidar-p1-a#2`. Paper and section ids are in
   `src/data/levels.ts`. When the file is one of a set meant to be read in
   sequence, number it with `order`; without that, files published on the same
   day fall into alphabetical order.
4. Run `npm run test:data`. It fails if the paper, the section or the file
   itself does not exist, so a broken entry cannot ship.

Only publish material you hold the rights to. The app carries a notice saying
it is not affiliated with or endorsed by the Public Service Commission, and
nothing filed here may imply otherwise.
