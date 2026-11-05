# BIO 106 Lab 5 Phylogeny

An accessible, buildless HTML adaptation of the supplied Lab 5 worksheet and prelab. Open `index.html` to review locally. Commit `index.html`, `styles.css`, `practice.css`, `lab.js`, and `assets/` to a repository for static hosting. No packages, backend, API keys, or student accounts are required. This project is prepared locally; it has not been published or tested inside the WSU Canvas course.

## Student experience

- The Caminalcules tab includes a vertical taxon palette, a mirrored tree with placement spaces next to the palette, hover/focus descriptions (Escape dismisses), and click/tap-to-select then click/tap-to-place assignment. Dragging is disabled for this explorer. The selected specimen description persists below the tree, including after placement; a separate feedback region discusses that placement. Keyboard selection uses Enter/Space. Three branching scaffolds and text descriptions remain available.
- Placement feedback considers outgroup consistency, candidate shared derived states, conflicting character patterns, incomplete sister clades, and single-swap parsimony comparisons for complete trees. It describes stronger/weaker evidence without grading. Research links are shown in the activity: [Stearns, Yale lecture 15](https://oyc.yale.edu/ecology-and-evolutionary-biology/eeb-122/lecture-15), [Lemke and Jensen 2012](https://www.ableweb.org/biologylabs/wp-content/uploads/volumes/vol-33/9_Lemke.pdf), and [Sokal 1983, abstract](https://academic.oup.com/sysbio/article-abstract/32/2/159/1680554). These support the method, not an exact published mapping of this worksheet's A–I labels. The five illustrative scores come from provisional observations of the supplied images; students' own definitions can differ. Written responses remain external; placements are temporary. Include `caminalcules.js` and `caminalcules.css` when publishing.
- Navigation below the banner becomes an accessible tab strip with one section visible at a time. Longer sections use Previous/Next pages to keep related content in manageable screen-sized groups. Left/Right arrows, Home, and End navigate tabs. Deep links such as `#read/2` open a specific page. Without JavaScript, all content remains available as a continuous document. Print includes all panels.
- Include `tabs.js` and `tabs.css` with the other assets when publishing. Expanded explanations, small screens, or zoom may require vertical scrolling; no fixed-height content clipping is used.
- Four lab parts with vocabulary, tree interpretation prompts, reference matrix layouts, NOVA instructions, source Caminalcule images and descriptions, external tree-construction instructions, and taxonomy practice.
- Students type every answer in a separate document and construct their matrices and tree externally. There are no input fields, textareas, selects, forms, upload controls, or editable page regions.
- An opening practice tree starts with five characteristics outside the tree. Students drag them to branch positions or use click/tap/keyboard selection. Immediate feedback explains whether the placement fits the observed taxa, including missing or extra descendants. Traits can be moved repeatedly, returned to the bank, or reset. Occupied positions return their previous trait to the bank.
- Practice placements exist only in page memory and disappear on reload. No student responses are persisted, exported, or submitted. There are no written-answer fields, localStorage, or backup/restore controls. Students save their external answer document and submit it through a separately configured Canvas assignment.
- JavaScript powers the practice placement feedback; other content and native details/summary explanations work without it. A no-script message provides an external practice route. Exit questions have no answer reveal. Include `practice.css` along with the other site assets when publishing.

## Publish with GitHub Pages

1. Review the source content and illustration permissions before distributing publicly. The original worksheet acknowledges adaptation by permission of Dr. Lisa Carloye, WSU; that statement does not establish public redistribution rights for every embedded illustration. The original Word documents have not been copied into this repository.
2. Create or select your GitHub repository and commit this folder. Do not include student responses or backups in Git.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select the branch containing these files and the root folder, then save. Use the published HTTPS URL after GitHub finishes deployment. Repository visibility and Pages availability depend on your GitHub plan and organization settings.
4. Open the published URL directly and verify all images, disclosures, matrix reference layouts, and external-answer instructions. The site uses relative asset links so a project subpath works. Do not rename `assets/` without updating references.

## Add to Canvas

Canvas's HTML editor uses an allowlist that excludes scripts and interactive form controls. **Do not paste the full application into a Canvas Page.** Host the complete application on HTTPS, then link to it or embed it.

Preferred simple path: add the deployed URL as a **Module → External URL** item and choose **Load in a new tab**. This gives students more screen space. The Canvas module requirement can track viewing; it does not verify that lab answers are complete.

For an embedded Page, open `canvas-entry.html`, replace **both** `YOUR_LAB_HTTPS_URL` placeholders with the actual HTTPS site URL, and paste the resulting fragment into the Canvas Page HTML editor. It includes a titled iframe and a direct-link alternative. Save and reopen the Page because Canvas sanitizes HTML on save. Institutional content security settings may prevent framing an external domain; use the External URL/new-tab option or consult your Canvas administrator. No LTI or gradebook integration is included.

Create a separate Canvas assignment accepting the externally authored answer document, matrices, tree drawing, and NOVA screenshots in the instructor's required formats. Set due dates, points, and accommodations in Canvas; none are invented here. Use Student View and a real supported student browser to validate access to the two course-file links. Those links are specific to course 1933617 and must be replaced when copying to another course.

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
- Replaced on-page response tasks with prompts for an external answer document. Students construct matrices and their tree externally and map branch characters using clade descendants. No unique Caminalcule topology is asserted or auto-graded.
- Redrew the A–G exit topology from the worksheet figure. The Word version uses positioned textboxes for node and trait labels; the online version assigns explicit node numbering and trait placements in both SVG and text. **Review this adapted labeling before using the exit responses for grading against an existing answer key.** The online questions refer to the online labels.
- Retained NOVA Missions 1 and 2 and completion evidence. The linked landing page was reachable; guest access, all mission interactions, and external accessibility were not certified. Included an access-barrier response and instructor-approved alternative pathway without falsely marking missions complete.
- Source artwork stays in `assets/`; only the referenced images are needed for the deployed lab. No broad copyright license is implied for supplied artwork.

## Accessibility and acceptance checks

Designed toward WCAG 2.2 AA: semantic landmarks, ordered headings, skip link, native details/summary disclosures, visible focus, high contrast, no animation, responsive layout, table headers/captions, SVG titles/descriptions and text alternatives, and text descriptions of specimens. This is a design target, not a compliance certification.

Before course release:

1. Navigate the full lab with Tab, Shift+Tab, Space, and Enter. Verify a screen reader announces matrix headers, tree descriptions, questions, and disclosures. Test at 200% and 400% zoom and narrow mobile widths.
2. Confirm that all written prompts instruct students to respond externally and that no input, textarea, select, form, or editable region exists. Test practice dragging, keyboard/touch selection, wrong and correct feedback, replacing occupied positions, returning a trait, reset, and reload. Disclosures work without JavaScript; the practice has a no-script alternative.
3. Confirm direct and embedded use in Canvas Student View and the new-tab fallback. Verify the course-file links and NOVA access with student permissions.
4. Run Canvas's accessibility checker on the entry Page and an automated accessibility audit on the hosted application, then perform manual assistive-technology testing. Canvas's Page checker does not establish accessibility of the external application.

For a local served preview, run `node preview.cjs` from this folder and open the printed loopback URL. Stop the server with Ctrl+C. `node --check lab.js` checks JavaScript syntax. No build step is needed.

Run `node --test tests/practice.test.cjs` for practice-event and static-content checks. These cover all 25 trait/position combinations, feedback, moving/displacing/returning traits, drag/drop events, reset, fresh load, absence of written-answer controls, and local link targets. They use a small DOM stand-in; real browser layout, touch behavior, keyboard traversal, screen-reader announcements, and Canvas embedding still require manual verification.
