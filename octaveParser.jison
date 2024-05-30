%lex
%%
\n     { return 'NEWLINE'; }
[a-zA-Z_][a-zA-Z0-9_]* { return 'IDENTIFIER'; }
"break"                  { return 'BREAK'; }
"case"                   { return 'CASE'; }
"catch"                  { return 'CATCH'; }
"continue"               { return 'CONTINUE'; }
"do"                     { return 'DO'; }
"else"                   { return 'ELSE'; }
"elseif"                 { return 'ELSEIF'; }
"end"                    { return 'END'; }
"for"                    { return 'FOR'; }
"function"               { return 'FUNCTION'; }
"global"                 { return 'GLOBAL'; }
"if"                     { return 'IF'; }
"otherwise"              { return 'OTHERWISE'; }
"persistent"             { return 'PERSISTENT'; }
"return"                 { return 'RETURN'; }
"switch"                 { return 'SWITCH'; }
"try"                    { return 'TRY'; }
"until"                  { return 'UNTIL'; }
"unwind_protect"         { return 'UNWIND_PROTECT'; }
"unwind_protect_cleanup" { return 'UNWIND_PROTECT_CLEANUP'; }
"while"                  { return 'WHILE'; }
[0-9]+                   { return 'NUMBER'; }
"<="                     { return '<='; }
"=="                     { return '=='; }
"!="                     { return '!='; }
">="                     { return '>='; }
"+"                      { return '+'; }
"-"                      { return '-'; }
"*"                      { return '*'; }
"/"                      { return '/'; }
"="                      { return '='; }
";"                      { return ';'; }
"("                      { return '('; }
")"                      { return ')'; }
"disp"                   { return 'DISP'; }
"end"                    { return 'END'; }
"while"                  { return 'WHILE'; }
"if"                     { return 'IF'; }
"["                      { return '['; }
"]"                      { return ']'; }
<<EOF>>                  { return 'EOF'; }
.                        { return 'INVALID'; }

%%

%start program

%{
var variables = {};

function get_variable_value(name) {
  return variables[name];
}

function set_variable_value(name, value) {
  variables[name] = value;
}
%}

program
  : statements EOF
    { $$ = $1; }
  ;

statements
  : /* empty */
  | statement SEMICOLON statements
    { $$ = [$1].concat($3); }
  ;

statement
  : assignment
  | disp_statement
  | if_statement
  | while_statement
  ;

assignment
  : IDENTIFIER '=' expression
    { set_variable_value($1, $3); }
  ;

expression
  : comparison
  | expression '+' comparison
  | NUMBER
  ;
