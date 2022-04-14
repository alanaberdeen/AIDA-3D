import { useEffect, useRef } from 'react'

import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

type Person = {
	id: number
	name: string
}

// Placeholder example data
// TODO: if we use this component this would ofc need updating.
const people = [
	{ id: 1, name: 'Wade Cooper' },
	{ id: 2, name: 'Arlene Mccoy' },
	{ id: 3, name: 'Devon Webb' },
	{ id: 4, name: 'Tom Cook' },
	{ id: 5, name: 'Tanya Fox' },
	{ id: 6, name: 'Hellen Schmidt' },
]

export default function InputCombobox(props: {
	commitInput: (value: string) => void
}) {
	const { commitInput } = props

	const [selected, setSelected] = useState(people[0])
	const [query, setQuery] = useState('')

	const inputRef = useRef<HTMLInputElement>(null)

	const filteredPeople =
		query === ''
			? people
			: people.filter((person) =>
					person.name
						.toLowerCase()
						.replace(/\s+/g, '')
						.includes(query.toLowerCase().replace(/\s+/g, ''))
			  )

	// Add key listener to commit search on enter
	useEffect(() => {
		let handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter' && query.length > 0) {
				commitInput(query)
				setQuery('')
			}
		}

		const input = inputRef.current
		input?.addEventListener('keydown', handleKeyDown)
		return () => input?.removeEventListener('keydown', handleKeyDown)
	}, [commitInput, query])

	return (
		<div className="z-10">
			<Combobox value={selected} onChange={setSelected}>
				<div className="relative mt-1">
					<div className="pl-1 focus:outline-none focus:ring-teal-500 w-full focus:border-teal-500 min-width-0 border border-gray-300 rounded-l-md">
						<Combobox.Input
							ref={inputRef}
							className="w-full border-none focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900"
							displayValue={(person: Person) => person.name}
							onChange={(event) => setQuery(event.target.value)}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							<SelectorIcon
								className="w-5 h-5 text-gray-400"
								aria-hidden="true"
							/>
						</Combobox.Button>
					</div>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						afterLeave={() => setQuery('')}
					>
						<Combobox.Options className="z-100 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{filteredPeople.length === 0 && query !== '' ? (
								<div className="cursor-default select-none relative py-2 px-4 text-gray-700">
									Nothing found.
								</div>
							) : (
								filteredPeople.map((person) => (
									<Combobox.Option
										key={person.id}
										className={({ active }) =>
											`cursor-default select-none relative py-2 pl-10 pr-4 ${
												active ? 'text-white bg-teal-600' : 'text-gray-900'
											}`
										}
										value={person}
									>
										{({ selected, active }) => (
											<>
												<span
													className={`block truncate ${
														selected ? 'font-medium' : 'font-normal'
													}`}
												>
													{person.name}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
															active ? 'text-white' : 'text-teal-600'
														}`}
													>
														<CheckIcon className="w-5 h-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
				</div>
			</Combobox>
		</div>
	)
}
