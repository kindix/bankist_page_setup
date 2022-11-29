"use strict";

const btn_scroll_to = document.querySelector(".btn--scroll-to");
const section_1 = document.getElementById("section--1");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const nav = document.querySelector(".nav");
///////////////////////////////////////
// Modal window
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

btnsOpenModal.forEach((elem) => elem.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//===================================
// 188 smoth scroling
//==================================

btn_scroll_to.addEventListener("click", function (event) {
  event.preventDefault();
  const s1coords = section_1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(event.target.getBoundingClientRect());

  //scroll
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  section_1.scrollIntoView({ behavior: "smooth" });
});

//===============================
// 192 Page navigation
//===============================

// document.querySelectorAll(".nav__link").forEach((el) => {
//   el.addEventListener("click", function (event) {
//
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// 1. add event listener to parent elem
// 2. Determine what elem originated

document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // mathing

    if (event.target.classList.contains("nav__link")) {
      const id = event.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  });

//===============================
// 194 bulding a tabbed component (TAB component)
//===============================

const tabs = document.querySelectorAll(".operations__tab");
const tabs_container = document.querySelector(".operations__tab-container");
const tabs_content = document.querySelectorAll(".operations__content");

tabs_container.addEventListener("click", (event) => {
  event.preventDefault();
  const clicked = event.target.closest(".operations__tab");

  // guard clause
  if (!clicked) return;
  //active tab
  tabs.forEach((c) => c.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // activate content area
  tabs_content.forEach((t) =>
    t.classList.remove("operations__content--active")
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//=====================================
//195 passing argument
//===================================

//menu fade animation

function handle_hover(event) {
  if (event.target.classList.contains("nav__link")) {
    const link = event.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((elem) => {
      if (elem !== link) elem.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener("mouseover", handle_hover.bind(0.5));
nav.addEventListener("mouseout", handle_hover.bind(1));

//=======================================
// 196 sticky nav
//========================================

// const int_coords = section_1.getBoundingClientRect();

// window.addEventListener("scroll", function (event) {
//   if (window.scrollY > int_coords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

//=======================================
// 197 sticky nav using Observer 142HTML+CSS
//========================================

// function obs_call_back(entries, obsorver) {
//   entries.forEach((elem) => {
//     console.log(elem);
//   });
// }
// const obs_options = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obs_call_back, obs_options);

// observer.observe(section_1);

const header = document.querySelector(".header");
const nav_height = nav.getBoundingClientRect();

function sticky_nav(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
}

const header_obs = new IntersectionObserver(sticky_nav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav_height.height}px`,
});

header_obs.observe(header);

//=======================================
// 198 revealing elem on scroll
//========================================

const all_sections = document.querySelectorAll(".section");

function reveal_section(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}

const section_obs = new IntersectionObserver(reveal_section, {
  root: null,
  threshold: 0.15,
});

all_sections.forEach((section) => {
  section_obs.observe(section);
  section.classList.add("section--hidden");
});

//====================================
// 199 Lazy loading img
//====================================
const img_targets = document.querySelectorAll("img[data-src]");

function load_img(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src to data-srs

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
}

const img_obs = new IntersectionObserver(load_img, {
  root: null,
  threshold: 0,
  rootMargin: "-300px",
});

img_targets.forEach((img) => img_obs.observe(img));

//=======================================
// 200 Build slider
//========================================
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
// function slider() {
//   const slides = document.querySelectorAll(".slide");
//   const btn_left = document.querySelector(".slider__btn--left");
//   const btn_right = document.querySelector(".slider__btn--right");
//   const dot_container = document.querySelector(".dots");

//   let cur_slide = 0;
//   const max_slide = slides.length - 1;

//   function create_dots() {
//     slides.forEach((_, i) => {
//       dot_container.insertAdjacentHTML(
//         "beforeend",
//         `<button class="dots__dot" data-slide="${i}"></button>`
//       );
//     });
//   }

//   function activ_dot(slide) {
//     document.querySelectorAll(".dots__dot").forEach((dot) => {
//       dot.classList.remove("dots__dot--active");
//     });

//     document
//       .querySelector(`.dots__dot[data-slide="${slide}"]`)
//       .classList.add("dots__dot--active");
//   }

//   function go_to_slide(slide) {
//     slides.forEach(
//       (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
//     );
//   }

//   function next_slide() {
//     if (cur_slide === max_slide) {
//       cur_slide = 0;
//     } else {
//       cur_slide++;
//     }
//     go_to_slide(cur_slide);
//     activ_dot(cur_slide);
//   }

//   function prev_slide() {
//     if (cur_slide === 0) {
//       cur_slide = max_slide;
//     } else {
//       cur_slide--;
//     }
//     go_to_slide(cur_slide);
//     activ_dot(cur_slide);
//   }

//   function init() {
//     go_to_slide(0);
//     activ_dot(0);
//     create_dots();
//   }
//   init();

//   // Events
//   btn_right.addEventListener("click", next_slide);
//   btn_left.addEventListener("click", prev_slide);

//   document.addEventListener("keydown", function (event) {
//     if (event.key === "ArrowLeft") prev_slide();
//     event.key === "ArrowRight" && next_slide();
//   });

//   dot_container.addEventListener("click", function (event) {
//     if (event.target.classList.contains("dots__dot")) {
//       const slide = event.target.dataset.slide;
//       go_to_slide(slide);
//       activ_dot(slide);
//     }
//   });
// }

// slider();
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/*
//======================================
// 186 Select delete create
//======================================

//select
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

const header = document.querySelector(".header");
const all_sections = document.querySelectorAll(".section");

document.getElementById("section--1");
const all_btn = document.getElementsByTagName("button");

document.getElementsByClassName("btn");

//create

// .insertAdjacentHTML

const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent = "We use cookies for improved functionality"
message.innerHTML =
  "We use cookies for improved functionality. <button class='btn btn--close-cookie'>Got It!</button>";

header.prepend(message);
// header.before(message);
// header.after(message);
// header.append(message);
// header.append(message.cloneNode(true));

//DELETE

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

//===============================
// 187 Style Attr Classes
//===============================

//styles
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

console.log(message.style);
console.log(getComputedStyle(message).opacity);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + "px";

document.documentElement.style.setProperty("--color-primary", "blue");

//attr

const logo = document.querySelector(".nav__logo");

console.log(logo.getAttribute("designer"));

logo.alt = "New alt for logo";
console.log(logo.alt);

logo.setAttribute("company", "Bankist");

console.log(logo.getAttribute("src"));
console.log(logo.src);

const link = document.querySelector(".nav__link--btn");
console.log(link.href);
console.log(link.getAttribute("href"));

//data attr
console.log(logo.dataset.versionNumber);

//classes

logo.classList.add("c");
logo.classList.remove("c");
logo.classList.toggle("c");
logo.classList.contains("c");

// don't use
logo.className = "name";

//============================
// 189 EVENTS
//============================

const h1 = document.querySelector("h1");

function alert_h1(event) {
  alert("addEventListener: Great! You are reading header");
}

h1.addEventListener("mouseenter", alert_h1);

setTimeout(() => h1.removeEventListener("mouseenter", alert_h1), 3000);

// h1.onmouseenter = (event) => {
//   alert("addEventListener: Great! You are reading header");
// };

//================================
// 191 Events propagation
//================================

// rgba(255,255,255)

const random_num = (max, min) => Math.floor(Math.random() * (max - min) + min);

const rand_color = () =>
  `rgba(${random_num(0, 255)},${random_num(0, 255)},${random_num(0, 255)})`;

document
  .querySelector(".nav__link")
  .addEventListener("click", function (event) {
    this.style.backgroundColor = rand_color();
    console.log("LINK", event.target, event.currentTarget);

    // stop propagation
    // event.stopPropagation();
  });

document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    this.style.backgroundColor = rand_color();
    console.log("CONTAINER", event.target, event.currentTarget);
  });

document.querySelector(".nav").addEventListener(
  "click",
  function (event) {
    this.style.backgroundColor = rand_color();
    console.log("NAV", event.target, event.currentTarget);
  },
  false
);

//===============================
// 193 DOM traversing
//===============================

const h1 = document.querySelector("h1");

// going downawards: child

console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = "red";
h1.lastElementChild.style.color = "white";
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = "var(--gradient-secondary)";

// going sadeways: siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach((el) => {
  if (el !== h1) el.style.transform = "scale(75%)";
});


//===============================
// 201 DOM
//===============================

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("HTML fuck", event);
});

window.addEventListener("load", function (event) {
  console.log("Load fully", event);
});

window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  console.log(event);
  event.returnValue = "";
});
*/
