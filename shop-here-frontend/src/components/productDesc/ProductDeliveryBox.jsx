import { FaLocationDot } from "react-icons/fa6"

function ProductDeliveryBox({returnPol}) {
  return (
    <div className="prod-delivery">
        <FaLocationDot />Deliver to
        <p>Kolkata 700105</p>
        <h4 className="delivery-date">Delivered by, 25 feb Tue</h4>
        <div className="return">
            <p>Return Policy : {returnPol}*</p>
        </div>
    </div>
  )
}

export default ProductDeliveryBox