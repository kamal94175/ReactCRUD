import React from "react";
import ReactDOM from "react-dom";
import { Table, Button, Icon, Confirm, Container } from "semantic-ui-react";
import Formstore from "./Formstore.jsx";
import Navbar from "./Navbar.jsx";


export default class Store extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            StoreList: [],
            isLoaded: false,
            error: null,
            showModal: false,
            showConfirm: false,
            store: {}
        };
        this.addNew = this.addNew.bind(this);
        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.showDelete = this.showDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }
    //Fetching data from Database
    fetchData() {
        this.setState({
            isLoading: true,
            StoreList: []
        })
        fetch('/Store/GetStoreData/')
            .then(response => response.json())
            .then(StoreList => this.setState({
                StoreList: StoreList,
                isLoading: true
            }));
    }
    // Functions for ADD and Edit Modals
    addNew() {
        this.setState({
            store: {}, // Try commenting out this code and see.
            showModal: true
        });
    }

    edit(storeToEdit) {
        this.setState({
            store: storeToEdit,
            showModal: true
        });
    }

    cancel() {
        this.setState({
            showModal: false
        });
    }

    save(storeToSave) {
        const closeModal = () => this.setState({ showModal: false });
        if (storeToSave.Id) {
            this.update(storeToSave, closeModal);
        } else {
            // We didn't have an id so this means we created a new one.
            this.create(storeToSave, closeModal);
        }
    }
    // Adding a new storeomer
    create(storeToCreate, callback) {
        const createstore = JSON.stringify(storeToCreate);

        fetch("/Store/Create/", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: createstore
        }) // We're parsing the response as JSON.
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    this.setState(state => {
                        const newStoreList = [...state.StoreList, bodyAsObject.data];
                        return {
                            StoreList: newStoreList
                        };
                    }, callback);
                } else {
                    this.setState(
                        {
                            error: bodyAsObject.message
                        },
                        callback
                    );
                }
            })
            .catch(error => {
                this.setState(
                    {
                        error: "There was an error communicating with the back-end"
                    },
                    callback
                );
            });
    }
    // Editing storeomer details
    update(storeToUpdate, callback) {

        const editstore = JSON.stringify(storeToUpdate);

        fetch(
            "/Store/Edit/" +
            storeToUpdate.Id,
            {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: editstore
            })

            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    let updatedStoreList = this.state.StoreList.slice();
                    const storeIndex = updatedStoreList.findIndex(
                        store => store.Id === storeToUpdate.Id
                    );
                    updatedStoreList[storeIndex] = storeToUpdate;

                    this.setState(
                        {
                            StoreList: updatedStoreList
                        },
                        callback
                    );
                } else {
                    this.setState(
                        {
                            error: bodyAsObject.message
                        },
                        callback
                    );
                }
            })
            .catch(error => {
                this.setState(
                    {
                        error: "There was an error communicating with the back-end"
                    },
                    callback
                );
            });
    }
    // Functions for Delete Modals
    showDelete(storeToDelete) {
        this.setState({
            showConfirm: true,
            store: storeToDelete
        });
    }

    cancelDelete() {
        this.setState({
            showConfirm: false,
            store: {}
        });
    }

    confirmDelete() {
        this.setState({ showConfirm: false });
        const storeToDelete = this.state.store;
        if (storeToDelete.Id) {
            this.delete(storeToDelete);
        }
    }
    // Deleting the data from database
    delete(storeToDelete) {
        fetch(
            "/Store/Delete/" +
            storeToDelete.Id, {

            })
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    const updatedStoreList = this.state.StoreList.filter(
                        store => store.Id != storeToDelete.Id
                    );

                    // Update the state.
                    this.setState({ StoreList: updatedStoreList });
                } else {
                    this.setState({ error: bodyAsObject.message });
                }
            })
            .catch(error => {
                this.setState({
                    error: "There was an error communicating with the back-end"
                });
            });
    }

    render() {

        return this.state.error ? (
            <div>{this.state.error}</div>
        ) : (
                <Container>
                    <Navbar />
                    <React.Fragment>
                        {this.state.showModal && (
                            <Formstore
                                isOpen={true}
                                store={this.state.store}
                                header={this.state.store.Id ? "Edit" : "Add"}
                                save={this.save}
                                cancel={this.cancel}
                            />
                        )}
                        {this.state.showConfirm && (
                            <Confirm
                                open={true}
                                onCancel={this.cancelDelete}
                                onConfirm={this.confirmDelete}
                            />
                        )}
                        <div className="mt-5">
                            <Button className="ui primary button" onClick={this.addNew}>
                                Add New</Button>
                        </div>
                        <Table striped>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Address</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.StoreList.map(store => (
                                    <Table.Row key={store.Id}>
                                        <Table.Cell>{store.Name}</Table.Cell>
                                        <Table.Cell>{store.Address}</Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui yellow button"
                                                onClick={() => this.edit(store)}>
                                                <i className="edit icon"></i>Edit</Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui red button"
                                                onClick={() => this.showDelete(store)}>
                                                <i className="trash icon"></i>Delete</Button>

                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </React.Fragment>

                </Container>);
    }


}


const rootElement = document.getElementById("Storemain");
ReactDOM.render(<Store />, rootElement);
