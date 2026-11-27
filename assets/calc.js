const f = (id) => parseFloat(document.getElementById(id).value) || 0;
const r0 = (n) => Math.round(n);

function calc() {
  const area = f('area'), h = f('height'), hookahs = f('hookahs'), seats = f('seats');
  const ach = f('ach'), perGuest = f('perGuest'), hood = f('hood'), coal = f('coal');

  const vol = area * h;
  const byArea = vol * ach;
  const bySeats = seats * perGuest;
  const byHookah = hookahs * coal * 1000 / 4;

  const supply = Math.max(byArea, bySeats, byHookah);
  const local = hookahs * hood;
  const total = Math.max(supply, local * 1.1);
  const realAch = vol > 0 ? total / vol : 0;

  document.getElementById('r1').textContent = r0(byArea) + ' м³/ч';
  document.getElementById('r2').textContent = r0(bySeats) + ' м³/ч';
  document.getElementById('r3').textContent = r0(byHookah) + ' м³/ч';
  document.getElementById('rt').textContent = r0(supply) + ' м³/ч';
  document.getElementById('r4').textContent = r0(local) + ' м³/ч';
  document.getElementById('r5').textContent = r0(total) + ' м³/ч';
  document.getElementById('r6').textContent = r0(total) + ' м³/ч';
  document.getElementById('r7').textContent = realAch.toFixed(1).replace('.', ',') + ' 1/ч';

  const n = document.getElementById('balance');
  const acts = document.getElementById('actions');
  acts.innerHTML = '';
  let msg = '';
  let warn = false;

  if (local > supply) {
    msg = 'Вытяжка от точек больше общего притока на ' + r0(local - supply) + ' м³/ч. Либо приток растёт, либо в зале будет разрежение и дверь не закроется.';
    warn = true;
    acts.insertAdjacentHTML('beforeend', '<li>Пересчитать приток до ' + r0(local * 1.1) + ' м³/ч или убрать часть решёток от точек.</li>');
    acts.insertAdjacentHTML('beforeend', '<li>Проверить приток с соседних помещений — если его нет, зал «сосёт» воздух из кухни и туалетов.</li>');
  } else {
    msg = 'Баланс сходится: приток ' + r0(supply) + ' м³/ч покрывает вытяжку ' + r0(total) + ' м³/ч.';
    acts.insertAdjacentHTML('beforeend', '<li>Проверить, проходит ли ' + r0(total) + ' м³/ч через существующие воздуховоды — диаметр и скорость.</li>');
  }
  if (realAch < 3) {
    msg += ' Кратность ниже 3 — на зал с кальянами это мало, нужен отдельный контур на каждую точку.';
    warn = true;
    acts.insertAdjacentHTML('beforeend', '<li>Добавить местную вытяжку у столов: ' + r0(local) + ' м³/ч без неё не убрать.</li>');
  }
  n.textContent = msg;
  n.className = warn ? 'note warn' : 'note';

  const ci = area > 0 ? r0(supply / area) : 0;
  acts.insertAdjacentHTML('beforeend', '<li>Приток на м² зала: ' + ci + ' м³/(ч·м²). Если больше 15 — проверить шум и подогрев зимой.</li>');
  acts.insertAdjacentHTML('beforeend', '<li>Включить ' + r0(supply * 0.0036) + ' м³/с в подбор вентилятора — это единица, в которой продают оборудование.</li>');
}

document.querySelectorAll('input').forEach((el) => el.addEventListener('input', calc));
calc();
