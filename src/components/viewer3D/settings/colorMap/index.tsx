import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Listbox, Transition, Switch } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Camera, Scene, WebGLRenderer, Group } from 'three'
import * as d3 from 'd3'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

function normalize(min: number, max: number) {
	const delta = max - min
	return (val: number) => (val - min) / delta
}

const allFeatures = [
	{ name: 'Segmentation confidence', value: 'segmentationConfidence' },
	{ name: 'Diameter', value: 'nucleusDiameters' },
	{ name: 'Volume', value: 'nucleusVolumes' },
	{ name: 'Elongation', value: 'elongations' },
	{ name: 'Epithelial Scores', value: 'epithelialScores' },
	{ name: 'Mesenchymal Score', value: 'mesenchymalScores' },
	{ name: 'Irregularity Score', value: 'nucleusIrregularityScores' },
	{ name: 'gH2AX', value: 'is_gH2AX' },
	{ name: 'CD8', value: 'is_CD8' },
]

// https://github.com/d3/d3-scale-chromatic
const colorScales = [
	{
		name: 'Brown to teal-green',
		value: 'interpolateBrBG',
	},
	{
		name: 'Purple to green',
		value: 'interpolatePRGn',
	},
	{
		name: 'Red to blue',
		value: 'interpolateRdBu',
	},
	{
		name: 'Spectral',
		value: 'interpolateSpectral',
	},
	{
		name: 'Blues',
		value: 'interpolateBlues',
	},
	{
		name: 'Greens',
		value: 'interpolateGreens',
	},
	{
		name: 'Reds',
		value: 'interpolateReds',
	},
	{
		name: 'Greys',
		value: 'interpolateGreys',
	},
	{
		name: 'Purples',
		value: 'interpolatePurples',
	},
	{
		name: 'Oranges',
		value: 'interpolateOranges',
	},
]

