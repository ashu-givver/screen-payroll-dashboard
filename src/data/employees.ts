import { Employee, PayrollPeriod, PayrollSummary } from '@/types/payroll';
import { generateTagsForEmployee } from '@/lib/tagGenerator';

const generateEmployeeData = () => {
  const departments = ['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'Product', 'Design', 'Customer Success', 'Legal', 'IT', 'Admin'];
  const firstNames = ['Emma', 'James', 'Sarah', 'David', 'Lisa', 'Marcus', 'Sophia', 'Michael', 'Jessica', 'Chris', 'Amanda', 'Daniel', 'Rachel', 'Matthew', 'Jennifer', 'Andrew', 'Ashley', 'Ryan', 'Michelle', 'Kevin', 'Stephanie', 'Brandon', 'Megan', 'Jason', 'Brittany', 'Anthony', 'Nicole', 'Mark', 'Samantha', 'Joshua', 'Elizabeth', 'Steven', 'Kimberly', 'Brian', 'Lauren', 'William', 'Danielle', 'John', 'Amy', 'Jonathan', 'Emily', 'Justin', 'Christina', 'Robert', 'Heather', 'Kyle', 'Angela', 'Charles', 'Catherine', 'Joseph'];
  const lastNames = ['Thompson', 'Rodriguez', 'Chen', 'Wilson', 'Patel', 'Johnson', 'Martinez', 'Brown', 'Davis', 'Miller', 'Garcia', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed'];

  const employees: Employee[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const initials = `${firstName[0]}${lastName[0]}`;
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Base salary ranges by department
    const baseSalaryRanges: Record<string, [number, number]> = {
      'Engineering': [4000, 8000],
      'Sales': [3500, 7000], 
      'Marketing': [3200, 6000],
      'Finance': [4500, 7500],
      'Operations': [3000, 5500],
      'HR': [3500, 6500],
      'Product': [4500, 8500],
      'Design': [3800, 7000],
      'Customer Success': [3200, 5800],
      'Legal': [5000, 9000],
      'IT': [4200, 7800],
      'Admin': [2800, 4500]
    };
    
    const [minSalary, maxSalary] = baseSalaryRanges[department];
    const basePay = Math.floor(Math.random() * (maxSalary - minSalary) + minSalary);
    
    // Random bonus (20% chance)
    const bonus = Math.random() > 0.8 ? Math.floor(Math.random() * 1000) : 0;
    
    // Random commission for Sales/Marketing (30% chance)
    const commission = (department === 'Sales' || department === 'Marketing') && Math.random() > 0.7 
      ? Math.floor(Math.random() * 500) : 0;
    
    // Random overtime (15% chance)  
    const overtime = Math.random() > 0.85 ? Math.floor(Math.random() * 300) : 0;
    
    // Random GIF Flex (10% chance)
    const gifFlex = Math.random() > 0.9 ? Math.floor(Math.random() * 200) : 0;
    
    // Random OnCall for Engineering/IT (25% chance)
    const onCall = (department === 'Engineering' || department === 'IT') && Math.random() > 0.75
      ? Math.floor(Math.random() * 400) : 0;
    
    const totalIncome = basePay + bonus + commission + overtime + gifFlex + onCall;
    
    // Calculate deductions (rough estimate)
    const deductions = Math.floor(totalIncome * 0.25 + Math.random() * 100);
    const takeHomePay = totalIncome - deductions;
    const employerCost = Math.floor(totalIncome * 1.15 + Math.random() * 200);
    
    // Previous month data with some variations
    const prevBasePay = basePay + Math.floor((Math.random() - 0.5) * 200);
    const prevBonus = Math.random() > 0.9 ? Math.floor(Math.random() * 800) : 0;
    const prevCommission = commission > 0 && Math.random() > 0.6 ? Math.floor(Math.random() * 400) : 0;
    const prevOvertime = overtime > 0 && Math.random() > 0.7 ? Math.floor(Math.random() * 250) : 0;
    const prevGifFlex = gifFlex > 0 && Math.random() > 0.8 ? Math.floor(Math.random() * 150) : 0;
    const prevOnCall = onCall > 0 && Math.random() > 0.6 ? Math.floor(Math.random() * 350) : 0;
    const prevTotalIncome = prevBasePay + prevBonus + prevCommission + prevOvertime + prevGifFlex + prevOnCall;
    const prevDeductions = Math.floor(prevTotalIncome * 0.25 + Math.random() * 80);
    const prevTakeHomePay = prevTotalIncome - prevDeductions;
    const prevEmployerCost = Math.floor(prevTotalIncome * 1.15 + Math.random() * 180);
    
    employees.push({
      id: i.toString(),
      name,
      initials,
      basePay,
      bonus,
      commission,
      overtime,
      gifFlex,
      onCall,
      salaryBasis: 'Monthly',
      units: 1,
      rate: basePay,
      totalIncome,
      deductions,
      takeHomePay,
      employerCost,
      status: 'Current',
      department,
      employmentType: 'Full-time',
      paye: Math.floor(deductions * 0.6),
      ni: Math.floor(deductions * 0.25),
      pension: Math.floor(deductions * 0.15),
      studentLoan: 0,
      postgradLoan: 0,
      deductionVariance: Math.floor((Math.random() - 0.5) * 20),
      netPaymentVariance: Math.floor((Math.random() - 0.5) * 20),
      employerNI: Math.floor(employerCost * 0.4),
      employerPension: Math.floor(employerCost * 0.2),
      previousMonth: {
        basePay: prevBasePay,
        bonus: prevBonus,
        commission: prevCommission,
        overtime: prevOvertime,
        gifFlex: prevGifFlex,
        onCall: prevOnCall,
        totalIncome: prevTotalIncome,
        deductions: prevDeductions,
        takeHomePay: prevTakeHomePay,
        employerCost: prevEmployerCost,
        paye: Math.floor(prevDeductions * 0.6),
        ni: Math.floor(prevDeductions * 0.25),
        pension: Math.floor(prevDeductions * 0.15),
        studentLoan: 0,
        postgradLoan: 0,
        employerNI: Math.floor(prevEmployerCost * 0.4),
        employerPension: Math.floor(prevEmployerCost * 0.2)
      }
    });
  }
  
  return employees;
};

export const employees: Employee[] = generateEmployeeData();

// Generate tags for all employees
employees.forEach(employee => {
  employee.tags = generateTagsForEmployee(employee);
});

export const payrollPeriod: PayrollPeriod = {
  month: 'July',
  year: 2025,
  startDate: '1 Jul',
  endDate: '31 Jul 2025',
  status: 'Draft',
  employeeCount: 100,
  companyName: 'Company Name'
};

export const payrollSummary: PayrollSummary = {
  totalIncome: employees.reduce((sum, emp) => sum + emp.totalIncome, 0),
  totalDeductions: employees.reduce((sum, emp) => sum + emp.deductions, 0),
  totalTakeHomePay: employees.reduce((sum, emp) => sum + emp.takeHomePay, 0),
  totalEmployerCost: employees.reduce((sum, emp) => sum + emp.employerCost, 0),
  employeeCount: employees.length
};