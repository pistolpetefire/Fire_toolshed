import { publishEgressHandoff } from './atrium-pages.mjs'

window.__atriumOnEgress = function (handoff) {
  try {
    publishEgressHandoff(handoff)
  } catch (_) {
    /* the atrium file is optional for a standalone egress session */
  }
}
window.dispatchEvent(new Event('atrium-egress-ready'))
