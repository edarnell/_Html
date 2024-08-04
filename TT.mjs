import { createPopper } from '@popperjs/core'
import { error, debug, dbg, nav } from './Html.mjs'

class TT {
    constructor(o, n, p) {
        Object.assign(this, { o, n, p })
        this.id = n.toLowerCase() + '_' + o.id
        o.tt = o.tt || {}
        if (o.tt[this.id]) {
            error({ TTe1: this })
        }
        else o.tt[this.id] = this
    }
    listen = (set = true) => {
        const lk = this.lk, l = this.el()
        if (!l) error({ TTe2: this })
        else if (lk && set) {
            if (lk.popup || lk.drag || lk.click || lk.nav || lk.submit || lk.close) {
                l.addEventListener("click", this.click)
            }
            else if (this.fm) l.addEventListener("input", this.input)
            if (lk.hover || lk.tip) {
                l.addEventListener("mouseenter", this.tooltip)
                l.addEventListener("mouseleave", this.remove)
            }
        }
        else if (lk && !set) {
            this.remove(null, true)
            this.lk = null
        }
    }
    ttremove = () => {
        if (this.tip) this.tip.destroy()
        if (this.tt) this.tt.remove()
        if (this.arrow) this.arrow.remove()
        if (this.timer) clearTimeout(this.timer)
        this.timer = this.tt = this.tip = this.arrow = null
    }
    remove = (e, listeners, click = true) => {
        this.ttremove()
        if (this.popup) this.popup.close()
        if (listeners) {
            const lk = this.lk, l = this.el()
            if (!l) error({ TTe3: this })
            else if (lk.hover || lk.tip) {
                l.removeEventListener("mouseenter", this.tooltip)
                l.removeEventListener("mouseleave", this.remove)
            }
            if (click && (lk.click || lk.popup || lk.nav || lk.submit || this.name === 'close')) l.removeEventListener("click", this.click)
            else if (this.fm) l.removeEventListener("input", this.input)
        }
    }
    el = () => {
        const l = document.querySelector(`#${this.id}`)
        return l
    }
    html = () => {
        const { n, p } = this,
            k = n.toLowerCase()
        var link = nav._link[k] || nav._popup[k]
        if (!link) error({ TTe4: this })
        else {
            if (k === 'x') {
                link = Object.assign({
                    class: 'close', tip: 'close', text: '×',
                    click: () => {
                        const o = this.o, close = o && o.close
                        if (typeof close === 'function') close()
                        else error({ close: this })
                    }
                }, link)
            }
            this.lk = link
            if (link.id) this.id = link.id, im = link.img || link._img
            const im = link.img || link._img, img_ = im && nav._img[im],
                img = img_ ? `<img id="${'img_' + this.id}" src="${img_}" class="${link.class || 'icon'}"/>` : ''
            let w = link.text ? link.text :
                link.img ? img
                    : p ? p.replace(/_/g, "&nbsp;") + img : img + n.replace(/_/g, "&nbsp;")
            if (link.img) w = `<img id="${'img_' + this.id}" height="${link.height}" width="${link.width}" src="${img_}" />`
            if (link.nav) {
                return `<a id="${this.id}" href="${link.href}">${w}</a>`
            }
            else if (link.href) {
                return `<a id="${this.id}" href="${link.href}" target="_blank" rel="noreferrer"  ${link.class ? `class="${link.class}"` : ''}>${w}</a>`
            }
            else return `<span id="${this.id}" class="${link.class || 'link'}">${w}</span>`
        }
        return "?"
    }
    click = (e) => {
        // debug({ click: this })
        const lk = this.lk
        if (lk) {
            e.preventDefault()
            if (this.tt) this.timer = setTimeout(this.ttremove, lk.tip === 'close' ? 100 : 1000)
            if (lk.nav) {
                nav.page(lk.nav)
            }
            else if (typeof lk.click === 'function') lk.click(e, this)
            else if (lk.click) {
                if (lk.click === 'submit') this.p.input(e, this)
                else if (this.p.click) this.p.click(e, this)
                else error({ TTclick: this, e })
            }
            else error({ TTclick: this, e })
        }
        else error({ TTclick: this, e })
    }
    tooltip = (e, m) => {
        dbg({ tooltip: this.id })
        this.ttremove()
        const tt = this.tt = document.createElement('div'),
            arrow = this.arrow = document.createElement('div'),
            link = this.lk,
            id = this.id
        tt.id = 'tip_' + id
        tt.classList.add('tooltip')
        arrow.classList.add('arrow')
        const html = m ?? (typeof link.tip === 'function' ? link.tip(e, this) : link.tip)
        tt.innerHTML = html
        tt.setAttribute('data-theme', link.theme || (link.tip ? 'dark' : 'light'))
        arrow.setAttribute('data-popper-arrow', true)
        tt.appendChild(arrow)
        document.body.appendChild(tt)
        this.tip = createPopper(this.el(), tt, {
            placement: link.placement || 'top',
            modifiers: [{ name: 'offset', options: { offset: [0, 8], }, },],
        })
        tt.setAttribute('data-show', '')
    }
}
export default TT