// EX 1: just the necessary instructions in order, sometimes repeated as necessary (as simple as possible)
interface Complex {
    real: number,
    imaginary: number
}

const mainBlob = function() {
    const threePlusTwoi: Complex = {real: 3, imaginary: 2};
    const fourMinusThreei: Complex = {real: 4, imaginary: -3};
    const onePlusFivei: Complex = {real: 1, imaginary: 5};

    const added = {
        real: threePlusTwoi.real + onePlusFivei.real,
        imaginary: threePlusTwoi.imaginary + onePlusFivei.imaginary,
    } as Complex;

    const multiplied = {
        real: fourMinusThreei.real * threePlusTwoi.real,
        imaginary: fourMinusThreei.imaginary * threePlusTwoi.imaginary,
    } as Complex;

    const addedString = `${added.real.toString()} ${added.imaginary >= 0 ? '+' : '-'} ${added.imaginary.toString()}i`;
    const multipliedString = `${multiplied.real.toString()} ${multiplied.imaginary >= 0 ? '+' : '-'} ${multiplied.imaginary.toString()}i`;

    console.log("(3 + 2i) + (1 + 5i) = ",addedString);
    console.log("(4 - 3i) * (3 + 2i) = ",multipliedString);
}();