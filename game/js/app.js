//fonction modulo comme dans python
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

//fonction de easing
function easeInOutSine(x) {
    return -(cos(PI * (x + 1)) - 1) / 2;
}

var pressedKeys = {};

function getFittedObjSizeInfo(obj) {
    const obj_size = obj.getBoundingClientRect();
    const og_width = obj.width
    const og_height = obj.height
    const og_ratio = og_height / og_width
    const w = obj_size.width
    const h = obj_size.height
    const new_ratio = h / w
    if (new_ratio > og_ratio) {
        var display_w = w;
        var display_h = og_ratio * w;
    } else {
        var display_h = h;
        var display_w = (1 / og_ratio) * h;
    };

    let f1 = display_w / og_width
    let f2 = display_h / og_height

    let delta_h = h - display_h
    let delta_w = w - display_w
    return [f1, f2, delta_h, delta_w]
}

let scene = 1;

//son
let soundplaying;
let stomp;

//def des variables globales
let myCanvas;
let spriteMap;
let chars;
let hats;
let eyes;
let characterBuild;
let previousBuild;
let camera_icon_pos;

let charSprite;

//liste des boutons et de leurs fonctions associées
let hitboxes = [];
const buttonWidth = 50;

let menu_open = false;
let screen_blob_url;
let screen_cnt = 0;

let dl_link = document.getElementById("blob_dl");

//CODE DE L'APPLI
//prendre une capture et ouvrir le menu capture
function screen() {
    menu_open = true;
    screen_blob_url = undefined;
    screen_cnt = 1
}

function preload() {
    //prechargement des textures depuis github
    spriteImg = loadImage('game/sprites.png');
    spriteMap = loadJSON("game/sprite.map.json");
    soundTrack = createAudio('game/sound.mp3');
    stomp = createAudio('game/stomp.mp3');
    stomp.volume(0.2)

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
    maps = [{
            area: [-200, 2300, 0],
            objects: {
                back: [
                    [spriteMap.bush, 250, -60, 512, 1.02],
                    [spriteMap.pillar, 200, -60, 227, 1.04],
                    [spriteMap.bush, 200, -30, 200, 1.06],
                    [spriteMap.pillar, 600, -120, 180, 1.01],
                    [spriteMap.bush, 800, -60, 400, 1.03],
                    [spriteMap.pillar, 900, -60, 250, 1.06],
                    [spriteMap.rock, 850, -45, 350, 1.08],
                    [spriteMap.david, 500, -60, 200, 1.05],
                    [spriteMap.picture_1, 480, -300, 80, 1.06],
                    [spriteMap.bush, 500, -30, 300, 1.08], //here ends the first area
                    [spriteMap.bush, 1650, -100, 256, 1.01],
                    [spriteMap.shroom, 1500, -150, 400, 1.02],
                    [spriteMap.shroom, 1800, -100, 300, 1.02],
                    [spriteMap.bush, 1400, -60, 256, 1.04],
                    [spriteMap.rock2, 1500, -60, 300, 1.05],
                    [spriteMap.shroom, 1600, -100, 250, 1.06],
                    [spriteMap.bush, 1700, -60, 300, 1.07],
                    [spriteMap.moss, 1400, 0, 300, 1.07],
                    [spriteMap.rock, 1550, -30, 250, 1.08],
                    
                ],
                front: [
                    [spriteMap.shroom, 1000, 250, 720, 2.5],
                    [spriteMap.bush, 1600, 300, 720, 2],
                    [spriteMap.cloud, 1600, -900, 512, 1.1],
                    [spriteMap.cloud, 1800, -1300, 256, 1.1]
                ]
            },
            platforms: [
                [900, -1030, 200],
                [1550, -200, 200],
                [1600, -430, 150],
                [1800, -550, 150],
                [1500, -730, 200],
                [1600, -900, 400],
            ],
            coins: [
                [1550, -260, 1.08],
                [1600, -500, 1.06],
                [1800, -600, 1.03],
                [1600, -1000, 1.02],
                [1364, -6152, rocket_parallax],//space coins from here included
                [2033, -5667, rocket_parallax],
                [2098, -4315, rocket_parallax],
                [1714, -3590, rocket_parallax],
                [1082, -3002, rocket_parallax],
                [906, -2133, rocket_parallax],
                [904, -1872, rocket_parallax],
                // [903, -1801, rocket_parallax],
                [902, -1440, rocket_parallax],

                
                
                
                
                
                
                
                
            ],
            options: {
                camfollow: true
            },
            exit: {
                exitpoint: [
                    1050, -5000
                ],
                exitindex: 1
            }
        },
        {
            area: [-200, 2000, 0],
            objects: {
                back: [
                    [spriteMap.moon, 0, 680, 1400, 1],
                    [spriteMap.credits, 0, -300, 300, 1],
                    
                ],
                front: [
                    [spriteMap.wallace, 400, 300, 700, 1],
                ]
            },
            platforms: [ ],
            coins: [],
            options: {
                bg: [46, 0, 61],
                campos: [0, 0],
                playerpos: [0,0],
                playermove: false,
                camfollow: false
            }
        }
    ];
    pixelDensity(1);
    myCanvas = createCanvas(1080, 720);
    myCanvas.elt.style = "";
    document.addEventListener("click", handleMouse)
    console.log(soundTrack);
    camera_icon_pos = [width - 50, 50];
    prevTime = new Date()
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
    sprite = null
}

