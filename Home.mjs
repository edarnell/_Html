import Html, { debug, error } from './Html.mjs'

class Home extends Html {
    constructor() {
        super()
    }
    html = (n) => {
        return n || '{home}'
    }
}
export default Home