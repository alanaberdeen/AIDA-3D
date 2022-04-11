import Viewer from '../components/viewer'
import Head from 'next/head'

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

const Demo = () => {
	// Demo uses example image from S3 bucket

	const imageUrl =
		'https://storage.googleapis.com/gtl-study-1ase6a/images/qpkecO/dz/qpkecO.dzi'

	const tilesUrl = `https://storage.googleapis.com/gtl-study-1ase6a/images/qpkecO/3d/tiles`

	return (
		<>
			<Head>
				<title>Demo - AIDA 3D</title>
			</Head>
			<Viewer
				imageUrl={imageUrl}
				tilesUrl={tilesUrl}
				imageExt={'dzi'}
				annotationData={defaultAnnotation}
			/>
		</>
	)
}

export default Demo
