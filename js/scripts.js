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
    initEmailLinks();

});

// Email links open a small menu so visitors can write in Gmail or Outlook in a new
// tab, use their mail app, or copy the address. Without JS the link is a plain mailto.
function initEmailLinks() {
    let menu = null;
    let toast = null;
    let hideTimer = null;
    let openFor = null;

    function showToast(message) {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copy-toast';
            toast.setAttribute('role', 'status');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function closeMenu() {
        if (menu) {
            menu.classList.remove('open');
        }
        if (openFor) {
            openFor.setAttribute('aria-expanded', 'false');
        }
        openFor = null;
    }

    function addOption(icon, label, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('role', 'menuitem');
        button.innerHTML = '<i class="' + icon + '"></i>';
        button.append(' ' + label);
        button.addEventListener('click', () => {
            onClick();
            closeMenu();
        });
        menu.appendChild(button);
    }

    function buildMenu(email) {
        menu = document.createElement('div');
        menu.className = 'email-menu';
        menu.setAttribute('role', 'menu');
        const to = encodeURIComponent(email);
        addOption('fab fa-google', 'Gmail', () => {
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + to, '_blank', 'noopener');
        });
        addOption('fab fa-microsoft', 'Outlook', () => {
            window.open('https://outlook.office.com/mail/deeplink/compose?to=' + to, '_blank', 'noopener');
        });
        addOption('fas fa-envelope-open-text', 'Mail app', () => {
            window.location.href = 'mailto:' + email;
        });
        addOption('far fa-copy', 'Copy address', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email)
                    .then(() => showToast('Email copied: ' + email))
                    .catch(() => showToast(email));
            } else {
                showToast(email);
            }
        });
        document.body.appendChild(menu);
    }

    function openMenu(link) {
        if (!menu) {
            buildMenu(link.dataset.email);
        }
        // Place the menu under the icon (or above it when there's no room below),
        // kept inside the window
        const rect = link.getBoundingClientRect();
        menu.classList.add('open');
        const left = Math.min(
            Math.max(8, rect.left + window.scrollX),
            window.scrollX + document.documentElement.clientWidth - menu.offsetWidth - 8
        );
        const fitsBelow = rect.bottom + 8 + menu.offsetHeight <= window.innerHeight;
        const top = fitsBelow ? rect.bottom + 8 : rect.top - 8 - menu.offsetHeight;
        menu.style.left = left + 'px';
        menu.style.top = (top + window.scrollY) + 'px';
        link.setAttribute('aria-expanded', 'true');
        openFor = link;
    }

    document.querySelectorAll('a[data-email]').forEach(link => {
        link.setAttribute('aria-haspopup', 'menu');
        link.setAttribute('aria-expanded', 'false');
        link.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            if (openFor === link) {
                closeMenu();
            } else {
                openMenu(link);
            }
        });
    });

    document.addEventListener('click', event => {
        if (menu && !menu.contains(event.target)) {
            closeMenu();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
    window.addEventListener('resize', closeMenu);
}

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
    // Malta and Vatican City are too small to be regions on the world map, so they're shown as markers
    { code: 'MT', name: 'Malta', coords: [35.9, 14.4], marker: true },
    { code: 'VA', name: 'Vatican City', coords: [41.9, 12.45], marker: true },
];

// Cities where I presented my research, shown as amber markers
const presentedPlaces = [
    { name: 'Barcelona', event: 'CHI 2026', coords: [41.39, 2.17] },
    { name: 'Yokohama, Japan', event: 'CHI 2025', coords: [35.44, 139.64] },
    { name: 'Seattle', event: 'ISMAR 2024', coords: [47.61, -122.33] },
    { name: 'Sydney', event: 'ISMAR 2023', coords: [-33.87, 151.21] },
];

const VISITED_COLOR = '#0f766e';

// Map pin (Google Maps shape, in the coral highlight colour) used for presented-at markers, drawn at PIN_SIZE px
const PIN_SIZE = 30;
const PIN_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<path d="M12 23.3s-7.8-7.3-7.8-13.5a7.8 7.8 0 0 1 15.6 0C19.8 16 12 23.3 12 23.3z" fill="#E8590C" stroke="#9A3412" stroke-width="1"/>' +
    '<circle cx="12" cy="9.8" r="2.9" fill="#9A3412"/></svg>'
);

