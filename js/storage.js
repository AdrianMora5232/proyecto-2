/**
 * storage.js
 * Universal storage handler for the application.
 */
const Storage = {
    // Keys
    USERS: 'scholar_users',
    SCHOLARSHIPS: 'scholar_list',
    APPLICATIONS: 'scholar_apps',
    SESSION: 'scholar_session',

    // Generic Methods
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // User Methods
    getUsers() {
        return this.get(this.USERS) || [];
    },

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.save(this.USERS, users);
    },

    // Session
    setCurrentUser(user) {
        this.save(this.SESSION, user);
    },

    getCurrentUser() {
        return this.get(this.SESSION);
    },

    clearSession() {
        localStorage.removeItem(this.SESSION);
    }
};
