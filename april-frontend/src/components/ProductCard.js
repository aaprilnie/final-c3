import {useState, useEffect} from 'react';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function ProductCard({productProp}){
	console.log(productProp)	/*object*/

	const {productName, description, isActive, price, _id} = productProp

	const [isDisabled, setIsDisabled] = useState(false)

	return(
		<Container>
			<Row className="justify-content-center">
				<Col xs={8} md={4}>
					<Card>
					  <Card.Body>
					    <Card.Title>{productName}</Card.Title>
					    <Card.Subtitle>Description:</Card.Subtitle>
					    <Card.Text>{description}</Card.Text>
					    <Card.Subtitle>Price:</Card.Subtitle>
					    <Card.Text>{price}</Card.Text>
					    <Link className="btn btn-primary" to={`/products/${_id}`}>Details</Link>
					  </Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}