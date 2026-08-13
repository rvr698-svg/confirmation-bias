/** Dumps the three endings as JSON, so a preview cannot drift from the code. */
import { SIGNPOSTS } from '../src/config/signpost'
console.log(JSON.stringify(SIGNPOSTS, null, 1))
