(function () {
  "use strict";

  

  const modo_JRCH = ["./assets/images/juanra.png",
                     "https://media.giphy.com/media/SSJzjTGVWzfN1Il9ba/giphy.gif"];

  let flag_modo_Juanra = false;


  let items = [
    "./assets/images/adri.svg",
    "./assets/images/carlos.svg",
    "./assets/images/dani.svg",
    "./assets/images/diego.svg",
    "./assets/images/fer.svg",
    "./assets/images/jorge.svg",
    "./assets/images/jose.svg",
    "./assets/images/juanra.svg",
    "./assets/images/konrad.svg",
    "./assets/images/ma.svg",
    "./assets/images/sergio.svg",
    "./assets/images/pablo.svg"
  ];

  let number = items.length;

  const items2 = [
    "ANQG",
    "CSDA",
    "DNCG",
    "DGCM",
    "FEBL",
    "JRHO",
    "JCMO",
    "JRCH",
    "KKJA",
    "MAFG",
    "SDGI",
    "TRPLZM"
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
          for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...items);
          }
          pool.push(...shuffle(arr));
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

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    const len = arr.length;
    let a = 0;
    while (arr[(len - 1)].includes('carlos') || arr[(len - 1)].includes('dani') || arr[(len - 1)].includes('jorge')) {
        arr[len - 1] = arr[a];
        arr[a] = arr[len - 1];
        a++;
    }

    if (flag_modo_Juanra == true) {
        // Very important loop until feria de abril is over
        while(!arr[(len - 1)].includes('juanra')) {
            arr[len - 1] = arr[a];
            arr[a] = arr[len - 1];
            a++;
        }
    }
    
    return arr;
  }
  

  $(document).ready(function () {
    $('#gatoNinja').click(function (e) {
        modoJuanra();
    });
    $('#arm').click(function (e) {
      var arm = $(this).addClass('clicked');
      setTimeout(function () { arm.removeClass('clicked'); }, 500);
      e.preventDefault();
      init();
      spin();
    });
  });

  init();
})();