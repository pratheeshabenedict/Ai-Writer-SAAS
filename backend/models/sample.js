const calculator = (() => {
    let value = 0;
    return {
        add: (n) => {
            value += n;
            return calculator;
        },
        multiply: (n) => {
            value *= n;
            return calculator;
        },
        result: () => value
    };
})();

console.log(calculator.add(5).multiply(3).result());