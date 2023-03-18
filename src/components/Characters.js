import { nanoid } from '@reduxjs/toolkit'
import { Button, Grid, Card, Message, Loader, List, Menu } from 'semantic-ui-react'
import { addFave } from '../features/faves'
import { useGetCharactersQuery } from '../services/swapApi'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

const Characters = () => {
	const [page, setPage] = useState(1)
	const pageSize = 10

	const { data, isError, isLoading } = useGetCharactersQuery(page)
	const dispatch = useDispatch()

	const totalPages = Math.floor((data?.count + pageSize - 1) / pageSize)

	const selectCharacter = e => {
		const { name } = e.currentTarget.dataset
		const character = data.results.find(character => character.name === name)
		return character
	}
	const addToFavourites = e => dispatch(addFave(selectCharacter(e)))

	if (isLoading) {
		return <Loader active={isLoading} />
	}

	if (isError) {
		return <Message error={isError}>There was an error</Message>
	}

	if (data && Boolean(data?.results?.length)) {
		return (
			<>
				<Card.Group centered>
					{data.results.map(character => (
						<Card key={nanoid()}>
							<Card.Content>
								<Card.Header>{character.name}</Card.Header>
								{character.films && <Card.Meta> films : {character.films.length}</Card.Meta>}
								<List>
									{character.height && (
										<List.Item>
											<List.Header>Height</List.Header>
											{character.height}
										</List.Item>
									)}
									{character.mass && (
										<List.Item>
											<List.Header>Mass</List.Header>
											{character.mass}
										</List.Item>
									)}
									{character.birth_year && (
										<List.Item>
											<List.Header>Birth Year</List.Header>
											{character.birth_year}
										</List.Item>
									)}
								</List>
							</Card.Content>
							<Card.Content extra>
								<Button
									icon={{ name: 'plus', size: 'small' }}
									data-name={character.name}
									positive
									content="Add to faves"
									onClick={addToFavourites}
								/>
							</Card.Content>
						</Card>
					))}
				</Card.Group>
				<Grid textAlign="center" style={{ margin: '0 auto' }}>
					<Grid.Column>
						<Menu pagination>
							<Menu.Item disabled={!Boolean(data.previous)} icon={'left arrow'} onClick={() => setPage(page - 1)} />
							{Array.from({ length: totalPages }).map((x, i) => (
								<Menu.Item key={i} name={`${i + 1}`} active={page === i + 1} onClick={() => setPage(i + 1)} />
							))}
							<Menu.Item disabled={!Boolean(data.next)} icon={'right arrow'} onClick={() => setPage(page + 1)} />
						</Menu>
					</Grid.Column>
				</Grid>
			</>
		)
	} else if (data?.results?.length === 0) {
		return <Message warning>no characters found</Message>
	}
	return null
}
export default Characters