//code comparaison de listes sur internet
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function changeScene(x) {
    if (x == 1) {
        previousBuild = [NaN, NaN, NaN]
    }
    hitboxes = []
    scene = x
}

//affichage du jeu
function handleMenu() {
    //verification que le sprite n'a pas changé
    let isnewbuild = !(arrayEquals(previousBuild, characterBuild));

    let charWidth = 100;
    charSprite = chars[characterBuild[0].mod(chars.length)];
    let og_w = charSprite.size[0] || 50;
    let og_h = charSprite.size[1] || 50;
    let og_x = charSprite.origin[0] || 0;
    let og_y = charSprite.origin[1] || 0;
    let k = charWidth / og_w;
    let charHeight = k * og_h;
    let pos = [width / 2, height / 2 + 100];
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
            if (isnewbuild) {
                hitboxes.push([leftPos, () => {
                    characterBuild[1] = (characterBuild[1] - 1).mod(eyes.length)
                }])
                hitboxes.push([rightPos, () => {
                    characterBuild[1] = (characterBuild[1] + 1).mod(eyes.length)
                }])
            }
        }

    }
    //si le sprite a une position définie pour le chapeau on l'affiche
    if (charSprite.hat) {
        let hatSprite = hats[characterBuild[2].mod(hats.length)];
        draw_sprite(hatSprite, [pos[0] + charSprite.hat[0] * k, pos[1] + charSprite.hat[1] * k], 100 * charWidth / 100)
            /* noStroke()
            fill('rgb(0,255,0)');
            circle(pos[0]+charSprite.hat[0]*k,pos[1]+charSprite.hat[1]*k,5) */
        leftPos = [displayX - 20, pos[1] + charSprite.hat[1] * k - 20];
        rightPos = [displayX + charWidth + 20, pos[1] + charSprite.hat[1] * k - 20];
        if (!menu_open) {
            draw_sprite(spriteMap.leftButton, leftPos, buttonWidth);
            draw_sprite(spriteMap.rightButton, rightPos, buttonWidth);
            if (isnewbuild) {
                hitboxes.push([leftPos, () => {
                    characterBuild[2] = (characterBuild[2] - 1).mod(hats.length);
                }]);
                hitboxes.push([rightPos, () => {
                    characterBuild[2] = (characterBuild[2] + 1).mod(hats.length);
                }]);
            };
        };


    };

    if (isnewbuild) {
        //Array.from() => shallow copy, snn il reste une référence à build
        previousBuild = Array.from(characterBuild);

    }

    if (!menu_open) {
        let _ = [pos[0] + 10, pos[1] + 50];
        let buttonImg = spriteMap.play_button;
        let buttonWidth = 120;
        draw_sprite(buttonImg, _, 120);
        let r = buttonImg.size[1] / buttonImg.size[0];
        if (isnewbuild) {
            hitboxes.push(
                [
                    _,
                    () => {
                        changeScene(0);
                    },
                    [buttonWidth, Math.trunc(buttonWidth * r)]
                ]
            );
        }

    }

}

//VARIABLES DE JEU

