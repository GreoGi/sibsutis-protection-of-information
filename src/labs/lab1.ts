/**
 * Ограничение на размер a,b,p в a^b % p
 * Ограничение задано условиями 1ой лабораторной
 */
const LIMIT = 10 ** 9;

/**
 * Алгоритм быстрого возведения в степень по модулю
 * @param a основание
 * @param b степень
 * @param p модуль
 * @returns a^b % p
 */
export function powByMod(a: bigint, b: bigint, p: bigint): bigint {
  let result: bigint = 1n;
  for(; b; b = b>>1n) {
    result = b & 1n ? result * a % p : result;
    a = a * a % p;
  }
  return result;
}

/**
 * Алгоритм Евклида (наибольший общий делитель) для двух чисел. Рекурсивный
 * @param a целое число
 * @param b целое число
 * @returns НОД(a, b)
 */
export function gcd(a: bigint, b: bigint): bigint {
  // console.log(a, b);
  return b ? gcd(b, a % b) : a;
}

/**
 * Расширенный алгоритм Евклида для двух чисел. Итеративный
 * НОД(a, b) = ax + by. Всякое там соотношение Безу, коэфициенты Безу, вычисление инверсии числа по модулю
 * @param a целое число
 * @param b целое число
 * @returns [ НОД(a, b), x, y ]
 */
export function extendedGcd(a: bigint, b: bigint): bigint[] {
  //            gcd(a,b) x  y     Ответом будет массив U
  //                 |   |  |
  //                 V   V  V
  let U: bigint[] = [a, 1n, 0n];
  let V: bigint[] = [b, 0n, 1n];
  let T: bigint[] = []; 

  // console.log(`[${U[0]},\t${U[1]},\t${U[2]}]`);
  // console.log(`[${V[0]},\t${V[1]},\t${V[2]}]`);

  while (V[0]) {
    let q: bigint = U[0] / V[0];  // для T = U - qV, целое от деления

    for(let i = 0; i < 3; i++) {
      T[i] = U[i] - q * V[i];
    }
    // console.log(`[${T[0]},\t${T[1]},\t${T[2]}]`);

    U = [...V]; // в js U = V не присваевает массивы по значению, а просто копирует ссылку,
    V = [...T]; // методы для присвоения по значению мне писать лень, а этот синтакс короткий и классный.
  }
  return U;
}

export class DiffieHellman {
  // Безопасное простое число вида P = 2Q + 1, где Q - число Софи Жермен
  P: bigint;
  // Первообразный корень по модулю P
  g: bigint;
  constructor() {
    let tempP: bigint;
    let tempg: bigint;

    do {
      tempP = bigintRandom_odd(5, LIMIT);
    } while (!isSafePrime(tempP));

    this.P = tempP;
    do {
      tempg = bigintRandom(2, Number(tempP) - 2);
    } while (!isAntiderivativeRoot_simple(tempg, this.P));

    this.g = tempg;
    // console.log('P: ', this.P, 'g: ', this.g)
  }

  /**
   * Генерирует закрытый ключ 1 <= Xi < P
   * @returns 1 <= Xi < P
   */
  generatePrivateKey = (): bigint => {
    return bigintRandom(1, Number(this.P -1n));
  }

  /**
   * Генерирует открытй ключ на основе закрытого с помощью g^Xi % P = Yi
   * @param privateKey - закрытый ключ вида 1 <= Xi < P
   * @returns Yi
   */
  generatePublicKey = (privateKey: bigint): bigint => {
    if(privateKey > this.P - 1n) {
      throw 'privateKey is too big!';
    }
    if(privateKey < 1n) {
      throw 'privateKey is too small!';
    }
    return powByMod(this.g, privateKey, this.P);
  }

  generateSharedKey = (publicKey: bigint, privateKey: bigint): bigint => {
    if(privateKey > this.P - 1n) {
      throw 'privateKey is too big!';
    }
    if(privateKey < 1n) {
      throw 'privateKey is too small!';
    }
    if (publicKey > this.P - 1n) {
      throw 'invalid publicKey!';
    }
    return powByMod(publicKey, privateKey, this.P);
  }
}

/**
 * Трудоёмкая ф-ия вычисления x'а, зная основание a, результат y и модуль p
 * в a^x %p = y
 * @param y результат возведения в степень по модулю
 * @param a основание
 * @param p модуль
 * @returns x такой, что a^x % p = y
 */
export function babyStepGiantStep(y: bigint, a: bigint, p: bigint): bigint {
  const m = bigintSqrt(p) + 1n;
  let ajy = [];
  let am = [];
  for (let j = 0n; j < m; j++) {
    ajy.push({ j, value: (powByMod(a, j, p) * powByMod(y, 1n, p)) % p});
  }
  for (let i = 1n; i <= m; i++) {
    am.push({ i, value: powByMod(a, i*m, p)});
  }
  // console.log(am, ajy);
  // debugger;
  am.sort((a, b) => {
    return Number(a.value - b.value);
  });
  ajy.sort((a, b) => {
    return Number(a.value - b.value);
  });
  // console.log(am, ajy);
  // debugger;
  let j = 0;
  let i = 0;
  while(i < m || j < m) {
    if (am[i].value < ajy[j].value) {
      i++;
    } else if (am[i].value > ajy[j].value) {
      j++;
    } else {
      return am[i].i * m - ajy[j].j;
    }
  }
  return 0n;
}

