const cf = require('cloudflare')({
    email: process.env['email'] || 'dev@nodeart.io',
    key: process.env['key'] || 'cloudflare api key'
});
const account = process.env['account'] || 'cloudflare account id'


module.exports = (req, res) => {
    const tasks = [];
    cf.accountAccessFirewall.browse(account).then(ips=> {
        ips.result.filter(rec=>rec.notes.startsWith("temp|")).forEach(rec=>{
            tasks.push(cf.accountAccessFirewall.del(account,rec.id))
        })
        Promise.all(tasks).then(result=>{
            return res.status(200).send({cleaned:true,count:tasks.length})
        })
            .catch(err=>{
                return res.status(500).send({cleaned:false,err:JSON.stringify(err)})
            })
    })
        .catch(err=>{
            return res.status(500).send({cleaned:false,err:JSON.stringify(err)})
        })
};
