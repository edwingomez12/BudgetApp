import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export class DebtPayoffCalculator extends Component {
    static displayName = DebtPayoffCalculator.name;

    constructor(props) {
        super(props);
        this.state = {
            balance: '',
            totalDebt: '',
            interestRate: '',
            monthlyPayment: '',
            monthsNeeded: null,
            payoffDate: null,
            errors: {}
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.calculateMonths = this.calculateMonths.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            errors: { ...this.state.errors, [name]: '' } // Clear error message on input change
        });
    }

    validateInputs() {
        const { balance, interestRate, monthlyPayment } = this.state;
        const errors = {};
        if (!balance) errors.balance = 'Balance is required.';
        if (!interestRate) errors.interestRate = 'Interest rate is required.';
        if (!monthlyPayment) errors.monthlyPayment = 'Monthly payment is required.';

        this.setState({ errors });
        return Object.keys(errors).length === 0; // Returns true if no errors
    }

    calculateMonths() {
        if (!this.validateInputs()) return;

        const { balance, interestRate, monthlyPayment } = this.state;

        const principal = parseFloat(balance);
        const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
        const payment = parseFloat(monthlyPayment);

        if (payment <= principal * rate) {
            this.setState({ errors: { monthlyPayment: 'Monthly payment must be greater than the interest.' } });
            return;
        }

        let remainingBalance = principal;
        let months = 0;

        while (remainingBalance > 0) {
            remainingBalance = remainingBalance * (1 + rate) - payment;
            months++;
        }

        // Calculate payoff date
        const today = new Date();
        const payoffDate = new Date(today.setMonth(today.getMonth() + months));

        this.setState({ monthsNeeded: months, payoffDate });
    }

    render() {
        const { balance, totalDebt, interestRate, monthlyPayment, monthsNeeded, payoffDate, errors } = this.state;

        return (
            <div className="container mt-5">
                <div className="card shadow-sm p-4">
                    <h3 className="mb-3 text-center">Debt Payoff Calculator</h3>
                    <div className="mb-3">
                        <label htmlFor="balance" className="form-label">Credit Card Balance</label>
                        <input
                            type="number"
                            className={`form-control ${errors.balance ? 'is-invalid' : ''}`}
                            id="balance"
                            name="balance"
                            value={balance}
                            onChange={this.handleInputChange}
                            placeholder="Enter your credit card balance"
                        />
                        {errors.balance && <div className="invalid-feedback">{errors.balance}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="totalDebt" className="form-label">Total Debt</label>
                        <input
                            type="number"
                            className="form-control"
                            id="totalDebt"
                            name="totalDebt"
                            value={totalDebt}
                            onChange={this.handleInputChange}
                            placeholder="Enter your total debt"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="interestRate" className="form-label">Interest Rate (%)</label>
                        <input
                            type="number"
                            className={`form-control ${errors.interestRate ? 'is-invalid' : ''}`}
                            id="interestRate"
                            name="interestRate"
                            value={interestRate}
                            onChange={this.handleInputChange}
                            placeholder="Enter the interest rate (e.g., 15)"
                        />
                        {errors.interestRate && <div className="invalid-feedback">{errors.interestRate}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="monthlyPayment" className="form-label">Monthly Payment</label>
                        <input
                            type="number"
                            className={`form-control ${errors.monthlyPayment ? 'is-invalid' : ''}`}
                            id="monthlyPayment"
                            name="monthlyPayment"
                            value={monthlyPayment}
                            onChange={this.handleInputChange}
                            placeholder="Enter your desired monthly payment"
                        />
                        {errors.monthlyPayment && <div className="invalid-feedback">{errors.monthlyPayment}</div>}
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        onClick={this.calculateMonths}
                        disabled={!balance || !interestRate || !monthlyPayment}
                    >
                        Calculate Months to Pay Off Debt
                    </button>
                </div>

                {monthsNeeded !== null && (
                    <div className="card mt-4 p-4 shadow-sm">
                        <h4 className="text-center">
                            Estimated Months to Pay Off Debt: {monthsNeeded}
                        </h4>
                        <p className="text-center text-muted">
                            With a monthly payment of ${monthlyPayment}, it will take you approximately {monthsNeeded} months to pay off your debt.
                        </p>
                        {payoffDate && (
                            <p className="text-center text-muted">
                                You will be debt-free by: <strong>{payoffDate.toLocaleDateString()}</strong>
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default DebtPayoffCalculator;
