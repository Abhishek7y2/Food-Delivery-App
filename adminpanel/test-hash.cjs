const bcrypt = require('bcryptjs');
const hash = '$2a$10$.0qwDThcjYiUlJ4HqWYQHeP3XM39UDw8Y3GRQp7bcrJYRSmMPxDAy';
const plain = '@Abhi24129';
console.log('Match?', bcrypt.compareSync(plain, hash));
