import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Viewer from '../components/viewer'

// Types
import { Annotation } from '../types/annotation'

// Initial default template for new annotation data
const defaultAnnotation: Annotation = {
	header: {
		schemaVersion: '2.0',
		timestamp: Date.now(),
	},
	layers: [
		{
			id: 'Layer 1',
			features: [],
		},
	],
	classes: [
		{
			id: 0,
			name: 'Default class',
			style: {
				stroke: {
					color: [51, 153, 204, 1],
					width: 1.25,
				},
				fill: {
					color: [255, 255, 255, 0.4],
				},
			},
		},
	],
}

const defaultDataHost = `http://${window.location.hostname}:8000/data`
const IIIFHost = `http://${window.location.hostname}:8182/iiif/2`

const AIDA = () => {
	const router = useRouter()
	const { asPath, query } = router

	const [imageUrl, setImageUrl] = useState('')
	const [imageName, setImageName] = useState('')
	const [imageExt, setImageExt] = useState('dzi')
	const [tilesUrl, setTilesUrl] = useState('')

	const [annotationData, setAnnotationData] = useState(defaultAnnotation)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setImageName(
			query.aida ? query.aida[query.aida.length - 1] : 'Image not found'
		)
	}, [query, router.isReady])

	useEffect(() => {
		;(async () => {
			if (router.isReady) {
				// We assume if the path ends in .json then we are loading an AIDA
				// project which specific image and annotation path as object properties.
				if (asPath.endsWith('.json')) {
					const projectResponse = await fetch(`${defaultDataHost}${asPath}`)

					if (projectResponse.ok) {
						const projectResponseJson = await projectResponse.json()

						// Extract image
						if (
							projectResponseJson.image.endsWith('.tiff') ||
							projectResponseJson.image.endsWith('.tif')
						) {
							setImageUrl(`${IIIFHost}/${projectResponseJson.image}`)
						} else {
							setImageUrl(`${defaultDataHost}/${projectResponseJson.image}`)
						}

						setImageExt(projectResponseJson.image.split('.')[1])

						// Extract tiles
						setTilesUrl(`${defaultDataHost}/${projectResponseJson.tiles}`)

					}
				}
				setIsLoading(false)
			}
		})()
	}, [asPath, router.isReady])

	return (
		<>
			<Head>
				<title>{`${imageName} - AIDA 3D`}</title>
			</Head>
			{!isLoading && (
				<Viewer
					imageUrl={imageUrl}
					tilesUrl={tilesUrl}
					annotationData={annotationData}
					imageExt={imageExt}
				/>
			)}
		</>
	)
}

export default AIDA
