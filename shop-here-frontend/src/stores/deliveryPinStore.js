import { create } from "zustand";

const useDeliveryPin = create((set) => ({
    deliveryPin: "",
    deliveryAddress: "",
    isClicked: false,
    isPopupOpen: false,
    setIsPopupOpen: (isOpen) => set((state) => ({ isPopupOpen: isOpen })),
    setIsClicked: (clicked) => set((state) => ({ isClicked: clicked })),
    setDeliveryPin: (pin) => set((state) => ({ deliveryPin: pin })),
}));

export default useDeliveryPin;
