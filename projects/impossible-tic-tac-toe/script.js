const
    toggle_wrap = document.getElementById('toggle-wrap'),
    toggle = document.getElementById('toggle'),
    winner_indicator = document.getElementsByClassName('winner-indicator')[0],
    main = document.getElementsByTagName('main')[0],
    main_title = document.getElementsByTagName('h1')[0],
    play_btn = document.getElementById('play-btn'),
    game_wrap = document.getElementById('game-wrap'),
    credit = document.getElementById('credit'),
    gamemode = document.getElementById('gamemode'),
    box = document.getElementsByClassName('box'),
    box_wrap = document.getElementById('box-wrap')

var
    [menu_count,game_start,toggle_pos,box_to_array] = [0,0,0,[]],
    config,singular_call

user_mark = () => { return toggle_pos === 0 ? 'url(assets/circle-blk.svg)' : 'url(assets/cross-blk.svg)' }
AI_mark = () => { return toggle_pos === 0 ? 'url(assets/cross-blk.svg)' : 'url(assets/circle-blk.svg)' }
toggle_mark = () => {
    if(!toggle_pos){
        toggle.style = 'transform:translateX(35px);'
        toggle_pos = 1
    }else{
        toggle.style = 'transform:translateX(0);'
        toggle_pos = 0
    }
    box[4].style = `background-image:${AI_mark()};transition:none;`
}
/*
    ALGORITHM
*/
algorithm = (setup) => {
    let three_box_assurance = []
    reset = ()=>{
        config = {
            boxes:[0,0,0,0,2,0,0,0,0],
            winning_rows:['0,4,8','2,5,8','2,4,6','0,1,2','3,4,5','6,7,8','0,3,6','1,4,7'],
            turn:0, // 0 = player, 1 = AI
            game_end:0,
            iterator:0
        }
        singular_call = undefined
        winner_indicator.style = 'display:none;'
        toggle_wrap.style = 'opacity:1;cursor:pointer;'
        for(let x in box){
            if(x === 4 || x.length > 1){ // Avoid iterating "undefined"
                box[4].style = `background-image:${AI_mark()};`
                continue
            }
            box[x].style = `animation:none;background-image:none;`
        }
    }
    box_config_to_array = (...n)=>{
        // n --> config.boxes[0],...config.boxes[n]
        let temp_arr = []
        if(typeof n[0] === 'string' && n.length === 1) for(let x of n[0].split(/\B|,/g)) temp_arr.push(config.boxes[x])
        else for(let x of n) temp_arr.push(config.boxes[x])
        return temp_arr
    }
    box_chk = (...n)=>{
        // If parameter n is passed as an array, it will convert it to a non nesting array (Single array)
        let temp_array = []
        n = n.toString().split(/\B|,/g)
        for(let x of n) temp_array.push(config.boxes[x])
        return temp_array.join('')
    }
    find_empty_box = (...n)=>{
        let [temp_arr,param] = [[],[]]
        for(let x of n){
            param.push(x)
            temp_arr.push(config.boxes[x])
        }
        return param[temp_arr.findIndex(x=>{return x === 0})]	
    }
    str_filter_chk = (a,b,c) =>{
        // String 'a' has 'c' number of 'b' (String has to be from config.boxes, after eval)
        return a.split(/\B|,/g).filter(x=>{return x === b.toString()}).length === c
    }
    ai_counter_move = (empty_box_locator) =>{
        // empty_box_locator --> locate empty box in entire array of length 8
        if(empty_box_locator === undefined){
            for(let x in config.boxes){
                if(!config.boxes[x]){
                    config.boxes[x] = 2
                    box[x].style = `background-image:${AI_mark()};animation:animate_mark .3s linear;`
                    break
                }
            }
        }else{
            box[empty_box_locator].style = `background-image:${AI_mark()};animation:animate_mark .3s linear;`
            config.boxes[empty_box_locator] = 2
        }
        config.turn = 0
    }
    dbl_check_winner = ()=>{
        if(!config.boxes.includes(0)){
            winner_indicator.textContent = 'Tie game!'
            winner_indicator.style = 'display:block;'
        }
        // Double check for winning rows
        for(let x of config.winning_rows){
            for(let y of config.boxes){
                three_box_assurance = [x.split(/\B|,/g)]
                k = box_chk(three_box_assurance[0])
                if(k === '111' || k === '222'){
                    k.includes('1') ? winner_indicator.textContent = 'You won!' : winner_indicator.textContent = 'You lost!'
                    winner_indicator.style = 'display:block;'
                    config.game_end = 1
                }
            }
        }
    }
    is_player_winning = ()=>{
        [side_boxes,three_box_assurance,corner_boxes] = [box_config_to_array(1,3,5,7),[],box_config_to_array(0,2,6,8)] 
        let k,i,singular_call = undefined
        config.iterator = 0
        /*
            Board template:
                A | B | C
                D | E | F
                G | H | I


            Check whether player is winning by having 101,011 or 110 formation
            Values of winning_rows --> index of box

            Loop winning rows and split digits only for box location
            "0,1,2" --> "012".split

            "0,1,2" --> [0,1,2] --> config.boxes[0],config.boxes[1],config.boxes[2]
        */  
            
            winning_rows_loop_check: for(let x of config.winning_rows){
                config.iterator++
                config_boxes_loop_check: for(let y of config.boxes){
                    three_box_assurance = [x.split(/\D/)] // i.e ["x","y","z"]
                    k = box_chk(three_box_assurance[0])
                    if(!box_chk(three_box_assurance[0]).includes('1') && box_chk(three_box_assurance[0]).includes('0') && box_chk(three_box_assurance[0]).includes('2')){
                        i = three_box_assurance[0][k.indexOf('0')]
                    }
                    if(str_filter_chk(k,0,1)){
                        if(str_filter_chk(k,1,2)) singular_call = three_box_assurance[0][k.indexOf('0')]
                        else if(str_filter_chk(k,2,2)){
                            singular_call = three_box_assurance[0][k.indexOf('0')]
                            break winning_rows_loop_check
                        }
                    }
                }
            }
        singular_call === undefined && config.iterator === 8 && (singular_call = i)
        config.game_end === 0 && (ai_counter_move(singular_call))
        dbl_check_winner()
    }
    game_start = ()=>{
        for(let x of box){
            box_to_array.push(x)
            x.onclick = ()=>{
                toggle_wrap.style = 'opacity:0.5;cursor:default;'
                if(!getComputedStyle(x)['backgroundImage'].includes('svg') && config.turn === 0 && config.game_end === 0){
                    x.style = `background-image:${user_mark()};animation:animate_mark .3s linear`
                    config.boxes[box_to_array.indexOf(x)] = 1
                    config.turn = 1
                    dbl_check_winner()
                    config.boxes.includes(0) && config.turn === 1 && (is_player_winning())
                }
            }
        }
    }
    return {
        'reset': reset,
        'gamestart':game_start,
        'box_chk':box_chk,
        'str_filter_chk':str_filter_chk,
        'find_empty_box':find_empty_box
    }[setup]
}
play_btn.onclick = () => {
    game_start = 1
    game_wrap.style = 'transform:translateX(0)'
    main.children[0].style = `transform:translateY(-50vh)`
    credit.style = 'opacity:.3'
    algorithm('reset')()
    algorithm('gamestart')()
}
pre_post_adjust_layout = ()=>{box_wrap.style = `width:${window.innerWidth / 1.5}px;height:${window.innerWidth / 1.5}px`}
window.onresize = ()=>{pre_post_adjust_layout()}
window.onload = ()=>{pre_post_adjust_layout()}
toggle_wrap.onclick = ()=>{!config.boxes.includes(1) && (toggle_mark())}
reset.onclick = ()=>{algorithm('reset')()}