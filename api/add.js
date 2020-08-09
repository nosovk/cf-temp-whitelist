const cf = require('cloudflare')({
    email: process.env['email'] || 'dev@nodeart.io',
    key: process.env['key'] || 'cloudflare api key'
});
const account = process.env['account'] || 'cloudflare account id'
const tempMark = process.env['tempmark'] || 'temp'

module.exports = (req, res) => {
    cf.accountAccessFirewall.add(account, {
        mode: "whitelist", configuration: {
            "target": "ip",
            "value": req.headers['x-real-ip']
        }, notes: tempMark
    }).then(response => {
        return res.status(200).send({listed: response.success, ip: req.headers['x-real-ip']});
    })
        .catch(err => {
            if (err.statusCode !== 400) {
                return res.status(500).send({listed: false, err: JSON.stringify(err)});
            }
            cf.accountAccessFirewall.browse(account).then(ips => {
                    let record = ips.result.find(rec => {
                        return rec.configuration.target === "ip" && rec.configuration.value === req.headers['x-real-ip']
                    })
                    if (record) {
                        return res.status(200).send({listed: true, ip: req.headers['x-real-ip']});
                    }
                    return res.status(500).send({listed: false, err: JSON.stringify(err)});

                }
            )

        })
};
