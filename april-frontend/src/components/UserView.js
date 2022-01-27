import {useState, useEffect, Fragment} from 'react';
import ProductCard from './ProductCard';

export default function UserView({productData}) {
	//console.log(courseData)	//array of objects
	const [products, setProducts] = useState([])

	// console.log(courseData)

	useEffect( () => {
		const productArr = productData.map( product => {
			// console.log(course)

			//checks if course is active
			if(product.isActive === true){
				return(
					//pass each element of the array to CourseCard component
					<ProductCard 
						productProp={product} 
						key={product._id}
					/>
				)
			} else {
				return null
			}
		})

		setProducts(productArr)

	}, [productData])


	return(
		<Fragment>
			{products}
		</Fragment>
	)
}