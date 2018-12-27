import React, { Component } from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Row,
  Col
} from 'reactstrap';
import './App.css';

const TITLE = 'Hanime';

const aniGraqphQl = axios.create({
  baseURL: 'https://graphql.anilist.co',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const GET_CHARACTER = `
  query ($name: String) {
    Character(search: $name) {
        name {
          first
          last
        }
        image {
          large
        }
      }
  }
`;

const getCharacter = name => {
  return aniGraqphQl.post('', {
    query: GET_CHARACTER,
    variables: {name}
  });
};

class App extends Component {
  state = {
    first: 'naruto',
    last: 'uzumaki',
    image: '',
    errors: null,
  };

  componentDidMount() {
    this.onFetchCharacter(this.state.first);
  }

  submitCharacter = event => {
    this.onFetchCharacter(this.state.first);
    event.preventDefault();
  };

  onChange = event => {
    this.setState({first: event.target.value});
  };

  onFetchCharacter = name => {
    getCharacter(name)
        .then(result =>
          this.setState(() => ({
            first:  result.data.data.Character.name.first,
            last:  result.data.data.Character.name.last,
            image: result.data.data.Character.image.large,
          }))
        );
  };

  render() {

    const { first, last, image, errors } = this.state;

    return (
      <Container className="App">
        <Row>
          <Col md={{ size: 5, offset: 4}}>
          <h1>{TITLE}</h1>
          <Form onSubmit={this.submitCharacter}>
            <FormGroup>
              <Label>Search your favourite character</Label>
              <Input
                  id="character"
                  value={first}
                  onChange={this.onChange}
                  type="text"/>
              <Button type="submit" color="info">Search</Button>
            </FormGroup>
          </Form>
            <br/>
            {first ? (
                <Character
                    first={first}
                    last={last}
                    image={image}
                    errors={errors} />
            ) : (
              <p>No information on the character.</p>
            )}

          </Col>
        </Row>
      </Container>
    );
  }
}

const Character = ({first, last, image, errors}) => {
        if (errors) {
          return (
              <div>
                <p>
                  Something went wrong.
                </p>
              </div>
          )
        }

        return (
            <div>
              <p><strong>{first} {last}</strong></p>
              <img src={image} alt=""/>
            </div>
        )
};

export default App;