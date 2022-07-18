import { PlusIcon } from '@heroicons/react/solid'

// Manage annotation layers
const FooterToolbar = (props: { addNew: () => void }) => {
	const { addNew } = props

	return (
		<div className="flex justify-end">
			<button
				type="button"
				className="inline-flex items-center m-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
				onClick={addNew}
				title="Add new color map"
			>
				<PlusIcon className="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	)
}

export default FooterToolbar
