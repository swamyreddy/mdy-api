function formatIndianPrice(value) {
    if (!value) return null;

    if (value >= 10000000) {
        // Crores
        return (value / 10000000).toFixed(1) + " Cr";
    } else if (value >= 100000) {
        // Lakhs
        return (value / 100000).toFixed(1) + " L";
    } else {
        return value.toLocaleString("en-IN");
    }
}

module.exports = formatIndianPrice;
