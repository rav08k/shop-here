import { v4 as uuidv4 } from "uuid";
import "./topCategoriesNav.css";
import { NavLink } from "react-router";

export default function HomeCategory({homePage = false}) {
	return (
		<section className="category">
			<div className="container">
				<div className="category_wrapper">
            {categories.map((category,i) => {
						return (
              <NavLink 
              to={"/categories/"+category.slug}
              key={category.id + i} >
							<HomeCategoryBox
								key={category.id}
								img={homePage ? category.img : null}
								title={category.title}
                />
              </NavLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}

function HomeCategoryBox({img,title}) {
  return (
    <div className="category_box">
        {img && <img src={img} alt="" className="category_img" />}
        <p>{title}</p>
    </div>
  )
}
const categories = [
    {
      id: uuidv4(),
      img: "assets/category_mobile.jpeg", 
      title: "Mobiles",
      slug: "smartphones"
    },
    {
        id: uuidv4(),
      img: "assets/men2.jpg", 
      title: "Men Fashion",
      slug:"mens-shirts"
    },
    {
        id: uuidv4(),
      img: "assets/women4.jpg", 
      title: "Women Fashion",
      slug:"womens-dresses"
    },
    {
        id: uuidv4(),
      img: "assets/kids.jpg", 
      title: "Kids Fashion",
      slug:"kids"
    },
    {
        id: uuidv4(),
      img: "assets/electronics.jpg", 
      title: "Electronics",
      slug:"electronics"
    },
    {
        id: uuidv4(),
      img: "assets/home.jpg", 
      title: "Home & Furnitures",
      slug:"furniture"
    },
    {
        id: uuidv4(),
      img: "assets/category_appliance.jpeg", 
      title: "Appliances",
      slug:"appliances"
    },
    {
        id: uuidv4(),
      img: "assets/category_toys.jpeg", 
      title: "Beauty, Toys & More",
      slug:"beauty"
    },
  ];
