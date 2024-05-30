const fs = require("fs");
const lexer = require('./lexer');
const { Parser } = require('jison');
const grammar = require('./grammar.json');
let lexicalErrors = [];

// Leer el archivo con el código a analizar
const codigoFuente = fs.readFileSync("codigo.txt", "utf8");

// Leer y compilar la gramática
const parser = new Parser(grammar);


// Ejecutar el análisis léxico y verificar los tokens
lexer.setInput(codigoFuente);

let tokens = [];
let token;
while (token = lexer.lex()) {
  console.log('token',token)
  if (token.result === 'INVALID TOKEN') {
    lexicalErrors.push({ value: token.value, result: token.result, row: token.row });
  } else {
    tokens.push(token);
  }
}

parser.yy.parseError = function (str, hash) {
  console.log('str',str,'hash',hash)
  if (hash.loc) {

    throw new Error(`Parsing failed at line ${hash.loc.first_line}, column ${hash.loc.first_column}: ${hash.text}`);
  } else {
    throw new Error(`Parsing failed: ${hash.text}`);
  }
};


if (lexicalErrors.length > 0) {
  console.error('Parsing failed: Invalid tokens found');
  console.log('lexicalErrors', lexicalErrors);
} else {
  // Si todos los tokens son válidos, ejecutar el análisis sintáctico
  parser.lexer = {
    lex: function() {
      const nextToken = tokens.shift();
      if (!nextToken) return 'EOF';
      this.yytext = nextToken.value;
      return nextToken.result;
    },
    setInput: function(input) {
      lexer.setInput(input);
    },
    upcomingInput: function() {
      return lexer.upcomingInput();
    }
  };

   function ejecutarAnalisisSintactico() {
    try {
      parser.parse(codigoFuente);
      console.log('Parsing successful');
    } catch (e) {
      console.error('Parsing failed: ', e.message);
    }
  } 

   ejecutarAnalisisSintactico(); 
}