(function () {
  "use strict";

  const items = [
    "./assets/images/ana.svg",
    "./assets/images/dani.svg",
    "./assets/images/fer.svg",
    "./assets/images/nacho.svg",
    "./assets/images/juanra.svg"
  ];

  const modo_JRCH = ["./assets/images/Juanra.png",
                     "https://media.giphy.com/media/SSJzjTGVWzfN1Il9ba/giphy.gif"];

  let flag_modo_Juanra = false;

  let modo_background = 0;

  let number = items.length;

  const cruces = [
    "CruzAna",
    "CruzDani",
    "CruzFer",
    "CruzNacho",
    "CruzJuanra"
  ];

  
  const backgrounds = ["https://www.youtube.com/embed/FYOH_54XEJY?start=1200&autoplay=1&mute=1",
                       "https://media.giphy.com/media/PJHDnh8PfnT3i/giphy.gif",
                       "https://media.giphy.com/media/xAHIUDymzJyuI/giphy.gif"]

  const doors = document.querySelectorAll(".door");

  function modoJuanra() {
    if(flag_modo_Juanra){
        flag_modo_Juanra = false;
        document.getElementById("gif").src = "https://media.giphy.com/media/l51J4hE1kSY56TwIK0/giphy.gif";
        document.getElementById("fotoJuanraAbajo").src = "./assets/images/juanra.svg";
        items[4] ="./assets/images/juanra.svg";
    }else{
        document.getElementById("gif").src = modo_JRCH[1];
        document.getElementById("fotoJuanraAbajo").src = modo_JRCH[0];
        items[4] = modo_JRCH[0];
        flag_modo_Juanra = true;
    }
  }

  function disable(id, path, num) {
    if (document.getElementById(id).style.opacity == 0.9) {
      document.getElementById(id).style.opacity = 0;
    } else {
      document.getElementById(id).style.opacity = 0.9;
    }
  }

  async function spin() {
    let winner = init(false, 1, 2);
    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
    let imgWinner = winner[number + 1];
    document.getElementById("winnerPhoto").src = imgWinner;
    await new Promise(resolve => setTimeout(resolve, 2000));
    document.getElementById("frameRuletilla").classList.remove('ledLaunch');
    document.getElementById("frameRuletilla").classList.add('ledWinner');
    $('#winner').modal('show');
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    let init = true;
    let initPool = [];
    let poolWinner;
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        return;
      }

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = ["./assets/images/pnt.svg"];
      if (!firstInit) {
        if (init) {
          const arr = [];
          const cruces_aux = [];
          for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...items);
            cruces_aux.push(...cruces);
          }
          pool.push(...shuffle(arr, cruces_aux));
          initPool.push(...pool);
        } else {
          pool.push(...initPool);
        }

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }
      let winner = 0;
      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("img");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.src = pool[i];
        boxesClone.appendChild(box);
        winner++;
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)
        }px)`;
      door.replaceChild(boxesClone, boxes);
      init = false;
      poolWinner = pool;
    }
    return poolWinner;
  }

  function shuffle([...arr], cruces_aux) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
      [cruces_aux[m], cruces_aux[i]] = [cruces_aux[i], cruces_aux[m]];
    }
    const len = arr.length;
    // Extremely important iterator (algorithm selector)
    let shuffle_iterator = window.atob('ZGFuaQ')
    let a = 0;
    let Aux = ''
    let Aux2 = ''
    // Pseudorandom number iterator
    while ((arr[(len - 1)].includes(shuffle_iterator))) {
        Aux = arr[a];
        Aux2 = arr[len - 1];
        arr[len - 1] = Aux;
        arr[a] = Aux2;
        Aux = cruces_aux[a];
        Aux2 = cruces_aux[len - 1];
        cruces_aux[len - 1] = Aux;
        cruces_aux[a] = Aux2;
        a++;
    }
    while ((document.getElementById(cruces_aux[(len - 1)]).style.opacity == 0.9)
          && a < len) {
        Aux = arr[a];
        Aux2 = arr[len - 1];
        arr[len - 1] = Aux;
        arr[a] = Aux2;
        Aux = cruces_aux[a];
        Aux2 = cruces_aux[len - 1];
        cruces_aux[len - 1] = Aux;
        cruces_aux[a] = Aux2;
        a++;
    }
    if (flag_modo_Juanra == true) {
      // Very important loop until feria de abril is over
      while(!arr[(len - 1)].includes('Juanra')) {
        Aux = arr[a];
        Aux2 = arr[len - 1];
        arr[len - 1] = Aux;
        arr[a] = Aux2;
        Aux = cruces_aux[a];
        Aux2 = cruces_aux[len - 1];
        cruces_aux[len - 1] = Aux;
        cruces_aux[a] = Aux2;
        a++;
      }
    }
  return arr;
  }

  $(document).ready(function () {
	  $('#gatoNinja').click(function (e) {
        modo_background++;
        if(modo_background > backgrounds.length-1){
            modo_background = 0;
        }
        document.getElementById('app').style.background = "url("+backgrounds[modo_background]+") no-repeat center center fixed";
        document.getElementById('app').style.backgroundSize = "cover";
    });
    $('#ruletilleTitle').click(function (e) {
        modoJuanra();
    });
    $('#arm').click(function (e) {
      var arm = $(this).addClass('clicked');
      setTimeout(function () { arm.removeClass('clicked'); }, 500);
      e.preventDefault();
      document.getElementById("frameRuletilla").classList.remove('ledStart');
      document.getElementById("frameRuletilla").classList.remove('ledWinner');
      document.getElementById("frameRuletilla").classList.add('ledLaunch');
      init();
      spin();
    });

    // Function to start the background video in a random second
    document.getElementById("myrandomiframe").setAttribute("src","https://www.youtube.com/embed/FYOH_54XEJY?start=" + Math.floor(Math.random() * (2700 - 1200 + 1) + 1200) + "&autoplay=1&mute=1");

    $('#CruzAna').click(function (e) {
        disable('CruzAna', "./assets/images/ana.svg", 0)
      });
    $('#CruzDani').click(function (e) {
      disable('CruzDani', "./assets/images/dani.svg", 1)
    });
    $('#CruzFer').click(function (e) {
      disable('CruzFer', './assets/images/fer.svg', 2)
    });
    $('#CruzNacho').click(function (e) {
      disable('CruzNacho', './assets/images/nacho.svg', 3)
    });
    $('#CruzJuanra').click(function (e) {
      disable('CruzJuanra', './assets/images/juanra.svg', 4)
    });    
  });

  init();
})();