function collidesWith(platform, prev_pos, delta_tmp) {
    let pT = platform[1]; // altitude de la plateforme
    let dB = prev_pos; //bas du joueur

    //soit la valeur absolue de la distance joueur-plateforme > 0
    //si le joueur monte, delta y est négatif et la 1re condition ne peut pas étre verifiée 
    //si le joueur descend, delta y est positif et si il est supérieur à la distance entre joueur et palteforme il y a collision
    //il suffit ensuite de vérifier que le joueur n'est pas passé à coté de la plateforme en tombant, avec la 2nde condition
    let pLX = platform[0] - platform[2] / 2 // position du coin gauche de la plateforme
    let display_plat_pos = [(pLX - cam_pos[0]) * 1 + width / 2, (pT - cam_pos[1]) * 1 + height / 2 + 100];
    // strokeWeight(4);
    //line(display_plat_pos[0],display_plat_pos[1],display_plat_pos[0]+platform[2] ,display_plat_pos[1]);

    if (Math.abs(pT - dB) <= delta_tmp && (pT >= dB)) {
        let pLX = platform[0] - platform[2] / 2 // position du coin gauche de la plateforme
        let pRX = (pLX + platform[2]) // position du coin droit de la plateforme // (positionx plateforme + largeur)
        let dLX = player_pos[0] - playerW / 2 // position du joueur a partir du coin gauche
        let dRX = dLX + playerW // position du coin droit dy joueur (pos x du  joueur + largeur)
            // stroke(0, 204, 255);

        if ((pRX >= dLX && dLX >= pLX) || (pRX >= dRX && dRX >= pLX)) { // si les deux delta x sont confondus il y a bien collision
            stroke(0, 204, 0);
            return true
        };
    };
    return false
};

const general_offset_y = 100;

let m = 70;
let g = 9.81;
let player_vel = [0, 0];
let player_pos = [0, 0];
let playerDisplayPos;
let cam_pos = [0, -600]
let player_rot = 0;
let playerW = 100;

let max_hor_vel = 350;
let player_accel = 40;
let midair = false;

let maps;
let defaultPlayerDepth = 1;
let playerDepth = defaultPlayerDepth;

let coin_size = 145;
let coin_delta_y = 20;

let exit_radius = 2000;
let add_radius = 0;

let exit_particles;
let exit_particle_count = 300;
let particle_life = 7;
let particle_life_rnd = 7;
let particle_speed = 300;
let particle_size = 50;

let exit_effect_radius = 3000;
let exit_effect_end = 200;

//rocket vars

let rocket_pos;
let rocket_vel = 0;
let rocket_grav_vel = [0,0];
let rocket_rot = 0;
let rocketDisplayPos;
let inRocket;
let rocket_last_interact;
let rocket_boundary = [250, 280]
let rocket_parallax = 1.06; 
let rocket_enter_time;
let rocket_enter_delay = 1000;
let rocket_launch_delay = 3000;
let rocket_liftoff_delay = 4000;
let rocket_launch_duration = 5000;
let rocket_base_speed = 200;
let rocket_max_speed = 400;
let rocket_min_speed = 100;
let rocket_particles;
let max_rocket_fuel = 30000;
let rocket_fuel = max_rocket_fuel;


let rocket_enter_progress;
let can_enter_rocket = true;

function groundcollide() {
    if (midair){
        stomp.play()
    }
    midair = false;
    
    player_vel[1] = 0;
}

function getExitParticle(origin) {
    //x,y,angle, life
    return [origin[0], origin[1], Math.random() * Math.PI * 2, particle_life + Math.random() * particle_life_rnd]
}

function draw_player(){
    //draw the player
    translate(playerDisplayPos[0], playerDisplayPos[1]);
    if (player_vel[0] > 0) {
        scale(-1, 1);
    }
    rotate(PI / 180 * Math.abs(player_rot));
    draw_sprite(charSprite, [0, 0], playerW);
    let eyeSprite = eyes[characterBuild[1].mod(eyes.length)];
    let og_w = charSprite.size[0] || 50;
    let k = playerW / og_w;
    draw_sprite(eyeSprite, [charSprite.eyeLevel[0] * k, charSprite.eyeLevel[1] * k + 10], 30);
    draw_sprite(eyeSprite, [-charSprite.eyeLevel[0] * k, charSprite.eyeLevel[1] * k + 10], 30);
    let hatSprite = hats[characterBuild[2].mod(hats.length)];
    draw_sprite(hatSprite, [charSprite.hat[0] * k, charSprite.hat[1] * k], 1.2 * playerW)
    // fill("red")
    // noStroke()
    // rect(-5, -5,10,10)
    resetMatrix();

}

