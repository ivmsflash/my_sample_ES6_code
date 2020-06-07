/* eslint-disable indent */
import * as PIXI from "pixi.js";
import initRenderer from "./initRenderer";
import preloadResources from "./preloadResources";
import getTexture from "./getTexture";
import Lobby from "./game/Lobby";
import * as Power3 from "gsap";
import * as TweenLite from "gsap";
import PreloaderGame from "./PreloaderGame";
import Socket from "./server/Socket";
import SocialNetworkConnector from "./social/SocialNetworkConnector";
import ServerAPI from "./server/ServerAPI";
import Utils from "./common/Utils";
import Sounds from "./sounds/Sounds";
import * as Config from "./common/Config";
import Error from "./game/alert/Error";

// "Global" variables we need to use across multiple functions
export let hintCont;
export let lobbyCont;
export let preloaderCont;
export let errorCont;
export let cursorCont;
export let LOBBY;

export let stage;
export let RENDERER;

export let SERVERAPI;
export let SOCKET;

export let SOUND;

let mainContainer = null;
let prel;

//для масштабирования
let lastW, lastH;
const lastS = 1;

// Define the main game loop
const redraw = (time, renderer) => {

    // Redraw when browser is ready
    requestAnimationFrame(t => redraw(t, renderer));
    // Render the scene
    renderer.render(stage);
};

/**
 *  Set up the game after the window and resources have finished loading.
 *  Creates the renderer, sets up the stages, and performs the initial render.
 */
const setup = () => {

    RENDERER = initRenderer();
    console.log('renderer done!');
    // Create a container object called the `stage`
    hintCont = new PIXI.Container();
    hintCont.interactive = true;
    cursorCont = new PIXI.Container();
    cursorCont.interactive = true;
    lobbyCont = new PIXI.Container();
    preloaderCont = new PIXI.Container();
    errorCont = new PIXI.Container();

    mainContainer = new PIXI.Container();

    stage = new PIXI.Container();
    stage.addChild(mainContainer);
    //
    const fon = new PIXI.Graphics();
    fon.beginFill(0xffffff, 1);
    fon.drawRect(0, 0, 1700, 950);
    mainContainer.addChild(fon);
    mainContainer.addChild(lobbyCont);
    mainContainer.addChild(preloaderCont);
    mainContainer.addChild(hintCont);
    mainContainer.addChild(errorCont);
    mainContainer.addChild(cursorCont);
    //
    SERVERAPI = new ServerAPI(nextLoading);
    //
    const defaultIcon = "url('images/cursor.png'),auto";
    const hoverIcon = "url('images/cursor.png'),auto";

    // Add custom cursor styles
    RENDERER.plugins.interaction.cursorStyles.default = defaultIcon;
    RENDERER.plugins.interaction.cursorStyles.pointer = hoverIcon;
    //
    // Perform initial render
    redraw(-1, RENDERER);
    //
    makeResponsive();
};

const selectGameFunc = (num) => {
    console.log(num);
    TweenLite.to(LOBBY, 0.3, {
        alpha: 0, ease: Power3.easeOut, onComplete: () => {
            lobbyCont.removeChild(LOBBY);
        }
    });

};

