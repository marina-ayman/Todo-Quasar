
export default {
  login({ commit }, userData , permissions) {
    commit('setUser', userData)
    commit('setPermissions', permissions)
  },
  logout({ commit }) {
    commit('setUser', null)
    commit('setPermissions', [])
  },

  hasPermission({ state }, requiredPermission) {
    return state.permissions.includes(requiredPermission);
  }


  
};
