import React from "react";
import ReactDOM from "react-dom";
import { Table, Button, Icon, Confirm, Container } from "semantic-ui-react";
import FormCustomer from "./FormCustomer.jsx";
import Navbar from "./Navbar.jsx";


export default class Customer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custList: [],
            isLoaded: false,
            error: null,
            showModal: false,
            showConfirm: false,
            cust: {}
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
            custList: []
        })
        fetch('/Customer/GetCustomerData/')
            .then(response => response.json())
            .then(custList => this.setState({
                custList: custList,
                isLoading: true
            }));
    }
    // Functions for ADD and Edit Modals
    addNew() {
        this.setState({
            cust: {}, // Try commenting out this code and see.
            showModal: true
        });
    }

    edit(custToEdit) {
        this.setState({
            cust: custToEdit,
            showModal: true
        });
    }

    cancel() {
        this.setState({
            showModal: false
        });
    }

    save(custToSave) {
        const closeModal = () => this.setState({ showModal: false });
        if (custToSave.Id) {
            this.update(custToSave, closeModal);
        } else {
            // We didn't have an id so this means we created a new one.
            this.create(custToSave, closeModal);
        }
    }
    // Adding a new Customer
    create(custToCreate, callback) {
        const createcust = JSON.stringify(custToCreate);

        fetch("/Customer/Create/", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: createcust
        }) // We're parsing the response as JSON.
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    this.setState(state => {
                        const newcustList = [...state.custList, bodyAsObject.data];
                        return {
                            custList: newcustList
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
    // Editing Customer details
    update(custToUpdate, callback) {

        const editcust = JSON.stringify(custToUpdate);

        fetch(
            "/Customer/Edit/" +
            custToUpdate.Id,
            {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: editcust
            })

            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    let updatedcustList = this.state.custList.slice();
                    const custIndex = updatedcustList.findIndex(
                        cust => cust.Id === custToUpdate.Id
                    );
                    updatedcustList[custIndex] = custToUpdate;

                    this.setState(
                        {
                            custList: updatedcustList
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
    showDelete(custToDelete) {
        this.setState({
            showConfirm: true,
            cust: custToDelete
        });
    }

    cancelDelete() {
        this.setState({
            showConfirm: false,
            cust: {}
        });
    }

    confirmDelete() {
        this.setState({ showConfirm: false });
        const custToDelete = this.state.cust;
        if (custToDelete.Id) {
            this.delete(custToDelete);
        }
    }
    // Deleting the data from database
    delete(custToDelete) {
        fetch(
            "/Customer/Delete/" +
            custToDelete.Id, {

            })
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    const updatedcustList = this.state.custList.filter(
                        cust => cust.Id != custToDelete.Id
                    );

                    // Update the state.
                    this.setState({ custList: updatedcustList });
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
                            <FormCustomer
                                isOpen={true}
                                cust={this.state.cust}
                                header={this.state.cust.Id ? "Edit" : "Add"}
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
                                {this.state.custList.map(cust => (
                                    <Table.Row key={cust.Id}>
                                        <Table.Cell>{cust.Name}</Table.Cell>
                                        <Table.Cell>{cust.Address}</Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui yellow button"
                                                onClick={() => this.edit(cust)}>
                                                <i className="edit icon"></i>Edit</Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui red button"
                                                onClick={() => this.showDelete(cust)}>
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


const rootElement = document.getElementById("main");
ReactDOM.render(<Customer />, rootElement);
