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
    "./assets/images/sergio.svg"
  ];

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
    "SDGI"
  ];

  for (let i = 0; i < items.length; i++) {
    const div = document.createElement("div");
    const box = document.createElement("img");
    const p = document.createElement("p");
    box.src = items[i];
    box.style.width = "100px";
    box.style.height = "100px";
    box.className = "container";
    p.textContent = items2[i];
    p.className = "centered";
    div.appendChild(box);
    div.appendChild(p);
    document.querySelector(".info").appendChild(box);
  }

  const box = document.createElement("p");
  box.textContent = items2.join(" ");
  document.querySelector(".info").appendChild(box);

  const doors = document.querySelectorAll(".door");
  document.querySelector("#spinner").addEventListener("click", spin);
  document.querySelector("#reseter").addEventListener("click", init);

  async function spin() {
    init(false, 1, 2);
    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    let init = true;
    let initPool = [];
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

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("img");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.src = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)
        }px)`;
      door.replaceChild(boxesClone, boxes);
      // console.log(door);
      init = false;
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();
})();