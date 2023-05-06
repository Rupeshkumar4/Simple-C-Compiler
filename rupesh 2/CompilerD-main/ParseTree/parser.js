// Now we start parsing. We define a function named parser which accepts our tokens array.

function parser(tokens) {

    var current = 0;
  
    // Inside it, we define another function called walk() which enables use to do some recursive acrobatics
    function walk() {
      var token = tokens[current];

      /* if the the current token type is equal, then we should check all different possibilities
      such as == and = */
      if (token.type === 'equal') {
        if (tokens[++current].type == 'equal') {
          ++current;
          return {
            type: 'ComparisonE',
            value: token.value + token.value
          };
        } else {
          return {
            type: 'Equal',
            value: token.value
          };
        }
      }
  
      if (token.type === 'star') {
        current++;
        return {
          type: 'Pointer',
          value: token.value
        };
      }
  
      if (token.type === 'hash') {
        current++;
        return {
          type: 'Macro',
          value: token.value
        };
      }
  
      // if the token type is 'not' (!), then we check for != too
      if (token.type === 'not') {
          if (tokens[++current].type === 'equal') {
              ++current;
              return {
                type: 'ComaprisonN',
                value: token.value + "="
              };
          } else {
            return {
              type: 'Not',
              value: token.value
            };
          }
      }
  
      // yawwn, same...
      if (token.type === 'plus') {
          if (tokens[++current].type === 'equal') {
              ++current;
              return {
                type: 'IncByNum',
                value: "+="
              };
          } else if (tokens[current].type === 'plus') {
            ++current;
            return {
              type: 'IncByOne',
              value: "++"
            };
          } else {
            return {
              type: 'Plus',
              value: "+"
            };
          }
      }
  
      // same but we remember the arrow sign =>
      if (token.type === 'minus') {
        if(tokens[++current].type === 'minus') {
        current++;
          return {
            type: 'DecByOne',
            value: "--"
          };
        } else if (tokens[current].type === 'equal') {
          current++;
          return {
            type: 'DecByNum',
            value: "-="
          };
        } else if (tokens[current].type === 'greater') {
          current++;
          return {
            type: 'Arrow',
            value: "->"
          };
        } else {
          return {
            type: 'Minus',
            value: token.value
          };
        }
      }
  
      // if it's a name token, we chaning it to Word. Don't ask.. :D
      if (token.type === 'name') {
          current++;
          return {
            type: 'Word',
            value: token.value
          };
      }
  
      if (token.type === 'question') {
          current++;
          return {
            type: 'Question',
            value: token.value
          };
      }
  
      if (token.type === 'less') {
        if(tokens[++current].type === 'equal') {
        current++;
          return {
            type: 'LessOrEqual',
            value: "<="
          };
        } else {
          return {
            type: 'Less',
            value: token.value
          };
        }
      }
  
      if (token.type === 'and') {
        if(tokens[++current].type === 'and') {
        current++;
          return {
            type: 'AndAnd',
            value: "&&"
          };
        } else {
          return {
            type: 'And',
            value: token.value
          };
        }
      }
  
      if (token.type === 'pipe') {
        if(tokens[++current].type === 'pipe') {
        current++;
          return {
            type: 'OrOr',
            value: "||"
          };
        } else {
          return {
            type: 'Pipe',
            value: token.value
          };
        }
      }
  
      if (token.type === 'greater') {
        if(tokens[++current].type === 'equal') {
        current++;
          return {
            type: 'GreaterOrEqual',
            value: ">="
          };
        } else {
          return {
            type: 'Greater',
            value: token.value
          };
        }
      }
  
      if (token.type === 'caret') {
        if(tokens[++current].type === 'equal') {
        current++;
          return {
            type: 'XorEqual',
            value: '^='
          };
        } else {
          return {
            type: 'Xor',
            value: token.value
          };
        }
      }
  
      if (token.type === 'comma') {
        current++;
        return {
          type: 'Delimiter',
          value: token.value
        };
      }
  
      if (token.type === 'colon') {
        current++;
        return {
          type: 'Colon',
          value: token.value
        };
      }
  
      if (token.type === 'backslash') {
        token = tokens[++current];
        if (token.type === 'name') {
          if (token.value === 't') {
            current++;
            return {
              type: 'Tab',
              value: /\t/
            };
          }
  
          if (token.value === 'n') {
            current++;
            return {
              type: 'Newline',
              value: /\n/
            };
          }
  
          if (token.value === 'r') {
            current++;
            return {
              type: 'CRet',
              value: /\r/
            };
          }
  
          if (token.value === 'b') {
            current++;
            return {
              type: 'Backspace',
              value: /\b/
            };
          }
  
          if (token.value === 'a') {
            current++;
            return {
              type: 'Alert',
              value: /\a/
            };
          }
  
          if (token.value === 'v') {
            current++;
            return {
              type: 'VTab',
              value: /\v/
            };
          }
  
          if (token.value === 'x') {
            current++;
            return {
              type: 'Hex',
              value: /\x/
            };
          }
  
          if (token.value === 'o') {
            current++;
            return {
              type: 'Oct',
              value: /\o/
            };
          }
        }
  
        if (token.type === 'question') {
          current++;
          return {
            type: 'QueMark',
            value: /\?/
          };
        }
      }
  
      /* here we perform some recursive acrobatics. If we encounter an opening bracket, we create a
      new node, call our walk fuction again and push whatever there is inside the bracket,
      inside a child node. When we reach the closing bracket, we stop and push the child node,
      in its parent node */
      if (token.type === 'bracket' &&
          token.value === '['
      ) {
        token = tokens[++current];
  
        var node = {
          type: 'Arr',
          params: []
        };
  
        while (
          (token.type !== 'bracket') ||
          (token.type === 'bracket' && token.value !== ']')
        ) {
  
          node.params.push(walk());
          token = tokens[current];
        }
        current++;
        return node;
      }
  
      // same story here. This time we call it a 'CodeDomain'.
      if (token.type === 'curly' &&
          token.value === '{'
      ) {
        token = tokens[++current];
  
        var node = {
          type: 'CodeDomain',
          params: []
        };
  
        while (
          (token.type !== 'curly') ||
          (token.type === 'curly' && token.value !== '}')
        ) {
  
          node.params.push(walk());
          token = tokens[current];
        }
        current++;
        return node;
      }
  
      if (token.type === 'semi') {
        current++;
        return {
          type: 'Terminator',
          value: token.value
        };
      }
  
      if (token.type === 'dot') {
        current++;
        return {
          type: 'Dot',
          value: token.value
        };
      }
  
      if (token.type === 'number') {
        current++;
        return {
          type: 'NumberLiteral',
          value: token.value
        };
      }
  
      if (token.type === 'string') {
        current++;
        return {
          type: 'StringLiteral',
          value: token.value
        };
      }
  
      if (token.type === 'forwardslash') {
        current++;
        return {
          type: 'ForwardSlash',
          value: token.value
        };
      }
  
      // same as brackets and curly braces but for paranthesis, we call it 'CodeCave'
      if (
        token.type === 'paren' &&
        token.value === '('
      ) {
        token = tokens[++current];
        let prevToken = tokens[current - 2];
        if (typeof(prevToken) != 'undefined' && prevToken.type === 'name') {
          var node = {
            type: 'CodeCave',
            name: prevToken.value,
            params: []
          };
        } else {
            var node = {
              type: 'CodeCave',
              params: []
            };
        }
  
        while (
          (token.type !== 'paren') ||
          (token.type === 'paren' && token.value !== ')')
        ) {
          node.params.push(walk());
          token = tokens[current];
        }
  
        current++;
        return node;
      }
  
      //if we don't recognize the token, we throw an error.
      throw new TypeError(token.type);
    }
  
    // we declare this variable named AST, and start our walk() function to parse our tokens.
    let ast = {
      type: 'Program',
      body: [],
    };
  
    while (current < tokens.length) {
      ast.body.push(walk());
    }
    return ast;
  }
  function tokenizerA(input) {
    // variable current will be our index counter
    var current = 0;
    // tokens will be holding all the tokens we found in our input
    var tokens = [];
  
    // some regex for later use
    var LETTERS = /[a-zA-Z]/;
    var NEWLINE = /\n/;
    var BACKSLASH = /\\/;
    var WHITESPACE = /\s/;
    var NUMBERS = /[0-9]/;
  
    // now we start looping through each character of our input
    while(current < input.length) {
      var char = input[current];
  
      /* From here on, we just compare our current character against all the characters
        thet we accept. If there is a match we add 1 to our current variable, push our
        character as a token to our tokens[] array and continue our loop */
      if (char === '=') {
        tokens.push({
          type: 'equal',
          value: '='
        });
        current++;
        continue;
      }
  
      if (char === '*') {
        tokens.push({
          type: 'star',
          value: '*'
        });
        current++;
        continue;
      }
  
      if (char === '#') {
        tokens.push({
          type: 'hash',
          value: '#'
        });
        current++;
        continue;
      }
  
      if (char === '!') {
        tokens.push({
          type: 'not',
          value: '!'
        });
        current++;
        continue;
      }
  
  
      if (char === '[' || char === ']') {
        tokens.push({
          type: 'bracket',
          value: char
        });
        current++;
        continue;
      }
  
      if (char === '-') {
        tokens.push({
          type: 'minus',
          value: '-'
        });
        current++;
        continue;
      }
  
      if (char === '+') {
        tokens.push({
          type: 'plus',
          value: '+'
        });
        current++;
        continue;
      }
  
      if (char === '/') {
        // 1) one-line comments
        if (input[++current] === '/') {
          while (current < input.length && !NEWLINE.test(input[current])) {
            current++;
          }
        }
        // 2) multilne comments
        else if (input[current] === '*') {
          current++;
          while (current < input.length) {
            if (input[current] === '*' && input[++current] === '/') {
              current++;
              break;
            }
            current++;
          }
        }
        // a single slash
        else {
          tokens.push({
            type: 'forwardslash',
            value: '/'
          });
        }
        continue;
      }
  
  
      if (BACKSLASH.test(char)) {
        tokens.push({
          type: 'backslash',
          value: '\\'
        });
        current++;
        continue;
      }
  
      if (char === '?') {
        tokens.push({
          type: 'question',
          value: '?'
        });
        current++;
        continue;
      }
  
      if (char === '<') {
        tokens.push({
          type: 'less',
          value: '<'
        });
        current++;
        continue;
      }
  
      if (char === '>') {
        tokens.push({
          type: 'greater',
          value: '>'
        });
        current++;
        continue;
      }
  
      if (char === '|') {
          tokens.push({
            type: 'pipe',
            value: '|'
          });
          current++;
          continue;
      }
  
      if (char === '&') {
        tokens.push({
          type: 'and',
          value: '&'
        });
        current++;
        continue;
      }
  
      if (char === '%') {
        tokens.push({
          type: 'percent',
          value: '%'
        });
        current++;
        continue;
      }
  
      if (char === '$') {
        tokens.push({
          type: 'dollar',
          value: '$'
        });
        current++;
        continue;
      }
  
      if (char === '@') {
        tokens.push({
          type: 'at',
          value: '@'
        });
        current++;
        continue;
      }
  
      if (char === '^') {
        tokens.push({
          type: 'caret',
          value: '^'
        });
        current++;
        continue;
      }
  
      if (char === '~') {
        tokens.push({
          type: 'tilde',
          value: '~'
        });
        current++;
        continue;
      }
  
      if (char === '`') {
        tokens.push({
          type: 'grave',
          value: '`'
        });
        current++;
        continue;
      }
  
      if (char === '(' || char === ')') {
        tokens.push({
          type: 'paren',
          value: char
        });
        current++;
        continue;
      }
  
      if (char === ':') {
        tokens.push({
          type: 'colon',
          value: ':'
        });
        current++;
        continue;
      }
  
      if (char === '.') {
        tokens.push({
          type: 'dot',
          value: '.'
        });
        current++;
        continue;
      }
  
      if(char === ',') {
        tokens.push({
          type: 'comma',
          value: ','
        });
        current++;
        continue;
      }
  
      if (char === ';') {
        tokens.push({
          type: 'semi',
          value: ';'
        });
        current++;
        continue;
      }
  
      if (char === '{' || char === '}') {
        tokens.push({
          type: 'curly',
          value: char
        });
        current++;
        continue;
      }
  
      if(WHITESPACE.test(char) || NEWLINE.test(char)) {
        current++;
        continue;
      }
  
      /* If the character is a number, we need to check if the next character is also a number
      in order to push them altogether as 1 number. i.e. if there is 762, we push "762" not "7","6","2" */
      if(NUMBERS.test(char)) {
        var value = '';
  
        while(NUMBERS.test(char)) {
          value += char;
          char = input[++current];
        }
        tokens.push({
          type: 'number',
          value: value
        });
        continue;
      }
  
      /* while checking for LETTERS, we also check for NUMBERS and UNDERLINE
      (i.e. imagine the input as s0m3_c00l_n4m3) or __my_joke_salary */
      if(LETTERS.test(char) || char === '_') {
        var value = char;
        /* need to account for potential end-of-file :D */
        if (++current < input.length) {
          char = input[current];
          /* also need to remember to take care of the last character in the buffer */
          while((LETTERS.test(char) || NUMBERS.test(char) || char === '_') && (current+1 <= input.length)) {
            value += char;
            char = input[++current];
          }
        }
        tokens.push({
          type: 'name',
          value: value
        });
        continue;
      }
  
      /* if the character is a sigle quote or a double quote, we will treat it as a string.
      Until we haven't found the next double quote or single quote, we continue looping.
      When found, then we push the whole value as a string. */
      if(char === '\'') {
        var value = '';
        char = input[++current];
  
        while(char !== '\''){
          value += char;
          char = input[++current];
        }
        char = input[++current];
        tokens.push({
          type: 'string',
          value: value
        });
        continue;
      }
  
      if(char === '"') {
        var value = '';
        char = input[++current];
  
        while(char !== '"'){
          value += char;
          char = input[++current];
        }
        char = input[++current];
        tokens.push({
          type: 'string',
          value: value
        });
        continue;
      }
  
        /*whatever else, we don't know jack! */
      throw new TypeError('Type Error! Unrecognized Character: ' + char);
    }
    return tokens;
  }

function myFunction(){
  var text = document.getElementById("CommentCheker").value;
  var parseTree = parser(tokenizerA(text));

  var answer = document.getElementById("answer");


  parseTree.body.forEach(x => {
    var div = document.createElement("div");
    div.className = "divh";

    var h = document.createElement("details");

    if(x.type == "CodeCave"){
      var p = document.createElement("summary");
      p.innerText = x.type;
      h.appendChild(p);

      x.params.forEach(t => {

        var hh = document.createElement("details");
        var pp = document.createElement("summary");
        pp.innerText = t.type;
        hh.innerHTML = "<p>"+ t.value +"</p>";

        hh.appendChild(pp);

        h.appendChild(hh);
      });

    }else{
      var p = document.createElement("summary");
      p.innerText = x.type;
      h.innerHTML = "<p>"+ x.value +"</p>";
      h.appendChild(p);
    }

    div.appendChild(h);
    answer.appendChild(div);
  });
}