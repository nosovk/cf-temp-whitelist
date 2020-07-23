const cf = require('cloudflare')({
    email: process.env['email'] || 'dev@nodeart.io',
    key: process.env['key'] || 'cloudflare api key'
});
const account = process.env['account'] || 'cloudflare account id'


module.exports = (req, res) => {
    cf.accountAccessFirewall.browse(account).then(ips=> {
        let record = ips.result.find(rec => {
            return rec.configuration.target === "ip" && rec.configuration.value === req.headers['x-real-ip']
        })
        return res.status(200).send({listed: record!==undefined, ip: req.headers['x-real-ip'],dump:req.headers});
    }).catch(err=>{
        return res.status(500).send({listed: false,err:JSON.stringify(err)});
    })

};
