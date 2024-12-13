const olxSettings = {
    startPageUrl: "https://www.olx.ua/uk/",
    littleInterval: 1500,
    middleInterval: 3000, 
    bigInterval: 6000,
    forCookiesInterval: 20000,
    searchInput: "#search",
    searchButton: '[data-testid="search-submit"]',
    productCardSelector: '[data-cy="ad-card-title"] > a',
    nextButtonSelector: '[data-cy="pagination-forward"]',
    showPhoneButton: '[data-testid="ad-contact-phone"].css-1vgbwlu',
    contactPhone: '[data-testid="contact-phone"].css-v1ndtc',
    sellerName: 'h4.css-1lcz6o7'
}

module.exports = olxSettings; 