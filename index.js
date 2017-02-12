
/**
 * Initialize the Easy Request module
 * @param {Object|String} connectionInfo: Connection string, or whatever needs to be passed into the
 *   first argument of "new mssql.Connection"
 * @param {mssql} mssql: The mssql library instance. I guess this lets you do whatever initialization you want, and maybe use other DB drivers and whatver.. maybe mocking. Whatever you want.
 */
module.exports = (connectionInfo, mssql) => {
    return {
        execute: execute
    };

    /**
     * Executes the specified command definition
     * Command objects should look like this:
     * { commandText: 'SQL SQL SQL SQL....', parameters: [{ name: 'param1', value: param1Value }] }
     * @param {Object} command
     */
    function execute(command) {
        return new Promise((fulfill, reject) => {
            var conn = new mssql.Connection(connConfig);
            conn.connect()
                .then(() => {
                    var request = new mssql.Request(conn);
                    
                    if (command.parameters) {
                        command.parameters.forEach(parameter => {
                            var paramName = parameter.name;
                            if (paramName.startsWith('@')) {
                                paramName = paramName.substring(1);
                            }

                            if (parameter.type) {
                                var paramType = mssql[parameter.type];
                                request.input(paramName, paramType, parameter.value);
                            }
                            else {
                                request.input(paramName, parameter.value);
                            }

                        });
                    }
                    
                    request.query(command.commandText)
                        .then(fulfill)
                        .catch(reject);
                })
                .catch (reject);
        });
    };
}

