(function () {
  "use strict";

  const items = [
    "./assets/images/adri.svg",
    "./assets/images/carlos.svg",
    "./assets/images/dani.svg",
    "./assets/images/fer.svg",
    "./assets/images/jose.svg",
    "./assets/images/juanra.svg",
    "./assets/images/konrad.svg",
    "./assets/images/ma.svg",
    "./assets/images/sergio.svg",
    "./assets/images/pablo.svg"
  ];

  const modo_JRCH = ["./assets/images/Juanra.png",
                     "https://media.giphy.com/media/SSJzjTGVWzfN1Il9ba/giphy.gif"];

  let flag_modo_Juanra = false;

  let flag_modo_gato = false;

  let counterSergio = 0;

  let number = items.length;

  const cruces = [
    "CruzAdri",
    "CruzCarlos",
    "CruzDani",
    "CruzFer",
    "CruzJose",
    "CruzJuanra",
    "CruzKonrad",
    "CruzMA",
    "CruzSergio",
    "CruzPablo"
  ];

  const doors = document.querySelectorAll(".door");

  function modoJuanra() {
    if(flag_modo_Juanra){
        flag_modo_Juanra = false;
        document.getElementById("gif").src = "https://media.giphy.com/media/l51J4hE1kSY56TwIK0/giphy.gif";
        document.getElementById("fotoJuanraAbajo").src = "./assets/images/juanra.svg";
        items[7] ="./assets/images/juanra.svg";
    }else{
        document.getElementById("gif").src = modo_JRCH[1];
        document.getElementById("fotoJuanraAbajo").src = modo_JRCH[0];
        items[7] = modo_JRCH[0];
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
    let a = 0;
    let Aux = ''
    let Aux2 = ''
    while ((arr[(len - 1)].includes('carlos') 
          || arr[(len - 1)].includes('dani') 
          || arr[(len - 1)].includes('juanra'))) {
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
        if(!flag_modo_gato) {
          document.getElementById('app').style.background = "url(https://media.giphy.com/media/PJHDnh8PfnT3i/giphy.gif) no-repeat center center fixed";
          document.getElementById('app').style.backgroundSize = "cover";
          flag_modo_gato = true;
        } else {
          document.getElementById('app').style.background = "url(https://media.giphy.com/media/xAHIUDymzJyuI/giphy.gif) no-repeat center center fixed";
          document.getElementById('app').style.backgroundSize = "cover";
          flag_modo_gato = false;
        }
    });
    $('#ruletilleTitle').click(function (e) {
        modoJuanra();
    });
    $('#arm').click(function (e) {
      counterSergio++;
      if(counterSergio >= 10) {
        alert("Deja la puta ruletilla Sergio");
        window.open("https://www.amazon.es/Python-Dummies-Stef-Maruch/dp/0471778648", "_blank");
        window.open('mailto:jcmo@gmv.com?subject=[MagicMonitor]%20Quiero%20Tareas&body=Hola,%0A%0ATengo%20tiempo%20para%20hacer%20muchas%20tareas,%20por%20favor,%20envíame%20alguna.%0A%0AUn%20saludo');
        return;
      }
      var arm = $(this).addClass('clicked');
      setTimeout(function () { arm.removeClass('clicked'); }, 500);
      e.preventDefault();
      document.getElementById("frameRuletilla").classList.remove('ledStart');
      document.getElementById("frameRuletilla").classList.remove('ledWinner');
      document.getElementById("frameRuletilla").classList.add('ledLaunch');
      init();
      spin();
    });
    $('#CruzAdri').click(function (e) {
      disable('CruzAdri', "./assets/images/adri.svg", 0)
    });
    $('#CruzCarlos').click(function (e) {
      disable('CruzCarlos', "./assets/images/carlos.svg", 1)
    });
    $('#CruzDani').click(function (e) {
      disable('CruzDani', "./assets/images/dani.svg", 2)
    });
    $('#CruzFer').click(function (e) {
      disable('CruzFer', './assets/images/fer.svg', 3)
    });
    $('#CruzJose').click(function (e) {
      disable('CruzJose', './assets/images/jose.svg', 5)
    });
    $('#CruzJuanra').click(function (e) {
      disable('CruzJuanra', './assets/images/juanra.svg', 6)
    });
    $('#CruzKonrad').click(function (e) {
      disable('CruzKonrad', './assets/images/konrad.svg', 7)
    });
    $('#CruzMA').click(function (e) {
      disable('CruzMA', './assets/images/ma.svg', 8)
    });
    $('#CruzSergio').click(function (e) {
      disable('CruzSergio', './assets/images/sergio.svg', 9)
    });
    $('#CruzPablo').click(function (e) {
      disable('CruzPablo', './assets/images/pablo.svg', 10)
    });
  });

  init();
})();
