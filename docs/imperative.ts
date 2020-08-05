// EX 2: Imperative - instructions in order, but logically grouped into functions that modify provided state
interface Complex {
  real: number,
  imaginary: number
}

function add(a: Complex, b: Complex) {
  return {
    real: a.real + b.real,
    imaginary: a.imaginary + b.imaginary
  } as Complex;
}

function mul(a: Complex, b: Complex) {
  return {
    real: a.real * b.real,
    imaginary: a.imaginary * b.imaginary
  } as Complex;
}

function printComplex(c: Complex): string {
  return `${c.real.toString()} ${c.imaginary >= 0 ? '+' : '-'} ${c.imaginary.toString()}i`;
}

const mainImperative = function () {
  const threePlusTwoi: Complex = {real: 3, imaginary: 2};
  const fourMinusThreei: Complex = {real: 4, imaginary: -3};
  const onePlusFivei: Complex = {real: 1, imaginary: 5};
  
  console.log("(3 + 2i) + (1 + 5i) = ", printComplex(add(threePlusTwoi, onePlusFivei)));
  console.log("(4 - 3i) * (3 + 2i) = ", printComplex(mul(fourMinusThreei, threePlusTwoi)));
}();