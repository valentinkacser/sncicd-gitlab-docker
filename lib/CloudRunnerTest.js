const APIService = require('./ServiceNowCICDRestAPIService');
const messages = {
    'error': 'Error message.',
    'rolledup_test_error_count': 'Number of tests with errors',
    'rolledup_test_failure_count': 'Number of tests that failed',
    'rolledup_test_skip_count': 'Number of tests that were skipped',
    'rolledup_test_success_count': 'Number of tests that ran successfully',
    'status_detail': 'Additional information about the current state',
    'status_message': 'Description of the current state',
    'test_suite_duration': 'Amount of time that it took to execute the test suite',
    'test_suite_name': 'Name of the test suite'
};
let API;
module.exports = (pipeline, transport) => {
    API = new APIService(pipeline.url(), pipeline.auth(), transport);
    let options = {};
    'test_suite_sys_id'
        .split(' ')
        .forEach(name => {
            const val = pipeline.get(name);
            if (val) {
                options[name] = val;
            }
        });
    return API
        .testSuiteCloudRun(options)
        .catch(err => {
            process.stderr.write('\x1b[31mTestsuite run failed\x1b[0m\n');
            process.stderr.write('The error is:' + err);
            return Promise.reject(err);
        })
        .then(function (response) {
            if (response) {
                if (response.status === '2') { //success
                    console.log('\x1b[32mSuccess\x1b[0m\n');
                } else {
                    process.stderr.write('\x1b[31mTestsuite run failed\x1b[0m\n');
                }

                if (response.links && response.links.results && response.links.results.url) {
                    console.log('Link to results is: ' + response.links.results.url);
                }
                console.log(Object.keys(messages)
                    .filter(name => response[name])
                    .map(name => messages[name] + ': ' + response[name])
                    .join('\n')
                );
                if (response.status !== '2') {
                    return Promise.reject('Testsuite failed');
                }
            }
        })

}
/*const APIService = require('./ServiceNowCICDRestAPIService');
const messages = {
    'start_time': 'Time when the test suit was started',
    'detail_message': 'Description of the current state',
    'test_suite_duration': 'Amount of time that it took to execute the test suite',
    'name': 'Name of the test suite'
};
let API;
module.exports = (pipeline, transport) => {
    API = new APIService(pipeline.url(), pipeline.auth(), transport);
    let options = {};
    'test_suite_sys_id'
        .split(' ')
        .forEach(name => {
            const val = pipeline.get(name);
            if (val) {
                options[name] = val;
            }
        });
    return API
        .testSuiteCloudRun(options)
        .catch(err => {
            process.stderr.write('\x1b[31mTestsuite run failed\x1b[0m\n');
            process.stderr.write('The error is:' + err);
            return Promise.reject(err);
        })
        .then(function (response) {
            if (response) {
                //console.log(response);
                //console.log(response.state);
                if (response.state === '2') { //success
                    console.log('\x1b[32mSuccess\x1b[0m\n');
                } else {
                    process.stderr.write('\x1b[31mTestsuite run failed\x1b[0m\n');
                }

                if (response.result) {
                    let resultObj= JSON.parse(response.result);
                    let resultDetails = API.reqest
                    console.log('Link to results is id: ' + JSON.parse(response.result).test_suite_result_id);
                }
                
                console.log(Object.keys(messages)
                    .filter(name => response[name])
                    .map(name => messages[name] + ': ' + response[name])
                    .join('\n')
                );
                if (response.state !== '2') {
                    return Promise.reject('Testsuite failed');
                }
            }
        })

}*/
