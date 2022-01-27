import {useEffect, useState, useContext} from 'react'
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {useParams, useHistory, Link} from 'react-router-dom'

import UserContext from './../UserContext'

import Swal from "sweetalert2";
//import Order from '../../../april-backend/models/Order';

export default function ProductView(){
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [price, setPrice] = useState(0)

	const {user} = useContext(UserContext)
	console.log(user)

	const {productId} = useParams()
	// console.log(courseId)

	let history = useHistory();

	useEffect( () => {

		fetch(`http://localhost:4000/api/product/:id`, {
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(response => response.json())
		.then(data => {
			console.log(data) //object

			setName(data.courseName)
			setDescription(data.description)
			setPrice(data.price)

		})
	}, [productId])

	const order = (productId) => {

		fetch('http://localhost:4000/api/order', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			},
			body: JSON.stringify({
				courseId: productId
			})
		})
		.then(response => response.json())
		.then(data => {
			// console.log(data)	//true

			if(data === true){
				Swal.fire({
					title: "Successfully added.",
					icon: "success",
					text: "You have Successfully added"
				})

				history.push("/orders")
			} else {
				Swal.fire({
					title: "Something went wrong.",
					icon: "error",
					text: "Please try again."
				})
			}
		})
	}

	return(
		<Container>
			<Row className="justify-content-center">
				<Col xs={8} md={4}>
					<Card>
						<Card.Body>
							<Card.Title>Name:</Card.Title>
							<Card.Text>{name}</Card.Text>
							<Card.Subtitle>Description:</Card.Subtitle>
							<Card.Text>{description}</Card.Text>
							<Card.Subtitle>Price:</Card.Subtitle>
							<Card.Text>{price}</Card.Text>
							<Card.Subtitle>Order Details</Card.Subtitle>
							<Card.Text>Lorem Ipsum</Card.Text>

							{
								(user.id !== null) ?
									<Button onClick={() => order(productId)}>Add</Button>
								:
									<Link 
										className="btn btn-primary" 
										to="/login">Login to Buy</Link>
							}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}