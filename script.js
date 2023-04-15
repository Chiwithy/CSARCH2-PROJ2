document.addEventListener ("DOMContentLoaded", function () {
    document.getElementById ("addButton").addEventListener ("click", addBinary);
    
    function addBinary() {
        // Get the values of the user inputs
        const binaryOp1 = document.getElementById("binaryOp1").value;
        const binaryOp1B2 = document.getElementById("binaryOp1B2").value;
        const binaryOp2 = document.getElementById("binaryOp2").value;
        const binaryOp2B2 = document.getElementById("binaryOp2B2").value;
        const roundChoice = document.getElementById("roundChoice").value;
        const bits = document.getElementById("bits").value;

        // Set the HTML content of the display elements
        document.getElementById("binaryOp1Display").innerHTML = `${binaryOp1} x 2<sup>${binaryOp1B2}</sup>`;
        document.getElementById("binaryOp2Display").innerHTML = `${binaryOp2} x 2<sup>${binaryOp2B2}</sup>`;
        document.getElementById("roundChoiceDisplay").innerHTML = roundChoice;
        document.getElementById("bitsDisplay").innerHTML = `${bits}`;

        // Check for decimal points in the inputs
        const decimalIndex1 = binaryOp1.indexOf(".");
        const decimalIndex2 = binaryOp2.indexOf(".");

        // Check for invalid binary digits in binary operands
        const binaryOp1Array = binaryOp1.split("");
        const binaryOp2Array = binaryOp2.split("");
        for (let i = 0; i < binaryOp1Array.length; i++) {
            const binaryDigit = binaryOp1Array[i];
            if (binaryDigit !== "0" && binaryDigit !== "1" && binaryDigit !== ".") {
                // Display an error message on the page
                document.getElementById("error").textContent = "Invalid binary operand(s)!";
                // Exit the function early
                return;
            }
        }
        for (let i = 0; i < binaryOp2Array.length; i++) {
            const binaryDigit = binaryOp2Array[i];
            if (binaryDigit !== "0" && binaryDigit !== "1" && binaryDigit !== ".") {
                // Display an error message on the page
                document.getElementById("error").textContent = "Invalid binary operand(s)!";
                // Exit the function early
                return;
            }
        }

        //Initial Normalization
        [normBinaryOp1, normBinaryOp1B2] = normalize (binaryOp1, binaryOp1B2);
        [normBinaryOp2, normBinaryOp2B2] = normalize (binaryOp2, binaryOp2B2);
        
        // Set HTML contents for normalized values
        document.getElementById("binaryOp1Display").innerHTML = `${normBinaryOp1} x 2<sup>${normBinaryOp1B2}</sup>`;
        document.getElementById("binaryOp2Display").innerHTML = `${normBinaryOp2} x 2<sup>${normBinaryOp2B2}</sup>`;
    }

    function normalize (binaryOp, binaryOpB2) {
        let decimalIndex = binaryOp.indexOf (".");
        let exp = parseInt (binaryOpB2);
        
        if (decimalIndex === -1) {      //Op1 is a whole number
            binaryOp += ".";
            decimalIndex = binaryOp.indexOf (".");
        }
        
        while (decimalIndex !== 1) {
            let wholeBits = binaryOp.substring (0, decimalIndex);
            let fractionBits = binaryOp.substring (decimalIndex + 1);

            fractionBits = wholeBits.charAt (wholeBits.length - 1) + fractionBits;
            wholeBits = wholeBits.substring (0, wholeBits.length - 1) + ".";
            binaryOp = wholeBits + fractionBits;
            decimalIndex = binaryOp.indexOf (".");
            exp++;
        }
        return [binaryOp, exp.toString ()];
    }
});