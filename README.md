
---

# CloudFlare temporary IP whitelist

The objective is to allow manually add IP into CF whitelist to check site from geo restricted regions.
For examples, we block all customers form Ukraine as not relevant country, but we work from Ukraine. It's ok to whitelist office IP. But if you need some urjent check from mobile phone it would be a problem. 
To allow fast IP whitelist small opt-in form was created.

# tech
Deployed to Vercel.com, their FaaS used for connecting to CF API.

## API methods
- `/api/add`: will add yours ip to whitelist, in responce
```json
{"listed":true,"ip":"x.x.x.x"}
```
or
```json
{"listed":false,"err":"some error"}
```
- `/api/check`: will return yours ip status, like is it already listed or not (permanent listing also will result true)
```json
{"listed":true,"ip":"x.x.x.x"}
```
or
```json
{"listed":false,"err":"some error"}
```
- `/api/clean`: this method used for removing all `temp` ip's from cloudflare. It should be called in desired amount of time.
```json
{"cleaned":true,"count":10}
```
or
```json
{"cleaned":false,"err":"some error"}
```


## Cron
There is no cron avalible at vercel. [Read an issue](https://github.com/vercel/vercel/issues/146)
That's why we use [assertible.com](https://assertible.com), service for api monitoring as a solution for triggering `/api/clean/` once a day. Also it validates amount of temp records added every day, and if amount will be suspicios will fire email alert.

## CF API (#todo)
Unfortunately nodejs API for CF is not complete. Thats why PR from original repo currently used:
https://github.com/cloudflare/node-cloudflare/pull/78
