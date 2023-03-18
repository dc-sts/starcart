import FaveItem from './FaveItem'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const testProps = {
	fave: { id: 'xyz', name: 'Test Name', rating: 4 },
	handleRating: jest.fn(),
	handleRemove: jest.fn(),
}

describe('FaveItem', () => {
	it('render correct title', () => {
		render(<FaveItem {...testProps} />)

		expect(screen.getByText(testProps.fave.name)).toBeInTheDocument()
	})

	it('render correct number of stars', () => {
		render(<FaveItem {...testProps} />)

		const stars = screen.getAllByRole('radio')

		expect(stars.filter(s => s.classList.contains('active'))).toHaveLength(testProps.fave.rating)
	})

	it('calls delete handler', () => {
		render(<FaveItem {...testProps} />)

		userEvent.click(screen.getByRole('button'))

		expect(testProps.handleRemove).toHaveBeenCalled()
	})
})
