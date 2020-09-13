const un = require('./index');
console.log(un);
un.utils.v8.version().then(d => console.log(d));

un.utils.hasV8()
.then(d => console.log(d));