function draw_rocket(){
    //draw the rocket
    rocketDisplayPos = [(rocket_pos[0]-cam_pos[0])*rocket_parallax+ width / 2, (rocket_pos[1]-cam_pos[1])*rocket_parallax+ height / 2+100]
    
    translate(rocketDisplayPos[0], rocketDisplayPos[1]);
    rotate(PI / 180 * rocket_rot);
    draw_sprite(spriteMap.rocket, [0, 0], 256);
    // fill("red")
    // noStroke()
    // rect(-5, -5,10,10)
    
    // noFill()
    // stroke("red")
    // rect(-rocket_boundary[0]/2, -rocket_boundary[1]/2, rocket_boundary[0], rocket_boundary[1])
    resetMatrix();
}

function exit_rocket(can_enter_again=true){
    rocket_enter_time = undefined;
    inRocket = false;
    can_enter_rocket = can_enter_again;
}

let occlusion;

function handleDrawGame(playerDisplayPos, charSprite, options) {
    //rocket logic

    if (mapIndex !== prev_mapIndex ){
        exit_rocket()
        rocket_fuel = max_rocket_fuel;
        rocket_particles = undefined;
        if (mapData.options) {
            if (mapData.options.campos){
                cam_pos = mapData.options.campos;
            }
            if (mapData.options.playerpos){
                player_pos = mapData.options.playerpos;
            }
        }
        
        if(mapIndex===0){
            rocket_pos = [900, -1150]
            rocket_particles = [];
        }

        if(mapIndex===1){
            occlusion = 1;
        }
        
    }

    if (occlusion){
        transition_value_array.push(occlusion)
        occlusion *= 0.9
    }

    if(mapIndex===0){
        draw_rocket()
        let rocket_draw_time = millis()

        //this is not called again once you enter the rocket, meaning it doesn't reset the rocket enter_time if you leave it's area
        if(!inRocket && can_enter_rocket){
            let enter_x_valid = rocket_pos[0]-rocket_boundary[0]/2<player_pos[0] && rocket_pos[0]+rocket_boundary[0]/2>player_pos[0];
            let enter_y_valid = rocket_pos[1]-rocket_boundary[1]/2<player_pos[1] && rocket_pos[1]+rocket_boundary[1]/2>player_pos[1];
            if(enter_x_valid && enter_y_valid){
                if(!rocket_enter_time){
                    rocket_enter_time = rocket_draw_time + rocket_enter_delay
                }
            } else{
                rocket_enter_time = undefined;
            }

            if (rocket_enter_time && rocket_draw_time-rocket_enter_time>=0){
                inRocket = true;
            }
        }

        //transition to hide the player dissapearing
        if(rocket_enter_time){
            rocket_enter_progress = easeInOutSine(Math.min(1,Math.max(-1,(rocket_draw_time-rocket_enter_time)/(rocket_enter_delay))));
        } else{
            rocket_enter_progress = rocket_enter_progress*0.9
        }
        transition_value_array.push(rocket_enter_progress); // between 0 and 1

        
        
    
        
        if(rocket_particles && inRocket){
            for (let i = rocket_particles.length-1; i >= 0; i--) {
                let p = rocket_particles[i];
                p[0] += p[2]*deltaTime;
                p[1] += p[3]*deltaTime;
                p[4] -= deltaTime*1000;
                if (p[4]<0) {
                    rocket_particles.splice(i, 1);
                } else{
                    noStroke()
                    strokeWeight(2);
                    let start = color(130, 222, 255)
                    let end = color(255, 178, 130)
                    let particle_color = lerpColor(start, end, 1-Math.min(p[4]/3000),1)
                    fill(particle_color);
                    ellipse((p[0]-cam_pos[0])*rocket_parallax+width/2, (p[1]-cam_pos[1])*rocket_parallax+height/2+100, 30, 30);
                }
            }
        
            if (rocket_particles.length <100){
                let d = 100;
                let delta_y = -150;
                let x_random = random(-0.3,0.3);
                let y_random = random(0.5,3);
                let rocket_rad = (rocket_rot+90)/180*PI
                rocket_particles.push([rocket_pos[0]-cos(rocket_rad)*delta_y,rocket_pos[1]-sin(rocket_rad)*delta_y, (y_random*Math.cos(rocket_rad)+x_random*Math.cos(rocket_rad+PI/2))*d, (y_random*Math.sin(rocket_rad)+x_random*Math.sin(rocket_rad+90))*d, random(2000,2500)]);
            }
        }    
    }

    if (mapIndex===1){
        tint(255, 150);
        draw_sprite(spriteMap.creation, [width/2,height/2], 1100)
        noTint()
        draw_rocket()
        can_enter_rocket = false;
        rocket_pos = [-200,0];
        rocket_rot = -30;
    }
    
    

    

    

    //draw the back objects
    for (let index = 0; index < mapData.objects.back.length; index++) {
        const element = mapData.objects.back[index];
        draw_sprite(element[0], [(element[1] - cam_pos[0]) * element[4] + width / 2, (element[2] - cam_pos[1]) * element[4] + height / 2 + general_offset_y], element[3])
    }

    //draw the coins
    for (let index = 0; index < mapData.coins.length; index++) {
        const element = mapData.coins[index];
        if (element !== null) {
            let dist_to_player = Math.sqrt((player_pos[0] - element[0]) ** 2 + (player_pos[1] - element[1]) ** 2);
            if (dist_to_player < 60) {
                mapData.coins[index] = null;
            } else {
                let coin_offset_y = coin_delta_y * (Math.sin(millis() / 700 + index * 20) + 1) / 2;
                draw_sprite(spriteMap.tuc, [(element[0] - cam_pos[0]) * element[2] + width / 2, (element[1] - cam_pos[1] + coin_offset_y) * element[2] + height / 2 + general_offset_y], coin_size);
            }
        }
    }

    
    //draw the player
    if(!inRocket){
        draw_player()
    }
    

    
    //draw the exit
    if (mapData.exit) {
        let exit_pos = mapData.exit.exitpoint;
        fill(255)
        noStroke()
        let visual_exit_pos = [exit_pos[0] - cam_pos[0] + width / 2, exit_pos[1] - cam_pos[1] + height / 2 + 100]
        draw_sprite(spriteMap.moon, visual_exit_pos, exit_radius)
        if (prev_mapIndex !== mapIndex) {
            exit_particles = [];
            for (let i = 0; i < exit_particle_count; i++) {
                exit_particles.push(getExitParticle(exit_pos))
            }
        }
        for (let i = 0; i < exit_particles.length; i++) {
            const part = exit_particles[i];
            const angle = part[2];
            const part_speed = particle_speed * part[3] / (particle_life + particle_life_rnd)
            if (part[3] < 0) {
                exit_particles[i] = getExitParticle(exit_pos)
            } else {
                part[0] += deltaTime * part_speed * Math.cos(angle);
                part[1] += deltaTime * part_speed * Math.sin(angle);
                part[3] -= deltaTime;
                circle(part[0] - cam_pos[0] + width / 2, part[1] - cam_pos[1] + height / 2 + 100, part[3] / particle_life * particle_size);
            }
        }
    }

    //draw the front objects
    for (let index = 0; index < mapData.objects.front.length; index++) {
        const element = mapData.objects.front[index];
        draw_sprite(element[0], [(element[1] - cam_pos[0]) * element[4] + width / 2, (element[2] - cam_pos[1]) * element[4] + height / 2 + general_offset_y], element[3])
    }

    // if(inRocket){
    //     draw
    // }
    
}

