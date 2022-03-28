// React Aria ListBox component styled with Tailwind CSS
// Adapted from:
// https://react-spectrum.adobe.com/react-aria/useSearchField.html
// https://codesandbox.io/s/hardcore-moon-xzc4r?file=/src/ListBox.tsx:0-2754
import { useEffect, useRef } from 'react'
import { useComboBoxState } from 'react-stately'
import { useComboBox, useFilter } from 'react-aria'
import { PlusIcon } from '@heroicons/react/solid'

import PropTypes from 'prop-types'

import { ListBox } from './ListBoxReactAria'
import { Popover } from './Popover'

export { Item } from 'react-stately'

export function InputAutoComplete(props) {
	let { contains } = useFilter({ sensitivity: 'base' })
	let state = useComboBoxState({ ...props, defaultFilter: contains })

	let inputRef = useRef(null)
	let listBoxRef = useRef(null)
	let popoverRef = useRef(null)

	const { commitInput, disabled, label } = props

	let { inputProps, listBoxProps, labelProps } = useComboBox(
		{
			...props,
			inputRef,
			listBoxRef,
			popoverRef,
		},
		state
	)

	// Add key listener to commit search on enter
	useEffect(() => {
		let handleKeyDown = (e) => {
			if (
				e.keyCode === 13 &&
				!state.isOpen &&
				!disabled &&
				state.inputValue.length > 0
			) {
				commitInput(state.inputValue)
				state.setInputValue('')
			}
		}

		const input = inputRef.current
		input.addEventListener('keydown', handleKeyDown)
		return () => input.removeEventListener('keydown', handleKeyDown)
	}, [commitInput, state, disabled])

	return (
		<div
			className={`${
				disabled ? 'opacity-50' : ''
			} w-full flex-col relative mt-4`}
		>
			<label
				{...labelProps}
				className="block text-sm font-medium text-gray-700"
			>
				{label}
			</label>
			<div className="mt-1 flex rounded-md shadow-sm">
				<div className="relative flex items-stretch flex-grow focus-within:z-10">
					<input
						{...inputProps}
						ref={inputRef}
						disabled={disabled}
						className="pl-1 focus:outline-none focus:ring-teal-500 w-full focus:border-teal-500 min-width-0 border border-gray-300 rounded-l-md"
						/>
				</div>

				<button
					className={`${
						disabled || state.inputValue.length === 0
							? 'cursor-default'
							: 'hover:bg-gray-100'
					} -ml-px relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500`}
					type="button"
					disabled={disabled || state.inputValue.length === 0}
					onClick={() => {
						if (!disabled && state.inputValue.length > 0) {
							commitInput(state.inputValue)
							state.setInputValue('')
						}
					}}
				>
					<PlusIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
				</button>
			</div>
			{state.isOpen && (
				<Popover
					popoverRef={popoverRef}
					isOpen={state.isOpen}
					onClose={state.close}
				>
					<ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
				</Popover>
			)}
		</div>
	)
}

InputAutoComplete.propTypes = {
	commitInput: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
}
