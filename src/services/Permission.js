class Permission {
  constructor() {
    this.user = JSON.parse(localStorage.getItem("user")) || null;
    this.permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  }

  setUser(user) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user))
  }
  setPermissions(permissions) {
    this.permissions = permissions
    localStorage.setItem("permissions", JSON.stringify(permissions))
  }

  getUser() {
    return this.user;
  }

  getPermissions() {
    return this.permissions;
  }

  hasPermission(requiredPermission) {
    return this.permissions.includes(requiredPermission);
  }

  logout() {
    this.user = null;
    this.permissions = [];
    localStorage.removeItem("user")
    localStorage.removeItem("permissions")
  }
}

export default new Permission();
