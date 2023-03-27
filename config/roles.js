const allRoles = {
    user: [],
    admin: ['getUsers', 'manageUser']
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = { 
    roles,
    roleRights
};