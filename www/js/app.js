// Init F7 Vue Plugin
Vue.use(Framework7Vue)

// Init Page Components
Vue.component('about', {
    template: '#about'
})

Vue.component('book', {
    template: '#book',
    data() {
        return {
            busy: false
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            window.API_KEY = 'AIzaSyBbO_a-DqJXccpIIqvGJAKvcRr7KXQK_eA';
            window.source = 'Saudia';
            window.destination = 'Saudia';
            window.iframeUrl = 'https://www.google.com/maps/embed/v1/directions?key=' + API_KEY + '+&origin={{source}}&destination={{destination}}';

            window.route = {
                distance: '0 km',
                duration: '0 min'
            };

            let getRouteAndDistance = (source, destination) => {
                window.source = source;
                window.destination = destination;
                mapIframeUrl = iframeUrl.replace('{{source}}', encodeURIComponent(source));
                mapIframeUrl = mapIframeUrl.replace('{{destination}}', encodeURIComponent(destination));
                this.$refs.map.src = mapIframeUrl;
            };

            getRouteAndDistance(source, destination);

            let source_places = new google.maps.places.Autocomplete(document.getElementById('source_address'));
            google.maps.event.addListener(source_places, 'place_changed', function () {
                let place = source_places.getPlace();
                getRouteAndDistance(place.formatted_address, destination);
            });

            let destination_places = new google.maps.places.Autocomplete(document.getElementById('destination_address'));
            google.maps.event.addListener(destination_places, 'place_changed', function () {
                let place = destination_places.getPlace();
                getRouteAndDistance(source, place.formatted_address);
            });
        },
        contact() {
            this.busy = true;
            window.API_KEY = 'AIzaSyBbO_a-DqJXccpIIqvGJAKvcRr7KXQK_eA';
            let formData = {};
            let hasError = false;
            $.each($("input,select"), (k, v) => {
                if ($(v).val() === '' || $(v).val() === null) {
                    alert('You are trying to submit with missing or invalid data for ' + $(v).attr('name') + '. Please check again.')
                    hasError = true;
                    return false;
                }
                formData[$(v).attr('id')] = $(v).val();
            });

            if (!hasError)
                $.get('http://13.126.236.238/middleeastpackers/distance.php', {
                    source: formData.source_address,
                    destination: formData.destination_address,
                    API_KEY
                }, (response) => {
                    response = JSON.parse(response);
                    formData.distance = response.distance;
                    formData.duration = response.duration;
                    $.post('http://13.126.236.238/middleeastpackers/enquiry.php', formData, (response) => {});
                    setTimeout(() => {
                        alert('Your query has been submitted successfully');
                        this.busy = false;
                    },2000)
                })

            return false;
        }
    }
})

Vue.component('contact', {
    template: '#contact'
})
Vue.component('services', {
    template: '#services'
})
Vue.component('contact', {
    template: '#contact'
})

// Handle device ready event
// Note: You may want to check out the vue-cordova package on npm for cordova specific handling with vue - https://www.npmjs.com/package/vue-cordova
document.addEventListener('deviceready', () => {
    console.log("DEVICE IS READY!");
}, false)

let isAndroid = Framework7.prototype.device.android === true;
let isIos = Framework7.prototype.device.ios === true;
// Init App
new Vue({
    el: '#app',
    // Init Framework7 by passing parameters here
    framework7: {
        root: '#app',
        /* Uncomment to enable Material theme: */
        material: isAndroid,
        routes: [
            {
                path: '/about/',
                component: 'about'
            },
            {
                path: '/book/',
                component: 'book'
            },
            {
                path: '/services/',
                component: 'services'
            },
            {
                path: '/contact/',
                component: 'contact'
            }
        ]
    }
});



