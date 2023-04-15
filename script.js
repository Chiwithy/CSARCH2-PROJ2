document.addEventListener ("DOMContentLoaded", function () {
    document.getElementById ("addButton").addEventListener ("click", addBinary);
    
    function addBinary() {
        // Get the values of the user inputs
        const binaryOp1 = document.getElementById("binaryOp1").value.trim ();
        const binaryOp1B2 = document.getElementById("binaryOp1B2").value.trim ();
        const binaryOp2 = document.getElementById("binaryOp2").value.trim ();
        const binaryOp2B2 = document.getElementById("binaryOp2B2").value.trim ();
        const roundChoice = document.getElementById("roundChoice").value;
        const bits = document.getElementById("bits").value.trim ();

        if (binaryOp1 === "" || binaryOp1B2 === "" ||
            binaryOp1B2 === "" || binaryOp2B2 === "" ||
            roundChoice === "" || bits === "") {
            document.getElementById ("error").textContent = "Input field(s) incomplete.";
            return;
        }
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
        let [normBinaryOp1, normBinaryOp1B2] = normalize (binaryOp1, binaryOp1B2);
        let [normBinaryOp2, normBinaryOp2B2] = normalize (binaryOp2, binaryOp2B2);
        
        // Set HTML contents for normalized values
        document.getElementById("binaryOp1Display").innerHTML = `${normBinaryOp1} x 2<sup>${normBinaryOp1B2}</sup>`;
        document.getElementById("binaryOp2Display").innerHTML = `${normBinaryOp2} x 2<sup>${normBinaryOp2B2}</sup>`;

        let [alignedBinaryOp1, alignedBinaryOp1B2, alignedBinaryOp2, alignedBinaryOp2B2] = alignBits (normBinaryOp1, normBinaryOp1B2,
                                                                                                      normBinaryOp2, normBinaryOp2B2);

        // Set HTML contents for aligned normalized values
        document.getElementById("binaryOp1Display").innerHTML = `${alignedBinaryOp1} x 2<sup>${alignedBinaryOp1B2}</sup>`;
        document.getElementById("binaryOp2Display").innerHTML = `${alignedBinaryOp2} x 2<sup>${alignedBinaryOp2B2}</sup>`;
        
        //sum w/o normalization
        const sumArray = get_sum(alignedBinaryOp1, alignedBinaryOp2);
        const outputElement = document.getElementById("output");
        outputElement.innerHTML = `Sum: ${sumArray.join("")} x 2<sup>${alignedBinaryOp1B2}</sup>`;
    }

    function normalize (binaryOp, binaryOpB2) {
        let decimalIndex = binaryOp.indexOf (".");
        let exp = parseInt (binaryOpB2);
        
        while (decimalIndex !== 1) {        // While binary point isnt the 2nd character in the binary string (only one whole digit)
            binaryOp = movePointLeft (binaryOp);
            decimalIndex = binaryOp.indexOf (".");
            exp++;
        }

        return [binaryOp, exp.toString ()];
    }

    function alignBits (binaryOp1, binaryOp1B2, binaryOp2, binaryOp2B2) {
        let exp1 = parseInt (binaryOp1B2);
        let exp2 = parseInt (binaryOp2B2);
        let diff = Math.abs (Math.abs (exp1) - Math.abs (exp2));
        let i = 0;
        let align = (exp1 < exp2) ? 1 : 2;      // Align first operand if its exponent is smaller, else align second operand
        let binToAlign = (exp1 < exp2) ? binaryOp1 : binaryOp2;
        let expToAlign = (exp1 < exp2) ? parseInt (binaryOp1B2) : parseInt (binaryOp2B2);
        let expTarget = (exp1 < exp2) ? parseInt (binaryOp2B2) : parseInt (binaryOp1B2);
        
        while (expToAlign !== expTarget) {
            binToAlign = movePointLeft (binToAlign);
            expToAlign++;
        }

        if (align === 1)
            return [binToAlign, expToAlign.toString (), binaryOp2, binaryOp2B2];
        else
            return [binaryOp1, binaryOp1B2, binToAlign, expToAlign.toString ()];
    }

    function movePointLeft (binaryString) {
        let decimalIndex = binaryString.indexOf (".");

        if (decimalIndex === -1) {      // If input is just whole number
            binaryString += ".";        // Add initial binary point
            decimalIndex = binaryString.indexOf (".");
        }

        let wholeBits = binaryString.substring (0, decimalIndex);           // Get bits after binary point
        let fractionBits = binaryString.substring (decimalIndex + 1);       // Get bits before binary point

        if (wholeBits.length === 0)     // If no whole digit, add one leading 0
            wholeBits = "0";

        fractionBits = wholeBits.charAt (wholeBits.length - 1) + fractionBits;      // Add LSb of whole bits to fraction bits
        wholeBits = wholeBits.substring (0, wholeBits.length - 1) + ".";            // Append binary point to next LSb
        binaryString = wholeBits + fractionBits;        // Combine string

        if (wholeBits.length === 1)     // If no whole digit (i.e., wholeBits only contains "."), add one leading 0
            binaryString = "0" + binaryString;

        return binaryString;
    }
        function get_sum(normBinaryOp1, normBinaryOp2){
        let carry = 0;
        let sumArray = [];
        while (normBinaryOp1.length < normBinaryOp2.length ) {
            normBinaryOp1 = normBinaryOp1 + "0";
        }        
        while (normBinaryOp2.length < normBinaryOp1.length ) {
            normBinaryOp2 = normBinaryOp2 + "0";
        }       
        for (let i = normBinaryOp1.length; i >= 0; i--) {
          const binaryDigit1 = normBinaryOp1[i];
          const binaryDigit2 = normBinaryOp2[i];
          let sum;
          if (binaryDigit1 === "1" && binaryDigit2 === "1") {
            if (carry === 1) {
              sum = "1";
            } else {
              sum = "0";
            }
            carry = 1;
          } else if (binaryDigit1 === "1" || binaryDigit2 === "1") {
            if (carry === 1) {
              sum = "0";
              carry = 1;
            } else {
              sum = "1";
            }
          }
          else if(binaryDigit1 === "."){
              sum=".";
          } 
          else {
            if (carry === 1) {
              sum = "1";
              carry = 0;
            } else {
              sum = "0";
            }
          }
      
          sumArray.unshift(sum);
        }
      
        if (carry === 1) {
          sumArray.unshift("1");
        }
        return sumArray;
      }
});
