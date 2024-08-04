import { nav, error, debug, dbg } from './Html.mjs'
import TT from './TT.mjs'

class IN extends TT {
    constructor(o, n, p) {
        super(o, n, p)
        this.id = 'IN_' + this.n + '_' + this.o.id
        const t = n.toLowerCase()
        this.lk = nav._form[t]
        if (!this.lk) error({ IN: this.id })
        else (o._form || (o._form = {}))[t] = this
    }
    html = () => {
        const { lk, n, p } = this
        if (lk.radio) {
            return `<input type="radio"
            name="${lk.radio}"
            value="${n}"
            id="${this.id}"
            ${lk.required ? 'required' : ''}
            ${lk.value ? `value="${lk.value}"` : ''}
            />
            ${lk.label ? `<label for="${this.id}">${lk.label}</label>` : ''}`
        }
        else if (lk.options) {
            return `<select class="${lk.class || 'form'}" 
            name="${n}"
            id="${this.id}">
            ${lk.options.map(o => typeof o === 'string' ? `<option value="${o}" ${o === lk.value ? 'selected' : ''}>${o}</option>`
                : `<option value="${o.value}" ${o.value === lk.value ? 'selected' : ''}>${o.n}</option>`).join('')}
            </select>`
        }
        else if (lk.rows || lk.cols) {
            return `<textarea rows="${lk.rows || 5}" cols="${lk.cols || 25}" class="${lk.class || 'form'}" 
            name="${n}"
            id="${this.id}"
            ${lk.placeholder ? `placeholder="${lk.placeholder}"` : ''}
            ${lk.required ? 'required' : ''}
            >${lk.value || ''}</textarea>`
        }
        else if (lk.checked !== undefined) {
            return `<input type="checkbox" class="${lk.class ? 'checkbox ' + lk.class : 'checkbox'}"
            ${lk.checked ? 'checked' : ''}
            name="${n}"
            id="${this.id}"
            ${lk.required ? 'required' : ''}
            />
            ${lk.label ? `<label for="${this.id}" class="${lk.class || 'form'}">${lk.label}</label>` : ''}`
        }
        else if (lk.button || lk.submit) {
            const img_ = lk.img && nav._img[lk.img], active = lk.class && lk.class.includes('active'),
                img = img_ && `<img name="${n}" data-image="${lk.icon}" src="${img_}" class="${lk.class || 'icon'}" />`
            return img || `<button 
            type="${lk.type || 'button'}"
            name="${n}" 
            id="${this.id}"
            class="${lk.class || 'form'}">${p || n}</button>`
        }
        else if (lk.type) {
            return `${lk.label ? `<label for="${this.id}">${lk.label}</label>` : ''}
            <input
            type="${lk.type}"
            name="${n}"
            id="${this.id}"
            ${lk.placeholder ? `placeholder="${lk.placeholder}"` : ''}
            ${lk.size ? `size="${lk.size}"` : ''}
            ${lk.pattern ? `pattern="${lk.pattern}"` : ''}
            ${lk.required ? 'required' : ''}
            ${lk.value ? `value="${lk.value}"` : ''}
            class="${lk.class || 'form'}" 
            />`
        }
        else {
            error({ IN: this })
            return `<r>{${n}}</r>`
        }
    }
    input = e => {
        e.preventDefault()
        const ipt = this.p._p('input')
        if (ipt) ipt(e, this)
    }
}
export default IN