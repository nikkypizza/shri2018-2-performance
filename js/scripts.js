"use strict";
(function() {
  const output = document.querySelector(`.modal__value`);
  const rangeSLider = document.querySelector(`.adjust-bar_theme_temp`);

  rangeSLider.oninput = function() {
    output.innerHTML = this.value > 0 ? `+` + this.value : this.value;
  };

  // ////// Devices Pagination

  const devices = document.querySelector(`.devices`);

  const pagiantorDevs = document.querySelector(`.devices__paginator`);
  const arrowLeftDevs = pagiantorDevs.querySelector(`.paginator__arrow_left`);
  const arrowRightDevs = pagiantorDevs.querySelector(`.paginator__arrow_right`);
  const panelCountDevs = document.querySelectorAll(`.devices__panel`).length;
  let currentPageDevs = 1;

  pagiantorDevs.classList.toggle(`paginator_hide`, panelCountDevs < 7);

  arrowRightDevs.addEventListener(`mouseup`, function() {
    currentPageDevs += 1;
    arrowLeftDevs.classList.toggle(`paginator__arrow_disabled`, currentPageDevs === 1);
    devices.scroll({
      top: 0,
      left: 1366,
      behavior: `smooth`
    });
  });

  arrowLeftDevs.addEventListener(`mouseup`, function() {
    if (currentPageDevs > 1) {
      currentPageDevs -= 1;
      arrowLeftDevs.classList.toggle(`paginator__arrow_disabled`, currentPageDevs === 1);
      devices.scroll({
        top: 0,
        left: -1366,
        behavior: `smooth`
      });
    }
  });

  // //////

  let curValue;
  let curRotate;
  let maxRotate = 0.42; // 150 градусов
  let minRotate = -0.42; // -150 градусов

  const MIN_VALUE = 26;
  const INDICATOR_OFFSET = 265;

  const rotateToValue = (rotate) => {
    return Math.floor((Math.abs(rotate * 360 * 1.73 + INDICATOR_OFFSET) / 53) + MIN_VALUE);
  };

  const setStrokeDasharray = (rot) => {
    return `${rot * 360 * 1.73 + INDICATOR_OFFSET} 629`;
  };


  const modalKnobNode = document.querySelector(`.modal_knob`);
  let modalValue = modalKnobNode.querySelector(`.modal__value`);
  let knobIndicator = modalKnobNode.querySelector(`.knob__indicator`);
  let knobValue = modalKnobNode.querySelector(`.knob__value`);
  let knobArrow = modalKnobNode.querySelector(`.knob__arrow`);

  /**
   * @param {Number} rotate Количество оборотов от нейтриального положения.
   */
  function setRotate(rotate) {

    if (rotate > maxRotate) {
      rotate = maxRotate;
    } else if (rotate < minRotate) {
      rotate = minRotate;
    }

    curRotate = rotate;
    curValue = rotateToValue(rotate);

    modalValue.innerHTML = `+${curValue}`;
    knobValue.innerHTML = `+${curValue}`;
    knobIndicator.style.strokeDasharray = setStrokeDasharray(curRotate);
    knobArrow.style.transform = `rotate(${curRotate * 360}deg)`;
  }

  function getPosition(elem) {
    const rect = elem.getBoundingClientRect();

    return [
      rect.left + (rect.right - rect.left) / 2,
      rect.top + (rect.bottom - rect.top) / 2
    ];
  }

  function getMouseAngle(event, centerElem) {
    const pos = getPosition(centerElem);
    let cursor = [event.clientX, event.clientY];
    let rad;

    if (event.targetTouches && event.targetTouches[0]) {
      cursor = [event.targetTouches[0].clientX, event.targetTouches[0].clientY];
    }

    rad = Math.atan2(cursor[1] - pos[1], cursor[0] - pos[0]) + Math.PI / 2;

    return rad;
  }

  let knobDragged;
  let prevAngleRad = null;
  let prevRotate = null;

  function startDragging(e) {
    e.preventDefault();
    e.stopPropagation();
    const rad = getMouseAngle(e, document.querySelector(`.knob_center`));

    knobDragged = true;
    prevAngleRad = rad;
    prevRotate = curRotate;
  }

  function stopDragging() {
    knobDragged = false;
  }

  function dragRotate(e) {
    if (!knobDragged) {
      return;
    }

    const old = prevAngleRad;
    let rad = getMouseAngle(e, document.querySelector(`.knob_center`));
    let delta = rad - old;

    prevAngleRad = rad;

    if (delta < 0) {
      delta += Math.PI * 2;
    }
    if (delta > Math.PI) {
      delta -= Math.PI * 2;
    }

    const deltaRotate = delta / Math.PI / 2;
    const rotate = prevRotate + deltaRotate;

    prevRotate = rotate;
    setRotate(rotate);
  }

  const knobContainer = document.querySelector(`.knob-container`);

  function setEvtListeners() {
    knobContainer.addEventListener(`mousedown`, startDragging);
    knobContainer.addEventListener(`mousemove`, dragRotate);
    knobContainer.addEventListener(`mouseup`, stopDragging);

    knobContainer.addEventListener(`touchstart`, startDragging);
    knobContainer.addEventListener(`touchmove`, dragRotate);
    knobContainer.addEventListener(`touchend`, stopDragging);
  }

  setEvtListeners();
  setRotate(0);

  document.querySelectorAll(`.modal_close`).forEach((b) => {
    b.onclick = function() {
      document.querySelectorAll(`.modal`).forEach((m) => {
        m.classList.toggle(`modal_open`, false);
        document.body.style.overflow = `auto`;
      });
    };
  });

  const TEMPS = {
    'manual': -10,
    'cold': 0,
    'warm': 23,
    'hot': 30
  };

  const modalTempValueNode = document.querySelector(`.modal_temp .modal__value`);
  const adjustBarTempNode = document.querySelector(`.adjust-bar_theme_temp`);

  document.querySelectorAll(`.modal__filter-item_temp`).forEach((l) => {
    l.onclick = function() {
      adjustBarTempNode.value = TEMPS[this.id];
      modalTempValueNode.innerHTML = TEMPS[this.id] > 0 ? `+` + TEMPS[this.id] : TEMPS[this.id];
    };
  });

  const showModal = function(selector) {
    document.querySelector(selector).classList.toggle(`modal_open`, true);
    document.body.style.overflow = `hidden`;
  };

  document.querySelectorAll(`.panel_temp`).forEach((p) => {
    p.onclick = function() {
      showModal(`.modal_temp`);
    };
  });

  document.querySelectorAll(`.panel_lamp`).forEach((p) => {
    p.onclick = function() {
      showModal(`.modal_light`);
    };
  });

  document.querySelectorAll(`.panel_floor`).forEach((p) => {
    p.onclick = function() {
      showModal(`.modal_knob`);
    };
  });

  // //////
  // ///// Scenarios Pagination

  const pagiantorScens = document.querySelector(`.scenarios__paginator`);
  const arrowLeftScens = pagiantorScens.querySelector(`.paginator__arrow_left`);
  const arrowRightScens = pagiantorScens.querySelector(`.paginator__arrow_right`);

  const scenarios = document.querySelector(`.scenarios`);
  const panelCountScens = scenarios.querySelectorAll(`.scenarios__panel`).length;
  const pageCountScens = scenarios.querySelectorAll(`.scenarios__page`).length;
  let currentPage = 1;

  pagiantorScens.classList.toggle(`paginator_hide`, panelCountScens <= 9);

  arrowRightScens.addEventListener(`mouseup`, function() {
    if (currentPage < pageCountScens) {
      currentPage += 1;
      arrowRightScens.classList.toggle(`paginator__arrow_disabled`, currentPage === pageCountScens);
      arrowLeftScens.classList.toggle(`paginator__arrow_disabled`, currentPage === 1);
      scenarios.scroll({
        top: 0,
        left: 645,
        behavior: `smooth`
      });
    }
  });

  arrowLeftScens.addEventListener(`mouseup`, function() {
    if (currentPage > 1) {
      currentPage -= 1;
      arrowRightScens.classList.toggle(`paginator__arrow_disabled`, currentPage === pageCountScens);
      arrowLeftScens.classList.toggle(`paginator__arrow_disabled`, currentPage === 1);
      scenarios.scroll({
        top: 0,
        left: -645,
        behavior: `smooth`
      });
    }
  });
})();