// The map library always draws image markers at 23x23, so resize them afterwards.
// The offset lifts the pin so its tip (bottom centre of the image) sits on the city.
function enlargePins(map) {
    Object.values(map._markers).forEach(marker => {
        const shape = marker.element.shape;
        if (!marker.element._isImage) {
            return;
        }
        shape.width = PIN_SIZE;
        shape.height = PIN_SIZE;
        shape.offset = [0, -PIN_SIZE * 0.47];
        shape.applyAttr('width', PIN_SIZE);
        shape.applyAttr('height', PIN_SIZE);
        shape.applyAttr('cx', shape.cx);
        shape.applyAttr('cy', shape.cy);
    });
}

function initTravelMap() {
    const mapEl = document.getElementById('travelMap');
    if (!mapEl || typeof jsVectorMap === 'undefined') {
        return;
    }

    const names = {};
    visitedPlaces.forEach(place => { names[place.code] = place.name; });

    const markers = [
        ...visitedPlaces.filter(place => place.marker).map(place => ({
            name: place.name,
            coords: place.coords,
            style: { fill: VISITED_COLOR },
        })),
        ...presentedPlaces.map(place => ({
            name: place.event + ' · ' + place.name,
            coords: place.coords,
            style: { image: PIN_IMAGE },
        })),
    ];

    const map = new jsVectorMap({
        selector: '#travelMap',
        map: 'world',
        backgroundColor: 'transparent',
        zoomOnScroll: false,
        zoomButtons: true,
        regionsSelectable: false,
        markersSelectable: false,
        selectedRegions: visitedPlaces.filter(place => !place.marker).map(place => place.code),
        regionStyle: {
            initial: { fill: '#dde3e0', stroke: '#ffffff', strokeWidth: 0.4, fillOpacity: 1 },
            hover: { fillOpacity: 0.75, cursor: 'pointer' },
            selected: { fill: VISITED_COLOR },
            selectedHover: { fill: '#115e59' },
        },
        markers: markers,
        markerStyle: {
            initial: { fill: VISITED_COLOR, stroke: '#ffffff', strokeWidth: 2, r: 5 },
            hover: { fillOpacity: 0.8, cursor: 'pointer' },
        },
        onRegionTooltipShow(event, tooltip, code) {
            if (names[code]) {
                tooltip.text(names[code] + ' ✓');
            }
        },
        onMarkerTooltipShow(event, tooltip, index) {
            tooltip.text(markers[index].name);
        },
    });

    enlargePins(map);

    // The SVG element on the map for a region code or a marker index
    const regionNode = code => map.regions[code].element.shape.node;
    const markerNode = index => map._markers[index].element.shape.node;

    // Chips: click to highlight a place on the map (the map stays still),
    // click the same chip again to clear the highlight
    let activeChip = null;
    let highlighted = null;
    function addChip(list, label, getNode, pinned) {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'place-chip';
        button.textContent = label;
        if (pinned) {
            const pin = document.createElement('img');
            pin.src = PIN_IMAGE;
            pin.alt = '';
            pin.className = 'chip-pin';
            button.prepend(pin);
        }
        button.addEventListener('click', () => {
            if (activeChip) {
                activeChip.classList.remove('active');
            }
            if (highlighted) {
                highlighted.classList.remove('is-highlighted');
            }
            if (activeChip === button) {
                activeChip = null;
                highlighted = null;
                return;
            }
            activeChip = button;
            button.classList.add('active');
            highlighted = getNode();
            // Re-adding the class restarts the animation
            void highlighted.getBoundingClientRect();
            highlighted.classList.add('is-highlighted');
        });
        item.appendChild(button);
        list.appendChild(item);
        return button;
    }

    // Marker order matches `markers`: visited-place markers first, then presented-at pins
    const visitedMarkerCount = visitedPlaces.filter(place => place.marker).length;
    let visitedMarkerIndex = 0;

    const placeList = document.getElementById('placeList');
    visitedPlaces.forEach(place => {
        const index = place.marker ? visitedMarkerIndex++ : null;
        addChip(placeList, place.name, place.marker
            ? () => markerNode(index)
            : () => regionNode(place.code));
    });

    const talkList = document.getElementById('talkList');
    presentedPlaces.forEach((place, i) => {
        addChip(talkList, place.event + ' · ' + place.name, () => markerNode(visitedMarkerCount + i), true)
            .classList.add('presented');
    });

    document.getElementById('placesCount').textContent = visitedPlaces.length;

    window.addEventListener('resize', () => map.updateSize());
}
