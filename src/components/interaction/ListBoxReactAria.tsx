// React Aria ListBox component styled with Tailwind CSS
// https://react-spectrum.adobe.com/react-aria/useListBox.html
// https://codesandbox.io/s/hardcore-moon-xzc4r?file=/src/ListBox.tsx:0-2754
import * as React from 'react'
import { useListBox, useListBoxSection, useOption } from 'react-aria'
import { CheckIcon } from '@heroicons/react/solid'

export const ListBox = (props) => {
	let ref = React.useRef(null)
	let { listBoxRef = ref, state } = props
	let { listBoxProps } = useListBox(props, state, listBoxRef)

	return (
		<ul
			{...listBoxProps}
			ref={listBoxRef}
			className="max-h-72 overflow-auto outline-none"
		>
			{[...state.collection].map((item) =>
				item.type === 'section' ? (
					<ListBoxSection key={item.key} section={item} state={state} />
				) : (
					<Option key={item.key} item={item} state={state} />
				)
			)}
		</ul>
	)
}

function ListBoxSection({ section, state }) {
	let { itemProps, headingProps, groupProps } = useListBoxSection({
		heading: section.rendered,
		'aria-label': section['aria-label'],
	})

	return (
		<>
			<li {...itemProps} className="pt-2">
				{section.rendered && (
					<span
						{...headingProps}
						className="text-xs font-bold uppercase text-gray-500 mx-3"
					>
						{section.rendered}
					</span>
				)}
				<ul {...groupProps}>
					{[...section.childNodes].map((node) => (
						<Option key={node.key} item={node} state={state} />
					))}
				</ul>
			</li>
		</>
	)
}

function Option({ item, state }) {
	let ref = React.useRef(null)
	let { optionProps, isDisabled, isSelected, isFocused } = useOption(
		{
			key: item.key,
		},
		state,
		ref
	)

	let text = 'text-gray-700'
	if (isFocused || isSelected) {
		text = 'text-blue-900'
	} else if (isDisabled) {
		text = 'text-gray-200'
	}

	return (
		<li
			{...optionProps}
			ref={ref}
			className={`m-1 rounded-md py-2 px-2 text-sm outline-none cursor-default flex items-center justify-between ${text} ${
				isFocused ? 'bg-blue-100' : ''
			} ${isSelected ? 'font-bold' : ''}`}
		>
			{item.rendered}
			{isSelected && (
				<CheckIcon aria-hidden="true" className="w-5 h-5 text-blue-600" />
			)}
		</li>
	)
}
