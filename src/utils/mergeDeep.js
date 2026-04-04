/**
 * Глубокий merge: объекты рекурсивно, массивы из b заменяют a если b — массив.
 */
function mergeDeep(a, b) {
  if (b === undefined || b === null) return a;
  if (a === undefined || a === null) return b;
  if (Array.isArray(a) && Array.isArray(b)) return b;
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null && !Array.isArray(b)) {
    const out = { ...a };
    for (const k of Object.keys(b)) {
      out[k] = mergeDeep(a[k], b[k]);
    }
    return out;
  }
  return b;
}

module.exports = { mergeDeep };
