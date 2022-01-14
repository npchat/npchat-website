import esbuild from "esbuild"
import colors from "colors"

const buildPromises = []

const mainBuild = esbuild.build({
	entryPoints: ["./src/js/index.js"],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: "./dist/index.js",
}).catch(() => process.exit(1))
buildPromises.push(mainBuild)

const statusBuild = esbuild.build({
	entryPoints: ["./src/js/status.js"],
	bundle: true,
	minify: !isDev(),
	watch: watch(),
	outfile: "./dist/status.js",
}).catch(() => process.exit(1))
buildPromises.push(statusBuild)

Promise.all(buildPromises).then(() => log("done"))

function watch() {
	if (isDev()) {
		return {
			onRebuild(e) {
				if (e) {
					error("watch build failed", e)
				} else {
					log("watch build succeeded")
				}
			}
		}
	}
	return false
}

function isDev() {
	return process.argv.indexOf("--dev") >= 0
}

function log(message) {
	console.log(colors.magenta("ESBuild:"), message)
}
function error(message, error) {
	console.error(colors.magenta("ESBuild:"), message, error)
}