/* ---------- Initialisation ---------- */
const nextLoading = () => {
    // Список ресурсов для загрузки
    const resources = [
        "fonts/ArialBold.eot",
        "fonts/ArialBold.otf",
        "fonts/ArialBold.svg",
        "fonts/ArialBold.ttf",
        "fonts/ArialBold.woff",
        "fonts/ArialBold.woff2",
        "fonts/MullerBold.eot",
        "fonts/MullerBold.otf",
        "fonts/MullerBold.svg",
        "fonts/MullerBold.ttf",
        "fonts/MullerBold.woff",
        "fonts/MullerBold.woff2",
        "fonts/MullerRegular.eot",
        "fonts/MullerRegular.otf",
        "fonts/MullerRegular.svg",
        "fonts/MullerRegular.ttf",
        "fonts/MullerRegular.woff",
        "fonts/MullerRegular.woff2",
        "fonts/MyriadProBold.eot",
        "fonts/MyriadProBold.otf",
        "fonts/MyriadProBold.svg",
        "fonts/MyriadProBold.ttf",
        "fonts/MyriadProBold.woff",
        "fonts/MyriadProBold.woff2",
        "fonts/MyriadProIt.eot",
        "fonts/MyriadProIt.otf",
        "fonts/MyriadProIt.svg",
        "fonts/MyriadProIt.ttf",
        "fonts/MyriadProIt.woff",
        "fonts/MyriadProIt.woff2",
        "images/board.png",
        "images/buttons/button.png",
        "images/buttons/yes.png",
        "images/buttons/yes2.png",
        "images/buttons/wait.png",
        "images/buttons/ok.png",
        "images/buttons/catname.png",
        "images/scroll/bar.png",
        "images/scroll/pip.png",
        "images/fon.jpg",
        "images/temp.png",
        "images/overfon.png",
        "images/prize_fon.png",
        "images/prize_icon.png",
        "images/mini_game.png",
        "images/anim.png",
        "images/start.png",
        "images/errorfon.png",
        "images/room/b1.png",
        "images/room/b2.png",
        "images/room/b3.png",
        "images/room/b4.png",
        "images/room/b5.png",
        "images/room/b6.png",
        "images/room/b7.png",
        "images/room/b8.png",
        "images/room/b9.png",
        "images/room/b10.png",
        "images/room/bar.png",
        "images/room/bar_fon.png",
        "images/room/buy_cat.png",
        "images/room/cat.png",
        "images/room/close.png",
        "images/room/down_line.png",
        "images/room/edit.png",
        "images/room/gift.png",
        "images/room/help_text.png",
        "images/room/help_title.png",
        "images/room/left.png",
        "images/room/letter.png",
        "images/room/letter_count.png",
        "images/room/mow.png",
        "images/room/open.png",
        "images/room/photo.png",
        "images/room/rating.png",
        "images/room/rating_fon.png",
        "images/room/right.png",
        "images/room/scroll_bar.png",
        "images/room/scroll_pip.png",
        "images/room/star.png",
        "images/room/star2.png",
        "images/room/status_fon.png",
        "images/room/to_window.png",
        "images/room/top_btn_fon.png",
        "images/room/update_fon.png",
        "images/room/user_fon.png",
        "images/room/plus.png",
        "images/room/fon/fon1.png",
        "images/room/fon/butterfly.png",
        "images/room/fon/CatWall.png",
        "images/room/fon/forest_1.png",
        "images/room/fon/scotch.png",
        "images/room/fon/space1.png",
        "images/room/fon/star_dark1.png",
        "images/room/fon/vors.png",
        "images/room/cats/grey_cat.png",
        "images/room/cats/Red_cat.png",
        "images/room/cats/grey_cat.json",

        "images/anim/cat/grey_applod_niz.json",
        "images/anim/cat/grey_applod_niz.png",
        "images/anim/cat/grey_drop_lapa.json",
        "images/anim/cat/grey_drop_lapa.png",
        "images/anim/cat/grey_est.json",
        "images/anim/cat/grey_est.png",
        "images/anim/cat/grey_est_up.json",
        "images/anim/cat/grey_est_up.png",
        "images/anim/cat/grey_gladim.json",
        "images/anim/cat/grey_gladim.png",
        "images/anim/cat/grey_go.json",
        "images/anim/cat/grey_go.png",
        "images/anim/cat/grey_go_to_sleep.json",
        "images/anim/cat/grey_go_to_sleep.png",
        "images/anim/cat/grey_idle_sit.json",
        "images/anim/cat/grey_idle_sit.png",
        "images/anim/cat/grey_idle_stay.json",
        "images/anim/cat/grey_idle_stay.png",
        "images/anim/cat/grey_jump.json",
        "images/anim/cat/grey_jump.png",
        "images/anim/cat/grey_not_gladim.json",
        "images/anim/cat/grey_not_gladim.png",
        "images/anim/cat/grey_okno_vniz.json",
        "images/anim/cat/grey_okno_vniz.png",
        "images/anim/cat/grey_okno_vverh.json",
        "images/anim/cat/grey_okno_vverh.png",
        "images/anim/cat/grey_sit_down.json",
        "images/anim/cat/grey_sit_down.png",
        "images/anim/cat/grey_sit_front.json",
        "images/anim/cat/grey_sit_front.png",
        "images/anim/cat/grey_sit_obida.json",
        "images/anim/cat/grey_sit_obida.png",
        "images/anim/cat/grey_sit_turn_to_left.json",
        "images/anim/cat/grey_sit_turn_to_left.png",
        "images/anim/cat/grey_sleep.json",
        "images/anim/cat/grey_sleep.png",
        "images/anim/cat/grey_stand_up.json",
        "images/anim/cat/grey_stand_up.png",
        "images/anim/cat/grey_turn_to_front.json",
        "images/anim/cat/grey_turn_to_front.png",
        "images/anim/cat/grey_ugly.json",
        "images/anim/cat/grey_ugly.png",
        "images/anim/cat/grey_wake_up.json",
        "images/anim/cat/grey_wake_up.png",

        "images/anim/woman/go/go_left.json",
        "images/anim/woman/go/go_left.png",
        "images/anim/woman/go/walk_b_Left.json",
        "images/anim/woman/go/walk_b_Left.png",
        "images/anim/woman/go/walk_f_right.json",
        "images/anim/woman/go/walk_f_right.png",
        "images/anim/woman/go/walk_profil.json",
        "images/anim/woman/go/walk_profil.png",
        "images/anim/woman/shvabra/shvabra_b_L.json",
        "images/anim/woman/shvabra/shvabra_b_L.png",
        "images/anim/woman/shvabra/shvabra_f_L.json",
        "images/anim/woman/shvabra/shvabra_f_L.png",
        "images/anim/woman/shvabra2/shvabra_two.json",
        "images/anim/woman/shvabra2/shvabra_two.png",
        "images/anim/woman/sit/sit_f_L.json",
        "images/anim/woman/sit/sit_f_L.png",
        "images/anim/woman/sit/sitDown_f_L.json",
        "images/anim/woman/sit/sitDown_f_L.png",
        "images/anim/woman/sit/sitUp_f_L.json",
        "images/anim/woman/sit/sitUp_f_L.png",
        "images/anim/woman/sleep/sleep.json",
        "images/anim/woman/sleep/sleep.png",
        "images/anim/woman/sleep/sleep1.json",
        "images/anim/woman/sleep/sleep1.png",
        "images/anim/woman/sleep/sleep2.json",
        "images/anim/woman/sleep/sleep2.png",
        "images/anim/woman/stay/right_stay.json",
        "images/anim/woman/stay/right_stay.png",
        "images/anim/woman/stay/stay_b.json",
        "images/anim/woman/stay/stay_b.png",
        "images/anim/woman/stay/stay_b_L.json",
        "images/anim/woman/stay/stay_b_L.png",
        "images/anim/woman/stay/stay_f.json",
        "images/anim/woman/stay/stay_f.png",
        "images/anim/woman/stay/stay_f_L.json",
        "images/anim/woman/stay/stay_f_L.png",
        "images/anim/woman/stay/stay_profil.json",
        "images/anim/woman/stay/stay_profil.png",
        "images/anim/woman/stay/stay2_f_L.json",
        "images/anim/woman/stay/stay2_f_L.png",
        "images/anim/woman/stay/stay3_f_L.json",
        "images/anim/woman/stay/stay3_f_L.png",
        "images/anim/woman/stay/stay4_f_L.json",
        "images/anim/woman/stay/stay4_f_L.png",
        "images/anim/woman/take/take_b_L.json",
        "images/anim/woman/take/take_b_L.png",
        "images/anim/woman/take/take_f_L.json",
        "images/anim/woman/take/take_f_L.png",
        "images/anim/woman/take/takeDown_b_L.json",
        "images/anim/woman/take/takeDown_b_L.png",
        "images/anim/woman/take/takeDown_f_L.json",
        "images/anim/woman/take/takeDown_f_L.png",
        "images/anim/woman/take/takeUp_b_L.json",
        "images/anim/woman/take/takeUp_b_L.png",
        "images/anim/woman/take/takeUp_f_L.json",
        "images/anim/woman/take/takeUp_f_L.png",
        "images/anim/woman/venik/venik_b_L.json",
        "images/anim/woman/venik/venik_b_L.png",
        "images/anim/woman/venik/venik_f_L.json",
        "images/anim/woman/venik/venik_f_L.png",
        "images/anim/woman/venik/venikDown_b_L.json",
        "images/anim/woman/venik/venikDown_b_L.png",
        "images/anim/woman/venik/venikUp_f_L.json",
        "images/anim/woman/venik/venikUp_f_L.png",

        "images/player_buttons.png"
    ];
    //
    prel = preloaderCont.addChild(new PreloaderGame());
    //
    SOUND = new Sounds();
    //
    preloadResources(resources, () => {
        window.social = new SocialNetworkConnector(() => {
            SOCKET = new Socket(addLobby);
        });
    }, (pr) => {
        if(!prel) return;
        prel.update(pr);
    });
};

