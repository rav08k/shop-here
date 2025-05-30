let USER_STORAGE_KEY = "user_data";

function setStorageKey(keyId){
    switch (keyId) {
        case "user":
            USER_STORAGE_KEY = "user_data"
            break;
        case "cart":
            USER_STORAGE_KEY = "cart_data"
            break;
        case "wishlist":
            USER_STORAGE_KEY = "wishlist_data"
            break;
        case "orders":
            USER_STORAGE_KEY = "orders_data"
            break;
        case "authToken":
            USER_STORAGE_KEY = "auth_token"
            break;
        default:
            USER_STORAGE_KEY = "user_data"
            break;
    }
}

export const setDataToLocalStorage = (keyId, data) => {
    setStorageKey(keyId);
	localStorage.setItem(
        USER_STORAGE_KEY,
		JSON.stringify(data)
	);
};

export const getDataFromLocalStorage = (keyId) => {
    setStorageKey(keyId);
	return localStorage.getItem(USER_STORAGE_KEY);
};

export const removeDataFromLocalStorage = (keyId) => {
    setStorageKey(keyId);
	localStorage.removeItem(USER_STORAGE_KEY);
};

export const clearLocalStorage = ()=> localStorage.clear();