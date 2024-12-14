const rozetkaSettings = {
    startPageUrl: "https://rozetka.com.ua/ua",
    littleInterval: 1000,
    middleInterval: 3000, 
    bigInterval: 6000,
    otherSellersInterval: 12000,  /* ("Other sellers" button takes a very long time to load if there are many sellers) */
    searchInput: ".search-form__input.ng-untouched.ng-pristine.ng-valid",
    searchButton: ".button.button_color_green.button_size_medium.search-form__submit",
    confirmAgeButton: ".button.button--medium.popup-content__button.button--green.ng-star-inserted",
    productCardSelector: "rz-indexed-link.product-link.goods-tile__heading a",  /* (!!! If the parser returns an empty object, this selector needs to be checked first; it is often changed on the website (link from the product card)) */
    nextButtonSelector: "a.button.button--gray.button--medium.pagination__direction.pagination__direction--forward.ng-star-inserted",
    anotherSellersRuButtonSelector: '[data-id="Другие продавцы"]',
    anotherSellersUaButtonSelector: '[data-id="Інші продавці"]',
    linkToSellerPageSelector: ".seller-title > .min-w-0.ng-star-inserted > .ng-star-inserted",
    sellerShopName: ".seller__heading.ng-star-inserted",
}

module.exports = rozetkaSettings;