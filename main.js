const lp_solve = require('lp_solve');

// Define the LP problem
const solver = new lp_solve.LinearProgramSolver();

// Define the objective function (maximize 2x + 3y)
solver.addConstraint([2, 3], 'le', 12);
solver.setObjective([2, 3], true); // true for maximization

// Define the variables (x and y are integers)
solver.setInt(lpsolve.makeArray(2, 0), true);

// Solve the ILP problem
const result = solver.solve();

// Print the result
const resultText = result === lp_solve.RESULT.FEASIBLE ? 'Feasible' : 'Infeasible';
console.log(`Solution status: ${resultText}`);
console.log(`Objective value: ${solver.getObjectiveValue()}`);
console.log(`Solution (x, y): (${solver.getVariable(1)}, ${solver.getVariable(2)})`);
