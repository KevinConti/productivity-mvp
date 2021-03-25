<svelte:head>
    <script on:load={e => oktaLoaded('js')} src="https://global.oktacdn.com/okta-signin-widget/5.4.2/js/okta-sign-in.min.js" type="text/javascript"></script>
    <link on:load={e => oktaLoaded('css')} href="https://global.oktacdn.com/okta-signin-widget/5.4.2/css/okta-sign-in.min.css" type="text/css" rel="stylesheet"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<script lang='ts'>
    import { onMount } from "svelte";
    import {push} from 'svelte-spa-router';

    const redirect: string = "/";

    let oktaReady: boolean = false;
    let oktaJsReady: boolean = false;
    let oktaCssReady: boolean = false;
    let mounted: boolean = false;
    function oktaLoaded(type) {
        if (type === 'js') {
            oktaJsReady = true;
        }
        else if (type === 'css') {
            oktaCssReady = true;
        }

        if (oktaCssReady && oktaJsReady) {
            oktaReady = true;
        }
    }

    onMount(() => {
        mounted = true;
    });

    function loadSigninWidget() {
        const signIn = new OktaSignIn({
            baseUrl: 'https://dev-01574004.okta.com',
            el: '#widget-container',
            clientId: '0oab0vgt9yylkRHtu5d6',
            // must be in the list of redirect URIs enabled for the OIDC app
            redirectUri: 'http://localhost:5000',
            authParams: {
                issuer: 'https://dev-01574004.okta.com/oauth2/ausb0dhj7FXRkWQl75d6'
            },
            features: {
                registration: true,
                rememberMe: true
            }
            });

        // SPA and Native apps using PKCE can receive tokens directly without any redirect
        signIn.showSignInToGetTokens().then(function(tokens) {
            // store/use tokens
            console.log({tokens})
            push(redirect);
        });
    }

    $: if (oktaReady && mounted) {
        loadSigninWidget();
    }
</script>


<div id="widget-container"></div>