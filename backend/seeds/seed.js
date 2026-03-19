const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Question = require('../models/Question');

const questions = [
  // ===== Q1-Q10: C++ =====
  {
    questionNumber: 1,
    question: "What will be the output of the following code?\n\nclass A {\n    char a;\n    char b;\n    double z;\n    char c;\n};\ncout << sizeof(A);",
    options: { a: "11", b: "16", c: "18", d: "24" },
    correctAnswer: "d",
    category: "C++"
  },
  {
    questionNumber: 2,
    question: "In C++, consider the pre-increment and post-increment operators. Which of the following is correct?",
    options: {
      a: "++x returns rvalue, x++ returns lvalue",
      b: "Both ++x and x++ return lvalue",
      c: "++x returns lvalue, x++ returns rvalue",
      d: "Both return rvalue"
    },
    correctAnswer: "c",
    category: "C++"
  },
  {
    questionNumber: 3,
    question: "What will be the output?\n\nclass A {\n    char a;\n    int b;\n};\nclass B : public A {\n};\nint main() {\n    cout << sizeof(B);\n}",
    options: { a: "5", b: "8", c: "12", d: "16" },
    correctAnswer: "b",
    category: "C++"
  },
  {
    questionNumber: 4,
    question: "What will be the output? (Assume 32-bit architecture)\n\nclass A {\n    char a;\n    int b;\n    virtual void printFunc() { }\n};\nint main() {\n    cout << sizeof(A);\n}",
    options: { a: "9", b: "10", c: "12", d: "16" },
    correctAnswer: "c",
    category: "C++"
  },
  {
    questionNumber: 5,
    question: "In C/C++, macro definitions are processed and replaced during which phase of program compilation?",
    options: {
      a: "Compilation phase",
      b: "Preprocessing phase",
      c: "Linking phase",
      d: "Execution phase"
    },
    correctAnswer: "b",
    category: "C++"
  },
  {
    questionNumber: 6,
    question: "In C++, inline functions are expanded during which phase of program processing?",
    options: {
      a: "Compilation phase",
      b: "Preprocessing phase",
      c: "Linking phase",
      d: "Execution phase"
    },
    correctAnswer: "a",
    category: "C++"
  },
  {
    questionNumber: 7,
    question: "What will be the output of the code?\n\n#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    char a[] = \"hellojiii\";\n    char *b = a;\n    cout << b;\n}",
    options: {
      a: "Address of a",
      b: "hellojiii",
      c: "h",
      d: "Compilation Error"
    },
    correctAnswer: "b",
    category: "C++"
  },
  {
    questionNumber: 8,
    question: "Consider the following C++ program:\n\nclass A {\n    static int a;\n    int b = 100;\npublic:\n    void Manipulate() const {\n        a += b;\n        cout << a;\n    }\n};\n\nWhat will happen when the program is compiled?",
    options: {
      a: "The program prints 110",
      b: "The program compiles successfully but produces no output",
      c: "Compilation Error because a const function modifies data",
      d: "Compilation Error because a const function cannot modify non-static members only"
    },
    correctAnswer: "a",
    category: "C++"
  },
  {
    questionNumber: 9,
    question: "Consider the following program:\n\n#include <bits/stdc++.h>\nusing namespace std;\nclass A {\n    int b = 100;\npublic:\n    void Manipulate() {\n        cout << b;\n    }\n};\nint main() {\n    const A a;\n    a.Manipulate();\n}",
    options: {
      a: "The program prints 100",
      b: "The program prints 0",
      c: "Compilation Error",
      d: "Runtime Error"
    },
    correctAnswer: "c",
    category: "C++"
  },
  {
    questionNumber: 10,
    question: "In C++, which of the following declarations creates a const pointer to const data?",
    options: {
      a: "const int *p",
      b: "int *const p",
      c: "const int *const p",
      d: "int const *p const"
    },
    correctAnswer: "c",
    category: "C++"
  },

  // ===== Q11-Q20: JavaScript =====
  {
    questionNumber: 11,
    question: "What will be the output?\n\nconsole.log(\"A\");\n\nsetTimeout(() => {\n    console.log(\"B\");\n}, 0);\n\nconsole.log(\"C\");",
    options: { a: "A B C", b: "B A C", c: "A C B", d: "C A B" },
    correctAnswer: "c",
    category: "JavaScript"
  },
  {
    questionNumber: 12,
    question: "What is the type of null in JavaScript?\n\nconsole.log(typeof null);",
    options: { a: "null", b: "object", c: "undefined", d: "number" },
    correctAnswer: "b",
    category: "JavaScript"
  },
  {
    questionNumber: 13,
    question: "What will be the output?\n\nconsole.log(NaN === NaN);",
    options: { a: "true", b: "false", c: "undefined", d: "Error" },
    correctAnswer: "b",
    category: "JavaScript"
  },
  {
    questionNumber: 14,
    question: "Consider the following JavaScript code:\n\nconst a = { b: 1 };\nconst d = { b: 1 };\nconsole.log(a === d);\n\nWhat will be the output?",
    options: { a: "true", b: "false", c: "1", d: "undefined" },
    correctAnswer: "b",
    category: "JavaScript"
  },
  {
    questionNumber: 15,
    question: "Consider the program:\n\nconst a = { b: 1 };\nconst d = { b: 1, c: a };\nconst { b, c } = d;\nconsole.log(c === a);\n\nWhat will be the output?",
    options: { a: "true", b: "false", c: "undefined", d: "Runtime Error" },
    correctAnswer: "a",
    category: "JavaScript"
  },
  {
    questionNumber: 16,
    question: "What will be the output?\n\nlet value = \"b\" + \"a\" + + \"a\" + \"a\";\nvalue = value.toLowerCase();\nconsole.log(value);",
    options: { a: "baaa", b: "baNaNa", c: "banaa", d: "banana" },
    correctAnswer: "d",
    category: "JavaScript"
  },
  {
    questionNumber: 17,
    question: "What will be the output?\n\nconst a = [12, 1231];\na[10] = 100;\nconsole.log(a[4]);",
    options: { a: "0", b: "Error", c: "undefined", d: "100" },
    correctAnswer: "c",
    category: "JavaScript"
  },
  {
    questionNumber: 18,
    question: "What will be the output?\n\nfunction helloji() {\n    console.log(this);\n}\nhelloji();",
    options: {
      a: "undefined",
      b: "window or Global Object",
      c: "helloji function",
      d: "null"
    },
    correctAnswer: "b",
    category: "JavaScript"
  },
  {
    questionNumber: 19,
    question: "What will be the output?\n\nvar x = 10;\nfunction test() {\n    console.log(x);\n    var x = 20;\n}\ntest();",
    options: { a: "10", b: "20", c: "undefined", d: "ReferenceError" },
    correctAnswer: "c",
    category: "JavaScript"
  },
  {
    questionNumber: 20,
    question: "What will be the output?\n\nfor (var i = 0; i < 3; i++) {\n    setTimeout(() => {\n        console.log(i);\n    }, 0);\n}",
    options: { a: "0 1 2", b: "3 3 3", c: "0 0 0", d: "1 2 3" },
    correctAnswer: "b",
    category: "JavaScript"
  },

  // ===== Q21-Q25: Python =====
  {
    questionNumber: 21,
    question: "What will be the output?\n\na = [1, 2, 3, 4, 5]\nprint(a[1:4:2])",
    options: { a: "[1, 3]", b: "[2, 4]", c: "[2, 3, 4]", d: "[1, 2, 3]" },
    correctAnswer: "b",
    category: "Python"
  },
  {
    questionNumber: 22,
    question: "What will be the output?\n\ndef func(a, b=[]):\n    b.append(a)\n    return b\n\nprint(func(1))\nprint(func(2))",
    options: {
      a: "[1] and [2]",
      b: "[1] and [1, 2]",
      c: "[1, 2] and [1, 2]",
      d: "Error"
    },
    correctAnswer: "b",
    category: "Python"
  },
  {
    questionNumber: 23,
    question: "What will be the output?\n\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)",
    options: { a: "[1, 2, 3]", b: "[1, 2, 3, 4]", c: "[4, 1, 2, 3]", d: "Error" },
    correctAnswer: "b",
    category: "Python"
  },
  {
    questionNumber: 24,
    question: "What will be the output?\n\nprint(bool(\"\"), bool(\" \"), bool(\"0\"))",
    options: {
      a: "False False False",
      b: "False True True",
      c: "False False True",
      d: "False True False"
    },
    correctAnswer: "b",
    category: "Python"
  },
  {
    questionNumber: 25,
    question: "What will be the output?\n\na = (1, 2, [3, 4])\na[2].append(5)\nprint(a)",
    options: {
      a: "TypeError — tuples are immutable",
      b: "(1, 2, [3, 4, 5])",
      c: "(1, 2, [3, 4], 5)",
      d: "(1, 2, [5, 3, 4])"
    },
    correctAnswer: "b",
    category: "Python"
  },

  // ===== Q26-Q28: HTML/CSS =====
  {
    questionNumber: 26,
    question: "In CSS, what is the default value of the position property?",
    options: { a: "relative", b: "absolute", c: "static", d: "fixed" },
    correctAnswer: "c",
    category: "HTML/CSS"
  },
  {
    questionNumber: 27,
    question: "What will be the color of the text?\n\n<style>\n  p { color: red; }\n  .text { color: blue; }\n  #main { color: green; }\n</style>\n<p class=\"text\" id=\"main\">Hello</p>",
    options: { a: "red", b: "blue", c: "green", d: "black" },
    correctAnswer: "c",
    category: "HTML/CSS"
  },
  {
    questionNumber: 28,
    question: "In CSS Flexbox, which property is used to align items along the cross axis?",
    options: {
      a: "justify-content",
      b: "align-items",
      c: "flex-direction",
      d: "flex-wrap"
    },
    correctAnswer: "b",
    category: "HTML/CSS"
  },

  // ===== Q29-Q30: Mixed =====
  {
    questionNumber: 29,
    question: "What will be the output?\n\n#include<iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    cout << x++ << \" \" << ++x;\n}",
    options: { a: "5 7", b: "6 7", c: "5 6", d: "Undefined Behavior" },
    correctAnswer: "d",
    category: "C++"
  },
  {
    questionNumber: 30,
    question: "What will be the output?\n\nconsole.log([] == ![]);\nconsole.log([] === []);",
    options: {
      a: "true false",
      b: "false false",
      c: "true true",
      d: "false true"
    },
    correctAnswer: "a",
    category: "JavaScript"
  }
];

async function seedDatabase() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mcq-platform';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Question.deleteMany({});
    console.log('Cleared existing questions');

    await Question.insertMany(questions);
    console.log(`Seeded ${questions.length} questions successfully!`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
