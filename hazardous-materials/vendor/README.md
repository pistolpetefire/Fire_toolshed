# Browser dependencies

Vendored from the official npm package tarballs, with no runtime CDN dependency:

- `pdfjs-dist` 6.5.438: `build/pdf.min.mjs` and `build/pdf.worker.min.mjs`; Apache-2.0, see PDFJS-LICENSE. PDF.js extracts existing PDF text; OCR is not included.
- `fflate` 0.8.3: `esm/browser.js` renamed `fflate.mjs`; MIT, see FFLATE-LICENSE. ZIP intake is streamed; archive export is memory-bound and limited in the interface.

The owner workbook uses the repository's existing `shared/xlsx.full.min.js`.
