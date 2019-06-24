import React from "react";
import ReactDOM from "react-dom";
import { Table, Button, Icon, Confirm, Container } from "semantic-ui-react";
import Formproduct from "./Formproduct.jsx";
import Navbar from "./Navbar.jsx";

export default class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proList: [],
            isLoaded: false,
            error: null,
            showModal: false,
            showConfirm: false,
            prod: {}
        };

        this.addNew = this.addNew.bind(this);
        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.showDelete = this.showDelete.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }
    // Fetching the data from database
    componentDidMount() {
        this.fetchData();

    }

    fetchData() {
        this.setState({
            isLoading: true,
            proList: []
        })
        fetch('/Product/GetProductData/')
            .then(response => response.json())
            .then(proList => this.setState({
                proList: proList,
                isLoading: true
            }));
    }
    // functions for modals
    addNew() {
        this.setState({
            prod: {}, // Try commenting out this code and see.
            showModal: true
        });
    }

    edit(prodToEdit) {
        this.setState({
            prod: prodToEdit,
            showModal: true
        });
    }

    cancel() {
        this.setState({
            showModal: false
        });
    }

    save(prodToSave) {
        const closeModal = () => this.setState({ showModal: false });
        if (prodToSave.Id) {
            this.update(prodToSave, closeModal);
        } else {
            // We didn't have an id so this means we created a new one.
            this.create(prodToSave, closeModal);
        }
    }
    // Add new Product
    create(prodToCreate, callback) {
        const createprod = JSON.stringify(prodToCreate);

        fetch("/Product/Create/", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: createprod
        }) // We're parsing the response as JSON.
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    this.setState(state => {
                        const newproList = [...state.proList, bodyAsObject.data];

                        // Update our proList with the result returned from the response.
                        return {
                            proList: newproList
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
    //Edit the product Data
    update(prodToUpdate, callback) {

        const editprod = JSON.stringify(prodToUpdate);

        fetch(
            "/Product/Edit/" +
            prodToUpdate.Id,
            {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: editprod
            })

            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {

                    let updatedproList = this.state.proList.slice();
                    const prodIndex = updatedproList.findIndex(
                        prod => prod.Id === prodToUpdate.Id
                    );
                    updatedproList[prodIndex] = prodToUpdate;

                    this.setState(
                        {
                            proList: updatedproList
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
    //Functions for Delete modals
    showDelete(prodToDelete) {
        this.setState({
            showConfirm: true,
            prod: prodToDelete
        });
    }

    cancelDelete() {
        this.setState({
            showConfirm: false,
            prod: {}
        });
    }

    confirmDelete() {
        this.setState({ showConfirm: false });

        const prodToDelete = this.state.prod;
        if (prodToDelete.Id) {
            this.delete(prodToDelete);
        }
    }
    //Deleting the data from database
    delete(prodToDelete) {
        fetch(
            "/Product/Delete/" +
            prodToDelete.Id, {

            })
            .then(response => response.json())
            .then(bodyAsObject => {
                if (bodyAsObject.success) {
                    const updatedproList = this.state.proList.filter(
                        prod => prod.Id != prodToDelete.Id
                    );

                    // Update the state.
                    this.setState({ proList: updatedproList });
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
                            <Formproduct
                                isOpen={true}
                                prod={this.state.prod}
                                header={this.state.prod.Id ? "Edit" : "Add"}
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
                        <div><Button className="ui primary button" onClick={this.addNew}>Add New</Button></div>
                        
                        <Table striped>
                            
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Price</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                    <Table.HeaderCell>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.proList.map(prod => (
                                    <Table.Row key={prod.Id}>
                                        <Table.Cell>{prod.Name}</Table.Cell>
                                        <Table.Cell>{prod.Price}</Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui yellow button" onClick={() => this.edit(prod)}>
                                                <i className="edit icon"></i>Edit
                                            </Button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button className="ui red button" onClick={() => this.showDelete(prod)}>
                                                <i className="trash icon"></i>Delete
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                            </Table>
                            
                    </React.Fragment>
                </Container>
            );
    }


}
const rootElement = document.getElementById("productmain");
ReactDOM.render(<Product />, rootElement);

