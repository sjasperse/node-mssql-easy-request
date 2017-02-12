# node-mssql-easy-request
Making it easier to run simple queries via mssql.

I found the boilerplate stuff around creating a new connection, connecting, and creating a new request pretty repetitive with node-mssql. This was my shot at condensing that down to be easier (for me):

*** DISCLAIMER: *** I'm a Javascript/NodeJS amateur.

Before:
```js
function insertThingy(thingy) {
    return new Promise((fulfill, reject) => {
          new mssql.Connection(CONNECTION_STRING_THINGY);
            .then(conn => {
                conn.connect()
                    .then(() => {
                        new mssql.Request(conn)
                            .input('thingy', thingy)
                            .query(INSERT_THINGY_SQL)
                            .then(fulfill)
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}
```

After:
```js
const mssql = require('mssql');
const sql = require('node-mssql-easy-request')(CONNECTION_STRING_THINGY, mssql);

function insertThingy(thingy) {
  return sql.execute({
    parameters: [ { name: 'thingy', value: thingy } ],
    commandText: INSERT_THINGY_SQL
  });
}
```
