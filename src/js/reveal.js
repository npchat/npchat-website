const options = {
	threshold: .75
}

export default function initReveal() {
	const observer = new IntersectionObserver(observerCallback, options)
	const things = Array.from(document.querySelectorAll(".reveal"))
	things.forEach(thing => observer.observe(thing))
}

function observerCallback(entries) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add("active")
		} else {
			entry.target.classList.remove("active")
		}
	})
}