let mapData;
let mapIndex = 0;
let prev_mapIndex;
let transition_value_array;

function handleGame() {
    //this is used to display a black blind for transitions
    transition_value_array = [];

    //the current map's data
    mapData = maps[mapIndex || 0];

    //player movement logic
    if (inRocket && scene===0){
        //move the player along with the rocket
        player_vel = [0,0]
        player_pos = [rocket_pos[0], rocket_pos[1]]

        let start_time = millis()-rocket_enter_time;

        
        //rocket liftoff vibration
        let vibrate_intensity = easeInOutSine(Math.min(1,Math.max(-1,(start_time-rocket_launch_delay-rocket_launch_duration)/(rocket_launch_duration))));
        //1-easeInOutSine(Math.min(Math.max(0,(start_time)-rocket_launch_delay)/rocket_launch_delay,1))
        let vibrate_amount = 30;
        cam_pos[0] += vibrate_intensity * Math.sin(millis()) * Math.sin(millis()/2)*vibrate_amount
        cam_pos[1] += vibrate_intensity * Math.sin(millis()-400) * Math.sin(millis()/3)*vibrate_amount

        

        //rocket liftoff speed
        let speed_amount_tmp = Math.min(1,Math.max(0, start_time - rocket_launch_delay - rocket_launch_duration)/(rocket_launch_delay + rocket_launch_duration));
        let rocket_rad_angle = PI/180*(rocket_rot+90);
        rocket_vel += speed_amount_tmp * rocket_base_speed;
        rocket_vel *= 0.5
        if (mapData.exit && mapData.exit.exitpoint){
            let exitpos = mapData.exit.exitpoint

            let dist_exit_to_rocket = Math.sqrt((rocket_pos[0]-exitpos[0])**2+(rocket_pos[1]-exitpos[1])**2);

            //grav is mass/(dist**2)
            let grav = 10000/((dist_exit_to_rocket/1000)**2)
            rocket_grav_vel[0] = (rocket_pos[0]-exitpos[0])/dist_exit_to_rocket*grav*deltaTime
            rocket_grav_vel[1] = (rocket_pos[1]-exitpos[1])/dist_exit_to_rocket*grav*deltaTime
        }
        rocket_pos[0] -= deltaTime*(Math.cos(rocket_rad_angle)*rocket_vel + rocket_grav_vel[0]);
        rocket_pos[1] -= deltaTime*(Math.sin(rocket_rad_angle)*rocket_vel + rocket_grav_vel[1]);

        if(mapData.area){
            rocket_pos[0] = Math.max(mapData.area[0], Math.min(mapData.area[1], rocket_pos[0]))
        }


        let liftoff_end = start_time - rocket_launch_delay - rocket_launch_duration;

        if (liftoff_end>0){
            //we have liftoff
            if (pressedKeys.q || pressedKeys.arrowleft) {
                rocket_rot -= 100*deltaTime;
            }
            if (pressedKeys.d || pressedKeys.arrowright) {
                rocket_rot += 100*deltaTime;
            }
            if (pressedKeys.s || pressedKeys.arrowdown) {
                rocket_base_speed -= 300*deltaTime
            }
            if (pressedKeys.z || pressedKeys.arrowup) {
                rocket_base_speed += 300*deltaTime
            }

            rocket_base_speed = Math.max(rocket_min_speed,Math.min(rocket_max_speed,rocket_base_speed))
        }
        

    } else{
        if (!(mapData.options && mapData.options.playermove === false)){
            if ((pressedKeys[" "] || pressedKeys.z || pressedKeys.arrowup) && !midair) {
                player_vel[1] = -600;
                midair = true;
            } else if (pressedKeys.q || pressedKeys.arrowleft || pressedKeys.d || pressedKeys.arrowright) {
                if (pressedKeys.q || pressedKeys.arrowleft) {
                    player_vel[0] -= player_accel;
                }
                if (pressedKeys.d || pressedKeys.arrowright) {
                    player_vel[0] += player_accel;
                }
            } else if (!midair) {
                player_vel[0] /= 1.2;
                player_rot /= 2;
            }
        }
        
    }
    

    if (!inRocket) {player_vel[0] = Math.min(Math.max(player_vel[0], -max_hor_vel), max_hor_vel);

        player_rot = -player_vel[0] / max_hor_vel * 10;

        player_vel[1] += m * g * deltaTime;
        
        let charSprite = chars[characterBuild[0].mod(chars.length)];

        player_pos[0] += player_vel[0] * deltaTime;
        player_pos[0] = Math.min(Math.max(player_pos[0], mapData.area[0]), mapData.area[1])

        let deltaY = player_vel[1] * deltaTime;
        let calculated_player_pos_y = player_pos[1] + deltaY;
        let new_player_pos_y = Math.min(calculated_player_pos_y, mapData.area[2]);
        let error = calculated_player_pos_y - new_player_pos_y;
        if (error) {
            groundcollide();
        }

        for (let i = 0; i < mapData.platforms.length; i++) {
            const element = mapData.platforms[i];
            const iscollision = collidesWith(element, player_pos[1], new_player_pos_y - player_pos[1]);
            if (iscollision) {
                new_player_pos_y = Math.min(calculated_player_pos_y, element[1]);
                groundcollide();
            };
        };

        player_pos[1] = new_player_pos_y;}


    playerDisplayPos = [(player_pos[0] - cam_pos[0]) * playerDepth + width / 2, (player_pos[1] - cam_pos[1]) * playerDepth + height / 2 + general_offset_y];
    if (mapData.options.camfollow) {
        if (inRocket){
            cam_pos[0] += (rocket_pos[0] - cam_pos[0]) * 0.05
            cam_pos[1] += (rocket_pos[1] - cam_pos[1]) * 0.05
        } else{
            cam_pos[0] += (player_pos[0] - cam_pos[0]) * 0.03
            cam_pos[1] += (player_pos[1] - cam_pos[1]) * 0.05
        }
        
    }

    handleDrawGame(playerDisplayPos, charSprite, mapData.options)

    prev_mapIndex = mapIndex;

    if (mapData.exit) {
        let exitpos = mapData.exit.exitpoint
        let dist = Math.sqrt((player_pos[0] - exitpos[0]) ** 2 + (player_pos[1] - exitpos[1]) ** 2);
        squareColor = color(237, 253, 255);
        squareColor.setAlpha(128 * (1 - ((Math.min(Math.max(dist - exit_effect_end, 0), exit_effect_radius)) / exit_effect_radius)));
        fill(squareColor);
        noStroke()
        rect(0, 0, width, height)
        if (dist < (exit_radius / 2 - 40)) {
            mapIndex = mapData.exit.exitindex;
        };
        fill(0, 0, 0);
    };

    if(inRocket){
        let w = 5;
        let speedscale =  Math.max(0, Math.min(1,(rocket_base_speed-rocket_min_speed)/(rocket_max_speed-rocket_min_speed) + (Math.sin(millis()/500)*Math.sin(millis()/800)/2-1)*0.05));
        let barheight = height/2
        let c = lerpColor(color(5, 255, 163), color(255, 70, 28), speedscale)
        fill(255)
        rect(40, (height-barheight)/2, 40, barheight)
        fill(c)
        rect(40, (height-barheight)/2+barheight*(1-speedscale), 40, barheight*speedscale)
        noFill()
        stroke(0)
        strokeWeight(w)
        rect(40, (height-barheight)/2, 40, barheight)
        noStroke()
        fill(0)
        textAlign(CENTER,CENTER)
        textSize(20);
        text("speed",60, (height-barheight)/2+barheight+40)

        rocket_fuel -= 800*deltaTime*(speedscale+0.1)
        rocket_fuel = Math.max(0, rocket_fuel)

        let fuelscale =  Math.max(0, Math.min(1,(rocket_fuel/max_rocket_fuel) + (Math.sin((millis()+400)/600)*Math.sin((millis()+400)/800)/2-1)*0.05));
        let fuelc = lerpColor(color(237, 141, 40), color(237, 106, 40), speedscale)
        fuelc.setAlpha(230)
        //no bg
        // fill(255)
        // rect(120, (height-barheight)/2, 40, barheight)
        fill(fuelc)
        rect(120, (height-barheight)/2+barheight*(1-fuelscale), 40, barheight*fuelscale)
        noFill()
        stroke(0)
        strokeWeight(w)
        rect(120, (height-barheight)/2, 40, barheight)
        noStroke()
        fill(0)
        textAlign(CENTER,CENTER)
        textSize(20);
        text("fuel",140, (height-barheight)/2+barheight+40)
    }

    //apply all transition effects
    let global_transition_value = NaN;
    for (const i of transition_value_array) {
        if (typeof(i) === "number" && i>=0 && i<=1){
            if (!isNaN(global_transition_value)){
                global_transition_value = global_transition_value*i;
            } else{
                global_transition_value = i;
            } 
        }
    }
    if (isNaN(global_transition_value)){
        global_transition_value = 0;
    }

    squareColor = color(0, 0, 0);
    squareColor.setAlpha(255 * global_transition_value);
    background(squareColor);


}

