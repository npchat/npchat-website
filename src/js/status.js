import {ready} from "./async"

ready().then(() => {
	const services = Array.from(document.querySelectorAll("[data-service-url]"))
	services.forEach(service => {
		const url = new URL("/info", service.dataset.serviceUrl)
		fetch(url.toString()).then(response => {
			response.text().then(info => {
				service.querySelector("[data-service-info]").textContent = info
				const json = JSON.parse(info)
				if (json.status === "healthy") {
					service.classList.add("healthy")
				}
				displayAge(service, json.startTime)
				setInterval(() => {
					displayAge(service, json.startTime)
				}, 1000)
			})
		})
	})
})

function displayAge(service, startTime) {
	const age = Math.floor((Date.now() - Date.parse(startTime)) / 1000)
	const rtf = new Intl.RelativeTimeFormat()
	const opt = getFormatOptions(age)
	service.querySelector("[data-service-age]")
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
