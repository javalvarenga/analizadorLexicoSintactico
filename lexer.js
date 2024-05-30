var Lexer = require("lex");
const fs = require("fs");

const lexer = new Lexer();

// Palabras reservadas en Octave

var reservedWords = [
  "break",
  "case",
  "catch",
  "continue",
  "do",
  "else",
  "elseif",
  "end",
  "for",
  "function",
  "global",
  "if",
  "otherwise",
  "persistent",
  "return",
  "switch",
  "try",
  "until",
  "unwind_protect",
  "unwind_protect_cleanup",
  "while",
];

var row = 1;
var col = 1;

// Regla para manejar saltos de línea: Incrementa el número de línea (row) y reinicia el contador de columna (col) a 1
lexer.addRule(
  /\n/,
  function () {
    row++;
    col = 1;
  },
  []
);
// Regla para manejar cualquier otro carácter: Rechaza el token actual y avanza la columna (col) a la siguiente posición

lexer.addRule(
  /./,
  function () {
    this.reject = true;
    col++;
  },
  []
);

//REGLAS DEL ANALIZADOR
// Regla para palabras reservadas
lexer.addRule(
  new RegExp("\\b(?:" + reservedWords.join("|") + ")\\b"),
  function (lexeme) {
    return {value:lexeme,result:lexeme.toLowerCase(),row:row}
  }
);

// Regla para identificadores (cualquier secuencia de letras, dígitos y guiones bajos que comience con una letra o guion bajo)
lexer.addRule(/[a-zA-Z_][a-zA-Z0-9_]*/, function (lexeme) {
    return { value: lexeme, result: "IDENTIFIER", row: row };
  });

// Regla para números enteros positivos
lexer.addRule(/[0-9]+/, function (lexeme) {
  return { value: lexeme, result: "NUMBER", row: row };
});

// Regla para operadores aritméticos (+, -, *, /) y de asignación (=)
lexer.addRule(/\+|\-|\*|\/|=/, function (lexeme) {
    return { value: lexeme, result: "OPERATOR", row: row };
  });

lexer.addRule(/<=|>=|==|!=|~=|<|>/, function (lexeme) {
    return { value: lexeme, result: "COMPARATOR", row: row };
  });

// Regla para comentarios (cualquier texto después de % hasta el final de la línea)
lexer.addRule(/%.*/, function (lexeme) {
  return { value: lexeme, result: "COMMENT", row: row };
});

// Regla para cadenas de texto entre comillas dobles
lexer.addRule(/\".*\"/, function (lexeme) {
  return { value: lexeme, result: "STRING", row: row };
});

// Regla para punto y coma (;)
lexer.addRule(/;/, function (lexeme) {
  return { value: lexeme, result: "SEMICOLON", row: row };
});

// Regla para el signo de asignación (=)
/* lexer.addRule(/=/, function (lexeme) {
  return { value: lexeme, result: "ASSIGN", row: row };
}); 
 */

// Regla para paréntesis izquierdo
lexer.addRule(/\(/, function (lexeme) {
  return { value: lexeme, result: "OPEN PARENTHESIS", row: row };
});

// Regla para paréntesis derecho
lexer.addRule(/\)/, function (lexeme) {
  console.log("CLOSE PARENTHESIS:", lexeme + " line: " + row);
  return { value: lexeme, result: "CLOSE PARENTHESIS", row: row };
});

lexer.addRule(/\s+/, function (lexeme) {
});

// Regla para ignorar saltos de línea
lexer.addRule(/\n/, function (lexeme) {
  // Ignorar saltos de línea

});

// Regla para caracteres inválidos
// -cualquier caracter que no sea espacio en blanco ni salto de línea
// -Y que no cumpla ninguna regla de las anteriores
lexer.addRule(/[^\s\n]/, function (lexeme) {
  return { value: lexeme, result: "INVALID TOKEN", row: row };
});

// Exportar el lexer para que pueda ser usado en el parser
module.exports = lexer;
