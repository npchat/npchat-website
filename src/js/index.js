import "../css/main.css"
import {ready} from "./async"
import initMenu from "./menu"
import initReveal from "./reveal"

ready().then(() => {
	initMenu()
	initReveal()
})
