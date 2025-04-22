import useDeliveryPin from "../../stores/deliveryPinStore";

function Overlay() {
  const { isPopupOpen } = useDeliveryPin();
  return (
    <div className="bg-overlay" style={{ display: isPopupOpen ? "block" : "none" }}></div>
  )
}

export default Overlay