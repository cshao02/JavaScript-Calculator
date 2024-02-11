class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "0", //value displayed as string
      working: "", //working displayed as string
      answer: "0", //answer stored as string
      operator: false, //to check if got multiply or divide in equation
      equal: false, //check if equal sign has been pressed
      ansPressed: false //check if ans is pressed to prevent concatenation of ans
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleArithmetic = this.handleArithmetic.bind(this);
    this.handleLogic = this.handleLogic.bind(this);
  }
  handleClick(input, ansPress) { 
    //prevents any numeric input when ans is pressed
    if (this.state.ansPressed) {
      exit;
    }
    //prevents buggy double negative sign if press neg followed by ans at the start
    if (ansPress === "yes" && this.state.working === "-" && parseFloat(this.state.answer) < 0) {
      input = input.replace("-", "");
      this.setState(state => ({
        ansPressed: true,
        value: state.answer,
        working: input
      }))
      exit;
    }
    if (ansPress === "yes") {
      //prevent usage of ans to concatenate to a number
      let arr = this.state.working.split(" ");
      if (/\d/.test(arr[arr.length - 1])) {
        exit;    
      }
      this.setState({
        ansPressed: true
      })
    }
    //refresh screen with new numeric input immediately after equal sign is pressed
    if (this.state.equal) {
      if (input !== ".") {
        this.setState({
          value: input,
          working: input,
          equal: false
        })
      }
    }
    //numeric input before equal sign or after screen refresh after equal sign
    else { 
      switch (this.state.value) {
        case "0":
          //to see 0 as working for first 0 input
          if (input === "0" && this.state.working === "") {
            this.setState({
              working: "0"
            })
            break;
          }
          //prevent decimal from being first input without number
          else if (input === "." && this.state.working === "") {
            break;
          }
          //prevents repeated input 0 after arithmetic operator
          else if (input === "0") {
            break;
          }
          //the case when a 0 is mistyped at first input or after arithmetic operator 
          else if (this.state.working !== "" && input !==".") {
            let str = this.state.working.slice();
            let arr = str.split(" ");
            arr.splice(arr.length - 1, 1, input);
            this.setState({
              value: input,
              working: arr.join(" ")
            })
            break;
          }
          //to display decimal with 0 in front 
          else if (input === ".") {
            this.setState(state => ({
              value: state.value + input,
              working: state.working + input
            }))
            break;
          }
          //concatenation of numbers together and decimal with numbers
          else {     
             this.setState(state => ({
              value: input,
              working: state.working + input,
            }))
            break;
          }   
        case "+":
        case "-":
        case "x":
        case "/":
          if (input === ".") {
            break;
          }
          else {
            this.setState(state => ({
            value: input,
            working: state.working + input,
          }))
          break;
          }   
        default:
          //prevent repeated decimal places
          if (/\./.test(this.state.value) && input === ".") {
            break;
          }
          this.setState(state => ({
            value: state.value + input, 
            working: state.working + input,
          }))   
          break;
      }
    }

  }
  //arithmetic, clear and delete
  //operator cannot be set to false for + and - in case got combi of product and addition/subtraction. 
  handleArithmetic(input) {
    //change ansPressed state to false when any arithmetic is used to allow ans to be reused without concatenation
    if (this.state.ansPressed) {
      this.setState({
        ansPressed: false
      })
    }
    //handle clear
    if (input === "clear") {
      this.setState({
        value: "0",
        working: "",
        operator: false,
        equal: false,
      })
    }
    //handle delete
    else if (input === "delete") {
      //disallow delete right after pressing equal
      if (this.state.equal) {
        //do nothing
      }
      else {
        let arr = this.state.working.split(""); //working
        let arr1 = this.state.value.split(""); //value
        arr1.splice(arr1.length - 1, 1);

        //handles the case of deleting arithmetic
        if (this.state.working[this.state.working.length - 1] === " ") {
          arr.splice(arr.length - 3, 3); 
        }

        //handles deleting of numbers
        else {
          arr.splice(arr.length - 1, 1);    
        }
        
        //if delete creates empty string for value
        let val = arr1.join("");
        let work = arr.join("");
        let a = work.split(" ");
        
        //delete until nothing left
        if (work === "") {
          val = "0";
        }
        //handles 2 cases: delete until operator, and after deleting the operator
        else if (val === "") {
          val = a[a.length - 1]; //retrieve the previous number
          if (val === "") {
            val = a[a.length - 2]; //retrieve the operator
          }
        }
        this.setState({
          value: val,
          working: work
        })
      }    
    }
    //prevents arithmetic when working is empty string except minus
    else if (this.state.working === "" && input === "-") {
      this.setState(state => ({
        value: input, 
        working: "-",
      }))
    }
    else if (this.state.working === "") {
      exit;
    }
    //handles arithmetic immediately after equal sign
    else if (this.state.equal) {
      if (input === "+" || input === "-") {
        this.setState(state => ({
          value: input, 
          working: state.answer + " " + input + " ",
          equal: false
        }))
      }
      else if (input === "x" || input === "/") {
        this.setState(state => ({
          value: input, 
          working: state.answer + " " + input + " ",
          operator: true,
          equal: false
        }))
      }
    }
    //prevents arithmetic changes if negative sign is first input
    else if (this.state.working === "-") {
      exit;
    }
    //Change arithmetic input after negative number input
    else if (this.state.working[this.state.working.length - 1] === "-") {
      let str = this.state.working.slice();
      let arr = str.split(" ");
      arr.splice(arr.length - 2, 2, input);
      if (input === "x" || input === "/") {
        this.setState({
          value: input,
          working: arr.join(" ") + " ",
          operator: true
        })
      }
      else {
        this.setState({
          value: input,
          working: arr.join(" ") + " ",
        })
      }
    }
    //handle negative number inputs
    else if ((this.state.value === "x" || this.state.value === "/") && input === "-") {
      this.setState(state => ({
        value: input,
        working: state.working + input
      }))
    }
    //handle duplicate arithmetic operators
    else if (this.state.value === "+" || this.state.value === "-" || this.state.value === "x" || this.state.value === "/") {
      let str = this.state.working.slice();
      let arr = str.split(" ");
      arr.splice(arr.length - 2, 1, input);
      if (input === "x" || input === "/") {
        this.setState({
          value: input,
          working: arr.join(" "),
          operator: true
        })
      }
      else {
        this.setState({
          value: input,
          working: arr.join(" "),
        })
      }
    }
    //handles normal arithmetics
    else if (input === "+" || input === "-") {
      this.setState(state => ({
        value: input, 
        working: state.working + " " + input + " ",
      }))
    }
    else if (input === "x" || input === "/") {
      this.setState(state => ({
        value: input, 
        working: state.working + " " + input + " ",
        operator: true
      }))
    } 
  }
  handleLogic() {
    //change ansPressed state to false when equal sign is used to allow ans to be reused after equal
    if (this.state.ansPressed) {
      this.setState({
        ansPressed: false
      })
    }
    //prevents duplicate equal sign
    if (this.state.equal) {
      exit;
    }
    //prevents pressing of equal sign when there is only a minus input at the start
    if (this.state.working === "-") {
      exit;
    }
    let array = this.state.working.split(" ");
    //when equal sign is pressed before arithmetic operators
    if (this.state.value === "+" || this.state.value === "-" || this.state.value === "x" || this.state.value === "/") {
      //just remove the unused sign 
      array.splice(array.length - 2, 2);
    }
    let num = 0; //product num
    let sum = 0; //sum from addition and subtraction incl products
    let numArr = [];
    let firstIndex = 0;
    let lastIndex = 0;
    //handle cases multiply and divide first
    if (this.state.operator) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === "x"){
          //for multiple consecutive times or divide
          if (num !== 0) {
            num *= parseFloat(array[i + 1]);
            lastIndex = i + 1;
          }
          else {
            num = parseFloat(array[i - 1]) * parseFloat(array[i + 1]);
            firstIndex = i - 1;
            lastIndex = i + 1;
          }
        }
        else if (array[i] === "/") {
          if (num !== 0) {
            num /= parseFloat(array[i + 1]);
            lastIndex = i + 1;
          }
          else {
            num = parseFloat(array[i - 1]) / parseFloat(array[i + 1]);
            firstIndex = i - 1;
            lastIndex = i + 1;
          }
        }
        else if ((array[i] === "+" && lastIndex !== 0) || (array[i] === "-"  && lastIndex !== 0) || (i === array.length - 1 && (array[i - 1] === "x" || array[i - 1] === "/"))) {
          let innerArr = [];
          innerArr.push(num);
          innerArr.push(firstIndex);
          innerArr.push(lastIndex);
          numArr.push(innerArr);
          num = 0;
          lastIndex = 0;
        }
      }
      //adjust first and last index for 2nd product bunch onwards for array splicing
      if (numArr.length >= 2) {
        let diff = numArr[0][2] - numArr[0][1];
        for (let i = 1; i < numArr.length; i++) {
          numArr[i][1] -= diff;
          numArr[i][2] -= diff;
          diff += numArr[i][2] - numArr[i][1];
        }
      }
      
      //array splicing to replace product bunches with product
      for (let i = 0; i < numArr.length; i++) {
        array.splice(numArr[i][1], numArr[i][2] - numArr[i][1] + 1, numArr[i][0].toString())
      }
    }
    
    
    //handle the addition and subtraction, including the products
    sum = parseFloat(array[0]);
    for (let i = 1; i < array.length; i++) {
      if (array[i] === "+" || array[i] === "-") {
        continue;
      }
      //it's a number and before it is a minus sign
      else if (array[i - 1] === "-") {
        sum -= parseFloat(array[i]);
      }
      //it's a number and before it is a plus sign
      else {
        sum += parseFloat(array[i]);
      }
    }
    
    //update display with the answer
    this.setState(state => ({
      value: sum.toString(),
      working: state.working + " = ",
      equal: true,
      answer: sum.toString()
    }))
  }
  render() {
    return (
    <div id="calc">
        <div id="wholeDisplay">
          <p id="working">{this.state.working}</p>
          <p id="display">{this.state.value}</p>
        </div>
        <div class="buttons">
          
          <button id="delete" onClick={() => this.handleArithmetic("delete")}>CE</button>
          <button id="clear" onClick={() => this.handleArithmetic("clear")}>AC</button>
          <button id="divide" onClick={() => this.handleArithmetic("/")}>/</button>
          <button id="seven" onClick={() => this.handleClick("7")}>7</button>
          <button id="eight" onClick={() => this.handleClick("8")}>8</button>
          <button id="nine" onClick={() => this.handleClick("9")}>9</button>
          <button id="multiply" onClick={() => this.handleArithmetic("x")}>x</button>
          <button id="four" onClick={() => this.handleClick("4")}>4</button>
          <button id="five" onClick={() => this.handleClick("5")}>5</button>
          <button id="six" onClick={() => this.handleClick("6")}>6</button>
          <button id="subtract" onClick={() => this.handleArithmetic("-")}>-</button>
          <button id="one" onClick={() => this.handleClick("1")}>1</button>
          <button id="two" onClick={() => this.handleClick("2")}>2</button>
          <button id="three" onClick={() => this.handleClick("3")}>3</button>
          <button id="add" onClick={() => this.handleArithmetic("+")}>+</button>
          <button id="ans" onClick={() => this.handleClick(this.state.answer, "yes")}>ANS</button>
          <button id="zero" onClick={() => this.handleClick("0")}>0</button>
          <button id="decimal" onClick={() => this.handleClick(".")}>.</button>
          <button id="equals" onClick={() => this.handleLogic()}>=</button>
        </div>       
    </div>
    )
  }
}


ReactDOM.render(<Calculator />, document.getElementById("root"))
