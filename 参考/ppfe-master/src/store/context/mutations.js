export const reloadContext = (state, newCtx) => {
    state.context = newCtx;
}

export const loading = (state, loadingFlag) => {
    state.loading = loadingFlag;
}

export const setMessageCount = (state, messageCount) => {
    state.messageCount = messageCount;
}

