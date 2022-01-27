import {useState, Fragment, useEffect} from 'react'
import {Container, Button, Row, Col, Table, Modal, Form} from 'react-bootstrap';

import Swal from 'sweetalert2';

export default function AdminView(props) {
	console.log(props)	//object

	const {productData, fetchData} = props
	//console.log(courseData)	//array of courses received by adminview component from parent course component
	//console.log(fetchData)

	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [price, setPrice] = useState(0)
	const [productId, setProductId] = useState("")

	const [products, setProducts] = useState([])

	// add course button state
	const [showAdd, setShowAdd] = useState(false)

	//function to open & close button
	const openAdd = () => setShowAdd(true)
	const closeAdd = () => setShowAdd(false)

	useEffect( () => {
		const productArr = productData.map(product => {
			// console.log(course)

			return(
				<tr>
					<td>{product.productName}</td>
					<td>{product.description}</td>
					<td>{product.price}</td>
					<td>
						{
							(product.isActive === true) ?
								<span>Available</span>
							:
								<span>Unavailable</span>
						}
					</td>
					<td>
						<Button onClick={() => openEdit(product._id)}>Update</Button>
						{
							(product.isActive) ?
								<Fragment>
									<Button 
										variant="danger"
										onClick={ () => archiveProduct(product._id, product.isActive)}
										>Disable</Button>
									<Button variant="secondary">Delete</Button>
								</Fragment>
							:
								<Fragment>
									<Button variant="success">Enable</Button>
									<Button variant="secondary">Disable</Button>
								</Fragment>
								
						}
					</td>
				</tr>
			)
		})

		setProducts(productArr)

	}, [productData])

	/*Functions*/

		//add course function to be invoked when onSubmit event takes place(see add course modal code)
		const addProduct = (e) => {
			e.preventDefault()

			fetch("http://localhost:4000/api/product", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					productName: name,
					description: description,
					price: price
				})
			})
			.then(response => response.json())
			.then(data => {
				// console.log(data)

				if(data === true){

					Swal.fire({
						title: "Success",
						icon: "success",
						text: "Product successfully added"
					})

					//setting back to original state after successfully added the course
					setName("")
					setDescription("")
					setPrice(0)

					//close the modal after the alert
					closeAdd();

					//function passed from courses page component to retrive all courses
					fetchData()

				} else {
					Swal.fire({
						title: "Something went wrong",
						icon: "error",
						text: "Please try again"
					})

					fetchData()
				}
			})
		}

		//function to populate data in the form upon clicking Update button
		const openEdit = (productId) => {

			fetch(`http://localhost:4000/api/:productId/product`, {
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				}
			})
			.then(response => response.json())
			.then(data => {
				console.log(data)

				setName(data.productName)
				setDescription(data.description)
				setPrice(data.price)
			})

			setShowAdd(true)
		}


		//edit course function to be invoked when onSubmit event takes place (see edit course modal code)
		const editProduct = (e, productId) => {
			e.preventDefault()

			fetch(`http://localhost:4000/api/:productId/product`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					productName: name,
					description: description,
					price: price
				})
			})
			.then(response => response.json())
			.then(data => {
				// console.log(data) //object

				if(typeof data !== "undefined"){
					fetchData()

					Swal.fire({
						title: "Success",
						icon: "success",
						text: "Product successfully updated."
					})

					closeAdd()
				} else {

					Swal.fire({
						title: "Something went wrong",
						icon: "error",
						text: "Please try again."
					})

					fetchData()
				}
			})
		}

		//archive course
		const archiveProduct = (productId, isActive) => {
			console.log(isActive)
			fetch(`http://localhost:4000/api/:productId/product/archive`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`
				},
				body: JSON.stringify({
					isActive: !isActive
				})
			})
			.then(response => response.json())
			.then(data => {
				// console.log(data)

				if(data === true){

					fetchData()

					Swal.fire({
						title: "Success",
						icon: "success",
						text: "Product disabled"
					})
				} else {
					fetchData()

					Swal.fire({
						title: "Something went wrong",
						icon: "error",
						text: "Please try again."
					})
				}
			})
		}

	return(
		<Container>
			<h2 className="text-center">Admin Dashboard</h2>
			<Row className="justify-content-center">
				<Col>
					<div className="text-right">
						<Button onClick={openAdd}>Add New Product</Button>
					</div>
				</Col>
			</Row>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Price</th>
						<th>Availability</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{products}
				</tbody>
			</Table>

		{/*Add Course Modal*/}
		<Modal show={showAdd} onHide={closeAdd}>
			<Modal.Header closeButton>
				<Modal.Title>Add Product</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={ (e) => addProduct(e)}>
					<Form.Group controlId="productName">
						<Form.Label>Product Name:</Form.Label>
						<Form.Control 
							type="text"
							value={name}
							onChange={ (e) => setName(e.target.value)}/>
					</Form.Group>
					<Form.Group controlId="productDescription">
						<Form.Label>Description:</Form.Label>
						<Form.Control 
							type="text" 
							value={description}
							onChange={ (e) => setDescription(e.target.value)}/>
					</Form.Group>
					<Form.Group controlId="productPrice">
						<Form.Label>Price:</Form.Label>
						<Form.Control 
							type="number" 
							value={price}
							onChange={ (e) => setPrice(e.target.value)}/>
					</Form.Group>
					<Button variant="success" type="submit">
					    Submit
					</Button>
					<Button 
						variant="secondary" 
						type="submit" 
						onClick={closeAdd}>
					    Close
					</Button>
				</Form>
			</Modal.Body>
		</Modal>

		{/*Edit Course*/}
		<Modal show={showAdd} onHide={closeAdd}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Product</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={ (e) => editProduct(e, productId)}>
					<Form.Group controlId="productName">
						<Form.Label>Product Name:</Form.Label>
						<Form.Control 
							type="text"
							value={name}
							onChange={ (e) => setName(e.target.value)}/>
					</Form.Group>
					<Form.Group controlId="productDescription">
						<Form.Label>Description:</Form.Label>
						<Form.Control 
							type="text" 
							value={description}
							onChange={ (e) => setDescription(e.target.value)}/>
					</Form.Group>
					<Form.Group controlId="productPrice">
						<Form.Label>Price:</Form.Label>
						<Form.Control 
							type="number" 
							value={price}
							onChange={ (e) => setPrice(e.target.value)}/>
					</Form.Group>
					<Button variant="success" type="submit">
					    Submit
					</Button>
					<Button 
						variant="secondary" 
						type="submit" 
						onClick={closeAdd}>
					    Close
					</Button>
				</Form>
			</Modal.Body>
		</Modal>

		</Container>	
	)
}