//variables de temps
// let prevTime;
// let deltaTime;
// let hasLeftWindow;

function draw() {
    if (performance.memory) {
        console.log(performance.memory.usedJSHeapSize);
    }
    deltaTime = Math.min(deltaTime, 17)/1000
    
    // if(hasLeftWindow){
    //     deltaTime = 0
    //     prevTime = Date.now()
    //     hasLeftWindow = false;
    //     console.log("prevented");
    // } else{
    //     let newTime = Date.now();
    //     deltaTime = (newTime - prevTime) / 1000;
    //     prevTime = newTime;
    // }
    // console.log(deltaTime);
    
    //on efface tout
    clear();
    background(255, 204, 0);
    


    //affichage du jeu lui même
    if (scene === 1) {
        handleMenu();
    } else if (scene === 0) {
        handleGame();
    } else {
        textAlign(CENTER, TOP)
        textSize(20);
        text("Invalid scene", width / 2, height / 2);
    };

    if (screen_cnt > 0) {
        screen_cnt -= 1;
        myCanvas.elt.toBlob(function(blob) {
            console.log(blob);
            let img = document.getElementById("char_image");
            //sur chrome/webkit c'est webkitURL

            //https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_and_Operators#op%C3%A9rateur_conditionnel_ternaire
            //(condition ? val1 : val2) question de compatibilite
            let url = (window.URL ? URL : webkitURL).createObjectURL(blob);

            (window.URL ? URL : webkitURL).revokeObjectURL(screen_blob_url);

            screen_blob_url = url;

            img.src = url;

            dl_link.href = url;
            dl_link.download = "character.png";
            document.getElementById("dl_popup").className = "";
        });
    };

    if (!menu_open) {
        draw_sprite(spriteMap.camera, camera_icon_pos, 60);
    };
}

