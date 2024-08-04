import {nav} from "./Html.mjs"
const _user=nav._user, token = _user && _user.token
function ajax(req) // token used when state not yet set
{
    return new Promise((s, f) => {
        let ok
        fetch('/ajax', params(req)).then(res => {
            ok = res.ok
            return res.json()
        }).then(r => {
            if (ok) s(r)
            else if (r.reload) {
                const now = new Date()
                if (!token.ts || now.getTime() - new Date(token.ts).getTime() > 60000) location.reload(true)
                else f(r)
            }
            else f(r)
        }).catch(e => f(e))
    })
}
function params(data) {
    const ret = {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            token:JSON.stringify(token)
        },
        method: 'post',
        cache: 'no-cache',
        body: JSON.stringify(data)
    }
    return ret
}

export { ajax }
