import React, { Component } from 'react';
const bus = require('../lib/eventService');

class CardEditor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showForm: false,		// No card to edit until user clicks one
			...this.props.card,
			isArchived: false
		};

		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleIsArchived = this.handleIsArchived.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.cancelIfClickOutside = this.cancelIfClickOutside.bind(this);
	}

	componentDidMount() {
		bus.on('editCard', this.editCard.bind(this));
		bus.on('globalCancel', this.handleCancel.bind(this));
	}

	editCard(cardSummary) {
		const self = this;
		fetch('http://localhost:3001/api/cards/' + cardSummary.id).then((response) => {
			response.json().then((json) => {
				if (null === json.description) {
					json.description = '';
				}
				self.setState({showForm: true, ...json});
			})
		}).catch(function (err) {
			console.error(err)
			alert('Sorry, something went wrong\n\n' + err)  // TODO: Improve
		})
	}

	render() {
		console.log('CardEditor:render', this.state);
		if (this.state.showForm) {
			return (
				<div className="zen-modal zen-card-editor" onClick={this.cancelIfClickOutside}>
					<div className="zmo-content" onKeyUp={this.handleKeyPress}>
						<div className="zfo-title">
							<input type="text" name="title" value={this.state.title} onChange={this.handleValueChange} />
						</div>
						<div className="zfo-description"><textarea name="description" value={this.state.description} onChange={this.handleValueChange}></textarea></div>
						<div className="zfo-buttons">
							<input type="button" className="zfo-button zfo-cancel" value="Cancel" title="[Esc]" onClick={this.handleCancel} />
							<span className="zfo-archive">Archive <input type="checkbox" name="archive" onChange={this.handleIsArchived} /></span>
							<input type="button" className="zfo-button zfo-save" value="Save" title="[CMD + Enter]" onClick={this.handleSave} />
						</div>
					</div>
				</div>
			)
		} else {
			return null;
		}
	}

	cancelIfClickOutside(event) {
		if (event.target.classList.contains('zen-card-editor')) {
			this.handleCancel(event);
		}
	}

	handleValueChange(event) {
		console.log('handleValueChange');
		this.setState({[event.target.name]: event.target.value})
		event.preventDefault();
	}

	handleIsArchived(event) {
		// TODO: Handle checkbox
		this.setState({isArchived: event.target.value});
	}

	handleSave(event) {
		console.log('About to save card...', this.state)

		this.setState({timestamp: new Date().getTime()});

		// XXX: Validate id is integer
		fetch('http://localhost:3001/api/cards/save', {
			method: 'post',
			headers: new Headers({'Content-Type': 'application/json'}),
			body: JSON.stringify(this.state)

		}).then((response) => {
			// REFACTOR: Extract function
			if (response.ok) {
				console.log('Card saved')
				// Hide card editor
				this.setState({showForm: false});
			} else {
				throw Error(response.statusText)  // Trigger catch
			}
		}).catch(err => alert('Sorry, something went wrong\n\n' + err))
	}

	handleCancel(event) {
		console.log('handleCancel', event.target.classList);
		this.setState({showForm: false});
	}

	handleKeyPress(event) {
		const ESC_CODE = 27;
		if (event.keyCode === ESC_CODE) {
			this.setState({showForm: false});
		}
	}

}

export default CardEditor;