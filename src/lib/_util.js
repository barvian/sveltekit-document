/**
 * @param {Record<string, string>[]} list
 * @param {string[]} [filter] If passed, only merges specific attrs
 */
export const mergeAttributes = (list, filter) => list.reduce((all, attrs) => {
    Object.entries(attrs).forEach(([attr, val]) => {
        if (attr === 'data-ska-element') return
        if (filter && !filter.includes(attr)) return
        if (attr === 'class' && all[attr]) {
            all[attr] += ' ' + val
        } else if (attr === 'style' && all[attr]) {
            all[attr] += (all[attr].trim().endsWith(';') ? '' : ';') + val
        } else {
            all[attr] = val
        }
    })
    return all
}, {})