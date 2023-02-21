<script>
    let htmlToggle = false
    let bodyToggle = false
</script>

<div><html lang="en" class:toggled={htmlToggle} style:font-size="14px" style:--toggled={htmlToggle ? '1' : '0'} on:keyup={(event) => { if (event.key === 'h') htmlToggle = !htmlToggle }} /></div>
<svelte:body data-sveltekit-preload-data="hover" class:toggled={bodyToggle} style:color="green" style:--toggled={bodyToggle ? '1' : '0'} on:keyup={(event) => { if (event.key === 'b') bodyToggle = !bodyToggle }} />
<slot />

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        border: none;
    }
    
    :global(body) {
        min-height: 100vh;
    }
</style>