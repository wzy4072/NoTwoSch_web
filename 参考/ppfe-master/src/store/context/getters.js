export const currentCorporate = (state) => {
    if (state.context == null || state.context.currentCorporate == null) {
        return null;
    }
    return state.context.currentCorporate;
}

export const loginContext = (state) => {
    if (state.context == null) {
        return null;
    }
    return state.context;
}

export const loadingContext = (state) => {
    if (state.context == null) {
        return false;
    }
    return state.context.loading;
}

export const getMessageCount = (state) => {
    if (state.messageCount == null) {
        return false;
    }
    return state.messageCount;
}
export const getPurchasedProducts = (state) => {
    if (state.context.purchasedProducts == null) {
        return false;
    }
    return state.context.purchasedProducts;
}


