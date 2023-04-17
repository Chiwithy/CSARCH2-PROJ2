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
        
        let newAlignedBinaryOp1 = [];
        let newAlignedBinaryOp2 = [];

        if (roundChoice === "grs") {
            newAlignedBinaryOp1 = addGRS(alignedBinaryOp1, bits);
            newAlignedBinaryOp2 = addGRS(alignedBinaryOp2, bits);
        }

        else if (roundChoice === "rounding") {
            newAlignedBinaryOp1 = rounding(alignedBinaryOp1, bits);
            newAlignedBinaryOp2 = rounding(alignedBinaryOp2, bits);
        }
        //sum w/o normalization
        const sumArray = get_sum(newAlignedBinaryOp1, newAlignedBinaryOp2,bits);
        

        let finalNotNormalizedBinaryOp = [];
        if (roundChoice === "grs") {
            finalNotNormalizedBinaryOp = rounding(sumArray, bits);
        }

        else if (roundChoice === "rounding") {
            finalNotNormalizedBinaryOp = sumArray;
        }

        const outputElement = document.getElementById("output");
        outputElement.innerHTML = `Sum: ${finalNotNormalizedBinaryOp.join("")} x 2<sup>${alignedBinaryOp1B2}</sup>`;

        const [finalNormalizedBinaryOp, finalNormalizeBinaryOpB2] = normalize (finalNotNormalizedBinaryOp.join (""), alignedBinaryOp1B2);
        outputElement.innerHTML = `Sum: ${finalNormalizedBinaryOp} x 2<sup>${finalNormalizeBinaryOpB2}</sup>`;
        document.getElementById("download").disabled = false;
    }
    
    document.getElementById("download").addEventListener("click", downloadOutput);
    function downloadOutput() {
      let output = document.getElementById("output").textContent;
    
      // Replace "x 2" followed by a number with "x 2^<number>"
      output = output.replace(/x\s\d+(\d+)/g, "x 2^$1");
      const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "output.txt";
      link.click();
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

     function get_sum(normBinaryOp1, normBinaryOp2,bits){
      let carry = 0;
      let sumArray = [];      

      for (let i = bits+1; i >= 0; i--) {
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

    function addGRS(normBinaryOp, bits) {
        let bitCounter = 0;
        let newValue = [];
        let indexBeforeGRS = 0;
        let grsCtr = 0;
        
        let a = 0;
        while (bitCounter < bits && grsCtr < 50) {
            const binaryDigit = normBinaryOp[a];
            if (binaryDigit === ".") {
                newValue.push(".");
                indexBeforeGRS++;
                a++;
            }

            else if (binaryDigit === "0") {
                newValue.push("0");
                bitCounter++;
                indexBeforeGRS++;
                a++;
            }

            else if (binaryDigit === "1") {
                newValue.push("1");
                bitCounter++;
                indexBeforeGRS++;
                a++;
            }
            grsCtr++;

            
        }

        //indexBeforeGRS--;

        let guardBit = normBinaryOp[indexBeforeGRS];
        let roundBit = normBinaryOp[indexBeforeGRS + 1];
        let stickyBit = "0";
            
        let i = indexBeforeGRS;
        while (i < normBinaryOp.length) {
            const binaryDigit = normBinaryOp[i];
            if (binaryDigit === "1") {
                stickyBit = "1";
                break;
            }

            else if (binaryDigit === "0") {
                i++;
                if (i === normBinaryOp.length) {
                    stickyBit = "0";
                    break;
                }
            }

            else if (binaryDigit === ".") {
                i++;
            }
        }

        newValue.push(guardBit);
        newValue.push(roundBit);
        newValue.push(stickyBit);

        return newValue;
    }

    function rounding(normBinaryOp, bits) {
        let bitCounter = 0;
        let trimmedValue = [];
        let addedValue = [];
        let removedDigits = [];
        let roundedValue = [];
        let indexAfterTrim = 0;
        let roundUpFlag = false;
        let roundCtr = 0;
        
        let a = 0;
        while (bitCounter < bits && roundCtr < 50) {
            const binaryDigit = normBinaryOp[a];
            if (binaryDigit === "1") {
                trimmedValue.push("1");
                addedValue.push("0");
                bitCounter++;
                indexAfterTrim++;
                a++;
            }

            else if (binaryDigit === "0") {
                trimmedValue.push("0");
                addedValue.push("0");
                bitCounter++;
                indexAfterTrim++;
                a++;
            }

            else if (binaryDigit === ".") {
                trimmedValue.push(".");
                addedValue.push(".");
                indexAfterTrim++;
                a++;
            }

            roundCtr++;
        }

        if (bitCounter == bits) {
            addedValue[addedValue.length - 1] = "1";
        }

        // indexAfterTrim--;
        let lastMantissaBit = normBinaryOp[indexAfterTrim - 1];
        let i = indexAfterTrim;
        while (i < normBinaryOp.length) {
            const binaryDigit = normBinaryOp[i];
            if (binaryDigit === "1") {
                removedDigits.push("1");
                i++;
            }

            else if (binaryDigit === "0") {
                removedDigits.push("0");
                i++;
            }

            else if (binaryDigit === ".") {
                i++;
            }
        }

        if (removedDigits.length === 1) {
            if (removedDigits[0] === "1") {
                roundUpFlag = true;
            }

            else if (removedDigits[0] === "0") {
                roundUpFlag = false;
            }
        }

        else if (removedDigits.length === 2) {
            if (removedDigits[0] === "0" && removedDigits[1] === "0") {
                roundUpFlag = false;
            }

            else if (removedDigits[0] === "0" && removedDigits[1] === "1") {
                roundUpFlag = false;
            }

            else if (removedDigits[0] === "1" && removedDigits[1] === "0") {
                roundUpFlag = true;
            }

            else if (removedDigits[0] === "1" && removedDigits[1] === "1") {
                roundUpFlag = false;
            }
        }
        
        else if (removedDigits.length >= 3) {
            if (removedDigits[0] == "0") {
                roundUpFlag = false;
            }

            else if (removedDigits[0] == "1" && removedDigits[1] == "0" && removedDigits[2] == "0") {
                if (lastMantissaBit == "0") {
                    roundUpFlag = false;
                }

                else if (lastMantissaBit == "1") {
                    roundUpFlag = true;
                }
            }

            else if (removedDigits[0] == "1") {
                if (removedDigits[1] == "0" && removedDigits[2] == "1") {
                    roundUpFlag = true;
                }

                if (removedDigits[1] == "1" && removedDigits[2] == "0") {
                    roundUpFlag = true;
                }

                if (removedDigits[1] == "1" && removedDigits[2] == "1") {
                    roundUpFlag = true;
                }
            }
        }

        if (roundUpFlag === true) {
            roundedValue = get_sum(trimmedValue, addedValue);
        }

        else {
            roundedValue = trimmedValue;
        }

        return roundedValue;
    }

    function countBits (binaryOp) {
        return binaryOp.length - 1;
    }
    window.onscroll = function() {
        var titleBar = document.querySelector('.title-bar');
        if (window.pageYOffset > 0) {
            titleBar.classList.add('sticky');
        } else {
            titleBar.classList.remove('sticky');
        }
    }
});
