export default (() => {

    function load() {
        displaySplashScreen();
        setTimeout(removeSplashScreen, 5000);
    }

    function displaySplashScreen() {
        const body = document.querySelector("body");
        
        const splashScreen = document.createElement("div");
        splashScreen.id = "splash-container";
        splashScreen.innerHTML = `

            <div id="splash-screen">
                <p id="splash-text">
                    To Doo Doo
                </p>
            </div>
        
        `;

        body.appendChild(splashScreen);
    }

    function removeSplashScreen() {
        const body = document.querySelector("body");
        const splashScreen = document.getElementById("splash-container");
        body.removeChild(splashScreen);
    }

    return { load };

})();