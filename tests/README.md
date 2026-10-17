# tests/

Automated tests for Fire Toolshed builds. Node 20+ built-in runner, Python 3 and Google Chrome (headless); no npm install.

```bash
node --test tests/          # all suites
node --test tests/deflagration-vent.test.mjs
```

Each suite starts its own static server on the repo root, so nothing else needs to be running. Browser checks load the
app pages in headless Chrome (`--dump-dom`) and read what the page shows; engine checks call the app's calculation file
directly and compare with independent Python hand calcs (`validation/verify/*.py`, `tests/py/*.py`).
