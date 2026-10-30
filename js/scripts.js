/*!
* Start Bootstrap - Resume v7.0.3 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarSupportedContent .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    initTravelMap();

});

// Countries visited, shown on the travel map
const visitedPlaces = [
    { code: 'BD', name: 'Bangladesh', coords: [23.7, 90.4] },
    { code: 'IN', name: 'India', coords: [20.6, 79.0] },
    { code: 'CA', name: 'Canada', coords: [49.9, -119.5] },
    { code: 'US', name: 'United States', coords: [39.8, -98.6] },
    { code: 'JP', name: 'Japan', coords: [35.7, 139.7] },
    { code: 'AU', name: 'Australia', coords: [-25.3, 133.8] },
    { code: 'ES', name: 'Spain', coords: [40.4, -3.7] },
    { code: 'PT', name: 'Portugal', coords: [39.4, -8.2] },
    { code: 'FR', name: 'France', coords: [46.6, 2.2] },
    { code: 'IT', name: 'Italy', coords: [41.9, 12.5] },
    // Malta is too small to be a region on the world map, so it's shown as a marker
    { code: 'MT', name: 'Malta', coords: [35.9, 14.4], marker: true },
];

function initTravelMap() {
    const mapEl = document.getElementById('travelMap');
    if (!mapEl || typeof jsVectorMap === 'undefined') {
        return;
    }

    const names = {};
    visitedPlaces.forEach(place => { names[place.code] = place.name; });
    const markerPlaces = visitedPlaces.filter(place => place.marker);

    const map = new jsVectorMap({
        selector: '#travelMap',
        map: 'world',
        backgroundColor: 'transparent',
        zoomOnScroll: false,
        zoomButtons: true,
        regionsSelectable: false,
        selectedRegions: visitedPlaces.filter(place => !place.marker).map(place => place.code),
        regionStyle: {
            initial: { fill: '#e2e8f0', stroke: '#ffffff', strokeWidth: 0.4, fillOpacity: 1 },
            hover: { fillOpacity: 0.75, cursor: 'pointer' },
            selected: { fill: '#4f46e5' },
            selectedHover: { fill: '#3730a3' },
        },
        markers: markerPlaces.map(place => ({ name: place.name, coords: place.coords })),
        markerStyle: {
            initial: { fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2, r: 5 },
            hover: { fill: '#3730a3', cursor: 'pointer' },
        },
        onRegionTooltipShow(event, tooltip, code) {
            if (names[code]) {
                tooltip.text(names[code] + ' ✓');
            }
        },
    });

    // Country chips: click to zoom the map to that country, click again to reset
    const list = document.getElementById('placeList');
    let focused = null;
    visitedPlaces.forEach(place => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'place-chip';
        button.textContent = place.name;
        button.addEventListener('click', () => {
            list.querySelectorAll('.place-chip').forEach(chip => chip.classList.remove('active'));
            if (focused === place.code) {
                focused = null;
                map.reset();
                return;
            }
            focused = place.code;
            button.classList.add('active');
            if (place.marker) {
                map.setFocus({ coords: place.coords, scale: 8, animate: true });
            } else {
                map.setFocus({ regions: [place.code], animate: true });
            }
        });
        item.appendChild(button);
        list.appendChild(item);
    });
    document.getElementById('placesCount').textContent = visitedPlaces.length;

    window.addEventListener('resize', () => map.updateSize());
}
