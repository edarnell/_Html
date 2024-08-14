import { createPopper } from '@popperjs/core'
import Html, { error, debug, dbg, nav } from './Html.mjs'
import TT from './TT.mjs'

class Popup extends TT {
    constructor(o, n, p) {
        super(o, n, p)
        this.id = 'popup_' + this.n + '_' + this.o.id
        const t = n.toLowerCase()
        this.lk = nav._popup[t]
        if (!this.lk) error({ Popup: this.id })
        o.popup = o.popup || {}
        if (o.popup[this.id]) {
            error({ PopE1: this })
        }
        else o.popup[this.id] = this
    }
    click = (e) => {
        debug({ click: this })
        const lk = this.lk
        if (lk) {
            e.preventDefault()
            if (this.tt) this.timer = setTimeout(this.ttremove, lk.tip === 'close' ? 100 : 1000)
            if (lk.popup || lk.drag) {
                if (this.pdiv) this.close()
                else this.popdiv(e)
                if (typeof lk.click === 'function') lk.click(e, this)
            }
            else error({ PopClick: this, e })
        }
        else error({ PopClick: this, e })
    }
    popdiv = (e) => {
        dbg({ popdiv: this.id })
        this.remove(null, true, false)
        const link = this.lk, pu = link.popup || link.drag,
            h = pu && nav._html[pu],
            p = this.pO = typeof pu === 'function' ? pu() : h && new Html(nav, pu)
        const popup = this.pdiv = document.createElement('div'),
            id = (link.popup ? 'popup_' : 'drag_') + (h ? pu : this.id)
        popup.classList.add(link.popup ? 'popup' : 'dragdiv')
        popup.id = id
        if (link.drag) popup.style.top = window.scrollY
        document.body.appendChild(popup)
        if (!p) error({ Popup: this, Objects: link.popup })
        else {
            p.id = h ? pu : id
            p.close = this.close
            p.render(p, h ? id : '')
            if (link.popup) {
                this.pop = createPopper(this.el(), popup, {
                    placement: link.placement || 'top',
                    strategy: link.strategy || 'absolute',
                    modifiers: [{ name: 'offset', options: { offset: [0, 8], }, },],
                })
            }
        }
    }
    close = (m, d) => {
        dbg({ close: this.id, m, d })
        if (this.pdiv) {
            if (this.pO) this.pO.unload(this.pO)
            if (this.pdiv) this.pdiv.remove()
            if (this.pop) this.pop.destroy()
            this.pO = this.pop = this.pdiv = null
            this.listen(true)
            if (d) this.p.checkData()
            if (m) this.tooltip(null, m)
        }
        if (this.tt) this.timer = setTimeout(this.ttremove, 2000)
    }
}
export default Popup