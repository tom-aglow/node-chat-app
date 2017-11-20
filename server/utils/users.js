class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(user => user.id !== id)
    }

    return user;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    return this.users
      .filter(user => user.room === room)
      .map(user => user.name);
  }

  isNameTaken(name, room) {
    return this.users.filter(user => user.name === name && user.room === room).length > 0
  }
}

module.exports = { Users };
