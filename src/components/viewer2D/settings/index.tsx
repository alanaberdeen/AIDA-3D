import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'

import Map from 'ol/Map'

import Overview from './overview'
import Layers from './layers'
import Classes from './classes'

// Settings sidebar
// Generally for 'global' settings (ones which adjust the entire view and/or all
// annotation items within the view). Layers and channels are other examples
// of 'global' settings.
const Settings = (props: { map: Map }) => {
	const { map } = props

	const [isOpen, setIsOpen] = useState(false)

	// Toggling the sidebar changes the size of the map container but Openlayers
	// isn't aware of this. So we need to manually trigger an update to map size.
	useEffect(() => {
		map.updateSize()
	}, [isOpen, map])

	return (
		<>
			{/* Open button */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="rounded-bl-md hover:bg-gray-100 border-gray-200 shadow p-2 bg-white absolute top-0 right-0 inline-flex items-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
				>
					<ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
					Settings
				</button>
			)}

			{/* Content */}
			{isOpen && (
				<div className="bg-white border-l border-gray-200 h-screen shadow text-gray-800 flex flex-col divide-y">
					{/* Close button */}
					<button
						onClick={() => setIsOpen(false)}
						className="w-48 flex justify-between hover:bg-gray-100 p-2 items-center focus:outline-none  ring-inset focus:ring-2 focus:ring-teal-500"
					>
						Settings
						<ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
					</button>
					<Overview map={map} />
					<Layers map={map} />
					<Classes map={map} />
				</div>
			)}
		</>
	)
}

export default Settings
