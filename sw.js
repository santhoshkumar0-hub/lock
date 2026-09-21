/* =========================================================
   SANTOLABS OFFLINE SERVICE WORKER
   ========================================================= */

const CACHE_NAME =
    "santolabs-offline-v1";


const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./game.html",

    "./sw.js"

];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener(
    "install",
    function(event){

        console.log(
            "SantoLabs SW: Installing"
        );


        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(function(cache){

                return cache.addAll(
                    FILES_TO_CACHE
                );

            })
            .then(function(){

                return self.skipWaiting();

            })

        );

    }
);


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener(
    "activate",
    function(event){

        console.log(
            "SantoLabs SW: Activated"
        );


        event.waitUntil(

            caches.keys()
            .then(function(cacheNames){

                return Promise.all(

                    cacheNames.map(
                        function(cacheName){

                            if(
                                cacheName !==
                                CACHE_NAME
                            ){

                                return caches.delete(
                                    cacheName
                                );

                            }

                        }
                    )

                );

            })
            .then(function(){

                return self.clients.claim();

            })

        );

    }
);


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener(
    "fetch",
    function(event){

        if(
            event.request.method !==
            "GET"
        ){

            return;

        }


        event.respondWith(

            fetch(event.request)

            .then(function(response){

                /*
                   Save successful online
                   responses.
                */

                if(
                    response &&
                    response.status === 200
                ){

                    const copy =
                        response.clone();


                    caches.open(
                        CACHE_NAME
                    )
                    .then(function(cache){

                        cache.put(
                            event.request,
                            copy
                        );

                    });

                }


                return response;

            })

            .catch(function(){

                /*
                   Internet unavailable.
                   Use cached file.
                */

                return caches.match(
                    event.request
                );

            })

        );

    }
);