function handleMouse(e) {
    console.log("pos: ", player_pos || "no player pos");
    //ne pas toucher: une soirée de travail et je comprend a peine comment ça peut marcher xD... (TODO: a réécrire proprement)
    var rect = myCanvas.elt.getBoundingClientRect();
    var clickX = e.clientX - rect.left; //x position within the element.
    var clickY = e.clientY - rect.top; //y position within the element.
    let sizeInfo = getFittedObjSizeInfo(myCanvas.elt);
    let f1 = sizeInfo[0];
    let f2 = sizeInfo[1];
    let delta_w = sizeInfo[2];
    let delta_h = sizeInfo[3];
    let newMouseX = (clickX - delta_h / 2) / f1;
    let newMouseY = (clickY - delta_w / 2) / f2;
    console.log(newMouseX, newMouseY);
    let hitboxes_copy = hitboxes.slice()
    hitboxes_copy.push([camera_icon_pos, () => {
        screen();
    }]);
    if (!menu_open) {
        for (i of hitboxes_copy) {
            pos = i[0];
            let hitbox_size = i[2] || [];
            let hitbox_width = hitbox_size[0] || buttonWidth;
            let hitbox_height = hitbox_size[1] || buttonWidth;

            let xValid = (newMouseX >= pos[0] - hitbox_width / 2 && newMouseX <= pos[0] + hitbox_width / 2);
            let yValid = (newMouseY >= pos[1] - hitbox_height / 2 && newMouseY <= pos[1] + hitbox_height / 2);
            if (xValid && yValid) {
                i[1]();
                break;
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
};

//dl_popup est un élément qui prend l'entièreté de l'écran
//dans lequel s'affiche la popup de téléchargement du personnage
//il s'agit ici de détecter si on clique dessus (à coté de la popup) afin de la fermer
let dl_popup = document.getElementById("dl_popup");
let popup_quit = document.getElementById("quit");
dl_popup.addEventListener("click", (e) => {
    //si l'element sélectionné n'est ni le bouton quitter, ni l'exterieur de la popup
    if (e.target !== dl_popup && e.target !== popup_quit) {
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
            hasLeftWindow = true;
        } else {
            setTimeout(() => {
                if (document.visibilityState == "visible") { soundTrack.elt.play() }
            }, 500);

        }

    }
});

window.onkeyup = function(e) { pressedKeys[e.key.toLowerCase()] = false; }
window.onkeydown = function(e) { pressedKeys[e.key.toLowerCase()] = true; }