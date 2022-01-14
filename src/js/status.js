import {ready} from "./async"

ready().then(() => {
	const servers = Array.from(document.querySelectorAll("[data-status-url]"))
	servers.forEach(server => {
		const url = new URL("/info", server.dataset.statusUrl)
		fetch(url.toString()).then(response => {
			response.json().then(info => {
				server.querySelector("[data-status-info]").textContent = JSON.stringify(info)
				if (info.status === "healthy") {
					server.classList.add("healthy")
				}
			})
		})
	})
})
