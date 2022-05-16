//fonction modulo comme dans python
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

//son
let soundplaying;

//def des variables globales
let myCanvas;
let spriteMap;
let chars;
let hats;
let eyes;
let characterBuild;
let previousBuild;

//liste des boutons et de leurs fonctions associées
let hitboxes = [];
const buttonWidth = 30;

let menu_open = false;
let screen_blob_url;
let screen_cnt = 0;

let dl_link = document.getElementById("blob_dl");

function screen() {
    menu_open = true;
    screen_blob_url = undefined;
    screen_cnt = 1
}


function preload() {
    //prechargement des textures depuis github
    spriteImg = loadImage('https://raw.githubusercontent.com/FuriousBird/furiousbird.github.io/main/game/sprites.png');
    spriteMap = loadJSON("https://raw.githubusercontent.com/FuriousBird/furiousbird.github.io/main/game/sprite.map.json");
    soundTrack = createAudio('https://raw.githubusercontent.com/FuriousBird/furiousbird.github.io/main/game/sound.mp3');
}

//une fois l'appli prête
function setup() {
    soundTrack.volume(0.2);
    //on associe sprite et images
    for (const [key, value] of Object.entries(spriteMap)) {
        console.log(`loading ${key}`);
        let img = spriteImg.get(value.pos[0], value.pos[1], value.size[0], value.size[1]);
        spriteMap[key]["img"] = img;
    }
    //on crée le personnage par defaut
    characterBuild = [0, 0, 4];
    //on fait la liste des differents chapeaux et yeux possibles
    chars = [spriteMap.bob, spriteMap.rob, spriteMap.mob, spriteMap.sob];
    hats = [
        spriteMap.coolHat,
        spriteMap.witchHat,
        spriteMap.coneHat,
        spriteMap.copHat,
        spriteMap.boxHat,
        spriteMap.duckHat,
        spriteMap.crownHat,
        spriteMap.shroomHat,
        spriteMap.glassHat
    ];
    eyes = [spriteMap.eyeDefaultMedium, spriteMap.eyeSeriousMedium, spriteMap.eyeWhiteMedium];
    myCanvas = createCanvas(400, 600);
    console.log(soundTrack);
}

//preview de sprite avec points de debugging & accessoires de perso
//utile pour écrire le sprite.map.json
function preview(sprite, pos, w) {
    let og_w = sprite.size[0] || 50;
    let og_h = sprite.size[1] || 50;
    let og_x = sprite.origin[0] || 0;
    let og_y = sprite.origin[1] || 0;
    let k = w / og_w;
    image(sprite.img, pos[0] - og_x * k, pos[1] - og_y * k, w, k * og_h);
    noFill();
    stroke("black");
    strokeWeight(2);
    rect(pos[0] - og_x * k, pos[1] - og_y * k, w, k * og_h);
    noStroke();
    fill("red");
    circle(pos[0], pos[1], 5);
    if (sprite.hat) {
        preview(spriteMap.coneHat, [pos[0] + sprite.hat[0] * k, pos[1] + sprite.hat[1] * k, 5], 100 * w / 100);
        noStroke();
        fill('rgb(0,255,0)');
        circle(pos[0] + sprite.hat[0] * k, pos[1] + sprite.hat[1] * k, 5);
    }
    if (sprite.eyeLevel) {
        let eyeSprite = spriteMap.eyeDefaultMedium;
        preview(eyeSprite, [pos[0] + sprite.eyeLevel[0] * k, pos[1] + sprite.eyeLevel[1] * k, 5], 30 * w / 100);
        preview(eyeSprite, [pos[0] - sprite.eyeLevel[0] * k, pos[1] + sprite.eyeLevel[1] * k, 5], 30 * w / 100);
        noStroke();
        fill('rgb(0,255,0)');
        circle(pos[0] + sprite.hat[0] * k, pos[1] + sprite.hat[1] * k, 5);
    }
}

