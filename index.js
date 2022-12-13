// QUESTIONS- How to connect employee and manager
// How to pull department names on line 74



const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


const db = mysql.createConnection(
  {
    host: 'localhost',
    
    user: 'root',
    
    password: 'password',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
  );
  


function mainChoices() {
inquirer
  .prompt([{

    type: 'list',
    name: 'mainChoices',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update and employee role']
  }])
  .then((response) => {

    console.log(response);
    if (response.mainChoices === 'View all departments') {
      viewAllDepartments();
    };
    if (response.mainChoices === 'View all roles') {
      viewAllRoles();
    };
    if (response.mainChoices === 'View all employees') {
      viewAllEmployees();
    };
    if (response.mainChoices === 'Add a department') {
      addDepartments();
    };
    if (response.mainChoices === 'Add a role') {
      addRoles();
    };
  });

}
// queryDepartmentNames();
mainChoices();

function addRoles() {

  inquirer
  .prompt([{
    type: 'input',
    name: 'addRoleName',
    message: 'What is the name of the role?'
  },
  {
    type: 'input',
    name: 'addSalaryAmount',
    message: 'How much is their salary?'
  },
  {
    type: 'list',
    name: 'roleDepartmentChoice',
    message: 'What department does the role belong to?',
    choices: queryDepartmentNames
  },
])
  .then((response) => {
    console.log(response);
    db.promise().query(`INSERT INTO role (role.title)
    VALUES (?)`, response.addRoleName)
    .then( () => {
    db.promise().query(`INSERT INTO role (role.salary)
    VALUES (?)`, response.addSalaryAmount)
    .then( () => { db.promise().query(`INSERT INTO role (role.department_id)
    VALUES (?)`, response.addDepartment)
    .then( () => {
    db.query("SELECT * FROM department",(err, result) => {
        console.table(result);
        mainChoices();
        })
      })
    });
  })
})};

function addDepartments() {
  inquirer
  .prompt([{
    type: 'input',
    name: 'addDepartment',
    message: 'What is the name of the department?'
  }])
  .then((response) => {
    console.log(response);
    db.promise().query(`INSERT INTO department (department.name)
    VALUES (?)`, response.addDepartment)
    .then( () => {
      db.query("SELECT * FROM department",(err, result) => {
        console.table(result);
        mainChoices();
      });
  });
  });
}


function viewAllDepartments() {
  db.promise().query("SELECT * FROM department")
  .then( ([rows,fields]) => {
    console.table(rows);
    mainChoices();
  });
};

function viewAllRoles() {
  db.promise().query("SELECT * FROM role;")
  .then( ([rows,fields]) => {
    console.table(rows);
    mainChoices();
  });
};

function viewAllEmployees() {
  db.promise().query("SELECT * FROM employee;")
  .then( ([rows,fields]) => {
    console.table(rows);
    mainChoices();
  });
};

async function queryDepartmentNames() {
 return await db.promise().query("SELECT name FROM department").then(([rows,fields]) => {
   const departmentArr = []
   for (let i = 0; i < rows.length; i++) {
     const loopResult = rows[i].name;
     const stringResult = loopResult.toString();
     departmentArr.push(stringResult)  
   }
   
   return departmentArr;

 })};