const addLobby = () => {
    setTimeout(() => {
        LOBBY = new Lobby(selectGameFunc);
        LOBBY.alpha = 0;
        lobbyCont.addChild(LOBBY);
        TweenLite.to(LOBBY, 0.5, {
            alpha: 1,
            //delay: Number(Config.SETTINGS.pauseAfterLoading),
            ease: Power3.easeOut,
            onComplete: () => {
                prel.clear();
                clearHint();
                preloaderCont.removeChild(prel);
                prel = null;
                SOUND.playRandom();
            }
        });
    }, Number(Config.SETTINGS.pauseAfterLoading)*1000);

};

export function showError(txt, title)
{
    //errorCont.removeChildren();
    errorCont.addChild(new Error(txt, title));
}

export function showAlert(txt, title)
{
    //errorCont.removeChildren();
    errorCont.addChild(new Error(txt, title));
}

export function clearHint()
{
    hintCont.removeChildren();
    //document.off('mousemove');
}

// Wait until the page is fully loaded
window.addEventListener("load", () => {
    //custom font load
    const WebFont = require('webfontloader');
    WebFont.load({
        custom: {
            families: ['MullerBold', 'MullerRegular', 'MyriadProIt', 'MyriadProBold', 'ArialBold'],
            urls: ['css/font.css'],
        },
        active: setup
    });
});

function makeResponsive() {
    const scaleType = 1;
    //true,1
    let lastW;
    let lastH;
    let lastS = 1;
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function resizeCanvas() {
        const wmin = 870;
        const wmax = 1700;
        const w = 1700;
        const h = 950;
        const iw = window.innerWidth, ih = window.innerHeight;
        console.log(iw, ih);
        const pRatio = window.devicePixelRatio || 1, yRatio = ih / h;
        const xRatio = iw / w;

        let sRatio = yRatio;
        //
        if (sRatio > 1) sRatio = 1;

        const contDiv = document.getElementById("main");
        if (!contDiv) return;

        const sc = 1;//pRatio * sRatio;

        const ww = w * sc;
        const hh = h * sc;

        window._scale = sc;
        window._width = ww;
        window._height = hh;

        contDiv.style['margin-left'] = -(ww - iw)*0.5;
        RENDERER.resize(ww, hh);
        stage.scale.set(sc);

        lastW = iw;
        lastH = ih;
        lastS = sRatio;
    }
}