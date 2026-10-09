// Two small pieces that stand in for a framework.
//
// `html` is a tagged template that escapes every interpolated value unless it
// is already markup (the result of another `html` call). Arrays are joined.
// false, null and undefined render as nothing, so `${cond && html`…`}` works.
//
// `morph` updates the live DOM to match new markup in place instead of
// replacing it, so scroll positions, focus and running animations survive a
// re-render. Nodes are matched by position; a different tag or data-key means
// a new element (which is how a sheet gets its slide-up animation once).

class Markup {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = s => String(s).replace(/[&<>"']/g, c => ESC[c]);

function piece(v) {
  if (v === false || v === null || v === undefined) return '';
  if (v instanceof Markup) return v.s;
  if (Array.isArray(v)) return v.map(piece).join('');
  return escape(v);
}

export function html(strings, ...vals) {
  let out = strings[0];
  vals.forEach((v, i) => { out += piece(v) + strings[i + 1]; });
  return new Markup(out);
}

export function morph(root, markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = String(markup);
  patchChildren(root, tpl.content);
}

function sameNode(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) return false;
  if (a.nodeType !== 1) return true;
  return a.getAttribute('data-key') === b.getAttribute('data-key');
}

function patchChildren(live, next) {
  const have = Array.from(live.childNodes);
  const want = Array.from(next.childNodes);
  want.forEach((node, i) => {
    const old = have[i];
    if (!old) live.appendChild(node);
    else if (!sameNode(old, node)) live.replaceChild(node, old);
    else patch(old, node);
  });
  for (let i = want.length; i < have.length; i++) have[i].remove();
}

function patch(live, next) {
  if (live.nodeType !== 1) {
    if (live.nodeValue !== next.nodeValue) live.nodeValue = next.nodeValue;
    return;
  }
  for (const { name } of Array.from(live.attributes)) {
    if (!next.hasAttribute(name)) live.removeAttribute(name);
  }
  for (const { name, value } of Array.from(next.attributes)) {
    if (live.getAttribute(name) !== value) live.setAttribute(name, value);
  }
  // Form fields: the value attribute stops tracking once a user has typed,
  // so sync the property, but never under the user's cursor.
  if (live.nodeName === 'INPUT' || live.nodeName === 'TEXTAREA') {
    const value = live.nodeName === 'TEXTAREA' ? next.textContent : next.getAttribute('value') || '';
    if (live.value !== value && document.activeElement !== live) live.value = value;
    if (live.nodeName === 'TEXTAREA') return;
  }
  patchChildren(live, next);
}