//=== UTILS ===//

/**
 * Ф-ия генерит случайное число в диапазоне от min до max
 * @param max конец диапазона (до 2^53), потому что не bigint, а тащить ещё одну зависимость мне влом
 * @returns случайное большое целое в диапазоне от 1 до max
 */
export function bigintRandom(min: number, max: number): bigint {
  let rand = min + Math.random() * (max + 1 - min);
  return BigInt(Math.floor(rand));
}

/**
 * Ф-ия генерит случайное число 1 + 2n, где n < max/2, (нечётные числа)
 * чтобы не выходить за рамки диапазона от 1 до max.
 * @param max конец диапазона (до 2^53), потому что не bigint, а тащить ещё одну зависимость мне влом
 * @returns случайное большое целое в диапазоне от 1 до max
 */
export function bigintRandom_odd(min: number, max: number): bigint {
  let half = (max - min + 1) / 2;
  min = min & (~1);
  let rand = min + 1 + 2 * Math.floor(Math.random() * (half));
  return BigInt(rand);
}

/**
 * Вспомогательная ф-ия, точный тест простоты перебором делителей до sqrt(a)
 * @param a целое число для проверки
 * @returns boolean
 */
export function isPrime_bySqrt(a: bigint): boolean {
  if (a <= 1n) {
    return false;
  }
  const sqrt = bigintSqrt(a);
  for (let i = 2n; i <= sqrt; i++) {
    if ((a % i) === 0n) {
      return false;
    }
  }
  return true;
}

/**
 * Вспомогательная ф-ия, вероятностный тест простоты малой теоремой ферма
 * a^b % a = 1, где a - простое, 1 < b < a-1, а точнее b - целое взаимнопростое с a
 * Этот тест простоты не учитывает числа Кармайкла
 * @param a целое число для проверки
 * @param numOfTests целое число кол-ва проверок, чем больше - тем выше вероятность,
 * что число a проверится правильно
 * @returns boolean
 */
export function isPrime_byFerma(a: bigint, numOfTests: bigint): boolean {
  if (a == 2n) {
    return true;
  }

  for (let i = 0n; i < numOfTests; i++) {
    let b = bigintRandom(1, Number(a)-1);
    if(powByMod(b, a-1n, a) !== 1n || gcd(a, b) !== 1n) {
      return false;
    }
  }
  return true;
}

/**
 * Вспомогательная ф-ия, проверяет, что число a является безопасным простым числом
 * т.е. число а вида a = 2Q + 1, где Q тоже простое (число Софи Жермен)
 * @param a целое число для проверки
 * @returns boolean
 */
export function isSafePrime(a: bigint): boolean {
  // if (!isPrime_bySqrt(a)) {
  if (!isPrime_byFerma(a, 100n)) {
    return false;
  }
  const Q = (a - 1n) / 2n;
  // if (!isPrime_bySqrt(Q)) {
  if (!isPrime_byFerma(Q, 100n)) {
    return false;
  }
  return true;
}

/**
 * Вспомогательная ф-ия, sqrt из bigint
 * встроенный класс Math не работает с bigint, и оператор возведения в степень ** 
 * работает только с целыми числами, то сделаем свой sqrt
 * @param value большое целое
 * @returns sqrt(value)
 */
export function bigintSqrt(value: bigint): bigint {
  if (value < 0n) {
    throw 'square root of negative numbers is not supported'
  }

  if (value < 2n) {
    return value;
  }

  function newtonIteration(n: bigint, x0: bigint): bigint {
    const x1 = ((n / x0) + x0) >> 1n;
    if (x0 === x1 || x0 === (x1 - 1n)) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(value, 1n);
}

/**
 * Ф-ия проверяет, является ли a первообразным корнем по модулю p
 * Работает только с простыми числами (лень писать ф-ию Эйлера для работы со всеми числами)
 * @param a целое простое число на проверку
 * @param p модуль
 * @returns boolean
 */
export function isAntiderivativeRoot_true(a: bigint, p: bigint): boolean {
  if (powByMod(a, p-1n, p) !== 1n) {
    return false;
  }
  for (var i = 1n; i <= p-2n; i++) {
    if (powByMod(a, p-1n, p) === 1n) {
      return false;
    }
  }
  return true;
}

/**
 * Упрощённоя ф-ия проверяет, является ли a первообразным корнем по модулю p
 * Работает только с простыми числами (лень писать ф-ию Эйлера для работы со всеми числами)
 * @param a целое простое число на проверку
 * @param p модуль
 */
export function isAntiderivativeRoot_simple(a: bigint, p: bigint): boolean {
  if (a < 2n || a >= p - 1n) {
    return false;
  }
  const Q = (p - 1n) / 2n;
  if (powByMod(a, Q, p) === 1n) {
    return false
  }
  return true;
}