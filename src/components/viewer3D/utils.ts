import { WebGLRenderer } from 'three'

export const padToTwo = (number: number) => {
	let result
	if (number <= 99) {
		result = `0${number}`.slice(-2)
	}
	return result
}

export const resizeRendererToDisplaySize = (renderer: WebGLRenderer) => {
	const canvas = renderer.domElement
	const pixelRatio = window.devicePixelRatio
	const width = (canvas.clientWidth * pixelRatio) | 0
	const height = (canvas.clientHeight * pixelRatio) | 0
	const needResize = canvas.width !== width || canvas.height !== height
	if (needResize) {
		renderer.setSize(width, height, false)
	}
	return needResize
}
