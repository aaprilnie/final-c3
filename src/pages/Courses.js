import {Fragment, useEffect, useState, useContext} from 'react'
// import courseData from './../data/courseData';

import UserContext from "./../UserContext"

/*components*/
	/*CourseCard is the template for courses*/
//import ProductCard from '../components/ProductCard';
import AdminView from "./../components/AdminView";
import UserView from "./../components/UserView";

export default function Products(){

	const [products, setProducts] = useState([])
	const {user} = useContext(UserContext)

	const fetchData = () => {
		fetch("http://localhost:4000/api/product?name=")
		.then(response => response.json())
		.then(data => {
			//console.log(data)	//array of objects
			setProducts(data)
		})
	}
	
	useEffect(() => {
		fetchData()
	}, [])

	return (
		<Fragment>
			{
				(user.isAdmin === true ) ?
					<AdminView productData= {products} fetchData={fetchData}/>
				:
					<UserView productData={products}/>
			}
		</Fragment>
	)
}