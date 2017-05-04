const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = router => {
  router.get('/chunked', function (req, res) {
    res.writeHead('html');
    res.write('loading...<br>')
    
    return sleep(2000).then(function() {
      res.write(`timer: 2000ms<br>`)
      return sleep(5000)
    })
    .then(function() {
      res.write(`timer: 5000ms<br>`)
    }).then(function() {
      res.end()
    })
  });


  router.get('/', function(req, res) {
    res.toApiText('echo get');
  });

  router.post('/', function(req, res) {
    res.toApiJson({
      m: 'echo post'
    });
  });

  router.all('/error', function(req, res) {
    throw new Error('wow! now you meet an error');
  });

  router.getAsync('/error_in_async', async function(req, res) {
    throw new Error('wow! now you meet an error');
  });
  router.postAsync('/error_in_async', async function(req, res) {
    throw new Error('wow! now you meet an error');
  });
};