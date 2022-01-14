import "../css/main.css"
import {ready} from "./async"
import initMenu from "./menu"

ready().then(() => {
	initMenu()
})
