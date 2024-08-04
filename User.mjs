
 
import {debug} from './Html.mjs'
const u = localStorage.getItem('FL_U')
 var _user = u && JSON.parse(u)

 function register(e,o) {
    const f=o.p&&o.p.getForm()
    debug({f,o,e})
    // TODO - ajax call to register user
 }

 export {_user,register}