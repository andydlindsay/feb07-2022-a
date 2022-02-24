const bcrypt = require('bcryptjs');

const plaintextPassword = 'hello';

const salt = bcrypt.genSaltSync();
// const salt = bcrypt.genSalt();
console.log('salt', salt);

const hashed = bcrypt.hashSync(plaintextPassword, salt);
console.log('hashed', hashed);

const hashedPassword = '$2a$10$ehxbmb3d5A2J.dI9GM5eZ.CZn0G6DrM7yH0GM.c.Esxg41YQezNF6';

const result = bcrypt.compareSync('something else', hashedPassword);
console.log('result', result);
