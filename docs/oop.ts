// EX 3: OOP - instructions encased in objects which represent some internal state, and expose restricted access to it
// Note - the name of the class is prepended with an 'O' to prevent a name collision with the types in other EXs
class OComplex {
  real: number;
  imaginary: number;
  
  constructor(real: number, imaginary: number) {
    this.real = real;
    this.imaginary = imaginary;
  }
  
  add(other: OComplex): OComplex {
    return new OComplex(
      this.real + other.real,
      this.imaginary + other.imaginary);
  }
  
  mul(other: OComplex): OComplex {
    return new OComplex(
      this.real * other.real,
      this.imaginary * other.imaginary);
  }
  
  print(): string {
    return `${this.real.toString()} ${this.imaginary >= 0 ? '+' : '-'} ${this.imaginary.toString()}i`
  }
}

const mainOOP = function () {
  const threePlusTwoi: OComplex = new OComplex(3, 2);
  const fourMinusThreei: OComplex = new OComplex(4, -3);
  const onePlusFivei: OComplex = new OComplex(1, 5);
  
  const added: OComplex = threePlusTwoi.add(onePlusFivei);
  const multiplied: OComplex = fourMinusThreei.mul(threePlusTwoi);
  
  console.log("(3 + 2i) + (1 + 5i) = ", added.print());
  console.log("(4 - 3i) * (3 + 2i) = ", multiplied.print());
}();