const ColorMap = (props: {
	content: Group
	renderer: WebGLRenderer
	scene: Scene
	camera: Camera
}) => {
	const { content, scene, camera, renderer, featureData } = props

	const [colorScale, setColorScale] = useState(colorScales[4])
	const [featureMap, setFeatureMap] = useState(allFeatures[0])
	const [features, setFeatures] = useState(allFeatures)
	const [normalise, setNormalise] = useState(true)
	const [min, setMin] = useState(0)
	const [max, setMax] = useState(1)
	const [colorMaps, setColorMaps] = useState([])

	// When new tile is chosen featureData will update. We need to check which
	// features are available in the new tile.
	useEffect(() => {
		if (featureData) {
			const featureSubset = allFeatures.filter((f) =>
				Object.keys(featureData).includes(f.value)
			)
			setFeatures(featureSubset)
			setFeatureMap(featureSubset[0])
		}
	}, [featureData])

	// Color maps
	useEffect(() => {
		if (featureData && content) {
			const chosenMap = featureData[featureMap.value]

			const mapMax = Math.max(...chosenMap)
			const mapMin = Math.min(...chosenMap)

			let normalizedSegmentationConfidence
			if (normalise) {
				normalizedSegmentationConfidence = chosenMap.map(
					normalize(mapMin, mapMax)
				)
				setMax(mapMax)
				setMin(mapMin)
			} else {
				normalizedSegmentationConfidence = chosenMap
				setMax(1)
				setMin(0)
			}

			content.children.forEach((child, index) => {
				if (child.isMesh && child.name.includes('nucleus')) {
					const nucleus = child
					const newMaterial = nucleus.material.clone()
					newMaterial.color.setStyle(
						d3[colorScale.value](normalizedSegmentationConfidence[index])
					)
					nucleus.material = newMaterial
				}
			})

			renderer.render(scene, camera)
		}
	}, [
		content,
		renderer,
		scene,
		camera,
		featureMap,
		normalise,
		colorScale,
		featureData,
	])

	return (
		<Disclosure className="shadow-sm" as="div">
			{({ open }) => (
				<>
					<Disclosure.Button
						className={classNames(
							'text-gray-700 hover:bg-gray-50 hover:text-gray-900 bg-white group w-full flex items-center pr-2 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 relative z-10 ring-inset'
						)}
					>
						<svg
							className={classNames(
								open ? 'text-gray-400 rotate-90' : 'text-gray-300',
								'mr-2 shrink-0 h-5 w-5 group-hover:text-gray-400 transition-colors ease-in-out duration-150'
							)}
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
						</svg>
						Color Map
					</Disclosure.Button>
					<Disclosure.Panel className="relative px-4 py-2 w-48">
						{/* Change feature map */}
						<Listbox value={featureMap} onChange={setFeatureMap}>
							{({ open }) => (
								<>
									<Listbox.Label className="block text-sm font-medium text-gray-700">
										Feature
									</Listbox.Label>
									<div className="mt-1 relative">
										<Listbox.Button className="relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
											<span className="block truncate">{featureMap.name}</span>
											<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
												<SelectorIcon
													className="h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
											</span>
										</Listbox.Button>

										<Transition
											show={open}
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
										>
											<Listbox.Options
												static
												className="mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
											>
												{features.map((setting) => (
													<Listbox.Option
														key={setting.value}
														className={({ active }) =>
															classNames(
																active
																	? 'text-white bg-teal-600'
																	: 'text-gray-900',
																'cursor-default select-none relative py-2 pl-3 pr-9'
															)
														}
														value={setting}
													>
														{({ selected, active }) => (
															<>
																<span
																	className={classNames(
																		selected ? 'font-semibold' : 'font-normal',
																		'block truncate'
																	)}
																>
																	{setting.name}
																</span>

																{selected ? (
																	<span
																		className={classNames(
																			active ? 'text-white' : 'text-teal-600',
																			'absolute inset-y-0 right-0 flex items-center pr-4'
																		)}
																	>
																		<CheckIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																	</span>
																) : null}
															</>
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Transition>
									</div>
								</>
							)}
						</Listbox>

						{/* Change D3 color scale */}
						<Listbox value={colorScale} onChange={setColorScale}>
							{({ open }) => (
								<>
									<Listbox.Label className="block text-sm font-medium text-gray-700 mt-4">
										Color Scale
									</Listbox.Label>
									<div className="mt-1 relative">
										<Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
											<span className="block truncate">{colorScale.name}</span>
											<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
												<SelectorIcon
													className="h-5 w-5 text-gray-400"
													aria-hidden="true"
												/>
											</span>
										</Listbox.Button>

										<Transition
											show={open}
											as={Fragment}
											leave="transition ease-in duration-100"
											leaveFrom="opacity-100"
											leaveTo="opacity-0"
										>
											<Listbox.Options
												static
												className="mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
											>
												{colorScales.map((scale) => (
													<Listbox.Option
														key={scale.value}
														className={({ active }) =>
															classNames(
																active
																	? 'text-white bg-teal-600'
																	: 'text-gray-900',
																'cursor-default select-none relative py-2 pl-3 pr-9'
															)
														}
														value={scale}
													>
														{({ selected, active }) => (
															<>
																<span
																	className={classNames(
																		selected ? 'font-semibold' : 'font-normal',
																		'block truncate'
																	)}
																>
																	{scale.name}
																</span>

																{selected ? (
																	<span
																		className={classNames(
																			active ? 'text-white' : 'text-teal-600',
																			'absolute inset-y-0 right-0 flex items-center pr-4'
																		)}
																	>
																		<CheckIcon
																			className="h-5 w-5"
																			aria-hidden="true"
																		/>
																	</span>
																) : null}
															</>
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Transition>
									</div>
								</>
							)}
						</Listbox>

						{/* Visualise current color map */}
						<div
							className="width-full h-4 mt-2 rounded"
							style={{
								background: `linear-gradient(to right, ${d3[colorScale.value](
									0.1
								)}, ${d3[colorScale.value](0.2)}, ${d3[colorScale.value](
									0.3
								)}, ${d3[colorScale.value](0.4)}, ${d3[colorScale.value](
									0.5
								)}, ${d3[colorScale.value](0.6)},${d3[colorScale.value](
									0.7
								)}, ${d3[colorScale.value](0.8)}, ${d3[colorScale.value](
									0.9
								)},${d3[colorScale.value](1)})`,
							}}
						/>
						<div className="flex justify-between text-sm text-gray-700">
							<div>{min.toFixed(2)}</div>
							<div>{max.toFixed(2)}</div>
						</div>

						{/* Normalise colour map, between max-min values. */}
						<Switch.Group as="div" className="flex items-center mt-4">
							<Switch.Label
								as="span"
								className="flex-grow flex flex-col pr-2"
								passive
							>
								<span className="text-sm font-medium text-gray-900">
									Normalise
								</span>
								<span className="text-xs text-gray-500">
									Restrict color range to min-max feature values
								</span>
							</Switch.Label>
							<Switch
								checked={normalise}
								onChange={setNormalise}
								className="flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
							>
								<span className="sr-only">Normalise color map</span>
								<span
									aria-hidden="true"
									className="pointer-events-none absolute bg-white w-full h-full rounded-md"
								/>
								<span
									aria-hidden="true"
									className={classNames(
										normalise ? 'bg-teal-600' : 'bg-gray-200',
										'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
									)}
								/>
								<span
									aria-hidden="true"
									className={classNames(
										normalise ? 'translate-x-5' : 'translate-x-0',
										'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
									)}
								/>
							</Switch>
						</Switch.Group>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}

export default ColorMap
