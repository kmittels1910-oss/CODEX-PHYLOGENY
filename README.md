# BIO 106 Lab 5 Phylogeny

An accessible, buildless HTML adaptation of the supplied Lab 5 worksheet and prelab. Open `index.html` to review locally. Commit `index.html`, `styles.css`, `lab.js`, and `assets/` to a repository for static hosting. No packages, backend, API keys, or student accounts are required. This project is prepared locally; it has not been published or tested inside the WSU Canvas course.

## Student experience

- Four lab parts, with vocabulary, tree interpretation checks, a scored vertebrate character matrix, NOVA instructions, source Caminalcule images and descriptions, an editable character matrix, a keyboard-operated sister-clade builder, and taxonomy checks.
- Exit responses have no automatic answer reveal. Practice answer logic is client-side and visible in the source; this is not a secure assessment system.
- Responses save in localStorage when available. Downloads provide a readable TXT response record and an editable JSON backup. Printing expands supporting descriptions and renders full textarea responses.
- Nothing sends grades, screenshots, names, or responses to Canvas. Students must upload their files to a separately configured Canvas assignment. Browser storage is per origin/device and may be blocked in embedded contexts, cleared, or unavailable in private browsing. Recommend opening in a new tab and downloading regularly.

## Publish with GitHub Pages

1. Review the source content and illustration permissions before distributing publicly. The original worksheet acknowledges adaptation by permission of Dr. Lisa Carloye, WSU; that statement does not establish public redistribution rights for every embedded illustration. The original Word documents have not been copied into this repository.
2. Create or select your GitHub repository and commit this folder. Do not include student responses or backups in Git.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select the branch containing these files and the root folder, then save. Use the published HTTPS URL after GitHub finishes deployment. Repository visibility and Pages availability depend on your GitHub plan and organization settings.
4. Open the published URL directly and verify all images, checks, matrix, tree builder, exports, and restore. The site uses relative asset links so a project subpath works. Do not rename `assets/` without updating references.

## Add to Canvas

Canvas's HTML editor uses an allowlist that excludes scripts and interactive form controls. **Do not paste the full application into a Canvas Page.** Host the complete application on HTTPS, then link to it or embed it.

Preferred simple path: add the deployed URL as a **Module → External URL** item and choose **Load in a new tab**. This avoids a cramped nested frame and many embedded storage/download restrictions. The Canvas module requirement can track viewing; it does not verify that lab answers are complete.

For an embedded Page, open `canvas-entry.html`, replace **both** `YOUR_LAB_HTTPS_URL` placeholders with the actual HTTPS site URL, and paste the resulting fragment into the Canvas Page HTML editor. It includes a titled iframe and a direct-link alternative. Save and reopen the Page because Canvas sanitizes HTML on save. Institutional content security settings may prevent framing an external domain; use the External URL/new-tab option or consult your Canvas administrator. No LTI or gradebook integration is included.

Create a separate Canvas assignment accepting the response TXT (or PDF) plus NOVA screenshots and any instructor-required tree drawing. Set due dates, points, and accommodations in Canvas; none are invented here. Use Student View and a real supported student browser to validate access to the two course-file links. Those links are specific to course 1933617 and must be replaced when copying to another course.

Official references (reviewed November 4, 2026):

- [Canvas HTML Editor Allowlist](https://community.instructure.com/en/kb/articles/387066-canvas-html-editor-allowlist)
- [Add an external URL as a module item](https://community.instructure.com/en/kb/articles/660907-how-do-i-add-an-external-url-as-a-module-item)
- [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [NOVA Evolution Lab](https://www.pbs.org/wgbh/nova/labs/lab/evolution/)

## Source adaptation and instructor review

Sources read: `Lab 5. Phylogeny.docx` and `Lab 5 Phylogeny Prelab blurb.docx` supplied from the user's Downloads folder, plus the course description supplied in chat. Activities in the documents were treated as curricular material, not as instructions to operate external accounts or submit work.

- Standardized inconsistent “Lab 6” headings as Lab 5. Preserved objectives and four-part progression. Did not invent assignment point values from the inconsistent exit-question section.
- Corrected the definition of clade; clarified that all taxa share ancestry, that state polarity is relative, that outgroups are not living ancestors, and that reversal can produce ancestral-looking states. The simplified vertebrate example is a teaching dataset, not a complete modern vertebrate phylogeny.
- Used six Caminalcules actually embedded in the document: A (outgroup), I, G, F, E, D. The worksheet's separate specimen document was not supplied, but these images were available in the lab itself. Text descriptions should receive instructor review for any course-specific character definitions. Uncertain observations can be scored `?`.
- Replaced drag-and-drop tasks with native selection controls and paired-clade construction. Students map branch characters in text using clade descendants. No unique Caminalcule topology is asserted or auto-graded.
- Redrew the A–G exit topology from the worksheet figure. The Word version uses positioned textboxes for node and trait labels; the online version assigns explicit node numbering and trait placements in both SVG and text. **Review this adapted labeling before using the exit responses for grading against an existing answer key.** The online questions refer to the online labels.
- Retained NOVA Missions 1 and 2 and completion evidence. The linked landing page was reachable; guest access, all mission interactions, and external accessibility were not certified. Included an access-barrier response and instructor-approved alternative pathway without falsely marking missions complete.
- Source artwork stays in `assets/`; only the referenced images are needed for the deployed lab. No broad copyright license is implied for supplied artwork.

## Accessibility and acceptance checks

Designed toward WCAG 2.2 AA: semantic landmarks, ordered headings, skip link, explicit labels, native radios/selects/buttons, large controls, visible focus, high contrast, no animation, responsive layout, table headers/captions, SVG titles/descriptions and text alternatives, non-color feedback, text descriptions of specimens, and no drag-only tasks. This is a design target, not a compliance certification.

Before course release:

1. Navigate the full lab with Tab, Shift+Tab, Space, Enter, and arrow keys. Verify a screen reader announces matrix labels, choices, tree text, and feedback. Test at 200% and 400% zoom and narrow mobile widths.
2. Fill and check practice answers, including blank and wrong matrix cells. Join clades, enforce outgroup placement, undo, reload, export, restore, print, and clear responses.
3. Confirm direct and embedded use in Canvas Student View, including disabled third-party storage, downloads, and new-tab fallback. Verify the course-file links and NOVA access with student permissions.
4. Run Canvas's accessibility checker on the entry Page and an automated accessibility audit on the hosted application, then perform manual assistive-technology testing. Canvas's Page checker does not establish accessibility of the external application.

For a local served preview, run `node preview.cjs` from this folder and open the printed loopback URL. Stop the server with Ctrl+C. `node --check lab.js` checks JavaScript syntax. No build step is needed.
