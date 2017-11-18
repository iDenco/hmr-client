import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import FormErrors from '../components/Form/FormErrors/FormErrors'

class Form extends Component {
	constructor(props) {
		super(props)
		this.state = {
			formData: {
				username: '',
				email: '',
				password: ''
			},
			formRules: [
				{
					id: 1,
					field: 'username',
					name: 'Username must be greater than 5 characters.',
					valid: false
				},
				{
					id: 2,
					field: 'email',
					name: 'Email must be greater than 5 characters.',
					valid: false
				},
				{
					id: 3,
					field: 'email',
					name: 'Email must be a valid email address.',
					valid: false
				},
				{
					id: 4,
					field: 'password',
					name: 'Password must be greater than 10 characters.',
					valid: false
				}
			],
			valid: false
		}
		this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this)
	}
	componentDidMount() {
		this.clearForm()
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.formType !== nextProps.formType) {
			this.clearForm()
		}
	}
	clearForm() {
		this.setState({
			formData: { username: '', email: '', password: '' }
		})
	}
	validateForm() {
		this.setState({ valid: true })
	}
	handleFormChange(event) {
		const obj = this.state.formData
		obj[event.target.name] = event.target.value
		this.setState(obj)
		this.validateForm()
	}
	handleUserFormSubmit(event) {
		event.preventDefault()
		const formType = this.props.formType
		let data
		if (formType === 'login') {
			data = {
				email: this.state.formData.email,
				password: this.state.formData.password
			}
		}
		if (formType === 'register') {
			data = {
				username: this.state.formData.username,
				email: this.state.formData.email,
				password: this.state.formData.password
			}
		}
		const url = `${process.env.REACT_APP_PAYROLL_SERVICE_URL}/api/auth/${formType}`
		axios
			.post(url, data)
			.then(res => {
				this.clearForm()
				this.props.loginUser(res.data.auth_token)
			})
			.catch(err => {
				console.log(err)
			})
	}
	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />
		}
		return (
			<div>
				<h1 style={{ textTransform: 'capitalize' }}>{this.props.formType}</h1>
				<hr />
				<br />
				<FormErrors formType={this.props.formType} formRules={this.state.formRules} />
				<form onSubmit={event => this.handleUserFormSubmit(event)}>
					{this.props.formType === 'register' && (
						<div className="form-group">
							<input
								name="username"
								className="form-control input-lg"
								type="text"
								placeholder="Enter a username"
								required
								value={this.state.formData.username}
								onChange={this.handleFormChange.bind(this)}
							/>
						</div>
					)}
					<div className="form-group">
						<input
							name="email"
							className="form-control input-lg"
							type="email"
							placeholder="Enter an email address"
							required
							value={this.state.formData.email}
							onChange={this.handleFormChange.bind(this)}
						/>
					</div>
					<div className="form-group">
						<input
							name="password"
							className="form-control input-lg"
							type="password"
							placeholder="Enter a password"
							required
							value={this.state.formData.password}
							onChange={this.handleFormChange.bind(this)}
						/>
					</div>
					<input
						type="submit"
						className="btn btn-primary btn-lg btn-block"
						value="Submit"
						disabled={!this.state.valid}
					/>
				</form>
			</div>
		)
	}
}

export default Form
