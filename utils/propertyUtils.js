export function bindMultiplePrices(units) {
    let prices = "";
    const unitPrices = [
        ...new Set(units.map((unit) => parseInt(unit.unitPrice))),
    ].sort((a, b) => a - b);
    if (unitPrices.length === 0) {
        prices = 0;
    } else if (unitPrices.length === 1) {
        prices = formatIndianPrice(unitPrices[0]);
    } else {
        prices = `${formatIndianPrice(unitPrices[0])} to ${formatIndianPrice(unitPrices[unitPrices.length - 1])}`;
    }
    return prices;
}
export function checkUnitTypes(units) {
    console.log(units, "units.length++++");
    if (units.length == 0) return 0;
    let bedRoomsCount = "";
    const unitTypes = [
        ...new Set(units.map((unit) => parseInt(unit.unitName))),
    ].sort((a, b) => a - b);
    if (unitTypes.length === 0) {
        bedRoomsCount = 0;
    } else if (unitTypes.length === 1) {
        bedRoomsCount = unitTypes[0];
    } else {
        bedRoomsCount = `${unitTypes[0]} to ${unitTypes[unitTypes.length - 1]}`;
    }
    return bedRoomsCount;
}
