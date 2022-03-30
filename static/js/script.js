(function () {
  "use strict";

  const items = [
    "./assets/images/adri.svg",
    "./assets/images/carlos.svg",
    "./assets/images/dani.svg",
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

  async function spin() {
    let winner = init(false, 1, 2);
    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
    console.log(winner[number + 1]);
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
      // console.log(pool);
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
      // console.log(door);
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
    return arr;
  }

  $(document).ready(function () {
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