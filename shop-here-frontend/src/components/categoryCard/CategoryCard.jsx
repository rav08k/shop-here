import "./categoryCard.css"
function CategoryCard({category}) {
  return (
    <div className="category_card">
        <div className="category_card_img">
            <img src={category.thumbnail} alt="category" />
        </div>
        <div className="category_card_content">
            <h3 className="category_card_title">{category.title}</h3>
            <p className="category_card_from">{category.from || "from ₹" + Math.round(category.price*85)}</p>
        </div>
    </div>
  )
}

export default CategoryCard