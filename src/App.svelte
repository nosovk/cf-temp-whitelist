<script>
    import {onMount} from "svelte";

    export let status;
    onMount(async () => {
        const res = await fetch("/api/check");
        const ipInfo = await res.json();
        status = ipInfo;
    });

    function handleClick() {
        fetch("/api/add").then(res => {
            res.json().then(ipInfo => {
                status = ipInfo;
                // alert(`Your ip is ${status.listed ? 'added' : 'not added'}`)
            }).catch(err => {
                        alert(`Error adding ip ${JSON.stringify(err)}`)
                    }
            )
        }).catch(err=>{
            alert(`Error adding ip ${JSON.stringify(err)}`)
        })


    }
</script>

<main>
    <h1>IP Whitelist</h1>
    <h2>(temporary - for 1 day)
    </h2>
    <p>
        Time to time we work from home and can't get throw country block. To fulfill duties we need help of admin, to
        whitelist IP. But if you use mobile internet your ip is dynamic. It means it will change time to time. To allow
        employed people work from home we added self service page. You can check is yours ip already whitelisted and
        temporary whitelist yours. All temp ip's marked by special flag and deleted once a day.
    </p>
    <h2>Your ip currently:</h2>
    <p>{status ? `Listed: ${status.listed}, IP: ${status.ip}` : 'Loading info...'}</p>
    <button on:click|once={handleClick}>
        Whitelist My IP!
    </button>
</main>
