import logincontext from '@/api/logincontext';

export const login = ({ commit }, { username, password }) => {
    commit('loading', true);
    return logincontext.login(username, password).then(ctx => {
        commit('reloadContext', ctx);
        commit('loading', false);
        return ctx;
    }).catch(err => {
        commit('loading', false);
        throw err;
    });
};

export const switchCorporate = ({ commit }, corpId) => {
    commit('loading', true);
    return logincontext.switchCorporate(corpId).then(ctx => {
        commit('reloadContext', ctx);
        commit('loading', false);
        return ctx;
    }).catch(err => {
        commit('loading', false);
        throw err;
    });
};

export const reloadContext = ({ commit }) => {
    commit('loading', true);
    return logincontext.reload().then(ctx => {
        commit('reloadContext', ctx);
        commit('loading', false);
        return ctx;
    }).catch(msg => {
        commit('loading', false);
        throw msg;
    });
};

export const messageCount = ({ commit }, count) => {
    commit('setMessageCount', count);
};
