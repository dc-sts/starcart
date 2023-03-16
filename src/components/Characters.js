import { nanoid } from '@reduxjs/toolkit'
import { Button, Card, Message, Loader, List } from 'semantic-ui-react'
import { addFave } from '../features/faves'
import { useGetCharactersQuery } from '../services/swapApi'
import { useDispatch } from 'react-redux'

const Characters = () => {
	const { data, isError, isLoading } = useGetCharactersQuery()
	const dispatch = useDispatch()

	const selectCharacter = e => {
		console.log(e)
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
		)
	} else if (data?.results?.length === 0) {
		return <Message warning>no characters found</Message>
	}
	return null
}
export default Characters