//dessin de sprite simple sans debugging
function draw_sprite(sprite, pos, w) {
    let og_w = sprite.size[0] || 50;
    let og_h = sprite.size[1] || 50;
    let og_x = sprite.origin[0] || 0;
    let og_y = sprite.origin[1] || 0;
    let k = w / og_w;
    image(sprite.img, pos[0] - og_x * k, pos[1] - og_y * k, w, k * og_h);
}

//code comparaison de listes sur internet
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

//affichage du jeu
function render() {
    //verification que le sprite n'a pas changé
    let isnewbuild = !(arrayEquals(previousBuild, characterBuild));

    let charWidth = 100;
    let charSprite = chars[characterBuild[0].mod(chars.length)];
    let og_w = charSprite.size[0] || 50;
    let og_h = charSprite.size[1] || 50;
    let og_x = charSprite.origin[0] || 0;
    let og_y = charSprite.origin[1] || 0;
    let k = charWidth / og_w;
    let charHeight = k * og_h;
    let pos = [width / 2, height - 200];
    let displayX = pos[0] - og_x * k;
    let displayY = pos[1] - og_y * k;
    image(charSprite.img, displayX, displayY, charWidth, charHeight);

    /* noFill()
    stroke("black")
    strokeWeight(2)
    rect(pos[0] - og_x * k, pos[1] - og_y * k, w, k * og_h)
    noStroke()
    fill("red")
    circle(pos[0],pos[1],5) */
    let leftPos = [displayX - 20, displayY + charSprite.origin[1] * k - spriteMap.leftButton.size[1] * k / 2];
    let rightPos = [displayX + charWidth + 20, displayY + charSprite.origin[1] * k - spriteMap.rightButton.size[1] * k / 2];
    if (!menu_open) {
        draw_sprite(spriteMap.leftButton, leftPos, buttonWidth)
        draw_sprite(spriteMap.rightButton, rightPos, buttonWidth)
    }
    //on met a jour les hitbox des boutons
    if (isnewbuild) {
        console.log("del");
        hitboxes = []
        hitboxes.push([leftPos, () => {
            characterBuild[0] = (characterBuild[0] - 1).mod(chars.length)
        }])
        hitboxes.push([rightPos, () => {
            characterBuild[0] = (characterBuild[0] + 1).mod(chars.length)
        }])
    }
    //si le sprite a une position définie pour les yeux on les affiche
    if (charSprite.eyeLevel) {
        let eyeSprite = eyes[characterBuild[1].mod(eyes.length)]

        draw_sprite(eyeSprite, [pos[0] + charSprite.eyeLevel[0] * k, pos[1] + charSprite.eyeLevel[1] * k + 10], 30 * charWidth / 100)
        draw_sprite(eyeSprite, [pos[0] - charSprite.eyeLevel[0] * k, pos[1] + charSprite.eyeLevel[1] * k + 10], 30 * charWidth / 100)
            /* noStroke()
            fill('rgb(0,255,0)');
            circle(pos[0]+charSprite.hat[0]*k,pos[1]+charSprite.hat[1]*k,5) */
        leftPos = [displayX - 20, pos[1] + charSprite.eyeLevel[1] * k];
        rightPos = [displayX + charWidth + 20, pos[1] + charSprite.eyeLevel[1] * k];
        if (!menu_open) {
            draw_sprite(spriteMap.leftButton, leftPos, buttonWidth)
            draw_sprite(spriteMap.rightButton, rightPos, buttonWidth)
        }
        if (isnewbuild) {
            hitboxes.push([leftPos, () => {
                characterBuild[1] = (characterBuild[1] - 1).mod(eyes.length)
            }])
            hitboxes.push([rightPos, () => {
                characterBuild[1] = (characterBuild[1] + 1).mod(eyes.length)
            }])
        }
    }
    //si le sprite a une position définie pour le chapeau on l'affiche
    if (charSprite.hat) {
        let hatSprite = hats[characterBuild[2].mod(hats.length)]
        draw_sprite(hatSprite, [pos[0] + charSprite.hat[0] * k, pos[1] + charSprite.hat[1] * k], 100 * charWidth / 100)
            /* noStroke()
            fill('rgb(0,255,0)');
            circle(pos[0]+charSprite.hat[0]*k,pos[1]+charSprite.hat[1]*k,5) */
        leftPos = [displayX - 20, pos[1] + charSprite.hat[1] * k - 20];
        rightPos = [displayX + charWidth + 20, pos[1] + charSprite.hat[1] * k - 20];
        if (!menu_open) {
            draw_sprite(spriteMap.leftButton, leftPos, buttonWidth)
            draw_sprite(spriteMap.rightButton, rightPos, buttonWidth)
        }

        if (isnewbuild) {
            hitboxes.push([leftPos, () => {
                characterBuild[2] = (characterBuild[2] - 1).mod(hats.length)
            }])
            hitboxes.push([rightPos, () => {
                characterBuild[2] = (characterBuild[2] + 1).mod(hats.length)
            }])
        }
    }

    if (isnewbuild) {
        //Array.from() => shallow copy, snn il reste une référence à build
        previousBuild = Array.from(characterBuild);

    }

    if (screen_cnt > 0) {
        screen_cnt -= 1
        myCanvas.elt.toBlob(function(blob) {
            console.log(blob)
            let img = document.getElementById("char_image");
            //sur chrome/webkit c'est webkitURL

            //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_and_Operators#op%C3%A9rateur_conditionnel_ternaire
            //(condition ? val1 : val2) question de compatibilite
            let url = (window.URL ? URL : webkitURL).createObjectURL(blob);

            (window.URL ? URL : webkitURL).revokeObjectURL(screen_blob_url);

            screen_blob_url = url

            img.src = url;

            dl_link.href = url;
            dl_link.download = "character.png";
            document.getElementById("dl_popup").className = "";
        });
    }

    if (!menu_open) {
        let cam_pos = [pos[0], pos[1] + 50];
        draw_sprite(spriteMap.crownHat, cam_pos, 50)
        textAlign(CENTER, TOP)
        textSize(20)
        text("photo", cam_pos[0], cam_pos[1] + 20)
        hitboxes.push([cam_pos, () => {
            screen()
        }])
    }

}

