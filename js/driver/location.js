import { auth, db } from "../firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let watchId = null;

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    if (!navigator.geolocation) {

        console.log("المتصفح لا يدعم GPS");

        return;

    }

    watchId = navigator.geolocation.watchPosition(

        async (position) => {

            try {

                await updateDoc(doc(db, "drivers", user.uid), {

                    latitude: position.coords.latitude,

                    longitude: position.coords.longitude,

                    isOnline: true,

                    lastLocationUpdate: new Date()

                });

            } catch (error) {

                console.error(error);

            }

        },

        (error) => {

            console.error(error);

        },

        {

            enableHighAccuracy: true,

            maximumAge: 5000,

            timeout: 10000

        }

    );

});

window.addEventListener("beforeunload", () => {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(watchId);

    }

});
