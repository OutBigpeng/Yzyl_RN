// @flow

// leave off @2x/@3x
const images = {
        iconSupportActive: require('../imgs/navigator/technical_support_disable.png'),
        iconSupport: require('../imgs/navigator/technical_support_normal.png'),
        iconShop: ISSHOWCART ? require('../imgs/navigator/shoping.png') : require('../imgs/navigator/favorite.png'),
        iconShopActive: ISSHOWCART ? require('../imgs/navigator/shopingSel.png') : require('../imgs/navigator/favoriteSel.png'),
        iconProduct: require('../imgs/navigator/findProduct.png'),
        iconProductActive: require('../imgs/navigator/findProductSel.png'),
        iconMine: require('../imgs/navigator/user.png'),
        iconMineActive: require('../imgs/navigator/userSel.png'),
        iconHome: require('../imgs/navigator/home.png'),
        iconHomeSelected: require('../imgs/navigator/homeSelected.png'),
        iconInterlocution: require('../imgs/navigator/interlocution.png'),
        iconInterlocutionActive: require('../imgs/navigator/interlocutionSelected.png')

        // iconAdd: require('../img/iconAdd.png'),
        // iconAudio: require('../img/iconAudio.png'),
        // iconCamera: require('../img/iconCamera.png'),
        // iconEmoji: require('../img/iconEmoji.png'),
        // iconEmojiActive: require('../img/iconEmojiActive.png'),
        // iconFile: require('../img/iconFile.png'),
        // iconLocation: require('../img/iconLocation.png'),
        // iconImage: require('../img/iconImage.png'),
    }
    ;

export default images;
