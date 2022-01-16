import {ready} from "./async"

ready().then(() => {
	const servers = Array.from(document.querySelectorAll("[data-status-url]"))
	servers.forEach(server => {
		const url = new URL("/info", server.dataset.statusUrl)
		fetch(url.toString()).then(response => {
			response.text().then(info => {
				server.querySelector("[data-status-info]").textContent = info
				const json = JSON.parse(info)
				if (json.status === "healthy") {
					server.classList.add("healthy")
				}
				displayAge(server, json.startTime)
				setInterval(() => {
					displayAge(server, json.startTime)
				}, 1000)
			})
		})
	})
})

function displayAge(server, startTime) {
	const age = Math.floor((Date.now() - Date.parse(startTime)) / 1000)
	const rtf = new Intl.RelativeTimeFormat()
	const opt = getFormatOptions(age)
	server.querySelector("[data-status-age]")
		.textContent = rtf.format(-Math.floor(opt.value), opt.scale)
}

function getFormatOptions(age) {
	if (age > 86400) {
		return {value: age / 86400, scale: "day"}
	}
	if (age > 3600) {
		return {value: age / 3600, scale: "hour"}
	}
	if (age > 120) {
		return {value: age / 120, scale: "minute"}
	}
	return {value: age, scale: "second"}
}
