
function ProductDetailsTable({productDetails}) {
  return (
    <div className="product-desc-table">
        <h3>Product Details</h3>
        <dl>
            {(Object.keys(productDetails)).map(key=>{
                return <span key={key}>
                <dt>{key}</dt>
                <dd>{productDetails[key]}</dd>
                </span>
            })}
        </dl>
    </div>
  )
}

export default ProductDetailsTable