//la boucle d'affichage
function draw() {
    //on efface tout
    clear();

    //affichage du jeu lui même
    render();
}

function mouseClicked() {
    if (!menu_open) {
        for (i of hitboxes) {
            pos = i[0]
            let xValid = (mouseX >= pos[0] - buttonWidth / 2 && mouseX <= pos[0] + buttonWidth / 2)
            let yValid = (mouseY >= pos[1] - buttonWidth / 2 && mouseY <= pos[1] + buttonWidth / 2)
            if (xValid && yValid) {
                i[1]()
                console.log("click")
                console.log(previousBuild, characterBuild);
                break
            }
        }
    }
    //on lance la musique lors du 1er clic pour ne pas demander de permissions au navigateur
    if (!soundplaying) {
        soundTrack.elt.loop = true;
        soundTrack.elt.play();
        if (navigator.mediaSession.release) {
            navigator.mediaSession.release();
        }
    }
    soundplaying = true;
}

//dl_popup est un élément qui prend l'entièreté de l'écran
//dans lequel s'affiche la popup de téléchargement du personnage
//il s'agit ici de détecter si on clique dessus (à coté de la popup) afin de la fermer
let dl_popup = document.getElementById("dl_popup");
let popup_quit = document.getElementById("quit");
dl_popup.addEventListener("click", (e) => {
    //si l'element sélectionné n'est ni le bouton quitter, ni l'exterieur de la popup
    if (e.target !== dl_popup &&  e.target !== popup_quit) {
        return; //on quitte la fonction
    }
    //sinon si le menu est ouvert:
    if (menu_open) {
        console.log("e")
        menu_open = false;
        screen_blob_url = undefined;
        document.getElementById("dl_popup").className = "hidden";
    }
})

//ici on pause le son lorsque l'on quitte l'onglet ou change d'application
//TODO comment détecter mise en veille sur téléphone?
document.addEventListener('visibilitychange', e => {
    if (soundplaying) {
        if (document.visibilityState == "hidden") {
            soundTrack.elt.pause()
        } else {
            setTimeout(() => {
                if (document.visibilityState == "visible") { soundTrack.elt.play() }
            }, 500);

        }

    }
});