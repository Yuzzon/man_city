import React, { Component } from 'react'
import AdminLayout from '../../../Hoc/AdminLayout'
import FormField from '../../ui/formFields'
import { validate } from '../../ui/misc'

import { firebasePlayers, firebaseDB, firebase } from '../../../firebase'
import Fileuploader from '../../ui/fileUploader'
import { CircularProgress } from '@material-ui/core'


class AddEditPlayers extends Component {

    state = {
        isLoading: true,
        playerId: '',
        formType: '',
        formError: false,
        formSuccess: '',
        defaultImg: '',
        formData: {
            name: {
                element: 'input',
                value: '',
                config: {
                    label: 'Player Name',
                    name: 'name_input',
                    type: 'text'
                },
                validation: {
                    required: true
                },
                valid: false,
                validationMessage: '',
                showLabel: true
            },
            lastname: {
                element: 'input',
                value: '',
                config: {
                    label: 'Player Last name',
                    name: 'lastname_input',
                    type: 'text'
                },
                validation: {
                    required: true
                },
                valid: false,
                validationMessage: '',
                showLabel: true
            },
            number: {
                element: 'input',
                value: '',
                config: {
                    label: 'Player Number',
                    name: 'number_input',
                    type: 'text'
                },
                validation: {
                    required: true
                },
                valid: false,
                validationMessage: '',
                showLabel: true
            },
            position: {
                element: 'select',
                value: '',
                config: {
                    label: 'Select a position',
                    name: 'select_position',
                    type: 'select',
                    options: [
                        { key: "Keeper", value: "Keeper" },
                        { key: "Defence", value: "Defence" },
                        { key: "Midfield", value: "Midfield" },
                        { key: "Striker", value: "Striker" }
                    ]
                },
                validation: {
                    required: true
                },
                valid: false,
                validationMessage: '',
                showLabel: true
            },
            image: {
                element: 'image',
                value: '',
                validation: {
                    required: true
                },
                valid: false,

            }
        }
    }

    updateForm(element, content = '') {
        const newFormData = { ...this.state.formData };
        const newElement = { ...newFormData[element.id] };

        if (content === '') {
            newElement.value = element.event.target.value;
        } else {
            newElement.value = content
        }
        let validData = validate(newElement)

        newElement.valid = validData[0];
        newElement.validationMessage = validData[1];

        newFormData[element.id] = newElement;

        this.setState({
            formError: false,
            formData: newFormData
        })
    }

    successForm = (msg) => {
        this.setState({
            formSuccess: msg
        })
        setTimeout(() => {
            this.setState({
                formSuccess: ''
            })
        }, 2000)
    }

    submitForm(event) {
        event.preventDefault();

        let dataToSubmit = {};
        let formIsValid = true;

        for (let key in this.state.formData) {
            dataToSubmit[key] = this.state.formData[key].value;
            formIsValid = this.state.formData[key].valid && formIsValid;
        }

        if (formIsValid) {
            if (this.state.formType === 'Edit player') {
                firebaseDB.ref(`players/${this.state.playerId}`)
                    .update(dataToSubmit).then(() => {
                        this.successForm('Updated successfully')
                    })
                    .catch(e => {
                        this.setState({
                            formError: true
                        })
                    })
            }
            else {
                firebasePlayers.push(dataToSubmit).then(() => {
                    this.props.history.push('/admin_players')
                })
                    .catch(e => {
                        this.setState({
                            formError: true
                        })
                    })
            }
        }
        else {
            this.setState({
                formError: true
            })
        }
    }

    updateFields = (player, playerId, formType, defaultImg) => {
        const newFormData = { ...this.state.formData }

        for (let key in newFormData) {
            newFormData[key].value = player[key];
            newFormData[key].valid = true
        }

        this.setState({
            playerId,
            defaultImg,
            formType,
            formData: newFormData
        })
    }

    componentDidMount() {
        const playerId = this.props.match.params.id;
        if (!playerId) {
            this.setState({
                formType: 'Add Player',
                isLoading: false
            })
        }
        else {
            firebaseDB.ref(`players/${playerId}`).once('value')
                .then(snapshot => {
                    const playerData = snapshot.val();

                    firebase.storage().ref('players')
                        .child(playerData.image).getDownloadURL()
                        .then(url => {
                            this.updateFields(playerData, playerId, 'Edit player', url)
                            this.setState({
                                isLoading: false
                            })
                        })
                        .catch(e => {
                            this.updateFields({
                                ...playerData,
                                image: ''
                            }, playerId, 'Edit player', '')
                        })
                })
        }
    }

    resetImage = () => {
        const newFormData = { ...this.state.formData }
        newFormData['image'].value = '';
        newFormData['image'].valid = false;
        this.setState({
            defaultImg: '',
            formData: newFormData
        })

    }

    storeFilename = (filename) => {
        this.updateForm({ id: 'image' }, filename)
    }

    render() {
        return (
            <AdminLayout>
                <div className="admin_progress">
                    {
                        this.state.isLoading ?
                            <CircularProgress thickness={8} style={{ color: "#98c5e9" }} />
                            : ''
                    }
                </div>
                <div className="editplayers_dialog_wrapper">
                    <h2>{this.state.formType}</h2>
                    <form onSubmit={(event) => this.submitForm(event)}>

                        <Fileuploader
                            dir="players"
                            tag={"Player image"}
                            defaultImg={this.state.defaultImg}
                            defaultImgName={this.state.formData.image.value}
                            resetImage={() => this.resetImage()}
                            filename={(filename) => this.storeFilename(filename)}
                        />

                        <FormField
                            id={'name'}
                            formData={this.state.formData.name}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'lastname'}
                            formData={this.state.formData.lastname}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'number'}
                            formData={this.state.formData.number}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'position'}
                            formData={this.state.formData.position}
                            change={(element) => this.updateForm(element)}
                        />

                        <div className="success_label">{this.state.formSuccess}</div>
                        {this.state.formError ?
                            <div className="error_label">Something is wrong</div>
                            : ''
                        }

                        <div className="admin_submit">
                            <button onClick={(event) => this.submitForm(event)}>
                                {this.state.formType}
                            </button>
                        </div>

                    </form>
                </div>
            </AdminLayout>
        );
    }
}

export default AddEditPlayers;