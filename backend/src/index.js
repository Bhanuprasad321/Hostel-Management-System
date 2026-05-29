const bcrypt = require("bcrypt");

bcrypt.hash("superadmin123", 10).then(console.log);