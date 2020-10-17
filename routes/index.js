const { response } = require('express');
var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const axios = require('axios')

let ar_PR = [];

async function getPRs(username, callback) {
  try {
    const response = await fetch(`https://api.github.com/search/issues?q=author:${username}+created:>2020-09-29+type:pr`)
    const data = await response.json()
    var t = data.items.length
    var item = data.items;

    for (var i = 0; i < t; i++) {
      var _label = item[i].labels.find(e => e.name == 'hacktoberfest-accepted')
      let label_bool = _label ? true : false

      const user_repo_res = await fetch(item[i].repository_url + '/topics',
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.mercy-preview+json",
            Authorization: 'token ee8a590676c13ab98ed25693da8a0fd4281dc0cb'
          }
        })
      const user_data = await user_repo_res.json()
      var _topic = user_data.names.find(e => e == 'hacktoberfest')
      let topic_bool = _topic ? true : false

      ar_PR.push({
        title: item[i].title,
        html_url: item[i].html_url,
        repo_url: item[i].repository_url,
        topic_bool,
        label_bool,
        state: item[i].state,
        created_at: item[i].created_at
      })
    }

    callback(ar_PR)
  } catch (error) {
    console.log('API error: ' + error)
    callback([])
  }
}

router.post('/', (req, res) => {
  console.log(req.body)
  getPRs(req.body.uname, cb => {
    if (cb.length)
      res.json(cb)
    else
      res.json([])
  })

})



module.exports = router;

